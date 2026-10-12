-- ==============================================================================
-- CREEM PAYMENT METHOD SUPPORT FOR CVARCHITECT
-- ==============================================================================

-- 1. Add Creem customer and subscription IDs to subscriptions table
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS creem_subscription_id text,
  ADD COLUMN IF NOT EXISTS creem_customer_id text;

-- 2. Create index for fast webhook and status lookups
CREATE INDEX IF NOT EXISTS subscriptions_creem_subscription_id_idx
  ON public.subscriptions (creem_subscription_id)
  WHERE creem_subscription_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS subscriptions_creem_customer_id_idx
  ON public.subscriptions (creem_customer_id)
  WHERE creem_customer_id IS NOT NULL;

-- 3. Ensure valid_plan_id constraint allows lifetime and core plans
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'valid_plan_id') THEN
        ALTER TABLE public.subscriptions DROP CONSTRAINT valid_plan_id;
    END IF;

    ALTER TABLE public.subscriptions
      ADD CONSTRAINT valid_plan_id 
      CHECK (plan_id IN ('free', 'sprint', 'build', 'blueprint', 'lifetime', 'week_pass', 'pro_monthly'));
END $$;
