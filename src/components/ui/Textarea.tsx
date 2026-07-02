import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, containerClassName, id, ...props }, ref) => {
    const textareaId = id ?? props.name;

    return (
      <label className={cn('block', containerClassName)} htmlFor={textareaId}>
        {label ? <span className="mb-2 block text-sm font-bold text-ink">{label}</span> : null}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={Boolean(error)}
          className={cn(
            'focus-ring min-h-32 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink shadow-sm transition duration-200 ease-premium placeholder:text-ink/35 disabled:cursor-not-allowed disabled:bg-ink/5 disabled:text-ink/40',
            error && 'border-danger focus-visible:ring-danger',
            className
          )}
          {...props}
        />
        {helperText && !error ? <span className="mt-1.5 block text-xs font-medium text-ink/50">{helperText}</span> : null}
        {error ? <span className="mt-1.5 block text-xs font-bold text-danger">{error}</span> : null}
      </label>
    );
  }
);

Textarea.displayName = 'Textarea';
