import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { QuantitySelector } from '../shop/QuantitySelector';
import { formatCurrency } from '../../utils/format';
import type { CartItem } from '../../types';

export function CartLineItem({
  item,
  index = 0,
  compact = false,
  onQuantityChange,
  onRemove
}: {
  item: CartItem;
  index?: number;
  compact?: boolean;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  const price = item.product.sale_price ?? item.product.price;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 22, scale: 0.98 }}
      transition={{ duration: 0.28, delay: index * 0.025, ease: [0.22, 1, 0.36, 1] }}
      className={`cosmic-card grid gap-4 rounded-[1.5rem] text-white ${compact ? 'grid-cols-[88px_1fr] p-3' : 'sm:grid-cols-[132px_1fr] p-4'}`}
    >
      <Link to={`/product/${item.product.slug}`} className={`overflow-hidden rounded-2xl bg-[#111116] ${compact ? 'h-22 w-22' : 'aspect-square'}`}>
        <img src={item.product.product_images?.[0]?.image_url} alt={item.product.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
      </Link>
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${item.product.slug}`} className={`${compact ? 'text-sm' : 'text-xl'} font-black leading-tight hover:underline`}>
              {item.product.name}
            </Link>
            <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-white/42">
              {item.product.gender_category} · {item.product.occasion}
            </p>
          </div>
          <div className="text-right">
            <p className="font-black">{formatCurrency(price * item.quantity)}</p>
            {item.quantity > 1 ? <p className="text-xs font-bold text-white/45">{formatCurrency(price)} each</p> : null}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <QuantitySelector value={item.quantity} onChange={onQuantityChange} />
          <button
            type="button"
            onClick={onRemove}
            className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-black uppercase tracking-[0.14em] text-red-200 transition hover:bg-white/10"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>
    </motion.article>
  );
}
