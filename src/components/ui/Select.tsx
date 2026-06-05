import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export function Select({ label, error, helperText, children, className, containerClassName, id, ...props }: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <label className={cn('block', containerClassName)} htmlFor={selectId}>
      {label ? <span className="mb-2 block text-sm font-bold text-ink">{label}</span> : null}
      <select id={selectId} aria-invalid={Boolean(error)} className={cn('control-base w-full py-3', error && 'border-danger focus-visible:ring-danger', className)} {...props}>
        {children}
      </select>
      {helperText && !error ? <span className="mt-1.5 block text-xs font-medium text-ink/50">{helperText}</span> : null}
      {error ? <span className="mt-1.5 block text-xs font-bold text-danger">{error}</span> : null}
    </label>
  );
}
