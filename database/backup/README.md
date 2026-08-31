# Database Backup and Recovery

PostgreSQL backups are an operational responsibility of the deployed environment. Backups must be completed before production schema migrations and treated as sensitive data.

## Required process

1. Confirm the current application and Prisma migration version.
2. Create a provider-supported PostgreSQL backup.
3. Verify the backup completed successfully.
4. Apply the approved Prisma migrations.
5. Run post-migration verification and application smoke tests.
6. Retain the previous-good application/database version for recovery.

## Recovery

Do not manually edit a production database to bypass a failed migration. Stop the rollout, preserve logs/evidence, restore using the deployed provider's supported recovery procedure when required, and redeploy the previous known-good application/schema version.

Provider-specific backup commands must be maintained by the deployment environment and must not contain credentials in source control.
