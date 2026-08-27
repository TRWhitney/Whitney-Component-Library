import {defineConfig} from 'vitest/config';

export default defineConfig({
  root: new URL('.', import.meta.url).pathname,
  test: {
    environment: 'jsdom',
    include: ['prototype.smoke.test.tsx'],
    restoreMocks: true,
  },
});
