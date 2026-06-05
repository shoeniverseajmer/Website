import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

export const authService = {
  async signUp(name: string, email: string, password: string) {
    if (!supabase) {
      return { id: 'demo-user', name, email, role: 'customer', created_at: new Date().toISOString() } satisfies Profile;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role: 'customer' } }
    });

    if (error) throw error;
    return {
      id: data.user?.id ?? '',
      name,
      email,
      role: 'customer',
      created_at: new Date().toISOString()
    } satisfies Profile;
  },
  async signIn(email: string, password: string) {
    if (!supabase) {
      return {
        id: email.includes('admin') ? 'demo-admin' : 'demo-user',
        name: email.includes('admin') ? 'Admin Operator' : 'Demo Customer',
        email,
        role: email.includes('admin') ? 'admin' : 'customer',
        created_at: new Date().toISOString()
      } satisfies Profile;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    return {
      id: data.user.id,
      name: String(data.user.user_metadata.name ?? 'Customer'),
      email: data.user.email ?? email,
      role: (data.user.user_metadata.role ?? 'customer') as Profile['role'],
      created_at: data.user.created_at
    } satisfies Profile;
  },
  async signOut() {
    await supabase?.auth.signOut();
  }
};
