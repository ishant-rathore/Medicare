// =============================================================================
// backend/src/app.ts
// Express application setup — middleware + routes
// =============================================================================

import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { getEnv } from './config/environment';
import { logger } from './config/logger';
import { globalErrorHandler, notFoundHandler } from './middleware/error.middleware';
import { generalRateLimiter } from './middleware/rate-limit.middleware';
import { requestIdMiddleware } from './middleware/request-id.middleware';

// Module routers
import medicinesRouter from './modules/medicines/medicines.routes';
import syncRouter from './modules/sync/sync.routes';
import doseEventsRouter from './modules/dose-events/dose-events.routes';
import usersRouter from './modules/users/users.routes';
import remindersRouter from './modules/reminders/reminders.routes';
import caregiversRouter from './modules/caregivers/caregivers.routes';
import refillsRouter from './modules/refills/refills.routes';
import deviceTokensRouter from './modules/device-tokens/device-tokens.routes';
import notificationsRouter from './modules/notifications/notifications.routes';
import adherenceRouter from './modules/adherence/adherence.routes';

export function createApp(): Express {
  const app = express();
  const env = getEnv();

  // ─── Security headers ─────────────────────────────────────────────────────
  app.use(helmet());

  // ─── CORS ─────────────────────────────────────────────────────────────────
  const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id'],
      exposedHeaders: ['X-Request-Id'],
      credentials: true,
    }),
  );

  // ─── Request parsing ───────────────────────────────────────────────────────
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ─── Request ID ───────────────────────────────────────────────────────────
  app.use(requestIdMiddleware);

  // ─── HTTP logging ─────────────────────────────────────────────────────────
  if (env.NODE_ENV !== 'test') {
    app.use(
      morgan('combined', {
        stream: { write: (msg) => logger.http(msg.trim()) },
        // Skip health check logs
        skip: (req) => req.url === '/api/v1/health',
      }),
    );
  }

  // ─── Rate limiting ────────────────────────────────────────────────────────
  app.use('/api', generalRateLimiter);

  // ─── Health check (no auth) ───────────────────────────────────────────────
  app.get('/api/v1/health', (_req, res) => {
    res.json({
      success: true,
      data: {
        status: 'ok',
        service: 'medicare-api',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      },
    });
  });

  // ─── API Routes ───────────────────────────────────────────────────────────
  app.use('/api/v1/users', usersRouter);
  app.use('/api/v1/medicines', medicinesRouter);
  app.use('/api/v1/reminders', remindersRouter);
  app.use('/api/v1/dose-events', doseEventsRouter);
  app.use('/api/v1/adherence', adherenceRouter);
  app.use('/api/v1/caregivers', caregiversRouter);
  app.use('/api/v1/refills', refillsRouter);
  app.use('/api/v1/sync', syncRouter);
  app.use('/api/v1/device-tokens', deviceTokensRouter);
  app.use('/api/v1/notifications', notificationsRouter);

  // ─── 404 handler ──────────────────────────────────────────────────────────
  app.use(notFoundHandler);

  // ─── Global error handler (MUST be last) ──────────────────────────────────
  app.use(globalErrorHandler);

  return app;
}
