/**
 * Cryptography Utilities
 * Password hashing and JWT token generation
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/environment';
import { JWTPayload } from '@themeforge/shared';

const BCRYPT_ROUNDS = 12;

/**
 * Hash password with bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate access token (15 minutes)
 */
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload as object, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  } as any);
}

/**
 * Generate refresh token (7 days)
 */
export function generateRefreshToken(payload: { userId: string; sessionId: string }): string {
  return jwt.sign(payload as object, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  } as any);
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): { userId: string; sessionId: string } {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; sessionId: string };
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

/**
 * Generate SHA-256 hash (for token storage)
 */
export function sha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate random token
 */
export function generateRandomToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('hex');
}
