-- IndisStack Phase 2 — workspaces, membership, ticket ownership, RLS
-- Safe to apply on existing projects. Does not DROP tables or delete data.
--
-- Security model:
-- - Authenticated users may READ workspace data they belong to.
-- - Workspace + membership creation is server-only (service role), never client RLS.
-- - No authenticated INSERT/UPDATE/DELETE on workspace_members (prevents joining arbitrary workspaces).

-- ---------------------------------------------------------------------------
-- workspaces
-- ---------------------------------------------------------------------------

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workspaces_created_at_idx
  on public.workspaces (created_at desc);

-- ---------------------------------------------------------------------------
-- workspace_members
-- ---------------------------------------------------------------------------

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  constraint workspace_members_role_check
    check (role in ('owner', 'admin', 'agent')),
  constraint workspace_members_workspace_user_unique
    unique (workspace_id, user_id)
);

create index if not exists workspace_members_user_id_idx
  on public.workspace_members (user_id);

create index if not exists workspace_members_workspace_id_idx
  on public.workspace_members (workspace_id);

-- ---------------------------------------------------------------------------
-- ticket ownership
-- ---------------------------------------------------------------------------

alter table public.tickets
  add column if not exists workspace_id uuid references public.workspaces (id) on delete cascade;

create index if not exists tickets_workspace_id_idx
  on public.tickets (workspace_id);

-- ---------------------------------------------------------------------------
-- updated_at trigger for workspaces
-- ---------------------------------------------------------------------------

create or replace function public.set_workspaces_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists workspaces_set_updated_at on public.workspaces;

create trigger workspaces_set_updated_at
before update on public.workspaces
for each row
execute function public.set_workspaces_updated_at();

-- ---------------------------------------------------------------------------
-- RLS helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_workspace_member(ws_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = ws_id
      and wm.user_id = auth.uid()
  );
$$;

create or replace function public.can_access_ticket(ticket_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.tickets t
    inner join public.workspace_members wm
      on wm.workspace_id = t.workspace_id
    where t.id = ticket_id
      and wm.user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- row level security
-- ---------------------------------------------------------------------------

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

-- workspaces: read + owner update only (no authenticated INSERT)
drop policy if exists "workspaces_select_member" on public.workspaces;
create policy "workspaces_select_member"
  on public.workspaces
  for select
  to authenticated
  using (public.is_workspace_member(id));

drop policy if exists "workspaces_insert_authenticated" on public.workspaces;

drop policy if exists "workspaces_update_owner" on public.workspaces;
create policy "workspaces_update_owner"
  on public.workspaces
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.workspace_members wm
      where wm.workspace_id = workspaces.id
        and wm.user_id = auth.uid()
        and wm.role = 'owner'
    )
  )
  with check (
    exists (
      select 1
      from public.workspace_members wm
      where wm.workspace_id = workspaces.id
        and wm.user_id = auth.uid()
        and wm.role = 'owner'
    )
  );

-- workspace_members: read own membership only (no authenticated writes)
drop policy if exists "workspace_members_select_own" on public.workspace_members;
create policy "workspace_members_select_own"
  on public.workspace_members
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "workspace_members_insert_self" on public.workspace_members;

-- tickets
drop policy if exists "tickets_select_workspace" on public.tickets;
create policy "tickets_select_workspace"
  on public.tickets
  for select
  to authenticated
  using (
    workspace_id is not null
    and public.is_workspace_member(workspace_id)
  );

drop policy if exists "tickets_insert_workspace" on public.tickets;
create policy "tickets_insert_workspace"
  on public.tickets
  for insert
  to authenticated
  with check (
    workspace_id is not null
    and public.is_workspace_member(workspace_id)
  );

drop policy if exists "tickets_update_workspace" on public.tickets;
create policy "tickets_update_workspace"
  on public.tickets
  for update
  to authenticated
  using (
    workspace_id is not null
    and public.is_workspace_member(workspace_id)
  )
  with check (
    workspace_id is not null
    and public.is_workspace_member(workspace_id)
  );

-- messages
drop policy if exists "messages_select_workspace" on public.messages;
create policy "messages_select_workspace"
  on public.messages
  for select
  to authenticated
  using (public.can_access_ticket(ticket_id));

drop policy if exists "messages_insert_workspace" on public.messages;
create policy "messages_insert_workspace"
  on public.messages
  for insert
  to authenticated
  with check (public.can_access_ticket(ticket_id));

-- analyses
drop policy if exists "analyses_select_workspace" on public.analyses;
create policy "analyses_select_workspace"
  on public.analyses
  for select
  to authenticated
  using (public.can_access_ticket(ticket_id));

drop policy if exists "analyses_insert_workspace" on public.analyses;
create policy "analyses_insert_workspace"
  on public.analyses
  for insert
  to authenticated
  with check (public.can_access_ticket(ticket_id));

drop policy if exists "analyses_update_workspace" on public.analyses;
create policy "analyses_update_workspace"
  on public.analyses
  for update
  to authenticated
  using (public.can_access_ticket(ticket_id))
  with check (public.can_access_ticket(ticket_id));
