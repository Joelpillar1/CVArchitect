-- Store Dodo billing linkage for plan changes and cancellation
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS dodo_subscription_id text,
  ADD COLUMN IF NOT EXISTS dodo_customer_id text,
  ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS scheduled_plan_id text;

CREATE INDEX IF NOT EXISTS subscriptions_dodo_subscription_id_idx
  ON public.subscriptions (dodo_subscription_id)
  WHERE dodo_subscription_id IS NOT NULL;
