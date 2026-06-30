import { z } from 'zod';
import { booleanQuery } from './commonSchemas';

export const productListQuerySchema = z.object({
  search: z.string().optional(),
  gender_category: z.enum(['men', 'women', 'kids', 'unisex']).optional(),
  product_type: z.enum(['shoes', 'accessories']).optional(),
  accessory_type: z.enum(['belts', 'wallets', 'bags']).optional(),
  occasion: z.enum(['casual', 'festive', 'formal', 'sports']).optional(),
  sale: booleanQuery,
  bestseller: booleanQuery
});

export const productUpsertSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  price: z.coerce.number().positive(),
  sale_price: z.coerce.number().nonnegative().nullable().optional(),
  stock: z.coerce.number().int().nonnegative(),
  gender_category: z.enum(['men', 'women', 'kids', 'unisex']),
  product_type: z.enum(['shoes', 'accessories']),
  accessory_type: z.enum(['belts', 'wallets', 'bags']).nullable().optional(),
  occasion: z.enum(['casual', 'festive', 'formal', 'sports']),
  is_bestseller: z.boolean().default(false),
  is_on_sale: z.boolean().default(false),
  is_active: z.boolean().default(true),
  image_urls: z.array(z.string().url()).optional(),
  variants: z
    .array(
      z.object({
        size: z.string().min(1),
        color: z.string().min(1),
        stock: z.coerce.number().int().nonnegative()
      })
    )
    .optional()
});

export const imageUploadSchema = z.object({
  files: z
    .array(
      z.object({
        filename: z.string().min(1),
        content_type: z.string().regex(/^image\//, 'Only image files are allowed'),
        data: z.string().min(1)
      })
    )
    .min(1)
    .max(8)
});

export const categoryCreateSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2)
});
