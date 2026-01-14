-- ============================================
-- CV Architect - Complete Database Schema
-- DROP AND RECREATE ALL TABLES
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DROP EXISTING POLICIES AND TABLES
-- ============================================

-- Drop trigger and function first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop tables (in correct order due to foreign keys)
-- Using CASCADE to drop dependent objects
DROP TABLE IF EXISTS public.billing_history CASCADE;
DROP TABLE IF EXISTS public.resume_versions CASCADE;
DROP TABLE IF EXISTS public.cover_letters CASCADE;
DROP TABLE IF EXISTS public.usage_logs CASCADE;
DROP TABLE IF EXISTS public.resumes CASCADE;
DROP TABLE IF EXISTS public.subscriptions CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ============================================
-- 1. PROFILES TABLE
-- ============================================
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  avatar_url text,
  website text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================
-- 2. SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE public.subscriptions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  plan_id text NOT NULL DEFAULT 'free',
  credits integer NOT NULL DEFAULT 10,
  billing_cycle text,
  subscription_start timestamptz,
  subscription_end timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription"
  ON public.subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE INDEX subscriptions_user_id_idx ON public.subscriptions(user_id);

-- ============================================
-- 3. RESUMES TABLE
-- ============================================
CREATE TABLE public.resumes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resumes"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
  ON public.resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
  ON public.resumes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX resumes_user_id_idx ON public.resumes(user_id);
CREATE INDEX resumes_created_at_idx ON public.resumes(created_at DESC);

-- ============================================
-- 4. USAGE LOGS TABLE
-- ============================================
CREATE TABLE public.usage_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  action text NOT NULL,
  credits_cost integer NOT NULL DEFAULT 0,
  remaining_credits integer NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage logs"
  ON public.usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage logs"
  ON public.usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX usage_logs_user_id_idx ON public.usage_logs(user_id);
CREATE INDEX usage_logs_created_at_idx ON public.usage_logs(created_at DESC);

-- ============================================
-- 5. COVER LETTERS TABLE
-- ============================================
CREATE TABLE public.cover_letters (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  job_title text,
  company_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cover letters"
  ON public.cover_letters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cover letters"
  ON public.cover_letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cover letters"
  ON public.cover_letters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cover letters"
  ON public.cover_letters FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX cover_letters_user_id_idx ON public.cover_letters(user_id);
CREATE INDEX cover_letters_created_at_idx ON public.cover_letters(created_at DESC);

-- ============================================
-- 6. RESUME VERSIONS TABLE
-- ============================================
CREATE TABLE public.resume_versions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id uuid REFERENCES public.resumes ON DELETE CASCADE NOT NULL,
  version_number integer NOT NULL,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view versions of their own resumes"
  ON public.resume_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.resumes
      WHERE resumes.id = resume_versions.resume_id
      AND resumes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert versions of their own resumes"
  ON public.resume_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.resumes
      WHERE resumes.id = resume_versions.resume_id
      AND resumes.user_id = auth.uid()
    )
  );

CREATE INDEX resume_versions_resume_id_idx ON public.resume_versions(resume_id);
CREATE INDEX resume_versions_created_at_idx ON public.resume_versions(created_at DESC);

-- ============================================
-- 7. BILLING HISTORY TABLE
-- ============================================
CREATE TABLE public.billing_history (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  amount decimal(10, 2) NOT NULL,
  currency text DEFAULT 'USD',
  description text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  payment_method text,
  transaction_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own billing history"
  ON public.billing_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX billing_history_user_id_idx ON public.billing_history(user_id);
CREATE INDEX billing_history_created_at_idx ON public.billing_history(created_at DESC);

-- ============================================
-- TRIGGER: AUTO-CREATE PROFILE & SUBSCRIPTION ON SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NOW(),
    NOW()
  );
  
  -- Create default subscription (Free plan with 10 credits)
  INSERT INTO public.subscriptions (
    user_id,
    plan_id,
    credits,
    is_active,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    'free',
    10,
    true,
    NOW(),
    NOW()
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error creating user data: %', SQLERRM;
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- GRANT PERMISSIONS
-- ============================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.subscriptions TO anon, authenticated;
GRANT ALL ON public.resumes TO anon, authenticated;
GRANT ALL ON public.usage_logs TO anon, authenticated;
GRANT ALL ON public.cover_letters TO anon, authenticated;
GRANT ALL ON public.resume_versions TO anon, authenticated;
GRANT ALL ON public.billing_history TO anon, authenticated;

-- ============================================
-- DONE!
-- ============================================
-- ✅ All 7 tables created
-- ✅ RLS policies enabled
-- ✅ Indexes created
-- ✅ Trigger set up for auto-creating user data
-- ✅ Ready to use!

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to safely delete a user's account data from public tables
-- Can be called via supabase.rpc('delete_user_account') from the client
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the ID of the calling user
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete data in order of dependencies (leaves -> root)
  DELETE FROM public.resume_versions WHERE resume_id IN (SELECT id FROM public.resumes WHERE user_id = v_user_id);
  DELETE FROM public.cover_letters WHERE user_id = v_user_id;
  DELETE FROM public.usage_logs WHERE user_id = v_user_id;
  DELETE FROM public.billing_history WHERE user_id = v_user_id;
  
  -- Delete main entities
  DELETE FROM public.resumes WHERE user_id = v_user_id;
  DELETE FROM public.subscriptions WHERE user_id = v_user_id;
  
  -- Finally delete the profile
  DELETE FROM public.profiles WHERE id = v_user_id;
  
END;
$$;

