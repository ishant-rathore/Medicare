-- Medicare SQLite baseline migration.
-- This migration mirrors the operational local schema used by Flutter.
-- Local reminders must remain functional without network/cloud access.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS medicines (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    dosage TEXT,
    instructions TEXT,
    notes TEXT,
    photo_path TEXT,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    stock_quantity INTEGER CHECK (stock_quantity IS NULL OR stock_quantity >= 0),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY,
    medicine_id TEXT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    schedule_type TEXT NOT NULL CHECK (schedule_type IN ('daily', 'weekly', 'alternate_day', 'custom', 'every_x_hours')),
    schedule_config TEXT NOT NULL DEFAULT '{}',
    timezone TEXT,
    is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dose_events (
    id TEXT PRIMARY KEY,
    local_event_id TEXT NOT NULL UNIQUE,
    medicine_id TEXT NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    reminder_id TEXT REFERENCES reminders(id) ON DELETE SET NULL,
    scheduled_at TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('taken', 'snoozed', 'skipped', 'missed')),
    acted_at TEXT,
    sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed')),
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    local_event_id TEXT NOT NULL UNIQUE,
    entity_type TEXT NOT NULL,
    operation TEXT NOT NULL,
    payload TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'failed')),
    attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
    last_error TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_profile (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    display_name TEXT,
    timezone TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS accessibility_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    large_text INTEGER NOT NULL DEFAULT 1 CHECK (large_text IN (0, 1)),
    high_contrast INTEGER NOT NULL DEFAULT 0 CHECK (high_contrast IN (0, 1)),
    voice_enabled INTEGER NOT NULL DEFAULT 1 CHECK (voice_enabled IN (0, 1)),
    vibration_enabled INTEGER NOT NULL DEFAULT 1 CHECK (vibration_enabled IN (0, 1)),
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reminders_medicine_active ON reminders(medicine_id, is_active);
CREATE INDEX IF NOT EXISTS idx_dose_events_medicine_scheduled ON dose_events(medicine_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_dose_events_sync_status ON dose_events(sync_status);
CREATE INDEX IF NOT EXISTS idx_sync_queue_status_created ON sync_queue(status, created_at);
