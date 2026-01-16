# Whop Webhook - Final Setup Checklist

## ✅ Webhook is Ready!

The webhook code is already complete and should work. Here's what to verify:

---

## 🔑 **Step 1: Verify Vercel Environment Variables**

Make sure these are set in **Vercel Dashboard** → **Settings** → **Environment Variables**:

1. `VITE_SUPABASE_URL` = `https://lxtvqfqldhdpbuvxvdjj.supabase.co`
2. `SUPABASE_SERVICE_ROLE_KEY` = `your_service_role_key` (from Supabase Settings → API)
3. `WHOP_WEBHOOK_SECRET` = `your_webhook_secret` (from Whop Dashboard)
4. `WHOP_API_KEY` = `apik_JiGBUoMsFTOYJ_C4078624_C_d08efbf2f8cd79ca81d9389cebe944db6e73d7e1318f9759cd4c4645c9f770`

---

## 🎯 **Step 2: Configure Whop Webhook**

1. Go to **Whop Dashboard** → **Settings** → **Developers** → **Webhooks**
2. **Webhook URL**: `https://cvarchitect.app/api/whop-webhook`
3. **Events to subscribe to**:
   - ✅ `payment.created`
   - ✅ `payment.succeeded`
   - ✅ `membership.activated`
   - ✅ `membership.went_valid`
4. Click **Save**

---

## 🧪 **Step 3: Test the Webhook**

### **Option A: Use Whop's Test Feature**
1. In Whop Dashboard → Webhooks
2. Click "Send Test Event"
3. Choose `payment.created`
4. Check Vercel logs to see if it processed

### **Option B: Make a Real Test Payment**
1. Use a different email (e.g., `test@example.com`)
2. Sign up on your app with that email
3. Buy the free Sprint product on Whop with SAME email
4. Check if you get access automatically

---

## 📊 **Step 4: Monitor Webhook**

Check **Vercel Logs** to see webhook activity:

1. Go to **Vercel Dashboard** → **Your Project** → **Logs**
2. Filter by `/api/whop-webhook`
3. Look for:
   ```
   === WHOP WEBHOOK RECEIVED ===
   Membership ID: mem_xxx
   User Email: user@example.com
   ✅ Got email from Whop API: user@example.com
   Successfully granted access to user: xxx-xxx-xxx
   ```

---

## ✅ **Expected Flow:**

```
User pays on Whop
  ↓
Whop sends webhook to your server
  ↓
Webhook extracts email from event
  ↓
If no email → Calls Whop API to get it
  ↓
Finds user in Supabase by email
  ↓
Updates subscription with service role key
  ↓
User has premium access! ✅
```

---

## 🚨 **Troubleshooting:**

### **If webhook doesn't fire:**
- Check Whop Dashboard → Webhooks → Delivery History
- Verify URL is correct: `https://cvarchitect.app/api/whop-webhook`
- Make sure events are subscribed

### **If webhook fires but doesn't grant access:**
- Check Vercel logs for errors
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Make sure user exists in your app with same email

### **If "Could not find user":**
- User must sign up on YOUR app first
- Then pay on Whop with SAME email
- Or they can pay first, then sign up with same email

---

## 🎉 **Success Criteria:**

You'll know it's working when:
1. ✅ User pays on Whop
2. ✅ Vercel logs show "Successfully granted access"
3. ✅ User refreshes app and has 999,999 credits
4. ✅ No manual SQL needed!

---

## 📝 **Next Steps:**

1. **Verify environment variables in Vercel**
2. **Configure webhook URL in Whop**
3. **Make a test payment**
4. **Check Vercel logs**
5. **Celebrate when it works!** 🎊

---

**The webhook is ready - just needs proper configuration!** 🚀
