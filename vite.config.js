import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    host: true,
    proxy: {
      '/backend': {
        target: process.env.PHP_API_TARGET || 'http://127.0.0.1',
        changeOrigin: false
      }
    }
  }
});
