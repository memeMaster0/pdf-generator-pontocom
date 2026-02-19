interface HomeScreenProps {
  onCoberturaPremium: () => void;
  onPergolado: () => void;
}

export function HomeScreen({ onCoberturaPremium, onPergolado }: HomeScreenProps) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-8 py-12">
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
          disabled
          className="w-full py-4 px-6 rounded-[var(--radius-lg)] bg-[var(--color-surface)] border border-[var(--color-border)] text-left font-medium text-[var(--color-text-muted)] cursor-not-allowed opacity-70"
        >
          Porta
        </button>
      </div>
    </div>
  );
}
