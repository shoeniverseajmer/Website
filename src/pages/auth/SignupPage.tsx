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
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

type Values = z.infer<typeof schema>;

export function SignupPage() {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);
  const form = useForm<Values>({ resolver: zodResolver(schema) });

  const submit = form.handleSubmit(async (values) => {
    await signup(values.name, values.email, values.password);
    toast.success('Account created');
    navigate('/shop');
  });

  return (
    <section className="cosmic-shell grid min-h-[78vh] place-items-center py-10 text-white">
      <div className="container-shell relative z-10 grid place-items-center">
      <form onSubmit={submit} className="cosmic-card cosmic-form w-full max-w-lg rounded-[1.75rem] p-6 md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Join Comet</p>
        <h1 className="cosmic-glow-text mt-2 text-4xl font-black">Create account</h1>
        <p className="mt-3 text-sm font-bold leading-6 text-white/60">Save products, checkout faster, and track your orders.</p>
        <div className="mt-6 grid gap-4">
          <Input label="Name" error={form.formState.errors.name?.message} {...form.register('name')} />
          <Input label="Email" error={form.formState.errors.email?.message} {...form.register('email')} />
          <Input label="Password" type="password" error={form.formState.errors.password?.message} {...form.register('password')} />
          <Button className="bg-white text-ink hover:bg-cyan-100" type="submit" icon={<ArrowRight className="h-4 w-4" />}>Signup</Button>
        </div>
        <p className="mt-5 text-sm text-white/60">Already have an account? <Link to="/login" className="font-bold text-white underline">Login</Link></p>
      </form>
      </div>
    </section>
  );
}
