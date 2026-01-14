-- =====================================================================
-- MIGRATION: Update Free User Credits from 3 to 10
-- =====================================================================
-- Run this in Supabase SQL Editor to update existing deployments
-- This is safe to run on production databases
-- =====================================================================

-- 1. Update the default credits for new subscriptions
ALTER TABLE public.subscriptions 
ALTER COLUMN credits SET DEFAULT 10;

-- 2. Update the trigger function to give new users 10 credits
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

-- =====================================================================
-- OPTIONAL: Grant existing free users 10 credits
-- =====================================================================
-- Uncomment the following lines if you want to give existing free users
-- the additional credits. This will update ALL free users to have 10 credits.
-- Review your user base before running this!
-- =====================================================================

-- UPDATE public.subscriptions
-- SET credits = 10, updated_at = NOW()
-- WHERE plan_id = 'free' 
--   AND credits < 10;

-- =====================================================================
-- VERIFICATION
-- =====================================================================
-- Run this to verify the changes:

-- Check the default value
SELECT column_default 
FROM information_schema.columns 
WHERE table_name = 'subscriptions' 
  AND column_name = 'credits';
-- Should return: 10

-- Check existing free users
SELECT user_id, plan_id, credits, created_at
FROM public.subscriptions
WHERE plan_id = 'free'
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================================
-- DONE!
-- =====================================================================
-- ✅ New users will now receive 10 credits upon signup
-- ✅ Trigger function updated
-- ✅ Default value updated
