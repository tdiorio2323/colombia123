import { expect, afterEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

expect.extend(matchers);

// Ensure RTL cleans up DOM between tests to avoid duplicate nodes
afterEach(() => {
  cleanup();
});
