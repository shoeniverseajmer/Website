import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { Drawer } from '../ui/Drawer';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { CartLineItem } from '../cart/CartLineItem';
import { useCartStore } from '../../store/cartStore';
import { formatCurrency } from '../../utils/format';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, remove, updateQuantity } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + (item.product.sale_price ?? item.product.price) * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Your cart"
      description={itemCount ? `${itemCount} item${itemCount === 1 ? '' : 's'} ready for checkout` : 'Your orbit starts here'}
      size="md"
      footer={
        <motion.div layout>
          {items.length ? (
            <>
              <div className="mb-4 grid gap-2 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm font-bold text-white/65">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-cyan-200" />
                  Delivery estimate: 2-5 business days
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-200" />
                  Secure checkout with COD, UPI, or Razorpay
                </div>
              </div>
              <div className="mb-4 flex items-center justify-between text-xl font-black">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="grid gap-2">
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="focus-ring inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-ink shadow-[0_0_28px_rgba(120,247,255,0.2)] transition hover:bg-cyan-100"
                >
                  Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/cart" onClick={onClose} className="focus-ring inline-flex min-h-11 w-full items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-black text-white">
                  View cart
                </Link>
              </div>
            </>
          ) : (
            <Button fullWidth>
              <Link to="/shop" onClick={onClose} className="grid w-full place-items-center">
                Start shopping
              </Link>
            </Button>
          )}
        </motion.div>
      }
    >
      <div className="space-y-4">
        {items.length ? (
          <>
            <div className="cosmic-card rounded-[1.5rem] p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-black">Premium checkout is one step away.</p>
                  <p className="text-xs font-bold text-white/55">Pickup and delivery choices happen next.</p>
                </div>
              </div>
            </div>
            <AnimatePresence initial={false}>
              {items.map((item, index) => (
                <CartLineItem
                  key={item.id}
                  item={item}
                  index={index}
                  compact
                  onQuantityChange={(quantity) => updateQuantity(item.product_id, quantity)}
                  onRemove={() => remove(item.product_id)}
                />
              ))}
            </AnimatePresence>
          </>
        ) : (
          <EmptyState
            title="Your cart is empty"
            copy="Add a bestseller, a new arrival, or the pair you keep thinking about."
            action={
              <span className="inline-flex items-center gap-2 text-sm font-black">
                <ShoppingBag className="h-4 w-4" />
                Curated products await
              </span>
            }
          />
        )}
      </div>
    </Drawer>
  );
}
