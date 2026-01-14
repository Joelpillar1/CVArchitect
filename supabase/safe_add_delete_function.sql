-- =====================================================================
-- SAFE PATCH: Add Delete Account Function ONLY
-- =====================================================================
-- Run this in the Supabase SQL Editor to add the delete capability.
-- This script does NOT delete any tables or existing data.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- 1. Get the ID of the user requesting deletion
  v_user_id := auth.uid();
  
  -- 2. SAFETY CHECK: Stop immediately if no user ID is found
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated - Cannot delete account';
  END IF;

  -- 3. Delete ONLY data that belongs to this specific user (v_user_id)
  
  -- Delete dependent data (children)
  DELETE FROM public.resume_versions WHERE resume_id IN (SELECT id FROM public.resumes WHERE user_id = v_user_id);
  DELETE FROM public.cover_letters WHERE user_id = v_user_id;
  DELETE FROM public.usage_logs WHERE user_id = v_user_id;
  DELETE FROM public.billing_history WHERE user_id = v_user_id;
  
  -- Delete primary data
  DELETE FROM public.resumes WHERE user_id = v_user_id;
  DELETE FROM public.subscriptions WHERE user_id = v_user_id;
  
  -- Delete profile
  DELETE FROM public.profiles WHERE id = v_user_id;
  
END;
$$;
