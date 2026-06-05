import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Banknote, MapPin, PackageCheck, Store, Truck } from 'lucide-react';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { ToggleSwitch } from '../../components/admin/ToggleSwitch';
import { Button } from '../../components/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { toast } from '../../components/ui/Toast';
import { adminService } from '../../services/adminService';
import type { StoreSettings } from '../../types';

export function AdminSettingsPage() {
  const { data } = useQuery({ queryKey: ['admin-settings'], queryFn: adminService.settings });
  const form = useForm<StoreSettings>();
  const deliveryEnabled = form.watch('delivery_enabled');
  const pickupEnabled = form.watch('pickup_enabled');
  const codEnabled = form.watch('cod_enabled');

  useEffect(() => {
    if (data) form.reset(data);
  }, [data, form]);

  const submit = form.handleSubmit(async (values) => {
    await adminService.saveSettings(values);
    toast.success('Settings saved');
  });

  return (
    <div>
      <AdminPageHeader
        eyebrow="Fulfillment controls"
        title="Store settings"
        copy="Control the customer checkout surface: delivery, pickup, COD, delivery charges, and pickup address."
      />

      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          <ToggleSwitch
            checked={Boolean(deliveryEnabled)}
            onChange={(checked) => form.setValue('delivery_enabled', checked)}
            label="Delivery enabled"
            description="Show delivery as a checkout fulfillment option."
          />
          <ToggleSwitch
            checked={Boolean(pickupEnabled)}
            onChange={(checked) => form.setValue('pickup_enabled', checked)}
            label="Pickup enabled"
            description="Show pickup as a checkout fulfillment option."
          />
          <ToggleSwitch
            checked={Boolean(codEnabled)}
            onChange={(checked) => form.setValue('cod_enabled', checked)}
            label="COD enabled"
            description="Allow customers to choose cash on delivery."
          />

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Checkout details</CardTitle>
                <CardDescription>Charges and location information shown during checkout.</CardDescription>
              </div>
            </CardHeader>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Delivery charge" type="number" leftIcon={<Truck className="h-4 w-4" />} {...form.register('delivery_charge', { valueAsNumber: true })} />
              <Input label="Pickup address" leftIcon={<MapPin className="h-4 w-4" />} containerClassName="md:col-span-2" {...form.register('pickup_address')} />
            </div>
          </Card>
        </div>

        <aside className="h-fit rounded-3xl bg-ink p-5 text-white shadow-luxe xl:sticky xl:top-28">
          <h2 className="text-xl font-black">Checkout availability</h2>
          <div className="mt-5 grid gap-3">
            {[
              [Truck, 'Delivery', deliveryEnabled ? 'Visible' : 'Hidden'],
              [Store, 'Pickup', pickupEnabled ? 'Visible' : 'Hidden'],
              [Banknote, 'COD', codEnabled ? 'Visible' : 'Hidden'],
              [PackageCheck, 'Gateway', 'UPI + Razorpay']
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
          <Button type="submit" variant="gold" className="mt-5" fullWidth>
            Save settings
          </Button>
        </aside>
      </form>
    </div>
  );
}
