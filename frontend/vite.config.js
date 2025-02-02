import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './', // Важно для правильных путей!
  resolve: {
    alias: {
      i18next: path.resolve(__dirname, 'node_modules/i18next')
    }
  },
  optimizeDeps: {
    include: ['i18next']
  },
  build: {
    outDir: 'dist', // Должно совпадать с тем, что мы раздаём
    rollupOptions: {
      external: ['i18next', 'react-i18next']
    }
  },
  server: {
    port: 5002,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:5001',
        ws: true,
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReqWs', (proxyReq) => {
            proxyReq.setHeader('Origin', 'http://localhost:5002');
          });
        }
      }
    }
  }
});
