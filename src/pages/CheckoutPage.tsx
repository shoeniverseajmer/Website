import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, MapPin, PackageCheck, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { toast } from '../components/ui/Toast';
import { OrderSummary } from '../components/cart/OrderSummary';
import { CheckoutProgress } from '../components/checkout/CheckoutProgress';
import { CouponBox } from '../components/checkout/CouponBox';
import { FulfillmentSelector } from '../components/checkout/FulfillmentSelector';
import { PaymentMethodSelector } from '../components/checkout/PaymentMethodSelector';
import { useStoreSettings } from '../hooks/useStoreSettings';
import { orderService } from '../services/orderService';
import { useCartStore } from '../store/cartStore';
import type { OrderType, PaymentMethod } from '../types';

const checkoutSchema = z.object({
  full_name: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  payment_method: z.enum(['cod', 'razorpay', 'upi'])
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

const deliveryFields: Array<keyof CheckoutValues> = ['full_name', 'phone', 'address', 'city', 'state', 'pincode'];

export function CheckoutPage() {
  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [couponCode, setCouponCode] = useState<string | undefined>();
  const { data: settings } = useStoreSettings();
  const { items, clear } = useCartStore();
  const navigate = useNavigate();
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { payment_method: 'cod' }
  });
  const selectedPayment = form.watch('payment_method');

  const availableOrderTypes = useMemo(() => {
    const values: OrderType[] = [];
    if (settings?.delivery_enabled ?? true) values.push('delivery');
    if (settings?.pickup_enabled ?? true) values.push('pickup');
    return values;
  }, [settings]);

  useEffect(() => {
    if (!availableOrderTypes.length) return;
    if (!availableOrderTypes.includes(orderType)) setOrderType(availableOrderTypes[0]);
  }, [availableOrderTypes, orderType]);

  useEffect(() => {
    if (settings?.cod_enabled === false && selectedPayment === 'cod') {
      form.setValue('payment_method', 'upi');
    }
  }, [form, selectedPayment, settings?.cod_enabled]);

  const subtotal = items.reduce((sum, item) => sum + (item.product.sale_price ?? item.product.price) * item.quantity, 0);
  const deliveryCharge = orderType === 'delivery' ? settings?.delivery_charge ?? 0 : 0;
  const discount = couponCode === 'SHONI10' ? Math.round(subtotal * 0.1) : couponCode === 'SAVE500' ? Math.min(500, subtotal) : 0;
  const total = Math.max(0, subtotal + deliveryCharge - discount);

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      toast.error('Enter a coupon code');
      return;
    }
    if (!['SHONI10', 'SAVE500'].includes(normalized)) {
      toast.error('Coupon is not valid');
      return;
    }
    setCouponCode(normalized);
    toast.success(`${normalized} applied`);
  };

  const removeCoupon = () => {
    setCouponCode(undefined);
    toast.info('Coupon removed');
  };

  const submit = form.handleSubmit(async (values) => {
    if (!items.length) {
      toast.error('Cart is empty');
      return;
    }
    if (orderType === 'delivery') {
      const missing = deliveryFields.filter((field) => !values[field]?.trim());
      if (missing.length) {
        toast.error('Complete the delivery address');
        return;
      }
    }

    await orderService.create({
      items,
      order_type: orderType,
      payment_method: values.payment_method as PaymentMethod,
      total_amount: total,
      address:
        orderType === 'delivery'
          ? {
              full_name: values.full_name ?? '',
              phone: values.phone ?? '',
              address: values.address ?? '',
              city: values.city ?? '',
              state: values.state ?? '',
              pincode: values.pincode ?? ''
            }
          : undefined
    });
    clear();
    toast.success('Order placed');
    navigate('/orders');
  });

  if (!items.length) {
    return (
      <section className="cosmic-shell text-white">
        <div className="container-shell relative z-10 py-12">
        <EmptyState
          title="Your cart is empty"
          copy="Add a premium pair before starting checkout."
          action={
            <Button>
              <Link to="/shop">Shop now</Link>
            </Button>
          }
        />
        </div>
      </section>
    );
  }

  return (
    <section className="cosmic-shell text-white">
      <div className="container-shell relative z-10 py-8 md:py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-200">Secure checkout</p>
          <h1 className="cosmic-glow-text mt-2 text-4xl font-black md:text-6xl">Complete your order</h1>
          <p className="mt-3 max-w-2xl text-sm font-bold leading-6 text-white/58">
            Choose delivery or pickup, apply a coupon, and select a payment method. The summary updates instantly.
          </p>
        </div>
        <Button className="border-white/15 bg-white/10 text-white hover:bg-white hover:text-ink">
          <Link to="/cart">Back to cart</Link>
        </Button>
      </div>

      <CheckoutProgress
        steps={[
          { label: 'Bag', value: 'Reviewed', done: true },
          { label: 'Fulfillment', value: orderType === 'delivery' ? 'Delivery' : 'Pickup', done: true },
          { label: 'Payment', value: selectedPayment.toUpperCase() }
        ]}
      />

      <form onSubmit={submit} className="cosmic-form grid gap-6 lg:grid-cols-[1fr_410px]">
        <div className="space-y-6">
          <motion.section layout className="cosmic-card rounded-[1.5rem] p-5 md:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
              <PackageCheck className="h-5 w-5" />
              Delivery or pickup
            </h2>
            {availableOrderTypes.length ? (
              <FulfillmentSelector value={orderType} onChange={setOrderType} settings={settings} />
            ) : (
              <div className="rounded-2xl bg-danger-50 p-4 text-sm font-bold text-danger">Fulfillment is currently unavailable.</div>
            )}
            <AnimatePresence mode="wait">
              {orderType === 'pickup' ? (
                <motion.div
                  key="pickup-note"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm font-bold leading-6 text-white/62"
                >
                  Pickup address: {settings?.pickup_address}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.section>

          <AnimatePresence mode="wait">
            {orderType === 'delivery' ? (
              <motion.section
                key="delivery-address"
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                className="cosmic-card rounded-[1.5rem] p-5 md:p-6"
              >
                <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
                  <MapPin className="h-5 w-5" />
                  Delivery address
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Full name" autoComplete="name" error={form.formState.errors.full_name?.message} {...form.register('full_name')} />
                  <Input label="Phone" autoComplete="tel" error={form.formState.errors.phone?.message} {...form.register('phone')} />
                  <Input label="Address" containerClassName="md:col-span-2" autoComplete="street-address" error={form.formState.errors.address?.message} {...form.register('address')} />
                  <Input label="City" autoComplete="address-level2" error={form.formState.errors.city?.message} {...form.register('city')} />
                  <Input label="State" autoComplete="address-level1" error={form.formState.errors.state?.message} {...form.register('state')} />
                  <Input label="Pincode" autoComplete="postal-code" error={form.formState.errors.pincode?.message} {...form.register('pincode')} />
                </div>
              </motion.section>
            ) : null}
          </AnimatePresence>

          <motion.section layout className="cosmic-card rounded-[1.5rem] p-5 md:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
              <CreditCard className="h-5 w-5" />
              Payment method
            </h2>
            <PaymentMethodSelector value={selectedPayment} onChange={(value) => form.setValue('payment_method', value)} settings={settings} />
          </motion.section>

          <div className="cosmic-card rounded-[1.5rem] p-5 text-white md:p-6">
            <div className="flex gap-4">
              <ShieldCheck className="h-6 w-6 shrink-0 text-cyan-200" />
              <div>
                <h2 className="font-black">Protected checkout</h2>
                <p className="mt-1 text-sm leading-6 text-white/62">
                  Your order details are encrypted and handled securely. COD payments are collected on delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        <OrderSummary
          items={items}
          subtotal={subtotal}
          deliveryCharge={deliveryCharge}
          discount={discount}
          total={total}
          submit
          disabled={!availableOrderTypes.length || form.formState.isSubmitting}
          ctaLabel={form.formState.isSubmitting ? 'Placing order...' : 'Place order'}
          couponSlot={<CouponBox appliedCode={couponCode} discount={discount} onApply={applyCoupon} onRemove={removeCoupon} />}
        />
      </form>
      </div>
    </section>
  );
}
