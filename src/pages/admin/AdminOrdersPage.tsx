import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { AdminTable } from '../../components/admin/AdminTable';
import { StatusBadge, orderStatusTone, paymentStatusTone } from '../../components/admin/StatusBadge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { toast } from '../../components/ui/Toast';
import { orderService } from '../../services/orderService';
import { formatCurrency, toTitleCase } from '../../utils/format';
import type { OrderStatus } from '../../types';

const statuses: OrderStatus[] = ['placed', 'confirmed', 'packed', 'shipped', 'ready_for_pickup', 'delivered', 'cancelled'];
type OrderView = 'all' | OrderStatus;

export function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<OrderView>('all');
  const { data: orders = [], refetch } = useQuery({ queryKey: ['admin-orders'], queryFn: orderService.adminList });

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = search.toLowerCase();
      const matchesSearch = query
        ? [order.id, order.order_type, order.payment_method, order.payment_status, order.order_status]
            .some((value) => String(value).toLowerCase().includes(query))
        : true;
      const matchesView = view === 'all' || order.order_status === view;
      return matchesSearch && matchesView;
    });
  }, [orders, search, view]);

  const updateStatus = async (orderId: string, order_status: OrderStatus) => {
    await orderService.updateStatus(orderId, order_status);
    toast.success('Order status updated');
    refetch();
  };

  return (
    <div>
      <AdminPageHeader
        eyebrow="Operations"
        title="Orders"
        copy="Track fulfillment, payment status, and operational next steps from one command table."
      />

      <div className="mb-5 grid gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-ink/5 lg:grid-cols-[1fr_240px]">
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          leftIcon={<Search className="h-4 w-4" />}
          placeholder="Search order id, payment, status"
          aria-label="Search orders"
        />
        <Select value={view} onChange={(event) => setView(event.target.value as OrderView)} aria-label="Filter order status">
          <option value="all">All statuses</option>
          {statuses.map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}
        </Select>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        {[
          ['Total', orders.length],
          ['Open', orders.filter((order) => !['delivered', 'cancelled'].includes(order.order_status)).length],
          ['Pickup', orders.filter((order) => order.order_type === 'pickup').length],
          ['Delivery', orders.filter((order) => order.order_type === 'delivery').length]
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-ink/40">{label}</p>
            <p className="mt-2 text-2xl font-black">{value}</p>
          </div>
        ))}
      </div>

      <AdminTable headers={['Order', 'Created', 'Type', 'Payment', 'Total', 'Status']} minWidth={980}>
        {filteredOrders.map((order) => (
          <tr key={order.id}>
            <td className="px-4 py-4">
              <p className="font-black">#{order.id}</p>
              <p className="text-xs text-ink/45">{order.order_items?.length ?? 0} items</p>
            </td>
            <td className="px-4 py-3">
              <p className="font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
              <p className="text-xs text-ink/45">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </td>
            <td className="px-4 py-3">
              <StatusBadge value={toTitleCase(order.order_type)} tone={order.order_type === 'pickup' ? 'info' : 'neutral'} />
            </td>
            <td className="px-4 py-3">
              <div className="grid gap-1">
                <span className="text-sm font-black uppercase">{order.payment_method}</span>
                <StatusBadge value={order.payment_status} tone={paymentStatusTone(order.payment_status)} />
              </div>
            </td>
            <td className="px-4 py-3 font-black">{formatCurrency(order.total_amount)}</td>
            <td className="px-4 py-3">
              <div className="flex min-w-[220px] items-center gap-2">
                <StatusBadge value={order.order_status} tone={orderStatusTone(order.order_status)} />
                <Select
                  value={order.order_status}
                  onChange={(event) => updateStatus(order.id, event.target.value as OrderStatus)}
                  aria-label="Update order status"
                  className="min-h-10 py-2"
                >
                  {statuses.map((status) => <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>)}
                </Select>
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
