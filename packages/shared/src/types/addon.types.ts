/**
 * Add-on related types for ThemeForge
 */

export type AddonType = 'ai_credits';

export type AddonPurchaseStatus = 'succeeded' | 'failed' | 'refunded';

export interface AddonPack {
  id: string;
  credits: number;
  price: number; // in cents
  pricePerCredit: number;
  savings: string;
  description: string;
  badge?: string;
  recommended?: boolean;
}

export interface UserAddonCredits {
  id: string;
  userId: string;
  aiCreditsAddon: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddonPurchase {
  id: string;
  userId: string;
  addonType: AddonType;
  packId: string;
  creditsPurchased: number;
  amountPaid: number; // in cents
  currency: string;
  stripePaymentIntentId?: string;
  status: AddonPurchaseStatus;
  purchasedAt: Date;
}

export interface PurchaseAddonDTO {
  packId: string;
}

export interface AddonPurchaseResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  credits: number;
}

export interface AddonBalanceResponse {
  aiCreditsAddon: number;
}

export interface AddonUsageInfo {
  tierLimit: number;
  tierUsed: number;
  addonBalance: number;
  totalAvailable: number;
  totalUsed: number;
}
