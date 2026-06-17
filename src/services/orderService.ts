import { api } from '../lib/api';
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
    const { data } = await api.get<StoreSettings>('/settings');
    return data;
  },
  async listMine() {
    const { data } = await api.get<Order[]>('/orders');
    return data;
  },
  async create(payload: CheckoutPayload) {
    const { data } = await api.post<Order>('/orders', payload);
    return data;
  },
  async adminList() {
    const { data } = await api.get<Order[]>('/admin/orders');
    return data;
  },
  async updateStatus(orderId: string, order_status: OrderStatus) {
    const { data } = await api.patch<Order>(`/admin/orders/${orderId}`, { order_status });
    return data;
  }
};
