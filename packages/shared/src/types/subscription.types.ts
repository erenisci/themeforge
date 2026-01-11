/**
 * Subscription-related types for ThemeForge
 */

export type SubscriptionTier = 'free' | 'starter' | 'pro';

export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'trialing'
  | 'incomplete';

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TierLimits {
  themes: number; // -1 for unlimited
  aiCreditsPerMonth: number;
  exports: number; // -1 for unlimited
  storageMB: number;
}

export interface UsageTracking {
  id: string;
  userId: string;
  month: Date; // First day of month (2024-01-01)
  themesCreated: number;
  aiAnalysisCount: number;
  exportsCount: number;
  storageBytes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutSessionDTO {
  tier: 'starter' | 'pro';
  successUrl?: string;
  cancelUrl?: string;
}

export interface SubscriptionUpgradeDTO {
  newTier: 'starter' | 'pro';
}
