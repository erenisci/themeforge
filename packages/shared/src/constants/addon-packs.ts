/**
 * AI Credit Add-on Packs for ThemeForge
 *
 * Pricing Philosophy:
 * - Starter tier baseline: $0.20 per credit
 * - Progressive discounts for larger packs
 * - 50-credit pack matches Pro tier rate ($0.12/credit)
 * - Makes Pro tier attractive without being mandatory
 */

import { AddonPack } from '../types/addon.types';

export const AI_CREDIT_PACKS: AddonPack[] = [
  {
    id: 'pack-10',
    credits: 10,
    price: 200, // $2.00 in cents
    pricePerCredit: 0.2,
    savings: '0%',
    description: 'Quick top-up for occasional needs',
  },
  {
    id: 'pack-25',
    credits: 25,
    price: 400, // $4.00 in cents
    pricePerCredit: 0.16,
    savings: '20%',
    description: 'Better value for moderate usage',
    badge: 'Save 20%',
  },
  {
    id: 'pack-50',
    credits: 50,
    price: 600, // $6.00 in cents
    pricePerCredit: 0.12,
    savings: '40%',
    description: 'Best value - same rate as Pro tier',
    badge: 'Best Value',
    recommended: true,
  },
];

/**
 * Maximum add-on credits a user can hold at once
 * Prevents abuse and encourages subscription upgrades
 */
export const MAX_ADDON_CREDITS = 200;

/**
 * Helper function to get pack by ID
 */
export function getAddonPackById(packId: string): AddonPack | undefined {
  return AI_CREDIT_PACKS.find(pack => pack.id === packId);
}

/**
 * Helper function to validate pack purchase
 */
export function validatePackPurchase(
  packId: string,
  currentBalance: number
): { valid: boolean; error?: string } {
  const pack = getAddonPackById(packId);

  if (!pack) {
    return { valid: false, error: 'Invalid pack ID' };
  }

  if (currentBalance + pack.credits > MAX_ADDON_CREDITS) {
    return {
      valid: false,
      error: `Maximum add-on credit balance is ${MAX_ADDON_CREDITS}`,
    };
  }

  return { valid: true };
}

/**
 * Helper function to calculate savings vs Starter tier
 */
export function calculateSavings(pack: AddonPack): number {
  const starterRate = 0.2; // $0.20 per credit
  const savings = ((starterRate - pack.pricePerCredit) / starterRate) * 100;
  return Math.round(savings);
}

/**
 * Format price in dollars for display
 */
export function formatPrice(priceInCents: number): string {
  return `$${(priceInCents / 100).toFixed(2)}`;
}

/**
 * Get upgrade suggestions when user runs out of credits
 */
export function getUpgradeSuggestions(currentTier: 'free' | 'starter' | 'pro') {
  const suggestions = [];

  // Always show add-on options
  AI_CREDIT_PACKS.forEach(pack => {
    suggestions.push({
      type: 'addon',
      title: `Buy ${pack.credits} AI Credits`,
      price: formatPrice(pack.price),
      action: `/addons/purchase?pack=${pack.id}`,
      badge: pack.badge,
    });
  });

  // Suggest tier upgrade if not on Pro
  if (currentTier === 'free') {
    suggestions.push({
      type: 'upgrade',
      title: 'Upgrade to Starter (15 credits/mo)',
      price: '$3/mo',
      action: '/pricing',
    });
    suggestions.push({
      type: 'upgrade',
      title: 'Upgrade to Pro (50 credits/mo)',
      price: '$6/mo',
      action: '/pricing',
      badge: 'Best Value',
    });
  } else if (currentTier === 'starter') {
    suggestions.push({
      type: 'upgrade',
      title: 'Upgrade to Pro (50 credits/mo)',
      price: '$6/mo',
      action: '/pricing',
      badge: 'Best Value',
    });
  }

  return suggestions;
}
