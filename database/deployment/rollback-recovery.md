# Rollback and Recovery

Database rollback is primarily a recovery operation, not an instruction to reverse arbitrary production DDL.

## PostgreSQL

If a migration fails:

1. Stop the rollout.
2. Preserve migration, application, and database logs.
3. Do not manually edit production schema/data to bypass the failure.
4. Determine whether the migration was applied, partially applied, or rejected.
5. Use the deployment environment's approved PostgreSQL backup/restore procedure when data/schema recovery is required.
6. Restore or redeploy the previous known-good application/database version as appropriate.
7. Re-run verification and smoke tests before resuming rollout.

## SQLite

SQLite upgrades must preserve supported local data and offline reminders. A failed upgrade must not silently destroy local medication or dose history. Use the existing Flutter database version/migration strategy and a tested recovery approach appropriate to the mobile storage lifecycle.

Provider-specific recovery commands belong to the deployment environment and must not contain secrets in source control.
