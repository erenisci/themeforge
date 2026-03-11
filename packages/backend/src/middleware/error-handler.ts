import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/environment';
import { AppError } from '../utils/errors';

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  if (env.NODE_ENV === 'development') {
    console.error('Error:', error);
  }

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

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.code || 'ERROR',
      message: error.message,
      ...(error.details && { details: error.details }),
    });
  }

  return res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: env.NODE_ENV === 'production' ? 'An unexpected error occurred' : error.message,
  });
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
