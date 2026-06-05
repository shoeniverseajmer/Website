import { FormEvent, useState } from 'react';
import { CheckCircle2, Percent, X } from 'lucide-react';
import { Button } from '../ui/Button';

export function CouponBox({
  appliedCode,
  discount,
  onApply,
  onRemove
}: {
  appliedCode?: string;
  discount: number;
  onApply: (code: string) => void;
  onRemove: () => void;
}) {
  const [value, setValue] = useState(appliedCode ?? '');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApply(value);
  };

  if (appliedCode) {
    return (
      <div className="rounded-2xl border border-lime-200/20 bg-lime-200/10 p-4 text-white">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-lime-200" />
            <div>
              <p className="font-black">{appliedCode}</p>
              <p className="text-xs font-bold text-white/55">Saved {discount ? `with this coupon` : 'coupon applied'}</p>
            </div>
          </div>
          <button type="button" onClick={onRemove} className="focus-ring grid h-9 w-9 place-items-center rounded-full bg-white text-ink/55">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/[0.06] p-2 text-white">
      <div className="flex items-center gap-2">
        <Percent className="ml-3 h-4 w-4 text-cyan-200" />
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="min-w-0 flex-1 bg-transparent py-3 text-sm font-bold outline-none placeholder:text-white/35"
          placeholder="Coupon code"
        />
        <Button type="submit" className="min-h-10 bg-white px-4 text-ink hover:bg-cyan-100">
          Apply
        </Button>
      </div>
    </form>
  );
}
