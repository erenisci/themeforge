/**
 * Custom Error Classes for ThemeForge
 */

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(400, message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(404, `${resource} not found`, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

export class UsageLimitError extends AppError {
  constructor(
    message: string,
    public current: number,
    public limit: number,
    public upgradeUrl?: string
  ) {
    super(429, message, 'USAGE_LIMIT_EXCEEDED', { current, limit, upgradeUrl });
    this.name = 'UsageLimitError';
  }
}

export class StripeError extends AppError {
  constructor(message: string, details?: any) {
    super(402, message, 'PAYMENT_ERROR', details);
    this.name = 'StripeError';
  }
}
