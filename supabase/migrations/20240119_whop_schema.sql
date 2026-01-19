-- Migration for Whop Payment Integration (Corrected for 'subscriptions' table)

-- Add columns to SUBSCRIPTIONS table (not users) to track Whop subscriptions
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS whop_membership_id TEXT,
ADD COLUMN IF NOT EXISTS whop_plan_id TEXT;

-- Create index for faster lookups by membership ID (used in webhooks)
CREATE INDEX IF NOT EXISTS idx_subscriptions_whop_membership 
ON public.subscriptions(whop_membership_id);

-- Note: plan_id, subscription_start, subscription_end already exist in subscriptions table!

-- Comments
COMMENT ON COLUMN public.subscriptions.whop_membership_id IS 'Whop Membership ID for recurring subscriptions';
