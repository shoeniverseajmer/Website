import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().min(1)
});

export const slugParamSchema = z.object({
  slug: z.string().min(1)
});

export const booleanQuery = z.preprocess((value) => {
  if (value === 'true' || value === true) return true;
  if (value === 'false' || value === false) return false;
  return undefined;
}, z.boolean().optional());
