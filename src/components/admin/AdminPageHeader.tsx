import type { ReactNode } from 'react';

export function AdminPageHeader({
  eyebrow,
  title,
  copy,
  action
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-moss">{eyebrow}</p>
        <h1 className="mt-2 text-4xl font-black tracking-normal md:text-5xl">{title}</h1>
        {copy ? <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/58">{copy}</p> : null}
      </div>
      {action}
    </div>
  );
}
