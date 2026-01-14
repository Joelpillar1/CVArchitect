-- ==============================================================================
-- SUBSCRIPTION SCHEMA UPDATE FOR "CAREER SPRINT" & "CAREER MARATHON"
-- ==============================================================================

-- 1. Verify Subscriptions Table Structure
-- The active schema uses specific text values for the new plans.
-- Ensure your 'subscriptions' table has these columns:

-- TABLE public.subscriptions
--   id: uuid
--   user_id: uuid
--   plan_id: text  ('free' | 'week_pass' | 'pro_monthly')
--   credits: integer
--   billing_cycle: text ('monthly' | 'yearly' | 'lifetime')
--   subscription_start: timestamptz
--   subscription_end: timestamptz (Used for 7-day sprint expiration or monthly renewal date)
--   is_active: boolean

-- 2. Add validation constraint (Optional but recommended for data integrity)
-- This ensures no invalid plan IDs are inserted.
-- NOTE: Only run this if you don't have legacy plan data you need to preserve.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_plan_id') THEN
        ALTER TABLE public.subscriptions
        ADD CONSTRAINT valid_plan_id 
        CHECK (plan_id IN ('free', 'week_pass', 'pro_monthly', 'pro_quarterly', 'lifetime'));
    END IF;
END $$;

-- 3. Update the New User Trigger
-- This ensures new users start as "Free Guest" with limited credits (10).

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
  
  -- Create default subscription (Free Guest)
  -- Plan: 'free'
  -- Credits: 10 (Trial credits)
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
