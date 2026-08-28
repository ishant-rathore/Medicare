-- Medicare SQLite baseline migration
-- Mirrors the current Flutter operational schema used by database_service.dart.
-- Future upgrades should be implemented through numbered migrations and the
-- Flutter sqflite database version/onUpgrade mechanism.

PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS medicines (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  generic_name TEXT,
  dosage TEXT NOT NULL,
  type TEXT NOT NULL,
  color TEXT,
  shape TEXT,
  category TEXT,
  meal_timing TEXT NOT NULL,
  instructions TEXT NOT NULL DEFAULT '[]',
  stock_count INTEGER NOT NULL DEFAULT 30 CHECK (stock_count >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  expiry_date TEXT,
  is_essential INTEGER NOT NULL DEFAULT 0 CHECK (is_essential IN (0,1)),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
  notes TEXT,
  photo_url TEXT,
  prescribed_by TEXT,
  custom_voice_script TEXT,
  start_date TEXT,
  end_date TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_medicines_active ON medicines(is_active);

CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY,
  medicine_id TEXT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  scheduled_times TEXT NOT NULL DEFAULT '[]',
  recurrence TEXT NOT NULL,
  days_of_week TEXT NOT NULL DEFAULT '[]',
  start_date TEXT NOT NULL,
  end_date TEXT,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0,1)),
  snooze_minutes INTEGER NOT NULL DEFAULT 10 CHECK (snooze_minutes >= 0),
  notes TEXT,
  alarm_id INTEGER,
  medicine_name TEXT,
  dosage TEXT,
  meal_timing TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  deleted_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_reminders_medicine ON reminders(medicine_id);
CREATE INDEX IF NOT EXISTS idx_reminders_active ON reminders(is_active);

CREATE TABLE IF NOT EXISTS dose_events (
  id TEXT PRIMARY KEY,
  local_event_id TEXT NOT NULL UNIQUE,
  medicine_id TEXT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  reminder_id TEXT REFERENCES reminders(id) ON DELETE SET NULL,
  medicine_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  meal_timing TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  scheduled_date TEXT NOT NULL,
  period TEXT NOT NULL DEFAULT 'Morning',
  status TEXT NOT NULL DEFAULT 'PENDING',
  action_at TEXT,
  snooze_until TEXT,
  spoken_script TEXT,
  photo_url TEXT,
  notes TEXT,
  synced INTEGER NOT NULL DEFAULT 0 CHECK (synced IN (0,1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_dose_events_date ON dose_events(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_dose_events_status ON dose_events(status);
CREATE INDEX IF NOT EXISTS idx_dose_events_synced ON dose_events(synced);

CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY,
  local_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  resource TEXT NOT NULL,
  payload TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  retry_count INTEGER NOT NULL DEFAULT 0 CHECK (retry_count >= 0),
  max_retries INTEGER NOT NULL DEFAULT 5 CHECK (max_retries >= 0),
  last_error TEXT,
  created_at TEXT NOT NULL,
  processed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status ON sync_queue(status);
CREATE INDEX IF NOT EXISTS idx_sync_queue_pending ON sync_queue(status, retry_count);

CREATE TABLE IF NOT EXISTS user_profile (
  id TEXT PRIMARY KEY,
  firebase_uid TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  nickname TEXT,
  age INTEGER,
  gender TEXT,
  blood_group TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  photo_url TEXT,
  health_conditions TEXT NOT NULL DEFAULT '[]',
  caregiver_name TEXT,
  caregiver_phone TEXT,
  caregiver_relation TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS accessibility_settings (
  id TEXT PRIMARY KEY DEFAULT 'singleton',
  font_size TEXT NOT NULL DEFAULT 'large',
  high_contrast INTEGER NOT NULL DEFAULT 0 CHECK (high_contrast IN (0,1)),
  dark_mode INTEGER NOT NULL DEFAULT 0 CHECK (dark_mode IN (0,1)),
  vibration INTEGER NOT NULL DEFAULT 1 CHECK (vibration IN (0,1)),
  screen_reader INTEGER NOT NULL DEFAULT 0 CHECK (screen_reader IN (0,1)),
  voice_guidance INTEGER NOT NULL DEFAULT 1 CHECK (voice_guidance IN (0,1)),
  language TEXT NOT NULL DEFAULT 'en',
  voice_speed TEXT NOT NULL DEFAULT 'normal',
  alarm_volume TEXT NOT NULL DEFAULT 'normal',
  button_size TEXT NOT NULL DEFAULT 'large',
  updated_at TEXT NOT NULL
);

INSERT OR IGNORE INTO accessibility_settings (id, updated_at)
VALUES ('singleton', CURRENT_TIMESTAMP);
