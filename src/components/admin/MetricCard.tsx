import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

export function MetricCard({
  label,
  value,
  icon,
  trend,
  tone = 'neutral'
}: {
  label: string;
  value: string;
  icon: ReactNode;
  trend?: string;
  tone?: 'neutral' | 'positive' | 'warning';
}) {
  const trendClass = tone === 'positive' ? 'text-moss' : tone === 'warning' ? 'text-clay' : 'text-ink/45';
  const TrendIcon = tone === 'warning' ? ArrowDownRight : ArrowUpRight;

  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-white">{icon}</div>
        {trend ? (
          <span className={`inline-flex items-center gap-1 rounded-full bg-bone px-2.5 py-1 text-xs font-black ${trendClass}`}>
            <TrendIcon className="h-3.5 w-3.5" />
            {trend}
          </span>
        ) : null}
      </div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-ink/42">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
