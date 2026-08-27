// =============================================================================
// backend/src/middleware/error.middleware.ts
// Centralized error handling — converts AppError and unexpected errors to safe responses
// NEVER exposes stack traces or internal details to clients
// =============================================================================

import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { logger } from '../config/logger';
import { isAppError } from '../shared/errors/app-error';

/**
 * 404 handler — catches unmatched routes
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
}

/**
 * Global error handler — must be registered LAST in Express middleware chain
 */
export function globalErrorHandler(
  error: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  const requestId = req.headers['x-request-id'] as string | undefined;

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    logger.warn('Validation error', { requestId, issues: error.issues });
    res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
    return;
  }

  // Handle known application errors
  if (isAppError(error)) {
    if (error.statusCode >= 500) {
      logger.error('Operational error', error, { requestId });
    } else {
      logger.warn('Client error', { message: error.message, code: error.errorCode, requestId });
    }

    res.status(error.statusCode).json({
      success: false,
      error: {
        code: error.errorCode,
        message: error.message,
        // Only include details for operational errors, not 5xx
        ...(error.statusCode < 500 && error.details ? { details: error.details } : {}),
      },
    });
    return;
  }

  // Handle unexpected errors — log full details server-side, return generic message to client
  logger.error('Unexpected error', error, {
    requestId,
    method: req.method,
    path: req.path,
  });

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again later.',
    },
  });
}
