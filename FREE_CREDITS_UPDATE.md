# Free User Credits Update - Summary

## Overview
Updated the free user credit allocation from **3 credits** to **10 credits** upon signup.

## Changes Made

### 1. Database Schema (`supabase/schema.sql`)
- **Line 56**: Updated default credits from 3 to 10
  ```sql
  credits integer NOT NULL DEFAULT 10,
  ```
- **Lines 251-263**: Updated the `handle_new_user()` trigger function
  - Changed comment from "Free plan with 3 credits" to "Free plan with 10 credits"
  - Changed credits value from 3 to 10

### 2. Pricing Configuration (`utils/pricingConfig.ts`)
- **Line 32**: Updated `startingCredits` for free plan from 3 to 10
  ```typescript
  startingCredits: 10,
  ```

### 3. Subscription Setup (`supabase/subscription_setup.sql`)
- **Line 33**: Updated comment from "limited credits (3)" to "limited credits (10)"
- **Line 53**: Updated comment from "Credits: 3" to "Credits: 10"
- **Line 65**: Updated credits value from 3 to 10

### 4. Documentation (`SUBSCRIPTION_FIX.md`)
- **Line 135**: Updated testing steps to reflect 10 credits instead of 3

## Impact

### For New Users
- ✅ New signups will receive **10 credits** instead of 3
- ✅ More credits to explore the platform features
- ✅ Better onboarding experience

### For Existing Users
- ⚠️ Existing free users will keep their current credit balance
- ⚠️ Only NEW signups after deploying this change will get 10 credits

## Deployment Steps

### 1. Update Database (REQUIRED)
You need to run the updated schema in Supabase to apply the changes:

**Option A: For New Deployments**
1. Open Supabase Dashboard → SQL Editor
2. Copy the entire contents of `supabase/schema.sql`
3. Run the script (this will recreate all tables with the new default)

**Option B: For Existing Deployments (Recommended)**
1. Open Supabase Dashboard → SQL Editor
2. Run this SQL to update the default and trigger:

```sql
-- Update the default credits for new subscriptions
ALTER TABLE public.subscriptions 
ALTER COLUMN credits SET DEFAULT 10;

-- Update the trigger function
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
```

### 2. Deploy Frontend Changes
The frontend changes are already applied in the codebase:
- `utils/pricingConfig.ts` now shows 10 starting credits for free plan
- No code changes needed, just deploy/restart the app

## Testing

1. **Create a new test account**
2. **Check Supabase** → Table Editor → subscriptions
   - Should see `plan_id: 'free'`, `credits: 10`
3. **Verify in app**
   - Go to Settings → Subscription
   - Should show 10 credits

## Optional: Grant Existing Free Users 10 Credits

If you want to give existing free users the additional credits:

```sql
-- Give existing free users 10 credits (one-time update)
UPDATE public.subscriptions
SET credits = 10, updated_at = NOW()
WHERE plan_id = 'free' 
  AND credits < 10;
```

⚠️ **Warning**: This will give ALL existing free users 10 credits, even if they've already used some. Review your user base before running this.

## Files Modified

1. ✅ `supabase/schema.sql`
2. ✅ `utils/pricingConfig.ts`
3. ✅ `supabase/subscription_setup.sql`
4. ✅ `SUBSCRIPTION_FIX.md`

## Rationale

**Why 10 credits instead of 3?**
- Allows users to upload a resume (1 credit)
- Try AI rewrites (1 credit each)
- Generate job matches (1 credit)
- Optimize bullets (1 credit each)
- Better showcase the platform's capabilities
- Improved user onboarding and retention

## Summary

✅ Free users now get **10 credits** upon signup (up from 3)
✅ All code and database changes completed
⚠️ Database deployment required to take effect
✅ Better user experience and onboarding
