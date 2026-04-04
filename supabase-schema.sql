-- ============================================
-- Fundsprout Grant Database Page — Supabase Schema
-- All tables prefixed with gp_ to avoid conflicts
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================

-- 1. PROFILES for grant page users
create table if not exists public.gp_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  full_name text,
  organization_name text,
  organization_type text,
  focus_area text,
  state text,
  has_paid boolean default false,
  stripe_customer_id text,
  stripe_session_id text,
  payment_status text default 'unpaid',
  amount_paid integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create gp_profile on signup
create or replace function public.handle_new_gp_user()
returns trigger as $$
begin
  insert into public.gp_profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_gp on auth.users;
create trigger on_auth_user_created_gp
  after insert on auth.users
  for each row execute procedure public.handle_new_gp_user();

-- 2. GRANT DIRECTORY
create table if not exists public.gp_grants (
  id uuid default gen_random_uuid() primary key,
  grant_name text not null,
  funding_organization text not null,
  description text,
  application_url text,
  amount_min integer,
  amount_max integer,
  funding_type text,
  application_deadline text,
  grant_cycle text,
  focus_area text,
  geographic_eligibility text,
  eligible_org_types text,
  org_budget_requirement text,
  estimated_complexity text,
  requires_loi text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. EMAIL CAPTURES (lead gen from assessment)
create table if not exists public.gp_email_captures (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  organization_type text,
  focus_area text,
  state text,
  eligible_grant_count integer,
  created_at timestamptz default now()
);

-- ============================================
-- Row Level Security
-- ============================================

alter table public.gp_profiles enable row level security;
alter table public.gp_grants enable row level security;
alter table public.gp_email_captures enable row level security;

-- PROFILES: users can read/update their own row
create policy "GP users can view own profile"
  on public.gp_profiles for select
  using (auth.uid() = id);

create policy "GP users can update own profile"
  on public.gp_profiles for update
  using (auth.uid() = id);

-- GRANTS: paid users can read all grants
create policy "GP paid users can view grants"
  on public.gp_grants for select
  using (
    exists (
      select 1 from public.gp_profiles
      where gp_profiles.id = auth.uid()
      and gp_profiles.has_paid = true
    )
  );

-- EMAIL CAPTURES: anyone can insert (lead gen)
create policy "GP anyone can insert email captures"
  on public.gp_email_captures for insert
  with check (true);

-- EMAIL CAPTURES: anyone can update their own row by email (for assessment completion)
create policy "GP anyone can update own email capture"
  on public.gp_email_captures for update
  using (true);

-- ============================================
-- RPC: Grant count for assessment (no auth needed)
-- ============================================

create or replace function public.gp_count_matching_grants(
  p_org_type text default null,
  p_focus_area text default null,
  p_state text default null
)
returns json as $$
declare
  grant_count integer;
  total_potential bigint;
begin
  select
    count(*),
    coalesce(sum(amount_max), 0)
  into grant_count, total_potential
  from public.gp_grants
  where is_active = true
    and (p_focus_area is null or focus_area ilike '%' || p_focus_area || '%' or focus_area = 'General Operating')
    and (p_state is null or geographic_eligibility ilike '%' || p_state || '%' or geographic_eligibility = 'National');

  return json_build_object(
    'count', grant_count,
    'total_potential', total_potential
  );
end;
$$ language plpgsql security definer;

-- ============================================
-- Indexes
-- ============================================

create index if not exists idx_gp_grants_focus_area on public.gp_grants(focus_area);
create index if not exists idx_gp_grants_funding_type on public.gp_grants(funding_type);
create index if not exists idx_gp_grants_geographic on public.gp_grants(geographic_eligibility);
create index if not exists idx_gp_grants_is_active on public.gp_grants(is_active);
create index if not exists idx_gp_email_captures_email on public.gp_email_captures(email);
