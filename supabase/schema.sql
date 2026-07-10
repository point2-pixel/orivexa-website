-- Orivexa AI — Supabase schema
-- Run this once in your Supabase project's SQL Editor (Database > SQL Editor > New query).
-- Safe to re-run: each statement checks for existing objects first.

-- ────────────────────────────────────────────────────────────
-- 1. profiles — one row per user, mirrors auth.users
-- ────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ────────────────────────────────────────────────────────────
-- 2. workspaces — the "page" each new user automatically gets
-- ────────────────────────────────────────────────────────────
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users on delete cascade not null,
  name text not null,
  slug text unique not null,
  created_at timestamptz default now()
);

alter table public.workspaces enable row level security;

drop policy if exists "Users can view own workspace" on public.workspaces;
create policy "Users can view own workspace"
  on public.workspaces for select
  using (auth.uid() = owner_id);

drop policy if exists "Users can update own workspace" on public.workspaces;
create policy "Users can update own workspace"
  on public.workspaces for update
  using (auth.uid() = owner_id);

-- ────────────────────────────────────────────────────────────
-- 3. Auto-provisioning: when a new user signs up, automatically
--    create their profile row AND their first workspace ("page").
--    This is what makes signup instantly usable with zero setup.
-- ────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base_name text;
  workspace_name text;
  workspace_slug text;
begin
  base_name := coalesce(
    nullif(new.raw_user_meta_data->>'full_name', ''),
    split_part(new.email, '@', 1)
  );

  insert into public.profiles (id, full_name, email)
  values (new.id, base_name, new.email)
  on conflict (id) do nothing;

  workspace_name := base_name || '''s workspace';
  workspace_slug := lower(regexp_replace(base_name, '[^a-zA-Z0-9]+', '-', 'g'))
    || '-' || substr(new.id::text, 1, 6);

  insert into public.workspaces (owner_id, name, slug)
  values (new.id, workspace_name, workspace_slug)
  on conflict (slug) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
