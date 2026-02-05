-- ==========================================
-- MINIMAL BACKFILL (NO REFERRAL COLUMN NEEDED)
-- ==========================================
-- This creates the closure table with just self-references
-- You can add the referral logic later once we identify the correct column

DO $$
DECLARE
    profile_record RECORD;
    total_users INTEGER;
    processed_users INTEGER := 0;
BEGIN
    SELECT COUNT(*) INTO total_users FROM public.profiles WHERE user_id IS NOT NULL;
    RAISE NOTICE 'Creating self-references for % users...', total_users;

    FOR profile_record IN 
        SELECT user_id FROM public.profiles WHERE user_id IS NOT NULL
    LOOP
        processed_users := processed_users + 1;

        -- Self-reference only (depth 0)
        INSERT INTO public.user_closure (ancestor_id, descendant_id, depth)
        VALUES (profile_record.user_id, profile_record.user_id, 0)
        ON CONFLICT (ancestor_id, descendant_id) DO NOTHING;

        IF processed_users % 100 = 0 THEN
            RAISE NOTICE 'Processed % / % users', processed_users, total_users;
        END IF;
    END LOOP;

    RAISE NOTICE 'Complete! Created % self-references.', processed_users;
END $$;

-- Verify
SELECT COUNT(*) as total_records FROM public.user_closure;
