-- DEPRECATED — do not apply on new projects.
--
-- This file previously created a development-only schema (text IDs,
-- ticket_messages / ticket_analysis tables, permissive anon RLS policies).
--
-- Use the production migration instead:
--   supabase/migrations/20250815161000_support_inbox_schema.sql
--
-- This file intentionally contains no DDL so it will not drop or alter
-- any existing objects if re-run.

select 1;
