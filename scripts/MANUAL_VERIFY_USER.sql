-- ===================================================
-- MANUAL USER EMAIL VERIFICATION (SQL EDITOR)
-- ===================================================

-- Use this script to verify a user when they are stuck with "email not confirmed" error.

DO $$ 
DECLARE 
    target_email TEXT := 'aksasih2001@gmail.com'; -- Email from your screenshot
BEGIN
    -- 1. Update the auth.users table (Internal Supabase Auth)
    -- We only update email_confirmed_at as confirmed_at is generated automatically
    UPDATE auth.users 
    SET email_confirmed_at = NOW()
    WHERE email = target_email;

    -- 2. Update the public.profiles table (Application layer)
    UPDATE public.profiles
    SET status = 'active'
    WHERE email = target_email;

    RAISE NOTICE 'User % has been manually verified.', target_email;
END $$;