-- ============================================
-- Fundsprout Grant Database - Supabase Schema
-- ============================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================
-- GRANTS TABLE
-- ============================================
create table public.grants (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text not null,
  funder text not null,
  amount_min integer,
  amount_max integer,
  deadline date,
  geography text not null default 'United States - National',
  grant_type text not null default 'Federal',
  eligibility text not null default '',
  focus_area text not null default '',
  application_url text,
  advice text,
  competitiveness text check (competitiveness in ('low', 'medium', 'high')),
  typical_award text,
  key_requirements text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for common filters
create index idx_grants_geography on public.grants(geography);
create index idx_grants_grant_type on public.grants(grant_type);
create index idx_grants_focus_area on public.grants(focus_area);
create index idx_grants_deadline on public.grants(deadline);

-- Full text search index
alter table public.grants add column fts tsvector
  generated always as (
    to_tsvector('english',
      coalesce(title, '') || ' ' ||
      coalesce(description, '') || ' ' ||
      coalesce(funder, '') || ' ' ||
      coalesce(focus_area, '') || ' ' ||
      coalesce(geography, '')
    )
  ) stored;

create index idx_grants_fts on public.grants using gin(fts);

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  has_paid boolean default false,
  stripe_customer_id text,
  organization_name text,
  organization_type text,
  created_at timestamptz default now()
);

-- Index for quick payment status lookups
create index idx_profiles_has_paid on public.profiles(has_paid);

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, organization_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'organization_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Grants: anyone can read, only admins can write
alter table public.grants enable row level security;

create policy "Grants are viewable by everyone"
  on public.grants for select
  using (true);

create policy "Grants are editable by service role only"
  on public.grants for all
  using (auth.role() = 'service_role');

-- Profiles: users can read their own, service role can update
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Service role can manage all profiles"
  on public.profiles for all
  using (auth.role() = 'service_role');

-- ============================================
-- UPDATED_AT TRIGGER FOR GRANTS
-- ============================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger grants_updated_at
  before update on public.grants
  for each row execute procedure public.update_updated_at();
