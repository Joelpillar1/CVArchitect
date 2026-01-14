# Whop Webhook Integration - Phase 2 Setup Guide

## ✅ What We Just Created

### 1. Webhook Endpoint
**File**: `api/whop-webhook.ts`
- Handles payment success events from Whop
- Automatically grants user access after payment
- Handles subscription cancellations
- Deployed to: `https://cvarchitect.app/api/whop-webhook`

### 2. Database Migration
**File**: `supabase/migration_whop_integration.sql`
- Adds `whop_membership_id` column to track Whop memberships
- Adds `whop_payment_id` for transaction tracking
- Adds `payment_status` for subscription status

---

## 🚨 REQUIRED ACTIONS

### Step 1: Run Database Migration

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase/migration_whop_integration.sql`
4. Click **Run**

### Step 2: Add Environment Variables

You need to add these to **both** your `.env` file AND Vercel:

#### A. Local `.env` file:
```bash
# Add these new variables:
WHOP_WEBHOOK_SECRET=your_webhook_secret_from_whop
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

#### B. Vercel Environment Variables:
1. Go to https://vercel.com/dashboard
2. Select your `cvarchitect` project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value | Where to Get It |
|------|-------|-----------------|
| `WHOP_WEBHOOK_SECRET` | (from Whop Dashboard) | Whop → Settings → Developers → Webhook Secret |
| `SUPABASE_SERVICE_ROLE_KEY` | (from Supabase) | Supabase → Settings → API → service_role key (secret!) |
| `VITE_SUPABASE_URL` | (already set) | Should already exist |
| `VITE_SUPABASE_ANON_KEY` | (already set) | Should already exist |
| `VITE_WHOP_SPRINT_PLAN_ID` | `plan_Sr2CjRgtctFpD` | Already configured |
| `VITE_WHOP_MARATHON_PLAN_ID` | `plan_h4ga7XhsUpzx9` | Already configured |

### Step 3: Configure Webhook in Whop Dashboard

1. Go to your **Whop Dashboard**
2. Navigate to **Settings** → **Developers** → **Webhooks**
3. Click **Add Webhook** or **Create Webhook**
4. Enter webhook URL:
   ```
   https://cvarchitect.app/api/whop-webhook
   ```
5. Select events to listen for:
   - ✅ `membership.went_valid`
   - ✅ `membership.created`
   - ✅ `payment.succeeded`
   - ✅ `membership.went_invalid`
   - ✅ `membership.cancelled`
6. Save the webhook
7. **Copy the Webhook Secret** and add it to your environment variables

### Step 4: Deploy to Vercel

After adding environment variables:

```bash
# Commit your changes
git add .
git commit -m "Add Whop webhook integration"
git push

# Vercel will auto-deploy
```

Or manually deploy:
```bash
vercel --prod
```

---

## 🔍 How It Works

### Payment Flow:
```
1. User clicks "Start My 7-Day Sprint"
   ↓
2. Whop checkout opens
   ↓
3. User enters payment details
   ↓
4. Payment processed by Whop
   ↓
5. Whop sends webhook to: https://cvarchitect.app/api/whop-webhook
   ↓
6. Webhook handler:
   - Verifies signature
   - Finds user by email
   - Updates subscription in Supabase
   - Grants access (credits + plan)
   ↓
7. User automatically has premium access! 🎉
```

---

## 🧪 Testing

### Test the Webhook Locally (Optional):

1. Install ngrok: `npm install -g ngrok`
2. Run: `ngrok http 3000`
3. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
4. Temporarily update Whop webhook URL to: `https://abc123.ngrok.io/api/whop-webhook`
5. Make a test payment
6. Check your terminal for webhook logs

### Test in Production:

1. Make sure all environment variables are set in Vercel
2. Deploy to production
3. Use Whop's test mode to make a test payment
4. Check Vercel logs to see if webhook was received
5. Check Supabase to see if subscription was updated

---

## 📋 Checklist

Before going live:

- [ ] Database migration run in Supabase
- [ ] `WHOP_WEBHOOK_SECRET` added to Vercel
- [ ] `SUPABASE_SERVICE_ROLE_KEY` added to Vercel
- [ ] All Vite env vars added to Vercel
- [ ] Webhook URL configured in Whop Dashboard
- [ ] Code deployed to Vercel
- [ ] Test payment made successfully
- [ ] User access granted automatically

---

## 🔐 Security Notes

**IMPORTANT:**
- ✅ Never commit `SUPABASE_SERVICE_ROLE_KEY` to git (it's in .gitignore)
- ✅ Never commit `WHOP_WEBHOOK_SECRET` to git
- ✅ Always verify webhook signatures in production
- ✅ Use HTTPS only (Vercel provides this automatically)

---

## 🐛 Troubleshooting

### Webhook not receiving events:
- Check Vercel logs: `vercel logs`
- Verify webhook URL in Whop Dashboard
- Check that environment variables are set in Vercel

### User not getting access:
- Check Vercel function logs
- Verify user email matches Supabase auth email
- Check Supabase subscriptions table for updates

### Signature verification failing:
- Verify `WHOP_WEBHOOK_SECRET` is correct
- Check Whop documentation for signature format

---

## Next Steps

After completing this setup:
1. Test a payment in Whop test mode
2. Verify user gets access automatically
3. Test subscription cancellation
4. Add success/cancel redirect handling in your app

**Ready to configure the webhook in Whop Dashboard?** 🚀
