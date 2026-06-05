import { createClient } from '@supabase/supabase-js';
import { env } from './env';

export const hasServerSupabase = Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);

export const supabaseAdmin = hasServerSupabase
  ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;
