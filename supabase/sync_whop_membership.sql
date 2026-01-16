-- Supabase RPC function to sync Whop membership
-- This runs server-side with elevated permissions

CREATE OR REPLACE FUNCTION sync_whop_membership(
  p_user_id UUID,
  p_plan_id TEXT,
  p_credits INTEGER,
  p_billing_cycle TEXT,
  p_subscription_end TIMESTAMP WITH TIME ZONE,
  p_whop_membership_id TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSON;
BEGIN
  -- Upsert subscription
  INSERT INTO subscriptions (
    user_id,
    plan_id,
    credits,
    billing_cycle,
    subscription_start,
    subscription_end,
    is_active,
    whop_membership_id,
    updated_at
  )
  VALUES (
    p_user_id,
    p_plan_id,
    p_credits,
    p_billing_cycle,
    NOW(),
    p_subscription_end,
    true,
    p_whop_membership_id,
    NOW()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    plan_id = EXCLUDED.plan_id,
    credits = EXCLUDED.credits,
    billing_cycle = EXCLUDED.billing_cycle,
    subscription_end = EXCLUDED.subscription_end,
    is_active = EXCLUDED.is_active,
    whop_membership_id = EXCLUDED.whop_membership_id,
    updated_at = NOW()
  RETURNING to_json(subscriptions.*) INTO v_result;

  RETURN json_build_object(
    'success', true,
    'data', v_result
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION sync_whop_membership TO authenticated;
