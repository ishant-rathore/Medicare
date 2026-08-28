-- Medicare PostgreSQL baseline migration.
-- Apply this migration only to a fresh PostgreSQL database when bootstrapping
-- the SQL deployment package. The backend runtime uses its existing Prisma
-- migration workflow when Prisma migrations are present.

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firebase_uid TEXT NOT NULL UNIQUE,
    email TEXT,
    display_name TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'caregiver', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dosage TEXT,
    instructions TEXT,
    notes TEXT,
    photo_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    stock_quantity INTEGER CHECK (stock_quantity IS NULL OR stock_quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    schedule_type TEXT NOT NULL CHECK (schedule_type IN ('daily', 'weekly', 'alternate_day', 'custom', 'every_x_hours')),
    schedule_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    timezone TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dose_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    local_event_id TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    reminder_id UUID REFERENCES reminders(id) ON DELETE SET NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('taken', 'snoozed', 'skipped', 'missed')),
    acted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS caregivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    caregiver_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'revoked')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT caregivers_owner_caregiver_unique UNIQUE (owner_user_id, caregiver_user_id),
    CONSTRAINT caregivers_not_self CHECK (owner_user_id <> caregiver_user_id)
);

CREATE TABLE IF NOT EXISTS refill_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
    threshold INTEGER NOT NULL CHECK (threshold >= 0),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS device_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    platform TEXT NOT NULL CHECK (platform IN ('android', 'ios', 'web')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK (kind IN ('medicine_photo', 'voice_recording')),
    storage_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    local_event_id TEXT NOT NULL,
    operation TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, local_event_id, operation)
);

CREATE INDEX IF NOT EXISTS idx_medicines_user_active ON medicines(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_reminders_medicine_active ON reminders(medicine_id, is_active);
CREATE INDEX IF NOT EXISTS idx_dose_events_user_scheduled ON dose_events(user_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_dose_events_medicine_scheduled ON dose_events(medicine_id, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_caregivers_owner_status ON caregivers(owner_user_id, status);
CREATE INDEX IF NOT EXISTS idx_device_tokens_user ON device_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_user ON media_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_log_user_created ON sync_log(user_id, created_at);

COMMIT;
