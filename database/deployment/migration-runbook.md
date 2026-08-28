# Migration Runbook

## PostgreSQL

1. Review the pending Prisma migration set.
2. Confirm the target environment and backup state.
3. Validate `DATABASE_URL` is supplied securely.
4. Run `npm run db:migrate:deploy` from `backend/`.
5. Run `npm run db:generate` when the generated client must be refreshed.
6. Run schema/integrity verification.
7. Run backend integration and smoke tests.
8. Record the application version and migration state.

Never bypass a failed migration by manually editing production schema/data.

## SQLite

SQLite schema changes are applied through the Flutter `DatabaseService` versioned runtime upgrade path. Add the next migration/version together, then test fresh initialization and every supported upgrade path.

## Failure handling

Stop the rollout on migration failure. Preserve logs and failure evidence, prevent application rollout against an incompatible schema, and use the documented recovery procedure.
