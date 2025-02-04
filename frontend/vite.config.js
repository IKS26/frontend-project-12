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
    host: true,
    port: 5002,
    proxy: {
      '/api': { target: 'http://localhost:5001', changeOrigin: true },
      '/socket.io': {
        target: 'http://localhost:5001',
        ws: true,
        changeOrigin: true
      }
    }
  }
});
