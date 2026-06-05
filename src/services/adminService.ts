import { api } from '../lib/api';
import { mockCategories, mockProducts, mockSettings } from '../lib/mockData';
import type { Category, Product, StoreSettings } from '../types';

type ProductUpsertInput = Partial<Product> & {
  image_urls?: string[];
};

export const adminService = {
  async products() {
    try {
      const { data } = await api.get<Product[]>('/admin/products');
      return data;
    } catch {
      return mockProducts;
    }
  },
  async upsertProduct(product: ProductUpsertInput) {
    try {
      const { data } = await api.post<Product>('/admin/products', product);
      return data;
    } catch {
      const now = new Date().toISOString();
      const imageUrls = product.image_urls ?? [];
      const baseId = product.id ?? `local-${Date.now()}`;
      const nextProduct: Product = {
        ...(product as Product),
        id: baseId,
        created_at: (product as Product).created_at ?? now,
        product_images: imageUrls.map((url, index) => ({
          id: `local-img-${baseId}-${index}`,
          product_id: baseId,
          image_url: url
        }))
      };

      const existingIndex = mockProducts.findIndex((item) => item.id === nextProduct.id);
      if (existingIndex >= 0) {
        mockProducts[existingIndex] = { ...mockProducts[existingIndex], ...nextProduct };
      } else {
        mockProducts.unshift(nextProduct);
      }

      return nextProduct;
    }
  },
  async deleteProduct(id: string) {
    try {
      await api.delete(`/admin/products/${id}`);
    } catch {
      return;
    }
  },
  async categories() {
    try {
      const { data } = await api.get<Category[]>('/admin/categories');
      return data;
    } catch {
      return mockCategories;
    }
  },
  async createCategory(category: Omit<Category, 'id'>) {
    try {
      const { data } = await api.post<Category>('/admin/categories', category);
      return data;
    } catch {
      return { ...category, id: `local-${Date.now()}` };
    }
  },
  async deleteCategory(id: string) {
    try {
      await api.delete(`/admin/categories/${id}`);
    } catch {
      return;
    }
  },
  async settings() {
    try {
      const { data } = await api.get<StoreSettings>('/admin/settings');
      return data;
    } catch {
      return mockSettings;
    }
  },
  async saveSettings(settings: Partial<StoreSettings>) {
    try {
      const { data } = await api.patch<StoreSettings>('/admin/settings', settings);
      return data;
    } catch {
      return { ...mockSettings, ...settings };
    }
  }
};
