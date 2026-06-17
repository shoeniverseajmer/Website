import { api } from '../lib/api';
import type { Category, Product, ProductFilters } from '../types';

export const productService = {
  async list(filters?: ProductFilters) {
    const { data } = await api.get<Product[]>('/products', { params: filters });
    return data;
  },
  async getBySlug(slug: string) {
    const { data } = await api.get<Product>(`/products/${slug}`);
    return data;
  },
  async categories() {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  }
};
