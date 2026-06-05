import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Button } from '../../components/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { toast } from '../../components/ui/Toast';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { adminService } from '../../services/adminService';
import { slugify } from '../../utils/format';

const schema = z.object({
  name: z.string().min(2),
  description: z.string().min(8),
  price: z.coerce.number().positive(),
  sale_price: z.coerce.number().nonnegative().optional(),
  stock: z.coerce.number().int().nonnegative(),
  gender_category: z.enum(['men', 'women', 'kids', 'unisex']),
  product_type: z.enum(['shoes', 'accessories']),
  accessory_type: z.enum(['belts', 'wallets', 'bags', 'none']),
  occasion: z.enum(['casual', 'festive', 'formal', 'sports']),
  image_urls: z.string().optional(),
  is_bestseller: z.boolean().optional(),
  is_on_sale: z.boolean().optional(),
  is_active: z.boolean().optional()
});

type Values = z.infer<typeof schema>;

export function AdminProductFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: products = [] } = useQuery({ queryKey: ['admin-products'], queryFn: adminService.products });
  const product = useMemo(() => products.find((item) => item.id === id), [id, products]);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    values: product
      ? {
          ...product,
          accessory_type: product.accessory_type ?? 'none',
          sale_price: product.sale_price ?? undefined,
          image_urls: product.product_images?.map((image) => image.image_url).join('\n') ?? ''
        }
      : {
          name: '',
          description: '',
          price: 0,
          stock: 0,
          gender_category: 'men',
          product_type: 'shoes',
          accessory_type: 'none',
          occasion: 'casual',
          image_urls: '',
          is_active: true,
          is_bestseller: false,
          is_on_sale: false
        }
  });
  const imageUrls = form.watch('image_urls')?.split('\n').map((url) => url.trim()).filter(Boolean) ?? [];

  const submit = form.handleSubmit(async (values) => {
    await adminService.upsertProduct({
      id,
      name: values.name,
      slug: slugify(values.name),
      description: values.description,
      price: values.price,
      sale_price: values.sale_price || null,
      stock: values.stock,
      gender_category: values.gender_category,
      product_type: values.product_type,
      accessory_type: values.accessory_type === 'none' ? null : values.accessory_type,
      occasion: values.occasion,
      is_bestseller: Boolean(values.is_bestseller),
      is_on_sale: Boolean(values.is_on_sale),
      is_active: Boolean(values.is_active),
      image_urls: imageUrls
    });
    toast.success('Product saved');
    navigate('/admin/products');
  });

  return (
    <div>
      <AdminPageHeader
        eyebrow="Product studio"
        title={id ? 'Edit product' : 'Add product'}
        copy="Create premium catalogue entries with merchandising flags, stock, pricing, and image URLs."
      />
      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Product information</CardTitle>
                <CardDescription>Core catalogue and storefront metadata.</CardDescription>
              </div>
            </CardHeader>
            <div className="grid gap-5 lg:grid-cols-2">
              <Input label="Name" error={form.formState.errors.name?.message} {...form.register('name')} />
              <Input label="Price" type="number" error={form.formState.errors.price?.message} {...form.register('price')} />
              <Input label="Sale price" type="number" {...form.register('sale_price')} />
              <Input label="Stock" type="number" error={form.formState.errors.stock?.message} {...form.register('stock')} />
              <Select label="Gender" {...form.register('gender_category')}><option value="men">Men</option><option value="women">Women</option><option value="kids">Kids</option><option value="unisex">Unisex</option></Select>
              <Select label="Product type" {...form.register('product_type')}><option value="shoes">Shoes</option><option value="accessories">Accessories</option></Select>
              <Select label="Accessory type" {...form.register('accessory_type')}><option value="none">None</option><option value="belts">Belts</option><option value="wallets">Wallets</option><option value="bags">Bags</option></Select>
              <Select label="Occasion" {...form.register('occasion')}><option value="casual">Casual</option><option value="festive">Festive</option><option value="formal">Formal</option><option value="sports">Sports</option></Select>
              <Textarea containerClassName="lg:col-span-2" label="Description" error={form.formState.errors.description?.message} {...form.register('description')} />
              <Textarea containerClassName="lg:col-span-2" label="Image URLs or Supabase Storage URLs" helperText="Paste one URL per line. Multiple images power the product gallery." {...form.register('image_urls')} />
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Merchandising</CardTitle>
                <CardDescription>Control storefront placement.</CardDescription>
              </div>
            </CardHeader>
            <div className="grid gap-3">
              <label className="flex items-center justify-between rounded-2xl bg-bone p-4 text-sm font-bold"><span>Bestseller</span><input type="checkbox" {...form.register('is_bestseller')} /></label>
              <label className="flex items-center justify-between rounded-2xl bg-bone p-4 text-sm font-bold"><span>Sale</span><input type="checkbox" {...form.register('is_on_sale')} /></label>
              <label className="flex items-center justify-between rounded-2xl bg-bone p-4 text-sm font-bold"><span>Active</span><input type="checkbox" {...form.register('is_active')} /></label>
            </div>
            <Button className="mt-5" type="submit" fullWidth>Save product</Button>
          </Card>

          <Card variant="dark">
            <CardTitle>Image preview</CardTitle>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {imageUrls.slice(0, 4).map((url) => (
                <img key={url} src={url} alt="Product preview" className="aspect-square rounded-2xl object-cover" />
              ))}
              {!imageUrls.length ? <p className="col-span-2 text-sm leading-6 text-white/58">Image previews appear after URLs are added.</p> : null}
            </div>
          </Card>
        </aside>
      </form>
    </div>
  );
}
