// =============================================================================
// backend/src/server.ts
// HTTP server entry point
// =============================================================================

import 'dotenv/config';

<<<<<<< HEAD
import { getEnv } from './config/environment';
import { connectDatabase, disconnectDatabase } from './config/database';
import { getFirebaseApp } from './config/firebase';
import { logger } from './config/logger';
import { createApp } from './app';
=======
import { createApp } from './app';
import { connectDatabase, disconnectDatabase } from './config/database';
import { getEnv } from './config/environment';
import { getFirebaseApp } from './config/firebase';
import { logger } from './config/logger';
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba

async function start(): Promise<void> {
  const env = getEnv();

<<<<<<< HEAD
  // Initialize Firebase Admin SDK
  getFirebaseApp();

  // Connect to database
  await connectDatabase();

  // Create Express app
  const app = createApp();

  // Start HTTP server
=======
  // Initialize required server-side Firebase services.
  getFirebaseApp();

  // Verify database connectivity before accepting traffic.
  await connectDatabase();

  const app = createApp();
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  const server = app.listen(env.PORT, '0.0.0.0', () => {
    logger.info('Medicare API server started', {
      port: env.PORT,
      environment: env.NODE_ENV,
<<<<<<< HEAD
      apiBase: `/api/v1`,
    });
  });

  // ─── Graceful shutdown ───────────────────────────────────────────────────
  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Starting graceful shutdown...`);

    server.close(async () => {
      logger.info('HTTP server closed');
      await disconnectDatabase();
      logger.info('Shutdown complete');
      process.exit(0);
    });

    // Force exit after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 30_000);
  };

  process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => void gracefulShutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', reason);
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', error);
    process.exit(1);
=======
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
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  });
}

start().catch((error) => {
<<<<<<< HEAD
  console.error('Failed to start server:', error);
=======
  logger.error('Failed to start server', {
    error: error instanceof Error ? error.message : 'unknown startup error',
  });
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
  process.exit(1);
});
