import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    pool: 'vmThreads',
    poolOptions: {
      threads: { minThreads: 1, maxThreads: 1 },
    },
  },
  plugins: [], // avoid loading Vite dev plugins during tests
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
});
