import type { ReactNode } from 'react';

export function DashboardCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white">{icon}</div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-ink/42">{label}</p>
      <p className="mt-2 text-3xl font-black">{value}</p>
    </div>
  );
}
