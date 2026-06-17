import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Menu, Search, ShoppingBag, User } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { DesktopNavigation } from './DesktopNavigation';
import { GlobalSearchBar } from './GlobalSearchBar';
import { MobileNavigation } from './MobileNavigation';
import { useAuthStore } from '../../store/authStore';

export function ResponsiveHeader({
  cartCount,
  wishlistCount,
  onCartOpen
}: {
  cartCount: number;
  wishlistCount: number;
  onCartOpen: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const accountHref = user ? (user.role === 'admin' ? '/admin/dashboard' : '/account') : '/login';

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050507]/95 text-white shadow-[0_12px_50px_rgba(0,0,0,0.45)] backdrop-blur-3xl">
        <motion.div
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="container-shell flex h-[72px] items-center justify-between gap-4"
        >
          <Link to="/" className="flex shrink-0 items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-white/95 p-1 shadow-soft ring-1 ring-white/10">
              <img src="/logo.png" alt="Shoniverse" className="h-10 w-10 rounded-full object-contain" />
            </span>
            <span className="cosmic-glow-text hidden text-2xl font-black uppercase tracking-[0.08em] sm:block">Shoniverse</span>
          </Link>

          <DesktopNavigation />

          <div className="hidden flex-1 justify-center xl:flex">
            <GlobalSearchBar compact />
          </div>

          <div className="flex items-center gap-2">
            <button
              className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 shadow-sm backdrop-blur transition hover:bg-white hover:text-ink xl:hidden"
              onClick={() => setSearchOpen((value) => !value)}
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link to="/wishlist" className="focus-ring relative hidden h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 shadow-sm backdrop-blur transition hover:bg-white hover:text-ink sm:grid" title="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount ? <span className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-clay px-1 text-center text-[10px] font-bold text-white">{wishlistCount}</span> : null}
            </Link>
            <button className="focus-ring relative grid h-10 w-10 place-items-center rounded-full bg-white text-ink shadow-[0_0_28px_rgba(120,247,255,0.24)]" onClick={onCartOpen} title="Cart">
              <ShoppingBag className="h-5 w-5" />
              {cartCount ? <span className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-gold px-1 text-center text-[10px] font-black leading-5 text-ink">{cartCount}</span> : null}
            </button>
            <Link to={accountHref} className="focus-ring hidden h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 shadow-sm backdrop-blur transition hover:bg-white hover:text-ink sm:grid" title="Account">
              <User className="h-5 w-5" />
            </Link>
            <button className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/10 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open mobile menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
        <AnimatePresence>
          {searchOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="container-shell overflow-hidden pb-4 xl:hidden"
            >
              <GlobalSearchBar autoFocus onSearch={() => setSearchOpen(false)} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
      <MobileNavigation open={mobileOpen} onClose={() => setMobileOpen(false)} cartCount={cartCount} wishlistCount={wishlistCount} />
    </>
  );
}
