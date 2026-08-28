# PostgreSQL Migrations

This directory contains versioned PostgreSQL migrations for Medicare.

## Rules

- PostgreSQL is the canonical cloud persistence layer.
- Apply migrations through the backend/Prisma migration workflow; this directory is also the deployment documentation and reproducibility baseline.
- Never edit an already-applied migration. Add a new numbered migration instead.
- Production migrations must run against the configured `DATABASE_URL`; credentials are never committed.
- Validate migrations in CI against a fresh PostgreSQL database before release.
- Preserve the local-first reminder path: cloud database availability must never be required to execute an already-configured local reminder.

## Current ORM Baseline

The backend currently uses Prisma with `backend/src/db/prisma/schema.prisma` and exposes `prisma migrate deploy` through the backend package scripts. Keep the Prisma migration history and this database deployment documentation consistent.

## Rollback

Prefer forward-fix migrations. Do not perform destructive rollback in production unless an explicit, reviewed recovery procedure exists. Restore a previous-good backup only after validating application/schema compatibility.
