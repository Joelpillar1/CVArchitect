-- ============================================
-- System.io Email Marketing Integration
-- ============================================
-- This script adds System.io integration to your signup flow
-- It modifies the handle_new_user() function to automatically
-- add new users to your System.io email list/sequence
-- ============================================

-- Enable pg_net extension for HTTP requests (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ============================================
-- UPDATED TRIGGER FUNCTION
-- ============================================
-- This function now calls the System.io Edge Function after creating profile/subscription

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    edge_function_url text;
    user_email text;
    user_full_name text;
    first_name text;
    last_name text;
    name_parts text[];
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        NOW(),
        NOW()
    );
    
    -- Create default subscription (Free plan with 10 credits)
    INSERT INTO public.subscriptions (
        user_id,
        plan_id,
        credits,
        is_active,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        'free',
        10,
        true,
        NOW(),
        NOW()
    );
    
    -- ============================================
    -- SYSTEM.IO INTEGRATION
    -- ============================================
    -- Add user to System.io email marketing platform
    -- This runs asynchronously and won't block signup if it fails
    
    user_email := NEW.email;
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
    
    -- Parse first and last name from full_name
    IF user_full_name != '' THEN
        name_parts := string_to_array(trim(user_full_name), ' ');
        first_name := name_parts[1];
        IF array_length(name_parts, 1) > 1 THEN
            last_name := array_to_string(name_parts[2:], ' ');
        END IF;
    END IF;
    
    -- Get Edge Function URL from environment variable or use default
    -- Replace YOUR_PROJECT_REF with your Supabase project reference
    edge_function_url := current_setting('app.settings.edge_function_url', true);
    
    -- If not set, construct from Supabase project URL
    -- You'll need to replace 'YOUR_PROJECT_REF' with your actual project reference
    IF edge_function_url IS NULL OR edge_function_url = '' THEN
        -- Example: https://YOUR_PROJECT_REF.supabase.co/functions/v1/systemio-subscribe
        -- You can set this via: ALTER DATABASE postgres SET app.settings.edge_function_url = 'https://...';
        -- Or hardcode it below (less secure but simpler)
        edge_function_url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/systemio-subscribe';
    END IF;
    
    -- Call System.io Edge Function asynchronously
    -- This won't block signup if it fails
    PERFORM
        net.http_post(
            url := edge_function_url,
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
            ),
            body := jsonb_build_object(
                'email', user_email,
                'first_name', COALESCE(first_name, ''),
                'last_name', COALESCE(last_name, ''),
                'tags', ARRAY['new-signup', 'cv-architect-user'],
                'custom_fields', jsonb_build_object(
                    'user_id', NEW.id::text,
                    'signup_date', NOW()::text,
                    'plan', 'free'
                )
            )
        );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail signup
        RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
        -- Still return NEW so signup succeeds even if email integration fails
        RETURN NEW;
END;
$$;

-- ============================================
-- ALTERNATIVE: Simple HTTP Request (if pg_net doesn't work)
-- ============================================
-- If the above doesn't work, you can use this simpler approach
-- that uses Supabase's built-in HTTP extension

/*
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_email text;
    user_full_name text;
    first_name text;
    last_name text;
    name_parts text[];
BEGIN
    -- Create profile
    INSERT INTO public.profiles (id, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        NOW(),
        NOW()
    );
    
    -- Create default subscription
    INSERT INTO public.subscriptions (
        user_id,
        plan_id,
        credits,
        is_active,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        'free',
        10,
        true,
        NOW(),
        NOW()
    );
    
    -- Extract user info for System.io
    user_email := NEW.email;
    user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
    
    IF user_full_name != '' THEN
        name_parts := string_to_array(trim(user_full_name), ' ');
        first_name := name_parts[1];
        IF array_length(name_parts, 1) > 1 THEN
            last_name := array_to_string(name_parts[2:], ' ');
        END IF;
    END IF;
    
    -- Note: Direct HTTP calls from triggers can be complex
    -- The Edge Function approach above is recommended
    -- This is a placeholder - you may need to use a different method
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error creating user data: %', SQLERRM;
        RETURN NEW;
END;
$$;
*/

-- ============================================
-- VERIFY TRIGGER EXISTS
-- ============================================
-- The trigger should already exist, but verify:
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SETUP INSTRUCTIONS
-- ============================================
-- 1. Deploy the Edge Function:
--    - In Supabase Dashboard → Edge Functions
--    - Create new function: systemio-subscribe
--    - Copy code from supabase/functions/systemio-subscribe/index.ts
--    - Deploy
--
-- 2. Set Environment Variables in Supabase:
--    - Go to Project Settings → Edge Functions → Secrets
--    - Add: SYSTEMIO_API_KEY = your_api_key_here
--    - Add: SYSTEMIO_LIST_ID = your_list_id_here (optional)
--
-- 3. Get your System.io API Key:
--    - Log into System.io
--    - Go to Settings → API
--    - Generate/Copy your API key
--
-- 4. Get your System.io List/Sequence ID:
--    - In System.io, go to your email list or sequence
--    - Copy the ID from the URL or settings
--
-- 5. Update Edge Function URL in this SQL:
--    - Replace 'YOUR_PROJECT_REF' with your Supabase project reference
--    - Or set it via: ALTER DATABASE postgres SET app.settings.edge_function_url = 'https://...';
--
-- 6. Run this SQL script in Supabase SQL Editor
--
-- 7. Test by creating a new user account
