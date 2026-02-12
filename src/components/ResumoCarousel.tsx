import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface ResumoCarouselProps {
  orcamentoContent: ReactNode;
  clienteContent: ReactNode;
}

const SLIDE_DURATION_MS = 250;

const arrowButtonClass =
  'flex-shrink-0 w-12 h-12 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-white hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-accent)] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-transform active:scale-95 cursor-pointer select-none [&_svg]:pointer-events-none';

export function ResumoCarousel({ orcamentoContent, clienteContent }: ResumoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goTo = useCallback((index: number) => {
    if (index < 0 || index > 1) return;
    setCurrentIndex(index);
  }, []);

  const goPrev = () => goTo(currentIndex - 1);
  const goNext = () => goTo(currentIndex + 1);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className={arrowButtonClass}
          aria-label="Página anterior"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div className="flex-1 min-w-0 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-soft">
          <div
            className="flex transition-transform ease-out"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transitionDuration: `${SLIDE_DURATION_MS}ms`,
            }}
          >
            <div className="w-full flex-shrink-0 p-6" aria-hidden={currentIndex !== 0}>
              {orcamentoContent}
            </div>
            <div className="w-full flex-shrink-0 p-6" aria-hidden={currentIndex !== 1}>
              {clienteContent}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={goNext}
          disabled={currentIndex === 1}
          className={arrowButtonClass}
          aria-label="Próxima página"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 mt-3">
        <span className="text-xs text-[var(--color-text-muted)]" aria-live="polite">
          {currentIndex + 1} / 2
        </span>
        <button
          type="button"
          onClick={() => goTo(0)}
          className={`w-2 h-2 rounded-full transition-opacity ${currentIndex === 0 ? 'bg-[var(--color-accent)] opacity-100' : 'bg-[var(--color-border)] opacity-60 hover:opacity-80'}`}
          aria-label="Ver orçamento"
          aria-current={currentIndex === 0 ? 'true' : undefined}
        />
        <button
          type="button"
          onClick={() => goTo(1)}
          className={`w-2 h-2 rounded-full transition-opacity ${currentIndex === 1 ? 'bg-[var(--color-accent)] opacity-100' : 'bg-[var(--color-border)] opacity-60 hover:opacity-80'}`}
          aria-label="Ver cliente"
          aria-current={currentIndex === 1 ? 'true' : undefined}
        />
      </div>
    </div>
  );
}
