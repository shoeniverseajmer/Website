import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

const sizes: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
  full: 'max-w-[min(1200px,calc(100vw-32px))]'
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  className
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
  closeOnOverlay?: boolean;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="fixed inset-0 z-50 grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button className="absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={closeOnOverlay ? onClose : undefined} aria-label="Close modal" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby={description ? 'modal-description' : undefined}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className={cn('premium-card relative z-10 max-h-[calc(100vh-32px)] w-full overflow-hidden', sizes[size], className)}
          >
            <div className="flex items-start justify-between gap-4 border-b border-ink/10 p-5">
              <div>
                <h2 id="modal-title" className="text-xl font-black">{title}</h2>
                {description ? <p id="modal-description" className="mt-1 text-sm leading-6 text-ink/58">{description}</p> : null}
              </div>
              <button className="focus-ring grid h-10 w-10 place-items-center rounded-full bg-ink/5" onClick={onClose}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[calc(100vh-180px)] overflow-auto p-5">{children}</div>
            {footer ? <div className="border-t border-ink/10 bg-bone/70 p-5">{footer}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
