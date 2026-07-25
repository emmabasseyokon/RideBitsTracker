-- RideBits Release Tracker — full schema
--
-- Single source of truth for everything the app needs in Postgres.
-- Safe to run top-to-bottom on a fresh Supabase project, and safe to
-- re-run on a project that already has an earlier version of this
-- table — every statement is idempotent (create-if-not-exists,
-- drop-if-exists, or create-or-replace).

-- Releases table
create table if not exists public.releases (
  id uuid primary key default gen_random_uuid(),
  environment text not null check (environment in ('production', 'staging')),
  status text not null check (status in ('in_production', 'rolled_back', 'current_version')),
  major integer not null default 0,
  minor integer not null default 0,
  patch integer not null default 0,
  version text not null default '',
  notes text,
  created_at timestamptz not null default now()
);

-- Staging and production share the same status set, so a release can be
-- rolled back in either environment. Drops the old constraint that used
-- to forbid staging + rolled_back, if it's still present.
alter table public.releases
  drop constraint if exists staging_cannot_be_rolled_back;

-- Only one "current_version" release per environment
create unique index if not exists one_current_version_per_environment
  on public.releases (environment)
  where (status = 'current_version');

-- Auto-increment version: v2.0.0 -> v2.0.99 -> v2.1.0 -> ...
create or replace function public.releases_set_version()
returns trigger as $$
declare
  prev record;
begin
  select r.major, r.minor, r.patch into prev
  from public.releases r
  order by r.major desc, r.minor desc, r.patch desc
  limit 1;

  if prev is null then
    new.major := 2;
    new.minor := 0;
    new.patch := 0;
  elsif prev.patch < 99 then
    new.major := prev.major;
    new.minor := prev.minor;
    new.patch := prev.patch + 1;
  else
    new.major := prev.major;
    new.minor := prev.minor + 1;
    new.patch := 0;
  end if;

  new.version := 'v' || new.major || '.' || new.minor || '.' || new.patch;
  return new;
end;
$$ language plpgsql;

drop trigger if exists releases_before_insert_set_version on public.releases;
create trigger releases_before_insert_set_version
  before insert on public.releases
  for each row execute function public.releases_set_version();

-- When a release becomes "current_version", demote the previous
-- current_version release in the same environment to "in_production"
create or replace function public.releases_demote_previous_current()
returns trigger as $$
begin
  if new.status = 'current_version' then
    update public.releases
    set status = 'in_production'
    where environment = new.environment
      and status = 'current_version'
      and id <> new.id;
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists releases_before_write_demote_previous_current on public.releases;
create trigger releases_before_write_demote_previous_current
  before insert or update of status on public.releases
  for each row execute function public.releases_demote_previous_current();

-- When the release that was "current_version" in production gets rolled
-- back, promote the newest remaining production release (by version,
-- falling back to created_at) to "current_version", so production
-- always has a clear current release.
create or replace function public.releases_promote_after_rollback()
returns trigger as $$
begin
  if new.status = 'rolled_back' and old.status = 'current_version' then
    update public.releases
    set status = 'current_version'
    where id = (
      select id
      from public.releases
      where environment = 'production'
        and status <> 'rolled_back'
        and id <> new.id
      order by major desc, minor desc, patch desc, created_at desc
      limit 1
    );
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists releases_after_write_promote_after_rollback on public.releases;
create trigger releases_after_write_promote_after_rollback
  after update of status on public.releases
  for each row execute function public.releases_promote_after_rollback();

-- RLS: no auth in this app, so allow full access via the anon key
alter table public.releases enable row level security;

drop policy if exists "Allow all access to releases" on public.releases;
create policy "Allow all access to releases"
  on public.releases
  for all
  using (true)
  with check (true);
