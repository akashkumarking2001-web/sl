-- ==============================================================================
-- SECURE APP TASKS SUPPORT (PARANOID MODE EXTENSION)
-- ==============================================================================

-- 0. Create Tables (If they don't exist)
CREATE TABLE IF NOT EXISTS public.app_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_title TEXT NOT NULL,
    task_description TEXT,
    task_amount DECIMAL(10,2) NOT NULL CHECK (task_amount >= 0),
    file_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    optional_url_1 TEXT,
    optional_url_2 TEXT,
    proof_type TEXT,
    requirements TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.completed_app_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    task_id UUID REFERENCES public.app_tasks(id) ON DELETE SET NULL,
    file_paths TEXT[], -- Array of URLs
    payment_status TEXT CHECK (payment_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE,
    admin_notes TEXT,
    user_id_proof TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 1. Enable RLS on App Tasks Tables (Safe to run even if already enabled)
ALTER TABLE public.app_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.completed_app_tasks ENABLE ROW LEVEL SECURITY;

-- 2. RLS Policies for App Tasks
-- Drop existing policies to avoid "policy already exists" errors during re-runs
DROP POLICY IF EXISTS "Public view active app tasks" ON public.app_tasks;
DROP POLICY IF EXISTS "Admins manage app tasks" ON public.app_tasks;
DROP POLICY IF EXISTS "Users view own app submissions" ON public.completed_app_tasks;
DROP POLICY IF EXISTS "Users submit app tasks" ON public.completed_app_tasks;
DROP POLICY IF EXISTS "Admins manage app submissions" ON public.completed_app_tasks;

-- APP TASKS
CREATE POLICY "Public view active app tasks" ON public.app_tasks FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage app tasks" ON public.app_tasks FOR ALL USING (is_admin());

-- COMPLETED APP TASKS
CREATE POLICY "Users view own app submissions" ON public.completed_app_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users submit app tasks" ON public.completed_app_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage app submissions" ON public.completed_app_tasks FOR ALL USING (is_admin());

-- 3. Secure Approval Function for App Tasks
CREATE OR REPLACE FUNCTION approve_app_task_submission(submission_id UUID)
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
    SELECT * INTO v_submission FROM public.completed_app_tasks WHERE id = submission_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Submission not found'; END IF;

    IF v_submission.payment_status = 'approved' THEN
        RAISE EXCEPTION 'Task already approved';
    END IF;

    -- Get Task Info
    SELECT * INTO v_task FROM public.app_tasks WHERE id = v_submission.task_id;
    IF NOT FOUND THEN RAISE EXCEPTION 'Task details not found'; END IF;

    -- Update Status
    UPDATE public.completed_app_tasks 
    SET payment_status = 'approved', processed_at = now() 
    WHERE id = submission_id;

    -- Credit Wallet (Safe Logic)
    PERFORM internal_credit_wallet(
        v_submission.user_id, 
        v_task.task_amount, 
        'App Task Income: ' || v_task.task_title, 
        'task'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
