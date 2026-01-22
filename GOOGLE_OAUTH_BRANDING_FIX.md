# Fix Google OAuth Consent Screen - Hide Supabase URL

## Problem
When users sign in with Google, they see "to continue to **lxtvqfqldhdpbuvxvdjj.supabase.co**" which looks unprofessional.

## Solution
While you can't completely hide the Supabase URL (it's a Google security feature), you can make your app branding much more prominent so users see "CV Architect" first.

---

## Step 1: Update OAuth Consent Screen in Google Cloud Console

### 1.1 Go to OAuth Consent Screen
1. Visit: https://console.cloud.google.com/
2. Select your project
3. Go to **APIs & Services** → **OAuth consent screen**

### 1.2 Update App Information
1. Click **EDIT APP**
2. Fill in all fields to make your app look professional:

   **App information:**
   - **App name:** `CV Architect` (or your preferred name)
   - **User support email:** Your support email
   - **App logo:** Upload your app logo (recommended: 120x120px PNG)
   - **Application home page:** `https://cvarchitect.app`
   - **Application privacy policy link:** `https://cvarchitect.app/privacy`
   - **Application terms of service link:** `https://cvarchitect.app/terms`
   - **Authorized domains:** Add `cvarchitect.app`

   **Developer contact information:**
   - **Email addresses:** Your developer email

3. Click **SAVE AND CONTINUE**

### 1.3 Configure Scopes (IMPORTANT - Only Select What You Need!)
1. Click **ADD OR REMOVE SCOPES**
2. **ONLY select these 3 basic scopes** (uncheck everything else):
   - ✅ `.../auth/userinfo.email` - "See your primary Google Account email address"
   - ✅ `.../auth/userinfo.profile` - "See your personal info"
   - ✅ `openid` - "Associate you with your personal info on Google"
   
   **❌ DO NOT select:**
   - ❌ BigQuery API scopes
   - ❌ Analytics Hub API scopes
   - ❌ Cloud Storage (devstorage) scopes
   - ❌ Cloud Platform scopes
   - ❌ Any other scopes you don't need
   
   **Why?** These other scopes are for Google Cloud services and are NOT needed for simple sign-in. Selecting unnecessary scopes:
   - Makes users suspicious (why does a CV app need BigQuery access?)
   - Can cause security review issues
   - Violates the principle of least privilege
   
3. Click **UPDATE** → **SAVE AND CONTINUE**

### 1.4 Add Test Users (If App is in Testing Mode)
1. If your app is in "Testing" mode, add test users:
   - Click **ADD USERS**
   - Add email addresses of users who should be able to sign in
2. Click **SAVE AND CONTINUE**

### 1.5 Publish Your App (Important!)
1. If your app is in "Testing" mode:
   - Click **PUBLISH APP** button
   - Confirm publishing
   - **Note:** This makes your app available to all Google users (not just test users)

2. If you want to keep it in testing mode:
   - Make sure all test users are added
   - The app will only work for those users

---

## Step 2: Verify Your App Branding

After updating, when users sign in with Google, they should see:
- ✅ **"CV Architect"** as the app name (prominently displayed)
- ✅ Your app logo (if uploaded)
- ✅ "to continue to **lxtvqfqldhdpbuvxvdjj.supabase.co**" (still shown, but less prominent)

The Supabase URL will still appear, but your app name and branding will be much more visible.

---

## Step 3: Alternative Solution (Advanced)

If you want to completely hide the Supabase URL, you would need to:

1. **Use Supabase Custom Domain** (Pro/Team plan required)
   - Contact Supabase support to set up a custom domain
   - This allows you to use `auth.cvarchitect.app` instead of `lxtvqfqldhdpbuvxvdjj.supabase.co`

2. **Implement Custom OAuth Flow** (Complex)
   - Build your own OAuth handler
   - Not recommended unless you have specific requirements

---

## Recommended Approach

**For most cases, Step 1 is sufficient:**
- Users will see "CV Architect" prominently
- The Supabase URL is shown for security (Google requirement)
- Most users won't notice or care about the technical URL
- Your branding will be clear and professional

---

## Quick Checklist

- [ ] Updated OAuth consent screen with app name
- [ ] Added app logo (120x120px PNG)
- [ ] Added home page URL
- [ ] Added privacy policy and terms links
- [ ] Added authorized domain (`cvarchitect.app`)
- [ ] Published app (or added all test users)
- [ ] Tested Google sign-in to verify branding appears correctly

---

## Result

After these changes:
- ✅ Users see "CV Architect" prominently
- ✅ Your logo appears (if uploaded)
- ✅ Professional appearance
- ⚠️ Supabase URL still visible (Google security requirement, but less prominent)
