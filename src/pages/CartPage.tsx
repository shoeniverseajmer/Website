import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, PackageCheck, Sparkles, Truck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { CartLineItem } from '../components/cart/CartLineItem';
import { OrderSummary } from '../components/cart/OrderSummary';
import { useCartStore } from '../store/cartStore';

export function CartPage() {
  const { items, remove, updateQuantity } = useCartStore();
  const subtotal = items.reduce((sum, item) => sum + (item.product.sale_price ?? item.product.price) * item.quantity, 0);
  const total = subtotal;

  return (
    <section className="cosmic-shell text-white">
      <div className="container-shell relative z-10 py-8 md:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Your capsule</p>
          <h1 className="cosmic-glow-text mt-2 text-4xl font-black md:text-6xl">Cart</h1>
          <p className="mt-3 max-w-xl text-sm font-bold leading-6 text-white/58">Review quantities, remove items, then choose delivery or pickup in checkout.</p>
        </div>
        <Button className="border-white/15 bg-white/10 text-white hover:bg-white hover:text-ink" icon={<ArrowLeft className="h-4 w-4" />}>
          <Link to="/shop">Continue shopping</Link>
        </Button>
      </div>

      {items.length ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_390px]">
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="cosmic-card rounded-[1.5rem] p-5">
                <Sparkles className="mb-4 h-5 w-5 text-cyan-200" />
                <p className="font-black">Cosmic checkout flow</p>
                <p className="mt-1 text-sm leading-6 text-white/58">Fast fulfillment selection, coupon support, and payment method choice.</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="cosmic-card rounded-[1.5rem] p-5">
                <div className="mb-4 flex gap-3">
                  <Truck className="h-5 w-5 text-cyan-200" />
                  <PackageCheck className="h-5 w-5 text-cyan-200" />
                </div>
                <p className="font-black">Delivery or pickup</p>
                <p className="mt-1 text-sm leading-6 text-white/58">Store settings decide which fulfillment options appear at checkout.</p>
              </motion.div>
            </div>

            <AnimatePresence initial={false}>
              {items.map((item, index) => (
                <CartLineItem
                  key={item.id}
                  item={item}
                  index={index}
                  onQuantityChange={(quantity) => updateQuantity(item.product_id, quantity)}
                  onRemove={() => remove(item.product_id)}
                />
              ))}
            </AnimatePresence>
          </div>

          <OrderSummary
            items={items}
            subtotal={subtotal}
            deliveryCharge={0}
            discount={0}
            total={total}
            compact
            ctaLabel="Continue to checkout"
          />
        </div>
      ) : (
        <EmptyState
          title="Your cart is empty"
          copy="Add a product from the collection to start checkout."
          action={
            <Button>
              <Link to="/shop">Explore collection</Link>
            </Button>
          }
        />
      )}
      </div>
    </section>
  );
}
