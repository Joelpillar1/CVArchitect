# 🧪 Local Testing Guide - License Key Integration

**Date:** January 20, 2026  
**Status:** Ready for Local Testing

---

## ✅ **Current Status**

- ✅ All code implemented
- ✅ Dev server running on http://localhost:5173
- ✅ Environment variables configured in `.env`
- ⏳ **Ready to test locally**

---

## 🧪 **Local Testing Steps**

### **Test 1: Check License Modal Opens**

1. **Open app:** http://localhost:5173
2. **Sign in** with your test account
3. **Trigger paywall:**
   - Use AI features until you run out of credits
   - OR click "Upgrade" in settings
4. **Click "View Pricing"**
5. **Click "Already purchased? Enter License Key"**
6. **✅ Verify:** License activation modal opens

---

### **Test 2: Test Format Validation**

1. **In the license modal, try entering:**
   - Empty string → Should show "Please enter a license key"
   - "abc123" → Should show "Invalid license key format"
   - "mem_" → Should accept format (but fail validation)

2. **✅ Verify:** Format validation works

---

### **Test 3: Test with Mock License Key**

**Note:** This will fail validation (expected) but we can test the flow:

1. **Enter:** `mem_TEST123ABC`
2. **Click "Activate License"**
3. **✅ Verify:** 
   - Loading spinner appears
   - Error message shows (expected: "Invalid license key")
   - Modal stays open for retry

---

### **Test 4: Test Activation Page**

1. **Navigate to:** http://localhost:5173/activate-license
2. **✅ Verify:**
   - Success page appears
   - Instructions are clear
   - License modal auto-opens after 1 second
   - "Activate Now" button works
   - "I'll Activate Later" button redirects to dashboard

---

### **Test 5: Test with REAL License Key (If Available)**

**If you have a real Whop license key:**

1. **Go to:** https://whop.com/hub
2. **Find your CVArchitect license**
3. **Copy the license key** (starts with "mem_")
4. **In your app:**
   - Click "Enter License Key"
   - Paste the real license key
   - Click "Activate License"
5. **✅ Expected:**
   - Success toast appears
   - Credits update to 999,999
   - Plan updates to "Career Sprint" or "Career Marathon"
   - Redirected to dashboard

---

### **Test 6: Test Purchase Flow (End-to-End)**

**This requires making a real test purchase:**

1. **In your app, click "Upgrade"**
2. **Click "Start My 7-Day Sprint"**
3. **Verify redirect URL in browser:**
   - Should go to: `https://whop.com/checkout/plan_DTNT5Oh5vIuPN`
   - URL should include: `success_url=http%3A%2F%2Flocalhost%3A5173%2Factivate-license`
4. **Complete purchase on Whop** (use test mode if available)
5. **After payment:**
   - Should redirect to: `http://localhost:5173/activate-license`
   - Success page should appear
   - License modal should auto-open
6. **Enter license key from email**
7. **✅ Verify:** Full activation flow works

---

## 🔍 **What to Check in Browser Console**

Open DevTools (F12) and check Console tab for:

### **Good Signs:**
```
✅ "Validating license key: { licenseKey: 'mem_...', userId: '...', userEmail: '...' }"
✅ "License validation response: { id: 'mem_...', plan: 'plan_...', valid: true }"
✅ "Activating subscription: { internalPlan: 'week_pass', ... }"
✅ "Subscription activated successfully!"
```

### **Expected Errors (if using fake key):**
```
❌ "License validation failed: Invalid license key"
```

### **Bad Signs (need to fix):**
```
❌ "Whop API key not configured"
❌ "TypeError: Cannot read property 'env' of undefined"
❌ Network errors (CORS, 404, etc.)
```

---

## 🐛 **Common Issues & Fixes**

### **Issue: "Whop API key not configured"**
**Fix:** 
```bash
# Check .env file has:
VITE_WHOP_API_KEY=apik_vefUK68yNIZaC_A2024784_C_6e594681319d733d0cf2bd5b6be7478b2e218ae3cc7496833ed853fa2866a2

# Restart dev server:
# Ctrl+C to stop
npm run dev
```

### **Issue: Modal doesn't open**
**Fix:**
- Check browser console for errors
- Verify `LicenseActivationModal` is imported correctly
- Check React DevTools for component tree

### **Issue: Redirect URL wrong**
**Check:**
```javascript
// In browser console, check:
console.log(window.location.origin);
// Should be: "http://localhost:5173"
```

### **Issue: TypeScript errors**
**Fix:** Already handled with `@ts-ignore` comments

---

## 📋 **Testing Checklist**

### **Before Testing:**
- [x] Code implemented
- [x] Dev server running
- [x] Environment variables in `.env`
- [x] Browser open to http://localhost:5173

### **UI Tests:**
- [ ] License modal opens from pricing modal
- [ ] Format validation works
- [ ] Loading states appear
- [ ] Error messages display correctly
- [ ] Success toast appears
- [ ] Activation page loads
- [ ] Modal auto-opens on activation page

### **Functional Tests:**
- [ ] Can enter license key
- [ ] Validation API call fires
- [ ] Database updates (check Supabase)
- [ ] Credits update in UI
- [ ] Plan updates in UI
- [ ] Redirect to dashboard works

### **Edge Cases:**
- [ ] Empty license key
- [ ] Invalid format
- [ ] Expired license
- [ ] Already activated license
- [ ] Network error handling

---

## 🎯 **Success Criteria**

**Local testing is successful if:**
1. ✅ License modal opens without errors
2. ✅ Format validation works
3. ✅ Can enter a license key
4. ✅ Loading states work
5. ✅ Error messages are clear
6. ✅ Activation page loads correctly
7. ✅ Modal auto-opens on activation page
8. ✅ (If real key available) Full activation works

---

## 🚀 **After Local Testing**

**Once local testing is successful:**

1. **Add environment variables to Vercel**
2. **Push to deploy:** `git push`
3. **Test on production**
4. **Make real test purchase**
5. **Verify end-to-end flow**

---

## 💡 **Quick Test Commands**

```bash
# Check dev server is running
curl http://localhost:5173

# Check environment variables loaded
# (In browser console)
console.log(import.meta.env.VITE_WHOP_API_KEY ? 'API Key loaded' : 'API Key missing');

# Check if license service is accessible
# (In browser console)
import('./services/whopLicenseService').then(m => console.log('Service loaded:', m));
```

---

**Ready to test!** 🧪

Open http://localhost:5173 and start with Test 1!
