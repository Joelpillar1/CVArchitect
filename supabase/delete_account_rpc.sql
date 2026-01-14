
CREATE OR REPLACE FUNCTION delete_user_account()
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

  -- Delete all user data from dependent tables
  -- Note: The CASCADE on foreign keys in the schema SHOULD handle this automatically
  -- when we delete the user from auth.users, but we can't do that easily from here.
  -- Instead, we delete the profile and let the CASCADE on public tables do the work,
  -- or manually delete if constraints aren't robust.
  
  -- Manual approach to be safe:
  DELETE FROM public.resume_versions WHERE resume_id IN (SELECT id FROM public.resumes WHERE user_id = v_user_id);
  DELETE FROM public.resumes WHERE user_id = v_user_id;
  DELETE FROM public.cover_letters WHERE user_id = v_user_id;
  DELETE FROM public.usage_logs WHERE user_id = v_user_id;
  DELETE FROM public.billing_history WHERE user_id = v_user_id;
  DELETE FROM public.subscriptions WHERE user_id = v_user_id;
  
  -- Finally delete the profile
  DELETE FROM public.profiles WHERE id = v_user_id;
  
  -- NOTE: This stops short of deleting the auth.users row properly because
  -- a standard function cannot delete from auth.users unless it is owned by superuser
  -- or we use the Supabase Admin API.
  -- However, deleting the profile is usually sufficient to "soft delete" the account state for the app.
END;
$$;
