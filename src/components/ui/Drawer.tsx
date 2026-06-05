import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type DrawerSide = 'right' | 'left' | 'bottom';
type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

const sideClass: Record<DrawerSide, string> = {
  right: 'right-0 top-0 h-full',
  left: 'left-0 top-0 h-full',
  bottom: 'bottom-0 left-0 w-full'
};

const sizeClass: Record<DrawerSize, string> = {
  sm: 'sm:max-w-[380px]',
  md: 'sm:max-w-[460px]',
  lg: 'sm:max-w-[620px]',
  full: 'max-w-none'
};

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  side = 'right',
  size = 'md',
  className
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: DrawerSide;
  size?: DrawerSize;
  className?: string;
}) {
  const initial = side === 'left' ? { x: '-100%' } : side === 'bottom' ? { y: '100%' } : { x: '100%' };
  const animate = side === 'bottom' ? { y: 0 } : { x: 0 };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} aria-label="Close drawer" />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            aria-describedby={description ? 'drawer-description' : undefined}
            initial={initial}
            animate={animate}
            exit={initial}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className={cn(
              'cosmic-shell absolute flex w-full flex-col text-white shadow-luxe',
              sideClass[side],
              side === 'bottom' ? 'max-h-[92vh] rounded-t-3xl' : sizeClass[size],
              className
            )}
          >
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 id="drawer-title" className="text-lg font-black">{title}</h2>
                {description ? <p id="drawer-description" className="mt-1 text-sm text-white/55">{description}</p> : null}
              </div>
              <button className="focus-ring grid h-10 w-10 place-items-center rounded-full bg-white text-ink" onClick={onClose}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative z-10 flex-1 overflow-auto p-5">{children}</div>
            {footer ? <div className="relative z-10 border-t border-white/10 bg-black/28 p-5 backdrop-blur-xl">{footer}</div> : null}
          </motion.aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
