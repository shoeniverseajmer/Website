import { supabaseAdmin } from '../config/supabase';
import { env } from '../config/env';
import { mockDb } from '../utils/mock';
import { ApiError, notFound } from '../utils/apiError';
import type { Category, Product, StoreSettings } from '../../src/types';

type UploadInput = {
  filename: string;
  content_type: string;
  data: string; // base64 (without data URL prefix)
};

const safeExtension = (filename: string, contentType: string) => {
  const fromName = filename.includes('.') ? filename.split('.').pop()?.toLowerCase() : undefined;
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  return contentType.split('/')[1]?.toLowerCase() ?? 'jpg';
};

export async function uploadProductImages(files: UploadInput[]) {
  if (!supabaseAdmin) {
    // Demo mode: echo back the base64 as data URLs so the UI still works locally.
    return files.map((file) => `data:${file.content_type};base64,${file.data}`);
  }

  const urls: string[] = [];
  for (const file of files) {
    const buffer = Buffer.from(file.data, 'base64');
    const ext = safeExtension(file.filename, file.content_type);
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabaseAdmin.storage.from(env.storageBucket).upload(path, buffer, {
      contentType: file.content_type,
      upsert: false
    });
    if (error) throw new ApiError(500, `Image upload failed: ${error.message}`);
    const { data } = supabaseAdmin.storage.from(env.storageBucket).getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

export async function adminProducts() {
  if (!supabaseAdmin) return mockDb.products;
  const { data, error } = await supabaseAdmin.from('products').select('*, product_images(*), product_variants(*)').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

type VariantInput = { size: string; color: string; stock: number };

type ProductPayload = Partial<Product> & {
  image_urls?: string[];
  variants?: VariantInput[];
};

export async function upsertProduct(product: ProductPayload) {
  if (!supabaseAdmin) {
    const { image_urls, variants, ...productPayload } = product;
    const id = String(product.id ?? `p-${Date.now()}`);
    const existing = mockDb.products.find((item) => item.id === id);
    const next = {
      ...existing,
      ...productPayload,
      id,
      created_at: existing?.created_at ?? new Date().toISOString(),
      product_images: image_urls?.length
        ? image_urls.map((image_url, index) => ({ id: `img-${id}-${index}`, product_id: id, image_url }))
        : existing?.product_images,
      product_variants: variants
        ? variants.map((variant, index) => ({ id: `var-${id}-${index}`, product_id: id, ...variant }))
        : existing?.product_variants
    } as Product;
    mockDb.products = [next, ...mockDb.products.filter((item) => item.id !== id)];
    return next;
  }

  const { image_urls, variants, ...productPayload } = product;
  // `description` is NOT NULL in the DB but the admin form no longer collects it.
  // Use INSERT on create (default description to '' to satisfy the constraint) and a
  // scoped UPDATE on edit (only provided columns change, so the existing description is
  // preserved). Upsert can't do this: it builds the INSERT row first and trips NOT NULL
  // before the ON CONFLICT update can run.
  const { id: productId, ...mutableFields } = productPayload as Record<string, unknown>;
  let data:
    | { id: string; [key: string]: unknown }
    | null = null;
  let error: { message: string } | null = null;
  if (productId) {
    const updatePayload: Record<string, unknown> = { ...mutableFields };
    if (updatePayload.description == null) delete updatePayload.description;
    ({ data, error } = await supabaseAdmin
      .from('products')
      .update(updatePayload)
      .eq('id', productId)
      .select()
      .single());
  } else {
    const insertPayload: Record<string, unknown> = { ...mutableFields, description: mutableFields.description ?? '' };
    ({ data, error } = await supabaseAdmin.from('products').insert(insertPayload).select().single());
  }
  if (error) throw error;
  if (!data) throw new ApiError(404, 'Product not found');
  if (image_urls) {
    await supabaseAdmin.from('product_images').delete().eq('product_id', data.id);
    if (image_urls.length) {
      const { error: imagesError } = await supabaseAdmin.from('product_images').insert(
        image_urls.map((image_url) => ({
          product_id: data.id,
          image_url
        }))
      );
      if (imagesError) throw imagesError;
    }
  }
  if (variants) {
    await supabaseAdmin.from('product_variants').delete().eq('product_id', data.id);
    if (variants.length) {
      const { error: variantsError } = await supabaseAdmin.from('product_variants').insert(
        variants.map((variant) => ({
          product_id: data.id,
          size: variant.size,
          color: variant.color,
          stock: variant.stock
        }))
      );
      if (variantsError) throw variantsError;
    }
  }
  return data;
}

export async function deleteProduct(id: string) {
  if (!supabaseAdmin) {
    mockDb.products = mockDb.products.filter((product) => product.id !== id);
    return;
  }
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
  if (error) throw error;
}

export async function getSettings() {
  if (!supabaseAdmin) return mockDb.settings;
  const { data, error } = await supabaseAdmin.from('store_settings').select('*').limit(1).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return data;
}

export async function saveSettings(settings: StoreSettings) {
  if (!supabaseAdmin) {
    mockDb.settings = { ...mockDb.settings, ...settings };
    return mockDb.settings;
  }
  const { data: current } = await supabaseAdmin.from('store_settings').select('id').limit(1).maybeSingle();
  const payload = current?.id ? { ...settings, id: current.id } : settings;
  const { data, error } = await supabaseAdmin.from('store_settings').upsert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function createCategory(category: Omit<Category, 'id'>) {
  if (!supabaseAdmin) {
    const next = { ...category, id: `c-${Date.now()}` };
    mockDb.categories = [next, ...mockDb.categories];
    return next;
  }
  const { data, error } = await supabaseAdmin.from('categories').insert(category).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  if (!supabaseAdmin) {
    const before = mockDb.categories.length;
    mockDb.categories = mockDb.categories.filter((category) => category.id !== id);
    if (before === mockDb.categories.length) throw notFound('Category not found');
    return;
  }
  const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
  if (error) throw error;
}
