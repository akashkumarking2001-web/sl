-- ==========================================
-- NUCLEAR SCHEMA RESET: PAYMENT SYSTEM
-- ==========================================

-- 1. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins have full access to payments" ON public.payments;

-- 2. Drop and Recreate the table to ensure column alignment
-- Note: This will clear existing pending payments.
DROP TABLE IF EXISTS public.payments;

CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID NOT NULL, -- Removed FK to auth.users for better resilience during migration
    amount NUMERIC NOT NULL,
    plan_name TEXT NOT NULL,
    transaction_id TEXT,
    screenshot_url TEXT,
    status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    approved_at TIMESTAMPTZ
);

-- 3. Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 4. Set Permissive Policies
-- Allow anyone to insert (we validate user_id in the code)
CREATE POLICY "Anyone can insert payments" ON public.payments FOR INSERT WITH CHECK (true);

-- Users can see their own
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> 'email' = 'admin@ascendacademy.com');

-- Admins can do everything
CREATE POLICY "Admins have full access to payments" ON public.payments FOR ALL USING (auth.jwt() ->> 'email' = 'admin@ascendacademy.com');

-- 5. Force Refresh
NOTIFY pgrst, 'reload schema';
