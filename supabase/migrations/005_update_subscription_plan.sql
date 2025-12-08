-- Add update_subscription_plan function
CREATE OR REPLACE FUNCTION update_subscription_plan(
  p_user_id uuid,
  p_new_plan_id text
)
RETURNS subscriptions AS $$
DECLARE
  v_subscription subscriptions;
  v_new_plan_credits integer;
  v_plan_duration interval;
BEGIN
  -- Determine credits and duration based on plan
  -- Note: These values should technically come from a plans table or app config, 
  -- but we'll hardcode them here to match the frontend config for simplicity in this migration.
  
  -- Defualt values
  v_new_plan_credits := 0;
  
  CASE p_new_plan_id
    WHEN 'week_pass' THEN
      v_new_plan_credits := 75;
      v_plan_duration := interval '7 days';
    WHEN 'pro_quarterly' THEN
      v_new_plan_credits := 300;
      v_plan_duration := interval '3 months';
    WHEN 'lifetime' THEN
      v_new_plan_credits := 100;
      v_plan_duration := NULL; -- Infinite
    ELSE
      v_new_plan_credits := 3; -- Free
      v_plan_duration := NULL;
  END CASE;

  -- Upsert subscription
  INSERT INTO subscriptions (
    user_id, 
    plan_id, 
    status, 
    current_period_start, 
    current_period_end, 
    ai_credits,
    updated_at
  )
  VALUES (
    p_user_id,
    p_new_plan_id,
    'active',
    now(),
    CASE WHEN v_plan_duration IS NULL AND p_new_plan_id != 'lifetime' THEN NULL 
         WHEN p_new_plan_id = 'lifetime' THEN NULL
         ELSE now() + v_plan_duration END,
    v_new_plan_credits,
    now()
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    plan_id = EXCLUDED.plan_id,
    status = 'active',
    current_period_start = now(),
    current_period_end = EXCLUDED.current_period_end,
    ai_credits = CASE 
      -- If upgrading to a plan with more credits, usually we reset or add. 
      -- For simplicity, we'll set it to the new plan's starting credits to avoid accumulation abuse on plan switching.
      WHEN p_new_plan_id != subscriptions.plan_id THEN v_new_plan_credits
      ELSE subscriptions.ai_credits
    END,
    updated_at = now()
  RETURNING * INTO v_subscription;
  
  RETURN v_subscription;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
