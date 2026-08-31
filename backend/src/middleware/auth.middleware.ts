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
<<<<<<< HEAD
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
=======

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
      firebaseUid?: string;
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    }
  }
}

<<<<<<< HEAD
/**
 * Require a valid Firebase ID token.
 * Sourced strictly from verified Firebase token and resolved to internal PostgreSQL User ID.
 */
=======
/** Require a valid Firebase ID token and attach only verified identity. */
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

<<<<<<< HEAD
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
=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
export async function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

<<<<<<< HEAD
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
=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  }

  next();
}
