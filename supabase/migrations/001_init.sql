-- Merit Badge Events table
create table if not exists public.merit_badge_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid not null references auth.users(id) on delete cascade,
  badge_name text not null,
  title text not null,
  description text,
  event_date date not null,
  event_time text,
  location text,
  is_virtual boolean not null default false,
  latitude double precision,
  longitude double precision,
  subject_area text,
  is_eagle_required boolean not null default false,
  prerequisites text,
  organizer_name text,
  organizer_contact text,
  registration_url text,
  source_url text,
  status text not null default 'approved',
  image_url text,
  view_count integer not null default 0,
  save_count integer not null default 0
);

-- Indexes
create index if not exists idx_merit_badge_events_created_by on public.merit_badge_events (created_by);
create index if not exists idx_merit_badge_events_badge_name on public.merit_badge_events (badge_name);
create index if not exists idx_merit_badge_events_event_date on public.merit_badge_events (event_date);
create index if not exists idx_merit_badge_events_status on public.merit_badge_events (status);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_merit_badge_events_updated_at
  before update on public.merit_badge_events
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.merit_badge_events enable row level security;

-- Anyone can read approved events
create policy "Public read approved events"
  on public.merit_badge_events for select
  using (status = 'approved');

-- Authenticated users can create events
create policy "Authenticated users can create events"
  on public.merit_badge_events for insert
  to authenticated
  with check (auth.uid() = created_by);

-- Owners can update their own events
create policy "Owners can update their events"
  on public.merit_badge_events for update
  to authenticated
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

-- Owners can delete their own events
create policy "Owners can delete their events"
  on public.merit_badge_events for delete
  to authenticated
  using (auth.uid() = created_by);

-- Service role bypasses RLS (used by server-side admin client)
