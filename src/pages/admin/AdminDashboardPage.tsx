import { useQuery } from '@tanstack/react-query';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, Boxes, IndianRupee, PackageCheck, Settings, Sparkles, Star, Tag, Truck } from 'lucide-react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { MetricCard } from '../../components/admin/MetricCard';
import { StatusBadge, orderStatusTone } from '../../components/admin/StatusBadge';
import { adminService } from '../../services/adminService';
import { orderService } from '../../services/orderService';
import { formatCurrency } from '../../utils/format';

export function AdminDashboardPage() {
  const { data: products = [] } = useQuery({ queryKey: ['admin-products'], queryFn: adminService.products });
  const { data: orders = [] } = useQuery({ queryKey: ['admin-orders'], queryFn: orderService.adminList });
  const { data: settings } = useQuery({ queryKey: ['admin-settings'], queryFn: adminService.settings });

  const revenue = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const activeProducts = products.filter((product) => product.is_active).length;
  const lowStock = products.filter((product) => product.stock <= 10).length;
  const saleProducts = products.filter((product) => product.is_on_sale).length;
  const openOrders = orders.filter((order) => !['delivered', 'cancelled'].includes(order.order_status)).length;

  const statusData = ['placed', 'confirmed', 'packed', 'shipped', 'ready_for_pickup', 'delivered', 'cancelled'].map((status) => ({
    name: status.replace(/_/g, ' '),
    value: orders.filter((order) => order.order_status === status).length
  }));

  const salesData = Array.from({ length: 7 }).map((_, index) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - index));
    const dayOrders = orders.filter((order) => new Date(order.created_at).toDateString() === day.toDateString());
    return {
      day: day.toLocaleDateString('en-IN', { weekday: 'short' }),
      revenue: dayOrders.reduce((sum, order) => sum + order.total_amount, 0),
      orders: dayOrders.length
    };
  });

  const topProducts = [...products]
    .sort((a, b) => Number(b.is_bestseller) - Number(a.is_bestseller) || b.stock - a.stock)
    .slice(0, 5);

  return (
    <div>
      <AdminPageHeader
        eyebrow="Operator overview"
        title="Dashboard"
        copy="A live command center for revenue, orders, merchandising, stock, and fulfillment controls."
        action={<div className="rounded-full bg-white px-4 py-2 text-sm font-black shadow-sm ring-1 ring-ink/5">Live snapshot</div>}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Revenue" value={formatCurrency(revenue)} icon={<IndianRupee className="h-5 w-5" />} trend="+12.4%" tone="positive" />
        <MetricCard label="Open orders" value={String(openOrders)} icon={<PackageCheck className="h-5 w-5" />} trend="Needs action" tone="warning" />
        <MetricCard label="Active products" value={String(activeProducts)} icon={<Boxes className="h-5 w-5" />} trend={`${products.length} total`} />
        <MetricCard label="Low stock" value={String(lowStock)} icon={<AlertTriangle className="h-5 w-5" />} trend="Review" tone={lowStock ? 'warning' : 'positive'} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black">Revenue trend</h2>
              <p className="mt-1 text-sm text-ink/55">Last 7 days based on order creation date.</p>
            </div>
            <StatusBadge value={`${orders.length} orders`} tone="info" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#111111" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#111111" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ece8df" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="revenue" stroke="#111111" strokeWidth={3} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
          <h2 className="text-xl font-black">Order status</h2>
          <p className="mt-1 text-sm text-ink/55">Operational distribution.</p>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} layout="vertical" margin={{ left: 22 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={104} tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={entry.name} fill={index % 2 === 0 ? '#111111' : '#5d7560'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink/5 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-black">Merchandising pulse</h2>
            <StatusBadge value={`${saleProducts} sale`} tone="warning" />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {topProducts.map((product) => (
              <div key={product.id} className="flex items-center gap-3 rounded-2xl bg-bone p-3">
                <img src={product.product_images?.[0]?.image_url} alt={product.name} className="h-14 w-14 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-black">{product.name}</p>
                  <p className="text-xs font-bold text-ink/50">Stock {product.stock}</p>
                </div>
                <div className="flex gap-1">
                  {product.is_bestseller ? <Star className="h-4 w-4 fill-gold text-gold" /> : null}
                  {product.is_on_sale ? <Tag className="h-4 w-4 text-clay" /> : null}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-ink p-5 text-white shadow-luxe">
          <h2 className="text-xl font-black">Store controls</h2>
          <div className="mt-5 grid gap-3">
            {[
              [Truck, 'Delivery', settings?.delivery_enabled ? 'Enabled' : 'Off'],
              [Sparkles, 'Pickup', settings?.pickup_enabled ? 'Enabled' : 'Off'],
              [Settings, 'COD', settings?.cod_enabled ? 'Enabled' : 'Off']
            ].map(([Icon, label, value]) => (
              <div key={String(label)} className="flex items-center justify-between rounded-2xl bg-white/8 p-3">
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 text-gold" />
                  <span className="font-bold">{String(label)}</span>
                </div>
                <span className="text-sm font-black text-white/55">{String(value)}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink/5">
        <h2 className="mb-4 text-xl font-black">Recent orders</h2>
        <div className="grid gap-3">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-bone p-4">
              <div>
                <p className="font-black">#{order.id}</p>
                <p className="text-sm text-ink/55">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <StatusBadge value={order.order_status} tone={orderStatusTone(order.order_status)} />
              <p className="font-black">{formatCurrency(order.total_amount)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
