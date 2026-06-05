import { z } from 'zod';

export const settingsUpdateSchema = z.object({
  id: z.string().optional(),
  delivery_enabled: z.boolean(),
  pickup_enabled: z.boolean(),
  cod_enabled: z.boolean(),
  delivery_charge: z.coerce.number().nonnegative(),
  pickup_address: z.string().min(1)
});
