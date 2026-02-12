"""
Preenche o modelo Excel (Cobertura Premium) com os dados recebidos
e exporta para PDF usando o Microsoft Excel (xlwings).

Os campos são localizados por BUSCA no Excel (texto exato), não por posição fixa,
para que o modelo possa variar de layout.

Requisitos para rodar este script: Python 3, Microsoft Excel (Windows), pip install xlwings
Para o usuário final: use o .exe gerado por PyInstaller (não precisa instalar Python).

Uso:
  fill_and_export_pdf.exe --template "modelo.xlsx" --data "dados.json" --output "saida.pdf"
  ou: python fill_and_export_pdf.py --template ... --data ... --output ...
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path

# Log provisório: arquivo em %TEMP% para inspeção após gerar o PDF
LOG_PATH = Path(os.environ.get("TEMP", os.path.expanduser("~"))) / "cobertura_pdf_export_log.txt"


def _log(msg: str) -> None:
    line = f"[PDF Export] {msg}\n"
    sys.stderr.write(line)
    try:
        with open(LOG_PATH, "a", encoding="utf-8") as f:
            f.write(line)
    except Exception:
        pass

# Constantes para busca no Excel: texto a localizar -> chave no JSON
# Substitui o conteúdo INTEIRO da célula pelo valor formatado (ex.: valor monetário)
# (custoDeslocamento não é mais escrito em célula; permanece apenas no cálculo do Valor Total)
FIELD_SEARCH = {}

# Placeholders: substituir apenas o texto do placeholder DENTRO do texto da célula.
# Ex.: célula "A cobertura é [Tipo de Cobertura]" -> "[Tipo de Cobertura]" vira "ACM", resultado "A cobertura é ACM"
FIELD_PLACEHOLDER_REPLACE = {
    "[Tipo de Cobertura]": "tipoCobertura",
    "[Medida do Pilar]": "medidaPilar",
    "[Telha Térmica]": "telhaTermica",
    "[Forro PVC]": "forroPvc",
    # Cliente (nomeCliente, cpfCnpj, endereco, celularFone, cidade; dataAtual definida na geração)
    "[Nome do Cliente]": "nomeCliente",
    "[CPF/CPNJ]": "cpfCnpj",
    "[Endereço]": "endereco",
    "[Celular/Fone]": "celularFone",
    "[Data Atual]": "dataAtual",
    "[Cidade]": "cidade",
    "[Valor p/ Forma de Pagamento]": "valorFormaPagamento",
}

# Campos que recebem o valor parcelado em 10x (total + 10%); todas as células com esse texto são preenchidas
FIELD_TOTAL_LABEL = "[Valor Total]"

# Célula fixa que recebe o texto de especificação (sempre D43, primeira planilha)
D43_CELL = "D43"

# Template do texto de especificação. Placeholders: [Medidas da Cobertura], [Tipo de Cobertura], [Pintura da Cobertura], [Espessura da Telha Térmica], [Tipo do Forro].
# Regra Item 3 (situacional): se temPilar != "Sim", remove o bloco "Item 3: Pilar metálico..." e renumera 4->3, 5->4, 6->5, 7->6.
TEXTO_ESPECIFICACAO_TEMPLATE = """Cobertura Premium medidas [Medidas da Cobertura]

Item 1: Treliça metálica com 40 cm de altura. 
Detalhamento de fabricação: Banzos superior e inferior em perfil U simples 75x40 #14, montantes e diagonais em perfil U simples 68x30 #14. A treliça contorna toda estrutura sendo o objeto principal de estruturação da cobertura.

Item 2: Revestimento das treliças em [Tipo de Cobertura] [Pintura da Cobertura].

Item 3: Pilar metálico de 100x100 #14.

Item 4: Vigas metálicas e terças metálicas em metalon 50 x 50 #18. Esse item está locado na parte interna da cobertura para receber telhas térmicas e calha.

Item 5: Telha térmica EPS de [Espessura da Telha Térmica] com acabamento em filme para dar resistência na instalação e não ocorrer o desplacamento do EPS.

Item 6: Calhas e rufos galvanizados afim de garantir a vedação por completo do telhado e escoamento da água.

Item 7: Forro PVC [Tipo do Forro] amadeirado nivelado na parte de baixo da cobertura."""

# Mapeamento placeholder -> chave no JSON para o texto de D43
D43_PLACEHOLDERS = {
    "[Medidas da Cobertura]": "medidas",
    "[Tipo de Cobertura]": "tipoCobertura",
    "[Pintura da Cobertura]": "corOuPintura",
    "[Espessura da Telha Térmica]": "telhaTermica",
    "[Tipo do Forro]": "forroPvc",
}

# Bloco do Item 3 (pilar); removido quando temPilar != "Sim". \n explícitos para garantir match.
ITEM_3_BLOCO = "\n\nItem 3: Pilar metálico de 100x100 #14.\n\n"


def build_texto_especificacao_d43(data: dict) -> str:
    """
    Monta o texto de especificação com placeholders substituídos.
    Aplica a regra do Item 3: se não tiver pilar, remove o bloco do Item 3 e renumera 4->3, 5->4, 6->5, 7->6.
    """
    text = TEXTO_ESPECIFICACAO_TEMPLATE
    for placeholder, json_key in D43_PLACEHOLDERS.items():
        value = data.get(json_key) or ""
        text = text.replace(placeholder, str(value))

    tem_pilar = (data.get("temPilar") or "").strip() == "Sim"
    if not tem_pilar:
        # Remove só a linha do pilar, mantendo \n\n entre Item 2 e o que vira Item 3 (evita "Preto.Item 4:" grudado)
        bloco_completo = "\n\nItem 3: Pilar metálico de 100x100 #14.\n\n"
        substitui_por = "\n\n"  # preserva parágrafo entre Item 2 e Item 3
        if bloco_completo in text:
            text = text.replace(bloco_completo, substitui_por)
        else:
            text = text.replace("\n\nItem 3: Pilar metálico de 100x100 #14.\n\n", substitui_por)
        # Renumera em uma única passada: Item 4->3, 5->4, 6->5, 7->6
        def _renum(match):
            n = int(match.group(1))
            return "\nItem {}:".format(n - 1)
        text = re.sub(r"\nItem ([4-7]):", _renum, text)

    return text


def format_currency(raw: str) -> str:
    """Converte dígitos (ex: '150000') em 'R$ 1.500,00'."""
    digits = "".join(c for c in (raw or "") if c.isdigit())
    if not digits:
        return "R$ 0,00"
    cents = digits[-2:].rjust(2, "0")
    int_part = digits[:-2] or "0"
    if len(int_part) > 3:
        parts = []
        while int_part:
            parts.append(int_part[-3:])
            int_part = int_part[:-3]
        int_part = ".".join(reversed(parts))
    return f"R$ {int_part},{cents}"


def raw_to_reais(raw: str) -> float:
    """Converte string de dígitos (centavos) em valor em reais. Ex: '150000' -> 1500.00"""
    digits = "".join(c for c in (raw or "") if c.isdigit())
    if not digits:
        return 0.0
    return int(digits) / 100.0


def parse_medidas_m2(medidas: str) -> float:
    """Extrai as duas dimensões de '5,00m x 2,00m' e retorna m² (ex: 5 * 2 = 10.0)."""
    s = (medidas or "").strip()
    # Aceita "5,00m x 2,00m" ou "5.00 x 2.00" (opcional: m ou m² entre número e x)
    m = re.search(r"(\d+[,.]?\d*)\s*m?\s*[xX×]\s*(\d+[,.]?\d*)\s*m?", s, re.IGNORECASE)
    if not m:
        return 0.0
    a = float(m.group(1).replace(",", "."))
    b = float(m.group(2).replace(",", "."))
    return round(a * b, 2)


# Valor por m² do forro vinílico (R$), somado ao total quando Forro PVC = Vinílico
FORRO_VINILICO_VALOR_M2 = 120.0

# Acréscimos cartão: 5x = +6%, 10x = +10%
CARTAO_5X_ACRECIMO = 0.06
CARTAO_10X_ACRECIMO = 0.10


def get_valor_total_reais(data: dict) -> float:
    """
    Retorna o valor total em reais (float) com a mesma lógica de compute_valor_total.
    Usado para calcular o texto da forma de pagamento.
    """
    medidas_str = data.get("medidas") or ""
    valor_m2_raw = data.get("valorM2") or ""
    valor_pilar_raw = (data.get("valorPilar") or "") if data.get("temPilar") == "Sim" else ""
    custo_raw = data.get("custoDeslocamento") or ""
    forro_pvc = (data.get("forroPvc") or "").strip()

    m2 = parse_medidas_m2(medidas_str)
    valor_m2_reais = raw_to_reais(valor_m2_raw)
    valor_pilar_reais = raw_to_reais(valor_pilar_raw)
    custo_reais = raw_to_reais(custo_raw)

    parte_area = m2 * valor_m2_reais
    total_reais = parte_area + valor_pilar_reais + custo_reais

    if forro_pvc == "Vinílico":
        total_reais += FORRO_VINILICO_VALOR_M2 * m2

    return round(total_reais, 2)


def build_texto_forma_pagamento(total_a_vista_reais: float) -> str:
    """
    Monta o texto para [Valor p/ Forma de Pagamento]:
    "5x de R$ X,XX, 10x de R$ Y,YY ou R$ Z,ZZ A Vista"
    - 5x: total * 1.06 / 5
    - 10x: total * 1.10 / 10
    - À vista: total
    """
    total_5x = total_a_vista_reais * (1 + CARTAO_5X_ACRECIMO)
    total_10x = total_a_vista_reais * (1 + CARTAO_10X_ACRECIMO)
    parcela_5x = total_5x / 5
    parcela_10x = total_10x / 10

    s_avista = format_currency(str(int(round(total_a_vista_reais * 100))))
    s_5x = format_currency(str(int(round(parcela_5x * 100))))
    s_10x = format_currency(str(int(round(parcela_10x * 100))))

    return f"5x de {s_5x}, 10x de {s_10x} ou {s_avista} A Vista"


def compute_valor_total(data: dict) -> str:
    """
    Fórmula: Valor Total = (m² × valor por m²) + valor do pilar + custo de deslocamento.
    Se Forro PVC = Vinílico: soma também (120 * m²) ao total.
    Valores no JSON vêm em centavos (ex: "150000" = R$ 1.500,00).
    Retorna string formatada (ex: 'R$ 16.500,00').
    """
    medidas_str = data.get("medidas") or ""
    valor_m2_raw = data.get("valorM2") or ""
    valor_pilar_raw = (data.get("valorPilar") or "") if data.get("temPilar") == "Sim" else ""
    custo_raw = data.get("custoDeslocamento") or ""
    forro_pvc = (data.get("forroPvc") or "").strip()

    m2 = parse_medidas_m2(medidas_str)
    valor_m2_reais = raw_to_reais(valor_m2_raw)
    valor_pilar_reais = raw_to_reais(valor_pilar_raw)
    custo_reais = raw_to_reais(custo_raw)

    # Cálculo explícito: (m² * valor/m²) + pilar + deslocamento
    parte_area = m2 * valor_m2_reais
    total_reais = parte_area + valor_pilar_reais + custo_reais

    # Forro Vinílico: soma 120 * m² ao total
    if forro_pvc == "Vinílico":
        valor_forro_vinilico = FORRO_VINILICO_VALOR_M2 * m2
        total_reais += valor_forro_vinilico
        _log(f"Forro Vinílico: 120 * m² = {valor_forro_vinilico} | total_reais após forro = {total_reais}")

    total_cents = int(round(total_reais * 100))
    resultado_formatado = format_currency(str(total_cents))

    _log(
        f"compute_valor_total: m2={m2} | valor_m2_reais={valor_m2_reais} | "
        f"pilar_reais={valor_pilar_reais} | custo_reais={custo_reais} | "
        f"parte_area(m2*valor_m2)={parte_area} | total_reais={total_reais} | "
        f"total_cents={total_cents} -> '{resultado_formatado}'"
    )
    return resultado_formatado


def find_cell_by_text(wb, text: str):
    """
    Localiza a primeira célula que CONTÉM o texto indicado (busca em todas as planilhas).
    Retorna (sheet, endereço) ou (None, None) se não encontrar.
    """
    xlValues = -4163
    xlFormulas = -4123
    xlPart = 2

    for sheet in wb.sheets:
        for look_in in (xlValues, xlFormulas):
            try:
                found = sheet.api.Cells.Find(
                    What=text,
                    After=sheet.api.Cells(1, 1),
                    LookAt=xlPart,
                    LookIn=look_in,
                    SearchOrder=1,
                    SearchDirection=1,
                    MatchCase=False,
                )
                if found is not None:
                    addr = found.Address
                    if addr:
                        return (sheet, addr)
            except Exception:
                continue
    return (None, None)


def find_all_cells_by_text(wb, text: str):
    """
    Localiza TODAS as células que contêm o texto (em todas as planilhas).
    Usa Find + FindNext. Retorna lista de (sheet, endereço).
    """
    xlValues = -4163
    xlFormulas = -4123
    xlPart = 2
    results = []
    seen = set()  # (sheet_name, address) para não duplicar

    for sheet in wb.sheets:
        for look_in in (xlValues, xlFormulas):
            try:
                found = sheet.api.Cells.Find(
                    What=text,
                    After=sheet.api.Cells(1, 1),
                    LookAt=xlPart,
                    LookIn=look_in,
                    SearchOrder=1,
                    SearchDirection=1,
                    MatchCase=False,
                )
                if found is None:
                    continue
                first_addr = found.Address
                while found is not None:
                    addr = found.Address
                    key = (sheet.name, addr)
                    if key not in seen:
                        seen.add(key)
                        results.append((sheet, addr))
                    found = sheet.api.Cells.FindNext(found)
                    if found is None:
                        break
                    if found.Address == first_addr:
                        break
            except Exception:
                continue
    return results


def main() -> int:
    parser = argparse.ArgumentParser(description="Preenche Excel e exporta para PDF.")
    parser.add_argument("--template", required=True, help="Caminho do arquivo .xlsx modelo")
    parser.add_argument("--data", required=True, help="Caminho do arquivo .json com os dados")
    parser.add_argument("--output", required=True, help="Caminho do arquivo .pdf de saída")
    args = parser.parse_args()

    template_path = Path(args.template)
    data_path = Path(args.data)
    output_path = Path(args.output)

    if not template_path.exists():
        print(f"Erro: modelo não encontrado: {template_path}", file=sys.stderr)
        return 1
    if not data_path.exists():
        print(f"Erro: arquivo de dados não encontrado: {data_path}", file=sys.stderr)
        return 1

    with open(data_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Data atual = momento da geração do PDF; formato brasileiro dd/mm/yyyy (dia/mês/ano)
    _hoje = datetime.now()
    data["dataAtual"] = f"{_hoje.day:02d}/{_hoje.month:02d}/{_hoje.year}"

    # Valor p/ Forma de Pagamento: 5x (+6%), 10x (+10%) ou à vista (sempre preenchido)
    data["valorFormaPagamento"] = build_texto_forma_pagamento(get_valor_total_reais(data))

    # Limpar log anterior para esta execução
    try:
        if LOG_PATH.exists():
            LOG_PATH.write_text("", encoding="utf-8")
    except Exception:
        pass

    _log(f"Dados recebidos (JSON): {json.dumps(data, ensure_ascii=False)}")
    _log(f"Campo 'custoDeslocamento' (bruto): {repr(data.get('custoDeslocamento'))}")

    try:
        import xlwings as xw
    except ImportError:
        print("Erro: xlwings não instalado. Execute: pip install xlwings", file=sys.stderr)
        return 1

    app = None
    try:
        app = xw.App(visible=False)
        wb = app.books.open(str(template_path.resolve()))

        for excel_text, json_key in FIELD_SEARCH.items():
            _log(f"Procurando no Excel (todas as planilhas) texto contendo: '{excel_text}' (campo JSON: '{json_key}')")
            sheet, address = find_cell_by_text(wb, excel_text)
            if sheet is None or address is None:
                _log(f"AVISO: campo '{excel_text}' NÃO encontrado em nenhuma planilha.")
                print(f"Aviso: campo '{excel_text}' não encontrado no Excel.", file=sys.stderr)
                continue
            _log(f"Célula encontrada: planilha '{sheet.name}', endereço {address}")
            raw = data.get(json_key, "")
            value = format_currency(raw) if raw else "R$ 0,00"
            _log(f"Valor a preencher: bruto={repr(raw)} -> formatado='{value}'")
            cell = sheet.range(address)
            cell.value = value
            _log(f"Valor escrito na célula {address}.")
            try:
                cell.number_format = "R$ #.##0,00"
                _log("Formato de número aplicado.")
            except Exception as fmt_err:
                _log(f"Formato de número não aplicado: {fmt_err}")

        # Placeholders: substituir apenas o placeholder dentro do texto da célula (resto do texto permanece)
        for placeholder_text, json_key in FIELD_PLACEHOLDER_REPLACE.items():
            _log(f"Procurando placeholder no texto da célula: '{placeholder_text}' (campo JSON: '{json_key}')")
            sheet, address = find_cell_by_text(wb, placeholder_text)
            if sheet is None or address is None:
                _log(f"AVISO: placeholder '{placeholder_text}' NÃO encontrado em nenhuma planilha.")
                print(f"Aviso: placeholder '{placeholder_text}' não encontrado no Excel.", file=sys.stderr)
                continue
            _log(f"Célula encontrada: planilha '{sheet.name}', endereço {address}")
            cell = sheet.range(address)
            current = cell.value
            if current is None:
                current = ""
            current_str = str(current)
            value = data.get(json_key, "")
            if value is None:
                value = ""
            value_str = str(value)
            new_text = current_str.replace(placeholder_text, value_str)
            # Célula de data: forçar formato Texto para o Excel não reinterpretar dd/mm/yyyy como mm/dd/yyyy
            if json_key == "dataAtual":
                try:
                    cell.number_format = "@"
                except Exception:
                    pass
            cell.value = new_text
            _log(f"Placeholder substituído: '{placeholder_text}' -> '{value_str}'; célula agora: '{new_text}'")

        # Valor nas 3 células "[Valor Total]": usar valor parcelado em 10x (total à vista + 10%), não à vista
        total_a_vista_reais = get_valor_total_reais(data)
        valor_10x_reais = total_a_vista_reais * (1 + CARTAO_10X_ACRECIMO)
        valor_10x_cents = int(round(valor_10x_reais * 100))
        valor_10x_str = format_currency(str(valor_10x_cents))
        _log(f"Valor em 10x (para células [Valor Total]): total à vista={total_a_vista_reais} -> 10x = '{valor_10x_str}'")
        total_cells = find_all_cells_by_text(wb, FIELD_TOTAL_LABEL)
        _log(f"Células com '{FIELD_TOTAL_LABEL}': {len(total_cells)} encontrada(s)")
        for sheet, address in total_cells:
            cell = sheet.range(address)
            cell.value = valor_10x_str
            try:
                cell.number_format = "R$ #.##0,00"
            except Exception:
                pass
            _log(f"  Preenchido: planilha '{sheet.name}', {address}")

        # Texto de especificação na célula D43 (primeira planilha), com placeholders substituídos e regra do Item 3
        texto_d43 = build_texto_especificacao_d43(data)
        # No Windows o Excel reconhece \r\n para quebra de linha na célula; só \n pode não exibir
        texto_d43_excel = texto_d43.replace("\n", "\r\n")
        sheet_d43 = wb.sheets[0]
        cell_d43 = sheet_d43.range(D43_CELL)
        cell_d43.value = texto_d43_excel
        try:
            cell_d43.api.WrapText = True
        except Exception:
            pass
        # Negrito via API de caracteres do xlwings (slice 0-based), mais confiável que .api.Characters no Windows
        try:
            if texto_d43_excel.startswith("Cobertura Premium"):
                cell_d43.characters[0:18].font.bold = True
            for m in re.finditer(r"Item \d+:", texto_d43_excel):
                cell_d43.characters[m.start() : m.end()].font.bold = True
            _log("Negrito aplicado a 'Cobertura Premium' e aos 'Item N:' na célula D43.")
        except Exception as fmt_err:
            _log(f"Negrito D43 não aplicado (ignorado): {fmt_err}")
        _log(f"Célula {D43_CELL} preenchida com texto de especificação (planilha '{sheet_d43.name}').")

        output_path.parent.mkdir(parents=True, exist_ok=True)
        pdf_path = os.path.abspath(str(output_path.resolve()))
        _log(f"Exportando para PDF: {pdf_path}")
        wb.api.ExportAsFixedFormat(0, pdf_path)  # 0 = xlTypePDF
        wb.close()
        _log(f"PDF gerado com sucesso. Log completo em: {LOG_PATH}")
        return 0
    except Exception as e:
        _log(f"Erro: {e}")
        print(f"Erro ao gerar PDF: {e}", file=sys.stderr)
        return 1
    finally:
        if app:
            app.quit()


if __name__ == "__main__":
    sys.exit(main())
