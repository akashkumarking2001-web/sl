-- ==============================================================================
-- SQL STRESS TEST: 100 USER SIMULATION
-- ==============================================================================
-- This script simulates the registration and package purchase of 100 users.
-- It populates the database and triggers the Income Distribution Logic.
--
-- INSTRUCTIONS:
-- 1. Run 'FIX_REVENUE_SHARE_LOGIC.sql' FIRST to ensure the logic handles the load.
-- 2. Run this script in the Supabase SQL Editor.
-- ==============================================================================

DO $$
DECLARE
    root_id UUID;
    new_user_id UUID;
    i INT;
    v_sponsor_id UUID;
    v_package TEXT := 'TITAN'; -- Testing with High Tier
    v_packages TEXT[] := ARRAY['SPARK', 'MOMENTUM', 'SUMMIT', 'TITAN', 'LEGACY'];
    v_random_pkg TEXT;
BEGIN
    RAISE NOTICE 'Starting Stress Test...';

    -- 1. Ensure Root User Exists
    SELECT id INTO root_id FROM public.profiles ORDER BY joined_at ASC LIMIT 1;
    
    IF root_id IS NULL THEN
       -- Create Root (Mock Auth)
       root_id := uuid_generate_v4();
       INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at) 
       VALUES (root_id, 'admin@ascend.com', 'hashed_password', now());
       
       INSERT INTO public.profiles (user_id, full_name, is_active) 
       VALUES (root_id, 'Ascend Admin', true);
       
       -- Initial Tree Node for Root
       INSERT INTO public.revenue_share_tree (user_id, package_type) VALUES (root_id, 'TITAN');
       INSERT INTO public.revenue_share_tree (user_id, package_type) VALUES (root_id, 'SPARK');
       INSERT INTO public.revenue_share_tree (user_id, package_type) VALUES (root_id, 'MOMENTUM');
       INSERT INTO public.revenue_share_tree (user_id, package_type) VALUES (root_id, 'SUMMIT');
       INSERT INTO public.revenue_share_tree (user_id, package_type) VALUES (root_id, 'LEGACY');
       
       RAISE NOTICE 'Created Root User: %', root_id;
    ELSE
       RAISE NOTICE 'Using Existing Root User: %', root_id;
    END IF;

    -- 2. Loop 100 Times
    FOR i IN 1..100 LOOP
        new_user_id := uuid_generate_v4();
        
        -- Pick Random Sponsor from existing pool to ensure tree depth
        SELECT id INTO v_sponsor_id FROM public.profiles ORDER BY random() LIMIT 1;
        
        -- Pick Random Package
        v_random_pkg := v_packages[floor(random() * 5 + 1)];

        -- Insert User (Mock Auth)
        INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at) 
        VALUES (new_user_id, 'test_user_' || i || '@test.com', '$2a$10$abcdefg', now());

        -- Insert Profile
        INSERT INTO public.profiles (user_id, full_name, sponsor_id, phone_number)
        VALUES (new_user_id, 'Test User ' || i, v_sponsor_id, '555-01' || i);

        -- Distribute Income immediately (Simulate Approval)
        -- We wrap in BEGIN/EXCEPTION to ensure one failure doesn't stop the whole test
        BEGIN
            PERFORM distribute_package_income(new_user_id, v_random_pkg);
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error processing user %: %', i, SQLERRM;
        END;
        
    END LOOP;
    
    RAISE NOTICE 'Stress Test Completed. 100 Users Added.';
END $$;
