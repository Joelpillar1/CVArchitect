-- ============================================
-- CV Architect - Resume Versions Table Migration
-- Supports both saved_resumes and legacy resumes
-- ============================================

CREATE TABLE IF NOT EXISTS public.resume_versions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id uuid NOT NULL,
  version_number integer NOT NULL,
  version_name text,
  change_summary text,
  content jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view versions of their own resumes" ON public.resume_versions;
DROP POLICY IF EXISTS "Users can insert versions of their own resumes" ON public.resume_versions;
DROP POLICY IF EXISTS "Users can delete versions of their own resumes" ON public.resume_versions;

-- RLS: Select versions if user owns the resume in saved_resumes or legacy resumes
CREATE POLICY "Users can view versions of their own resumes"
  ON public.resume_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.saved_resumes
      WHERE saved_resumes.id = resume_versions.resume_id
      AND saved_resumes.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.resumes
      WHERE resumes.id = resume_versions.resume_id
      AND resumes.user_id = auth.uid()
    )
  );

-- RLS: Insert versions if user owns the resume
CREATE POLICY "Users can insert versions of their own resumes"
  ON public.resume_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.saved_resumes
      WHERE saved_resumes.id = resume_versions.resume_id
      AND saved_resumes.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.resumes
      WHERE resumes.id = resume_versions.resume_id
      AND resumes.user_id = auth.uid()
    )
  );

-- RLS: Delete versions if user owns the resume
CREATE POLICY "Users can delete versions of their own resumes"
  ON public.resume_versions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.saved_resumes
      WHERE saved_resumes.id = resume_versions.resume_id
      AND saved_resumes.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.resumes
      WHERE resumes.id = resume_versions.resume_id
      AND resumes.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS resume_versions_resume_id_idx ON public.resume_versions(resume_id);
CREATE INDEX IF NOT EXISTS resume_versions_created_at_idx ON public.resume_versions(created_at DESC);
