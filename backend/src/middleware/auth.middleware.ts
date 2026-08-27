// =============================================================================
// backend/src/middleware/auth.middleware.ts
// Firebase ID token verification middleware
// Authentication is ALWAYS server-side verified.
// User IDs are NEVER trusted from request body/params.
// =============================================================================

import { NextFunction, Request, Response } from 'express';

import { verifyFirebaseToken } from '../config/firebase';
import { logger } from '../config/logger';
import { ResponseHelper } from '../shared/response.helper';

/**
 * Extend Express Request to include authenticated user context.
 * The userId is ALWAYS sourced from the verified Firebase token — never from client input.
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      firebaseUid?: string;
    }
  }
}

/**
 * Require a valid Firebase ID token.
 * Sets req.userId, req.userEmail, req.firebaseUid.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    ResponseHelper.unauthorized(res, 'Authorization header missing or invalid format');
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    ResponseHelper.unauthorized(res, 'Bearer token is empty');
    return;
  }

  const decodedToken = await verifyFirebaseToken(token);
  if (!decodedToken) {
    ResponseHelper.unauthorized(res, 'Token is invalid or expired');
    return;
  }

  // Set verified user context — sourced ONLY from the verified token
  req.userId = decodedToken.uid;
  req.userEmail = decodedToken.email;
  req.firebaseUid = decodedToken.uid;

  logger.debug('Auth middleware: user authenticated', {
    userId: decodedToken.uid,
    requestId: req.headers['x-request-id'],
  });

  next();
}

/**
 * Optional auth — sets user context if token is present, but doesn't block if missing.
 * Use for endpoints that have different behavior for authenticated vs anonymous users.
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      const decodedToken = await verifyFirebaseToken(token);
      if (decodedToken) {
        req.userId = decodedToken.uid;
        req.userEmail = decodedToken.email;
        req.firebaseUid = decodedToken.uid;
      }
    }
  }

  next();
}
