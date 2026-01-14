-- =====================================================================
-- COMPLETE ACCOUNT DELETION FUNCTION
-- =====================================================================
-- This function deletes ALL user data including the auth user
-- Run this in the Supabase SQL Editor
-- =====================================================================

CREATE OR REPLACE FUNCTION public.delete_user_account_complete()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_result json;
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
  
  -- 4. Delete the auth user
  -- Note: This requires the function to have SECURITY DEFINER
  -- and proper permissions on auth.users
  DELETE FROM auth.users WHERE id = v_user_id;
  
  -- 5. Return success
  v_result := json_build_object(
    'success', true,
    'message', 'Account deleted successfully',
    'user_id', v_user_id
  );
  
  RETURN v_result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and re-raise
    RAISE WARNING 'Error deleting account for user %: %', v_user_id, SQLERRM;
    RAISE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user_account_complete() TO authenticated;

-- Add a comment to document the function
COMMENT ON FUNCTION public.delete_user_account_complete() IS 
'Completely deletes a user account including all data from public tables and the auth.users table. Can only be called by the authenticated user to delete their own account.';
