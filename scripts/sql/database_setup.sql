-- Skill Learners Academy - Advanced Database Core Setup
-- This script is idempotent (can be run safely even if tables already exist).

-- 1. Email Verifications Table (Safe Creation)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'email_verifications') THEN
        CREATE TABLE public.email_verifications (
            email TEXT PRIMARY KEY,
            token TEXT NOT NULL,
            expires_at TIMESTAMPTZ NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Enable Row Level Security (RLS)
        ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;
        
        -- Access Policies
        -- Allow registration flow to insert verification tokens
        CREATE POLICY "Enable insert for registration" ON public.email_verifications
            FOR INSERT WITH CHECK (true);

        -- Allow read access for verification process
        CREATE POLICY "Enable read for verification" ON public.email_verifications
            FOR SELECT USING (true);

        -- Allow deletion after verification
        CREATE POLICY "Enable delete for verification" ON public.email_verifications
            FOR DELETE USING (true);
    END IF;
END $$;

-- 2. Verify Email RPC Function (Handles the verification logic)
-- Drop existing function if it has a different return type to prevent conflicts
DROP FUNCTION IF EXISTS public.verify_email_token(text);

CREATE OR REPLACE FUNCTION public.verify_email_token(token_input text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated permissions to manage token cleanup
AS $$
DECLARE
    v_email text;
BEGIN
    -- Search for a matching, non-expired token
    SELECT email INTO v_email
    FROM public.email_verifications
    WHERE token = token_input
    AND expires_at > now();

    IF v_email IS NOT NULL THEN
        -- SUCCESS LOGIC
        -- Note: If you have a 'profiles' table, you can uncomment the line below to activate the user
        -- UPDATE public.profiles SET status = 'active', is_active = true WHERE email = v_email;
        
        -- Remove the used token
        DELETE FROM public.email_verifications WHERE email = v_email;
        
        RETURN json_build_object(
            'success', true, 
            'message', 'Email verified successfully. Your terminal is now active.'
        );
    ELSE
        -- FAILURE LOGIC
        RETURN json_build_object(
            'success', false, 
            'message', 'The verification link is invalid or has expired.'
        );
    END IF;
END;
$$;

-- 3. Grant Permissions
GRANT ALL ON public.email_verifications TO service_role;
GRANT EXECUTE ON FUNCTION public.verify_email_token(text) TO anon, authenticated, service_role;
