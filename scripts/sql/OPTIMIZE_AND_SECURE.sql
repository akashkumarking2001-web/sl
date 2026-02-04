-- ==========================================
-- ROBUST OPTIMIZATION & SECURITY SCRIPT
-- ==========================================

-- 1. Ensure 'admin_notifications' exists since it's used by the app
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    message TEXT NOT NULL,
    is_broadcast BOOLEAN DEFAULT true,
    target_users UUID[] DEFAULT NULL
);

-- 2. ENABLE ROW LEVEL SECURITY (ONLY IF TABLE EXISTS)
DO $$ 
DECLARE 
    t text;
    tables_to_enable text[] := array[
        'profiles', 'admin_notifications', 'ads_management', 'agent_income', 
        'app_tasks', 'bank_accounts', 'completed_app_tasks', 'completed_whatsapp_tasks', 
        'course_progress', 'course_submissions', 'courses', 'income_settings', 
        'messages', 'package_purchase_requests', 'payment_proofs', 'payments', 
        'products', 'revenue_share_tree', 'user_roles', 'wallet_history', 
        'whatsapp_tasks', 'withdrawal_requests', 'task_income'
    ];
BEGIN
    FOREACH t IN ARRAY tables_to_enable LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t) THEN
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
        END IF;
    END LOOP;
END $$;

-- 3. DEFINE SECURITY POLICIES (ONLY IF TABLE EXISTS)

--------------------------------------------
-- PROFILES
--------------------------------------------
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
        CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
        
        DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
        CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
        
        DROP POLICY IF EXISTS "Admins have full access to profiles" ON public.profiles;
        CREATE POLICY "Admins have full access to profiles" ON public.profiles FOR ALL USING (auth.jwt() ->> 'email' = 'admin@ascendacademy.com');
    END IF;
END $$;

--------------------------------------------
-- USER-OWNED DATA (user_id check)
--------------------------------------------
DO $$ 
DECLARE 
    t text;
    tables_to_secure text[] := array[
        'agent_income', 'bank_accounts', 'completed_app_tasks', 'completed_whatsapp_tasks', 
        'course_progress', 'course_submissions', 'package_purchase_requests', 'payment_proofs', 
        'payments', 'wallet_history', 'withdrawal_requests', 'task_income'
    ];
BEGIN
    FOREACH t IN ARRAY tables_to_secure LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t) THEN
            EXECUTE format('DROP POLICY IF EXISTS "Users can view their own %I" ON public.%I', t, t);
            EXECUTE format('CREATE POLICY "Users can view their own %I" ON public.%I FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> ''email'' = ''admin@ascendacademy.com'')', t, t);
            
            EXECUTE format('DROP POLICY IF EXISTS "Users can insert their own %I" ON public.%I', t, t);
            EXECUTE format('CREATE POLICY "Users can insert their own %I" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', t, t);
            
            EXECUTE format('DROP POLICY IF EXISTS "Users can update their own %I" ON public.%I', t, t);
            EXECUTE format('CREATE POLICY "Users can update their own %I" ON public.%I FOR UPDATE USING (auth.uid() = user_id OR auth.jwt() ->> ''email'' = ''admin@ascendacademy.com'')', t, t);
        END IF;
    END LOOP;
END $$;

--------------------------------------------
-- PUBLIC READ-ONLY (Admins can manage)
--------------------------------------------
DO $$ 
DECLARE 
    t text;
    public_read_tables text[] := array[
        'ads_management', 'courses', 'products', 'app_tasks', 'whatsapp_tasks'
    ];
BEGIN
    FOREACH t IN ARRAY public_read_tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t) THEN
            EXECUTE format('DROP POLICY IF EXISTS "Anyone can view %I" ON public.%I', t, t);
            EXECUTE format('CREATE POLICY "Anyone can view %I" ON public.%I FOR SELECT USING (true)', t, t);
            
            EXECUTE format('DROP POLICY IF EXISTS "Admins can manage %I" ON public.%I', t, t);
            EXECUTE format('CREATE POLICY "Admins can manage %I" ON public.%I FOR ALL USING (auth.jwt() ->> ''email'' = ''admin@ascendacademy.com'')', t, t);
        END IF;
    END LOOP;
END $$;

--------------------------------------------
-- ADMIN ONLY DATA
--------------------------------------------
DO $$ 
DECLARE 
    t text;
    admin_only_tables text[] := array[
        'admin_notifications', 'income_settings', 'user_roles'
    ];
BEGIN
    FOREACH t IN ARRAY admin_only_tables LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t) THEN
            EXECUTE format('DROP POLICY IF EXISTS "Admins have full access to %I" ON public.%I', t, t);
            EXECUTE format('CREATE POLICY "Admins have full access to %I" ON public.%I FOR ALL USING (auth.jwt() ->> ''email'' = ''admin@ascendacademy.com'')', t, t);
        END IF;
    END LOOP;
END $$;

--------------------------------------------
-- MESSAGES (Public Insert, Admin Read/Update)
--------------------------------------------
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'messages') THEN
        DROP POLICY IF EXISTS "Anyone can send a message" ON public.messages;
        CREATE POLICY "Anyone can send a message" ON public.messages FOR INSERT WITH CHECK (true);
        
        DROP POLICY IF EXISTS "Admins can manage messages" ON public.messages;
        CREATE POLICY "Admins have full access to messages" ON public.messages FOR ALL USING (auth.jwt() ->> 'email' = 'admin@ascendacademy.com');
    END IF;
END $$;

-- 4. DATABASE OPTIMIZATION & ROLE MIGRATION
DO $$ BEGIN
    -- Add role to profiles if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'user';
    END IF;

    -- Migrate admins
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
        UPDATE public.profiles p
        SET role = 'admin'
        FROM public.user_roles ur
        WHERE p.user_id = ur.user_id AND ur.role = 'admin';
    END IF;

    -- Ensure master admin has correct role
    UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@ascendacademy.com';
END $$;
