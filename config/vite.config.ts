import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

export default defineConfig({
  root,
  plugins: [react()],
  base: './',
  css: {
    postcss: path.join(root, 'config', 'postcss.config.js'),
  },
  build: {
    outDir: path.join(root, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.join(root, 'src'),
    },
  },
});
