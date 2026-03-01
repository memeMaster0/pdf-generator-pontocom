interface MedidasInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  hint?: string;
  id?: string;
  error?: string;
}

const MEDIDAS_REGEX = /^\d+([.,]\d+)?\s*m\s*x\s*\d+([.,]\d+)?\s*m$/i;
const MEDIDAS_REGEX_LOOSE = /^(\d+([.,]\d+)?)\s*[xX×]\s*(\d+([.,]\d+)?)\s*(m|m²)?$/;

export function MedidasInput({
  value,
  onChange,
  label,
  placeholder = '5,00m x 2,00m',
  hint = '5,00m x 2,00m',
  id,
  error,
}: MedidasInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full max-w-[200px] py-3 px-4 rounded-[var(--radius)] border bg-[var(--color-surface)] text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-opacity-30 transition-all"
      />
      {hint && (
        <p className="text-xs text-[var(--color-text-muted)]">Ex: {hint}</p>
      )}
      {error && (
        <p className="text-xs text-amber-400">{error}</p>
      )}
    </div>
  );
}

export function validateMedidas(medidas: string): boolean {
  const trimmed = medidas.trim();
  if (!trimmed) return false;
  return MEDIDAS_REGEX.test(trimmed) || MEDIDAS_REGEX_LOOSE.test(trimmed);
}

/** Valida valor de m² informado diretamente (ex.: "25,50" ou "25.50"). */
export function validateM2Direto(value: string): boolean {
  const trimmed = (value || '').trim();
  if (!trimmed) return false;
  const n = parseFloat(trimmed.replace(',', '.'));
  return Number.isFinite(n) && n > 0;
}

export function normalizeMedidas(medidas: string): string {
  const match = medidas.trim().match(MEDIDAS_REGEX_LOOSE);
  if (match) {
    const a = match[1].replace(',', '.');
    const b = match[3].replace(',', '.');
    return `${a}m x ${b}m`;
  }
  return medidas.trim();
}
