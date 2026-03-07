interface HomeScreenProps {
  onBack: () => void;
  onCoberturaPremium: () => void;
  onPergolado: () => void;
  onCoberturaRetratil: () => void;
  onPorta: () => void;
}

export function HomeScreen({
  onBack,
  onCoberturaPremium,
  onPergolado,
  onCoberturaRetratil,
  onPorta,
}: HomeScreenProps) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-8 py-12 relative">
      <button
        type="button"
        onClick={onBack}
        className="absolute top-6 left-8 flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5m0 0 7 7m-7-7 7-7" />
        </svg>
        Voltar
      </button>

      <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">
        Gerador de PDF&apos;s
      </h1>
      <p className="text-[var(--color-text-muted)] text-sm mb-10">
        Selecione uma opção abaixo
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <button
          type="button"
          onClick={onCoberturaPremium}
          className="w-full py-4 px-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-left font-medium text-white transition-all duration-200 hover:border-[var(--color-accent)] hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
        >
          Cobertura Premium
        </button>

        <button
          type="button"
          onClick={onPergolado}
          className="w-full py-4 px-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-left font-medium text-white transition-all duration-200 hover:border-[var(--color-accent)] hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
        >
          Pergolado
        </button>

        <button
          type="button"
          onClick={onCoberturaRetratil}
          className="w-full py-4 px-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-left font-medium text-white transition-all duration-200 hover:border-[var(--color-accent)] hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
        >
          Cobertura Retrátil
        </button>

        <button
          type="button"
          onClick={onPorta}
          className="w-full py-4 px-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-left font-medium text-white transition-all duration-200 hover:border-[var(--color-accent)] hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
        >
          Porta
        </button>
      </div>
    </div>
  );
}
