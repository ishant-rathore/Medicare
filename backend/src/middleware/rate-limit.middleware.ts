// =============================================================================
// backend/src/middleware/rate-limit.middleware.ts
// Rate limiting per IP and per user
// =============================================================================

import rateLimit from 'express-rate-limit';

import { getEnv } from '../config/environment';
import { logger } from '../config/logger';

const env = getEnv();

/**
 * General API rate limiter — applies to all /api routes
 */
export const generalRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests from this IP. Please wait and try again.',
    },
  },
  handler: (req, res, _next, options) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      requestId: req.headers['x-request-id'],
    });
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * Strict rate limiter for auth endpoints
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many authentication attempts. Please wait 15 minutes.',
    },
  },
});

/**
 * Sync rate limiter — allows bursts for offline sync
 */
export const syncRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
