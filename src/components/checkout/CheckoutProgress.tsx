import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export function CheckoutProgress({ steps }: { steps: Array<{ label: string; value: string; done?: boolean }> }) {
  return (
    <div className="mb-8 grid gap-3 md:grid-cols-3">
      {steps.map((step, index) => (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="cosmic-card rounded-2xl p-4 text-white"
        >
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-black text-ink">
            {step.done ? <Check className="h-4 w-4" /> : index + 1}
          </div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-200/75">{step.label}</p>
          <p className="mt-1 font-black">{step.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
