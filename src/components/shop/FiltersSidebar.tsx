import { SlidersHorizontal, Star, Tag } from 'lucide-react';
import type { ProductFilters } from '../../types';

const filterGroups = [
  { key: 'gender_category', label: 'Category', values: ['men', 'women', 'kids', 'unisex'] },
  { key: 'product_type', label: 'Product', values: ['shoes', 'accessories'] },
  { key: 'accessory_type', label: 'Accessories', values: ['belts', 'wallets', 'bags'] },
  { key: 'occasion', label: 'Occasion', values: ['casual', 'festive'] }
] as const;

const activeFilterCount = (filters: ProductFilters) =>
  Object.values(filters).filter((value) => value !== undefined && value !== '' && value !== false).length;

export function FiltersSidebar({ filters, onChange }: { filters: ProductFilters; onChange: (filters: ProductFilters) => void }) {
  const count = activeFilterCount(filters);

  return (
    <aside className="cosmic-card sticky top-24 space-y-7 rounded-[1.5rem] p-5 text-white">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-black">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {count ? <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] text-ink">{count}</span> : null}
        </h2>
        <button className="text-sm font-bold text-white/50 hover:text-white" onClick={() => onChange({ search: filters.search })}>
          Reset
        </button>
      </div>
      {filterGroups.map((group) => (
        <div key={group.key}>
          <h3 className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-cyan-200/80">{group.label}</h3>
          <div className="flex flex-wrap gap-2">
            {group.values.map((value) => {
              const active = filters[group.key] === value;
              const disabled = group.key === 'accessory_type' && filters.product_type === 'shoes';
              return (
                <button
                  key={value}
                  type="button"
                  disabled={disabled}
                  className={`focus-ring min-h-10 rounded-full border px-4 py-1 text-xs font-black capitalize transition ${
                    active
                      ? 'border-white bg-white text-ink shadow-[0_0_26px_rgba(120,247,255,0.2)]'
                      : disabled
                        ? 'cursor-not-allowed border-white/5 bg-white/5 text-white/25'
                        : 'border-white/10 bg-white/10 text-white/70 hover:border-white/30 hover:text-white'
                  }`}
                  onClick={() => onChange({ ...filters, [group.key]: active ? undefined : value })}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
        <label className="flex items-center gap-3 text-sm font-bold">
          <input type="checkbox" checked={Boolean(filters.bestseller)} onChange={(event) => onChange({ ...filters, bestseller: event.target.checked || undefined })} />
          <Star className="h-4 w-4 text-cyan-200" />
          Bestseller
        </label>
        <label className="flex items-center gap-3 text-sm font-bold">
          <input type="checkbox" checked={Boolean(filters.sale)} onChange={(event) => onChange({ ...filters, sale: event.target.checked || undefined })} />
          <Tag className="h-4 w-4 text-lime-200" />
          Sale
        </label>
      </div>
    </aside>
  );
}
