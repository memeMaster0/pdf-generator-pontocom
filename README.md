# Cobertura Premium

Aplicativo desktop para orçamento de Cobertura Premium (Electron + React + TypeScript). Interface dark com acento em amarelo.

## Requisitos

- **Node.js** (versão LTS recomendada, ex.: 20.x ou 22.x) — necessário para instalar dependências e rodar o projeto.
- **Para gerar PDF** (usuário final): **Microsoft Excel** instalado no Windows. O gerador de PDF é um .exe incluído no app — **não é necessário instalar Python** no PC do usuário.

## Instalação do Node.js no Windows

1. Acesse o site oficial: **[https://nodejs.org](https://nodejs.org)**  
2. Baixe a versão **LTS** (recomendada para a maioria dos usuários).  
3. Execute o instalador (`.msi`) e siga as etapas.  
   - Marque a opção **"Automatically install the necessary tools"** se aparecer (inclui ferramentas úteis).  
   - Reinicie o terminal (ou o computador) após a instalação.  
4. Confirme a instalação abrindo um novo **PowerShell** ou **Prompt de Comando** e digitando:

   ```bash
   node -v
   npm -v
   ```

   Deve aparecer a versão do Node (ex.: `v20.10.0`) e do npm (ex.: `10.2.0`).

## Geração de PDF (sem instalar Python no PC do usuário)

O app usa um **.exe empacotado** que preenche o Excel e exporta para PDF. O usuário **não precisa instalar Python**.

- **No PC do usuário**: basta ter **Microsoft Excel** instalado (Windows). O instalador do app já inclui o gerador (`fill_and_export_pdf.exe`).
- **Campos no Excel**: o modelo usa **placeholders** que são substituídos pelo script (ex.: `[Nome do Cliente]`, `[Data Atual]`, `[Valor Total]`, `[Valor p/ Forma de Pagamento]`). A lista completa e o mapeamento estão em `pdf_export/fill_and_export_pdf.py` (`FIELD_PLACEHOLDER_REPLACE` e demais constantes).
- **Modelo**: o arquivo **`PROPOSTA  - COBERTURA PREMIUM.xlsx`** deve estar na pasta **`resources/`** do projeto (e é copiado para o instalador).

### Para quem for gerar o instalador (.exe do app)

É necessário ter **Python** instalado na máquina (só para gerar o instalador). Um único comando faz tudo:

```bash
npm run electron:build:win
```

Ele executa, em sequência: geração do ícone (`build/icon.ico`), build do gerador de PDF (`pdf_export/build_exe.bat` → `pdf_export/dist/fill_and_export_pdf.exe`), compilação do Electron e do frontend, e empacotamento com electron-builder. O instalador e o .exe portátil saem em `release/`.

Quem **instalar** o app não precisa ter Python — só o **Microsoft Excel** (para o gerador exportar o PDF).

## Rodar o projeto

Depois de instalar o Node.js:

1. Abra o terminal na pasta do projeto (`pdf_generator`).

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Para **desenvolvimento** (abrir o app em modo dev):

   ```bash
   npm run electron:dev
   ```

   O aplicativo Electron abrirá e a interface será carregada a partir do Vite (hot reload).

4. Para **gerar o instalador/.exe** (Windows):

   ```bash
   npm run electron:build:win
   ```

   O instalador e o executável portátil ficarão na pasta `release/`.

## Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run electron:dev` | Sobe o app Electron em modo desenvolvimento (Vite + hot reload) |
| `npm run electron:build:win` | Gera o instalador e o .exe portátil para Windows (ícones + PDF .exe + build) |
| `npm run build` | Apenas build do frontend (TypeScript + Vite) |
| `npm run dev` | Apenas servidor Vite (sem Electron) |
| `npm run preview` | Preview do build do frontend |
| `npm run build:icons` | Gera `build/icon.ico` a partir de `public/icon.svg` |

## Estrutura do projeto

- **config/** — configurações de build (Vite, TypeScript, Tailwind, PostCSS).
- **docs/** — documentação (`ORGANIZATION.md`, `VERIFICACAO.md`).
- **electron/**, **src/**, **pdf_export/**, **public/**, **resources/**, **scripts/** — código e recursos.
- Na raiz ficam apenas `package.json`, `index.html`, `README.md`, `.gitignore` e um `tsconfig.json` que aponta para `config/`.
- Pastas geradas (`node_modules`, `dist`, `build`, `release`, etc.) ficam ocultas no Explorer (ver `.vscode/settings.json`).

## Fluxo das telas

1. **Home** — Botões: Cobertura Premium (ativo), Pergolado (em breve), Porta (inativo).
2. **Cobertura Premium** — Seleção em 3 passos (Tipo → Tem Pilar → Cor/Pintura), depois formulário (medidas, valor/m², pilar, deslocamento).
3. **Informações do Cliente** — Nome, CPF/CNPJ, endereço, cidade, celular/fone (formatados e validados).
4. **Resumo** — Carrossel com resumo do orçamento e do cliente; botão **"Gerar PDF"** abre o diálogo para salvar e chama o gerador (.exe ou script Python em dev), que preenche o modelo Excel pelos placeholders e exporta para PDF via Excel.
