# Whop Webhook URL Configuration

## Your Webhook URL:

```
https://cvarchitect.app/api/whop-webhook
```

---

## Where to Add This in Whop Dashboard:

1. **Login to Whop Dashboard**: https://whop.com/dashboard
2. **Navigate to**: Settings → Developers → Webhooks
3. **Click**: "Add Webhook" or "Create Webhook"
4. **Enter URL**: `https://cvarchitect.app/api/whop-webhook`
5. **Select Events**:
   - ✅ `membership.went_valid`
   - ✅ `membership.created`  
   - ✅ `payment.succeeded`
   - ✅ `membership.went_invalid`
   - ✅ `membership.cancelled`
6. **Save** the webhook
7. **Copy the Webhook Secret** (you'll need this for environment variables)

---

## Important Notes:

⚠️ **Before adding the webhook URL**, you need to:

1. ✅ Run the database migration in Supabase
2. ✅ Add environment variables to Vercel
3. ✅ Deploy the webhook code to Vercel

Otherwise, the webhook will fail when Whop tries to send events!

---

## What Happens When You Add the Webhook:

- Whop will send a test event to verify the URL is working
- If your endpoint isn't deployed yet, this will fail
- You can always update/retry the webhook later

---

## Recommended Order:

1. **First**: Run database migration (see `WHOP_PHASE2_SETUP.md`)
2. **Second**: Add environment variables to Vercel
3. **Third**: Deploy code to Vercel
4. **Fourth**: Add webhook URL in Whop Dashboard
5. **Finally**: Test with a payment

---

See `WHOP_PHASE2_SETUP.md` for complete setup instructions! 📋
