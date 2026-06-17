import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(user?.role === 'admin' ? '/admin/dashboard' : '/shop', { replace: true });
    }, 800);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  return (
    <section className="cosmic-shell grid min-h-screen place-items-center text-white">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white" />
        <p className="text-sm font-bold text-white/60">Signing you in…</p>
      </div>
    </section>
  );
}
