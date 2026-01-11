/**
 * Authentication Middleware
 */

import { JWTPayload } from '@themeforge/shared';
import { NextFunction, Request, Response } from 'express';
import { query } from '../config/database';
import { verifyAccessToken } from '../utils/crypto';
import { UnauthorizedError } from '../utils/errors';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Require authentication - validates JWT token
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token
    const payload = verifyAccessToken(token);

    // Check if session is still valid (not revoked)
    const sessionResult = await query(
      `SELECT id, revoked_at, expires_at
       FROM user_sessions
       WHERE id = $1 AND user_id = $2`,
      [payload.sessionId, payload.userId]
    );

    if (sessionResult.rows.length === 0) {
      throw new UnauthorizedError('Session not found');
    }

    const session = sessionResult.rows[0];

    // Check if session is revoked
    if (session.revoked_at) {
      throw new UnauthorizedError('Session has been revoked');
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      throw new UnauthorizedError('Session has expired');
    }

    // Attach user to request
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError('Invalid token'));
    }
  }
}

/**
 * Optional authentication - attaches user if token is valid
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    const payload = verifyAccessToken(token);

    // Attach user to request
    req.user = payload;
    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
}

/**
 * Require specific role
 */
export function requireRole(...roles: Array<'user' | 'premium' | 'admin'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError(`Requires role: ${roles.join(' or ')}`);
    }

    next();
  };
}
