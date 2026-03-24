-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- Waitlist
-- ─────────────────────────────────────────────
create table if not exists public.waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  created_at  timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Only service role can read/write waitlist
create policy "Service role only" on public.waitlist
  for all using (false);

-- ─────────────────────────────────────────────
-- Connections
-- ─────────────────────────────────────────────
create type public.db_type as enum ('postgres', 'mysql');

create table if not exists public.connections (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  db_type         public.db_type not null,
  host            text not null,
  port            integer not null,
  database_name   text not null,
  username_enc    text not null,   -- AES-256-GCM encrypted
  password_enc    text not null,   -- AES-256-GCM encrypted
  created_at      timestamptz not null default now()
);

alter table public.connections enable row level security;

create policy "Users manage own connections" on public.connections
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- Query Jobs
-- ─────────────────────────────────────────────
create table if not exists public.query_jobs (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  connection_id     uuid not null references public.connections(id) on delete cascade,
  name              text not null,
  sql_query         text not null,
  cron_expression   text not null,
  recipients        text[] not null default '{}',
  is_active         boolean not null default true,
  last_run_at       timestamptz,
  next_run_at       timestamptz,
  created_at        timestamptz not null default now()
);

alter table public.query_jobs enable row level security;

create policy "Users manage own jobs" on public.query_jobs
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- Job Logs
-- ─────────────────────────────────────────────
create type public.job_status as enum ('running', 'success', 'failed');
create type public.delivery_method as enum ('attachment', 'link');

create table if not exists public.job_logs (
  id               uuid primary key default gen_random_uuid(),
  job_id           uuid not null references public.query_jobs(id) on delete cascade,
  user_id          uuid not null references auth.users(id) on delete cascade,
  status           public.job_status not null,
  rows_returned    integer,
  file_size_bytes  bigint,
  delivery_method  public.delivery_method,
  download_url     text,           -- signed URL for large file fallback
  error_message    text,
  executed_at      timestamptz not null default now()
);

alter table public.job_logs enable row level security;

create policy "Users view own logs" on public.job_logs
  for select using (auth.uid() = user_id);

-- Service role inserts logs (cron worker)
create policy "Service role insert logs" on public.job_logs
  for insert with check (true);

-- ─────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────
create index idx_connections_user_id on public.connections(user_id);
create index idx_query_jobs_user_id on public.query_jobs(user_id);
create index idx_query_jobs_next_run on public.query_jobs(next_run_at) where is_active = true;
create index idx_job_logs_job_id on public.job_logs(job_id);
create index idx_job_logs_user_id on public.job_logs(user_id);
