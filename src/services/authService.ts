import { supabase } from '../lib/supabase';
import type { Profile } from '../types';

export const authService = {
  async signInWithGoogle() {
    if (!supabase) throw new Error('Supabase is not configured');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
    if (error) throw error;
  },

  sessionToProfile(user: { id: string; email?: string; user_metadata: Record<string, unknown>; created_at: string }): Profile {
    return {
      id: user.id,
      name: String(user.user_metadata.full_name ?? user.user_metadata.name ?? 'Customer'),
      email: user.email ?? '',
      phone: user.user_metadata.phone ? String(user.user_metadata.phone) : undefined,
      role: (user.user_metadata.role ?? 'customer') as Profile['role'],
      created_at: user.created_at
    };
  },

  async updateProfile(updates: { name?: string; phone?: string }) {
    if (!supabase) throw new Error('Supabase is not configured');
    const { data, error } = await supabase.auth.updateUser({ data: updates });
    if (error) throw error;
    return authService.sessionToProfile(data.user);
  },

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
