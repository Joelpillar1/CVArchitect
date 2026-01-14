# 🚀 Deployment Guide - 10 Credits Update

## Overview
This guide walks you through deploying the 10 credits update for free users.

---

## ✅ Pre-Deployment Checklist

### Code Changes (Already Complete)
- [x] Database schema updated
- [x] Pricing configuration updated
- [x] Landing page copy updated
- [x] Documentation updated
- [x] Migration script created

### Files Modified
- [x] `supabase/schema.sql`
- [x] `supabase/subscription_setup.sql`
- [x] `utils/pricingConfig.ts`
- [x] `components/LandingPage.tsx`
- [x] `SUBSCRIPTION_FIX.md`

### Files Created
- [x] `supabase/migration_10_credits.sql`
- [x] `FREE_CREDITS_UPDATE.md`
- [x] `FREE_CREDITS_IMPLEMENTATION.md`
- [x] `FREE_TIER_REFERENCE.md`
- [x] `DEPLOYMENT_GUIDE.md` (this file)

---

## 📋 Deployment Steps

### Step 1: Database Migration (REQUIRED)

#### Option A: Using Migration Script (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Select your project
   - Navigate to **SQL Editor**

2. **Run Migration Script**
   ```sql
   -- Copy and paste the entire contents of:
   -- supabase/migration_10_credits.sql
   ```

3. **Verify Changes**
   ```sql
   -- Check default value
   SELECT column_default 
   FROM information_schema.columns 
   WHERE table_name = 'subscriptions' 
     AND column_name = 'credits';
   -- Expected: 10
   
   -- Check trigger function
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_schema = 'public' 
     AND routine_name = 'handle_new_user';
   -- Should exist
   ```

#### Option B: Manual Update

If you prefer to update manually:

```sql
-- 1. Update default credits
ALTER TABLE public.subscriptions 
ALTER COLUMN credits SET DEFAULT 10;

-- 2. Update trigger function (see migration_10_credits.sql for full code)
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

---

### Step 2: Frontend Deployment

#### If Using Vercel/Netlify:

1. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: increase free tier credits from 3 to 10"
   git push origin main
   ```

2. **Automatic Deployment**
   - Vercel/Netlify will automatically deploy
   - Wait for build to complete
   - Verify deployment succeeded

#### If Using Manual Deployment:

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Deploy Build**
   - Upload `dist` folder to your hosting
   - Or follow your hosting provider's deployment process

3. **Restart Application**
   ```bash
   # If using PM2
   pm2 restart cv-architect
   
   # If using systemd
   sudo systemctl restart cv-architect
   ```

---

### Step 3: Verification

#### Test New User Signup

1. **Create Test Account**
   - Use a new email address
   - Complete signup process

2. **Verify Credits**
   - Go to Settings → Subscription
   - Should show **10 credits**

3. **Test AI Features**
   - Try AI rewrite (should work)
   - Check credit deduction (should go to 9)
   - Verify feature limits work correctly

#### Database Verification

```sql
-- Check recent signups
SELECT 
  user_id, 
  plan_id, 
  credits, 
  created_at
FROM public.subscriptions
WHERE plan_id = 'free'
ORDER BY created_at DESC
LIMIT 10;

-- All new users should have 10 credits
```

#### Application Verification

1. **Landing Page**
   - Check pricing section
   - Should say "10 complimentary AI credits"

2. **Settings Page**
   - New users should see 10 credits
   - Credit balance should display correctly

3. **AI Features**
   - Resume analyses should work 10 times
   - AI rewrites should work 10 times
   - Bullet optimizations should work 10 times

---

### Step 4: Optional - Grant Existing Users 10 Credits

⚠️ **Warning**: This will give ALL existing free users 10 credits, even if they've already used some.

```sql
-- Review first
SELECT 
  COUNT(*) as total_users,
  AVG(credits) as avg_credits,
  MIN(credits) as min_credits,
  MAX(credits) as max_credits
FROM public.subscriptions
WHERE plan_id = 'free';

-- If you want to proceed:
UPDATE public.subscriptions
SET credits = 10, updated_at = NOW()
WHERE plan_id = 'free' 
  AND credits < 10;

-- Verify
SELECT COUNT(*) as updated_users
FROM public.subscriptions
WHERE plan_id = 'free' 
  AND credits = 10;
```

---

## 🔍 Post-Deployment Monitoring

### Metrics to Watch

1. **User Activation**
   - Track new user signups
   - Monitor credit usage patterns
   - Check feature adoption rates

2. **AI Usage**
   ```sql
   -- AI feature usage by free users
   SELECT 
     action,
     COUNT(*) as usage_count,
     AVG(credits_cost) as avg_cost
   FROM public.usage_logs
   WHERE user_id IN (
     SELECT user_id 
     FROM public.subscriptions 
     WHERE plan_id = 'free'
   )
   GROUP BY action
   ORDER BY usage_count DESC;
   ```

3. **Conversion Rates**
   - Monitor upgrades from free to paid
   - Track time to upgrade
   - Analyze which features drive upgrades

### Error Monitoring

Check for:
- Failed AI requests
- Credit deduction errors
- Feature limit violations
- Database constraint errors

---

## 🐛 Troubleshooting

### Issue: New users still getting 3 credits

**Cause**: Database migration not applied

**Solution**:
1. Verify migration was run successfully
2. Check default value: `SELECT column_default FROM information_schema.columns WHERE table_name = 'subscriptions' AND column_name = 'credits';`
3. Re-run migration if needed

### Issue: Existing users complaining about low credits

**Cause**: Existing users still have old credit balance

**Solution**:
- Decide if you want to grant existing users 10 credits
- If yes, run the optional update query (see Step 4)
- If no, communicate that this is for new signups only

### Issue: AI features not working

**Cause**: Feature limits or credit system issue

**Solution**:
1. Check `pricingConfig.ts` was updated
2. Verify credit costs are correct
3. Check subscription service logic
4. Review browser console for errors

### Issue: Landing page still shows 3 credits

**Cause**: Frontend not deployed or cached

**Solution**:
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R)
3. Verify deployment succeeded
4. Check `LandingPage.tsx` line 986

---

## 📊 Success Criteria

### Deployment is successful when:

- [x] New users receive 10 credits upon signup
- [x] Database default is set to 10
- [x] Trigger function allocates 10 credits
- [x] Landing page shows "10 complimentary AI credits"
- [x] Settings page displays correct credit balance
- [x] AI features work up to the new limits
- [x] No errors in application logs
- [x] No errors in database logs

---

## 🎉 Rollback Plan

If you need to rollback:

### Database Rollback

```sql
-- Revert to 3 credits
ALTER TABLE public.subscriptions 
ALTER COLUMN credits SET DEFAULT 3;

-- Update trigger function back to 3 credits
-- (Use the old version from git history)
```

### Frontend Rollback

```bash
# Revert git commit
git revert HEAD
git push origin main

# Or checkout previous version
git checkout <previous-commit-hash>
git push origin main --force
```

---

## 📞 Support

If you encounter issues:

1. **Check Logs**
   - Supabase Dashboard → Logs
   - Browser Console (F12)
   - Server logs (if applicable)

2. **Review Documentation**
   - `FREE_CREDITS_IMPLEMENTATION.md`
   - `FREE_TIER_REFERENCE.md`
   - `ACCOUNT_DELETION_SETUP.md`

3. **Database Queries**
   - Use verification queries above
   - Check for constraint violations
   - Review RLS policies

---

## 📝 Deployment Checklist

Print this and check off as you go:

- [ ] Backup database (recommended)
- [ ] Run migration script in Supabase
- [ ] Verify database changes
- [ ] Deploy frontend changes
- [ ] Test new user signup
- [ ] Verify credit allocation
- [ ] Test AI features
- [ ] Check landing page copy
- [ ] Monitor for errors
- [ ] Update team/stakeholders
- [ ] Document any issues
- [ ] Celebrate! 🎉

---

**Deployment Date**: _________________  
**Deployed By**: _________________  
**Status**: _________________  
**Notes**: _________________

---

**Version**: 1.0  
**Last Updated**: January 13, 2026
