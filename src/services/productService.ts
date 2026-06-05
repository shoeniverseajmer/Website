import { api } from '../lib/api';
import { mockCategories, mockProducts } from '../lib/mockData';
import type { Category, Product, ProductFilters } from '../types';

const filterProducts = (products: Product[], filters: ProductFilters = {}) =>
  products.filter((product) => {
    const query = filters.search?.toLowerCase();
    const matchesSearch = query
      ? [product.name, product.description, product.gender_category, product.product_type, product.accessory_type, product.occasion]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))
      : true;

    return (
      product.is_active &&
      matchesSearch &&
      (!filters.gender_category || product.gender_category === filters.gender_category) &&
      (!filters.product_type || product.product_type === filters.product_type) &&
      (!filters.accessory_type || product.accessory_type === filters.accessory_type) &&
      (!filters.occasion || product.occasion === filters.occasion) &&
      (!filters.sale || product.is_on_sale) &&
      (!filters.bestseller || product.is_bestseller)
    );
  });

export const productService = {
  async list(filters?: ProductFilters) {
    try {
      const { data } = await api.get<Product[]>('/products', { params: filters });
      return data;
    } catch {
      return filterProducts(mockProducts, filters);
    }
  },
  async getBySlug(slug: string) {
    try {
      const { data } = await api.get<Product>(`/products/${slug}`);
      return data;
    } catch {
      return mockProducts.find((product) => product.slug === slug) ?? null;
    }
  },
  async categories() {
    try {
      const { data } = await api.get<Category[]>('/categories');
      return data;
    } catch {
      return mockCategories;
    }
  }
};
