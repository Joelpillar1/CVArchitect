-- RPC to get aggregated usage stats
CREATE OR REPLACE FUNCTION get_usage_summary(p_user_id uuid)
RETURNS TABLE (
  total_actions bigint,
  total_credits_used bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::bigint as total_actions,
    COALESCE(SUM(credits_cost), 0)::bigint as total_credits_used
  FROM usage_logs
  WHERE user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
