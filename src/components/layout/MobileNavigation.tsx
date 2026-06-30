import { AnimatePresence, motion } from 'framer-motion';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Instagram, MapPin, X } from 'lucide-react';
import { GlobalSearchBar } from './GlobalSearchBar';
import { User } from 'lucide-react';
import { mobilePrimaryLinks, userNavLinks } from './navigationConfig';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';

export function MobileNavigation({
  open,
  onClose,
  cartCount,
  wishlistCount
}: {
  open: boolean;
  onClose: () => void;
  cartCount: number;
  wishlistCount: number;
}) {
  const user = useAuthStore((state) => state.user);
  const accountHref = user ? (user.role === 'admin' ? '/admin/dashboard' : '/account') : '/login';
  const location = useLocation();
  const allLinks = user
    ? [...userNavLinks, { to: '/account', label: 'ACCOUNT', icon: User }]
    : userNavLinks;
  const current = `${location.pathname}${location.search}`;

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button className="absolute inset-0 bg-ink/45 backdrop-blur-sm" onClick={onClose} aria-label="Close mobile navigation" />
            <motion.aside
              initial={{ y: -24, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -18, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="cosmic-shell absolute left-3 right-3 top-3 overflow-hidden rounded-[2rem] text-white shadow-luxe ring-1 ring-white/15"
            >
              <div className="relative z-10 flex items-center justify-between border-b border-white/10 p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-white/95 p-1 shadow-soft ring-1 ring-white/10">
                    <img src="/logo.png" alt="Shoeniverse" className="h-9 w-9 rounded-full object-contain" />
                  </span>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-200">Menu</p>
                  <h2 className="cosmic-glow-text text-2xl font-black tracking-[0.08em]">Shoeniverse</h2>
                </div>
                <button className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-white text-ink" onClick={onClose}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="relative z-10 space-y-5 p-4">
                <GlobalSearchBar autoFocus onSearch={onClose} />
                <nav className="grid gap-2" aria-label="Mobile menu">
                  {allLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive = link.to.includes('?') ? current === link.to : location.pathname === link.to && !location.search.includes('sale=true') && !location.search.includes('bestseller=true');
                    return (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={onClose}
                        className={cn(
                          'flex min-h-14 items-center justify-between rounded-2xl px-4 text-base font-black transition',
                          isActive ? 'bg-white text-ink' : 'border border-white/10 bg-white/10 text-white hover:bg-white/18'
                        )}
                      >
                        <span>{link.label}</span>
                        <Icon className="h-5 w-5" />
                      </Link>
                    );
                  })}
                </nav>
                <div className="grid gap-2">
                  <a
                    href="https://share.google/sBASapABqQlWChE2U"
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-12 items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-black text-white/70 transition hover:bg-white/18"
                  >
                    <span>Location</span>
                    <MapPin className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.instagram.com/theuniverseof.shoes?igsh=MW9mczIxMXZ5NjFpNQ%3D%3D"
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-12 items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-black text-white/70 transition hover:bg-white/18"
                  >
                    <span>Instagram</span>
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <nav className="fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-full border border-white/15 bg-[#050507]/88 p-1 text-white shadow-luxe backdrop-blur-2xl lg:hidden" aria-label="Mobile quick navigation">
        {mobilePrimaryLinks.map((link) => {
          const to = link.label === 'Account' ? accountHref : link.to;
          const Icon = link.icon;
          const count = link.to === '/wishlist' ? wishlistCount : link.to === '/cart' ? cartCount : 0;
          return (
            <NavLink
              key={link.to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'relative grid h-12 place-items-center rounded-full text-[10px] font-black transition',
                  isActive ? 'bg-white text-ink' : 'text-white/58'
                )
              }
            >
              <Icon className="h-5 w-5" />
              {count ? <span className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-gold px-1 text-[9px] leading-4 text-ink">{count}</span> : null}
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
