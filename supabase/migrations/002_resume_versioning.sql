-- Resume Versioning Schema Update
-- Run this in your Supabase SQL Editor

-- Add version tracking columns to resumes table
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS version_number integer DEFAULT 1;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS version_name text;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS parent_resume_id uuid REFERENCES resumes(id) ON DELETE SET NULL;

-- Create resume_versions table for version history
CREATE TABLE IF NOT EXISTS resume_versions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  resume_id uuid REFERENCES resumes(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  version_number integer NOT NULL,
  version_name text,
  title text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure unique version numbers per resume
  UNIQUE(resume_id, version_number)
);

-- Set up RLS for resume_versions
ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resume versions." ON resume_versions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume versions." ON resume_versions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resume versions." ON resume_versions
  FOR DELETE USING (auth.uid() = user_id);

-- Function to automatically create version snapshot on resume update
CREATE OR REPLACE FUNCTION create_resume_version()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create version if content actually changed
  IF OLD.content IS DISTINCT FROM NEW.content THEN
    INSERT INTO resume_versions (
      resume_id,
      user_id,
      version_number,
      version_name,
      title,
      content,
      created_at
    ) VALUES (
      OLD.id,
      OLD.user_id,
      OLD.version_number,
      OLD.version_name,
      OLD.title,
      OLD.content,
      OLD.updated_at
    );
    
    -- Increment version number
    NEW.version_number := OLD.version_number + 1;
    NEW.version_name := NULL; -- Clear version name for new version
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create version on update
DROP TRIGGER IF EXISTS on_resume_update_create_version ON resumes;
CREATE TRIGGER on_resume_update_create_version
  BEFORE UPDATE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION create_resume_version();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_resume_versions_resume_id ON resume_versions(resume_id);
CREATE INDEX IF NOT EXISTS idx_resume_versions_user_id ON resume_versions(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_parent_resume_id ON resumes(parent_resume_id);
