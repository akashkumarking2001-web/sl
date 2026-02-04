-- ==============================================================================
-- ASCEND ACADEMY: MASTER SYSTEM SYNC & LOGIC REPAIR (FINAL - V3)
-- ==============================================================================

-- 1. CORE TABLES (Ensure existence)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- create, update, delete, etc.
    entity_type TEXT NOT NULL, -- user, payment, task, etc.
    entity_id TEXT,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT,
    type TEXT, -- 'payment', 'user', 'withdrawal', 'task'
    is_read BOOLEAN DEFAULT FALSE,
    is_broadcast BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. UNIFY ADMIN CHECKING LOGIC
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. ENHANCE WALLET CREDITING
CREATE OR REPLACE FUNCTION public.internal_credit_wallet(
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
    v_col_name TEXT;
BEGIN
    -- Standard 10% platform fee
    v_net_income := p_amount * 0.90;
    v_deduction := p_amount * 0.10;

    -- Map income type to column
    v_col_name := CASE p_income_type
        WHEN 'referral' THEN 'referral_income'
        WHEN 'level' THEN 'level_income'
        WHEN 'spillover' THEN 'spillover_income'
        WHEN 'revenue_share' THEN 'revenue_share_income'
        WHEN 'task' THEN 'task_income'
        ELSE NULL
    END;

    IF v_col_name IS NOT NULL THEN
        EXECUTE format('
            INSERT INTO public.agent_income (user_id, wallet, total_income, %I)
            VALUES ($1, $2, $2, $2)
            ON CONFLICT (user_id) DO UPDATE
            SET wallet = agent_income.wallet + $2,
                total_income = agent_income.total_income + $2,
                %I = agent_income.%I + $2,
                updated_at = now()', v_col_name, v_col_name, v_col_name)
        USING p_user_id, v_net_income;
    ELSE
        INSERT INTO public.agent_income (user_id, wallet, total_income)
        VALUES (p_user_id, v_net_income, v_net_income)
        ON CONFLICT (user_id) DO UPDATE
        SET wallet = agent_income.wallet + EXCLUDED.wallet,
            total_income = agent_income.total_income + EXCLUDED.total_income,
            updated_at = now();
    END IF;

    -- Add to Ledger
    INSERT INTO public.wallet_history (user_id, amount, description, status, income_type, level_number, from_user_id)
    VALUES (p_user_id, v_net_income, p_description || ' (10% Tax Deducted)', 'credit', p_income_type, p_level, p_from_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. MASTER SYNC TRIGGER (Referral Code -> UUID)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_student_id TEXT;
    v_referral_code TEXT;
    v_sponsor_code TEXT;
    v_sponsor_uuid UUID;
BEGIN
    v_student_id := COALESCE(NEW.raw_user_meta_data->>'student_id', 'SL' || (floor(random() * 90000000) + 10000000)::text);
    v_referral_code := COALESCE(NEW.raw_user_meta_data->>'referral_code', v_student_id);
    v_sponsor_code := NEW.raw_user_meta_data->>'referred_by';

    IF v_sponsor_code IS NOT NULL AND v_sponsor_code != '' THEN
        SELECT id INTO v_sponsor_uuid FROM public.profiles 
        WHERE referral_code = UPPER(TRIM(v_sponsor_code)) OR student_id = UPPER(TRIM(v_sponsor_code)) LIMIT 1;
    END IF;

    INSERT INTO public.profiles (user_id, full_name, email, phone, referral_code, student_id, referred_by, status, role, has_purchased)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        UPPER(v_referral_code),
        UPPER(v_student_id),
        v_sponsor_uuid,
        'active',
        COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
        false
    ) ON CONFLICT (user_id) DO UPDATE SET
        email = EXCLUDED.email,
        referred_by = COALESCE(profiles.referred_by, EXCLUDED.referred_by);

    INSERT INTO public.agent_income (user_id, wallet, total_income)
    VALUES (NEW.id, 0, 0) ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. RLS POLICIES (Unified is_admin)
DO $$ 
BEGIN
    ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

DROP POLICY IF EXISTS "Public View Settings" ON public.site_settings;
CREATE POLICY "Public View Settings" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Manage Settings" ON public.site_settings;
CREATE POLICY "Admin Manage Settings" ON public.site_settings FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Admins View Audit" ON public.audit_logs;
CREATE POLICY "Admins View Audit" ON public.audit_logs FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admin Payments" ON public.payments;
CREATE POLICY "Admin Payments" ON public.payments FOR ALL USING (public.is_admin());

-- 6. REAL-TIME SUBSCRIPTION
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
COMMIT;
