-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- hr_profiles table
create table public.hr_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text,
  rotaract_id text,
  club_id text,
  club_name text,
  parent_rotary text,
  district text,
  role text default 'MEMBER',
  status text default 'PENDING_APPROVAL',
  phone text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- hr_events table
create table public.hr_events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  start_time timestamp with time zone,
  end_time timestamp with time zone,
  venue text,
  tag text,
  google_rulebook_url text,
  meet_link text,
  coordinators uuid[] default '{}',
  created_by uuid references public.hr_profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- hr_attendance table
create table public.hr_attendance (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.hr_events(id) on delete cascade,
  profile_id uuid references public.hr_profiles(id) on delete cascade,
  attended_by_admin_id uuid references public.hr_profiles(id),
  attended_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(event_id, profile_id)
);

-- hr_tasks table
create table public.hr_tasks (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  assigned_to uuid references public.hr_profiles(id),
  created_by uuid references public.hr_profiles(id),
  start_date timestamp with time zone default timezone('utc'::text, now()),
  end_date timestamp with time zone,
  status text default 'PENDING',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- hr_notices table
create table public.hr_notices (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text,
  created_by uuid references public.hr_profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- hr_payments table
create table public.hr_payments (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.hr_profiles(id) on delete cascade,
  amount_due numeric default 0,
  status text default 'UNPAID',
  upi_transaction_ref text,
  receipt_screenshot_url text,
  remarks text,
  verified_by uuid references public.hr_profiles(id),
  verified_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- hr_notifications table
create table public.hr_notifications (
  id uuid default uuid_generate_v4() primary key,
  profile_id uuid references public.hr_profiles(id) on delete cascade,
  title text not null,
  content text,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.hr_profiles (id, email, name, rotaract_id, club_id, club_name, parent_rotary, district)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'rotaract_id',
    new.raw_user_meta_data->>'club_id',
    new.raw_user_meta_data->>'club_name',
    new.raw_user_meta_data->>'parent_rotary',
    new.raw_user_meta_data->>'district'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
