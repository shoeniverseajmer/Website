import { motion, type HTMLMotionProps } from 'framer-motion';
import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

type CardVariant = 'default' | 'muted' | 'glass' | 'dark' | 'flat';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref' | 'children'> {
  variant?: CardVariant;
  padding?: CardPadding;
  interactive?: boolean;
  children?: ReactNode;
}

const variants: Record<CardVariant, string> = {
  default: 'border border-ink/10 bg-white shadow-soft',
  muted: 'border border-ink/10 bg-bone shadow-sm',
  glass: 'border border-white/35 bg-white/70 shadow-soft backdrop-blur-2xl',
  dark: 'border border-white/10 bg-ink text-white shadow-luxe',
  flat: 'border border-ink/10 bg-white'
};

const paddings: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6 md:p-8'
};

export function Card({ variant = 'default', padding = 'md', interactive, className, children, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={interactive ? { y: -4 } : undefined}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={cn('rounded-3xl', variants[variant], paddings[padding], interactive && 'transition-shadow hover:shadow-luxe', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-5 flex flex-wrap items-start justify-between gap-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-xl font-black leading-tight text-balance', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('mt-1 text-sm leading-6 text-ink/58', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-5 flex flex-wrap items-center gap-3 border-t border-ink/10 pt-5', className)} {...props}>
      {children}
    </div>
  );
}
