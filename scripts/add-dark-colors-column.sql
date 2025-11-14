-- Manual migration to add darkColors column to Theme table
-- Run this with: psql -U postgres -d dharma_calendar -f scripts/add-dark-colors-column.sql

BEGIN;

-- Add the darkColors column as JSONB (PostgreSQL JSON type)
ALTER TABLE "Theme"
ADD COLUMN IF NOT EXISTS "darkColors" JSONB;

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Theme'
ORDER BY ordinal_position;

COMMIT;
