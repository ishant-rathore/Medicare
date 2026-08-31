# PostgreSQL Verification

These checks validate the deployed PostgreSQL database against Medicare's authoritative Prisma schema.

Run them only against an already-initialized PostgreSQL database. Production credentials must come from environment configuration and must never be stored in this directory.

## Checks

- `schema-check.sql` verifies expected tables, enums, columns, indexes, and unique constraints.
- `integrity-check.sql` verifies critical foreign keys and synchronization constraints.

The runtime migration authority is `backend/src/db/prisma/migrations/`. This directory is for post-migration verification only.
