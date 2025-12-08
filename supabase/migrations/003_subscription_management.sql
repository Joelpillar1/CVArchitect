-- Subscription Management Schema
-- Run this in your Supabase SQL Editor

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL UNIQUE,
  plan_id text NOT NULL, -- 'free', 'basic_monthly', 'basic_yearly', 'pro_monthly', 'pro_yearly', 'lifetime'
  status text NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired', 'past_due'
  current_period_start timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  current_period_end timestamp with time zone,
  cancel_at_period_end boolean DEFAULT false,
  cancelled_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Payment info (for reference, actual payment handled by Stripe/etc)
  payment_method_last4 text,
  payment_method_brand text,
  
  -- Credits (for pay-as-you-go features)
  ai_credits integer DEFAULT 0,
  export_credits integer DEFAULT 0,
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create billing_history table
CREATE TABLE IF NOT EXISTS billing_history (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount decimal(10,2) NOT NULL,
  currency text DEFAULT 'USD',
  status text NOT NULL, -- 'succeeded', 'failed', 'pending', 'refunded'
  description text,
  invoice_url text,
  receipt_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Payment details
  payment_method_last4 text,
  payment_method_brand text,
  
  -- Metadata
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Create usage_tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  feature text NOT NULL, -- 'ai_rewrite', 'cv_regeneration', 'export_pdf', 'job_match', etc.
  count integer DEFAULT 1,
  period_start timestamp with time zone NOT NULL,
  period_end timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Composite unique constraint for period tracking
  UNIQUE(user_id, feature, period_start)
);

-- Set up RLS for subscriptions
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription." ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription." ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Set up RLS for billing_history
ALTER TABLE billing_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own billing history." ON billing_history
  FOR SELECT USING (auth.uid() = user_id);

-- Set up RLS for usage_tracking
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage." ON usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert usage tracking." ON usage_tracking
  FOR INSERT WITH CHECK (true);

-- Function to create default subscription for new users
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, plan_id, status)
  VALUES (NEW.id, 'free', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create subscription on user signup
DROP TRIGGER IF EXISTS on_user_created_subscription ON auth.users;
CREATE TRIGGER on_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_subscription();

-- Function to track feature usage
CREATE OR REPLACE FUNCTION track_usage(
  p_user_id uuid,
  p_feature text
)
RETURNS void AS $$
DECLARE
  v_period_start timestamp with time zone;
  v_period_end timestamp with time zone;
BEGIN
  -- Calculate current billing period (monthly)
  v_period_start := date_trunc('month', now());
  v_period_end := v_period_start + interval '1 month';
  
  -- Insert or update usage count
  INSERT INTO usage_tracking (user_id, feature, period_start, period_end, count)
  VALUES (p_user_id, p_feature, v_period_start, v_period_end, 1)
  ON CONFLICT (user_id, feature, period_start)
  DO UPDATE SET count = usage_tracking.count + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has reached usage limit
CREATE OR REPLACE FUNCTION check_usage_limit(
  p_user_id uuid,
  p_feature text,
  p_limit integer
)
RETURNS boolean AS $$
DECLARE
  v_current_usage integer;
  v_period_start timestamp with time zone;
BEGIN
  v_period_start := date_trunc('month', now());
  
  SELECT COALESCE(count, 0) INTO v_current_usage
  FROM usage_tracking
  WHERE user_id = p_user_id
    AND feature = p_feature
    AND period_start = v_period_start;
  
  RETURN v_current_usage < p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update subscription
CREATE OR REPLACE FUNCTION update_subscription_plan(
  p_user_id uuid,
  p_new_plan_id text
)
RETURNS subscriptions AS $$
DECLARE
  v_subscription subscriptions;
BEGIN
  UPDATE subscriptions
  SET 
    plan_id = p_new_plan_id,
    updated_at = now(),
    current_period_start = now(),
    current_period_end = CASE 
      WHEN p_new_plan_id LIKE '%yearly' THEN now() + interval '1 year'
      WHEN p_new_plan_id LIKE '%monthly' THEN now() + interval '1 month'
      ELSE NULL
    END
  WHERE user_id = p_user_id
  RETURNING * INTO v_subscription;
  
  RETURN v_subscription;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_billing_history_user_id ON billing_history(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_history_created_at ON billing_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_feature ON usage_tracking(user_id, feature);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_period ON usage_tracking(period_start, period_end);
