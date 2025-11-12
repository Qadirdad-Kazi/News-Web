import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to our Express server
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Prevent Node.js built-ins from being bundled in the frontend
  define: {
    'process.env': {},
    global: 'window',
  },
  resolve: {
    alias: {
      // Basic browser polyfills
      buffer: 'buffer',
      util: 'util',
      process: 'process/browser',
      // Prevent MongoDB client from being bundled in the frontend
      mongodb: false,
    },
  },
  optimizeDeps: {
    exclude: ['mongodb'], // Exclude MongoDB from optimization
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    // Ensure MongoDB isn't bundled in the frontend
    rollupOptions: {
      external: ['mongodb'],
    },
  },
});
