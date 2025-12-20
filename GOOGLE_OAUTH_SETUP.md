# Google OAuth Setup Guide

## ✅ Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/
2. Sign in with your Google account

### 1.2 Create or Select a Project
1. Click the project dropdown at the top
2. Click **"New Project"**
3. Name it: `CV Architect`
4. Click **"Create"**
5. Wait for project to be created
6. Select the new project

### 1.3 Enable Google+ API (if required)
1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click **Enable** (if not already enabled)

### 1.4 Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** (unless you have Google Workspace)
3. Click **Create**
4. Fill in:
   - **App name:** CV Architect
   - **User support email:** your-email@gmail.com
   - **Developer contact:** your-email@gmail.com
5. Click **Save and Continue**
6. **Scopes:** Skip this (click Save and Continue)
7. **Test users:** Skip this (click Save and Continue)
8. Click **Back to Dashboard**

### 1.5 Create OAuth Client ID
1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Name: `CV Architect Web`
5. **Authorized JavaScript origins:**
   - Add: `http://localhost:5173`
   - Add: `http://localhost:5174`
   - Add: `https://your-production-domain.com` (when you deploy)
6. **Authorized redirect URIs:**
   - Add: `https://lxtvqfqldhdpbuvxvdjj.supabase.co/auth/v1/callback`
   - (Replace `lxtvqfqldhdpbuvxvdjj` with your actual Supabase project ID)
7. Click **Create**
8. **IMPORTANT:** Copy these values:
   - **Client ID** (starts with something like `123456789-abc...apps.googleusercontent.com`)
   - **Client Secret** (random string)

---

## ✅ Step 2: Configure Supabase

### 2.1 Add Google Provider
1. Go to Supabase Dashboard: https://app.supabase.com/
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** in the list
5. Toggle it **ON** (enable it)

### 2.2 Add Google Credentials
1. In the Google provider settings:
   - **Client ID:** Paste the Client ID from Google Cloud Console
   - **Client Secret:** Paste the Client Secret from Google Cloud Console
2. Click **Save**

### 2.3 Verify Redirect URL
1. In the same Google provider settings
2. You'll see **Callback URL (for OAuth)**
3. It should be: `https://lxtvqfqldhdpbuvxvdjj.supabase.co/auth/v1/callback`
4. **Make sure this EXACT URL is in your Google Cloud Console Authorized redirect URIs**

---

## ✅ Step 3: Update Site URL in Supabase

1. Go to **Authentication** → **Settings**
2. **Site URL:** Set to `http://localhost:5173`
3. **Redirect URLs:** Add these:
   - `http://localhost:5173/**`
   - `http://localhost:5174/**`
   - `https://your-production-domain.com/**` (when you deploy)
4. Click **Save**

---

## ✅ Step 4: Test Google Sign-In

1. Make sure your dev server is running: `npm run dev`
2. Go to http://localhost:5173
3. Click **"Get Started"** or **"Sign In"**
4. Click **"Sign in with Google"** button
5. You should be redirected to Google login
6. Sign in with your Google account
7. Grant permissions
8. You should be redirected back to your app ✅
9. You should be logged in!

---

## 🔍 Troubleshooting

### Error: "redirect_uri_mismatch"

**Problem:** The redirect URI doesn't match what's configured in Google Cloud Console.

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Click on your OAuth client
3. Make sure **Authorized redirect URIs** includes:
   ```
   https://lxtvqfqldhdpbuvxvdjj.supabase.co/auth/v1/callback
   ```
4. Replace `lxtvqfqldhdpbuvxvdjj` with YOUR Supabase project ID
5. Save and try again

### Error: "Access blocked: This app's request is invalid"

**Problem:** OAuth consent screen not configured properly.

**Solution:**
1. Go to **OAuth consent screen**
2. Make sure app is **Published** (or add yourself as a test user)
3. Fill in all required fields
4. Save

### Google button doesn't work

**Problem:** AuthContext not providing `signInWithGoogle` function.

**Solution:**
1. Make sure you updated `contexts/AuthContext.tsx`
2. Restart dev server: `Ctrl+C` then `npm run dev`
3. Clear browser cache and try again

### User signs in but no profile created

**Problem:** Database trigger not running.

**Solution:**
1. Check Supabase **Logs** → **Postgres Logs**
2. Make sure the `handle_new_user()` trigger exists
3. Run the schema again if needed

---

## 📝 Production Deployment

When deploying to production:

### 1. Update Google Cloud Console
1. Add your production domain to **Authorized JavaScript origins**:
   ```
   https://your-app.com
   ```
2. Keep the Supabase callback URL in **Authorized redirect URIs**

### 2. Update Supabase
1. **Site URL:** Change to `https://your-app.com`
2. **Redirect URLs:** Add `https://your-app.com/**`

### 3. Test in Production
1. Deploy your app
2. Try Google sign-in on production
3. Should work! ✅

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Google OAuth client created in Google Cloud Console
- [ ] Client ID and Secret added to Supabase
- [ ] Redirect URI matches in both Google and Supabase
- [ ] OAuth consent screen configured
- [ ] Google provider enabled in Supabase
- [ ] Site URL set in Supabase
- [ ] Can click "Sign in with Google" button
- [ ] Redirects to Google login
- [ ] Redirects back to app after login
- [ ] User is logged in
- [ ] Profile created in database

---

## 🎉 Done!

Your Google OAuth is now set up! Users can sign in with their Google accounts.

**Benefits:**
- ✅ Faster sign-up (no password needed)
- ✅ More secure (Google handles authentication)
- ✅ Better user experience
- ✅ Auto-fills name and email from Google profile
