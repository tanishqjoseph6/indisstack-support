-- IndisStack Support Inbox — production schema
-- Apply via Supabase SQL editor or: supabase db push
--
-- Safe for new Supabase projects. Does not DROP existing tables.
-- If legacy dev tables from 20250815000000_inbox_schema.sql exist on the
-- same project, use a fresh database or rename legacy tables before applying.
-- See README.md for details.

-- ---------------------------------------------------------------------------
-- tickets
-- ---------------------------------------------------------------------------

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_initials text,
  preview text,
  channel text,
  language text,
  priority text,
  status text not null default 'unresolved',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tickets_status_check
    check (status in ('unresolved', 'resolved', 'escalated')),
  constraint tickets_priority_check
    check (priority is null or priority in ('low', 'medium', 'high'))
);

create index if not exists tickets_status_idx
  on public.tickets (status);

create index if not exists tickets_created_at_idx
  on public.tickets (created_at desc);

-- ---------------------------------------------------------------------------
-- messages
-- ---------------------------------------------------------------------------

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  sender_type text not null,
  sender_name text,
  content text not null,
  created_at timestamptz not null default now(),
  constraint messages_sender_type_check
    check (sender_type in ('customer', 'agent', 'system'))
);

create index if not exists messages_ticket_id_idx
  on public.messages (ticket_id);

-- ---------------------------------------------------------------------------
-- analyses
-- ---------------------------------------------------------------------------

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  intent text,
  priority text,
  recommended_action text,
  confidence numeric,
  escalation_required boolean not null default false,
  suggested_reply text,
  created_at timestamptz not null default now(),
  constraint analyses_priority_check
    check (priority is null or priority in ('low', 'medium', 'high')),
  constraint analyses_confidence_check
    check (confidence is null or (confidence >= 0 and confidence <= 100))
);

create unique index if not exists analyses_ticket_id_unique_idx
  on public.analyses (ticket_id);

create index if not exists analyses_ticket_id_idx
  on public.analyses (ticket_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------

create or replace function public.set_tickets_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tickets_set_updated_at on public.tickets;

create trigger tickets_set_updated_at
before update on public.tickets
for each row
execute function public.set_tickets_updated_at();

-- ---------------------------------------------------------------------------
-- row level security (no public policies — service role access only for now)
-- ---------------------------------------------------------------------------

alter table public.tickets enable row level security;
alter table public.messages enable row level security;
alter table public.analyses enable row level security;

-- Intentionally no permissive anon/authenticated policies.
-- Server-side code using SUPABASE_SERVICE_ROLE_KEY bypasses RLS.
-- Add workspace-scoped policies when authentication is implemented.
