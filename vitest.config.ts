import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    exclude: ['.work/**', 'dist/**', 'node_modules/**'],
    restoreMocks: true,
  },
});
