import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userNavLinks } from './navigationConfig';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../utils/cn';

export function DesktopNavigation() {
  const location = useLocation();
  const current = `${location.pathname}${location.search}`;
  const user = useAuthStore((state) => state.user);

  const links = user
    ? [...userNavLinks, { to: '/account', label: 'ACCOUNT' }]
    : userNavLinks;

  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
      {links.map((link) => {
        const isActive = link.to.includes('?')
          ? current === link.to
          : location.pathname === link.to &&
            !location.search.includes('sale=true') &&
            !location.search.includes('bestseller=true');
        return (
          <Link key={link.to} to={link.to}>
            <motion.span
              whileHover={{ y: -1 }}
              className={cn(
                'relative inline-flex min-h-10 items-center rounded-full px-3 text-xs font-black transition xl:px-4',
                isActive ? 'text-white' : 'text-white/62 hover:bg-white/10 hover:text-white'
              )}
            >
              {link.label}
              {isActive ? (
                <motion.span
                  layoutId="desktop-nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-white/12 shadow-sm ring-1 ring-white/15"
                />
              ) : null}
            </motion.span>
          </Link>
        );
      })}
    </nav>
  );
}
