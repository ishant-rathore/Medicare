// =============================================================================
// backend/src/server.ts
// HTTP server entry point
// =============================================================================

import 'dotenv/config';

import { getEnv } from './config/environment';
import { connectDatabase, disconnectDatabase } from './config/database';
import { getFirebaseApp } from './config/firebase';
import { logger } from './config/logger';
import { createApp } from './app';

async function start(): Promise<void> {
  const env = getEnv();

  // Initialize Firebase Admin SDK
  getFirebaseApp();

  // Connect to database
  await connectDatabase();

  // Create Express app
  const app = createApp();

  // Start HTTP server
  const server = app.listen(env.PORT, '0.0.0.0', () => {
    logger.info('Medicare API server started', {
      port: env.PORT,
      environment: env.NODE_ENV,
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
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
