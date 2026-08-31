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
import { resolveUserFromFirebase, InternalUser } from '../services/user-resolution.service';

/**
 * Extend Express Request to include authenticated user context.
 * req.userId is ALWAYS the internal PostgreSQL user UUID — never the raw Firebase UID.
 * req.firebaseUid stores the verified Firebase Auth UID.
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string; // Internal PostgreSQL UUID
      userEmail?: string;
      firebaseUid?: string; // Firebase Auth UID
      user?: InternalUser;
    }
  }
}

/**
 * Require a valid Firebase ID token.
 * Sourced strictly from verified Firebase token and resolved to internal PostgreSQL User ID.
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    ResponseHelper.unauthorized(res, 'Authorization header missing or invalid format. Expected Bearer <Firebase ID Token>');
    return;
  }

  const token = authHeader.split(' ')[1]?.trim();
  if (!token) {
    ResponseHelper.unauthorized(res, 'Bearer token is empty');
    return;
  }

  const decodedToken = await verifyFirebaseToken(token);
  if (!decodedToken || !decodedToken.uid) {
    ResponseHelper.unauthorized(res, 'Firebase token is invalid or has expired');
    return;
  }

  // Resolve Firebase UID to internal PostgreSQL user ID (UUID)
  const internalUser = await resolveUserFromFirebase(decodedToken);

  // Set verified user context
  req.userId = internalUser.id; // Internal PostgreSQL UUID!
  req.firebaseUid = decodedToken.uid; // Firebase UID
  req.userEmail = internalUser.email || decodedToken.email;
  req.user = internalUser;

  logger.debug('Auth middleware: user verified and resolved to internal PostgreSQL ID', {
    internalUserId: internalUser.id,
    firebaseUid: decodedToken.uid,
    requestId: req.headers['x-request-id'],
  });

  next();
}

/**
 * Optional auth — sets user context if valid token is present, but does not block.
 */
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]?.trim();
    if (token) {
      const decodedToken = await verifyFirebaseToken(token);
      if (decodedToken && decodedToken.uid) {
        const internalUser = await resolveUserFromFirebase(decodedToken);
        req.userId = internalUser.id;
        req.firebaseUid = decodedToken.uid;
        req.userEmail = internalUser.email || decodedToken.email;
        req.user = internalUser;
      }
    }
  }

  next();
}
