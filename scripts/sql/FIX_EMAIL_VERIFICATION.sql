-- Function to allow Admins to manually confirm a user's email address
-- This updates the protected auth.users table which controls the actual login blocking.

CREATE OR REPLACE FUNCTION admin_confirm_user_email(target_user_id UUID)
RETURNS VOID
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- 1. Security Check: ensure the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Only admins can verify emails.';
  END IF;

  -- 2. Update the system auth table (This enables login)
  UPDATE auth.users
  SET email_confirmed_at = CASE WHEN email_confirmed_at IS NULL THEN NOW() ELSE email_confirmed_at END,
      updated_at = NOW(),
      raw_app_meta_data = 
        CASE 
          WHEN raw_app_meta_data IS NULL THEN '{"provider": "email", "providers": ["email"]}'::jsonb
          ELSE raw_app_meta_data || '{"provider": "email", "providers": ["email"]}'::jsonb 
        END
  WHERE id = target_user_id;
  
  -- 3. Update the public profile (This updates the UI badge)
  UPDATE public.profiles
  SET is_email_verified = true
  WHERE user_id = target_user_id;

END;
$$ LANGUAGE plpgsql;

-- Grant access to authenticated users (The function itself checks for admin role)
GRANT EXECUTE ON FUNCTION admin_confirm_user_email(UUID) TO authenticated;
