import { defineConfig } from 'vite';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync } from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    {
      name: 'copy-css',
      closeBundle() {
        copyFileSync(
          resolve(__dirname, 'src/ap-components.css'),
          resolve(__dirname, 'dist/style.css'),
        );
      },
    },
  ],
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
