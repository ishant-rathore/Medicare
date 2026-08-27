// =============================================================================
// backend/src/config/logger.ts
// Structured logging with Winston
// =============================================================================

import winston from 'winston';

import { getEnv } from './environment';

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const developmentFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, requestId, ...meta }) => {
    const reqStr = requestId ? ` [${String(requestId)}]` : '';
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${String(ts)} ${level}${reqStr}: ${String(message)}${metaStr}`;
  }),
);

const productionFormat = combine(timestamp(), errors({ stack: true }), json());

let _logger: winston.Logger | null = null;

export function getLogger(): winston.Logger {
  if (_logger) return _logger;

  const env = getEnv();
  _logger = winston.createLogger({
    level: env.LOG_LEVEL,
    format: env.NODE_ENV === 'production' ? productionFormat : developmentFormat,
    transports: [new winston.transports.Console()],
    // Never log these fields
    defaultMeta: { service: 'medicare-api' },
  });

  return _logger;
}

export const logger = {
  info: (msg: string, meta?: object) => getLogger().info(msg, meta),
  warn: (msg: string, meta?: object) => getLogger().warn(msg, meta),
  error: (msg: string, error?: unknown, meta?: object) => {
    const errorMeta = error instanceof Error
      ? { errorMessage: error.message, stack: error.stack }
      : { error };
    getLogger().error(msg, { ...errorMeta, ...meta });
  },
  http: (msg: string, meta?: object) => getLogger().http(msg, meta),
  debug: (msg: string, meta?: object) => getLogger().debug(msg, meta),
};
