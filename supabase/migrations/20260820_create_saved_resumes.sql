-- ============================================
-- Migration: Create saved_resumes table
-- ============================================

-- Create saved_resumes table
CREATE TABLE IF NOT EXISTS public.saved_resumes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  job_data jsonb,
  task_state jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.saved_resumes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own saved resumes" ON public.saved_resumes;
DROP POLICY IF EXISTS "Users can insert their own saved resumes" ON public.saved_resumes;
DROP POLICY IF EXISTS "Users can update their own saved resumes" ON public.saved_resumes;
DROP POLICY IF EXISTS "Users can delete their own saved resumes" ON public.saved_resumes;

-- Create RLS Policies
CREATE POLICY "Users can view their own saved resumes"
  ON public.saved_resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved resumes"
  ON public.saved_resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved resumes"
  ON public.saved_resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved resumes"
  ON public.saved_resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Create Indexes for fast querying
CREATE INDEX IF NOT EXISTS saved_resumes_user_id_idx ON public.saved_resumes(user_id);
CREATE INDEX IF NOT EXISTS saved_resumes_created_at_idx ON public.saved_resumes(created_at DESC);
CREATE INDEX IF NOT EXISTS saved_resumes_updated_at_idx ON public.saved_resumes(updated_at DESC);

-- Grant Permissions
GRANT ALL ON public.saved_resumes TO anon, authenticated;

-- Migrate existing resumes if public.resumes table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'resumes') THEN
    INSERT INTO public.saved_resumes (id, user_id, title, content, job_data, task_state, created_at, updated_at)
    SELECT id, user_id, title, content, job_data, task_state, created_at, updated_at
    FROM public.resumes
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      content = EXCLUDED.content,
      job_data = EXCLUDED.job_data,
      task_state = EXCLUDED.task_state,
      updated_at = EXCLUDED.updated_at;
  END IF;
END $$;
