import { motion } from 'framer-motion';
import { Store, Truck } from 'lucide-react';
import type { OrderType, StoreSettings } from '../../types';

export function FulfillmentSelector({
  value,
  onChange,
  settings
}: {
  value: OrderType;
  onChange: (value: OrderType) => void;
  settings?: StoreSettings;
}) {
  const options = ([
    { type: 'delivery', title: 'Delivery', copy: 'Delivered to your address' },
    { type: 'pickup', title: 'Pickup', copy: 'Collect from the flagship studio' }
  ] satisfies Array<{ type: OrderType; title: string; copy: string }>).filter((option) =>
    option.type === 'delivery' ? settings?.delivery_enabled ?? true : settings?.pickup_enabled ?? true
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const Icon = option.type === 'delivery' ? Truck : Store;
        const active = value === option.type;
        return (
          <motion.button
            layout
            key={option.type}
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.type)}
            className={`focus-ring rounded-3xl border p-5 text-left transition ${
              active ? 'border-white bg-white text-ink shadow-[0_0_28px_rgba(120,247,255,0.2)]' : 'border-white/10 bg-white/10 text-white hover:border-white/30'
            }`}
          >
            <Icon className="mb-4 h-6 w-6" />
            <span className="block text-lg font-black">{option.title}</span>
            <span className={`mt-1 block text-sm ${active ? 'text-ink/65' : 'text-white/55'}`}>{option.copy}</span>
            {option.type === 'delivery' && settings?.delivery_charge ? (
              <span className={`mt-3 block text-xs font-black uppercase tracking-[0.16em] ${active ? 'text-ink/50' : 'text-cyan-200/75'}`}>Charge applies</span>
            ) : null}
          </motion.button>
        );
      })}
    </div>
  );
}
