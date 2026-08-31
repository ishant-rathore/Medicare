// =============================================================================
// backend/src/middleware/request-id.middleware.ts
// Assigns a unique request ID to every request for tracing
// =============================================================================

import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const existingId = req.headers['x-request-id'] as string | undefined;
  const requestId = existingId ?? uuidv4();

  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-Id', requestId);

  next();
}
