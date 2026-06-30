import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';
import type { Profile } from '../types';

interface AuthState {
  user: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: Profile | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      login: async (email, password) => {
        set({ loading: true });
        const user = await authService.signIn(email, password);
        set({ user, loading: false });
      },
      signup: async (name, email, password) => {
        set({ loading: true });
        const user = await authService.signUp(name, email, password);
        set({ user, loading: false });
      },
      loginWithGoogle: async () => {
        await authService.signInWithGoogle();
      },
      logout: async () => {
        await authService.signOut();
        set({ user: null });
      },
      setUser: (user) => set({ user })
    }),
    { name: 'shoeniverse-auth' }
  )
);
