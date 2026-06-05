import type { ReactNode } from 'react';

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'sale' | 'success' }) {
  const className =
    tone === 'sale'
      ? 'bg-clay text-white'
      : tone === 'success'
        ? 'bg-moss text-white'
        : 'bg-white text-ink ring-1 ring-ink/10';

  return <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] ${className}`}>{children}</span>;
}
