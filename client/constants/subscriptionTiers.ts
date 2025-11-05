/**
 * Subscription tier definitions and pricing
 */

export const SUBSCRIPTION_TIERS = {
  PREVIEW: {
    name: 'Preview',
    price: 4.99,
    currency: 'USD',
    features: [
      'Basic access to content',
      'Limited previews',
      'Community access',
    ],
  },
  PREMIUM: {
    name: 'Premium',
    price: 19.99,
    currency: 'USD',
    features: [
      'Full content access',
      'HD quality',
      'Priority support',
      'Exclusive content',
    ],
  },
  CONSTELLATION: {
    name: 'Constellation',
    price: 49.99,
    currency: 'USD',
    features: [
      'All Premium features',
      'VIP access',
      'Direct messaging',
      'Custom requests',
      'Behind-the-scenes content',
    ],
  },
} as const;

export type SubscriptionTierName = keyof typeof SUBSCRIPTION_TIERS;

/**
 * Service pricing for calendar bookings
 */
export const SERVICE_PRICES = {
  VIDEO_CALL: 499,
  CUSTOM_CONTENT: 299,
  CONSULTATION: 199,
  VIP_EXPERIENCE: 799,
} as const;

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format large numbers with K/M suffixes
 */
export function formatLargeNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
