import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { toast } from '../ui/Toast';
import { WishlistButton } from './WishlistButton';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../utils/format';
import type { Product } from '../../types';

export function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((state) => state.add);
  const image = product.product_images?.[0]?.image_url;
  const price = product.sale_price ?? product.price;
  const sizes = Array.from(new Set(product.product_variants?.map((variant) => variant.size) ?? [])).slice(0, 10);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      className="cosmic-card group overflow-hidden rounded-[1.25rem] text-white"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#111116]">
        <Link to={`/product/${product.slug}`}>
          {image ? (
            <img src={image} alt={product.name} loading="lazy" className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-black uppercase tracking-widest text-white/30">No image</div>
          )}
        </Link>
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black via-black/42 to-transparent opacity-90 transition duration-500" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">
          {product.is_on_sale ? <Badge tone="sale">Sale</Badge> : null}
          {product.is_bestseller ? <Badge tone="success">Bestseller</Badge> : null}
        </div>
        <div className="absolute right-3 top-3">
          <WishlistButton productId={product.id} productName={product.name} />
        </div>
        <div className="absolute inset-x-3 bottom-3 translate-y-4 rounded-[1rem] border border-white/15 bg-[#050507]/88 p-3 opacity-0 shadow-[0_18px_50px_rgba(0,0,0,0.44)] backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">Quick add</p>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {(sizes.length ? sizes : ['6', '7', '8', '9', '10']).map((size) => (
              <button
                key={size}
                className="h-8 rounded-full border border-white/15 bg-white/10 text-xs font-black text-white transition hover:border-white hover:bg-white hover:text-ink"
                onClick={(e) => {
                  e.preventDefault();
                  const variant = product.product_variants?.find((v) => v.size === size);
                  add({ ...product, product_variants: variant ? [variant] : [] });
                  toast.success(`${product.name} · Size ${size} added to cart`);
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div>
          <Link to={`/product/${product.slug}`} className="text-lg font-black uppercase leading-tight text-white hover:underline">
            {product.name}
          </Link>
          <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-white/42">
            {product.product_variants?.[0]?.color ?? product.gender_category}
          </p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="font-black">{formatCurrency(price)}</span>
            {product.sale_price ? <span className="ml-2 text-sm text-white/35 line-through">{formatCurrency(product.price)}</span> : null}
          </div>
          <Button
            className="h-10 min-h-10 bg-white px-4 text-black hover:bg-cyan-100"
            icon={<ShoppingBag className="h-4 w-4" />}
            onClick={() => {
              add(product);
              toast.success(`${product.name} added to cart`);
            }}
          >
            Add
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
