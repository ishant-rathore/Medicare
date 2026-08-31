# PostgreSQL Migrations

Prisma is the authoritative PostgreSQL schema and production migration mechanism for Medicare.

Authoritative schema:

`backend/src/db/prisma/schema.prisma`

Deployment command:

`cd backend && npm run db:migrate:deploy`

Prisma migrations, when added to the repository, belong under the Prisma migration directory configured for the backend. Do not create a second SQL migration chain under this directory; doing so would allow the PostgreSQL schema to drift.

`database/postgresql/schema.sql` is a human-readable SQL reference and is not an independent production migration source.

Before production/staging release:

1. Validate the Prisma schema.
2. Apply the checked-in Prisma migrations to a fresh PostgreSQL database.
3. Generate/validate Prisma Client.
4. Run backend integration tests against the migrated database.
5. Verify critical constraints, especially `dose_events.local_event_id` uniqueness.
6. Back up production data before schema changes.

Never embed credentials, secrets, or environment-specific connection strings in migrations.