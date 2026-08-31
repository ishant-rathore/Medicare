// =============================================================================
// backend/src/shared/response.helper.ts
// Standardized JSON response builders
// =============================================================================

import { Response } from 'express';

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export const ResponseHelper = {
  /** 200 OK */
  ok<T>(res: Response, data: T, message?: string): Response {
    const body: ApiSuccessResponse<T> = { success: true, data };
    if (message) body.message = message;
    return res.status(200).json(body);
  },

  /** 201 Created */
  created<T>(res: Response, data: T, message?: string): Response {
    const body: ApiSuccessResponse<T> = {
      success: true,
      data,
      message: message ?? 'Resource created successfully',
    };
    return res.status(201).json(body);
  },

  /** 204 No Content */
  noContent(res: Response): Response {
    return res.status(204).send();
  },

  /** Paginated list response */
  paginated<T>(
    res: Response,
    data: T[],
    meta: { page: number; limit: number; total: number },
  ): Response {
    const totalPages = Math.ceil(meta.total / meta.limit);
    const body: ApiSuccessResponse<T[]> = {
      success: true,
      data,
      meta: { ...meta, totalPages },
    };
    return res.status(200).json(body);
  },

  /** 400 Bad Request */
  badRequest(res: Response, message: string, details?: unknown): Response {
    const body: ApiErrorResponse = {
      success: false,
      error: { code: 'BAD_REQUEST', message, details },
    };
    return res.status(400).json(body);
  },

  /** 401 Unauthorized */
  unauthorized(res: Response, message = 'Authentication required'): Response {
    const body: ApiErrorResponse = {
      success: false,
      error: { code: 'UNAUTHORIZED', message },
    };
    return res.status(401).json(body);
  },

  /** 403 Forbidden */
  forbidden(res: Response, message = 'Access denied'): Response {
    const body: ApiErrorResponse = {
      success: false,
      error: { code: 'FORBIDDEN', message },
    };
    return res.status(403).json(body);
  },

  /** 404 Not Found */
  notFound(res: Response, resource = 'Resource'): Response {
    const body: ApiErrorResponse = {
      success: false,
      error: { code: 'NOT_FOUND', message: `${resource} not found` },
    };
    return res.status(404).json(body);
  },

  /** 409 Conflict */
  conflict(res: Response, message: string): Response {
    const body: ApiErrorResponse = {
      success: false,
      error: { code: 'CONFLICT', message },
    };
    return res.status(409).json(body);
  },

  /** 422 Validation Error */
  validationError(res: Response, details: unknown): Response {
    const body: ApiErrorResponse = {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Request validation failed', details },
    };
    return res.status(422).json(body);
  },

  /** 429 Too Many Requests */
  tooManyRequests(res: Response): Response {
    const body: ApiErrorResponse = {
      success: false,
      error: { code: 'RATE_LIMITED', message: 'Too many requests. Please slow down.' },
    };
    return res.status(429).json(body);
  },

  /** 500 Internal Server Error */
  internalError(res: Response, message = 'An unexpected error occurred'): Response {
    const body: ApiErrorResponse = {
      success: false,
      error: { code: 'INTERNAL_SERVER_ERROR', message },
    };
    return res.status(500).json(body);
  },
};
