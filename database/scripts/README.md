# Database Scripts

This directory documents the repository-supported database deployment and validation commands.

## PostgreSQL

Prisma is the authoritative runtime migration mechanism:

```bash
cd backend
npm run db:generate
npm run db:migrate:deploy
```

Do not add a second PostgreSQL migration runner here. Use the verification SQL under `database/postgresql/verification/` after migrations are applied.

## SQLite

SQLite initialization and upgrades remain owned by the Flutter `DatabaseService`. Validate them through the Flutter runtime and tests rather than introducing a competing migration engine.

All environment-specific values, including `DATABASE_URL`, must come from environment configuration and must never be hard-coded.
