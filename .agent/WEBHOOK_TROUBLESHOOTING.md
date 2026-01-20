# Whop Webhook Not Activating Subscription - Troubleshooting

**Issue:** Payment completed but subscription not activated
**Date:** January 19, 2026

---

## 🔍 **What's Happening**

You completed the payment on Whop, but when you log back in, your account still shows as "free" instead of "Career Sprint" subscriber.

**This means:** The Whop webhook is NOT reaching your server or is failing to update the database.

---

## 🚨 **Root Cause**

The webhook needs to:
1. Receive the `membership_activated` event from Whop
2. Find your user by email
3. Update the `subscriptions` table with the new plan

**Possible Issues:**
- ❌ Webhook URL not registered correctly in Whop
- ❌ Webhook events not selected in Whop
- ❌ Webhook failing due to missing environment variables on Vercel
- ❌ User email mismatch between Whop and Supabase

---

## ✅ **Immediate Fix: Manual Activation**

While we debug the webhook, let's manually activate your subscription in Supabase:

### **Step 1: Go to Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select your project: `lxtvqfqldhdpbuvxvdjj`
3. Click "Table Editor" → `subscriptions`

### **Step 2: Find Your User**
1. Look for your user's subscription row
2. Or use SQL Editor with this query:
```sql
SELECT * FROM subscriptions 
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'your-email@example.com'
);
```

### **Step 3: Update Subscription**
Click "Edit" on your row and update:
```
plan_id: week_pass
credits: 999999
is_active: true
subscription_start: (today's date)
subscription_end: (today + 7 days)
```

Or use SQL:
```sql
UPDATE subscriptions
SET 
  plan_id = 'week_pass',
  credits = 999999,
  is_active = true,
  subscription_start = NOW(),
  subscription_end = NOW() + INTERVAL '7 days',
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'your-email@example.com'
);
```

---

## 🔧 **Debugging the Webhook**

### **1. Check Webhook Registration in Whop**

Go to: https://whop.com/dashboard/developer → Webhooks

**Verify:**
- ✅ Webhook URL: `https://cvarchitect.app/api/webhooks/whop`
- ✅ Events selected:
  - `membership_activated`
  - `membership_deactivated`
  - `payment_succeeded`
- ✅ Webhook is "Active" (not paused)

### **2. Check Webhook Delivery Logs**

In Whop Dashboard → Webhooks → Your Webhook:
- Click "Recent Deliveries" or "Logs"
- Look for the `membership_activated` event
- Check the response:
  - **200 OK** = Webhook received successfully
  - **404** = Wrong URL
  - **500** = Server error (check Vercel logs)
  - **No delivery** = Webhook not triggered

### **3. Check Vercel Environment Variables**

Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables

**Required Variables:**
```
VITE_SUPABASE_URL=https://lxtvqfqldhdpbuvxvdjj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=(your service role key)
NEXT_PUBLIC_WHOP_APP_ID=app_BI7I2Me3bsDWSO
NEXT_PUBLIC_WHOP_SPRINT_PLAN_ID=plan_DTNT5Oh5vIuPN
NEXT_PUBLIC_WHOP_MARATHON_PLAN_ID=plan_h4ga7XhsUpzx9
WHOP_WEBHOOK_SECRET=ws_da95787b575c3d61268398b29017f8fb50f32da4f969f76c6da4713256873f92
```

**If any are missing:** Add them and redeploy

### **4. Check Vercel Function Logs**

Go to: https://vercel.com/dashboard → Your Project → Logs

Filter by: `/api/webhooks/whop`

Look for:
- Incoming webhook requests
- Any errors in the logs
- User email resolution
- Database update success/failure

### **5. Test Webhook Manually**

You can test the webhook endpoint:

```bash
# Test if endpoint is accessible (should return "Method not allowed")
curl https://cvarchitect.app/api/webhooks/whop

# Send a test webhook (replace with your data)
curl -X POST https://cvarchitect.app/api/webhooks/whop \
  -H "Content-Type: application/json" \
  -d '{
    "action": "membership_activated",
    "data": {
      "id": "mem_test123",
      "user_id": "user_test",
      "plan_id": "plan_DTNT5Oh5vIuPN",
      "email": "your-email@example.com",
      "valid": true,
      "expiration_date": null
    }
  }'
```

---

## 🐛 **Common Issues**

### **Issue 1: Email Mismatch**
**Symptom:** Webhook logs show "User with email X not found"
**Cause:** Email in Whop doesn't match email in Supabase Auth
**Fix:** 
- Check what email Whop has for your purchase
- Check what email you used to sign up in your app
- They must match exactly

### **Issue 2: Webhook URL Wrong**
**Symptom:** 404 errors in Whop delivery logs
**Cause:** Webhook URL is incorrect
**Fix:** Update to `https://cvarchitect.app/api/webhooks/whop`

### **Issue 3: Missing Environment Variables**
**Symptom:** 500 errors in Vercel logs
**Cause:** `SUPABASE_SERVICE_ROLE_KEY` or other vars missing
**Fix:** Add all environment variables to Vercel and redeploy

### **Issue 4: Webhook Not Triggered**
**Symptom:** No delivery logs in Whop
**Cause:** Events not selected or webhook disabled
**Fix:** Enable webhook and select `membership_activated` event

---

## 📋 **Checklist**

- [ ] Manually activate subscription in Supabase (temporary fix)
- [ ] Check webhook URL in Whop dashboard
- [ ] Verify events are selected (`membership_activated`, etc.)
- [ ] Check Whop delivery logs for errors
- [ ] Verify all environment variables in Vercel
- [ ] Check Vercel function logs for webhook requests
- [ ] Test webhook endpoint manually
- [ ] Verify email matches between Whop and Supabase

---

## 🎯 **Next Steps**

1. **Immediate:** Manually activate your subscription in Supabase (instructions above)
2. **Debug:** Check Whop webhook delivery logs
3. **Fix:** Based on what you find in the logs
4. **Test:** Make another test purchase to verify webhook works

---

## 💡 **Quick Manual Activation SQL**

Replace `your-email@example.com` with your actual email:

```sql
-- Activate Career Sprint subscription
UPDATE subscriptions
SET 
  plan_id = 'week_pass',
  credits = 999999,
  is_active = true,
  subscription_start = NOW(),
  subscription_end = NOW() + INTERVAL '7 days',
  whop_membership_id = 'manual_activation',
  whop_plan_id = 'plan_DTNT5Oh5vIuPN',
  updated_at = NOW()
WHERE user_id = (
  SELECT id FROM auth.users 
  WHERE email = 'your-email@example.com'
);

-- Verify it worked
SELECT 
  u.email,
  s.plan_id,
  s.credits,
  s.is_active,
  s.subscription_start,
  s.subscription_end
FROM subscriptions s
JOIN auth.users u ON s.user_id = u.id
WHERE u.email = 'your-email@example.com';
```

---

**Status:** 🟡 Payment successful, but webhook not activating subscription. Manual activation needed.
