# Whop Webhook - Correct Event Configuration

**Updated:** January 19, 2026

---

## ✅ **Correct Whop Events to Subscribe To**

Based on the actual Whop webhook events, select these in your Whop dashboard:

### **Required Events:**

1. **`membership_activated`** 🔴 CRITICAL
   - Fired when a user's membership becomes active
   - This is when we grant them access

2. **`membership_deactivated`** 🔴 CRITICAL
   - Fired when a user's membership ends or is cancelled
   - This is when we revoke access and revert to free plan

3. **`payment_succeeded`** 🟡 RECOMMENDED
   - Fired when a payment completes successfully
   - Backup event to ensure subscription is activated

### **Optional Events (for logging/analytics):**

4. **`payment_failed`** 🟢 OPTIONAL
   - Track failed payments
   - Could be used to notify users

5. **`refund_created`** 🟢 OPTIONAL
   - Track refunds
   - Could trigger automatic downgrade

---

## 🔧 **Webhook Configuration**

**Webhook URL:**
```
https://cvarchitect.app/api/webhooks/whop
```

**Events to Select:**
- ✅ `membership_activated`
- ✅ `membership_deactivated`
- ✅ `payment_succeeded` (recommended)

**Optional:**
- ⚪ `payment_failed`
- ⚪ `refund_created`

---

## 📊 **Event Flow**

### **User Purchases Subscription:**
```
1. User completes checkout on Whop
2. Whop processes payment
3. Whop sends: payment_succeeded
4. Whop sends: membership_activated
5. Your webhook receives events
6. Database updated: plan_id = 'week_pass' or 'pro_monthly'
7. User has access!
```

### **Subscription Expires/Cancelled:**
```
1. Subscription period ends OR user cancels
2. Whop sends: membership_deactivated
3. Your webhook receives event
4. Database updated: plan_id = 'free', is_active = false
5. User reverted to free tier
```

---

## 🧪 **Testing**

After configuring the webhook with these events:

1. **Send Test Event** from Whop dashboard
2. **Check Vercel Logs** to see if event was received
3. **Make Test Purchase** in Whop test mode
4. **Verify Database** - check if subscription was updated

---

## ✅ **Updated Webhook Handler**

The webhook handler has been updated to handle these correct event names:
- ✅ `membership_activated` → Activates subscription
- ✅ `payment_succeeded` → Activates subscription (backup)
- ✅ `membership_deactivated` → Deactivates subscription

---

**Status:** Ready to test with correct event names! 🚀
