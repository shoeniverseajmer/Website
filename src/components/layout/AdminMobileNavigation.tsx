import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { adminNavLinks } from './navigationConfig';
import { cn } from '../../utils/cn';

export function AdminMobileNavigation({ onLogout }: { onLogout: () => void }) {
  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 border-b border-white/10 bg-ink p-3 text-white lg:hidden"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/95 p-1 shadow-soft ring-1 ring-white/10">
            <img src="/logo.png" alt="Shoniverse" className="h-8 w-8 rounded-full object-contain" />
          </div>
          <div>
            <div className="text-lg font-black">Shoniverse</div>
            <p className="text-xs font-bold text-white/45">Commerce OS</p>
          </div>
        </div>
        <button onClick={onLogout} className="focus-ring grid h-10 w-10 place-items-center rounded-full bg-white/10" aria-label="Logout">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
      <nav className="scrollbar-none flex gap-2 overflow-x-auto" aria-label="Admin mobile navigation">
        {adminNavLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-xs font-black transition',
                isActive ? 'bg-white text-ink' : 'bg-white/10 text-white/70'
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </motion.header>
  );
}
