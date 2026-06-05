import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export function SectionHeading({
  eyebrow,
  title,
  copy,
  action,
  tone = 'light'
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  action?: ReactNode;
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';

  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className={cn('mb-2 text-xs font-black uppercase tracking-[0.24em]', dark ? 'text-cyan-200' : 'text-moss')}>{eyebrow}</p> : null}
        <h2 className={cn('text-balance text-3xl font-black leading-tight md:text-5xl', dark && 'cosmic-glow-text text-white')}>{title}</h2>
        {copy ? <p className={cn('mt-3 max-w-2xl text-sm leading-6 md:text-base', dark ? 'text-white/62' : 'text-ink/60')}>{copy}</p> : null}
      </div>
      {action}
    </div>
  );
}
