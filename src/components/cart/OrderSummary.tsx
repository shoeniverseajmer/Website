import { Link } from 'react-router-dom';
import { ShieldCheck, Truck } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../utils/format';
import type { CartItem } from '../../types';

export function OrderSummary({
  items,
  subtotal,
  deliveryCharge,
  discount,
  total,
  couponSlot,
  ctaLabel = 'Continue to checkout',
  ctaTo = '/checkout',
  onCta,
  submit = false,
  compact = false,
  disabled = false
}: {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  couponSlot?: ReactNode;
  ctaLabel?: string;
  ctaTo?: string;
  onCta?: () => void;
  submit?: boolean;
  compact?: boolean;
  disabled?: boolean;
}) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="cosmic-card h-fit rounded-[1.5rem] p-5 text-white lg:sticky lg:top-28">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-black">Order summary</h2>
          <p className="mt-1 text-sm font-bold text-white/48">{itemCount} item{itemCount === 1 ? '' : 's'}</p>
        </div>
        <div className="rounded-full bg-white px-3 py-1 text-xs font-black text-ink">Secure</div>
      </div>

      {!compact ? (
        <div className="mb-5 max-h-72 space-y-3 overflow-auto pr-1">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <img src={item.product.product_images?.[0]?.image_url} alt={item.product.name} className="h-[68px] w-[68px] rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-black">{item.product.name}</p>
                <p className="text-sm text-white/55">Qty {item.quantity}</p>
              </div>
              <span className="font-black">{formatCurrency((item.product.sale_price ?? item.product.price) * item.quantity)}</span>
            </div>
          ))}
        </div>
      ) : null}

      {couponSlot ? <div className="mb-5">{couponSlot}</div> : null}

      <div className="space-y-3 border-t border-white/10 pt-5 text-sm">
        <div className="flex justify-between">
          <span className="text-white/55">Subtotal</span>
          <span className="font-bold">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/55">Delivery</span>
          <span className="font-bold">{deliveryCharge ? formatCurrency(deliveryCharge) : 'Free'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/55">Coupon</span>
          <span className="font-bold text-lime-200">-{formatCurrency(discount)}</span>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-4 text-xl font-black">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {submit ? (
        <Button className="mt-5 min-h-12 bg-white text-ink hover:bg-cyan-100" type="submit" fullWidth disabled={disabled}>
          {ctaLabel}
        </Button>
      ) : (
        <Button className="mt-5 min-h-12 bg-white text-ink hover:bg-cyan-100" fullWidth disabled={disabled} onClick={onCta}>
          <Link to={ctaTo} className="grid w-full place-items-center">
            {ctaLabel}
          </Link>
        </Button>
      )}

      <div className="mt-4 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-xs font-bold leading-5 text-white/58">
        <span className="inline-flex items-center gap-2">
          <Truck className="h-4 w-4 text-cyan-200" />
          Delivery estimate updates at checkout
        </span>
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-cyan-200" />
          COD, UPI, and Razorpay structure ready
        </span>
      </div>
    </aside>
  );
}
