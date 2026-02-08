-- Supabase schema v0.1 for EAI (SSOD/SSOT/SSOM-inspired, but no jargon required in UI)
-- Runs: orchestration records
create table if not exists runs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_type text not null,
  actor_id text not null,
  impact text not null check (impact in ('formatief','summatief','beleid')),
  workflow_id text not null,
  ssot_version text not null,
  status text not null check (status in ('created','running','waiting_human','completed','failed')),
  input_ref text,
  notes text
);

-- Artefacts: outputs/proposals produced by a run (never treated as truth)
create table if not exists artefacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  run_id uuid references runs(id) on delete cascade,
  kind text not null default 'proposal',
  provider text,
  model text,
  content text not null
);

-- SSOT versions: versioned policy/routing/config snapshots
create table if not exists ssot_versions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  version text unique not null,
  payload jsonb not null
);

-- Audit log: append-only events for observability
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_type text not null,
  run_id uuid,
  payload jsonb
);

-- Optional: SSOD events (raw inputs) - keep minimal
create table if not exists ssod_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source_system text not null,
  subject_id text,
  content_type text not null,
  text_content text,
  json_content jsonb,
  integrity_sha256 text,
  size_bytes integer
);
