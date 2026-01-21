# Whop Webhook Debugging Guide

## Issue: Webhook Not Working / Vercel Not Showing Anything

If Vercel is not showing any logs, the webhook might not be receiving requests or the function might not be deployed correctly.

## Step 1: Test if Function is Deployed

### Test the webhook endpoint directly:

1. **Test GET endpoint** (should work immediately):
   ```
   https://cvarchitect.app/api/whop-webhook
   ```
   
   You should see:
   ```json
   {
     "success": true,
     "message": "Whop webhook endpoint is active",
     "timestamp": "...",
     "environment": {
       "hasSupabaseUrl": true,
       "hasServiceKey": true,
       ...
     }
   }
   ```

2. **Test simple endpoint**:
   ```
   https://cvarchitect.app/api/test-webhook
   ```
   
   Should return a success message.

### If these don't work:
- The function might not be deployed
- Check Vercel Dashboard → Deployments → Latest deployment
- Make sure `api/whop-webhook.ts` is in your repository
- Redeploy if needed

## Step 2: Check Vercel Function Logs

1. Go to **Vercel Dashboard** → Your Project
2. Click **Functions** tab (or **Logs**)
3. Look for `api/whop-webhook`
4. Check for any errors or requests

### If you see no logs at all:
- The webhook URL in Whop might be incorrect
- Whop might not be sending requests
- The function might not be deployed

## Step 3: Verify Whop Webhook Configuration

### In Whop Dashboard:

1. **Webhook URL** should be:
   ```
   https://cvarchitect.app/api/whop-webhook
   ```
   (NOT `https://www.cvarchitect.app` - use the exact domain)

2. **Webhook Secret** should match your `WHOP_WEBHOOK_SECRET` env var

3. **Subscribed Events** should include:
   - `membership_activated`
   - `payment_succeeded`
   - `invoice_paid`

4. **Test the webhook** (if Whop has a test button):
   - Click "Test Webhook" or "Send Test Event"
   - Check Vercel logs immediately after

## Step 4: Manual Testing

### Option A: Use curl to test the endpoint

```bash
# Test GET endpoint
curl https://cvarchitect.app/api/whop-webhook

# Test POST endpoint (simulate webhook)
curl -X POST https://cvarchitect.app/api/whop-webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"test","data":{"test":true}}'
```

### Option B: Use Postman or similar

1. Create a POST request to `https://cvarchitect.app/api/whop-webhook`
2. Add header: `Content-Type: application/json`
3. Add body:
   ```json
   {
     "type": "membership_activated",
     "data": {
       "product_id": "your-product-id",
       "metadata": {
         "user_id": "test-user-id"
       }
     }
   }
   ```
4. Send request
5. Check Vercel logs immediately

## Step 5: Check Environment Variables

In Vercel Dashboard → Settings → Environment Variables, verify:

- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `WHOP_WEBHOOK_SECRET`
- ✅ `WHOP_SPRINT_PRODUCT_ID`
- ✅ `WHOP_MARATHON_PRODUCT_ID`

**Important**: After adding/changing env vars, you MUST redeploy!

## Step 6: Common Issues

### Issue 1: Function Not Deployed
**Symptoms**: GET request to `/api/whop-webhook` returns 404

**Fix**:
1. Make sure `api/whop-webhook.ts` exists in your repo
2. Push to Git
3. Wait for Vercel to deploy
4. Check Vercel → Deployments → Latest

### Issue 2: Webhook URL Wrong
**Symptoms**: No requests in Vercel logs

**Fix**:
- Use exact domain: `https://cvarchitect.app/api/whop-webhook`
- No trailing slash
- Use `https://` not `http://`
- Check if you need `www.` or not

### Issue 3: Environment Variables Missing
**Symptoms**: Function errors when called

**Fix**:
- Add all required env vars in Vercel
- Redeploy after adding vars
- Test with GET endpoint to see which vars are missing

### Issue 4: Whop Not Sending Webhooks
**Symptoms**: No requests in logs even after payment

**Fix**:
- Verify webhook is enabled in Whop
- Check subscribed events
- Verify webhook secret matches
- Check Whop's webhook delivery logs (if available)

## Step 7: Enable Detailed Logging

The webhook now logs:
- Every request (method, URL, headers)
- Event data received
- User ID extraction
- Product ID extraction
- Subscription update results

Check Vercel logs for these messages to see exactly what's happening.

## Quick Checklist

- [ ] Function deployed? Test: `https://cvarchitect.app/api/whop-webhook` (GET)
- [ ] Webhook URL correct in Whop? `https://cvarchitect.app/api/whop-webhook`
- [ ] Webhook secret matches?
- [ ] Events subscribed in Whop?
- [ ] Environment variables set in Vercel?
- [ ] Redeployed after adding env vars?
- [ ] Checked Vercel function logs?

## Next Steps

1. **Test the GET endpoint first** - this will tell you if the function is deployed
2. **Check Vercel logs** - even if empty, this tells us if requests are reaching Vercel
3. **Verify Whop configuration** - make sure webhook URL and secret are correct
4. **Test with a manual POST** - use curl or Postman to simulate a webhook

Once we know the function is deployed and receiving requests, we can debug why the subscription isn't updating.
