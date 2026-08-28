# PostgreSQL Database

PostgreSQL is Medicare's canonical cloud database. It is accessed only by the Node.js/Express/TypeScript backend.

## Authority

`backend/src/db/prisma/schema.prisma` is the authoritative PostgreSQL schema.

`backend/src/db/prisma/migrations/` is the authoritative production migration history.

`database/postgresql/schema.sql` is a human-readable SQL reference/export and MUST NOT be treated as a competing migration source.

## Deployment

From `backend/`:

```bash
npm run db:generate
npm run db:migrate:deploy
```

Before staging or production/demo deployment:

- Verify the target PostgreSQL instance and credentials are supplied through secure environment configuration.
- Back up production data according to the approved infrastructure process.
- Apply the checked-in Prisma migrations.
- Run database verification and backend integration/smoke tests.
- Record the application version and migration state.

## Data integrity

Critical synchronization and ownership constraints must remain enforced, including unique `dose_events.local_event_id`, caregiver relationship uniqueness, refill-rule uniqueness, device-token uniqueness, and foreign-key relationships.

## Recovery

Do not manually edit production schema/data to bypass a failed migration. Stop the rollout, preserve failure evidence, and use the approved backup/restore or previous-good-version recovery procedure.

Never commit credentials, service-account keys, or production connection strings.
