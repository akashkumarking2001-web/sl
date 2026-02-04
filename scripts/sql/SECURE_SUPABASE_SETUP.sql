-- ==============================================================================
-- ASCEND ACADEMY: HIGH-SECURITY DATABASE SETUP (PARANOID MODE)
-- ==============================================================================
-- This script sets up the entire database schema with "Security First" principles.
-- 1. All IDs are UUIDs.
-- 2. Row Level Security (RLS) is enabled on ALL tables.
-- 3. Business Logic is moved to Database Functions (no frontend calculations).
-- 4. Strict Input Validation via Constraints.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. UTILITY FUNCTIONS
-- ==============================================================================

-- Function to update 'updated_at' column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ==============================================================================
-- 2. TABLE DEFINITIONS
-- ==============================================================================

-- 2.1 PROFILES (Extends auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT CHECK (char_length(full_name) >= 2),
    avatar_url TEXT,
    phone_number TEXT,
    sponsor_id UUID REFERENCES public.profiles(id), -- Direct Sponsor (Internal ID)
    referred_by UUID REFERENCES public.profiles(id), -- Placement Sponsor (Internal ID)
    spillover_count INT DEFAULT 0 CHECK (spillover_count >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2.2 USER ROLES (For Admin Access)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'user', 'moderator')) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, role)
);

-- 2.3 INCOME SETTINGS (Admin Configurable Logic)
CREATE TABLE public.income_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_name TEXT NOT NULL UNIQUE,
    referral_commission DECIMAL(10,2) DEFAULT 0 CHECK (referral_commission >= 0),
    -- Level Incomes (1-12)
    level_1_income DECIMAL(10,2) DEFAULT 0,
    level_2_income DECIMAL(10,2) DEFAULT 0,
    level_3_income DECIMAL(10,2) DEFAULT 0,
    level_4_income DECIMAL(10,2) DEFAULT 0,
    level_5_income DECIMAL(10,2) DEFAULT 0,
    level_6_income DECIMAL(10,2) DEFAULT 0,
    level_7_income DECIMAL(10,2) DEFAULT 0,
    level_8_income DECIMAL(10,2) DEFAULT 0,
    level_9_income DECIMAL(10,2) DEFAULT 0,
    level_10_income DECIMAL(10,2) DEFAULT 0,
    level_11_income DECIMAL(10,2) DEFAULT 0,
    level_12_income DECIMAL(10,2) DEFAULT 0,
    -- Spillover Milestones
    spillover_level_1 DECIMAL(10,2) DEFAULT 0,
    spillover_level_2 DECIMAL(10,2) DEFAULT 0,
    spillover_level_3 DECIMAL(10,2) DEFAULT 0,
    spillover_level_4 DECIMAL(10,2) DEFAULT 0,
    -- Revenue Share Milestones
    revenue_share_level_1 DECIMAL(10,2) DEFAULT 0,
    revenue_share_level_2 DECIMAL(10,2) DEFAULT 0,
    revenue_share_level_3 DECIMAL(10,2) DEFAULT 0,
    revenue_share_level_4 DECIMAL(10,2) DEFAULT 0,
    revenue_share_level_5 DECIMAL(10,2) DEFAULT 0,
    revenue_share_level_6 DECIMAL(10,2) DEFAULT 0,
    revenue_share_level_7 DECIMAL(10,2) DEFAULT 0,
    revenue_share_level_8 DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2.4 AGENT INCOME (The Wallet)
CREATE TABLE public.agent_income (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    wallet DECIMAL(12,2) DEFAULT 0 CHECK (wallet >= 0), -- Total Available Balance
    total_income DECIMAL(12,2) DEFAULT 0 CHECK (total_income >= 0), -- Lifetime Earnings
    withdrawn_amount DECIMAL(12,2) DEFAULT 0 CHECK (withdrawn_amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2.5 WALLET HISTORY (Ledger - Immutable Logs)
CREATE TABLE public.wallet_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    description TEXT NOT NULL,
    status TEXT CHECK (status IN ('credit', 'debit', 'pending', 'failed')) DEFAULT 'credit',
    income_type TEXT CHECK (income_type IN ('referral', 'level', 'spillover', 'revenue_share', 'task', 'deduction', 'withdrawal')),
    level_number INT,
    from_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2.6 REVENUE SHARE TREE (3xN Matrix Structure)
CREATE TABLE public.revenue_share_tree (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    package_type TEXT NOT NULL,
    -- Simple 3-leg structure tracking
    left_pos UUID REFERENCES auth.users(id),
    mid_pos UUID REFERENCES auth.users(id),
    right_pos UUID REFERENCES auth.users(id),
    downline_count INT DEFAULT 0 CHECK (downline_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, package_type)
);

-- 2.7 TASKS (Available Work)
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    reward_amount DECIMAL(10,2) NOT NULL CHECK (reward_amount > 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2.8 COMPLETED TASKS (Proof of Work)
CREATE TABLE public.completed_whatsapp_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    screenshot_url TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2.9 WITHDRAWAL REQUESTS
CREATE TABLE public.withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
    payment_method TEXT NOT NULL,
    payment_details TEXT NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'processed')) DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) - "THE DIGITAL WALL"
-- ==============================================================================

-- Enable RLS on ALL tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.income_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_share_tree ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_whatsapp_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- DEFINITIONS
-- Helper to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- POLICIES

-- PROFILES
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
-- Note: Insert is usually handled by auth trigger, but if client creates:
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- USER ROLES
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (is_admin());
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- INCOME SETTINGS
CREATE POLICY "Public read income settings" ON public.income_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.income_settings FOR ALL USING (is_admin());

-- AGENT INCOME
CREATE POLICY "Users view own wallet" ON public.agent_income FOR SELECT USING (auth.uid() = user_id);
-- CRITICAL: NO ONE (except DB functions) should update wallet directly via API. 
-- But existing frontend might try. strict security says 'false' for update/insert from public API.
-- We will allow SELECT only. Updates happen via Server Functions.

-- WALLET HISTORY
CREATE POLICY "Users view own history" ON public.wallet_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all history" ON public.wallet_history FOR SELECT USING (is_admin());

-- REVENUE SHARE TREE
CREATE POLICY "Users view own tree" ON public.revenue_share_tree FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all" ON public.revenue_share_tree FOR SELECT USING (is_admin());

-- TASKS
CREATE POLICY "Public view active tasks" ON public.tasks FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage tasks" ON public.tasks FOR ALL USING (is_admin());

-- COMPLETED TASKS
CREATE POLICY "Users view own submissions" ON public.completed_whatsapp_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users submit tasks" ON public.completed_whatsapp_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage submissions" ON public.completed_whatsapp_tasks FOR ALL USING (is_admin());

-- WITHDRAWAL REQUESTS
CREATE POLICY "Users view own requests" ON public.withdrawal_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create requests" ON public.withdrawal_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage requests" ON public.withdrawal_requests FOR ALL USING (is_admin());

-- ==============================================================================
-- 4. SERVER-SIDE LOGIC (DATABASE FUNCTIONS)
-- ==============================================================================

-- 4.1 CREDIT WALLET FUNCTION (Internal Helper)
CREATE OR REPLACE FUNCTION internal_credit_wallet(
    p_user_id UUID, 
    p_amount DECIMAL, 
    p_description TEXT, 
    p_income_type TEXT, 
    p_level INT DEFAULT NULL, 
    p_from_user_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_net_income DECIMAL;
    v_deduction DECIMAL;
BEGIN
    -- 90% to Wallet, 10% Deduction
    v_net_income := p_amount * 0.90;
    v_deduction := p_amount * 0.10;

    -- Upsert Wallet
    INSERT INTO public.agent_income (user_id, wallet, total_income)
    VALUES (p_user_id, v_net_income, v_net_income)
    ON CONFLICT (user_id) DO UPDATE
    SET wallet = agent_income.wallet + EXCLUDED.wallet,
        total_income = agent_income.total_income + EXCLUDED.total_income,
        updated_at = now();

    -- Log Credit
    INSERT INTO public.wallet_history (user_id, amount, description, status, income_type, level_number, from_user_id)
    VALUES (p_user_id, v_net_income, p_description || ' (10% Tax Deducted)', 'credit', p_income_type, p_level, p_from_user_id);

    -- Log Deduction (Optional, kept for audit)
    -- INSERT INTO public.wallet_history (user_id, amount, description, status, income_type, level_number, from_user_id)
    -- VALUES (p_user_id, v_deduction, '10% Platform Fee', 'deduction', 'deduction', p_level, p_from_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4.2 APPROVE TASK (Admin Only)
CREATE OR REPLACE FUNCTION approve_task_submission(submission_id UUID)
RETURNS VOID AS $$
DECLARE
    v_submission RECORD;
    v_task RECORD;
BEGIN
    -- Check Admin
    IF NOT is_admin() THEN
        RAISE EXCEPTION 'Access Denied: Admins Only';
    END IF;

    -- Get Submission
    SELECT * INTO v_submission FROM public.completed_whatsapp_tasks WHERE id = submission_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Submission not found'; END IF;

    IF v_submission.status = 'approved' THEN
        RAISE EXCEPTION 'Task already approved';
    END IF;

    -- Get Task Info
    SELECT * INTO v_task FROM public.tasks WHERE id = v_submission.task_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Task details not found'; END IF;

    -- Update Status
    UPDATE public.completed_whatsapp_tasks 
    SET status = 'approved', updated_at = now() 
    WHERE id = submission_id;

    -- Credit Wallet (Safe Logic)
    PERFORM internal_credit_wallet(
        v_submission.user_id, 
        v_task.reward_amount, 
        'Task Income: ' || v_task.title, 
        'task'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4.3 DISTRIBUTE ALL INCOMES (The Big Engine)
-- Call this when a package is purchased/approved
CREATE OR REPLACE FUNCTION distribute_package_income(
    p_buyer_id UUID, 
    p_package_name TEXT
)
RETURNS VOID AS $$
DECLARE
    v_settings RECORD;
    v_buyer_profile RECORD;
    v_sponsor_profile RECORD;
    v_current_sponsor_id UUID;
    v_level INT;
    v_amount DECIMAL;
    v_spillover_count INT;
    v_milestone RECORD;
    v_sponsor_tree RECORD;
    v_pos TEXT;
    v_new_downline_count INT;
    v_rev_threshold RECORD;
BEGIN
    -- 1. Fetch Settings
    SELECT * INTO v_settings FROM public.income_settings WHERE package_name = p_package_name;
    IF NOT FOUND THEN RAISE EXCEPTION 'Income settings not found for package %', p_package_name; END IF;

    -- 2. Fetch Buyer Profile
    SELECT * INTO v_buyer_profile FROM public.profiles WHERE user_id = p_buyer_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Buyer profile not found'; END IF;

    -- ====================================================
    -- A. DISTRIBUTE REFERRAL INCOME (Direct Sponsor)
    -- ====================================================
    IF v_buyer_profile.sponsor_id IS NOT NULL THEN
        SELECT * INTO v_sponsor_profile FROM public.profiles WHERE id = v_buyer_profile.sponsor_id;
        
        IF FOUND AND v_settings.referral_commission > 0 THEN
            PERFORM internal_credit_wallet(
                v_sponsor_profile.user_id,
                v_settings.referral_commission,
                'Referral Income - ' || p_package_name || ' from ' || COALESCE(v_buyer_profile.full_name, 'User'),
                'referral',
                NULL,
                p_buyer_id
            );
        END IF;
    END IF;

    -- ====================================================
    -- B. DISTRIBUTE LEVEL INCOME (12 Levels Up)
    -- ====================================================
    v_current_sponsor_id := COALESCE(v_buyer_profile.sponsor_id, v_buyer_profile.referred_by);
    
    FOR v_level IN 1..12 LOOP
        IF v_current_sponsor_id IS NULL THEN EXIT; END IF;

        -- Get current Upliner
        SELECT * INTO v_sponsor_profile FROM public.profiles WHERE id = v_current_sponsor_id;
        IF NOT FOUND THEN EXIT; END IF;

        -- Determine Amount based on Level
        v_amount := CASE v_level
            WHEN 1 THEN v_settings.level_1_income
            WHEN 2 THEN v_settings.level_2_income
            WHEN 3 THEN v_settings.level_3_income
            WHEN 4 THEN v_settings.level_4_income
            WHEN 5 THEN v_settings.level_5_income
            WHEN 6 THEN v_settings.level_6_income
            WHEN 7 THEN v_settings.level_7_income
            WHEN 8 THEN v_settings.level_8_income
            WHEN 9 THEN v_settings.level_9_income
            WHEN 10 THEN v_settings.level_10_income
            WHEN 11 THEN v_settings.level_11_income
            WHEN 12 THEN v_settings.level_12_income
            ELSE 0
        END;

        IF v_amount > 0 THEN
            PERFORM internal_credit_wallet(
                v_sponsor_profile.user_id,
                v_amount,
                'Level ' || v_level || ' Income - ' || p_package_name,
                'level',
                v_level,
                p_buyer_id
            );
        END IF;

        -- Move Up
        v_current_sponsor_id := COALESCE(v_sponsor_profile.sponsor_id, v_sponsor_profile.referred_by);
    END LOOP;

    -- ====================================================
    -- C. SPILLOVER MILESTONES (Sponsor's Count)
    -- ====================================================
    IF v_buyer_profile.sponsor_id IS NOT NULL THEN
        SELECT * INTO v_sponsor_profile FROM public.profiles WHERE id = v_buyer_profile.sponsor_id;
        IF FOUND THEN
            -- Increment Count
            UPDATE public.profiles 
            SET spillover_count = spillover_count + 1 
            WHERE id = v_sponsor_profile.id
            RETURNING spillover_count INTO v_spillover_count;

            -- Check Milestones (Hardcoded thresholds from TS)
            -- 5 members -> Level 1 amount
            IF v_spillover_count = 5 AND v_settings.spillover_level_1 > 0 THEN
               PERFORM internal_credit_wallet(v_sponsor_profile.user_id, v_settings.spillover_level_1, 'Spillover Bonus L1', 'spillover', 1);
            END IF;
            -- 30 members -> Level 2
            IF v_spillover_count = 30 AND v_settings.spillover_level_2 > 0 THEN
               PERFORM internal_credit_wallet(v_sponsor_profile.user_id, v_settings.spillover_level_2, 'Spillover Bonus L2', 'spillover', 2);
            END IF;
            -- 155 members -> Level 3
            IF v_spillover_count = 155 AND v_settings.spillover_level_3 > 0 THEN
               PERFORM internal_credit_wallet(v_sponsor_profile.user_id, v_settings.spillover_level_3, 'Spillover Bonus L3', 'spillover', 3);
            END IF;
            -- 625 members -> Level 4
            IF v_spillover_count = 625 AND v_settings.spillover_level_4 > 0 THEN
               PERFORM internal_credit_wallet(v_sponsor_profile.user_id, v_settings.spillover_level_4, 'Spillover Bonus L4', 'spillover', 4);
            END IF;
        END IF;
    END IF;

    -- ====================================================
    -- D. REVENUE SHARE TREE (3xN Matrix Placement)
    -- ====================================================
    -- 1. Create Tree Entry for New User
    INSERT INTO public.revenue_share_tree (user_id, package_type)
    VALUES (p_buyer_id, p_package_name)
    ON CONFLICT (user_id, package_type) DO NOTHING;

    -- 2. Find Sponsor's Tree Node (to place under)
    IF v_buyer_profile.sponsor_id IS NOT NULL OR v_buyer_profile.referred_by IS NOT NULL THEN
        v_current_sponsor_id := COALESCE(v_buyer_profile.sponsor_id, v_buyer_profile.referred_by);
        
        -- Get Sponsor's UserID
        SELECT user_id INTO v_sponsor_profile FROM public.profiles WHERE id = v_current_sponsor_id;
        
        IF FOUND THEN
            -- Check if Sponsor has a tree node
            SELECT * INTO v_sponsor_tree FROM public.revenue_share_tree 
            WHERE user_id = v_sponsor_profile.user_id AND package_type = p_package_name;

            IF FOUND THEN
                -- Find Empty Slot
                v_pos := NULL;
                IF v_sponsor_tree.left_pos IS NULL THEN v_pos := 'left_pos';
                ELSIF v_sponsor_tree.mid_pos IS NULL THEN v_pos := 'mid_pos';
                ELSIF v_sponsor_tree.right_pos IS NULL THEN v_pos := 'right_pos';
                END IF;

                IF v_pos IS NOT NULL THEN
                    v_new_downline_count := v_sponsor_tree.downline_count + 1;

                    -- Update Sponsor Tree
                    EXECUTE format('UPDATE public.revenue_share_tree SET %I = $1, downline_count = $2 WHERE id = $3', v_pos)
                    USING p_buyer_id, v_new_downline_count, v_sponsor_tree.id;

                    -- Check Completion (If Right Pos Filled -> Count likely reached threshold? Or implicitly?)
                    -- TS Logic checks specific counts. Let's do that.
                    
                    -- Thresholds (3, 12, 39, 120...)
                    CASE v_new_downline_count
                        WHEN 3 THEN v_amount := v_settings.revenue_share_level_1; v_level := 1;
                        WHEN 12 THEN v_amount := v_settings.revenue_share_level_2; v_level := 2;
                        WHEN 39 THEN v_amount := v_settings.revenue_share_level_3; v_level := 3;
                        WHEN 120 THEN v_amount := v_settings.revenue_share_level_4; v_level := 4;
                        WHEN 363 THEN v_amount := v_settings.revenue_share_level_5; v_level := 5;
                        WHEN 1092 THEN v_amount := v_settings.revenue_share_level_6; v_level := 6;
                        WHEN 3279 THEN v_amount := v_settings.revenue_share_level_7; v_level := 7;
                        WHEN 9840 THEN v_amount := v_settings.revenue_share_level_8; v_level := 8;
                        ELSE v_amount := 0;
                    END CASE;

                    IF v_amount > 0 THEN
                        PERFORM internal_credit_wallet(
                            v_sponsor_profile.user_id, 
                            v_amount, 
                            'Revenue Share Completion - Level ' || v_level, 
                            'revenue_share', 
                            v_level
                        );
                    END IF;
                END IF;
            ELSE
                 -- Create root node for sponsor if missing (edge case)
                 INSERT INTO public.revenue_share_tree (user_id, package_type, left_pos, downline_count)
                 VALUES (v_sponsor_profile.user_id, p_package_name, p_buyer_id, 1);
            END IF;
        END IF;
    END IF;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ==============================================================================
-- 5. TRIGGERS (AUTOMATION)
-- ==============================================================================

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_income_settings_updated_at BEFORE UPDATE ON public.income_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agent_income_updated_at BEFORE UPDATE ON public.agent_income FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_completed_whatsapp_tasks_updated_at BEFORE UPDATE ON public.completed_whatsapp_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- 6. DEFAULT DATA SEEDING
-- ==============================================================================

-- Insert Default Income Settings
INSERT INTO public.income_settings (package_name, referral_commission, level_1_income, level_2_income, level_3_income, level_4_income, level_5_income, level_6_income, level_7_income, level_8_income, level_9_income, level_10_income, level_11_income, level_12_income, spillover_level_1, spillover_level_2, spillover_level_3, spillover_level_4, revenue_share_level_1, revenue_share_level_2, revenue_share_level_3, revenue_share_level_4, revenue_share_level_5, revenue_share_level_6, revenue_share_level_7, revenue_share_level_8)
VALUES 
    ('Bronze', 100, 20, 15, 10, 8, 6, 5, 4, 3, 2, 2, 2, 2, 50, 100, 200, 500, 25, 50, 100, 200, 400, 800, 1600, 3200),
    ('Silver', 200, 40, 30, 20, 15, 12, 10, 8, 6, 4, 4, 4, 4, 100, 200, 400, 1000, 50, 100, 200, 400, 800, 1600, 3200, 6400),
    ('Gold', 400, 80, 60, 40, 30, 24, 20, 16, 12, 8, 8, 8, 8, 200, 400, 800, 2000, 100, 200, 400, 800, 1600, 3200, 6400, 12800),
    ('Platinum', 800, 160, 120, 80, 60, 48, 40, 32, 24, 16, 16, 16, 16, 400, 800, 1600, 4000, 200, 400, 800, 1600, 3200, 6400, 12800, 25600),
    ('Diamond', 1600, 320, 240, 160, 120, 96, 80, 64, 48, 32, 32, 32, 32, 800, 1600, 3200, 8000, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200)
ON CONFLICT (package_name) DO NOTHING;

-- ==============================================================================
-- 7. STORAGE BUCKETS & SECURITY
-- ==============================================================================
-- Automatically create storage buckets and apply RLS
-- Note: 'storage' schema is standard in Supabase

-- Insert buckets if not exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('avatars', 'avatars', true),
  ('task_proofs', 'task_proofs', false), -- Sensitive: Only Admin & Owner see
  ('payment_proofs', 'payment_proofs', false) -- Sensitive
ON CONFLICT (id) DO NOTHING;

-- STORAGE POLICIES
-- 1. Avatars (Public View, Owner Update)
CREATE POLICY "Public Avatars View" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "User Avatar Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid() = owner);
CREATE POLICY "User Avatar Update" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid() = owner);

-- 2. Task Proofs (Admin View, Owner Upload)
CREATE POLICY "Task Proof Admin View" ON storage.objects FOR SELECT USING (bucket_id = 'task_proofs' AND (auth.uid() = owner OR is_admin()));
CREATE POLICY "Task Proof Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'task_proofs' AND auth.uid() = owner);

-- 3. Payment Proofs (Admin View, Owner Upload)
CREATE POLICY "Payment Proof Admin View" ON storage.objects FOR SELECT USING (bucket_id = 'payment_proofs' AND (auth.uid() = owner OR is_admin()));
CREATE POLICY "Payment Proof Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment_proofs' AND auth.uid() = owner);

-- End of Script
