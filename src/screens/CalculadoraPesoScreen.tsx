import { useState, useMemo } from 'react';

const CHAPAS: Record<string, number> = {
  '#12': 2.65,
  '#13': 2.25,
  '#14': 2.00,
  '#16': 1.55,
  '#18': 1.25,
};

const CHAPA_KEYS = Object.keys(CHAPAS);
const VALORES_POR_KG = [10, 15, 20, 25, 30, 35, 40];
const VALORES_PINTURA = [100, 150, 200, 250, 300, 350, 400];
const DEFAULT_VALOR_MASSA = 8;

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatKg(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' Kg';
}

interface OptionGroupProps<T extends string | number> {
  label: string;
  options: T[];
  value: T | null;
  onChange: (v: T) => void;
  format?: (v: T) => string;
}

function OptionGroup<T extends string | number>({ label, options, value, onChange, format }: OptionGroupProps<T>) {
  return (
    <div>
      <label className="block text-sm font-medium text-white mb-3">{label}</label>
      <div className="flex flex-wrap gap-3">
        {options.map((opt) => (
          <button
            key={String(opt)}
            type="button"
            onClick={() => onChange(opt)}
            className={`py-3 px-5 rounded-[var(--radius)] font-medium border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] ${
              value === opt
                ? 'border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]'
                : 'bg-[var(--color-surface)] text-white border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
            }`}
          >
            {format ? format(opt) : String(opt)}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-6 py-5 rounded-[var(--radius)] border ${
      accent
        ? 'bg-[var(--color-accent-muted)] border-[var(--color-accent)]'
        : 'bg-[var(--color-bg-elevated)] border-[var(--color-border)]'
    }`}>
      <span className="text-sm font-medium text-[var(--color-text-muted)]">{label}</span>
      <span className={`text-xl font-semibold ${accent ? 'text-[var(--color-accent)]' : 'text-white'}`}>
        {value}
      </span>
    </div>
  );
}

interface CalculadoraPesoScreenProps {
  onBack: () => void;
}

export function CalculadoraPesoScreen({ onBack }: CalculadoraPesoScreenProps) {
  const [medidaA, setMedidaA] = useState('');
  const [medidaB, setMedidaB] = useState('');
  const [metrosLineares, setMetrosLineares] = useState('');
  const [chapa, setChapa] = useState<string | null>(null);
  const [valorMassa, setValorMassa] = useState(DEFAULT_VALOR_MASSA);
  const [valorPorKg, setValorPorKg] = useState<number | null>(null);
  const [valorPorMetroPintura, setValorPorMetroPintura] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [tempValorMassa, setTempValorMassa] = useState(String(DEFAULT_VALOR_MASSA));

  const calculos = useMemo(() => {
    const a = parseFloat(medidaA);
    const b = parseFloat(medidaB);
    const ml = parseFloat(metrosLineares);
    const chapaVal = chapa ? CHAPAS[chapa] : null;

    if (!a || !b || !ml || !chapaVal) return null;

    const perimetro = ((a / 1000) * 2) + ((b / 1000) * 2);
    const m2 = perimetro * ml;
    const totalKg = m2 * chapaVal * valorMassa;

    return { m2, totalKg };
  }, [medidaA, medidaB, metrosLineares, chapa, valorMassa]);

  const valorTotalEstrutura = calculos && valorPorKg ? calculos.totalKg * valorPorKg : null;
  const valorTotalPintura = calculos && valorPorMetroPintura ? calculos.m2 * valorPorMetroPintura : null;
  const valorTotalGeral =
    valorTotalEstrutura !== null && valorTotalPintura !== null
      ? valorTotalEstrutura + valorTotalPintura
      : null;

  const openSettings = () => {
    setTempValorMassa(String(valorMassa));
    setShowSettings(true);
  };

  const saveSettings = () => {
    const parsed = parseFloat(tempValorMassa.replace(',', '.'));
    if (parsed && parsed > 0) setValorMassa(parsed);
    setShowSettings(false);
  };

  const inputClass =
    'w-full py-3 px-4 rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] text-white placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent transition-all';

  return (
    <div className="min-h-full flex flex-col items-center px-6 py-8 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 w-full max-w-2xl">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
          </svg>
          Voltar
        </button>

        <h1 className="text-xl font-semibold text-white tracking-tight">Calculadora de Peso</h1>

        <button
          type="button"
          onClick={openSettings}
          className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
          title="Configurações"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>
      </div>

      {/* Section 1: Inputs */}
      <div className="space-y-6 w-full max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Medidas <span className="text-xs text-[var(--color-text-muted)]">(mm)</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              placeholder="Largura"
              value={medidaA}
              onChange={(e) => setMedidaA(e.target.value)}
              className={inputClass}
            />
            <span className="text-[var(--color-text-muted)] text-lg font-medium flex-shrink-0">x</span>
            <input
              type="number"
              min="0"
              placeholder="Altura"
              value={medidaB}
              onChange={(e) => setMedidaB(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-3">Metros Lineares</label>
          <input
            type="number"
            min="0"
            placeholder="Ex: 10"
            value={metrosLineares}
            onChange={(e) => setMetrosLineares(e.target.value)}
            className={inputClass}
          />
        </div>

        <OptionGroup label="Chapa" options={CHAPA_KEYS} value={chapa} onChange={setChapa} />
      </div>

      {/* Section 2: Total Kg + Valor por Kg */}
      {calculos && (
        <div className="mt-10 space-y-6 animate-[fadeIn_0.3s_ease] w-full max-w-2xl">
          <div className="border-t border-[var(--color-border)] pt-8">
            <ResultCard label="Total Kg" value={formatKg(calculos.totalKg)} />
          </div>
          <OptionGroup
            label="Valor por Kg (R$)"
            options={VALORES_POR_KG}
            value={valorPorKg}
            onChange={setValorPorKg}
          />
        </div>
      )}

      {/* Section 3: Valor Total Estrutura + Valor pintura */}
      {valorTotalEstrutura !== null && (
        <div className="mt-10 space-y-6 animate-[fadeIn_0.3s_ease] w-full max-w-2xl">
          <div className="border-t border-[var(--color-border)] pt-8">
            <ResultCard label="Valor Total da Estrutura" value={formatBRL(valorTotalEstrutura)} />
          </div>
          <OptionGroup
            label="Valor p/ metro da pintura (R$)"
            options={VALORES_PINTURA}
            value={valorPorMetroPintura}
            onChange={setValorPorMetroPintura}
          />
        </div>
      )}

      {/* Section 4: Totals */}
      {valorTotalGeral !== null && valorTotalPintura !== null && (
        <div className="mt-10 space-y-4 animate-[fadeIn_0.3s_ease] pb-10 w-full max-w-2xl">
          <div className="border-t border-[var(--color-border)] pt-8 space-y-4">
            <ResultCard label="Valor Total da Pintura" value={formatBRL(valorTotalPintura)} />
            <ResultCard label="Valor Total Geral" value={formatBRL(valorTotalGeral)} accent />
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowSettings(false)}>
          <div
            className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 w-80 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-semibold text-white mb-4">Configurações</h2>
            <label className="block text-sm text-[var(--color-text-muted)] mb-2">Valor da Massa</label>
            <input
              type="number"
              min="0"
              step="any"
              value={tempValorMassa}
              onChange={(e) => setTempValorMassa(e.target.value)}
              className={inputClass + ' mb-4'}
            />
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 rounded-[var(--radius)] text-sm text-[var(--color-text-muted)] hover:text-white border border-[var(--color-border)] hover:bg-[var(--color-surface)] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={saveSettings}
                className="px-4 py-2 rounded-[var(--radius)] text-sm font-medium bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent-hover)] transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
