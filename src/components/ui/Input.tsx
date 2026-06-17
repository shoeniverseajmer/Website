import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightElement, className, containerClassName, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <label className={cn('block', containerClassName)} htmlFor={inputId}>
        {label ? <span className="mb-2 block text-sm font-bold text-ink">{label}</span> : null}
        <span className="relative block">
          {leftIcon ? <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink/45">{leftIcon}</span> : null}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={cn(
              'control-base w-full py-3',
              Boolean(leftIcon) && 'pl-11',
              Boolean(rightElement) && 'pr-12',
              error && 'border-danger focus-visible:ring-danger',
              className
            )}
            {...props}
          />
          {rightElement ? <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</span> : null}
        </span>
        {helperText && !error ? <span id={`${inputId}-helper`} className="mt-1.5 block text-xs font-medium text-ink/50">{helperText}</span> : null}
        {error ? <span id={`${inputId}-error`} className="mt-1.5 block text-xs font-bold text-danger">{error}</span> : null}
      </label>
    );
  }
);

Input.displayName = 'Input';
