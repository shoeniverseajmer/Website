import { useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AdminMobileNavigation, AdminSidebar } from '../components/layout';
import { PageTransition } from '../components/ui/PageTransition';
import { useAuthStore } from '../store/authStore';

export function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const outlet = useOutlet();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-ink lg:grid" style={{ gridTemplateColumns: collapsed ? '96px 1fr' : '280px 1fr' }}>
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} onLogout={logout} />
      <div className="min-w-0">
        <AdminMobileNavigation onLogout={logout} />
        <main className="p-4 pb-10 sm:p-5 lg:p-8">
          <AnimatePresence mode="wait">
            <PageTransition key={`${location.pathname}-${location.search}`}>{outlet}</PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
