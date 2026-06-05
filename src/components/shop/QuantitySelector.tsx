import { Minus, Plus } from 'lucide-react';

export function QuantitySelector({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="inline-grid h-12 grid-cols-[46px_52px_46px] overflow-hidden rounded-full border border-ink/10 bg-white shadow-sm">
      <button className="focus-ring grid place-items-center" onClick={() => onChange(Math.max(1, value - 1))} type="button">
        <Minus className="h-4 w-4" />
      </button>
      <span className="grid place-items-center border-x border-ink/10 text-sm font-bold">{value}</span>
      <button className="focus-ring grid place-items-center" onClick={() => onChange(value + 1)} type="button">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
