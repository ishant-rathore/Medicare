// =============================================================================
// backend/src/config/database.ts
// Prisma client singleton
// =============================================================================

import { PrismaClient } from '@prisma/client';

import { isProduction } from './environment';
import { logger } from './logger';

declare global {
  // Allow global _prisma in development (prevents multiple instances with hot reload)
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: isProduction()
      ? [{ level: 'error', emit: 'event' }]
      : [
          { level: 'query', emit: 'event' },
          { level: 'error', emit: 'event' },
          { level: 'warn', emit: 'event' },
        ],
  });
}

export const prisma: PrismaClient = isProduction()
  ? createPrismaClient()
  : (global._prisma ?? (global._prisma = createPrismaClient()));

// Log slow queries in development
if (!isProduction()) {
  (prisma as unknown as { $on: (event: string, fn: (e: { query: string; duration: number }) => void) => void }).$on('query', (e) => {
    if (e.duration > 500) {
      logger.warn('Slow query detected', { query: e.query, durationMs: e.duration });
    }
  });
}

export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  logger.info('Database connected');
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  logger.info('Database disconnected');
}
