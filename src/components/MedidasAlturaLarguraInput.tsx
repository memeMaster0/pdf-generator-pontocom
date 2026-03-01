interface MedidasAlturaLarguraInputProps {
  altura: string;
  largura: string;
  onAlturaChange: (value: string) => void;
  onLarguraChange: (value: string) => void;
  label: string;
  id?: string;
  error?: string;
}

const inputClass =
  'w-full max-w-[200px] py-3 px-4 rounded-[var(--radius)] border bg-[var(--color-surface)] text-white placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-opacity-30 transition-all';

export function MedidasAlturaLarguraInput({
  altura,
  largura,
  onAlturaChange,
  onLarguraChange,
  label,
  id,
  error,
}: MedidasAlturaLarguraInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label}
      </label>
      <p className="text-xs text-[var(--color-text-muted)] mb-1">
        Ordem: primeiro <strong>Altura</strong>, depois <strong>Largura</strong>
      </p>
      <div className="grid grid-cols-2 gap-3 w-fit max-w-[420px]">
        <div>
          <label htmlFor={id ? `${id}-altura` : undefined} className="sr-only">
            Altura (m)
          </label>
          <input
            id={id ? `${id}-altura` : undefined}
            type="text"
            inputMode="decimal"
            value={altura}
            onChange={(e) => onAlturaChange(e.target.value)}
            placeholder="Altura (m)"
            className={inputClass}
            aria-label="Altura em metros"
          />
        </div>
        <div>
          <label htmlFor={id ? `${id}-largura` : undefined} className="sr-only">
            Largura (m)
          </label>
          <input
            id={id ? `${id}-largura` : undefined}
            type="text"
            inputMode="decimal"
            value={largura}
            onChange={(e) => onLarguraChange(e.target.value)}
            placeholder="Largura (m)"
            className={inputClass}
            aria-label="Largura em metros"
          />
        </div>
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">Ex.: 2,00 e 3,00 → 2,00m x 3,00m</p>
      {error && <p className="text-xs text-amber-400">{error}</p>}
    </div>
  );
}

/** Converte strings de altura/largura em número (metros). Aceita "2" ou "2,5" ou "2.5". */
export function parseAlturaLargura(altura: string, largura: string): { altura: number; largura: number } {
  const a = parseFloat((altura || '').trim().replace(',', '.'));
  const b = parseFloat((largura || '').trim().replace(',', '.'));
  return {
    altura: Number.isFinite(a) && a >= 0 ? a : 0,
    largura: Number.isFinite(b) && b >= 0 ? b : 0,
  };
}

/** Formata altura e largura no padrão "2,00m x 3,00m". */
export function formatAlturaLargura(altura: number, largura: number): string {
  if (altura <= 0 || largura <= 0) return '';
  return `${altura.toFixed(2).replace('.', ',')}m x ${largura.toFixed(2).replace('.', ',')}m`;
}
