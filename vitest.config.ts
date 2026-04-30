import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
    exclude: ['dist/**', 'node_modules/**'],
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/components/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      'virtual:dualabs-docs/manifest': new URL(
        './src/components/__tests__/__mocks__/manifest.ts',
        import.meta.url,
      ).pathname,
      'virtual:dualabs-docs/openapi': new URL(
        './src/components/__tests__/__mocks__/openapi.ts',
        import.meta.url,
      ).pathname,
      '@dualabs-dev/ui-kit': new URL(
        './src/components/__tests__/__mocks__/ui-kit.ts',
        import.meta.url,
      ).pathname,
    },
  },
});
