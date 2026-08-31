// =============================================================================
// src/services/firebaseAuth.ts
// Real Firebase Authentication client service
// Manages real Firebase Auth tokens, user persistence, and auth state
// =============================================================================

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  Auth,
} from 'firebase/auth';

// Safe client-side Firebase configuration (uses env if present, or fallback public dev config)
const metaEnv = (import.meta as any).env || {};
const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || 'AIzaSyDemoMedicareApiKeyForAuthClient123',
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || `${metaEnv.VITE_FIREBASE_PROJECT_ID || 'medicare-v2'}.firebaseapp.com`,
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || 'medicare-v2',
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || `${metaEnv.VITE_FIREBASE_PROJECT_ID || 'medicare-v2'}.appspot.com`,
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || '100000000000',
  appId: metaEnv.VITE_FIREBASE_APP_ID || '1:100000000000:web:abcdef123456',
};

let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth: Auth = getAuth(app);

// Configure safe browser local persistence
try {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn('Firebase persistence warning:', err);
  });
} catch (err) {
  console.warn('Firebase setPersistence notice:', err);
}

/**
 * Format phone number to standard email format if identifier is a phone number.
 */
export function formatIdentifierToEmail(identifier: string): string {
  const trimmed = identifier.trim();
  if (trimmed.includes('@')) {
    return trimmed.toLowerCase();
  }
  // Strip non-digits
  const digits = trimmed.replace(/\D/g, '');
  return `senior_${digits || 'user'}@medicare.app`;
}

export const DEMO_MODE_STORAGE_KEY = 'medicare_demo_mode';

export function isDemoMode(): boolean {
  try {
    return typeof window !== 'undefined' && localStorage.getItem(DEMO_MODE_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setDemoMode(enabled: boolean): void {
  try {
    if (typeof window !== 'undefined') {
      if (enabled) {
        localStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true');
      } else {
        localStorage.removeItem(DEMO_MODE_STORAGE_KEY);
      }
    }
  } catch (err) {
    console.warn('Error setting demo mode in storage:', err);
  }
}

export interface AuthSession {
  user: FirebaseUser | null;
  token: string | null;
  email: string | null;
  displayName: string | null;
  uid: string | null;
  isDemo?: boolean;
}

/**
 * Log in with Email or Phone and Password using real Firebase Auth.
 */
export async function loginWithEmailOrPhone(identifier: string, password: string): Promise<{
  user: FirebaseUser;
  token: string;
}> {
  const email = formatIdentifierToEmail(identifier);
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  return {
    user: userCredential.user,
    token,
  };
}

/**
 * Register a new user using real Firebase Auth.
 */
export async function registerWithEmailOrPhone(
  identifier: string,
  password: string,
  displayName?: string,
): Promise<{
  user: FirebaseUser;
  token: string;
}> {
  const email = formatIdentifierToEmail(identifier);
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }

  const token = await userCredential.user.getIdToken(true);
  return {
    user: userCredential.user,
    token,
  };
}

/**
 * Log out from Firebase Authentication and clear demo mode.
 */
export async function logoutFirebase(): Promise<void> {
  setDemoMode(false);
  try {
    await signOut(auth);
  } catch {
    // Gracefully handle logout when offline or not signed in via Firebase
  }
}

/**
 * Retrieve current Firebase ID Token.
 * If token is near expiration, refreshes automatically.
 * Returns demo-token in demo mode.
 */
export async function getFirebaseIdToken(forceRefresh = false): Promise<string | null> {
  if (isDemoMode()) {
    return 'demo-token';
  }
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  try {
    return await currentUser.getIdToken(forceRefresh);
  } catch (err) {
    console.error('Failed to get Firebase ID token:', err);
    return null;
  }
}

/**
 * Listen for Firebase Auth state changes (login, logout, session restoration).
 */
export function onFirebaseAuthStateChanged(
  callback: (session: AuthSession) => void,
): () => void {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const token = await user.getIdToken();
        callback({
          user,
          token,
          email: user.email,
          displayName: user.displayName,
          uid: user.uid,
        });
      } catch (err) {
        callback({
          user,
          token: null,
          email: user.email,
          displayName: user.displayName,
          uid: user.uid,
        });
      }
    } else {
      callback({
        user: null,
        token: null,
        email: null,
        displayName: null,
        uid: null,
      });
    }
  });
}
