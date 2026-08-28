# Production / Demo Database Deployment

PostgreSQL production/demo deployment uses the authoritative Prisma migration workflow in `backend/`.

## Pre-deployment

- Confirm the approved application version.
- Confirm the current Prisma migration state.
- Supply `DATABASE_URL` through secure environment configuration.
- Complete and verify the required PostgreSQL backup.
- Confirm the previous-good application/database recovery point.

## Deployment

```bash
cd backend
npm run db:migrate:deploy
npm run db:generate
```

After migration, run the PostgreSQL verification checks and application release smoke tests.

## Safety

Never run development seeds against production/demo. Never commit credentials, production connection strings, or real patient data.
