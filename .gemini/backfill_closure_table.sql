-- ==========================================
-- BACKFILL SCRIPT FOR USER CLOSURE TABLE
-- ==========================================
-- Run this AFTER you've successfully run database_upgrade_SAFE.sql

-- This version uses the correct column names from your actual schema

DO $$
DECLARE
    profile_record RECORD;
    total_users INTEGER;
    processed_users INTEGER := 0;
BEGIN
    -- Count total users
    SELECT COUNT(*) INTO total_users FROM public.profiles;
    RAISE NOTICE 'Starting backfill for % users...', total_users;

    -- Process each user in order of registration
    -- Using user_id as the primary identifier (not 'id')
    FOR profile_record IN 
        SELECT user_id, referred_by, created_at 
        FROM public.profiles 
        WHERE user_id IS NOT NULL
        ORDER BY created_at
    LOOP
        processed_users := processed_users + 1;

        -- Self-reference (depth 0)
        INSERT INTO public.user_closure (ancestor_id, descendant_id, depth)
        VALUES (profile_record.user_id, profile_record.user_id, 0)
        ON CONFLICT (ancestor_id, descendant_id) DO NOTHING;

        -- Ancestor paths (if user has a sponsor)
        IF profile_record.referred_by IS NOT NULL AND profile_record.referred_by != '' THEN
            INSERT INTO public.user_closure (ancestor_id, descendant_id, depth)
            SELECT uc.ancestor_id, profile_record.user_id, uc.depth + 1
            FROM public.user_closure uc
            WHERE uc.descendant_id = profile_record.referred_by
            ON CONFLICT (ancestor_id, descendant_id) DO NOTHING;
        END IF;

        -- Progress update every 100 users
        IF processed_users % 100 = 0 THEN
            RAISE NOTICE 'Processed % / % users', processed_users, total_users;
        END IF;
    END LOOP;

    RAISE NOTICE 'Backfill complete! Processed % users.', processed_users;
END $$;

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- 1. Check how many closure records were created
SELECT 
    'Total closure records' as metric,
    COUNT(*) as count
FROM public.user_closure;

-- 2. Check depth distribution
SELECT 
    depth as level,
    COUNT(*) as user_count
FROM public.user_closure
WHERE depth > 0
GROUP BY depth
ORDER BY depth;

-- 3. Sample: Show a user's downline structure
-- Replace the user_id in the WHERE clause with an actual user_id from your database
/*
SELECT 
    p.user_id,
    p.full_name,
    p.email,
    uc.depth as level,
    p.has_purchased
FROM public.user_closure uc
JOIN public.profiles p ON p.user_id = uc.descendant_id
WHERE uc.ancestor_id = 'REPLACE_WITH_ACTUAL_USER_ID'
AND uc.depth > 0
ORDER BY uc.depth, p.created_at
LIMIT 50;
*/

-- ==========================================
-- CREATE TRIGGER FOR NEW USERS
-- ==========================================

CREATE OR REPLACE FUNCTION public.maintain_user_closure()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Insert self-reference (depth 0)
    INSERT INTO public.user_closure (ancestor_id, descendant_id, depth)
    VALUES (NEW.user_id, NEW.user_id, 0)
    ON CONFLICT (ancestor_id, descendant_id) DO NOTHING;

    -- If user has a referrer, copy all ancestor paths
    IF NEW.referred_by IS NOT NULL AND NEW.referred_by != '' THEN
        INSERT INTO public.user_closure (ancestor_id, descendant_id, depth)
        SELECT uc.ancestor_id, NEW.user_id, uc.depth + 1
        FROM public.user_closure uc
        WHERE uc.descendant_id = NEW.referred_by
        ON CONFLICT (ancestor_id, descendant_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trg_maintain_user_closure ON public.profiles;

-- Create the trigger (will run on new user registrations)
CREATE TRIGGER trg_maintain_user_closure
    AFTER INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.maintain_user_closure();

-- ==========================================
-- SUCCESS!
-- ==========================================
-- Your closure table is now populated and will auto-update for new users.
-- 
-- Example usage in your app:
-- 
-- Get all downline members for a user:
-- SELECT * FROM user_closure WHERE ancestor_id = 'user_id_here' AND depth > 0;
-- 
-- Count downline by level:
-- SELECT depth, COUNT(*) FROM user_closure WHERE ancestor_id = 'user_id_here' GROUP BY depth;
