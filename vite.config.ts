import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/minimap.ts'),
      name: 'Minimap',
      formats: ['es', 'umd'],
      fileName: (format) => `minimap.${format}.js`,
    },
  },
});
