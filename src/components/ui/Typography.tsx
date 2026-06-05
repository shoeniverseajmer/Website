import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

type TextVariant = 'display' | 'headline' | 'title' | 'body' | 'caption' | 'eyebrow';

const variants: Record<TextVariant, string> = {
  display: 'text-display font-black leading-none text-balance',
  headline: 'text-headline font-black leading-tight text-balance',
  title: 'text-title font-black leading-tight',
  body: 'text-body leading-7 text-ink/65',
  caption: 'text-caption font-bold uppercase text-ink/45',
  eyebrow: 'text-xs font-black uppercase tracking-[0.24em] text-moss'
};

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4';
  variant?: TextVariant;
  children: ReactNode;
}

export function Typography({ as: Component = 'p', variant = 'body', className, children, ...props }: TypographyProps) {
  return (
    <Component className={cn(variants[variant], className)} {...props}>
      {children}
    </Component>
  );
}
