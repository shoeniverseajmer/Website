import { supabaseAdmin } from '../config/supabase';
import { mockDb } from '../utils/mock';
import type { ProductFilters } from '../../src/types';

export async function listProducts(query: ProductFilters) {
  if (!supabaseAdmin) {
    return mockDb.products.filter((product) => {
      const search = String(query.search ?? '').toLowerCase().trim();
      return (
        product.is_active &&
        (!search ||
          [product.name, product.description, product.gender_category, product.product_type, product.accessory_type, product.occasion]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(search))) &&
        (!query.gender_category || product.gender_category === query.gender_category) &&
        (!query.product_type || product.product_type === query.product_type) &&
        (!query.accessory_type || product.accessory_type === query.accessory_type) &&
        (!query.occasion || product.occasion === query.occasion) &&
        (!query.sale || product.is_on_sale) &&
        (!query.bestseller || product.is_bestseller)
      );
    });
  }

  let request = supabaseAdmin
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  for (const key of ['gender_category', 'product_type', 'accessory_type', 'occasion'] as const) {
    if (query[key]) request = request.eq(key, query[key]);
  }
  if (query.sale) request = request.eq('is_on_sale', true);
  if (query.bestseller) request = request.eq('is_bestseller', true);
  if (query.search) request = request.or(`name.ilike.%${query.search}%,description.ilike.%${query.search}%`);

  const { data, error } = await request;
  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string) {
  if (!supabaseAdmin) return mockDb.products.find((product) => product.slug === slug) ?? null;

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*, product_images(*), product_variants(*)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listCategories() {
  if (!supabaseAdmin) return mockDb.categories;
  const { data, error } = await supabaseAdmin.from('categories').select('*').order('name');
  if (error) throw error;
  return data;
}
