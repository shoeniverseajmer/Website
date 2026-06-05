import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5001'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('recharts') || id.includes('d3-')) return 'charts-vendor';
          if (id.includes('@supabase')) return 'supabase-vendor';
          if (id.includes('framer-motion')) return 'motion-vendor';
          return 'vendor';
        }
      }
    },
    chunkSizeWarningLimit: 700
  }
});
