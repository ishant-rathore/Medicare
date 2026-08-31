-- Medicare PostgreSQL schema verification
-- Run after Prisma migrations have been applied.

DO $$
DECLARE
  missing_count integer;
BEGIN
  SELECT COUNT(*) INTO missing_count
  FROM (VALUES
    ('users'),
    ('medicines'),
    ('reminders'),
    ('dose_events'),
    ('caregiver_relations'),
    ('refill_rules'),
    ('device_tokens'),
    ('media_assets'),
    ('sync_log')
  ) AS required(table_name)
  WHERE NOT EXISTS (
    SELECT 1 FROM information_schema.tables t
    WHERE t.table_schema = 'public' AND t.table_name = required.table_name
  );

  IF missing_count > 0 THEN
    RAISE EXCEPTION 'PostgreSQL schema check failed: % required table(s) missing', missing_count;
  END IF;
END $$;

DO $$
DECLARE
  required_type text;
BEGIN
  FOREACH required_type IN ARRAY ARRAY[
    'MedicineType',
    'MealTiming',
    'RecurrenceType',
    'DoseStatus',
    'CaregiverAccessLevel',
    'MediaType'
  ] LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_type t
      JOIN pg_namespace n ON n.oid = t.typnamespace
      WHERE n.nspname = 'public' AND t.typname = required_type
    ) THEN
      RAISE EXCEPTION 'PostgreSQL schema check failed: enum % missing', required_type;
    END IF;
  END LOOP;
END $$;

SELECT 'PostgreSQL schema verification passed' AS result;
