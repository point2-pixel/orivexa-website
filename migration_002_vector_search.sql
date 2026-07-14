-- Migration 002: Vector search for document Q&A
-- Run this in Supabase SQL Editor AFTER schema.sql. Safe to re-run.

create extension if not exists vector;

-- ────────────────────────────────────────────────────────────
-- document_chunks — one row per chunk, with its embedding
-- ────────────────────────────────────────────────────────────
create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.documents(id) on delete cascade not null,
  workspace_id uuid references public.workspaces(id) on delete cascade not null,
  owner_id uuid references auth.users on delete cascade not null,
  chunk_index int not null,
  content text not null,
  embedding vector(1024),
  created_at timestamptz default now()
);

create index if not exists document_chunks_embedding_idx
  on public.document_chunks
  using hnsw (embedding vector_cosine_ops);

create index if not exists document_chunks_document_id_idx
  on public.document_chunks (document_id);

alter table public.document_chunks enable row level security;

drop policy if exists "Users can view own chunks" on public.document_chunks;
create policy "Users can view own chunks"
  on public.document_chunks for select
  using (auth.uid() = owner_id);

drop policy if exists "Users can insert own chunks" on public.document_chunks;
create policy "Users can insert own chunks"
  on public.document_chunks for insert
  with check (auth.uid() = owner_id);

drop policy if exists "Users can delete own chunks" on public.document_chunks;
create policy "Users can delete own chunks"
  on public.document_chunks for delete
  using (auth.uid() = owner_id);

-- ────────────────────────────────────────────────────────────
-- match_document_chunks — top-K similarity search, scoped to one owner
-- security definer so it can query across RLS efficiently, but the
-- match_owner_id filter is what actually enforces per-user isolation —
-- always pass the authenticated user's own id, never trust client input.
-- ────────────────────────────────────────────────────────────
create or replace function public.match_document_chunks(
  query_embedding vector(1024),
  match_owner_id uuid,
  match_count int default 8
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  similarity float
)
language sql stable
security definer
set search_path = public
as $$
  select
    document_chunks.id,
    document_chunks.document_id,
    document_chunks.content,
    1 - (document_chunks.embedding <=> query_embedding) as similarity
  from document_chunks
  where document_chunks.owner_id = match_owner_id
  order by document_chunks.embedding <=> query_embedding
  limit match_count;
$$;
