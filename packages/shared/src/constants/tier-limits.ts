/**
 * Tier Limits for ThemeForge
 *
 * Pricing Strategy:
 * - Free: Lead generation, limited features
 * - Starter: $3/mo - Affordable entry point
 * - Pro: $6/mo - Best value for power users
 */

import { SubscriptionTier, TierLimits } from '../types/subscription.types';

export const TIER_LIMITS: Record<SubscriptionTier, TierLimits> = {
  free: {
    themes: 5,
    aiCreditsPerMonth: 0, // Free tier gets 3 one-time credits (handled separately)
    exports: -1, // Unlimited exports
    storageMB: 10,
  },
  starter: {
    themes: 20,
    aiCreditsPerMonth: 15,
    exports: -1, // Unlimited exports
    storageMB: 50,
  },
  pro: {
    themes: -1, // Unlimited themes
    aiCreditsPerMonth: 50,
    exports: -1, // Unlimited exports
    storageMB: 200,
  },
};

/**
 * Free tier special credits
 * These are one-time lifetime credits, not monthly
 */
export const FREE_TIER_LIFETIME_CREDITS = 3;

/**
 * Cost per credit by tier (for reference/analytics)
 */
export const COST_PER_CREDIT: Record<SubscriptionTier, number> = {
  free: 0, // Free credits
  starter: 0.20, // $3 / 15 = $0.20
  pro: 0.12, // $6 / 50 = $0.12 (40% savings vs Starter)
};

/**
 * Tier pricing (in dollars)
 */
export const TIER_PRICING: Record<SubscriptionTier, number> = {
  free: 0,
  starter: 3,
  pro: 6,
};

/**
 * Helper function to check if limit is unlimited
 */
export function isUnlimited(limit: number): boolean {
  return limit === -1;
}

/**
 * Helper function to get remaining quota
 */
export function getRemainingQuota(limit: number, used: number): number {
  if (isUnlimited(limit)) {
    return -1; // Unlimited
  }
  return Math.max(0, limit - used);
}

/**
 * Helper function to check if user has reached limit
 */
export function hasReachedLimit(limit: number, used: number): boolean {
  if (isUnlimited(limit)) {
    return false;
  }
  return used >= limit;
}
