import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.product_id === product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product_id === product.id ? { ...item, quantity: item.quantity + quantity } : item
              )
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: `${product.id}-${Date.now()}`,
                product_id: product.id,
                quantity,
                product
              }
            ]
          };
        }),
      remove: (productId) => set((state) => ({ items: state.items.filter((item) => item.product_id !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) => (item.product_id === productId ? { ...item, quantity: Math.max(1, quantity) } : item))
        })),
      clear: () => set({ items: [] })
    }),
    { name: 'solelux-cart' }
  )
);
