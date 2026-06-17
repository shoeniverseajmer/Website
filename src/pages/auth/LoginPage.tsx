import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type Values = z.infer<typeof schema>;

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export function LoginPage({ admin = false }: { admin?: boolean }) {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const submit = form.handleSubmit(async (values) => {
    try {
      await login(values.email, values.password);
      const user = useAuthStore.getState().user;
      toast.success('Welcome back');
      navigate(admin || user?.role === 'admin' ? '/admin/dashboard' : '/shop');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    }
  });

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Google sign-in failed');
    }
  };

  return (
    <section className="cosmic-shell grid min-h-[78vh] place-items-center py-10 text-white">
      <div className="container-shell relative z-10 grid place-items-center">
      <div className="cosmic-card grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] md:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden min-h-[560px] bg-ink md:block">
          <img src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1100&q=90" alt="Cosmic sneaker login" className="h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/28 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Shoniverse access</p>
            <h2 className="cosmic-glow-text mt-3 text-4xl font-black leading-tight">Your orbit is waiting.</h2>
          </div>
        </div>
        <form onSubmit={submit} className="cosmic-form p-6 md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">{admin ? 'Operator' : 'Account'}</p>
          <h1 className="mt-2 text-4xl font-black">{admin ? 'Admin login' : 'Welcome back'}</h1>
          <div className="mt-6 grid gap-4">
            <Input label="Email" autoComplete="email" error={form.formState.errors.email?.message} {...form.register('email')} />
            <Input label="Password" type="password" autoComplete="current-password" error={form.formState.errors.password?.message} {...form.register('password')} />
            <Button className="bg-white text-ink hover:bg-cyan-100" type="submit" icon={<ArrowRight className="h-4 w-4" />} disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Signing in…' : 'Login'}
            </Button>
          </div>
          {!admin ? (
            <>
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/15" />
                <span className="text-xs font-bold text-white/40">or</span>
                <div className="h-px flex-1 bg-white/15" />
              </div>
              <button
                type="button"
                onClick={handleGoogle}
                className="focus-ring flex w-full items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white transition hover:bg-white/20"
              >
                <GoogleIcon />
                Continue with Google
              </button>
              <p className="mt-5 text-sm text-white/60">
                New here? <Link to="/signup" className="font-bold text-white underline">Create an account</Link>
              </p>
            </>
          ) : null}
        </form>
      </div>
      </div>
    </section>
  );
}
