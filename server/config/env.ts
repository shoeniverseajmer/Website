import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 5001),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  storageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? 'product-images'
};
