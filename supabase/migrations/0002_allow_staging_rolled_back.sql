-- Staging and production now share the same set of statuses, including
-- "rolled_back", so this constraint no longer applies.
alter table public.releases
  drop constraint if exists staging_cannot_be_rolled_back;
