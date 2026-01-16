-- Allow users to update their own subscription
-- This is simpler than RPC and should work immediately

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can update own subscription" ON subscriptions;

-- Create policy to allow users to update their own subscription
CREATE POLICY "Users can update own subscription"
ON subscriptions
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure users can also insert their own subscription
DROP POLICY IF EXISTS "Users can insert own subscription" ON subscriptions;

CREATE POLICY "Users can insert own subscription"
ON subscriptions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
