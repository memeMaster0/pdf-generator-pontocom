export function TitleBar() {
  const api = typeof window !== 'undefined' ? window.electronAPI : undefined;
  if (!api) return null;

  return (
    <div
      className="h-8 flex-shrink-0 flex items-center justify-end pr-1"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      <div style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties} className="flex items-center gap-0">
        <button
            type="button"
            onClick={() => api.minimizeWindow()}
            className="w-10 h-8 flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-white transition-colors"
            aria-label="Minimizar"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
              <rect y="5" width="12" height="1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => api.maximizeWindow()}
            className="w-10 h-8 flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-white transition-colors"
            aria-label="Maximizar"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
              <rect x="1" y="1" width="10" height="10" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => api.closeWindow()}
            className="w-10 h-8 flex items-center justify-center text-[var(--color-text-muted)] hover:bg-red-600/80 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </svg>
          </button>
      </div>
    </div>
  );
}
