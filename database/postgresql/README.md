# PostgreSQL Database

PostgreSQL is Medicare's canonical cloud database. It is accessed by the Node.js/Express/TypeScript backend, not directly by the Flutter application.

## Deployment

Use the repository's existing Prisma migration workflow for backend runtime deployment when Prisma migrations are present. The SQL migration under `migrations/` provides the reproducible baseline/reference for this database package.

Before staging or production deployment:

- Verify the target PostgreSQL instance and credentials are supplied through environment configuration.
- Back up production data according to the deployed infrastructure's approved process.
- Apply migrations in order.
- Run schema/backend integration tests and smoke tests.
- Record the resulting application and migration versions.

Never commit credentials, service-account keys, or production connection strings.

## Data integrity

The schema uses foreign keys, state constraints, indexes, and unique identifiers needed for medication ownership and synchronization. `dose_events.local_event_id` must remain unique so retries cannot create duplicate offline dose events.

## Recovery

Do not manually edit production schema/data to work around a failed migration. Stop the rollout, preserve the failure evidence, and use the previous-good application/database version and provider-supported restore/recovery procedure.
