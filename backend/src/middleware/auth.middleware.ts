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

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      firebaseUid?: string;
    }
  }
}

/** Require a valid Firebase ID token and attach only verified identity. */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !/^Bearer\s+\S+$/i.test(authHeader)) {
    ResponseHelper.unauthorized(res, 'Authorization header missing or invalid format');
    return;
  }

  const token = authHeader.slice(authHeader.indexOf(' ') + 1).trim();

  try {
    const decodedToken = await verifyFirebaseToken(token);

    if (!decodedToken?.uid) {
      ResponseHelper.unauthorized(res, 'Token is invalid or expired');
      return;
    }

    // Identity is sourced ONLY from the verified Firebase token.
    req.userId = decodedToken.uid;
    req.userEmail = decodedToken.email;
    req.firebaseUid = decodedToken.uid;

    logger.debug('Authenticated request', {
      firebaseUid: decodedToken.uid,
      requestId: req.headers['x-request-id'],
    });

    next();
  } catch (error) {
    // Never expose Firebase verification internals or token material.
    logger.warn('Firebase authentication failed', {
      requestId: req.headers['x-request-id'],
      error: error instanceof Error ? error.message : 'unknown authentication error',
    });
    ResponseHelper.unauthorized(res, 'Token is invalid or expired');
  }
}

/** Optional authentication for endpoints that support anonymous access. */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !/^Bearer\s+\S+$/i.test(authHeader)) {
    next();
    return;
  }

  const token = authHeader.slice(authHeader.indexOf(' ') + 1).trim();

  try {
    const decodedToken = await verifyFirebaseToken(token);
    if (decodedToken?.uid) {
      req.userId = decodedToken.uid;
      req.userEmail = decodedToken.email;
      req.firebaseUid = decodedToken.uid;
    }
  } catch {
    // Optional auth deliberately continues without an authenticated context.
  }

  next();
}
