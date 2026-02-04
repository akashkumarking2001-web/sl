-- ==============================================================================
-- FINAL DEPLOYMENT: MONEY WORLD (Withdrawals, Tasks, Ads)
-- Run this script to finalize all "Money World" features.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. WITHDRAWAL SYSTEM
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    bank_details JSONB,
    request_date TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own withdrawals" ON public.withdrawal_requests;
CREATE POLICY "Users can view own withdrawals" ON public.withdrawal_requests FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create withdrawals" ON public.withdrawal_requests;
CREATE POLICY "Users can create withdrawals" ON public.withdrawal_requests FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage withdrawals" ON public.withdrawal_requests;
CREATE POLICY "Admins can manage withdrawals" ON public.withdrawal_requests FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP TRIGGER IF EXISTS update_withdrawal_requests_updated_at ON public.withdrawal_requests;
CREATE TRIGGER update_withdrawal_requests_updated_at BEFORE UPDATE ON public.withdrawal_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ------------------------------------------------------------------------------
-- 2. ADS MANAGEMENT
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ads_management (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ads_title TEXT NOT NULL,
    ads_vendor TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.ads_management ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view ads" ON public.ads_management;
CREATE POLICY "Public view ads" ON public.ads_management FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage ads" ON public.ads_management;
CREATE POLICY "Admins manage ads" ON public.ads_management FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP TRIGGER IF EXISTS update_ads_management_updated_at ON public.ads_management;
CREATE TRIGGER update_ads_management_updated_at BEFORE UPDATE ON public.ads_management FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- ------------------------------------------------------------------------------
-- 3. TASKS SYSTEM (WhatsApp & Active Tasks)
-- ------------------------------------------------------------------------------

-- Tables
CREATE TABLE IF NOT EXISTS public.whatsapp_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_title TEXT NOT NULL,
    task_description TEXT,
    requirements TEXT,
    task_amount NUMERIC NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.app_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_title TEXT NOT NULL,
    task_description TEXT,
    requirements TEXT,
    optional_url_1 TEXT,
    optional_url_2 TEXT,
    task_amount NUMERIC NOT NULL,
    proof_type TEXT DEFAULT 'screenshot',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.completed_whatsapp_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    task_id UUID REFERENCES public.whatsapp_tasks(id) ON DELETE CASCADE,
    file_paths TEXT[],
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.completed_app_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    task_id UUID REFERENCES public.app_tasks(id) ON DELETE CASCADE,
    file_paths TEXT[],
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.whatsapp_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_whatsapp_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_app_tasks ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public view active tasks" ON public.whatsapp_tasks;
CREATE POLICY "Public view active tasks" ON public.whatsapp_tasks FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admin manage tasks" ON public.whatsapp_tasks;
CREATE POLICY "Admin manage tasks" ON public.whatsapp_tasks FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Public view active app tasks" ON public.app_tasks;
CREATE POLICY "Public view active app tasks" ON public.app_tasks FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admin manage app tasks" ON public.app_tasks;
CREATE POLICY "Admin manage app tasks" ON public.app_tasks FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users manage own submissions" ON public.completed_whatsapp_tasks;
CREATE POLICY "Users manage own submissions" ON public.completed_whatsapp_tasks FOR ALL USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Admin manage submissions" ON public.completed_whatsapp_tasks;
CREATE POLICY "Admin manage submissions" ON public.completed_whatsapp_tasks FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users manage own app submissions" ON public.completed_app_tasks;
CREATE POLICY "Users manage own app submissions" ON public.completed_app_tasks FOR ALL USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Admin manage app submissions" ON public.completed_app_tasks;
CREATE POLICY "Admin manage app submissions" ON public.completed_app_tasks FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- RPC Functions

-- A. Approve WhatsApp Task
-- Drop first to avoid return type conflicts if it exists with different signature
DROP FUNCTION IF EXISTS public.approve_task_submission(UUID);

CREATE OR REPLACE FUNCTION public.approve_task_submission(submission_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_submission RECORD;
    v_task_amount NUMERIC;
    v_user_id UUID;
BEGIN
    SELECT * INTO v_submission FROM public.completed_whatsapp_tasks WHERE id = submission_id;
    IF v_submission IS NULL THEN RETURN FALSE; END IF;
    
    SELECT task_amount INTO v_task_amount FROM public.whatsapp_tasks WHERE id = v_submission.task_id;
    v_user_id := v_submission.user_id;

    UPDATE public.completed_whatsapp_tasks 
    SET payment_status = 'approved', status = 'approved', processed_at = NOW() 
    WHERE id = submission_id;

    INSERT INTO public.agent_income (user_id, task_income, wallet)
    VALUES (v_user_id, v_task_amount, v_task_amount)
    ON CONFLICT (user_id) DO UPDATE 
    SET task_income = COALESCE(public.agent_income.task_income, 0) + EXCLUDED.task_income,
        wallet = COALESCE(public.agent_income.wallet, 0) + EXCLUDED.wallet;

    INSERT INTO public.wallet_history (user_id, amount, status, description, income_type, reference_id, reference_type)
    VALUES (v_user_id, v_task_amount, 'credit', 'WhatsApp Task Completion', 'task', submission_id::text, 'whatsapp_task');

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- B. Approve App Task
-- Drop first to avoid return type conflicts
DROP FUNCTION IF EXISTS public.approve_app_task_submission(UUID);

CREATE OR REPLACE FUNCTION public.approve_app_task_submission(submission_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_submission RECORD;
    v_task_amount NUMERIC;
    v_user_id UUID;
BEGIN
    SELECT * INTO v_submission FROM public.completed_app_tasks WHERE id = submission_id;
    IF v_submission IS NULL THEN RETURN FALSE; END IF;
    
    SELECT task_amount INTO v_task_amount FROM public.app_tasks WHERE id = v_submission.task_id;
    v_user_id := v_submission.user_id;

    UPDATE public.completed_app_tasks 
    SET payment_status = 'approved', status = 'approved', processed_at = NOW() 
    WHERE id = submission_id;

    INSERT INTO public.agent_income (user_id, task_income, wallet)
    VALUES (v_user_id, v_task_amount, v_task_amount)
    ON CONFLICT (user_id) DO UPDATE 
    SET task_income = COALESCE(public.agent_income.task_income, 0) + EXCLUDED.task_income,
        wallet = COALESCE(public.agent_income.wallet, 0) + EXCLUDED.wallet;

    INSERT INTO public.wallet_history (user_id, amount, status, description, income_type, reference_id, reference_type)
    VALUES (v_user_id, v_task_amount, 'credit', 'App Task Completion', 'task', submission_id::text, 'app_task');

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Seed Data
INSERT INTO public.whatsapp_tasks (task_title, task_description, requirements, task_amount)
VALUES ('Join Official Group', 'Join our official WhatsApp group.', 'Upload screenshot', 50)
ON CONFLICT DO NOTHING;

INSERT INTO public.app_tasks (task_title, task_description, requirements, task_amount, optional_url_1)
VALUES ('Install Daily News App', 'Install and register.', 'Upload profile screenshot', 20, 'https://play.google.com/store/apps')
ON CONFLICT DO NOTHING;
