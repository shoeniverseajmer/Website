import { NavLink } from 'react-router-dom';
import { LogOut, PanelLeftClose, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { adminNavLinks } from './navigationConfig';
import { cn } from '../../utils/cn';

export function AdminSidebar({
  collapsed,
  onToggle,
  onLogout
}: {
  collapsed: boolean;
  onToggle: () => void;
  onLogout: () => void;
}) {
  return (
    <motion.aside
      initial={{ x: -18, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'hidden min-h-screen border-r border-white/10 bg-ink p-4 text-white lg:sticky lg:top-0 lg:block',
        collapsed ? 'lg:w-[96px]' : 'lg:w-[280px]'
      )}
    >
      <div className={cn('mb-8 rounded-3xl border border-white/10 bg-white/5 p-4', collapsed && 'p-3')}>
        <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/95 p-1 shadow-soft ring-1 ring-white/10">
            <img src="/logo.png" alt="Shoeniverse" className="h-9 w-9 rounded-full object-contain" />
          </div>
          {!collapsed ? (
            <div className="min-w-0">
              <div className="truncate text-xl font-black">Shoeniverse</div>
              <p className="text-xs font-bold text-white/45">Commerce OS</p>
            </div>
          ) : null}
        </div>
      </div>

      <nav className="grid gap-2" aria-label="Admin navigation">
        {adminNavLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'group relative inline-flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-black transition',
                collapsed && 'justify-center px-0',
                isActive ? 'bg-white text-ink shadow-soft' : 'text-white/62 hover:bg-white/10 hover:text-white'
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed ? <span>{label}</span> : null}
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4 right-4 grid gap-2">
        <button
          onClick={onToggle}
          className={cn(
            'inline-flex min-h-11 items-center gap-3 rounded-2xl px-4 text-sm font-black text-white/62 transition hover:bg-white/10 hover:text-white',
            collapsed && 'justify-center px-0'
          )}
        >
          <PanelLeftClose className={cn('h-4 w-4 transition', collapsed && 'rotate-180')} />
          {!collapsed ? 'Collapse' : null}
        </button>
        <button
          onClick={onLogout}
          className={cn(
            'inline-flex min-h-11 items-center gap-3 rounded-2xl px-4 text-sm font-black text-white/62 transition hover:bg-white/10 hover:text-white',
            collapsed && 'justify-center px-0'
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed ? 'Logout' : null}
        </button>
      </div>
    </motion.aside>
  );
}
