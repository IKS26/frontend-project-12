import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['i18next', 'react-i18next']
  },
  build: {
    outDir: 'dist'
  },
  server: {
    port: 5002,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5001',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'ws://127.0.0.1:5001',
        ws: true,
        rewriteWsOrigin: true
      }
    }
  }
});
