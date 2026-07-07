# Dodo Payments Integration Setup

CV Architect uses [Dodo Payments](https://docs.dodopayments.com/developer-resources/integration-guide) for subscriptions. Checkout and webhooks run through **Supabase Edge Functions** (primary path).

## Architecture

1. User selects a plan → `services/dodoPaymentsService.ts` calls `create-checkout-session` Edge Function
2. Edge Function creates a Dodo checkout session → user redirects to Dodo hosted checkout
3. After payment, Dodo sends webhook → `dodo-webhook` Edge Function activates subscription in Supabase
4. User returns to `/dashboard?payment=success&plan={planId}` → Dashboard polls until plan is active

**Vercel fallback routes** (`api/create-checkout-session.ts`, `api/dodo-webhook.ts`) exist but production should use Supabase Edge Functions.

---

## Pricing Plans (current)

| Plan | ID | Price | Renewal |
|------|-----|-------|---------|
| Foundation | `free` | $0 | — |
| Sprint | `sprint` | $2.99/week | Weekly |
| Build | `build` | $9.99/month | Monthly (highlighted) |
| Blueprint Pass | `blueprint` | $29 / 3 months | Quarterly |

Legacy plan IDs in the database (`week_pass`, `pro_monthly`) are still recognized for existing subscribers.

---

## Step 1: Create Dodo Products

In the [Dodo Dashboard](https://app.dodopayments.com), create **three subscription products**:

- **Sprint** — weekly billing at $2.99
- **Build** — monthly billing at $9.99
- **Blueprint Pass** — quarterly billing at $29

Copy each product ID (`prod_xxx`).

---

## Step 2: Set Supabase Edge Function Secrets

Dashboard: **Project Settings → Edge Functions → Secrets**

Or CLI:

```bash
supabase secrets set DODO_PAYMENTS_API_KEY=your_api_key
supabase secrets set DODO_PAYMENTS_ENVIRONMENT=test_mode
supabase secrets set DODO_PAYMENTS_WEBHOOK_KEY=your_webhook_secret
supabase secrets set DODO_SPRINT_PRODUCT_ID=prod_xxx
supabase secrets set DODO_BUILD_PRODUCT_ID=prod_xxx
supabase secrets set DODO_BLUEPRINT_PRODUCT_ID=prod_xxx
supabase secrets set APP_URL=https://cvarchitect.app
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected for Edge Functions.

See `.env.example` for supported alias names.

### Test mode vs live mode (important)

**Toggling test/live in the Dodo dashboard does not change your app.** Checkout mode is controlled entirely by server secrets:

| Secret | Test checkout | Live checkout |
|--------|---------------|---------------|
| `DODO_PAYMENTS_ENVIRONMENT` | `test_mode` | `live_mode` |
| `DODO_PAYMENTS_API_KEY` | API key from **Test** mode in Dodo | API key from **Live** mode |
| `DODO_*_PRODUCT_ID` | Product IDs created in **Test** mode | Product IDs created in **Live** mode |

If checkout opens `live.dodopayments.com`, your secrets still point at live — usually `DODO_PAYMENTS_ENVIRONMENT=live_mode` and/or a **live** API key on **Supabase Edge secrets** and/or **Vercel** (fallback route).

**Fix for test checkout:**

1. In Dodo → switch to **Test** mode → copy the **test** API key and **test** product IDs.
2. Update **Supabase** → Project Settings → Edge Functions → Secrets:
   - `DODO_PAYMENTS_ENVIRONMENT` = `test_mode`
   - `DODO_PAYMENTS_API_KEY` = test API key
   - `DODO_SPRINT_PRODUCT_ID`, `DODO_BUILD_PRODUCT_ID`, `DODO_BLUEPRINT_PRODUCT_ID` = test product IDs
3. If you use Vercel fallback, set the **same** values in Vercel → Project → Environment Variables.
4. Redeploy edge functions (or wait ~1 min for secrets to propagate). No app redeploy needed for secret-only changes.

**Verify:** After starting checkout, the URL should be `https://test.dodopayments.com/...`. Edge function logs show `environment: test_mode`.

Accepted values for `DODO_PAYMENTS_ENVIRONMENT`: `test_mode`, `live_mode`, `test`, `live`, `production`, `prod` (case-insensitive).

---

## Step 3: Deploy Edge Functions

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase functions deploy create-checkout-session
supabase functions deploy dodo-webhook
```

If deploy returns **403**, your CLI account lacks privileges on the project. Use an owner account, deploy via Supabase Dashboard, or request access.

---

## Step 4: Register Dodo Webhook

In Dodo Dashboard → Webhooks:

- **URL:** `https://<project-ref>.supabase.co/functions/v1/dodo-webhook`
- **Secret:** same value as `DODO_PAYMENTS_WEBHOOK_KEY`
- Enable subscription/payment success and cancellation events per Dodo docs

Do **not** point the webhook at `/api/whop-webhook` (removed).

---

## Step 5: Configure Return URL

Checkout redirect is set server-side to:

```
{APP_URL}/dashboard?payment=success&plan={planId}
```

Ensure `APP_URL` matches your production domain.

---

## Step 6: Test End-to-End

1. Sign in, open pricing modal, select **Sprint**, **Build**, or **Blueprint**
2. Complete test checkout on Dodo (use test mode)
3. Confirm redirect to `/dashboard?payment=success&plan=...`
4. Check Supabase → `subscriptions` table:
   - `plan_id`: `sprint`, `build`, or `blueprint`
   - `is_active`: `true`
   - `credits`: `999999` (unlimited)
5. Check Edge Function logs in Supabase Dashboard if activation is slow

---

## Debugging

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Checkout fails immediately | Edge Function not deployed | Deploy `create-checkout-session` |
| Payment succeeds, plan stays free | Webhook failed or DB rejected plan ID | Ensure webhook URL is set; `plan_id` must allow `sprint`/`build`/`blueprint` (see migration `allow_dodo_plan_ids`) |
| Webhook returns 500 in logs | `valid_plan_id` constraint blocked update | Run migration to allow new plan IDs; retry webhook from Dodo dashboard |
| Checkout opens live.dodopayments.com | Secrets still use live mode / live API key | Set `DODO_PAYMENTS_ENVIRONMENT=test_mode`, test API key, and test product IDs in Supabase + Vercel |
| 403 on `supabase functions deploy` | CLI account permissions | Use project owner or Dashboard deploy |

**Logs:** Supabase Dashboard → Edge Functions → `dodo-webhook` or `create-checkout-session` → Logs

**Client polling:** `pages/Dashboard.tsx` polls subscription status after `?payment=success` (up to ~20 seconds).

---

## Key Files

| File | Purpose |
|------|---------|
| `utils/pricingConfig.ts` | Plan definitions and prices (source of truth for UI) |
| `services/dodoPaymentsService.ts` | Client checkout API call |
| `supabase/functions/create-checkout-session/` | Creates Dodo checkout session |
| `supabase/functions/dodo-webhook/` | Activates/downgrades subscriptions |
| `api/lib/subscriptionActivation.ts` | Shared activation logic (Vercel fallback) |
| `components/PricingModal.tsx` | In-app upgrade UI |

---

**Last updated:** July 2026
