-- ============================================================================
-- CVARCHITECT: AUTOMATIC WELCOME EMAIL ON NEW USER SIGNUP (OPTION A)
-- ============================================================================
-- This script ensures that EVERY brand-new user (whether signing up via
-- Google OAuth, GitHub, or Email/Password) receives the branded welcome email.
--
-- You can set this up in TWO ways:
--
-- ----------------------------------------------------------------------------
-- METHOD 1 (RECOMMENDED - 30 SECONDS IN SUPABASE DASHBOARD):
-- ----------------------------------------------------------------------------
-- 1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/_/database/hooks
-- 2. Click "Create a webhook" (or "Database Webhooks")
-- 3. Fill in the fields:
--      Name:          send_welcome_email_on_signup
--      Table:         auth.users
--      Events:        [x] Insert  (uncheck Update and Delete)
--      Webhook Type:  Supabase Edge Functions
--      Edge Function: resend-email
--      HTTP Method:   POST
-- 4. Click "Create Webhook".
-- Done! The resend-email function now receives every new user and sends the email.
--
-- ----------------------------------------------------------------------------
-- METHOD 2 (VIA SQL SCRIPT BELOW IN SUPABASE SQL EDITOR):
-- ----------------------------------------------------------------------------
-- If you prefer using SQL directly with the pg_net extension, run the following:
--
-- NOTE: Replace YOUR_PROJECT_REF and YOUR_ANON_KEY below with your actual values:
-- (Found in Supabase Dashboard -> Project Settings -> API)
-- ============================================================================

-- 1. Enable pg_net extension for asynchronous HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Create the trigger function
CREATE OR REPLACE FUNCTION public.send_welcome_email_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_name text;
    user_email text;
    project_url text;
    anon_key text;
BEGIN
    user_email := NEW.email;
    user_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        ''
    );

    -- Skip if email is missing
    IF user_email IS NULL OR user_email = '' THEN
        RETURN NEW;
    END IF;

    -- Replace with your Supabase Project Reference and Anon Key if not using app.settings:
    -- Example project_url: 'https://xyzcompany.supabase.co'
    project_url := current_setting('app.settings.project_url', true);
    anon_key := current_setting('app.settings.anon_key', true);

    -- If not configured in postgres settings, set your actual URL directly here:
    IF project_url IS NULL OR project_url = '' THEN
        -- REPLACE THIS URL WITH YOUR SUPABASE URL:
        project_url := 'https://YOUR_PROJECT_REF.supabase.co';
    END IF;

    -- Trigger the Supabase Edge Function asynchronously (non-blocking)
    PERFORM
        net.http_post(
            url := project_url || '/functions/v1/resend-email',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || COALESCE(anon_key, 'YOUR_ANON_KEY')
            ),
            body := jsonb_build_object(
                'type', 'welcome',
                'email', user_email,
                'name', user_name
            )
        );

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Never fail the signup if the email trigger has an issue
        RAISE WARNING 'Welcome email trigger error: %', SQLERRM;
        RETURN NEW;
END;
$$;

-- 3. Drop existing trigger if it exists and recreate
DROP TRIGGER IF EXISTS tr_send_welcome_email ON auth.users;

CREATE TRIGGER tr_send_welcome_email
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.send_welcome_email_on_signup();
