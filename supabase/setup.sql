-- PWS Database Setup (Feature 01: Onboarding)

-- Create enums
CREATE TYPE user_role AS ENUM ('client', 'coach', 'admin');
CREATE TYPE program_phase AS ENUM ('HPOP', 'TPOP', 'EPOP');

-- Users table (Extends auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'client',
  assigned_coach_id UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- User Profiles table (Onboarding data)
CREATE TABLE public.user_profiles (
  user_id UUID REFERENCES public.users(id) PRIMARY KEY,
  age INTEGER,
  gender TEXT,
  height NUMERIC,
  weight NUMERIC,
  active_phase program_phase DEFAULT 'HPOP',
  goals TEXT,
  health_history TEXT,
  baseline_photo_front_url TEXT,
  baseline_photo_side_url TEXT,
  baseline_photo_back_url TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Secure the tables with Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own record."
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own record."
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own record."
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for user_profiles table
CREATE POLICY "Users can view their own profile."
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile."
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile."
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Storage bucket for baseline photos
insert into storage.buckets (id, name, public) values ('baseline-photos', 'baseline-photos', false);

-- Storage Policies
create policy "Users can upload their own photos"
  on storage.objects for insert
  with check (bucket_id = 'baseline-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can view their own photos"
  on storage.objects for select
  using (bucket_id = 'baseline-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
