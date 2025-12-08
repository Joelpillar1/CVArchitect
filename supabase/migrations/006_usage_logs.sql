-- Create usage_logs table for granular usage tracking
CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  action text NOT NULL,
  credits_cost integer NOT NULL DEFAULT 0,
  remaining_credits integer NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Minimal metadata if needed
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage logs" ON usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage logs" ON usage_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS idx_usage_logs_user_date ON usage_logs(user_id, created_at DESC);

-- RPC to deduct credits and log usage in one transaction
CREATE OR REPLACE FUNCTION deduct_credits_with_log(
  p_user_id uuid,
  p_cost integer,
  p_action text,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS jsonb AS $$
DECLARE
  v_current_credits integer;
  v_new_credits integer;
  v_subscription subscriptions;
BEGIN
  -- Check current credits
  SELECT ai_credits INTO v_current_credits
  FROM subscriptions
  WHERE user_id = p_user_id;
  
  IF v_current_credits IS NULL THEN
    RAISE EXCEPTION 'Subscription not found';
  END IF;
  
  IF v_current_credits < p_cost THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;
  
  v_new_credits := v_current_credits - p_cost;
  
  -- Update subscription
  UPDATE subscriptions
  SET 
    ai_credits = v_new_credits,
    updated_at = now()
  WHERE user_id = p_user_id
  RETURNING * INTO v_subscription;
  
  -- Log usage
  INSERT INTO usage_logs (user_id, action, credits_cost, remaining_credits, metadata)
  VALUES (p_user_id, p_action, p_cost, v_new_credits, p_metadata);
  
  -- Also update the aggregate usage_tracking table (keep existing functionality)
  PERFORM track_usage(p_user_id, p_action);
  
  -- Return the updated subscription and new credit balance
  RETURN jsonb_build_object(
    'success', true,
    'new_credits', v_new_credits,
    'subscription', row_to_json(v_subscription)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
