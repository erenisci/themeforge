/**
 * Authentication Service
 * Handles user registration, login, and token management
 */

import { AuthResponse, LoginDTO, RegisterDTO, User } from '@themeforge/shared';
import { pool, query } from '../../config/database';
import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  sha256,
  verifyPassword,
} from '../../utils/crypto';
import { ConflictError, UnauthorizedError, ValidationError } from '../../utils/errors';

export class AuthService {
  /**
   * Register new user
   */
  async register(data: RegisterDTO): Promise<AuthResponse> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Check if email already exists
      const emailCheck = await client.query('SELECT id FROM users WHERE email = $1', [data.email]);

      if (emailCheck.rows.length > 0) {
        throw new ConflictError('Email already registered');
      }

      // Check if username already exists
      const usernameCheck = await client.query('SELECT id FROM users WHERE username = $1', [
        data.username,
      ]);

      if (usernameCheck.rows.length > 0) {
        throw new ConflictError('Username already taken');
      }

      // Validate password strength
      if (data.password.length < 8) {
        throw new ValidationError('Password must be at least 8 characters');
      }

      // Hash password
      const passwordHash = await hashPassword(data.password);

      // Create user
      const userResult = await client.query(
        `INSERT INTO users (email, username, password_hash, full_name, role, is_active, email_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, email, username, full_name, email_verified, role, is_active, created_at, updated_at, last_login_at`,
        [data.email, data.username, passwordHash, data.fullName || null, 'user', true, false]
      );

      const user = userResult.rows[0];

      // Create free subscription for new user
      await client.query(
        `INSERT INTO subscriptions (user_id, stripe_customer_id, tier, status)
         VALUES ($1, $2, $3, $4)`,
        [user.id, `cus_${user.id}`, 'free', 'active']
      );

      // Create initial usage tracking record
      await client.query(
        `INSERT INTO usage_tracking (user_id, month)
         VALUES ($1, date_trunc('month', CURRENT_DATE))`,
        [user.id]
      );

      // Create initial add-on credits record (Free tier gets 1 one-time credit)
      await client.query(
        `INSERT INTO user_addon_credits (user_id, ai_credits_addon)
         VALUES ($1, 1)`,
        [user.id]
      );

      await client.query('COMMIT');

      // Generate tokens
      const tokens = await this.generateTokens(user);

      // Update last login
      await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

      return {
        user: this.sanitizeUser(user),
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Login user
   */
  async login(data: LoginDTO): Promise<AuthResponse> {
    // Find user by email
    const userResult = await query(
      `SELECT id, email, username, password_hash, full_name, email_verified, role, is_active, created_at, updated_at, last_login_at
       FROM users
       WHERE email = $1`,
      [data.email]
    );

    if (userResult.rows.length === 0) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const user = userResult.rows[0];

    // Check if account is active
    if (!user.is_active) {
      throw new UnauthorizedError('Account is inactive');
    }

    // Verify password
    const isValid = await verifyPassword(data.password, user.password_hash);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Update last login
    await query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

    return {
      user: this.sanitizeUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // This will be implemented when we add refresh token logic
    throw new Error('Not implemented yet');
  }

  /**
   * Logout user (revoke session)
   */
  async logout(sessionId: string): Promise<void> {
    await query('UPDATE user_sessions SET revoked_at = NOW() WHERE id = $1', [sessionId]);
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(user: any): Promise<{ accessToken: string; refreshToken: string }> {
    // Create session
    const sessionResult = await query(
      `INSERT INTO user_sessions (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '7 days')
       RETURNING id`,
      [user.id, 'placeholder'] // We'll update this after generating token
    );

    const sessionId = sessionResult.rows[0].id;

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: sessionId,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      sessionId: sessionId,
    });

    // Update session with refresh token hash
    await query('UPDATE user_sessions SET token_hash = $1 WHERE id = $2', [
      sha256(refreshToken),
      sessionId,
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Remove password hash from user object
   */
  private sanitizeUser(user: any): User {
    const { password_hash, ...sanitized } = user;
    return {
      ...sanitized,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastLoginAt: user.last_login_at,
      emailVerified: user.email_verified,
      isActive: user.is_active,
      fullName: user.full_name,
    };
  }

  /**
   * Get current user by ID
   */
  async getCurrentUser(userId: string): Promise<User> {
    const result = await query(
      `SELECT id, email, username, full_name, email_verified, role, is_active, created_at, updated_at, last_login_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedError('User not found');
    }

    return this.sanitizeUser(result.rows[0]);
  }
}
