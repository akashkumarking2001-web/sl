-- ==============================================================================
-- ASCEND ACADEMY: ULTIMATE REPAIR & SYNC SCRIPT (V2)
-- Targets: All Panel Sync issues, Database Errors, Registration & Purchasing.
-- ==============================================================================

-- 1. REPAIR 'PROFILES' TABLE
-- ------------------------------------------------------------------------------
-- Ensure all required columns exist for the UI and Business Logic
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_id TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_purchased BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS purchased_plan TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dob TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS package TEXT;

-- 2. REPAIR 'PAYMENTS' TABLE
-- ------------------------------------------------------------------------------
-- Ensure it can store package purchase requests correctly
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    plan_name TEXT, -- Matches PaymentGateway.tsx
    status TEXT DEFAULT 'pending', -- pending, approved, rejected
    transaction_id TEXT,
    screenshot_url TEXT,
    admin_notes TEXT,
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. REPAIR 'AGENT_INCOME' (WALLET)
-- ------------------------------------------------------------------------------
-- Ensure it tracks all income types correctly
ALTER TABLE public.agent_income ADD COLUMN IF NOT EXISTS referral_income NUMERIC DEFAULT 0;
ALTER TABLE public.agent_income ADD COLUMN IF NOT EXISTS level_income NUMERIC DEFAULT 0;
ALTER TABLE public.agent_income ADD COLUMN IF NOT EXISTS task_income NUMERIC DEFAULT 0;
ALTER TABLE public.agent_income ADD COLUMN IF NOT EXISTS share_income NUMERIC DEFAULT 0;

-- 4. MASTER USER SYNC TRIGGER (The "Real-time Sync" Fix)
-- ------------------------------------------------------------------------------
-- This is the core engine that ensures any new user gets a profile and wallet.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_student_id TEXT;
    v_referral_code TEXT;
BEGIN
    -- Use metadata if provided, else generate defaults
    v_student_id := COALESCE(NEW.raw_user_meta_data->>'student_id', 'SL' || (floor(random() * 90000000) + 10000000)::text);
    v_referral_code := COALESCE(NEW.raw_user_meta_data->>'referral_code', v_student_id);

    -- Insert Profile
    INSERT INTO public.profiles (
        user_id, 
        full_name, 
        email, 
        phone, 
        referral_code, 
        student_id,
        country,
        state,
        address,
        pincode,
        dob,
        role,
        status,
        has_purchased
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
        NEW.email,
        NEW.raw_user_meta_data->>'phone',
        UPPER(v_referral_code),
        UPPER(v_student_id),
        NEW.raw_user_meta_data->>'country',
        NEW.raw_user_meta_data->>'state',
        NEW.raw_user_meta_data->>'address',
        NEW.raw_user_meta_data->>'pincode',
        NEW.raw_user_meta_data->>'dob',
        COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
        'active',
        false
    )
    ON CONFLICT (user_id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(profiles.full_name, EXCLUDED.full_name);

    -- Insert Initial Wallet
    INSERT INTO public.agent_income (user_id, wallet, total_income)
    VALUES (NEW.id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. SECURE PERMISSIONS & RLS
-- ------------------------------------------------------------------------------
-- Ensure admin check function works
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Profile Read" ON public.profiles;
CREATE POLICY "Public Profile Read" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Owner Profile Update" ON public.profiles;
CREATE POLICY "Owner Profile Update" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS for Payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Owner View Payments" ON public.payments;
CREATE POLICY "Owner View Payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Owner Create Payment" ON public.payments;
CREATE POLICY "Owner Create Payment" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admin All Payments" ON public.payments;
CREATE POLICY "Admin All Payments" ON public.payments FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS for Site Settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    is_shopping_enabled BOOLEAN DEFAULT TRUE,
    maintenance_mode BOOLEAN DEFAULT FALSE,
    registration_open BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ensure global default exists
INSERT INTO public.site_settings (id, is_shopping_enabled) 
VALUES ('global', true) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Settings Read" ON public.site_settings;
CREATE POLICY "Public Settings Read" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin Settings Manage" ON public.site_settings;
CREATE POLICY "Admin Settings Manage" ON public.site_settings FOR ALL USING (has_role(auth.uid(), 'admin'));

-- 6. SYNC EXISTING GHOST USERS
-- ------------------------------------------------------------------------------
-- Fix any current users who don't have profiles or wallets
INSERT INTO public.profiles (user_id, email, full_name, role, status)
SELECT id, email, email, 'user', 'active'
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.profiles)
ON CONFLICT (user_id) DO NOTHING;

INSERT INTO public.agent_income (user_id, wallet, total_income)
SELECT id, 0, 0
FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.agent_income)
ON CONFLICT (user_id) DO NOTHING;

-- Special Case: Promote the hardcoded admin if they exist in auth.users
UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@ascendacademy.com';

-- 7. REFRESH REAL-TIME SUBSCRIPTIONS
-- ------------------------------------------------------------------------------
-- Re-initialize the realtime publication to include all new columns and tables
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
COMMIT;
