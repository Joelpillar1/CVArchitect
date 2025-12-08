-- Change ai_credits and export_credits to numeric to allow fractional credits
ALTER TABLE subscriptions 
ALTER COLUMN ai_credits TYPE numeric(10, 2),
ALTER COLUMN export_credits TYPE numeric(10, 2);
