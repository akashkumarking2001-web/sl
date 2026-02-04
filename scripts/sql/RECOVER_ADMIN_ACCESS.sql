-- ==============================================================================
-- COMPREHENSIVE ADMIN RECOVERY & SCHEMA FIX (v4 - DYNAMIC PARSER BYPASS)
-- ==============================================================================

DO $$ 
DECLARE
    admin_id UUID;
    admin_email TEXT := 'admin@ascendacademy.com';
    has_id_col BOOLEAN;
    has_user_id_col BOOLEAN;
    record_exists BOOLEAN;
    query_str TEXT;
BEGIN 
    -- 1. SCHEMA FIX: Add missing columns if they are absent
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='profiles' AND column_name='purchased_plan') THEN
        ALTER TABLE public.profiles ADD COLUMN purchased_plan TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='profiles' AND column_name='package') THEN
        ALTER TABLE public.profiles ADD COLUMN package TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='profiles' AND column_name='has_purchased') THEN
        ALTER TABLE public.profiles ADD COLUMN has_purchased BOOLEAN DEFAULT false;
    END IF;

    -- 2. GET ADMIN AUTH ID
    SELECT id INTO admin_id FROM auth.users WHERE email = admin_email;

    IF admin_id IS NOT NULL THEN
        -- Check which ID columns exist
        SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='profiles' AND column_name='id') INTO has_id_col;
        SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name='profiles' AND column_name='user_id') INTO has_user_id_col;

        -- 3. PERFORM UPDATE (Dynamic SQL to handle missing columns)
        query_str := 'UPDATE public.profiles SET role = ''admin'', has_purchased = true, purchased_plan = ''TITAN'', email = $1, full_name = ''Master Admin'' WHERE email = $1';
        IF has_user_id_col THEN query_str := query_str || ' OR user_id = $2'; END IF;
        IF has_id_col THEN query_str := query_str || ' OR id = $2'; END IF;
        
        EXECUTE query_str USING admin_email, admin_id;

        -- 4. CHECK IF PROFILE EXISTS (Dynamic SQL to avoid parser errors)
        query_str := 'SELECT EXISTS (SELECT 1 FROM public.profiles WHERE email = $1';
        IF has_user_id_col THEN query_str := query_str || ' OR user_id = $2'; END IF;
        IF has_id_col THEN query_str := query_str || ' OR id = $2'; END IF;
        query_str := query_str || ')';
        
        EXECUTE query_str INTO record_exists USING admin_email, admin_id;

        -- 5. IF NO PROFILE EXISTS, CREATE ONE
        IF NOT record_exists THEN
            IF has_id_col AND has_user_id_col THEN
                INSERT INTO public.profiles (id, user_id, email, full_name, role, has_purchased, purchased_plan)
                VALUES (admin_id, admin_id, admin_email, 'Master Admin', 'admin', true, 'TITAN');
            ELSIF has_user_id_col THEN
                INSERT INTO public.profiles (user_id, email, full_name, role, has_purchased, purchased_plan)
                VALUES (admin_id, admin_email, 'Master Admin', 'admin', true, 'TITAN');
            ELSIF has_id_col THEN
                INSERT INTO public.profiles (id, email, full_name, role, has_purchased, purchased_plan)
                VALUES (admin_id, admin_email, 'Master Admin', 'admin', true, 'TITAN');
            ELSE
                -- Fallback to minimal insert if weird schema
                INSERT INTO public.profiles (email, full_name, role, has_purchased, purchased_plan)
                VALUES (admin_email, 'Master Admin', 'admin', true, 'TITAN');
            END IF;
        END IF;

        RAISE NOTICE 'Admin access recovered and schema verified for %', admin_email;
    ELSE
        RAISE NOTICE 'Critical: User % not found in auth.users. Create the account first.', admin_email;
    END IF;

END $$;
