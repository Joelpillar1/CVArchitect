-- Add Whop integration columns to subscriptions table
-- Run this in your Supabase SQL Editor

ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS whop_membership_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS whop_payment_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'active';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_whop_membership 
ON subscriptions(whop_membership_id);

-- Add comment
COMMENT ON COLUMN subscriptions.whop_membership_id IS 'Whop membership ID for tracking payments';
COMMENT ON COLUMN subscriptions.whop_payment_id IS 'Whop payment/transaction ID';
COMMENT ON COLUMN subscriptions.payment_status IS 'Payment status: active, cancelled, expired';
