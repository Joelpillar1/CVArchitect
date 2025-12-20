# Supabase Edge Function Deployment Guide

## Overview
This guide will help you deploy the `ai-generate` Edge Function to Supabase, which securely handles all AI operations on the backend.

## Prerequisites
- Supabase account with a project created
- OpenAI API key
- Supabase CLI installed (or use Supabase Dashboard)

---

## Method 1: Deploy Using Supabase Dashboard (Easiest)

### Step 1: Add OpenAI API Key to Supabase Secrets

1. Go to your Supabase Dashboard: https://app.supabase.com/
2. Select your project
3. Navigate to **Settings** → **Edge Functions**
4. Scroll to **"Secrets"** section
5. Click **"Add new secret"**
6. Add:
   - **Name:** `OPENAI_API_KEY`
   - **Value:** Your OpenAI API key (starts with `sk-...`)
7. Click **Save**

### Step 2: Create the Edge Function

1. In Supabase Dashboard, go to **Edge Functions** in the left sidebar
2. Click **"Create a new function"**
3. Name it: `ai-generate`
4. Copy the entire content from `supabase/functions/ai-generate/index.ts`
5. Paste it into the function editor
6. Click **Deploy**

### Step 3: Test the Function

1. In the Edge Functions dashboard, click on `ai-generate`
2. Click **"Invoke"** or **"Test"**
3. Use this test payload:
```json
{
  "prompt": "Write a professional summary for a software engineer",
  "model": "gpt-4o",
  "temperature": 0.7,
  "responseFormat": "text"
}
```
4. Click **Run**
5. You should see a response with AI-generated content

---

## Method 2: Deploy Using Supabase CLI (Advanced)

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Login to Supabase

```bash
supabase login
```

### Step 3: Link to Your Project

```bash
# Get your project reference from Supabase Dashboard → Settings → General
supabase link --project-ref your-project-ref
```

### Step 4: Set the OpenAI API Key Secret

```bash
supabase secrets set OPENAI_API_KEY=sk-your-openai-key-here
```

### Step 5: Deploy the Function

```bash
# From your project root directory
supabase functions deploy ai-generate
```

### Step 6: Test the Function

```bash
supabase functions invoke ai-generate --data '{
  "prompt": "Write a professional summary for a software engineer",
  "model": "gpt-4o",
  "temperature": 0.7,
  "responseFormat": "text"
}'
```

---

## Verify Deployment

### Check Function URL

Your function will be available at:
```
https://your-project-ref.supabase.co/functions/v1/ai-generate
```

### Test from Your App

1. Make sure your `.env` file has:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. **Remove** `VITE_OPENAI_API_KEY` from `.env` (it's now in Supabase!)

3. Restart your dev server:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

4. Try using any AI feature in your app (e.g., "Rewrite with AI")

---

## Troubleshooting

### Error: "OpenAI API key not configured"
- Make sure you added the `OPENAI_API_KEY` secret in Supabase Dashboard
- Redeploy the function after adding the secret

### Error: "Failed to call AI function"
- Check that your Supabase URL and anon key are correct in `.env`
- Make sure the function is deployed and active
- Check the function logs in Supabase Dashboard → Edge Functions → ai-generate → Logs

### Error: "CORS error"
- The function includes CORS headers, but if you still get errors:
- Check that you're using the correct Supabase URL
- Make sure you're sending the Authorization header

### Function not found
- Verify the function name is exactly `ai-generate`
- Check that it's deployed in the correct project
- Try redeploying the function

---

## Monitoring

### View Logs

**Dashboard:**
1. Go to **Edge Functions** → `ai-generate`
2. Click **Logs** tab
3. View real-time logs and errors

**CLI:**
```bash
supabase functions logs ai-generate
```

### Check Usage

1. Go to **Settings** → **Billing**
2. View Edge Function invocations
3. Monitor costs

---

## Security Notes

✅ **What's Secure:**
- OpenAI API key is stored in Supabase secrets (backend only)
- Never exposed to frontend/browser
- Only accessible by the Edge Function

✅ **What's Public:**
- Supabase URL (safe to expose)
- Supabase anon key (safe to expose - has Row Level Security)

❌ **Never Expose:**
- OpenAI API key in frontend code
- Supabase service_role key

---

## Cost Considerations

- **Supabase Edge Functions:** Free tier includes 500K function invocations/month
- **OpenAI API:** Charged per token used
- Monitor usage in both Supabase and OpenAI dashboards

---

## Next Steps

After deployment:
1. ✅ Test all AI features in your app
2. ✅ Remove `VITE_OPENAI_API_KEY` from `.env`
3. ✅ Commit your changes (`.env` is gitignored)
4. ✅ Deploy your frontend to production

---

## Support

If you encounter issues:
1. Check Supabase Edge Function logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Test the function directly in Supabase Dashboard

For more help:
- Supabase Docs: https://supabase.com/docs/guides/functions
- OpenAI Docs: https://platform.openai.com/docs
