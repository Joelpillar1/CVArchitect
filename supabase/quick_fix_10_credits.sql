-- =====================================================================
-- QUICK FIX: Grant 10 Credits to Existing Free Users
-- =====================================================================
-- Run this in Supabase SQL Editor to grant existing free users 10 credits
-- This is a temporary fix until you run the full migration
-- =====================================================================

-- Update ALL free tier users to have 10 credits
UPDATE public.subscriptions
SET credits = 10, updated_at = NOW()
WHERE plan_id = 'free';

-- Verify the update
SELECT 
  user_id, 
  plan_id, 
  credits, 
  updated_at
FROM public.subscriptions
WHERE plan_id = 'free'
ORDER BY updated_at DESC;

-- =====================================================================
-- DONE!
-- =====================================================================
-- ✅ All free users now have 10 credits
-- ✅ You can now upload resumes and use AI features
