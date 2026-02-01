-- Create email_verifications table
CREATE TABLE IF NOT EXISTS public.email_verifications (
    email TEXT PRIMARY KEY,
    token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.email_verifications ENABLE ROW LEVEL SECURITY;

-- Allow public insert (registration)
CREATE POLICY "Public insert email_verifications" ON public.email_verifications FOR INSERT WITH CHECK (true);

-- Allow public select (verification process)
CREATE POLICY "Public select email_verifications" ON public.email_verifications FOR SELECT USING (true);

-- Function to verify token
CREATE OR REPLACE FUNCTION public.verify_email_token(token_input TEXT)
RETURNS JSONB AS $$
DECLARE
    v_record RECORD;
BEGIN
    SELECT * INTO v_record FROM public.email_verifications WHERE token = token_input;
    
    IF v_record IS NULL THEN
        RETURN jsonb_build_object('success', false, 'message', 'Invalid token');
    END IF;
    
    IF v_record.expires_at < NOW() THEN
        RETURN jsonb_build_object('success', false, 'message', 'Token expired');
    END IF;
    
    -- Mark profile as active/verified
    UPDATE public.profiles SET status = 'active', is_active = true WHERE email = v_record.email;
    
    -- Delete the used token
    DELETE FROM public.email_verifications WHERE email = v_record.email;
    
    RETURN jsonb_build_object('success', true, 'message', 'Email verified successfully');
exception when others then
    return jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
