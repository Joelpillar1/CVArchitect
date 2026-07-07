-- Allow new Dodo pricing plan IDs in subscriptions.plan_id
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS valid_plan_id;

ALTER TABLE public.subscriptions
ADD CONSTRAINT valid_plan_id
CHECK (plan_id IN (
  'free',
  'week_pass', 'pro_monthly', 'pro_quarterly', 'lifetime',
  'sprint', 'build', 'blueprint'
));
