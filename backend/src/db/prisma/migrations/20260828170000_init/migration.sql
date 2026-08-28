-- Medicare initial PostgreSQL migration.
-- Authoritative deployment migration for backend/src/db/prisma/schema.prisma.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "MedicineType" AS ENUM ('TABLET','CAPSULE','SYRUP','DROPS','INJECTION','OINTMENT','INHALER');
CREATE TYPE "MealTiming" AS ENUM ('BEFORE_FOOD','AFTER_FOOD','WITH_FOOD','AFTER_DINNER','EMPTY_STOMACH','BEDTIME');
CREATE TYPE "RecurrenceType" AS ENUM ('ONE_TIME','DAILY','WEEKLY','ALTERNATE_DAYS','EVERY_8_HOURS','EVERY_12_HOURS','AS_NEEDED');
CREATE TYPE "DoseStatus" AS ENUM ('PENDING','TAKEN','SNOOZED','SKIPPED','MISSED');
CREATE TYPE "CaregiverAccessLevel" AS ENUM ('VIEW_ONLY','MANAGE');
CREATE TYPE "SyncStatus" AS ENUM ('PENDING','SYNCED','FAILED');
CREATE TYPE "MediaType" AS ENUM ('MEDICINE_PHOTO','PRESCRIPTION','PROFILE_PHOTO');

CREATE TABLE "users" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "firebase_uid" TEXT NOT NULL,
  "email" TEXT,
  "name" TEXT NOT NULL,
  "nickname" TEXT,
  "age" INTEGER,
  "gender" TEXT,
  "blood_group" TEXT,
  "phone" TEXT,
  "address" TEXT,
  "preferred_language" TEXT NOT NULL DEFAULT 'en',
  "photo_url" TEXT,
  "health_conditions" TEXT[] NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "medicines" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "generic_name" TEXT,
  "dosage" TEXT NOT NULL,
  "type" "MedicineType" NOT NULL,
  "color" TEXT,
  "shape" TEXT,
  "category" TEXT,
  "meal_timing" "MealTiming" NOT NULL,
  "instructions" TEXT[] NOT NULL,
  "stock_count" INTEGER NOT NULL DEFAULT 30,
  "low_stock_threshold" INTEGER NOT NULL DEFAULT 5,
  "expiry_date" TIMESTAMP(3),
  "is_essential" BOOLEAN NOT NULL DEFAULT false,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "notes" TEXT,
  "photo_url" TEXT,
  "prescribed_by" TEXT,
  "custom_voice_script" TEXT,
  "start_date" TIMESTAMP(3),
  "end_date" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "medicines_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "reminders" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "medicine_id" UUID NOT NULL,
  "scheduled_times" TEXT[] NOT NULL,
  "recurrence" "RecurrenceType" NOT NULL,
  "days_of_week" INTEGER[] NOT NULL,
  "start_date" TIMESTAMP(3) NOT NULL,
  "end_date" TIMESTAMP(3),
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "snooze_minutes" INTEGER NOT NULL DEFAULT 10,
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "deleted_at" TIMESTAMP(3),
  CONSTRAINT "reminders_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "dose_events" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "local_event_id" TEXT NOT NULL,
  "user_id" UUID NOT NULL,
  "medicine_id" UUID NOT NULL,
  "reminder_id" UUID,
  "medicine_name" TEXT NOT NULL,
  "dosage" TEXT NOT NULL,
  "meal_timing" "MealTiming" NOT NULL,
  "scheduled_time" TEXT NOT NULL,
  "scheduled_date" TIMESTAMP(3) NOT NULL,
  "status" "DoseStatus" NOT NULL DEFAULT 'PENDING',
  "action_at" TIMESTAMP(3),
  "snooze_until" TIMESTAMP(3),
  "spoken_script" TEXT,
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "dose_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "caregiver_relations" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "caregiver_id" UUID NOT NULL,
  "access_level" "CaregiverAccessLevel" NOT NULL DEFAULT 'VIEW_ONLY',
  "relation_label" TEXT,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "notify_on_missed" BOOLEAN NOT NULL DEFAULT true,
  "notify_on_taken" BOOLEAN NOT NULL DEFAULT false,
  "notify_on_low_stock" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "caregiver_relations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "refill_rules" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "medicine_id" UUID NOT NULL,
  "low_stock_threshold" INTEGER NOT NULL DEFAULT 5,
  "refill_quantity" INTEGER NOT NULL DEFAULT 30,
  "auto_alert_enabled" BOOLEAN NOT NULL DEFAULT true,
  "last_refill_date" TIMESTAMP(3),
  "next_refill_date" TIMESTAMP(3),
  "pharmacy_name" TEXT,
  "pharmacy_phone" TEXT,
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "refill_rules_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "device_tokens" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "token" TEXT NOT NULL,
  "platform" TEXT NOT NULL DEFAULT 'android',
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "device_tokens_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "media_assets" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "type" "MediaType" NOT NULL,
  "url" TEXT NOT NULL,
  "storage_path" TEXT NOT NULL,
  "mime_type" TEXT NOT NULL,
  "size_bytes" INTEGER,
  "linked_id" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "media_assets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sync_log" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" TEXT NOT NULL,
  "operation" TEXT NOT NULL,
  "resource" TEXT NOT NULL,
  "resource_id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "error" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sync_log_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "users_firebase_uid_key" ON "users"("firebase_uid");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "medicines_user_id_idx" ON "medicines"("user_id");
CREATE INDEX "medicines_user_id_is_active_idx" ON "medicines"("user_id", "is_active");
CREATE INDEX "reminders_user_id_idx" ON "reminders"("user_id");
CREATE INDEX "reminders_user_id_is_active_idx" ON "reminders"("user_id", "is_active");
CREATE UNIQUE INDEX "dose_events_local_event_id_key" ON "dose_events"("local_event_id");
CREATE INDEX "dose_events_user_id_idx" ON "dose_events"("user_id");
CREATE INDEX "dose_events_user_id_scheduled_date_idx" ON "dose_events"("user_id", "scheduled_date");
CREATE INDEX "dose_events_user_id_status_idx" ON "dose_events"("user_id", "status");
CREATE INDEX "dose_events_local_event_id_idx" ON "dose_events"("local_event_id");
CREATE UNIQUE INDEX "caregiver_relations_user_id_caregiver_id_key" ON "caregiver_relations"("user_id", "caregiver_id");
CREATE INDEX "caregiver_relations_user_id_idx" ON "caregiver_relations"("user_id");
CREATE INDEX "caregiver_relations_caregiver_id_idx" ON "caregiver_relations"("caregiver_id");
CREATE UNIQUE INDEX "refill_rules_medicine_id_key" ON "refill_rules"("medicine_id");
CREATE INDEX "refill_rules_user_id_idx" ON "refill_rules"("user_id");
CREATE UNIQUE INDEX "device_tokens_token_key" ON "device_tokens"("token");
CREATE INDEX "device_tokens_user_id_idx" ON "device_tokens"("user_id");
CREATE INDEX "media_assets_user_id_idx" ON "media_assets"("user_id");
CREATE INDEX "sync_log_user_id_idx" ON "sync_log"("user_id");
CREATE INDEX "sync_log_user_id_created_at_idx" ON "sync_log"("user_id", "created_at");

ALTER TABLE "medicines" ADD CONSTRAINT "medicines_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "reminders" ADD CONSTRAINT "reminders_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "dose_events" ADD CONSTRAINT "dose_events_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "dose_events" ADD CONSTRAINT "dose_events_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "dose_events" ADD CONSTRAINT "dose_events_reminder_id_fkey" FOREIGN KEY ("reminder_id") REFERENCES "reminders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "caregiver_relations" ADD CONSTRAINT "caregiver_relations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "caregiver_relations" ADD CONSTRAINT "caregiver_relations_caregiver_id_fkey" FOREIGN KEY ("caregiver_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "refill_rules" ADD CONSTRAINT "refill_rules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "refill_rules" ADD CONSTRAINT "refill_rules_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "device_tokens" ADD CONSTRAINT "device_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
