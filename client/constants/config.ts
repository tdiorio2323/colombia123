/**
 * General application configuration constants
 */

/**
 * API endpoints base URL
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Application limits
 */
export const APP_LIMITS = {
  MAX_UPLOAD_SIZE_MB: 50,
  MAX_MESSAGE_LENGTH: 1000,
  MAX_BIO_LENGTH: 500,
  MAX_USERNAME_LENGTH: 30,
  MIN_USERNAME_LENGTH: 3,
  MIN_PASSWORD_LENGTH: 8,
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * Time intervals (in milliseconds)
 */
export const INTERVALS = {
  POLLING_INTERVAL: 30000, // 30 seconds
  REFRESH_TOKEN_INTERVAL: 840000, // 14 minutes
  NOTIFICATION_CHECK: 60000, // 1 minute
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
} as const;
