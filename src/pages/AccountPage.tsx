import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { LogOut, PackageCheck, Pencil, Phone, Mail, User, X, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/authService';
import { orderService } from '../services/orderService';
import { formatCurrency, toTitleCase } from '../utils/format';

const profileSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  phone: z.string().optional()
});
type ProfileValues = z.infer<typeof profileSchema>;

export function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const [editing, setEditing] = useState(false);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', phone: user?.phone ?? '' }
  });

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.listMine,
    enabled: !!user
  });

  if (!user) return <Navigate to="/login" replace />;

  const saveProfile = form.handleSubmit(async (values) => {
    try {
      const updated = await authService.updateProfile(values);
      setUser({ ...user, ...updated });
      toast.success('Profile updated');
      setEditing(false);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed');
    }
  });

  return (
    <section className="cosmic-shell text-white">
      <div className="container-shell relative z-10 py-8 md:py-12">
        <div className="mb-8">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">My account</p>
          <h1 className="cosmic-glow-text mt-2 text-4xl font-black md:text-6xl">Profile</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Profile card */}
          <div className="cosmic-card h-fit rounded-[1.5rem] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-black text-lg">Personal info</h2>
              {!editing ? (
                <button
                  onClick={() => { form.reset({ name: user.name, phone: user.phone ?? '' }); setEditing(true); }}
                  className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black transition hover:bg-white/20"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditing(false)}
                    className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/10 transition hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={form.formState.isSubmitting}
                    className="grid h-8 w-8 place-items-center rounded-full bg-white text-ink transition hover:bg-cyan-100 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {editing ? (
              <form onSubmit={saveProfile} className="space-y-4">
                <Input label="Name" error={form.formState.errors.name?.message} {...form.register('name')} />
                <Input label="Phone" type="tel" placeholder="+91 98765 43210" error={form.formState.errors.phone?.message} {...form.register('phone')} />
              </form>
            ) : (
              <dl className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                  <div>
                    <dt className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Name</dt>
                    <dd className="mt-0.5 font-bold">{user.name}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                  <div>
                    <dt className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Email</dt>
                    <dd className="mt-0.5 font-bold break-all">{user.email}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
                  <div>
                    <dt className="text-xs font-black uppercase tracking-[0.16em] text-white/42">Phone</dt>
                    <dd className="mt-0.5 font-bold">{user.phone || <span className="text-white/35">Not added</span>}</dd>
                  </div>
                </div>
              </dl>
            )}

            <div className="mt-6 border-t border-white/10 pt-5">
              <button
                onClick={async () => { await logout(); }}
                className="flex w-full items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white/70 transition hover:bg-danger/10 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>

          {/* Orders */}
          <div>
            <h2 className="mb-4 text-lg font-black">Order history</h2>
            {isLoading ? (
              <p className="text-sm font-bold text-white/50">Loading orders…</p>
            ) : orders.length ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <article key={order.id} className="cosmic-card rounded-[1.5rem] p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-ink">
                          <PackageCheck className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-black">#{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-sm text-white/55">
                            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {' · '}{toTitleCase(order.order_type)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black">{formatCurrency(order.total_amount)}</p>
                        <p className="text-sm capitalize text-white/55">{order.order_status.replace(/_/g, ' ')}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No orders yet"
                copy="Your completed purchases will appear here."
                action={<Button><Link to="/shop">Shop now</Link></Button>}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
