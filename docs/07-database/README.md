# 07 — Database

Database architecture and data-contract documentation for Medicare.

## Documents

- [Database Design](database-design.md)

## Data Ownership

- **SQLite:** local operational store used for offline medicines, reminder schedules, dose events, sync queue and settings.
- **PostgreSQL:** canonical cloud database for authenticated synchronized application records.
- **Firebase Storage:** private optional media for medicine photos and family voice recordings.

## Core Entities

`users`, `medicines`, `reminders`, `dose_events`, `caregivers`, `refill_rules`, `device_tokens`, `media_assets`, `sync_log`.

Offline dose events use stable local event identity and must synchronize idempotently without duplicate creation.
