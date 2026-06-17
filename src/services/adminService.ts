import { api } from '../lib/api';
import type { Category, Product, StoreSettings } from '../types';

type ProductUpsertInput = Partial<Product> & {
  image_urls?: string[];
};

export const adminService = {
  async products() {
    const { data } = await api.get<Product[]>('/admin/products');
    return data;
  },
  async upsertProduct(product: ProductUpsertInput) {
    const { data } = await api.post<Product>('/admin/products', product);
    return data;
  },
  async deleteProduct(id: string) {
    await api.delete(`/admin/products/${id}`);
  },
  async categories() {
    const { data } = await api.get<Category[]>('/admin/categories');
    return data;
  },
  async createCategory(category: Omit<Category, 'id'>) {
    const { data } = await api.post<Category>('/admin/categories', category);
    return data;
  },
  async deleteCategory(id: string) {
    await api.delete(`/admin/categories/${id}`);
  },
  async settings() {
    const { data } = await api.get<StoreSettings>('/admin/settings');
    return data;
  },
  async saveSettings(settings: Partial<StoreSettings>) {
    const { data } = await api.patch<StoreSettings>('/admin/settings', settings);
    return data;
  }
};
