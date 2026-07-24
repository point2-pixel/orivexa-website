-- Migration 003: Google Drive integration
-- Run in Supabase SQL Editor after migration_002. Safe to re-run.

create table if not exists public.google_drive_connections (
  user_id uuid references auth.users on delete cascade primary key,
  access_token text not null,
  refresh_token text not null,
  token_expiry timestamptz not null,
  connected_at timestamptz default now(),
  last_synced_at timestamptz
);

alter table public.google_drive_connections enable row level security;

drop policy if exists "Users can view own connection" on public.google_drive_connections;
create policy "Users can view own connection"
  on public.google_drive_connections for select
  using (auth.uid() = user_id);

drop policy if exists "Users can manage own connection" on public.google_drive_connections;
create policy "Users can manage own connection"
  on public.google_drive_connections for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Track which Drive file maps to which imported document, so re-sync
-- can update existing rows instead of duplicating them.
alter table public.documents
  add column if not exists source text default 'upload',
  add column if not exists external_id text;

create unique index if not exists documents_owner_external_id_idx
  on public.documents (owner_id, external_id)
  where external_id is not null;
