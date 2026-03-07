interface HubScreenProps {
  onCalculadoraPeso: () => void;
  onGeradorPdf: () => void;
}

export function HubScreen({ onCalculadoraPeso, onGeradorPdf }: HubScreenProps) {
  return (
    <div className="min-h-full flex flex-col items-center justify-center px-8 py-12">
      <div className="relative flex flex-col items-center">
        <div className="absolute bottom-full mb-2 flex flex-col items-center">
          <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight whitespace-nowrap">
            Hub Pontocom
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm mb-6">
            Selecione uma ferramenta
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
        <button
          type="button"
          onClick={onCalculadoraPeso}
          className="group flex flex-col items-center justify-center gap-4 w-[200px] h-[180px] rounded-[var(--radius-lg)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] transition-all duration-200 hover:border-[var(--color-accent)] hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors duration-200"
          >
            <path d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
          </svg>
          <span className="text-sm font-medium text-white">
            Calculadora de Peso
          </span>
        </button>

        <button
          type="button"
          onClick={onGeradorPdf}
          className="group flex flex-col items-center justify-center gap-4 w-[200px] h-[180px] rounded-[var(--radius-lg)] bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] border border-[var(--color-border)] transition-all duration-200 hover:border-[var(--color-accent)] hover:shadow-glow focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors duration-200"
          >
            <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          <span className="text-sm font-medium text-white">
            Gerador de PDF
          </span>
        </button>
        </div>
      </div>
    </div>
  );
}
