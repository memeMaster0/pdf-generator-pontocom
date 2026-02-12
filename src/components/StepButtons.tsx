type Option<T> = { value: T; label: string };

interface StepButtonsProps<T extends string> {
  options: Option<T>[];
  value: T | null;
  onChange: (value: T) => void;
  disabled?: boolean;
  selectedClassName?: string;
}

export function StepButtons<T extends string>({
  options,
  value,
  onChange,
  disabled = false,
  selectedClassName = 'border-[var(--color-accent)] bg-[var(--color-accent-muted)] text-[var(--color-accent)]',
}: StepButtonsProps<T>) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(opt.value)}
            className={`py-3 px-5 rounded-[var(--radius)] border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-offset-2 focus:ring-offset-[var(--color-bg)] ${
              disabled
                ? 'cursor-not-allowed opacity-60 border-[var(--color-border)] text-[var(--color-text-muted)]'
                : isSelected
                  ? selectedClassName
                  : 'border-[var(--color-border)] bg-[var(--color-surface)] text-white hover:border-[var(--color-text-muted)]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
