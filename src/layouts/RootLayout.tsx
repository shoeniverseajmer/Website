import { useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartDrawer } from '../components/shop/CartDrawer';
import { PageTransition } from '../components/ui/PageTransition';
import { ResponsiveHeader, UserFooter } from '../components/layout';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

export function RootLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useWishlistStore((state) => state.ids.length);
  const outlet = useOutlet();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bone text-ink">
      <ResponsiveHeader cartCount={cartCount} wishlistCount={wishlistCount} onCartOpen={() => setCartOpen(true)} />
      <main className="min-h-[70vh]">
        <AnimatePresence mode="wait">
          <PageTransition key={`${location.pathname}-${location.search}`}>{outlet}</PageTransition>
        </AnimatePresence>
      </main>
      <UserFooter />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
