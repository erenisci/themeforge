import rateLimit from 'express-rate-limit';

// General API limiter: 100 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for share endpoint: 10 shares per hour per IP
export const shareLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    error: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many shares, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
