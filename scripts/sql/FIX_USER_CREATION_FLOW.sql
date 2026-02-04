-- Fix: Create a Trigger to Automatically Create Profile on Signup
-- This ensures that every new user in auth.users gets a corresponding public.profiles record.

-- 1. Create the Handler Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_sponsor_id UUID;
    v_referred_by_code TEXT;
BEGIN
    -- Attempt to find sponsor if 'referred_by' is provided in metadata
    -- Assuming referred_by in metadata is the Sponsor's ID or Referral Code.
    -- If it's an ID, we cast it. If code, we might need a lookup (omitted for simplicity, assuming ID or safely ignoring).
    
    -- Extract 'referred_by' from metadata (safe access)
    v_referred_by_code := new.raw_user_meta_data->>'referred_by';

    -- Logic to resolve sponsor_id could go here. For now, we'll try to cast if it looks like a UUID
    -- Or if you use referral codes, you'd SELECT id FROM profiles WHERE referral_code = ...
    
    INSERT INTO public.profiles (
        user_id,
        full_name,
        phone_number,
        -- We can try to map metadata fields if they exist
        sponsor_id -- This might need more robust logic if passing referral codes instead of UUIDs
    )
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'New User'),
        new.raw_user_meta_data->>'phone',
        NULL -- Leaving sponsor null for now to avoid invalid UUID errors safely. Real referral linking should happen via Edge Function or robust lookup.
    );

    -- Create an empty Agent Income Wallet for the user immediately
    INSERT INTO public.agent_income (user_id, wallet, total_income)
    VALUES (new.id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the Trigger
-- Drop first to ensure idempotency
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill missing profiles for existing users (Critical Fix)
-- This finds any auth.users that DO NOT have a public.profiles record and creates one.
DO $$
DECLARE
    row record;
BEGIN
    FOR row IN SELECT * FROM auth.users WHERE id NOT IN (SELECT user_id FROM public.profiles) LOOP
        INSERT INTO public.profiles (user_id, full_name, phone_number)
        VALUES (
            row.id,
            COALESCE(row.raw_user_meta_data->>'full_name', 'Recovered User'),
            row.raw_user_meta_data->>'phone'
        );
        
        -- Create wallet if missing
        INSERT INTO public.agent_income (user_id, wallet, total_income)
        VALUES (row.id, 0, 0)
        ON CONFLICT (user_id) DO NOTHING;
    END LOOP;
END;
$$;
