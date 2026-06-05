import { useQuery } from '@tanstack/react-query';
import { PackageCheck } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { orderService } from '../services/orderService';
import { formatCurrency, toTitleCase } from '../utils/format';

export function OrdersPage() {
  const { data = [], isLoading } = useQuery({ queryKey: ['orders'], queryFn: orderService.listMine });

  return (
    <section className="cosmic-shell text-white">
      <div className="container-shell relative z-10 py-8 md:py-12">
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Mission history</p>
        <h1 className="cosmic-glow-text mt-2 text-4xl font-black md:text-6xl">Orders</h1>
      </div>
      {isLoading ? <p className="font-bold text-white/60">Loading orders...</p> : null}
      <div className="space-y-4">
        {data.map((order) => (
          <article key={order.id} className="cosmic-card rounded-[1.5rem] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white text-ink">
                  <PackageCheck className="h-5 w-5" />
                </div>
                <div>
                <h2 className="font-black">#{order.id}</h2>
                <p className="text-sm text-white/60">{new Date(order.created_at).toLocaleDateString()} · {toTitleCase(order.order_type)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black">{formatCurrency(order.total_amount)}</p>
                <p className="text-sm capitalize text-white/60">{order.order_status.replace(/_/g, ' ')}</p>
              </div>
            </div>
          </article>
        ))}
        {!data.length && !isLoading ? <EmptyState title="No orders yet" copy="Your completed purchases will appear here." /> : null}
      </div>
      </div>
    </section>
  );
}
