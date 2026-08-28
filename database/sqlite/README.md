# SQLite Database

SQLite is Medicare's operational local database for Flutter. It supports the local-first critical path and must remain functional without network or cloud services.

## Deployment and upgrades

The Flutter database service controls SQLite initialization and version upgrades. Every schema change must have a corresponding numbered migration and an `onUpgrade` implementation for supported previous versions.

Validate:

- Fresh database creation.
- Upgrade from each supported previous version.
- Foreign-key enforcement.
- Unique `local_event_id` values for dose events.
- Local reminder scheduling and dose history while offline.
- Sync queue persistence and retry behavior.

SQLite must not contain backend credentials, Firebase service credentials, or other privileged secrets.
