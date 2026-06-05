import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

export function EmptyState({ title, copy, action }: { title: string; copy: string; action?: ReactNode }) {
  return (
    <div className="cosmic-card grid place-items-center rounded-[1.5rem] px-6 py-16 text-center text-white">
      <div className="grid max-w-md place-items-center">
        <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-white text-ink shadow-[0_0_30px_rgba(120,247,255,0.28)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="text-2xl font-black">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-white/60">{copy}</p>
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </div>
  );
}
