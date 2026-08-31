# SQLite Verification

These checks validate Medicare's local SQLite schema after initialization or migration.

SQLite remains the Flutter application's operational local store and must support reminder execution, dose history, and sync queue persistence without network access.

Use the repository's Flutter database runtime for lifecycle/version migration. The SQL checks here are verification artifacts, not a competing runtime migration engine.
