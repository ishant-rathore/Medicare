# Development Database Deployment

## PostgreSQL

1. Provide `DATABASE_URL` through local environment configuration.
2. From `backend/`, install dependencies with `npm ci` when using the lockfile.
3. Validate the Prisma schema with `npx prisma validate --schema=src/db/prisma/schema.prisma`.
4. Apply development migrations with the existing Prisma workflow.
5. Generate the Prisma Client with `npm run db:generate` when needed.
6. Use only synthetic development/test seed data.

## SQLite

Run the Flutter application through its existing `DatabaseService`. Fresh local database initialization and supported version upgrades must be validated through the Flutter runtime.

Never store production credentials or privileged Firebase credentials in development database files.
