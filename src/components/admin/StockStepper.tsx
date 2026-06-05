import { Minus, Plus } from 'lucide-react';

export function StockStepper({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="inline-grid h-10 grid-cols-[36px_48px_36px] overflow-hidden rounded-full border border-ink/10 bg-bone">
      <button type="button" className="focus-ring grid place-items-center" onClick={() => onChange(Math.max(0, value - 1))}>
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="grid place-items-center border-x border-ink/10 text-sm font-black">{value}</span>
      <button type="button" className="focus-ring grid place-items-center" onClick={() => onChange(value + 1)}>
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
