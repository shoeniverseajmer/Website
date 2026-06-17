import axios from 'axios';
import { supabase } from './supabase';

// The backend mounts every route under `/api`. VITE_API_URL is sometimes set
// without that suffix, so normalize it to always end in exactly one `/api`.
const rawApiUrl = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/+$/, '');
const baseURL = rawApiUrl ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`) : '/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  const session = await supabase?.auth.getSession();
  const token = session?.data.session?.access_token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
