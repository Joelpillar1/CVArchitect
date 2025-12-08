# Email Verification & Google OAuth Setup Guide

## 🎯 Overview
This guide will help you configure:
1. **Google OAuth** - Allow users to sign in with their Google account
2. **Email Verification** - Ensure users verify their email addresses

---

## Part 1: Google OAuth Setup

### Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project** (or select existing)
   - Click "Select a project" → "New Project"
   - Name: "CV Architect" (or your app name)
   - Click "Create"

3. **Enable Google+ API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

4. **Configure OAuth Consent Screen**
   - Go to "APIs & Services" → "OAuth consent screen"
   - Select "External" → Click "Create"
   - Fill in:
     - App name: `CV Architect`
     - User support email: Your email
     - Developer contact: Your email
   - Click "Save and Continue"
   - Skip "Scopes" → Click "Save and Continue"
   - Add test users (your email) → Click "Save and Continue"

5. **Create OAuth 2.0 Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "CV Architect Web Client"
   - **Authorized JavaScript origins:**
     ```
     http://localhost:5173
     https://your-production-domain.com
     ```
   - **Authorized redirect URIs:**
     ```
     https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback
     ```
     (Replace `YOUR_SUPABASE_PROJECT_REF` with your actual Supabase project reference)
   
   - Click "Create"
   - **Copy the Client ID and Client Secret** - you'll need these!

### Step 2: Configure Google OAuth in Supabase

1. **Go to Supabase Dashboard**
   - Visit: https://app.supabase.com/
   - Select your project

2. **Navigate to Authentication Settings**
   - Go to "Authentication" → "Providers"
   - Find "Google" in the list

3. **Enable and Configure Google**
   - Toggle "Enable Sign in with Google" to ON
   - Paste your **Client ID** from Google Console
   - Paste your **Client Secret** from Google Console
   - Click "Save"

4. **Get Your Redirect URL**
   - Copy the "Callback URL (for OAuth)" shown in Supabase
   - Format: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
   - Make sure this matches what you added in Google Console

---

## Part 2: Email Verification Setup

### Step 1: Configure Email Templates in Supabase

1. **Go to Email Templates**
   - In Supabase Dashboard: "Authentication" → "Email Templates"

2. **Customize "Confirm signup" Template**
   - Click on "Confirm signup"
   - Edit the template (example):

   ```html
   <h2>Confirm Your Email</h2>
   <p>Hi there!</p>
   <p>Thanks for signing up for CV Architect! Please confirm your email address by clicking the button below:</p>
   <p><a href="{{ .ConfirmationURL }}" style="background-color: #00D9A3; color: #0A0F1C; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Confirm Email</a></p>
   <p>If the button doesn't work, copy and paste this link into your browser:</p>
   <p>{{ .ConfirmationURL }}</p>
   <p>This link will expire in 24 hours.</p>
   <p>If you didn't create an account, you can safely ignore this email.</p>
   <p>Best regards,<br>The CV Architect Team</p>
   ```

   - Click "Save"

3. **Configure "Magic Link" Template** (Optional)
   - Similar to above, customize for passwordless login

4. **Configure "Reset Password" Template**
   - Click on "Reset Password"
   - Customize the template:

   ```html
   <h2>Reset Your Password</h2>
   <p>Hi there!</p>
   <p>We received a request to reset your password for your CV Architect account.</p>
   <p><a href="{{ .ConfirmationURL }}" style="background-color: #00D9A3; color: #0A0F1C; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a></p>
   <p>If the button doesn't work, copy and paste this link into your browser:</p>
   <p>{{ .ConfirmationURL }}</p>
   <p>This link will expire in 1 hour.</p>
   <p>If you didn't request a password reset, you can safely ignore this email.</p>
   <p>Best regards,<br>The CV Architect Team</p>
   ```

   - Click "Save"

### Step 2: Configure Email Settings

1. **Email Auth Settings**
   - Go to "Authentication" → "Settings"
   - Under "Email Auth":
     - ✅ Enable email confirmations
     - ✅ Enable email change confirmations
     - Set "Confirmation URL" to: `http://localhost:5173/` (development) or your production URL

2. **SMTP Settings** (Optional - for custom email)
   - By default, Supabase uses their SMTP
   - For production, configure your own SMTP:
     - Go to "Project Settings" → "Auth"
     - Scroll to "SMTP Settings"
     - Enable "Custom SMTP"
     - Enter your SMTP details (e.g., SendGrid, AWS SES, etc.)

### Step 3: Configure Redirect URLs

1. **Go to URL Configuration**
   - "Authentication" → "URL Configuration"

2. **Add Redirect URLs**
   - Add these URLs to "Redirect URLs":
     ```
     http://localhost:5173/**
     https://your-production-domain.com/**
     ```

3. **Site URL**
   - Set to: `http://localhost:5173` (development)
   - Update to production URL when deploying

---

## Part 3: Testing

### Test Google OAuth

1. **Start your development server**
   ```bash
   npm run dev
   ```

2. **Navigate to Sign In page**
   - Click "Sign in with Google"
   - Should redirect to Google login
   - After authentication, should redirect back to your app

3. **Check Supabase Dashboard**
   - Go to "Authentication" → "Users"
   - You should see your Google account listed

### Test Email Verification

1. **Sign up with email/password**
   - Use a real email address you can access

2. **Check your email**
   - You should receive a confirmation email
   - Click the confirmation link

3. **Verify in Supabase**
   - Go to "Authentication" → "Users"
   - Check that `email_confirmed_at` is set

---

## Part 4: Environment Variables

Make sure your `.env` file has:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 🎉 You're Done!

Your app now supports:
- ✅ Google OAuth sign-in
- ✅ Email verification for new signups
- ✅ Password reset via email

## 📝 Next Steps

1. **Test thoroughly** in development
2. **Update redirect URLs** for production
3. **Configure custom SMTP** for production emails
4. **Customize email templates** to match your brand
5. **Add error handling** for edge cases

## 🐛 Troubleshooting

### Google OAuth not working?
- Check that redirect URI in Google Console matches Supabase callback URL exactly
- Ensure Google+ API is enabled
- Verify Client ID and Secret are correct in Supabase

### Email verification not sending?
- Check spam folder
- Verify SMTP settings in Supabase
- Check "Email Templates" are saved correctly
- Ensure "Enable email confirmations" is ON

### Redirect issues?
- Check "Redirect URLs" in Supabase includes your domain
- Verify "Site URL" is set correctly
- Check browser console for errors
