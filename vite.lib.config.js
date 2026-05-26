import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'AlpineComponents',
      fileName: 'index',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['alpinejs'],
      output: {
        globals: { alpinejs: 'Alpine' },
        exports: 'named',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
