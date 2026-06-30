import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@routes': path.resolve(__dirname, './src/routes'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@zustand': path.resolve(__dirname, './src/zustand'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@mock': path.resolve(__dirname, './src/mock'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});