/**
 * Environment Configuration with Validation
 * Uses Zod for type-safe environment variable validation
 */

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3001').transform(Number),

  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL URL'),

  // JWT Secrets
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),

  // JWT Expiry
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),

  // Stripe (optional for development)
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_STARTER_PRICE_ID: z.string().optional(),
  STRIPE_PRO_PRICE_ID: z.string().optional(),

  // Claude API (optional for development)
  ANTHROPIC_API_KEY: z.string().optional(),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // Redis (optional)
  REDIS_URL: z.string().optional(),

  // Frontend URL
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
});

export type Environment = z.infer<typeof envSchema>;

// Validate and export environment
function validateEnvironment(): Environment {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach(err => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnvironment();

// Helper function to check if feature is enabled
export function isFeatureEnabled(feature: 'stripe' | 'ai' | 'redis'): boolean {
  switch (feature) {
    case 'stripe':
      return !!env.STRIPE_SECRET_KEY;
    case 'ai':
      return !!env.ANTHROPIC_API_KEY;
    case 'redis':
      return !!env.REDIS_URL;
    default:
      return false;
  }
}

// Log environment status
if (env.NODE_ENV === 'development') {
  console.log('🔧 Environment Configuration:');
  console.log(`  - NODE_ENV: ${env.NODE_ENV}`);
  console.log(`  - PORT: ${env.PORT}`);
  console.log(`  - DATABASE: ${env.DATABASE_URL ? '✓ Connected' : '✗ Not configured'}`);
  console.log(`  - STRIPE: ${isFeatureEnabled('stripe') ? '✓ Enabled' : '✗ Disabled'}`);
  console.log(`  - AI Service: ${isFeatureEnabled('ai') ? '✓ Enabled' : '✗ Disabled'}`);
  console.log(`  - REDIS: ${isFeatureEnabled('redis') ? '✓ Enabled' : '✗ Disabled'}`);
}
