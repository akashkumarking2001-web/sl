-- ==============================================================================
-- DEPLOY TASKS SYSTEM (WhatsApp & App Tasks)
-- ==============================================================================

-- 1. WhatsApp Tasks Table
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

-- 2. App Tasks Table
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

-- 3. Completed WhatsApp Tasks Table (Submissions)
CREATE TABLE IF NOT EXISTS public.completed_whatsapp_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    task_id UUID REFERENCES public.whatsapp_tasks(id) ON DELETE CASCADE,
    file_paths TEXT[], -- Array of screenshot URLs
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'rejected')),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Completed App Tasks Table (Submissions)
CREATE TABLE IF NOT EXISTS public.completed_app_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    task_id UUID REFERENCES public.app_tasks(id) ON DELETE CASCADE,
    file_paths TEXT[],
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'rejected')),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. RLS Policies
ALTER TABLE public.whatsapp_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_whatsapp_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_app_tasks ENABLE ROW LEVEL SECURITY;

-- Tasks: Public Read (Active only), Admin Write
DROP POLICY IF EXISTS "Public view active tasks" ON public.whatsapp_tasks;
CREATE POLICY "Public view active tasks" ON public.whatsapp_tasks FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admin manage tasks" ON public.whatsapp_tasks;
CREATE POLICY "Admin manage tasks" ON public.whatsapp_tasks FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Public view active app tasks" ON public.app_tasks;
CREATE POLICY "Public view active app tasks" ON public.app_tasks FOR SELECT USING (is_active = true);
DROP POLICY IF EXISTS "Admin manage app tasks" ON public.app_tasks;
CREATE POLICY "Admin manage app tasks" ON public.app_tasks FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Submissions: User CRUD Own, Admin Manage All
DROP POLICY IF EXISTS "Users manage own submissions" ON public.completed_whatsapp_tasks;
CREATE POLICY "Users manage own submissions" ON public.completed_whatsapp_tasks FOR ALL USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Admin manage submissions" ON public.completed_whatsapp_tasks;
CREATE POLICY "Admin manage submissions" ON public.completed_whatsapp_tasks FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

DROP POLICY IF EXISTS "Users manage own app submissions" ON public.completed_app_tasks;
CREATE POLICY "Users manage own app submissions" ON public.completed_app_tasks FOR ALL USING (user_id = auth.uid());
DROP POLICY IF EXISTS "Admin manage app submissions" ON public.completed_app_tasks;
CREATE POLICY "Admin manage app submissions" ON public.completed_app_tasks FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- 6. RPC Functions for Approval

-- A. Approve WhatsApp Task
CREATE OR REPLACE FUNCTION public.approve_task_submission(submission_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_submission RECORD;
    v_task_amount NUMERIC;
    v_user_id UUID;
BEGIN
    -- Get submission details
    SELECT * INTO v_submission FROM public.completed_whatsapp_tasks WHERE id = submission_id;
    IF v_submission IS NULL THEN RETURN FALSE; END IF;
    
    -- Get task amount
    SELECT task_amount INTO v_task_amount FROM public.whatsapp_tasks WHERE id = v_submission.task_id;
    v_user_id := v_submission.user_id;

    -- Update Submission Status
    UPDATE public.completed_whatsapp_tasks 
    SET payment_status = 'approved', status = 'approved', processed_at = NOW() 
    WHERE id = submission_id;

    -- Credit Wallet (Agent Income)
    INSERT INTO public.agent_income (user_id, task_income, wallet)
    VALUES (v_user_id, v_task_amount, v_task_amount)
    ON CONFLICT (user_id) DO UPDATE 
    SET task_income = COALESCE(public.agent_income.task_income, 0) + EXCLUDED.task_income,
        wallet = COALESCE(public.agent_income.wallet, 0) + EXCLUDED.wallet;

    -- Add to Wallet History
    INSERT INTO public.wallet_history (user_id, amount, status, description, income_type, reference_id, reference_type)
    VALUES (v_user_id, v_task_amount, 'credit', 'WhatsApp Task Completion', 'task', submission_id::text, 'whatsapp_task');

    -- Distribute Upline Income (Example: 20% of task amount to direct sponsor) - OPTIONAL, simplified for now
    -- perform distribute_task_upline_income(v_user_id, v_task_amount); 

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- B. Approve App Task
CREATE OR REPLACE FUNCTION public.approve_app_task_submission(submission_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_submission RECORD;
    v_task_amount NUMERIC;
    v_user_id UUID;
BEGIN
    -- Get submission details
    SELECT * INTO v_submission FROM public.completed_app_tasks WHERE id = submission_id;
    IF v_submission IS NULL THEN RETURN FALSE; END IF;
    
    -- Get task amount
    SELECT task_amount INTO v_task_amount FROM public.app_tasks WHERE id = v_submission.task_id;
    v_user_id := v_submission.user_id;

    -- Update Submission Status
    UPDATE public.completed_app_tasks 
    SET payment_status = 'approved', status = 'approved', processed_at = NOW() 
    WHERE id = submission_id;

    -- Credit Wallet
    INSERT INTO public.agent_income (user_id, task_income, wallet)
    VALUES (v_user_id, v_task_amount, v_task_amount)
    ON CONFLICT (user_id) DO UPDATE 
    SET task_income = COALESCE(public.agent_income.task_income, 0) + EXCLUDED.task_income,
        wallet = COALESCE(public.agent_income.wallet, 0) + EXCLUDED.wallet;

    -- Add to Wallet History
    INSERT INTO public.wallet_history (user_id, amount, status, description, income_type, reference_id, reference_type)
    VALUES (v_user_id, v_task_amount, 'credit', 'App Task Completion', 'task', submission_id::text, 'app_task');

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Seed Sample Data (Optional)
INSERT INTO public.whatsapp_tasks (task_title, task_description, requirements, task_amount)
VALUES ('Join Official Group', 'Join our official WhatsApp group for updates.', 'Upload screenshot of group screen', 50)
ON CONFLICT DO NOTHING;

INSERT INTO public.app_tasks (task_title, task_description, requirements, task_amount, optional_url_1)
VALUES ('Install Daily News App', 'Install and register on the app.', 'Upload screenshot of profile page', 20, 'https://play.google.com/store/apps/details?id=com.example')
ON CONFLICT DO NOTHING;
