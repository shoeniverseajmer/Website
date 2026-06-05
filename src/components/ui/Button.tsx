import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold' | 'outline' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  children?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink text-white shadow-[0_16px_40px_rgba(17,17,17,0.18)] hover:bg-black',
  secondary: 'border border-ink/10 bg-white text-ink shadow-sm hover:border-ink/30 hover:bg-porcelain',
  ghost: 'bg-transparent text-ink hover:bg-ink/5',
  danger: 'bg-danger text-white shadow-[0_16px_40px_rgba(220,38,38,0.18)] hover:bg-danger-600',
  gold: 'bg-gold text-ink shadow-[0_16px_40px_rgba(199,165,83,0.25)] hover:bg-gold-600',
  outline: 'border border-ink/20 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-white',
  link: 'min-h-0 rounded-none bg-transparent p-0 text-ink underline-offset-4 hover:underline'
};

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-4 py-1.5 text-xs',
  md: 'min-h-11 px-5 py-2 text-sm',
  lg: 'min-h-12 px-6 py-3 text-base',
  icon: 'h-11 min-h-11 w-11 px-0 py-0'
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  icon,
  rightIcon,
  loading,
  fullWidth,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ y: disabled || loading ? 0 : -1 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={cn(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-full font-bold transition duration-200 ease-premium disabled:cursor-not-allowed disabled:opacity-60',
        sizes[size],
        variants[variant],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
      {rightIcon}
    </motion.button>
  );
}
