-- Medicare SQLite integrity verification
-- Run against an initialized medicare.db.

PRAGMA foreign_keys = ON;

SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'medicines')
  THEN RAISE(ABORT, 'Missing table: medicines') ELSE 1 END;
SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'reminders')
  THEN RAISE(ABORT, 'Missing table: reminders') ELSE 1 END;
SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'dose_events')
  THEN RAISE(ABORT, 'Missing table: dose_events') ELSE 1 END;
SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'sync_queue')
  THEN RAISE(ABORT, 'Missing table: sync_queue') ELSE 1 END;
SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'user_profile')
  THEN RAISE(ABORT, 'Missing table: user_profile') ELSE 1 END;
SELECT CASE WHEN NOT EXISTS (SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'accessibility_settings')
  THEN RAISE(ABORT, 'Missing table: accessibility_settings') ELSE 1 END;

SELECT CASE WHEN NOT EXISTS (
  SELECT 1 FROM pragma_index_list('dose_events')
  WHERE [unique] = 1
) THEN RAISE(ABORT, 'Missing unique index on dose_events') ELSE 1 END;

SELECT 'SQLite integrity verification passed' AS result;
