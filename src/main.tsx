import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes/AppRoutes';
import { ToastProvider } from './components/ui/Toast';
import { supabase } from './lib/supabase';
import { authService } from './services/authService';
import { useAuthStore } from './store/authStore';
import './styles/index.css';

if (supabase) {
  supabase.auth.onAuthStateChange((_event, session) => {
    const setUser = useAuthStore.getState().setUser;
    if (session?.user) {
      setUser(authService.sessionToProfile(session.user));
    } else {
      setUser(null);
    }
  });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
