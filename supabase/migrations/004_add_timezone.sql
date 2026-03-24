-- Add per-job timezone support.
-- Previously all cron expressions were interpreted in UTC;
-- now each job stores its own IANA timezone string.
ALTER TABLE query_jobs
  ADD COLUMN IF NOT EXISTS timezone text NOT NULL DEFAULT 'UTC';
