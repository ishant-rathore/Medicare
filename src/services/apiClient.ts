// =============================================================================
// src/services/apiClient.ts
// Authenticated API client for Medicare
// Attaches Authorization: Bearer <Firebase ID Token> to all backend requests
// Handles token refresh and expired session recovery
// =============================================================================

import { getFirebaseIdToken, logoutFirebase, isDemoMode } from './firebaseAuth';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  message?: string;
  [key: string]: any;
}

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public data?: any,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/**
 * Execute an authenticated HTTP request.
 */
async function request<T = any>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers || {});

  // Retrieve valid Firebase ID token
  const token = await getFirebaseIdToken(isRetry);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized / Token Expired
  if (response.status === 401) {
    if (!isRetry && token) {
      // Try forcing token refresh once
      const refreshedToken = await getFirebaseIdToken(true);
      if (refreshedToken) {
        return request<T>(endpoint, options, true);
      }
    }

    const errJson = await response.json().catch(() => ({}));
    throw new ApiClientError(
      401,
      errJson.error?.code || 'UNAUTHORIZED',
      errJson.error?.message || 'Session expired or invalid token. Please log in again.',
      errJson,
    );
  }

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiClientError(
      response.status,
      json.error?.code || 'API_ERROR',
      json.error?.message || `Request failed with status ${response.status}`,
      json,
    );
  }

  return json;
}

export const apiClient = {
  get: <T = any>(url: string, options?: RequestInit) =>
    request<T>(url, { method: 'GET', ...options }),

  post: <T = any>(url: string, body?: any, options?: RequestInit) =>
    request<T>(url, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  put: <T = any>(url: string, body?: any, options?: RequestInit) =>
    request<T>(url, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  patch: <T = any>(url: string, body?: any, options?: RequestInit) =>
    request<T>(url, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  delete: <T = any>(url: string, options?: RequestInit) =>
    request<T>(url, { method: 'DELETE', ...options }),

  /**
   * Verify authentication session with the backend.
   */
  async verifySession(): Promise<ApiResponse<{ user: any; internalUserId: string; firebaseUid: string }>> {
    if (isDemoMode()) {
      return {
        success: true,
        data: {
          user: {
            name: 'Ramesh Kumar',
            nickname: 'Ramesh',
            phone: '+91 98765 43210',
            preferredLanguage: 'en-US',
            caregiverPhone: '+91 98765 43211',
          },
          internalUserId: 'usr_ramesh_01',
          firebaseUid: 'demo_user_ramesh',
        },
      };
    }
    return request('/api/auth/me', { method: 'GET' });
  },
};
