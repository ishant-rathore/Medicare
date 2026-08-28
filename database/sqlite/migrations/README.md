# SQLite Migrations

This directory documents the versioned local SQLite schema for Medicare.

## Rules

- SQLite is the operational local database for Flutter offline-first behavior.
- Local medicines, reminder schedules, dose events, synchronization queue and accessibility state must remain available without network access.
- `local_event_id` is a stable event identity and must remain unique for idempotent synchronization.
- Never make PostgreSQL or the network a prerequisite for an already-configured local reminder.
- Schema upgrades must preserve existing local user data and be tested on a representative SQLite database.
- Keep migrations deterministic and compatible with the actual Flutter `sqflite` implementation.

## Current Flutter Implementation

The current app initializes SQLite through `frontend/lib/data/local/database_service.dart` with database version 1 and an `onUpgrade` hook reserved for future migrations. When a schema upgrade is introduced, increment the database version and add tested upgrade logic without breaking the existing reminder path.

## Recovery

Before shipping a database-version change, retain a known-good application build and test migration on a copy of representative test data. Do not delete local medication history as part of a routine migration.
