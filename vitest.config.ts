import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // happy-dom provides localStorage + window for the consent module tests
    // (jsdom's storage is shadowed by Node's native experimental localStorage);
    // pure-function tests (formatDate) run fine under it too.
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.test.ts'],
  },
});
