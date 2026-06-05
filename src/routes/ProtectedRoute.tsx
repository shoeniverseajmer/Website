import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function ProtectedRoute({ admin = false }: { admin?: boolean }) {
  const user = useAuthStore((state) => state.user);
  const allowAdminBypass = admin && import.meta.env.DEV && import.meta.env.VITE_ADMIN_BYPASS === 'true';

  if (!user) {
    if (allowAdminBypass) return <Outlet />;
    return <Navigate to={admin ? '/admin/login' : '/login'} replace />;
  }
  if (admin && user.role !== 'admin' && user.role !== 'operator' && !allowAdminBypass) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}
