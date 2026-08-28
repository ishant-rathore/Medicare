# Medicare Database

Deployment package for the Medicare offline-first data layer.

## Architecture

- **PostgreSQL** is the canonical cloud database used by the Node.js/Express backend.
- **SQLite** is the operational local database used by the Flutter Android app for offline reminders, local dose history and pending synchronization.
- **Firebase Authentication** supplies identity; protected backend operations verify Firebase ID tokens server-side.
- The Android local reminder path must never depend on PostgreSQL, the API or network availability.

## Repository Layout

```text
database/
├── README.md
├── postgresql/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   └── README.md
│   ├── seeds/
│   │   └── README.md
│   └── schema.sql
├── sqlite/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   └── README.md
│   └── schema.sql
└── scripts/
    └── README.md
```

The backend currently uses Prisma as its PostgreSQL ORM and exposes `prisma migrate deploy` through `backend/package.json`. Keep Prisma migration history and the deployment SQL/documentation synchronized. The Flutter local database is currently initialized by `frontend/lib/data/local/database_service.dart` at database version 1.

## Deployment Environments

### Development
Use synthetic data, local/test PostgreSQL, and a disposable SQLite database.

### Staging / Test
Use an isolated PostgreSQL database and representative test Android devices. Run migrations before integration and device smoke tests.

### Production / Demo
Use managed PostgreSQL with restricted credentials, explicit approval, verified migrations, backups and a previous-good application build. Never run development seed data automatically.

## Required Release Gates

1. Validate schema and migration ordering.
2. Apply migrations to a fresh PostgreSQL database.
3. Verify backend Prisma schema compatibility.
4. Initialize SQLite from the baseline and verify foreign keys/WAL.
5. Verify `local_event_id` uniqueness and synchronization idempotency.
6. Run backend tests and database integration tests.
7. Verify offline reminder behavior independently of cloud connectivity.
8. Verify backup/restore and migration recovery procedures for the target environment.

## Backup / Recovery

Backup commands are environment-specific and must be supplied by the selected PostgreSQL provider/operations environment. Do not commit credentials. Before a production schema change, retain a known-good database backup and application artifact. Prefer forward-fix migrations; use restore procedures only after compatibility validation.

## Security

- Never commit database passwords, Firebase service credentials or production connection strings.
- Keep PostgreSQL credentials server-side.
- Use parameterized queries/Prisma for database access.
- Enforce resource-level authorization in the backend.
- Minimize medication data in logs.
- Treat caregiver access as explicit, scoped and revocable.

## Offline / Sync Rule

The critical path is:

`SQLite/local medicine data -> local reminder schedule -> Android alarm/notification -> voice/visual reminder -> Taken/Snooze/Skip -> local dose history -> sync queue -> authenticated API -> PostgreSQL`

Network failure may delay synchronization and caregiver notifications, but it must not stop an already-configured local reminder.
