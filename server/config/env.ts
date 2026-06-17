import dotenv from 'dotenv';

dotenv.config();

const defaultOrigins = [
  'http://localhost:5173',
  'https://www.shoeniverseajmer.com',
  'https://shoeniverseajmer.com',
  'https://website-five-beige-48.vercel.app'
];

// CLIENT_URL may be a single origin or a comma-separated list; merge with defaults.
const configuredOrigins = (process.env.CLIENT_URL ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  port: Number(process.env.PORT ?? 5001),
  clientUrl: process.env.CLIENT_URL ?? 'http://localhost:5173',
  allowedOrigins: Array.from(new Set([...defaultOrigins, ...configuredOrigins])),
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  storageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? 'product-images'
};
