-- Medicare PostgreSQL baseline migration
-- Source: backend/src/db/prisma/schema.prisma
-- Deployment baseline: generated to make the current schema reproducible.
-- Future changes must use additional numbered migrations; do not edit applied migrations.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE "MedicineType" AS ENUM ('TABLET', 'CAPSULE', 'SYRUP', 'DROPS', 'INJECTION', 'OINTMENT', 'INHALER');
CREATE TYPE "MealTiming" AS ENUM ('BEFORE_FOOD', 'AFTER_FOOD', 'WITH_FOOD', 'AFTER_DINNER', 'EMPTY_STOMACH', 'BEDTIME');
CREATE TYPE "RecurrenceType" AS ENUM ('ONE_TIME', 'DAILY', 'WEEKLY', 'ALTERNATE_DAYS', 'EVERY_8_HOURS', 'EVERY_12_HOURS', 'AS_NEEDED');
CREATE TYPE "DoseStatus" AS ENUM ('PENDING', 'TAKEN', 'SNOOZED', 'SKIPPED', 'MISSED');
CREATE TYPE "CaregiverAccessLevel" AS ENUM ('VIEW_ONLY', 'MANAGE');
CREATE TYPE "MediaType" AS ENUM ('MEDICINE_PHOTO', 'PRESCRIPTION', 'PROFILE_PHOTO');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(200) NOT NULL,
  nickname VARCHAR(100),
  age INTEGER,
  gender VARCHAR(20),
  blood_group VARCHAR(10),
  phone VARCHAR(20),
  address TEXT,
  preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
  photo_url TEXT,
  health_conditions TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT users_age_check CHECK (age IS NULL OR (age > 0 AND age < 150))
);
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;

CREATE TABLE medicines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  generic_name VARCHAR(200),
  dosage VARCHAR(100) NOT NULL,
  type "MedicineType" NOT NULL,
  color VARCHAR(50),
  shape VARCHAR(50),
  category VARCHAR(100),
  meal_timing "MealTiming" NOT NULL,
  instructions TEXT[] NOT NULL DEFAULT '{}',
  stock_count INTEGER NOT NULL DEFAULT 30 CHECK (stock_count >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  expiry_date DATE,
  is_essential BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  notes TEXT,
  photo_url TEXT,
  prescribed_by VARCHAR(200),
  custom_voice_script TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_medicines_user_id ON medicines(user_id);
CREATE INDEX idx_medicines_user_active ON medicines(user_id, is_active) WHERE deleted_at IS NULL;

CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  scheduled_times TEXT[] NOT NULL DEFAULT '{}',
  recurrence "RecurrenceType" NOT NULL,
  days_of_week INTEGER[] NOT NULL DEFAULT '{}',
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  snooze_minutes INTEGER NOT NULL DEFAULT 10 CHECK (snooze_minutes >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_user_active ON reminders(user_id, is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_reminders_medicine_id ON reminders(medicine_id);

CREATE TABLE dose_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  local_event_id VARCHAR(36) NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  reminder_id UUID REFERENCES reminders(id) ON DELETE SET NULL,
  medicine_name VARCHAR(200) NOT NULL,
  dosage VARCHAR(100) NOT NULL,
  meal_timing "MealTiming" NOT NULL,
  scheduled_time VARCHAR(5) NOT NULL,
  scheduled_date DATE NOT NULL,
  status "DoseStatus" NOT NULL DEFAULT 'PENDING',
  action_at TIMESTAMPTZ,
  snooze_until TIMESTAMPTZ,
  spoken_script TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_dose_events_user_id ON dose_events(user_id);
CREATE INDEX idx_dose_events_user_date ON dose_events(user_id, scheduled_date);
CREATE INDEX idx_dose_events_user_status ON dose_events(user_id, status);

CREATE TABLE caregiver_relations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caregiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_level "CaregiverAccessLevel" NOT NULL DEFAULT 'VIEW_ONLY',
  relation_label VARCHAR(100),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  notify_on_missed BOOLEAN NOT NULL DEFAULT TRUE,
  notify_on_taken BOOLEAN NOT NULL DEFAULT FALSE,
  notify_on_low_stock BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, caregiver_id),
  CONSTRAINT caregiver_not_self CHECK (user_id <> caregiver_id)
);
CREATE INDEX idx_caregiver_relations_user_id ON caregiver_relations(user_id);
CREATE INDEX idx_caregiver_relations_caregiver_id ON caregiver_relations(caregiver_id);

CREATE TABLE refill_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL UNIQUE REFERENCES medicines(id) ON DELETE CASCADE,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  refill_quantity INTEGER NOT NULL DEFAULT 30 CHECK (refill_quantity > 0),
  auto_alert_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  last_refill_date DATE,
  next_refill_date DATE,
  pharmacy_name VARCHAR(200),
  pharmacy_phone VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_refill_rules_user_id ON refill_rules(user_id);

CREATE TABLE device_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  platform VARCHAR(20) NOT NULL DEFAULT 'android',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_device_tokens_user_id ON device_tokens(user_id);

CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type "MediaType" NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes INTEGER CHECK (size_bytes IS NULL OR size_bytes >= 0),
  linked_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_media_assets_user_id ON media_assets(user_id);

CREATE TABLE sync_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  operation VARCHAR(20) NOT NULL,
  resource VARCHAR(50) NOT NULL,
  resource_id VARCHAR(36) NOT NULL,
  status VARCHAR(20) NOT NULL,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_sync_log_user_id ON sync_log(user_id);
CREATE INDEX idx_sync_log_user_created ON sync_log(user_id, created_at);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER medicines_updated_at BEFORE UPDATE ON medicines FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER reminders_updated_at BEFORE UPDATE ON reminders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER dose_events_updated_at BEFORE UPDATE ON dose_events FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER caregiver_relations_updated_at BEFORE UPDATE ON caregiver_relations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER refill_rules_updated_at BEFORE UPDATE ON refill_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER device_tokens_updated_at BEFORE UPDATE ON device_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at();
