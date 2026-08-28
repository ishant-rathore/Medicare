# Database Deployment

This directory contains database deployment runbooks for Medicare.

The deployment lifecycle is:

`Development -> Staging/Test -> Production/Demo`

PostgreSQL deployments use the authoritative Prisma migration workflow in `backend/src/db/prisma/migrations/`.

SQLite remains local to Flutter and is initialized/upgraded by the existing `DatabaseService` runtime.

All production/demo rollouts require backup/recovery preparation, migration verification, application smoke tests, and evidence of the deployed application and migration versions.
