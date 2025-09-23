import { expect, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

// Ensure RTL cleans up DOM between tests to avoid duplicate nodes
afterEach(() => {
  cleanup();
});

// Polyfill PerformanceObserver for JSDOM/Node
declare global {
  // eslint-disable-next-line no-var
  var PerformanceObserver: any;
}

async function setupPerformancePolyfill() {
  try {
    // Use Node's perf_hooks if available
    const { PerformanceObserver, performance } = await import('node:perf_hooks');
    // @ts-ignore
    if (!globalThis.performance) globalThis.performance = performance;
    // @ts-ignore
    if (!globalThis.PerformanceObserver) globalThis.PerformanceObserver = PerformanceObserver;
  } catch {
    // Minimal mock to satisfy libs that check for API presence
    // @ts-ignore
    if (!globalThis.PerformanceObserver) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      globalThis.PerformanceObserver = class {
        constructor(_: any) {}
        observe(_: any) {}
        disconnect() {}
        takeRecords() { return []; }
      };
    }
  }
}

setupPerformancePolyfill();

// Mock React Router hooks for tests
import { vi } from 'vitest';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom') as any;
  return {
    ...actual,
    useLocation: () => ({
      pathname: '/test',
      search: '',
      hash: '',
      state: null,
      key: 'test'
    }),
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
  };
});
