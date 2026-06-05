import type { OrderStatus, PaymentStatus } from '../../types';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-ink/8 text-ink',
  success: 'bg-moss-50 text-moss',
  warning: 'bg-gold-50 text-gold-700',
  danger: 'bg-danger-50 text-danger',
  info: 'bg-bone text-ink/70'
};

export function StatusBadge({ value, tone }: { value: string; tone?: Tone }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black capitalize ${toneClasses[tone ?? 'neutral']}`}>
      {value.replace(/_/g, ' ')}
    </span>
  );
}

export const orderStatusTone = (status: OrderStatus): Tone => {
  if (status === 'delivered') return 'success';
  if (status === 'cancelled') return 'danger';
  if (status === 'shipped' || status === 'ready_for_pickup') return 'info';
  if (status === 'packed' || status === 'confirmed') return 'warning';
  return 'neutral';
};

export const paymentStatusTone = (status: PaymentStatus): Tone => {
  if (status === 'paid') return 'success';
  if (status === 'failed' || status === 'refunded') return 'danger';
  return 'warning';
};
