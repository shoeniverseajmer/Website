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

export function LoginPage({ admin = false }: { admin?: boolean }) {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: admin ? 'admin@comet.test' : 'customer@comet.test', password: 'password' }
  });

  const submit = form.handleSubmit(async (values) => {
    await login(values.email, values.password);
    const user = useAuthStore.getState().user;
    toast.success('Welcome back');
    navigate(admin || user?.role === 'admin' ? '/admin/dashboard' : '/shop');
  });

  return (
    <section className="cosmic-shell grid min-h-[78vh] place-items-center py-10 text-white">
      <div className="container-shell relative z-10 grid place-items-center">
      <div className="cosmic-card grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] md:grid-cols-[0.95fr_1.05fr]">
        <div className="relative hidden min-h-[560px] bg-ink md:block">
          <img src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1100&q=90" alt="Cosmic sneaker login" className="h-full w-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/28 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Comet access</p>
            <h2 className="cosmic-glow-text mt-3 text-4xl font-black leading-tight">Your orbit is waiting.</h2>
          </div>
        </div>
      <form onSubmit={submit} className="cosmic-form p-6 md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">{admin ? 'Operator' : 'Account'}</p>
        <h1 className="mt-2 text-4xl font-black">{admin ? 'Admin login' : 'Welcome back'}</h1>
        <p className="mt-3 text-sm font-bold leading-6 text-white/60">Use Supabase Auth in production. Demo credentials work without configuration.</p>
        <div className="mt-6 grid gap-4">
          <Input label="Email" error={form.formState.errors.email?.message} {...form.register('email')} />
          <Input label="Password" type="password" error={form.formState.errors.password?.message} {...form.register('password')} />
          <Button className="bg-white text-ink hover:bg-cyan-100" type="submit" icon={<ArrowRight className="h-4 w-4" />}>Login</Button>
        </div>
        {!admin ? <p className="mt-5 text-sm text-white/60">New here? <Link to="/signup" className="font-bold text-white underline">Create an account</Link></p> : null}
      </form>
      </div>
      </div>
    </section>
  );
}
