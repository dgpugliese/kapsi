-- ============================================================================
-- DROP EXISTING TABLES
-- Run this BEFORE 001_initial_schema.sql to wipe the old schema.
-- Order matters: drop dependent tables first to avoid FK violations.
-- ============================================================================

-- Drop tables from the old schema (if they exist)
DROP TABLE IF EXISTS event_registrations CASCADE;
DROP TABLE IF EXISTS dues_payments CASCADE;

-- Drop tables from the new schema (in case of re-run)
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS photos CASCADE;
DROP TABLE IF EXISTS photo_albums CASCADE;
DROP TABLE IF EXISTS event_rsvps CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS leadership_positions CASCADE;
DROP TABLE IF EXISTS programs CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS dues_config CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS chapters CASCADE;
DROP TABLE IF EXISTS provinces CASCADE;

-- Drop helper function if exists
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Drop extension only if you want a truly clean slate (usually keep it)
-- DROP EXTENSION IF EXISTS pg_trgm;
