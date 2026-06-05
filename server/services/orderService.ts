import { supabaseAdmin } from '../config/supabase';
import { mockDb } from '../utils/mock';
import type { AuthedRequest } from '../middleware/auth';
import { notFound } from '../utils/apiError';
import type { OrderStatus } from '../../src/types';
import type { z } from 'zod';
import type { createOrderSchema } from '../validations/orderSchemas';

export async function listOrders(userId?: string) {
  if (!supabaseAdmin) return userId ? mockDb.orders.filter((order) => order.user_id === userId || order.user_id === 'demo-user') : mockDb.orders;
  let request = supabaseAdmin.from('orders').select('*, order_items(*, product:products(*)), addresses(*)').order('created_at', { ascending: false });
  if (userId) request = request.eq('user_id', userId);
  const { data, error } = await request;
  if (error) throw error;
  return data;
}

type CreateOrderPayload = z.infer<typeof createOrderSchema>;

export async function createOrder(user: AuthedRequest['user'], payload: CreateOrderPayload) {
  if (!supabaseAdmin) {
    const order = {
      id: `ord-${Date.now()}`,
      user_id: user?.id ?? 'demo-user',
      total_amount: payload.total_amount,
      order_type: payload.order_type,
      payment_method: payload.payment_method,
      payment_status: payload.payment_method === 'cod' ? 'pending' : 'paid',
      order_status: payload.order_type === 'pickup' ? 'ready_for_pickup' : 'placed',
      address_id: null,
      created_at: new Date().toISOString(),
      order_items: payload.items
    };
    mockDb.orders.unshift(order as never);
    return order;
  }

  let addressId: string | null = null;
  if (payload.order_type === 'delivery' && payload.address) {
    const { data: address, error: addressError } = await supabaseAdmin
      .from('addresses')
      .insert({
        ...payload.address,
        user_id: user?.id
      })
      .select()
      .single();
    if (addressError) throw addressError;
    addressId = address.id;
  }

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: user?.id,
      total_amount: payload.total_amount,
      order_type: payload.order_type,
      payment_method: payload.payment_method,
      payment_status: payload.payment_method === 'cod' ? 'pending' : 'paid',
      order_status: payload.order_type === 'pickup' ? 'ready_for_pickup' : 'placed',
      address_id: addressId
    })
    .select()
    .single();
  if (error) throw error;

  const orderItems = payload.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.product.sale_price ?? item.product.price
  }));
  const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;
  return order;
}

export async function updateOrderStatus(orderId: string, order_status: OrderStatus) {
  if (!supabaseAdmin) {
    const order = mockDb.orders.find((item) => item.id === orderId);
    if (!order) throw notFound('Order not found');
    order.order_status = order_status;
    return order;
  }
  const { data, error } = await supabaseAdmin.from('orders').update({ order_status }).eq('id', orderId).select().single();
  if (error) throw error;
  return data;
}
