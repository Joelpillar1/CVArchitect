# Whop Integration Setup Guide

## Issue: Subscription Not Activating After Payment

When users complete payment on Whop, they're redirected back but don't get premium access because:
1. The webhook may not be receiving the user ID correctly
2. The redirect URL needs to be configured in Whop
3. The webhook needs to be properly set up

## ✅ Fixes Applied

### 1. **Added Redirect Handler in Dashboard** (`pages/Dashboard.tsx`)
- Detects when user returns from Whop with `?payment=success`
- Polls subscription service every 2 seconds (up to 10 attempts)
- Automatically refreshes subscription when activated
- Shows success toast when subscription is active

### 2. **Improved Webhook Handler** (`api/whop-webhook.ts`)
- Added extensive logging to debug webhook events
- Added fallback to find user by email if user_id not in metadata
- Checks multiple locations for user_id in event data
- Better error messages

### 3. **Updated Checkout Redirect** (`components/PricingModal.tsx`)
- Sets `redirect_url` parameter in Whop checkout
- Redirects back to `/dashboard?payment=success&plan={planId}`

## 🔧 Required Setup Steps

### Step 1: Configure Whop Webhook

1. Go to your Whop Dashboard → Settings → Webhooks
2. Add a new webhook:
   - **URL**: `https://your-domain.vercel.app/api/whop-webhook`
   - **Secret**: Your `WHOP_WEBHOOK_SECRET` value
   - **Events to subscribe**:
     - `membership_activated`
     - `payment_succeeded`
     - `invoice_paid`
     - `membership_deactivated`
     - `payment_failed`
     - `invoice_past_due`
     - `invoice_voided`

### Step 2: Configure Whop Checkout Redirect

In your Whop product settings, set the redirect URL to:
```
https://cvarchitect.app/dashboard?payment=success
```

Or configure it per product:
- **Career Sprint**: `https://cvarchitect.app/dashboard?payment=success&plan=week_pass`
- **Career Marathon**: `https://cvarchitect.app/dashboard?payment=success&plan=pro_monthly`

### Step 3: Verify Environment Variables in Vercel

Make sure these are set in Vercel:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `WHOP_WEBHOOK_SECRET`
- `WHOP_SPRINT_PRODUCT_ID`
- `WHOP_MARATHON_PRODUCT_ID`
- `VITE_WHOP_SPRINT_CHECKOUT_URL`
- `VITE_WHOP_MARATHON_CHECKOUT_URL`

### Step 4: Test the Flow

1. **Test Payment**:
   - Go to pricing modal
   - Select a plan
   - Complete payment on Whop
   - Should redirect back to `/dashboard?payment=success`

2. **Check Webhook**:
   - Check Vercel function logs: `https://vercel.com/dashboard` → Your Project → Functions → `api/whop-webhook`
   - Look for logs showing:
     - Event type received
     - Product ID extracted
     - User ID extracted
     - Subscription update result

3. **Verify Database**:
   - Check Supabase → `subscriptions` table
   - User's `plan_id` should be `week_pass` or `pro_monthly`
   - `credits` should be `999999`
   - `is_active` should be `true`

## 🐛 Debugging

### If subscription still doesn't activate:

1. **Check Vercel Function Logs**:
   ```
   - Go to Vercel Dashboard → Your Project → Functions
   - Click on `api/whop-webhook`
   - Check "Logs" tab
   - Look for errors or the detailed logs we added
   ```

2. **Check Webhook Payload**:
   - The webhook now logs the full event structure
   - Look for:
     - `Extracted productId: ...`
     - `Extracted supabaseUserId: ...`
     - `Event data structure: ...`

3. **Common Issues**:

   | Issue | Cause | Fix |
   |-------|-------|-----|
   | "Missing userId" | Metadata not passed correctly | Check Whop checkout URL includes `metadata[user_id]` |
   | "Unknown product ID" | Product ID mismatch | Verify `WHOP_SPRINT_PRODUCT_ID` matches Whop product ID |
   | Webhook not called | Webhook URL incorrect | Verify webhook URL in Whop dashboard |
   | Subscription not updating | Database error | Check Supabase logs and RLS policies |

4. **Manual Test**:
   - Use Whop's webhook testing tool (if available)
   - Or use a tool like `ngrok` to test locally
   - Send a test event to your webhook URL

## 📝 Notes

- The webhook now has a fallback to find users by email if `user_id` is not in metadata
- The Dashboard automatically polls for subscription updates when user returns from Whop
- If webhook is slow, user will see a message to refresh the page

## ✅ Expected Flow

1. User clicks plan → Redirects to Whop checkout
2. User completes payment → Whop sends webhook to your server
3. Webhook updates Supabase subscription
4. Whop redirects user back to `/dashboard?payment=success`
5. Dashboard detects redirect and polls for subscription
6. Subscription found → User gets premium access! 🎉
