import type { ReactNode } from 'react';

export function AdminTable({ headers, children, minWidth = 720 }: { headers: string[]; children: ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-ink/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm" style={{ minWidth }}>
          <thead className="bg-ink text-white">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-4 text-xs font-black uppercase tracking-[0.16em]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
