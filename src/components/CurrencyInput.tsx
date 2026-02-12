import { useRef, useEffect } from 'react';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  hint?: string;
  id?: string;
}

function formatCurrencyDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 0) return '';
  const cents = digits.slice(-2);
  const intPart = digits.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${intPart || '0'},${cents.padStart(2, '0')}`;
}

export function CurrencyInput({
  value,
  onChange,
  label,
  placeholder = '0,00',
  hint,
  id,
}: CurrencyInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = formatCurrencyDisplay(value);

  useEffect(() => {
    if (inputRef.current && document.activeElement === inputRef.current) {
      const len = displayValue.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [displayValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    const normalized = raw.replace(/^0+/, '') || '';
    if (normalized.length <= 12) onChange(normalized);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const allSelected = input.selectionStart === 0 && input.selectionEnd === input.value.length;
    if ((e.key === 'Backspace' || e.key === 'Delete') && (allSelected || input.value.length === 0)) {
      e.preventDefault();
      onChange('');
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-white">
        {label}
      </label>
      <div className="flex items-center rounded-[var(--radius)] border border-[var(--color-border)] bg-[var(--color-surface)] focus-within:border-[var(--color-accent)] focus-within:ring-2 focus-within:ring-[var(--color-accent)] focus-within:ring-opacity-30 transition-all">
        <span className="pl-4 text-[var(--color-text-muted)] font-medium">R$</span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 py-3 pr-4 pl-2 bg-transparent text-white placeholder-[var(--color-text-muted)] focus:outline-none min-w-0"
        />
      </div>
      {hint && (
        <p className="text-xs text-[var(--color-text-muted)]">Ex: {hint}</p>
      )}
    </div>
  );
}

export { formatCurrencyDisplay };
