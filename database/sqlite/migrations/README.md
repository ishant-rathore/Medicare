# SQLite Migrations

This directory contains versioned migrations for Medicare's local SQLite database.

SQLite is the operational local store. Its schema and migrations must preserve offline reminder execution and local dose history when the network is unavailable.

When changing the local schema:

1. Add the next numbered migration.
2. Advance the Flutter database version.
3. Implement the corresponding `onUpgrade` path in the local database service.
4. Test fresh initialization and upgrades from supported previous versions.
5. Verify reminder scheduling and local dose-event persistence while offline.

Do not place cloud credentials or backend secrets in the SQLite layer.
