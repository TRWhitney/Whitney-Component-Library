import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  build: {
    outDir: '/tmp/wcl-chart-performance-build',
    emptyOutDir: true,
  },
});
