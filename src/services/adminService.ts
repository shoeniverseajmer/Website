import { api } from '../lib/api';
import type { Category, Product, StoreSettings } from '../types';

type ProductUpsertInput = Partial<Product> & {
  image_urls?: string[];
  variants?: { size: string; color: string; stock: number }[];
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      // Strip the "data:<mime>;base64," prefix — the API expects raw base64.
      resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.onerror = () => reject(reader.error ?? new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

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
  async uploadImages(files: File[]) {
    const urls: string[] = [];
    // Upload one file per request to stay within the API body size limit.
    for (const file of files) {
      const data = await fileToBase64(file);
      const { data: result } = await api.post<string[]>('/admin/uploads', {
        files: [{ filename: file.name, content_type: file.type, data }]
      });
      urls.push(...result);
    }
    return urls;
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
