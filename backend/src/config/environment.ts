// =============================================================================
// backend/src/config/environment.ts
// Environment variable validation and typed access
// =============================================================================

import { z } from 'zod';

<<<<<<< HEAD
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().default('postgresql://medicare:medicare@localhost:5432/medicare'),
  FIREBASE_PROJECT_ID: z.string().default('medicare-v2'),
  FIREBASE_CLIENT_EMAIL: z.string().email('FIREBASE_CLIENT_EMAIL must be a valid email').default('service-account@medicare-v2.iam.gserviceaccount.com'),
  FIREBASE_PRIVATE_KEY: z.string().default('-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC\n-----END PRIVATE KEY-----'),
  FIREBASE_STORAGE_BUCKET: z.string().optional(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').optional(),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
  GEMINI_API_KEY: z.string().optional(),
  MAX_UPLOAD_SIZE_MB: z.coerce.number().default(10),
});
=======
const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    PORT: z.coerce.number().int().min(1).max(65535).default(3000),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    FIREBASE_PROJECT_ID: z.string().min(1, 'FIREBASE_PROJECT_ID is required').optional(),
    FIREBASE_CLIENT_EMAIL: z.string().email('FIREBASE_CLIENT_EMAIL must be a valid email').optional(),
    FIREBASE_PRIVATE_KEY: z.string().min(1, 'FIREBASE_PRIVATE_KEY is required').optional(),
    FIREBASE_STORAGE_BUCKET: z.string().optional(),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').optional(),
    ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),
    RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
    RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).default('info'),
    GEMINI_API_KEY: z.string().optional(),
    MAX_UPLOAD_SIZE_MB: z.coerce.number().positive().max(100).default(10),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV !== 'production') return;

    const requiredFirebaseFields = [
      ['FIREBASE_PROJECT_ID', env.FIREBASE_PROJECT_ID],
      ['FIREBASE_CLIENT_EMAIL', env.FIREBASE_CLIENT_EMAIL],
      ['FIREBASE_PRIVATE_KEY', env.FIREBASE_PRIVATE_KEY],
    ] as const;

    for (const [name, value] of requiredFirebaseFields) {
      if (!value) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [name],
          message: `${name} is required in production`,
        });
      }
    }

    if (env.ALLOWED_ORIGINS.split(',').some((origin) => origin.trim() === '*')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['ALLOWED_ORIGINS'],
        message: 'Wildcard CORS origin is not allowed in production',
      });
    }

    if (env.ALLOWED_ORIGINS.split(',').some((origin) => origin.trim() === 'http://localhost:3000')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['ALLOWED_ORIGINS'],
        message: 'localhost CORS origin must not be used in production',
      });
    }
  });
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba

type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

export function getEnv(): Env {
  if (_env) return _env;

  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
<<<<<<< HEAD
    const errors = parsed.error.issues.map((i) => `  ${i.path.join('.')}: ${i.message}`).join('\n');
=======
    const errors = parsed.error.issues
      .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
    throw new Error(`Invalid environment configuration:\n${errors}\n\nCheck your .env file against .env.example`);
  }

  _env = parsed.data;
  return _env;
}

export function isProduction(): boolean {
  return getEnv().NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return getEnv().NODE_ENV === 'development';
}
