# Production / Demo Database Deployment

Production/demo PostgreSQL deployment is controlled by the backend's Prisma migration workflow.

## Pre-deployment

- Confirm the approved application version and migration state.
- Confirm `DATABASE_URL` and other configuration are supplied by the deployment environment.
- Create and verify the required PostgreSQL backup.
- Confirm the previous-good application/database version is available for recovery.

## Deployment

From `backend/`:

```bash
npm run db:migrate:deploy
npm run db:generate
```

Then run the database verification checks and application smoke tests defined by the release process.

## Verification

Verify:

- expected schema is present
- critical constraints and indexes exist
- backend connects successfully
- dose-event idempotency is preserved
- local/offline reminder behavior remains independent of PostgreSQL

Never run development seed data in production/demo.
