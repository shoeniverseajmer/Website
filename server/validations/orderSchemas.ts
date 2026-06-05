import { z } from 'zod';

export const checkoutItemSchema = z.object({
  product_id: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  product: z.object({
    id: z.string().min(1),
    price: z.coerce.number().nonnegative(),
    sale_price: z.coerce.number().nonnegative().nullable().optional()
  }).passthrough()
});

export const addressInputSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(8),
  address: z.string().min(6),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4)
});

export const createOrderSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  address: addressInputSchema.optional(),
  order_type: z.enum(['delivery', 'pickup']),
  payment_method: z.enum(['cod', 'razorpay', 'upi']),
  total_amount: z.coerce.number().nonnegative()
}).superRefine((value, context) => {
  if (value.order_type === 'delivery' && !value.address) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['address'],
      message: 'Address is required for delivery orders'
    });
  }
});

export const updateOrderStatusSchema = z.object({
  order_status: z.enum(['placed', 'confirmed', 'packed', 'shipped', 'ready_for_pickup', 'delivered', 'cancelled'])
});
