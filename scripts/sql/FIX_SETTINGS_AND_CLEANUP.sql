-- ==============================================================================
-- FIX: PACKAGE NAME MISMATCH & DATA CLEANUP (ROBUST)
-- ==============================================================================
-- 1. Updates Income Settings to match Frontend Names.
-- 2. Safely wipes failed test data by breaking Foreign Key relationships first.
-- ==============================================================================

DO $$
DECLARE
    -- No variables needed for pure SQL deletions properly sequenced
BEGIN
    RAISE NOTICE 'Starting Cleanup...';

    -- 1. CLEANUP WALLET & INCOME (Cascade usually handles this, but explicit is safer)
    DELETE FROM public.wallet_history WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'test_user_%@test.com');
    DELETE FROM public.agent_income WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'test_user_%@test.com');

    -- 2. BREAK REVENUE SHARE TREE LINKS (Critical for FK errors)
    -- Remove references TO test users from ANY node (including Root Admin's node)
    UPDATE public.revenue_share_tree 
    SET left_pos = NULL 
    WHERE left_pos IN (SELECT id FROM auth.users WHERE email LIKE 'test_user_%@test.com');

    UPDATE public.revenue_share_tree 
    SET mid_pos = NULL 
    WHERE mid_pos IN (SELECT id FROM auth.users WHERE email LIKE 'test_user_%@test.com');

    UPDATE public.revenue_share_tree 
    SET right_pos = NULL 
    WHERE right_pos IN (SELECT id FROM auth.users WHERE email LIKE 'test_user_%@test.com');

    -- 3. DELETE REVENUE SHARE NODES of test users
    DELETE FROM public.revenue_share_tree WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'test_user_%@test.com');

    -- 4. BREAK PROFILE LINKS (Sponsors)
    UPDATE public.profiles 
    SET sponsor_id = NULL 
    WHERE sponsor_id IN (SELECT id FROM public.profiles WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'test_user_%@test.com'));

    UPDATE public.profiles 
    SET referred_by = NULL 
    WHERE referred_by IN (SELECT id FROM public.profiles WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'test_user_%@test.com'));

    -- 5. DELETE PROFILES
    DELETE FROM public.profiles WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE 'test_user_%@test.com');

    -- 6. DELETE USERS
    DELETE FROM auth.users WHERE email LIKE 'test_user_%@test.com';

    RAISE NOTICE 'Cleanup Completed.';
END $$;


-- B. UPDATE INCOME SETTINGS
-- We map the old names to new names to preserve the values

-- 1. SPARK (was Bronze)
INSERT INTO public.income_settings (package_name, referral_commission, level_1_income, level_2_income, level_3_income, level_4_income, level_5_income, level_6_income, level_7_income, level_8_income, level_9_income, level_10_income, level_11_income, level_12_income, spillover_level_1, spillover_level_2, spillover_level_3, spillover_level_4, revenue_share_level_1, revenue_share_level_2, revenue_share_level_3, revenue_share_level_4, revenue_share_level_5, revenue_share_level_6, revenue_share_level_7, revenue_share_level_8)
VALUES ('SPARK', 100, 20, 15, 10, 8, 6, 5, 4, 3, 2, 2, 2, 2, 50, 100, 200, 500, 25, 50, 100, 200, 400, 800, 1600, 3200)
ON CONFLICT (package_name) DO NOTHING;

-- 2. MOMENTUM (was Silver)
INSERT INTO public.income_settings (package_name, referral_commission, level_1_income, level_2_income, level_3_income, level_4_income, level_5_income, level_6_income, level_7_income, level_8_income, level_9_income, level_10_income, level_11_income, level_12_income, spillover_level_1, spillover_level_2, spillover_level_3, spillover_level_4, revenue_share_level_1, revenue_share_level_2, revenue_share_level_3, revenue_share_level_4, revenue_share_level_5, revenue_share_level_6, revenue_share_level_7, revenue_share_level_8)
VALUES ('MOMENTUM', 200, 40, 30, 20, 15, 12, 10, 8, 6, 4, 4, 4, 4, 100, 200, 400, 1000, 50, 100, 200, 400, 800, 1600, 3200, 6400)
ON CONFLICT (package_name) DO NOTHING;

-- 3. SUMMIT (was Gold)
INSERT INTO public.income_settings (package_name, referral_commission, level_1_income, level_2_income, level_3_income, level_4_income, level_5_income, level_6_income, level_7_income, level_8_income, level_9_income, level_10_income, level_11_income, level_12_income, spillover_level_1, spillover_level_2, spillover_level_3, spillover_level_4, revenue_share_level_1, revenue_share_level_2, revenue_share_level_3, revenue_share_level_4, revenue_share_level_5, revenue_share_level_6, revenue_share_level_7, revenue_share_level_8)
VALUES ('SUMMIT', 400, 80, 60, 40, 30, 24, 20, 16, 12, 8, 8, 8, 8, 200, 400, 800, 2000, 100, 200, 400, 800, 1600, 3200, 6400, 12800)
ON CONFLICT (package_name) DO NOTHING;

-- 4. TITAN (was Platinum)
INSERT INTO public.income_settings (package_name, referral_commission, level_1_income, level_2_income, level_3_income, level_4_income, level_5_income, level_6_income, level_7_income, level_8_income, level_9_income, level_10_income, level_11_income, level_12_income, spillover_level_1, spillover_level_2, spillover_level_3, spillover_level_4, revenue_share_level_1, revenue_share_level_2, revenue_share_level_3, revenue_share_level_4, revenue_share_level_5, revenue_share_level_6, revenue_share_level_7, revenue_share_level_8)
VALUES ('TITAN', 800, 160, 120, 80, 60, 48, 40, 32, 24, 16, 16, 16, 16, 400, 800, 1600, 4000, 200, 400, 800, 1600, 3200, 6400, 12800, 25600)
ON CONFLICT (package_name) DO NOTHING;

-- 5. LEGACY (was Diamond)
INSERT INTO public.income_settings (package_name, referral_commission, level_1_income, level_2_income, level_3_income, level_4_income, level_5_income, level_6_income, level_7_income, level_8_income, level_9_income, level_10_income, level_11_income, level_12_income, spillover_level_1, spillover_level_2, spillover_level_3, spillover_level_4, revenue_share_level_1, revenue_share_level_2, revenue_share_level_3, revenue_share_level_4, revenue_share_level_5, revenue_share_level_6, revenue_share_level_7, revenue_share_level_8)
VALUES ('LEGACY', 1600, 320, 240, 160, 120, 96, 80, 64, 48, 32, 32, 32, 32, 800, 1600, 3200, 8000, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200)
ON CONFLICT (package_name) DO NOTHING;
