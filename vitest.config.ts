import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['vitest.setup.ts'],
    css: true,
    globals: true,
    poolOptions: { threads: { minThreads: 1, maxThreads: 1 } },
    server: { deps: { inline: ['@testing-library/jest-dom', '@stripe/react-stripe-js'] } }, // replaces deprecated deps.inline
  },
  plugins: [], // keep dev plugins out
  resolve: {
    alias: {
      '@': '/client',
      '@client': '/client',
      '@server': '/server',
      '@shared': '/shared',
    },
  },
})