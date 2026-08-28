// =============================================================================
// backend/src/config/firebase.ts
// Firebase Admin SDK initialization
// =============================================================================

import * as admin from 'firebase-admin';

import { getEnv } from './environment';
import { logger } from './logger';

let _app: admin.app.App | null = null;

export function getFirebaseApp(): admin.app.App {
  if (_app) return _app;

  const env = getEnv();

  if (admin.apps.length > 0) {
    _app = admin.apps[0]!;
    return _app;
  }

  try {
    // Firebase is required for authenticated backend operations. Fail with a
    // clear configuration error rather than allowing an undefined credential
    // to reach the Admin SDK.
    const privateKey = env.FIREBASE_PRIVATE_KEY;
    const projectId = env.FIREBASE_PROJECT_ID;
    const clientEmail = env.FIREBASE_CLIENT_EMAIL;

    if (!privateKey || !projectId || !clientEmail) {
      throw new Error(
        'Firebase configuration is incomplete: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are required',
      );
    }

    // Replace escaped newlines in private key (common in environment variables)
    const normalizedPrivateKey = privateKey.replace(/\\n/g, '\n');

    _app = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: normalizedPrivateKey,
      }),
      storageBucket: env.FIREBASE_STORAGE_BUCKET,
    });

    logger.info('Firebase Admin SDK initialized', { projectId });
    return _app;
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin SDK', error);
    throw error;
  }
}

/**
 * Verify a Firebase ID token and return the decoded token.
 * Returns null if the token is invalid.
 */
export async function verifyFirebaseToken(
  token: string,
): Promise<admin.auth.DecodedIdToken | null> {
  try {
    const app = getFirebaseApp();
    const decodedToken = await admin.auth(app).verifyIdToken(token, true);
    return decodedToken;
  } catch {
    return null;
  }
}

/**
 * Send a push notification to a device via Firebase Cloud Messaging.
 */
export async function sendPushNotification(params: {
  deviceToken: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}): Promise<boolean> {
  try {
    const app = getFirebaseApp();
    await admin.messaging(app).send({
      token: params.deviceToken,
      notification: {
        title: params.title,
        body: params.body,
      },
      data: params.data,
      android: {
        priority: 'high',
        notification: {
          channelId: 'medication_reminders',
          priority: 'max',
          defaultSound: true,
          defaultVibrateTimings: true,
        },
      },
    });
    return true;
  } catch (error) {
    logger.error('FCM push notification failed', error, { deviceToken: '[REDACTED]' });
    return false;
  }
}

/**
 * Get Firebase Storage bucket for media uploads.
 */
export function getStorageBucket(): admin.storage.Storage {
  const app = getFirebaseApp();
  return admin.storage(app);
}
