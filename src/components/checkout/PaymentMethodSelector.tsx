import { Banknote, CreditCard, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import type { PaymentMethod, StoreSettings } from '../../types';

const methods: Array<{ value: PaymentMethod; label: string; copy: string; icon: typeof CreditCard }> = [
  { value: 'cod', label: 'COD', copy: 'Pay at delivery', icon: Banknote },
  { value: 'upi', label: 'UPI', copy: 'Fast mobile payment', icon: QrCode },
  { value: 'razorpay', label: 'Razorpay', copy: 'Cards, wallets, netbanking', icon: CreditCard }
];

export function PaymentMethodSelector({
  value,
  onChange,
  settings
}: {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  settings?: StoreSettings;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {methods
        .filter((method) => settings?.cod_enabled !== false || method.value !== 'cod')
        .map((method) => {
          const Icon = method.icon;
          const active = value === method.value;
          return (
            <motion.button
              layout
              key={method.value}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(method.value)}
              className={`focus-ring rounded-3xl border p-4 text-left transition ${
                active ? 'border-white bg-white text-ink shadow-[0_0_28px_rgba(120,247,255,0.2)]' : 'border-white/10 bg-white/10 text-white hover:border-white/30'
              }`}
            >
              <Icon className="mb-4 h-5 w-5" />
              <span className="block font-black">{method.label}</span>
              <span className={`mt-1 block text-sm ${active ? 'text-ink/65' : 'text-white/55'}`}>{method.copy}</span>
            </motion.button>
          );
        })}
    </div>
  );
}
