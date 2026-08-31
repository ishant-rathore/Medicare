<<<<<<< HEAD
-- =============================================================================
-- database/postgresql/schema.sql
-- PostgreSQL DDL for Medicare backend
-- Generated from Prisma schema — use prisma migrate for production
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE "MedicineType" AS ENUM ('TABLET', 'CAPSULE', 'SYRUP', 'DROPS', 'INJECTION', 'OINTMENT', 'INHALER');
CREATE TYPE "MealTiming" AS ENUM ('BEFORE_FOOD', 'AFTER_FOOD', 'WITH_FOOD', 'AFTER_DINNER', 'EMPTY_STOMACH', 'BEDTIME');
CREATE TYPE "RecurrenceType" AS ENUM ('ONE_TIME', 'DAILY', 'WEEKLY', 'ALTERNATE_DAYS', 'EVERY_8_HOURS', 'EVERY_12_HOURS', 'AS_NEEDED');
CREATE TYPE "DoseStatus" AS ENUM ('PENDING', 'TAKEN', 'SNOOZED', 'SKIPPED', 'MISSED');
CREATE TYPE "CaregiverAccessLevel" AS ENUM ('VIEW_ONLY', 'MANAGE');
CREATE TYPE "MediaType" AS ENUM ('MEDICINE_PHOTO', 'PRESCRIPTION', 'PROFILE_PHOTO');

-- =============================================================================
-- USERS
-- =============================================================================

CREATE TABLE users (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  firebase_uid        VARCHAR(128) NOT NULL UNIQUE,
  email               VARCHAR(255) UNIQUE,
  name                VARCHAR(200) NOT NULL,
  nickname            VARCHAR(100),
  age                 INTEGER CHECK (age > 0 AND age < 150),
  gender              VARCHAR(20),
  blood_group         VARCHAR(10),
  phone               VARCHAR(20),
  address             TEXT,
  preferred_language  VARCHAR(10) NOT NULL DEFAULT 'en',
  photo_url           TEXT,
  health_conditions   TEXT[] NOT NULL DEFAULT '{}',
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email) WHERE email IS NOT NULL;

-- =============================================================================
-- MEDICINES
-- =============================================================================

CREATE TABLE medicines (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name                VARCHAR(200) NOT NULL,
  generic_name        VARCHAR(200),
  dosage              VARCHAR(100) NOT NULL,
  type                "MedicineType" NOT NULL,
  color               VARCHAR(50),
  shape               VARCHAR(50),
  category            VARCHAR(100),
  meal_timing         "MealTiming" NOT NULL,
  instructions        TEXT[] NOT NULL DEFAULT '{}',
  stock_count         INTEGER NOT NULL DEFAULT 30 CHECK (stock_count >= 0),
  low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
  expiry_date         DATE,
  is_essential        BOOLEAN NOT NULL DEFAULT FALSE,
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  notes               TEXT,
  photo_url           TEXT,
  prescribed_by       VARCHAR(200),
  custom_voice_script TEXT,
  start_date          DATE,
  end_date            DATE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_medicines_user_id ON medicines(user_id);
CREATE INDEX idx_medicines_user_active ON medicines(user_id, is_active) WHERE deleted_at IS NULL;

-- =============================================================================
-- REMINDERS
-- =============================================================================

CREATE TABLE reminders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medicine_id     UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  scheduled_times TEXT[] NOT NULL DEFAULT '{}',
  recurrence      "RecurrenceType" NOT NULL,
  days_of_week    INTEGER[] NOT NULL DEFAULT '{}',
  start_date      DATE NOT NULL,
  end_date        DATE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  snooze_minutes  INTEGER NOT NULL DEFAULT 10,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_user_active ON reminders(user_id, is_active) WHERE deleted_at IS NULL;

-- =============================================================================
-- DOSE EVENTS
-- local_event_id UNIQUE prevents duplicate sync
-- =============================================================================

CREATE TABLE dose_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  local_event_id  VARCHAR(36) NOT NULL UNIQUE,  -- UUID from device, prevents duplicate sync
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medicine_id     UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  reminder_id     UUID REFERENCES reminders(id) ON DELETE SET NULL,
  medicine_name   VARCHAR(200) NOT NULL,
  dosage          VARCHAR(100) NOT NULL,
  meal_timing     "MealTiming" NOT NULL,
  scheduled_time  VARCHAR(5) NOT NULL,          -- "08:00"
  scheduled_date  DATE NOT NULL,
  status          "DoseStatus" NOT NULL DEFAULT 'PENDING',
  action_at       TIMESTAMPTZ,
  snooze_until    TIMESTAMPTZ,
  spoken_script   TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dose_events_user_id ON dose_events(user_id);
CREATE INDEX idx_dose_events_user_date ON dose_events(user_id, scheduled_date);
CREATE INDEX idx_dose_events_user_status ON dose_events(user_id, status);

-- =============================================================================
-- CAREGIVER RELATIONS
-- =============================================================================

CREATE TABLE caregiver_relations (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caregiver_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_level      "CaregiverAccessLevel" NOT NULL DEFAULT 'VIEW_ONLY',
  relation_label    VARCHAR(100),
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  notify_on_missed  BOOLEAN NOT NULL DEFAULT TRUE,
  notify_on_taken   BOOLEAN NOT NULL DEFAULT FALSE,
  notify_on_low_stock BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, caregiver_id)
);

CREATE INDEX idx_caregiver_relations_user_id ON caregiver_relations(user_id);
CREATE INDEX idx_caregiver_relations_caregiver_id ON caregiver_relations(caregiver_id);

-- =============================================================================
-- REFILL RULES
-- =============================================================================

CREATE TABLE refill_rules (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medicine_id         UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  refill_quantity     INTEGER NOT NULL DEFAULT 30,
  auto_alert_enabled  BOOLEAN NOT NULL DEFAULT TRUE,
  last_refill_date    DATE,
  next_refill_date    DATE,
  pharmacy_name       VARCHAR(200),
  pharmacy_phone      VARCHAR(20),
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(medicine_id)
);

CREATE INDEX idx_refill_rules_user_id ON refill_rules(user_id);

-- =============================================================================
-- DEVICE TOKENS
-- =============================================================================

CREATE TABLE device_tokens (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token       TEXT NOT NULL UNIQUE,
  platform    VARCHAR(20) NOT NULL DEFAULT 'android',
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_device_tokens_user_id ON device_tokens(user_id);

-- =============================================================================
-- MEDIA ASSETS
-- =============================================================================

CREATE TABLE media_assets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type          "MediaType" NOT NULL,
  url           TEXT NOT NULL,
  storage_path  TEXT NOT NULL,
  mime_type     VARCHAR(100) NOT NULL,
  size_bytes    INTEGER,
  linked_id     UUID,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_assets_user_id ON media_assets(user_id);

-- =============================================================================
-- SYNC LOG
-- =============================================================================

CREATE TABLE sync_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL,
  operation   VARCHAR(20) NOT NULL,
  resource    VARCHAR(50) NOT NULL,
  resource_id VARCHAR(36) NOT NULL,
  status      VARCHAR(20) NOT NULL,
  error       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sync_log_user_id ON sync_log(user_id);
CREATE INDEX idx_sync_log_user_created ON sync_log(user_id, created_at);

-- =============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================================

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
=======
-- Medicare PostgreSQL reference schema
-- AUTHORITATIVE SOURCE: backend/src/db/prisma/schema.prisma
-- DEPLOYMENT: backend Prisma migrations + `npm run db:migrate:deploy`
-- This file is a human-readable SQL reference and MUST NOT be used as a
-- competing production migration system.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "MedicineType" AS ENUM ('TABLET','CAPSULE','SYRUP','DROPS','INJECTION','OINTMENT','INHALER');
CREATE TYPE "MealTiming" AS ENUM ('BEFORE_FOOD','AFTER_FOOD','WITH_FOOD','AFTER_DINNER','EMPTY_STOMACH','BEDTIME');
CREATE TYPE "RecurrenceType" AS ENUM ('ONE_TIME','DAILY','WEEKLY','ALTERNATE_DAYS','EVERY_8_HOURS','EVERY_12_HOURS','AS_NEEDED');
CREATE TYPE "DoseStatus" AS ENUM ('PENDING','TAKEN','SNOOZED','SKIPPED','MISSED');
CREATE TYPE "CaregiverAccessLevel" AS ENUM ('VIEW_ONLY','MANAGE');
CREATE TYPE "SyncStatus" AS ENUM ('PENDING','SYNCED','FAILED');
CREATE TYPE "MediaType" AS ENUM ('MEDICINE_PHOTO','PRESCRIPTION','PROFILE_PHOTO');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid TEXT NOT NULL UNIQUE,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  nickname TEXT,
  age INTEGER,
  gender TEXT,
  blood_group TEXT,
  phone TEXT,
  address TEXT,
  preferred_language TEXT NOT NULL DEFAULT 'en',
  photo_url TEXT,
  health_conditions TEXT[] NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP(3)
);

CREATE TABLE medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  generic_name TEXT,
  dosage TEXT NOT NULL,
  type "MedicineType" NOT NULL,
  color TEXT,
  shape TEXT,
  category TEXT,
  meal_timing "MealTiming" NOT NULL,
  instructions TEXT[] NOT NULL,
  stock_count INTEGER NOT NULL DEFAULT 30,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  expiry_date TIMESTAMP(3),
  is_essential BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  notes TEXT,
  photo_url TEXT,
  prescribed_by TEXT,
  custom_voice_script TEXT,
  start_date TIMESTAMP(3),
  end_date TIMESTAMP(3),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP(3)
);
CREATE INDEX medicines_user_id_idx ON medicines(user_id);
CREATE INDEX medicines_user_id_is_active_idx ON medicines(user_id, is_active);

CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  scheduled_times TEXT[] NOT NULL,
  recurrence "RecurrenceType" NOT NULL,
  days_of_week INTEGER[] NOT NULL,
  start_date TIMESTAMP(3) NOT NULL,
  end_date TIMESTAMP(3),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  snooze_minutes INTEGER NOT NULL DEFAULT 10,
  notes TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP(3)
);
CREATE INDEX reminders_user_id_idx ON reminders(user_id);
CREATE INDEX reminders_user_id_is_active_idx ON reminders(user_id, is_active);

CREATE TABLE dose_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  local_event_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL REFERENCES medicines(id) ON DELETE CASCADE,
  reminder_id UUID REFERENCES reminders(id) ON DELETE SET NULL,
  medicine_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  meal_timing "MealTiming" NOT NULL,
  scheduled_time TEXT NOT NULL,
  scheduled_date TIMESTAMP(3) NOT NULL,
  status "DoseStatus" NOT NULL DEFAULT 'PENDING',
  action_at TIMESTAMP(3),
  snooze_until TIMESTAMP(3),
  spoken_script TEXT,
  notes TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX dose_events_user_id_idx ON dose_events(user_id);
CREATE INDEX dose_events_user_id_scheduled_date_idx ON dose_events(user_id, scheduled_date);
CREATE INDEX dose_events_user_id_status_idx ON dose_events(user_id, status);
CREATE INDEX dose_events_local_event_id_idx ON dose_events(local_event_id);

CREATE TABLE caregiver_relations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caregiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  access_level "CaregiverAccessLevel" NOT NULL DEFAULT 'VIEW_ONLY',
  relation_label TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  notify_on_missed BOOLEAN NOT NULL DEFAULT TRUE,
  notify_on_taken BOOLEAN NOT NULL DEFAULT FALSE,
  notify_on_low_stock BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, caregiver_id)
);
CREATE INDEX caregiver_relations_user_id_idx ON caregiver_relations(user_id);
CREATE INDEX caregiver_relations_caregiver_id_idx ON caregiver_relations(caregiver_id);

CREATE TABLE refill_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  medicine_id UUID NOT NULL UNIQUE REFERENCES medicines(id) ON DELETE CASCADE,
  low_stock_threshold INTEGER NOT NULL DEFAULT 5,
  refill_quantity INTEGER NOT NULL DEFAULT 30,
  auto_alert_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  last_refill_date TIMESTAMP(3),
  next_refill_date TIMESTAMP(3),
  pharmacy_name TEXT,
  pharmacy_phone TEXT,
  notes TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX refill_rules_user_id_idx ON refill_rules(user_id);

CREATE TABLE device_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL DEFAULT 'android',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX device_tokens_user_id_idx ON device_tokens(user_id);

CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type "MediaType" NOT NULL,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER,
  linked_id TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX media_assets_user_id_idx ON media_assets(user_id);

CREATE TABLE sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  operation TEXT NOT NULL,
  resource TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  status TEXT NOT NULL,
  error TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX sync_log_user_id_idx ON sync_log(user_id);
CREATE INDEX sync_log_user_id_created_at_idx ON sync_log(user_id, created_at);

-- Prisma owns updatedAt behavior via @updatedAt. This reference schema does not
-- add independent triggers that could diverge from Prisma's migration model.
>>>>>>> f50a1494eb319d5be954309fd1b2724ae249fbba
