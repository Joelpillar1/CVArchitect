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
| Payment succeeds, plan stays free | Webhook not reaching server | Verify webhook URL and secret in Dodo |
| Unknown product ID in logs | Product ID mismatch | Match `DODO_*_PRODUCT_ID` to Dodo dashboard |
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
