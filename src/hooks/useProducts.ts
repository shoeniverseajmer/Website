import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import type { ProductFilters } from '../types';

export const useProducts = (filters?: ProductFilters) =>
  useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.list(filters)
  });

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug),
    enabled: Boolean(slug)
  });
