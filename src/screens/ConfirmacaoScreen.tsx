import { useState } from 'react';
import type { CoberturaFormData } from '../context/CoberturaContext';
import type { PergoladoFormData } from '../context/PergoladoContext';
import type { TipoOrcamento } from '../App';
import type { ClienteFormData } from './ClienteScreen';
import { ResumoCarousel } from '../components/ResumoCarousel';
import { capitalize } from '../utils/formatadores';

interface ConfirmacaoScreenProps {
  data: CoberturaFormData | PergoladoFormData;
  tipoOrcamento: TipoOrcamento;
  clienteData: ClienteFormData;
  onBack: () => void;
}

function formatCurrency(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return 'R$ 0,00';
  const cents = digits.slice(-2);
  const intPart = digits.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${intPart || '0'},${cents.padStart(2, '0')}`;
}

function CampoResumo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}

function SlideOrcamentoCobertura({ data }: { data: CoberturaFormData }) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-4">
        Orçamento
      </h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <CampoResumo label="Tipo de Cobertura" value={data.tipoCobertura} />
        <CampoResumo label="Tem Pilar" value={data.temPilar} />
        <CampoResumo label="Cor / Pintura" value={data.corOuPintura} />
        <CampoResumo label="Telha Térmica" value={data.telhaTermica} />
        <CampoResumo label="Forro PVC" value={data.forroPvc} />
        <CampoResumo label="Medidas da cobertura" value={data.medidas || '—'} />
        <CampoResumo label="Valor por m²" value={formatCurrency(data.valorM2)} />
        {data.temPilar === 'Sim' && (
          <>
            <CampoResumo label="Valor do Pilar" value={formatCurrency(data.valorPilar ?? '')} />
            <CampoResumo label="Medida do Pilar" value={data.medidaPilar || '—'} />
          </>
        )}
        <CampoResumo label="Custo de Deslocamento" value={formatCurrency(data.custoDeslocamento)} />
      </div>
    </div>
  );
}

function SlideOrcamentoPergolado({ data }: { data: PergoladoFormData }) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-4">
        Orçamento
      </h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <CampoResumo label="Tipo do Policarbonato" value={data.tipoPolicarbonato} />
        <CampoResumo label="Cor" value={data.corPolicarbonato} />
        <CampoResumo label="Medidas do Pergolado" value={data.medidas || '—'} />
        <CampoResumo label="Dimensão do Tubo" value={data.dimensaoTubo} />
        {data.valorM2 !== undefined && data.valorM2 !== '' && (
          <CampoResumo label="Valor por m²" value={formatCurrency(data.valorM2)} />
        )}
      </div>
    </div>
  );
}

function SlideCliente({ data }: { data: ClienteFormData }) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-4">
        Cliente
      </h3>
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <CampoResumo label="Nome" value={capitalize(data.nome)} />
        <CampoResumo label="Cidade" value={capitalize(data.cidade)} />
        <CampoResumo label="CPF/CNPJ" value={data.cpfCnpj} />
        <CampoResumo label="Celular/Fone" value={data.celularFone} />
        <div className="col-span-2">
          <CampoResumo label="Endereço" value={data.endereco} />
        </div>
      </div>
    </div>
  );
}

export function ConfirmacaoScreen({ data, tipoOrcamento, clienteData, onBack }: ConfirmacaoScreenProps) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const canGeneratePdf = typeof window !== 'undefined' && window.electronAPI?.generatePdf;

  const handleGeneratePdf = async () => {
    if (!window.electronAPI?.generatePdf) return;
    setPdfError(null);
    setPdfLoading(true);
    try {
      const basePayload = {
        nomeCliente: clienteData.nome,
        cpfCnpj: clienteData.cpfCnpj,
        endereco: clienteData.endereco,
        celularFone: clienteData.celularFone,
        cidade: clienteData.cidade,
      };

      const payload =
        tipoOrcamento === 'cobertura'
          ? {
              tipoProposta: 'cobertura' as const,
              tipoCobertura: (data as CoberturaFormData).tipoCobertura,
              temPilar: (data as CoberturaFormData).temPilar,
              corOuPintura: (data as CoberturaFormData).corOuPintura,
              telhaTermica: (data as CoberturaFormData).telhaTermica,
              forroPvc: (data as CoberturaFormData).forroPvc,
              medidas: (data as CoberturaFormData).medidas,
              valorM2: (data as CoberturaFormData).valorM2,
              valorPilar: (data as CoberturaFormData).valorPilar ?? '',
              medidaPilar: (data as CoberturaFormData).medidaPilar ?? '',
              custoDeslocamento: (data as CoberturaFormData).custoDeslocamento,
              ...basePayload,
            }
          : {
              tipoProposta: 'pergolado' as const,
              tipoPolicarbonato: (data as PergoladoFormData).tipoPolicarbonato,
              corPolicarbonato: (data as PergoladoFormData).corPolicarbonato,
              medidas: (data as PergoladoFormData).medidas,
              dimensaoTubo: (data as PergoladoFormData).dimensaoTubo,
              ...(typeof (data as PergoladoFormData).valorM2 !== 'undefined' &&
              (data as PergoladoFormData).valorM2 !== ''
                ? { valorM2: (data as PergoladoFormData).valorM2 }
                : {}),
              ...basePayload,
            };

      const result = await window.electronAPI.generatePdf(payload);
      if (result.success) {
        setPdfError(null);
      } else {
        if (result.error !== 'canceled') setPdfError(result.error ?? 'Erro ao gerar PDF.');
      }
    } catch (e) {
      setPdfError(e instanceof Error ? e.message : 'Erro ao gerar PDF.');
    } finally {
      setPdfLoading(false);
    }
  };

  const orcamentoContent =
    tipoOrcamento === 'cobertura' ? (
      <SlideOrcamentoCobertura data={data as CoberturaFormData} />
    ) : (
      <SlideOrcamentoPergolado data={data as PergoladoFormData} />
    );

  return (
    <div className="min-h-full flex flex-col px-6 py-8 max-w-2xl mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors mb-8"
      >
        ← Voltar ao início
      </button>

      <h2 className="text-xl font-semibold text-white mb-1">Resumo</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Confira os dados do orçamento e do cliente.
      </p>

      <ResumoCarousel
        orcamentoContent={orcamentoContent}
        clienteContent={<SlideCliente data={clienteData} />}
      />

      {pdfError && (
        <p className="mt-4 text-sm text-amber-400" role="alert">
          {pdfError}
        </p>
      )}

      {canGeneratePdf && (
        <button
          type="button"
          onClick={handleGeneratePdf}
          disabled={pdfLoading}
          className="mt-6 w-full py-4 rounded-[var(--radius-lg)] font-medium bg-[var(--color-accent)] text-[#0d0d0d] hover:bg-[var(--color-accent-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {pdfLoading ? 'Gerando PDF...' : 'Gerar PDF'}
        </button>
      )}

      <button
        type="button"
        onClick={onBack}
        className="mt-4 w-full py-4 rounded-[var(--radius-lg)] font-medium bg-[var(--color-surface)] border border-[var(--color-border)] text-white hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] transition-all"
      >
        Novo orçamento
      </button>
    </div>
  );
}
