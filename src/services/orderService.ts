import { api } from '../lib/api';
import { mockOrders, mockSettings } from '../lib/mockData';
import type { Address, CartItem, Order, OrderStatus, OrderType, PaymentMethod, StoreSettings } from '../types';

export interface CheckoutPayload {
  items: CartItem[];
  address?: Omit<Address, 'id' | 'user_id'>;
  order_type: OrderType;
  payment_method: PaymentMethod;
  total_amount: number;
}

export const orderService = {
  async settings() {
    try {
      const { data } = await api.get<StoreSettings>('/settings');
      return data;
    } catch {
      return mockSettings;
    }
  },
  async listMine() {
    try {
      const { data } = await api.get<Order[]>('/orders');
      return data;
    } catch {
      return mockOrders;
    }
  },
  async create(payload: CheckoutPayload) {
    try {
      const { data } = await api.post<Order>('/orders', payload);
      return data;
    } catch {
      return {
        id: `mock-${Date.now()}`,
        user_id: 'demo-user',
        total_amount: payload.total_amount,
        order_type: payload.order_type,
        payment_method: payload.payment_method,
        payment_status: payload.payment_method === 'cod' ? 'pending' : 'paid',
        order_status: payload.order_type === 'pickup' ? 'ready_for_pickup' : 'placed',
        address_id: null,
        created_at: new Date().toISOString(),
        order_items: payload.items.map((item) => ({
          id: `${item.product_id}-${Date.now()}`,
          order_id: 'mock',
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.sale_price ?? item.product.price,
          product: item.product
        }))
      } satisfies Order;
    }
  },
  async adminList() {
    try {
      const { data } = await api.get<Order[]>('/admin/orders');
      return data;
    } catch {
      return mockOrders;
    }
  },
  async updateStatus(orderId: string, order_status: OrderStatus) {
    try {
      const { data } = await api.patch<Order>(`/admin/orders/${orderId}`, { order_status });
      return data;
    } catch {
      return { ...mockOrders[0], id: orderId, order_status };
    }
  }
};
