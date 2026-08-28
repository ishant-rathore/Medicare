# Medicare Database

Medicare uses a dual-database, local-first architecture.

- **PostgreSQL** is the canonical cloud database and is accessed only by the Node.js/Express/TypeScript backend.
- **SQLite** is the Flutter application's operational local database and must remain functional without network/cloud services.
- **Prisma** is the authoritative PostgreSQL schema and migration mechanism.
- The existing Flutter `DatabaseService` owns SQLite initialization and runtime version upgrades.

## Architecture

```text
Flutter / SQLite
      |
      +--> Local medicine data
      +--> Local reminder schedule
      +--> Android alarm / notification
      +--> Voice + visual reminder
      +--> Taken / Snooze / Skip
      +--> Local dose history
      +--> Sync queue
                 |
            Authenticated API
                 |
             PostgreSQL
```

The cloud path is never part of the critical local reminder execution path.

## PostgreSQL

Authoritative migration source:

`backend/src/db/prisma/migrations/`

Deployment uses the backend's existing Prisma workflow (`npm run db:migrate:deploy`). `database/postgresql/schema.sql` is a reference/export schema, not a competing migration source. Verification checks live under `database/postgresql/verification/`.

## SQLite

SQLite supports medicines, reminders, dose events, sync queue, user profile data, accessibility settings, and offline operation. Runtime initialization/version upgrades remain in the Flutter database layer. SQL migration/reference artifacts live under `database/sqlite/migrations/`.

## Synchronization

Offline dose events use stable `local_event_id` values. The PostgreSQL schema keeps that identifier unique so retries remain idempotent and do not create duplicate dose events.

## Deployment environments

Database changes are promoted through:

`Development -> Staging/Test -> Production/Demo`

Backups, migration verification, smoke tests, and recovery procedures are required before production/demo rollout.

## Security

Never commit database credentials, production connection strings, Firebase service credentials, API keys, or real patient data. PostgreSQL credentials remain server-side and are supplied through environment configuration.
