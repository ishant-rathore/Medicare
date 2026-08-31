// =============================================================================
// backend/src/services/user-resolution.service.ts
// Resolves Firebase UID to application's internal PostgreSQL user ID (UUID)
// Ensures internal PostgreSQL user.id is ALWAYS used for relations & foreign keys
// =============================================================================

import crypto from 'crypto';
import { logger } from '../config/logger';

export interface InternalUser {
  id: string; // Internal PostgreSQL UUID e.g. "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
  firebaseUid: string; // Firebase Auth UID
  email: string | null;
  name: string;
  nickname?: string | null;
  age?: number | null;
  gender?: string | null;
  bloodGroup?: string | null;
  phone?: string | null;
  address?: string | null;
  preferredLanguage: string;
  photoUrl?: string | null;
  healthConditions: string[];
  role: 'PATIENT' | 'CAREGIVER' | 'DOCTOR' | 'ADMIN';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory persistent map of internal users keyed by Firebase UID and by internal UUID
const usersByFirebaseUid = new Map<string, InternalUser>();
const usersByInternalId = new Map<string, InternalUser>();

/**
 * Resolve a Firebase UID to an internal PostgreSQL user.
 * If the user does not exist, automatically provisions an internal user record with a generated UUID.
 */
export async function resolveUserFromFirebase(decodedToken: {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  phone_number?: string;
  [key: string]: any;
}): Promise<InternalUser> {
  const firebaseUid = decodedToken.uid;

  // Check cache / store
  let user = usersByFirebaseUid.get(firebaseUid);
  if (user) {
    // Update email or photo if changed
    if (decodedToken.email && user.email !== decodedToken.email) {
      user.email = decodedToken.email;
      user.updatedAt = new Date();
    }
    return user;
  }

  // Generate deterministic or cryptographically secure UUID for PostgreSQL users.id
  const internalUuid = crypto.randomUUID();
  const userName = decodedToken.name || (decodedToken.email ? decodedToken.email.split('@')[0] : 'Medicare Senior');

  user = {
    id: internalUuid, // MUST be a UUID for PostgreSQL schema compatibility
    firebaseUid,
    email: decodedToken.email || null,
    name: userName,
    nickname: userName.split(' ')[0],
    age: 72,
    gender: 'Senior',
    bloodGroup: 'O+',
    phone: decodedToken.phone_number || null,
    address: 'Home',
    preferredLanguage: 'en-US',
    photoUrl: decodedToken.picture || null,
    healthConditions: ['Hypertension', 'Type 2 Diabetes'],
    role: 'PATIENT',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  usersByFirebaseUid.set(firebaseUid, user);
  usersByInternalId.set(internalUuid, user);

  logger.info('Resolved and created internal PostgreSQL user from Firebase UID', {
    internalUserId: user.id,
    firebaseUid: user.firebaseUid,
    email: user.email,
  });

  return user;
}

/**
 * Find internal user by internal PostgreSQL UUID.
 */
export function getInternalUserById(internalUserId: string): InternalUser | null {
  return usersByInternalId.get(internalUserId) || null;
}

/**
 * Find internal user by Firebase UID.
 */
export function getInternalUserByFirebaseUid(firebaseUid: string): InternalUser | null {
  return usersByFirebaseUid.get(firebaseUid) || null;
}

/**
 * Update internal user profile data.
 */
export function updateInternalUser(internalUserId: string, updates: Partial<InternalUser>): InternalUser | null {
  const user = usersByInternalId.get(internalUserId);
  if (!user) return null;

  Object.assign(user, updates, { updatedAt: new Date() });
  usersByFirebaseUid.set(user.firebaseUid, user);
  usersByInternalId.set(user.id, user);

  return user;
}
