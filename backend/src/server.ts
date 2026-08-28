// =============================================================================
// backend/src/server.ts
// HTTP server entry point
// =============================================================================

import 'dotenv/config';

import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { getEnv } from './config/environment';
import { getFirebaseApp } from './config/firebase';
import { logger } from './config/logger';

async function start(): Promise<void> {
  const env = getEnv();

  // Initialize required server-side Firebase services.
  getFirebaseApp();

  // Verify database connectivity before accepting traffic.
  await connectDatabase();

  const app = createApp();
  const server = app.listen(env.PORT, '0.0.0.0', () => {
    logger.info('Medicare API server started', {
      port: env.PORT,
      environment: env.NODE_ENV,
      apiBase: '/api/v1',
    });
  });

  let shuttingDown = false;

  const gracefulShutdown = async (signal: string, exitCode = 0): Promise<void> => {
    if (shuttingDown) return;
    shuttingDown = true;

    logger.info('Starting graceful shutdown', { signal });

    const forceExitTimer = setTimeout(() => {
      logger.error('Forced shutdown after timeout', { signal });
      process.exit(1);
    }, 30_000);
    forceExitTimer.unref();

    server.close(async (serverError?: Error) => {
      try {
        if (serverError) {
          logger.error('HTTP server failed to close cleanly', {
            signal,
            error: serverError.message,
          });
          clearTimeout(forceExitTimer);
          process.exit(1);
          return;
        }

        await disconnectDatabase();
        clearTimeout(forceExitTimer);
        logger.info('Shutdown complete', { signal });
        process.exit(exitCode);
      } catch (error) {
        clearTimeout(forceExitTimer);
        logger.error('Shutdown cleanup failed', {
          signal,
          error: error instanceof Error ? error.message : 'unknown shutdown error',
        });
        process.exit(1);
      }
    });
  };

  process.once('SIGTERM', () => void gracefulShutdown('SIGTERM'));
  process.once('SIGINT', () => void gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', {
      error: reason instanceof Error ? reason.message : String(reason),
    });
    void gracefulShutdown('unhandledRejection', 1);
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { error: error.message });
    void gracefulShutdown('uncaughtException', 1);
  });
}

start().catch((error) => {
  logger.error('Failed to start server', {
    error: error instanceof Error ? error.message : 'unknown startup error',
  });
  process.exit(1);
});
