/**
 * Global Error Handler Middleware
 */

import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/environment';
import { AppError } from '../utils/errors';

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  // Log error in development
  if (env.NODE_ENV === 'development') {
    console.error('❌ Error:', error);
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }

  // Custom AppError
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.code || 'ERROR',
      message: error.message,
      ...(error.details && { details: error.details }),
    });
  }

  // PostgreSQL errors
  if ('code' in error) {
    const pgError = error as any;

    // Unique constraint violation
    if (pgError.code === '23505') {
      return res.status(409).json({
        error: 'CONFLICT',
        message: 'Resource already exists',
        details: pgError.detail,
      });
    }

    // Foreign key violation
    if (pgError.code === '23503') {
      return res.status(400).json({
        error: 'INVALID_REFERENCE',
        message: 'Referenced resource does not exist',
      });
    }
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'INVALID_TOKEN',
      message: 'Invalid authentication token',
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'TOKEN_EXPIRED',
      message: 'Authentication token has expired',
    });
  }

  // Default 500 error
  return res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message,
    ...(env.NODE_ENV === 'development' && { stack: error.stack }),
  });
}

/**
 * Async handler wrapper to catch promise rejections
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
