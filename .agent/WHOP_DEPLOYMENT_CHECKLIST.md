# Whop Integration - Deployment Checklist

**Date:** January 19, 2026  
**Status:** 🟡 Almost Complete - Webhook URL needs fixing

---

## ✅ **Completed Steps**

1. ✅ Database migration applied successfully
2. ✅ Deployed to Vercel at `cvarchitect.app`
3. ✅ Webhook registered in Whop dashboard
4. ✅ `@vercel/node` installed
5. ✅ `vercel.json` configured

---

## 🔧 **Issues to Fix**

### 1. **Webhook URL Mismatch** 🔴 CRITICAL

**Current Whop webhook URL:**
```
https://cvarchitect.app/api/whop-webhook
```

**Should be:**
```
https://cvarchitect.app/api/webhooks/whop
```

**Action:** Go to Whop Dashboard → Webhooks → Edit webhook → Change URL

---

### 2. **Vercel Environment Variables** 🟡 IMPORTANT

Your webhook handler needs these environment variables to work on Vercel. Make sure they're set in **Vercel Dashboard → Project Settings → Environment Variables**:

**Required Variables:**
```
VITE_SUPABASE_URL=https://lxtvqfqldhdpbuvxvdjj.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_WHOP_APP_ID=app_BI7I2Me3bsDWSO
NEXT_PUBLIC_WHOP_SPRINT_PLAN_ID=plan_DTNT5Oh5vIuPN
NEXT_PUBLIC_WHOP_MARATHON_PLAN_ID=plan_h4ga7XhsUpzx9
WHOP_WEBHOOK_SECRET=ws_da95787b575c3d61268398b29017f8fb50f32da4f969f76c6da4713256873f92
```

**How to Add:**
1. Go to https://vercel.com/dashboard
2. Select your `cvarchitect` project
3. Go to Settings → Environment Variables
4. Add each variable above
5. Set scope to "Production, Preview, and Development"
6. Click "Save"
7. **Redeploy** your app for changes to take effect

---

## 🧪 **Testing the Webhook**

### **Option 1: Test with Whop Dashboard**
1. Go to Whop Dashboard → Webhooks
2. Find your webhook
3. Click "Test" or "Send Test Event"
4. Check if it receives successfully

### **Option 2: Make a Test Purchase**
1. Go to your Whop checkout page
2. Use Whop test mode to make a test purchase
3. Check Vercel logs to see if webhook was received
4. Check Supabase database to see if subscription was updated

### **Option 3: Check Vercel Logs**
1. Go to Vercel Dashboard → Your Project → Logs
2. Filter by `/api/webhooks/whop`
3. Look for incoming webhook requests
4. Check for any errors

---

## 🔍 **Debugging Webhook Issues**

If webhooks aren't working, check:

### **1. Webhook URL is Correct**
```
https://cvarchitect.app/api/webhooks/whop
```

### **2. Environment Variables are Set in Vercel**
- All variables listed above are present
- No typos in variable names
- Values are correct (no extra spaces)

### **3. Check Vercel Function Logs**
```bash
# View logs in real-time
vercel logs --follow
```

### **4. Test Webhook Endpoint Manually**
```bash
# Test if endpoint is accessible
curl https://cvarchitect.app/api/webhooks/whop
```

Should return: `{"error":"Method not allowed"}` (because it expects POST)

### **5. Check Whop Webhook Delivery Logs**
- Go to Whop Dashboard → Webhooks
- Click on your webhook
- Check "Recent Deliveries" or "Logs"
- Look for failed deliveries and error messages

---

## 📊 **Expected Webhook Flow**

### **When User Purchases:**
1. User completes payment on Whop checkout
2. Whop sends `membership.went_valid` or `membership.created` webhook to your endpoint
3. Your webhook handler (`api/webhooks/whop.ts`) receives the event
4. Handler extracts user email from webhook payload
5. Handler finds user in Supabase by email
6. Handler updates `subscriptions` table with:
   - `whop_membership_id`
   - `whop_plan_id`
   - `plan_id` (internal: `week_pass` or `pro_monthly`)
   - `is_active: true`
7. User's subscription is now active!

### **When Subscription Expires:**
1. Whop sends `membership.expired` or `membership.went_invalid` webhook
2. Handler finds subscription by `whop_membership_id`
3. Handler updates subscription to:
   - `plan_id: 'free'`
   - `is_active: false`
4. User reverted to free plan

---

## ✅ **Final Checklist**

- [ ] Webhook URL updated in Whop to `https://cvarchitect.app/api/webhooks/whop`
- [ ] All environment variables added to Vercel
- [ ] App redeployed after adding environment variables
- [ ] Webhook test sent from Whop dashboard
- [ ] Test purchase made (in test mode)
- [ ] Database checked for subscription update
- [ ] Vercel logs checked for webhook receipt
- [ ] No errors in Vercel function logs

---

## 🎯 **Next Steps**

1. **Fix webhook URL in Whop** (30 seconds)
2. **Verify environment variables in Vercel** (2 minutes)
3. **Redeploy if needed** (1 minute)
4. **Test webhook** (5 minutes)
5. **Make test purchase** (5 minutes)

**Total Time to Working System:** ~15 minutes

---

## 🆘 **Common Issues**

### **Issue: Webhook returns 500 error**
**Cause:** Missing environment variables  
**Fix:** Add all variables to Vercel and redeploy

### **Issue: Webhook returns 404**
**Cause:** Wrong URL path  
**Fix:** Use `/api/webhooks/whop` (plural)

### **Issue: Subscription not updating**
**Cause:** User email mismatch  
**Fix:** Ensure email in Whop matches email in Supabase Auth

### **Issue: "User not found" in logs**
**Cause:** Email from webhook doesn't match any Supabase user  
**Fix:** Check webhook payload structure, verify email field

---

**Status:** 🟡 Ready to test once webhook URL is fixed!
