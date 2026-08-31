-- =============================================================================
-- database/sqlite/schema.sql
-- SQLite schema for Flutter offline local database
-- This is the source of truth for the mobile app
-- =============================================================================

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- =============================================================================
-- MEDICINES (local)
-- =============================================================================

CREATE TABLE IF NOT EXISTS medicines (
  id                  TEXT PRIMARY KEY,        -- UUID generated on device
  name                TEXT NOT NULL,
  generic_name        TEXT,
  dosage              TEXT NOT NULL,
  type                TEXT NOT NULL,           -- TABLET|CAPSULE|SYRUP|DROPS|INJECTION|OINTMENT|INHALER
  color               TEXT,
  shape               TEXT,
  category            TEXT,
  meal_timing         TEXT NOT NULL,           -- BEFORE_FOOD|AFTER_FOOD|WITH_FOOD|AFTER_DINNER|EMPTY_STOMACH|BEDTIME
  instructions        TEXT NOT NULL DEFAULT '[]',  -- JSON array of strings
  stock_count         INTEGER NOT NULL DEFAULT 30,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  expiry_date         TEXT,                    -- YYYY-MM-DD
  is_essential        INTEGER NOT NULL DEFAULT 0,  -- 0|1
  is_active           INTEGER NOT NULL DEFAULT 1,  -- 0|1
  notes               TEXT,
  photo_url           TEXT,
  prescribed_by       TEXT,
  custom_voice_script TEXT,
  start_date          TEXT,                    -- YYYY-MM-DD
  end_date            TEXT,                    -- YYYY-MM-DD
  created_at          TEXT NOT NULL,           -- ISO 8601
  updated_at          TEXT NOT NULL,
  deleted_at          TEXT                     -- NULL = not deleted (soft delete)
);

CREATE INDEX IF NOT EXISTS idx_medicines_active ON medicines(is_active) WHERE deleted_at IS NULL;

-- =============================================================================
-- REMINDERS (local)
-- =============================================================================

CREATE TABLE IF NOT EXISTS reminders (
  id              TEXT PRIMARY KEY,
  medicine_id     TEXT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  scheduled_times TEXT NOT NULL DEFAULT '[]',  -- JSON array ["08:00","14:00"]
  recurrence      TEXT NOT NULL,               -- ONE_TIME|DAILY|WEEKLY|ALTERNATE_DAYS|...
  days_of_week    TEXT NOT NULL DEFAULT '[]',  -- JSON array [0,1,2,3,4,5,6]
  start_date      TEXT NOT NULL,               -- YYYY-MM-DD
  end_date        TEXT,                        -- YYYY-MM-DD
  is_active       INTEGER NOT NULL DEFAULT 1,
  snooze_minutes  INTEGER NOT NULL DEFAULT 10,
  notes           TEXT,
  alarm_id        INTEGER,                     -- Android alarm manager ID
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL,
  deleted_at      TEXT
);

CREATE INDEX IF NOT EXISTS idx_reminders_medicine_id ON reminders(medicine_id);
CREATE INDEX IF NOT EXISTS idx_reminders_active ON reminders(is_active) WHERE deleted_at IS NULL;

-- =============================================================================
-- DOSE EVENTS (local)
-- local_event_id is the idempotency key for sync
-- =============================================================================

CREATE TABLE IF NOT EXISTS dose_events (
  id              TEXT PRIMARY KEY,
  local_event_id  TEXT NOT NULL UNIQUE,        -- UUID, used as idempotency key for sync
  medicine_id     TEXT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  reminder_id     TEXT REFERENCES reminders(id) ON DELETE SET NULL,
  medicine_name   TEXT NOT NULL,
  dosage          TEXT NOT NULL,
  meal_timing     TEXT NOT NULL,
  scheduled_time  TEXT NOT NULL,               -- "08:00"
  scheduled_date  TEXT NOT NULL,               -- "YYYY-MM-DD"
  period          TEXT NOT NULL,               -- Morning|Afternoon|Evening|Night
  status          TEXT NOT NULL DEFAULT 'PENDING',  -- PENDING|TAKEN|SNOOZED|SKIPPED|MISSED
  action_at       TEXT,                        -- ISO datetime when action taken
  snooze_until    TEXT,                        -- ISO datetime for snooze expiry
  spoken_script   TEXT,
  photo_url       TEXT,
  notes           TEXT,
  synced          INTEGER NOT NULL DEFAULT 0,  -- 0 = pending sync, 1 = synced
  created_at      TEXT NOT NULL,
  updated_at      TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_dose_events_date ON dose_events(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_dose_events_status ON dose_events(status);
CREATE INDEX IF NOT EXISTS idx_dose_events_synced ON dose_events(synced) WHERE synced = 0;

-- =============================================================================
-- SYNC QUEUE (local)
-- Items waiting to be sent to the server when connectivity is restored
-- =============================================================================

CREATE TABLE IF NOT EXISTS sync_queue (
  id              TEXT PRIMARY KEY,
  local_id        TEXT NOT NULL,               -- Local resource ID
  operation       TEXT NOT NULL,               -- CREATE|UPDATE|DELETE
  resource        TEXT NOT NULL,               -- medicine|reminder|dose_event
  payload         TEXT NOT NULL,               -- JSON serialized payload
  status          TEXT NOT NULL DEFAULT 'PENDING',  -- PENDING|PROCESSING|COMPLETED|FAILED
  retry_count     INTEGER NOT NULL DEFAULT 0,
  max_retries     INTEGER NOT NULL DEFAULT 5,
  last_error      TEXT,
  created_at      TEXT NOT NULL,
  processed_at    TEXT                         -- When successfully sent to server
);

CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
CREATE INDEX IF NOT EXISTS idx_sync_queue_pending ON sync_queue(status, retry_count) WHERE status = 'PENDING';

-- =============================================================================
-- USER PROFILE (local cache)
-- =============================================================================

CREATE TABLE IF NOT EXISTS user_profile (
  id                  TEXT PRIMARY KEY,
  firebase_uid        TEXT NOT NULL UNIQUE,
  name                TEXT NOT NULL,
  nickname            TEXT,
  age                 INTEGER,
  gender              TEXT,
  blood_group         TEXT,
  phone               TEXT,
  email               TEXT,
  address             TEXT,
  preferred_language  TEXT NOT NULL DEFAULT 'en',
  photo_url           TEXT,
  health_conditions   TEXT NOT NULL DEFAULT '[]',  -- JSON array
  caregiver_name      TEXT,
  caregiver_phone     TEXT,
  caregiver_relation  TEXT,
  created_at          TEXT NOT NULL,
  updated_at          TEXT NOT NULL
);

-- =============================================================================
-- ACCESSIBILITY SETTINGS (local)
-- =============================================================================

CREATE TABLE IF NOT EXISTS accessibility_settings (
  id              TEXT PRIMARY KEY DEFAULT 'singleton',  -- Always one row
  font_size       TEXT NOT NULL DEFAULT 'large',         -- normal|large|extra-large
  high_contrast   INTEGER NOT NULL DEFAULT 0,
  dark_mode       INTEGER NOT NULL DEFAULT 0,
  vibration       INTEGER NOT NULL DEFAULT 1,
  screen_reader   INTEGER NOT NULL DEFAULT 0,
  voice_guidance  INTEGER NOT NULL DEFAULT 1,
  language        TEXT NOT NULL DEFAULT 'en',
  voice_speed     TEXT NOT NULL DEFAULT 'normal',        -- slow|normal|fast
  alarm_volume    TEXT NOT NULL DEFAULT 'normal',        -- soft|normal|loud
  button_size     TEXT NOT NULL DEFAULT 'large',         -- normal|large|extralarge
  updated_at      TEXT NOT NULL
);

-- Insert default settings
INSERT OR IGNORE INTO accessibility_settings (id, updated_at)
VALUES ('singleton', datetime('now'));
