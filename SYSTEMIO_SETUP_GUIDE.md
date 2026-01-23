# System.io Email Marketing Integration Setup Guide

This guide will help you set up automated email follow-ups for new user signups using System.io.

---

## 📋 Prerequisites

1. **System.io Account** - Sign up at https://system.io
2. **System.io API Key** - Get from System.io dashboard
3. **System.io List/Sequence ID** - The ID of your email list or automation sequence
4. **Supabase Project** - Your CV Architect Supabase project

---

## 🚀 Step-by-Step Setup

### Step 1: Get System.io API Credentials

1. **Log into System.io**
   - Go to https://system.io and sign in

2. **Get API Key**
   - Navigate to **Settings** → **API** (or **Integrations** → **API**)
   - Generate a new API key or copy existing one
   - Save this key - you'll need it in Step 3

3. **Get List/Sequence ID**
   - Go to your **Lists** or **Automations** section
   - Create a new list/sequence for "New Signups" (or use existing)
   - Copy the **List ID** or **Sequence ID** from the URL or settings
   - Example URL: `https://system.io/lists/12345` → ID is `12345`

---

### Step 2: Deploy Supabase Edge Function

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your CV Architect project

2. **Navigate to Edge Functions**
   - Click **Edge Functions** in the left sidebar
   - Click **+ New Function**

3. **Create Function**
   - **Function name:** `systemio-subscribe`
   - **Template:** Start from scratch (or use Deno template)

4. **Copy Function Code**
   - Open the file: `supabase/functions/systemio-subscribe/index.ts`
   - Copy all the code
   - Paste into the Edge Function editor

5. **Deploy Function**
   - Click **Deploy** button
   - Wait for deployment to complete

---

### Step 3: Configure Environment Variables

1. **In Supabase Dashboard**
   - Go to **Project Settings** → **Edge Functions** → **Secrets**

2. **Add Secrets**
   - Click **Add new secret**
   - Add these secrets:

   ```
   Name: SYSTEMIO_API_KEY
   Value: [Your System.io API key from Step 1]
   ```

   ```
   Name: SYSTEMIO_LIST_ID
   Value: [Your System.io List/Sequence ID from Step 1]
   ```

3. **Save Secrets**
   - Click **Save** for each secret

---

### Step 4: Update Database Trigger

1. **Open SQL Editor**
   - In Supabase Dashboard, click **SQL Editor**
   - Click **+ New Query**

2. **Get Your Project Reference**
   - Go to **Project Settings** → **General**
   - Copy your **Project Reference** (e.g., `abcdefghijklmnop`)

3. **Update SQL Script**
   - Open the file: `supabase/systemio_integration.sql`
   - Find this line:
     ```sql
     edge_function_url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/systemio-subscribe';
     ```
   - Replace `YOUR_PROJECT_REF` with your actual project reference
   - Example: `https://abcdefghijklmnop.supabase.co/functions/v1/systemio-subscribe`

4. **Run SQL Script**
   - Copy the entire content of `systemio_integration.sql`
   - Paste into SQL Editor
   - Click **Run** (or press Ctrl+Enter)

5. **Verify Trigger**
   - Go to **Database** → **Triggers**
   - You should see `on_auth_user_created` trigger on `auth.users` table

---

### Step 5: Set Up Email Sequence in System.io

1. **Create Welcome Email Sequence**
   - In System.io, go to **Automations** or **Sequences**
   - Create a new automation/sequence named "New User Welcome"

2. **Set Up Email Flow**
   - **Day 0 (Immediate):** Welcome email
   - **Day 2:** Tips for using CV Architect
   - **Day 5:** Advanced features guide
   - **Day 7:** Success stories/testimonials
   - (Add more as needed)

3. **Configure Trigger**
   - Set trigger to: "When subscriber is added to list"
   - Select your list from Step 1

4. **Design Emails**
   - Create engaging, helpful emails
   - Include links back to your app
   - Personalize with subscriber's name

---

### Step 6: Test the Integration

1. **Create Test Account**
   - Go to your app's signup page
   - Create a new account with a test email

2. **Check System.io**
   - Log into System.io
   - Go to **Subscribers** or **Contacts**
   - You should see the new subscriber appear within a few seconds

3. **Verify Email Sequence**
   - Check that the welcome email was sent (or scheduled)
   - Verify subscriber is in the correct list

4. **Check Supabase Logs** (if needed)
   - Go to **Edge Functions** → **systemio-subscribe** → **Logs**
   - Look for any errors

---

## 🔧 Troubleshooting

### Issue: Subscribers not appearing in System.io

**Possible Causes:**
1. **API Key incorrect**
   - Double-check the API key in Supabase secrets
   - Verify it's active in System.io

2. **List ID incorrect**
   - Verify the List/Sequence ID in System.io
   - Check it matches the secret in Supabase

3. **Edge Function not deployed**
   - Check Edge Functions → systemio-subscribe exists
   - Verify it's deployed (not just saved)

4. **Trigger not updated**
   - Run the SQL script again
   - Check Database → Triggers for `on_auth_user_created`

**Solution:**
- Check Edge Function logs: **Edge Functions** → **systemio-subscribe** → **Logs**
- Look for error messages
- Verify all environment variables are set

---

### Issue: Signup works but no email sent

**Possible Causes:**
1. **Email sequence not set up**
   - Create automation/sequence in System.io
   - Set trigger to "when subscriber added"

2. **Subscriber status**
   - Check if subscriber is "active" or "unconfirmed"
   - System.io may require double opt-in

**Solution:**
- In System.io, check subscriber status
- Verify automation/sequence is active
- Check email deliverability settings

---

### Issue: Edge Function errors

**Check Logs:**
1. Go to **Edge Functions** → **systemio-subscribe** → **Logs**
2. Look for error messages
3. Common errors:
   - `SYSTEMIO_API_KEY not configured` → Add secret in Supabase
   - `Failed to add to System.io` → Check API key and List ID
   - `Network error` → Check System.io API status

---

## 📝 Alternative: Frontend Integration (Simpler Setup)

If you prefer not to modify database triggers, you can call the Edge Function directly from your frontend after signup:

### Step 1: Update SignUp Component

1. **Open** `components/SignUp.tsx`

2. **Add import** at the top:
```typescript
import { addNewSignupToSystemIo } from '../services/systemioService';
```

3. **Update handleSubmit function** - After successful signup:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
    // ... existing validation code ...
    
    setLoading(true);
    try {
        const { error, data } = await signUp(email, password, name);
        if (error) {
            // ... existing error handling ...
            return;
        }

        // Add to System.io after successful signup
        if (data?.user) {
            await addNewSignupToSystemIo(
                email,
                name,
                data.user.id
            );
        }

        setSuccess('Account created! Please check your email to verify your account.');
    } finally {
        setLoading(false);
    }
};
```

4. **Update handleGoogleSignUp** - After Google OAuth:
```typescript
const handleGoogleSignUp = async () => {
    // ... existing code ...
    try {
        const { error, data } = await signInWithGoogle();
        if (error) throw error;
        
        // Add to System.io after successful Google signup
        if (data?.user) {
            await addNewSignupToSystemIo(
                data.user.email || '',
                data.user.user_metadata?.full_name || '',
                data.user.id
            );
        }
    } catch (err: any) {
        // ... existing error handling ...
    }
};
```

### Step 2: Update AuthContext (for Google OAuth)

If you also want to handle Google signups, update `contexts/AuthContext.tsx`:

```typescript
import { addNewSignupToSystemIo } from '../services/systemioService';

// In signInWithGoogle function, after successful signup:
const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
        // ... existing options ...
    }
});

// After OAuth callback, check if it's a new user
if (data?.user && !error) {
    // Check if this is a new signup (you may need to track this)
    await addNewSignupToSystemIo(
        data.user.email || '',
        data.user.user_metadata?.full_name || '',
        data.user.id
    );
}
```

**✅ Pros:**
- Simpler setup (no SQL changes)
- Works immediately
- Easy to test

**⚠️ Cons:**
- Requires code changes in multiple places
- Might miss some signup methods
- Less automatic than trigger approach

**💡 Recommendation:** Use the **database trigger approach** (Step 4) for automatic, comprehensive coverage.

---

## 🎯 What Happens Now?

1. **User signs up** → Profile and subscription created
2. **Trigger fires** → Calls Edge Function
3. **Edge Function** → Adds user to System.io
4. **System.io** → Starts email sequence automatically
5. **User receives** → Welcome email, tips, etc.

---

## 📚 System.io API Documentation

- **API Docs:** https://system.io/api-docs/
- **Subscriber Endpoint:** `POST /v1/subscribers`
- **Authentication:** Bearer token (API key)

---

## ✅ Checklist

- [ ] System.io account created
- [ ] API key obtained
- [ ] List/Sequence ID obtained
- [ ] Edge Function deployed
- [ ] Environment variables set in Supabase
- [ ] SQL script run (trigger updated)
- [ ] Email sequence created in System.io
- [ ] Test signup completed
- [ ] Subscriber appears in System.io
- [ ] Welcome email received

---

## 🆘 Need Help?

- **System.io Support:** https://system.io/support
- **Supabase Docs:** https://supabase.com/docs
- **Edge Functions Docs:** https://supabase.com/docs/guides/functions

---

**Last Updated:** 2025-01-XX
