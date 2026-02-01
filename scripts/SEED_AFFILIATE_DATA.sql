-- ==============================================================================
-- SEED DATA & ENSURE WALLET TABLES EXIST
-- ==============================================================================

-- 1. Ensure Agent Income (Wallet) Table Exists
CREATE TABLE IF NOT EXISTS public.agent_income (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    wallet NUMERIC DEFAULT 0,
    total_income NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. Ensure Wallet History Table Exists
CREATE TABLE IF NOT EXISTS public.wallet_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL check (status in ('credit', 'debit')),
    description TEXT,
    income_type TEXT, -- 'referral', 'task', 'shopping', etc.
    reference_id TEXT,
    reference_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

-- Enable RLS for these if not already
ALTER TABLE public.agent_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_history ENABLE ROW LEVEL SECURITY;

-- Policies (Safe to re-run, will fail silently if exist or we can drop/create)
DROP POLICY IF EXISTS "Users can view own wallet" ON public.agent_income;
CREATE POLICY "Users can view own wallet" ON public.agent_income FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own history" ON public.wallet_history;
CREATE POLICY "Users can view own history" ON public.wallet_history FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage wallets" ON public.agent_income;
CREATE POLICY "Admins can manage wallets" ON public.agent_income FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. Create a Sample Affiliate Application (Linked to the current user or a dummy)
-- We'll try to link to the first user found in profiles to avoid FK errors
DO $$
DECLARE
    v_user_id UUID;
BEGIN
    SELECT id INTO v_user_id FROM auth.users LIMIT 1;
    
    IF v_user_id IS NOT NULL THEN
        INSERT INTO public.affiliate_applications (
            user_id, full_name, email, phone, why_join, experience, status
        ) VALUES (
            v_user_id,
            'Demo Affiliate',
            'demo@example.com',
            '+1234567890',
            'I have a large following on Instagram.',
            '5 years of digital marketing.',
            'pending'
        )
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
END $$;

-- 4. Ensure some active products exist (in case previous script missed them)
-- (Already handled by FIX_ZERO_PRODUCTS, but double verification doesn't hurt)
-- We skip this to avoid redundancy.

-- Done
