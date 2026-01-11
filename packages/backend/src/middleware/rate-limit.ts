/**
 * Rate Limiting Middleware
 * Tier-based rate limits
 *
 * Strategy:
 * - Anonymous users: Use frontend-only interactive demo (no backend API)
 * - Free tier: Authenticated users with 1 theme + 1 AI credit
 * - Starter/Pro: Paid tiers with higher limits
 */

import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * General API rate limiter
 * Tiered limits based on subscription
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: async (req: Request) => {
    // If user is authenticated, check their tier
    if (req.user) {
      // This will be populated by subscription middleware
      const subscription = (req as any).subscription;

      if (subscription?.tier === 'pro') {
        return 500; // Pro: 500 req/15min
      }
      if (subscription?.tier === 'starter') {
        return 200; // Starter: 200 req/15min
      }
      // Free tier (authenticated users)
      return 100; // Free: 100 req/15min
    }

    // Anonymous users: Very limited (only for health, register, login)
    // Theme creation/AI features require authentication (use frontend demo instead)
    return 10; // Anonymous: 10 req/15min (auth endpoints only)
  },
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use IP as default identifier
  keyGenerator: (req: Request) => {
    return req.user?.userId || req.ip || 'anonymous';
  },
});

/**
 * Strict limiter for sensitive endpoints (auth)
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per 15 minutes
  message: {
    error: 'TOO_MANY_ATTEMPTS',
    message: 'Too many authentication attempts, please try again later',
  },
  skipSuccessfulRequests: true,
});

/**
 * AI analysis rate limiter
 * Very strict to prevent abuse
 *
 * Note: AI credits are tracked separately in usage_tracking table
 * This is an additional safety layer for rate limiting
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: async (req: Request) => {
    if (req.user) {
      const subscription = (req as any).subscription;

      if (subscription?.tier === 'pro') {
        return 100; // Pro: 100 AI calls/hour (safety limit)
      }
      if (subscription?.tier === 'starter') {
        return 30; // Starter: 30 AI calls/hour (safety limit)
      }
      // Free tier
      return 5; // Free: 5 AI calls/hour (safety limit)
    }

    // Anonymous users cannot use AI (requires authentication)
    return 0; // Anonymous: No AI access (use frontend demo)
  },
  message: {
    error: 'AI_RATE_LIMIT_EXCEEDED',
    message: 'Too many AI analysis requests, please try again later',
  },
  keyGenerator: (req: Request) => {
    return req.user?.userId || req.ip || 'anonymous';
  },
});

/**
 * Export rate limiter
 */
export const exportLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: async (req: Request) => {
    if (req.user) {
      const subscription = (req as any).subscription;

      // Pro/Starter: unlimited exports (handled by usage tracking instead)
      if (subscription?.tier === 'pro' || subscription?.tier === 'starter') {
        return 10000; // Effectively unlimited
      }
    }

    return 10; // Free: 10 exports/day
  },
  message: {
    error: 'EXPORT_RATE_LIMIT_EXCEEDED',
    message: 'Export limit reached for today',
  },
  keyGenerator: (req: Request) => {
    return req.user?.userId || req.ip || 'anonymous';
  },
});
