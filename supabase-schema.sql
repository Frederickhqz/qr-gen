-- QR Studio Supabase Schema
-- Run this in Supabase SQL Editor

-- 1. Profiles Table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  stripe_customer_id text,
  subscription_status text default 'none',
  marketing_consent boolean default true
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. QR Codes Table
create table public.qr_codes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  type text not null,
  data jsonb not null,
  styles jsonb not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  download_count integer default 0,
  last_downloaded_at timestamp with time zone
);

-- Indexes
create index idx_qr_codes_user_id on public.qr_codes(user_id);
create index idx_qr_codes_created_at on public.qr_codes(created_at desc);

-- RLS
alter table public.qr_codes enable row level security;

create policy "Users can CRUD own QR codes"
  on public.qr_codes for all
  using (auth.uid() = user_id);

-- 3. Anonymous Sessions Table
create table public.anonymous_sessions (
  id uuid default gen_random_uuid() primary key,
  email text,
  session_data jsonb default '{}',
  created_at timestamp with time zone default now(),
  converted_at timestamp with time zone,
  user_id uuid references auth.users
);

create index idx_anonymous_email on public.anonymous_sessions(email);
create index idx_anonymous_user_id on public.anonymous_sessions(user_id);

-- RLS - no restrictions for anonymous
create policy "Allow all anonymous sessions"
  on public.anonymous_sessions for all
  using (true)
  with check (true);

-- 4. Events Table (Analytics)
create table public.events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete set null,
  anonymous_session_id uuid references public.anonymous_sessions on delete set null,
  event_type text not null,
  event_data jsonb default '{}',
  created_at timestamp with time zone default now()
);

create index idx_events_user_id on public.events(user_id);
create index idx_events_anonymous on public.events(anonymous_session_id);
create index idx_events_type_time on public.events(event_type, created_at);

-- RLS
create policy "Users can view own events"
  on public.events for select
  using (auth.uid() = user_id);

create policy "Allow insert events"
  on public.events for insert
  with check (true);

-- 5. Function to convert anonymous session
create or replace function public.convert_anonymous_session(
  p_session_id uuid,
  p_user_id uuid
)
returns void as $$
declare
  v_session_data jsonb;
begin
  -- Update session
  update public.anonymous_sessions
  set converted_at = now(),
      user_id = p_user_id
  where id = p_session_id;
  
  -- Get session data
  select session_data into v_session_data
  from public.anonymous_sessions
  where id = p_session_id;
  
  -- Migrate QR codes if any
  if v_session_data->'qr_codes' is not null then
    insert into public.qr_codes (user_id, type, data, styles)
    select 
      p_user_id,
      (jsonb_array_elements(v_session_data->'qr_codes')->>'type')::text,
      jsonb_array_elements(v_session_data->'qr_codes')->'data',
      jsonb_array_elements(v_session_data->'qr_codes')->'styles';
  end if;
end;
$$ language plpgsql security definer;

-- Grant execute permission
grant execute on function public.convert_anonymous_session to anon, authenticated;
