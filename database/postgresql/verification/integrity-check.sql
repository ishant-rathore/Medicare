-- Medicare PostgreSQL integrity verification
-- Run after Prisma migrations have been applied.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c
    JOIN pg_class t ON t.oid = c.conrelid
    JOIN pg_namespace n ON n.oid = t.relnamespace
    WHERE n.nspname = 'public'
      AND t.relname = 'dose_events'
      AND c.contype = 'u'
      AND pg_get_constraintdef(c.oid) LIKE '%local_event_id%'
  ) AND NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'dose_events'
      AND indexdef LIKE '%UNIQUE%local_event_id%'
  ) THEN
    RAISE EXCEPTION 'Integrity check failed: dose_events.local_event_id uniqueness missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'caregiver_relations'
      AND indexdef LIKE '%UNIQUE%user_id%caregiver_id%'
  ) THEN
    RAISE EXCEPTION 'Integrity check failed: caregiver relation uniqueness missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'refill_rules'
      AND indexdef LIKE '%UNIQUE%medicine_id%'
  ) THEN
    RAISE EXCEPTION 'Integrity check failed: refill rule uniqueness missing';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'device_tokens'
      AND indexdef LIKE '%UNIQUE%token%'
  ) THEN
    RAISE EXCEPTION 'Integrity check failed: device token uniqueness missing';
  END IF;
END $$;

SELECT 'PostgreSQL integrity verification passed' AS result;
