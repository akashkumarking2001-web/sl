-- ==========================================
-- COMPLETE SCHEMA REPAIR: PAYMENT SYSTEM
-- ==========================================

-- 1. Create 'payments' table (for plan purchases)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    amount NUMERIC NOT NULL,
    plan_name TEXT NOT NULL,
    transaction_id TEXT,
    screenshot_url TEXT,
    status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    approved_at TIMESTAMPTZ
);

-- 2. Create 'payment_proofs' table (for wallet deposits)
CREATE TABLE IF NOT EXISTS public.payment_proofs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    amount NUMERIC NOT NULL,
    payment_type TEXT NOT NULL, -- 'INR' or 'USDT'
    transaction_id TEXT,
    proof_image TEXT,
    status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    processed_at TIMESTAMPTZ
);

-- 3. Create 'package_purchase_requests' table
CREATE TABLE IF NOT EXISTS public.package_purchase_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    package_name TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    payment_proof_id UUID REFERENCES public.payment_proofs(id),
    status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    processed_at TIMESTAMPTZ
);

-- 4. Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_purchase_requests ENABLE ROW LEVEL SECURITY;

-- 5. Set RLS Policies
DO $$ 
DECLARE 
    t text;
    tables_to_secure text[] := array['payments', 'payment_proofs', 'package_purchase_requests'];
BEGIN
    FOREACH t IN ARRAY tables_to_secure LOOP
        -- SELECT: Users can view their own, Admins can view all
        EXECUTE format('DROP POLICY IF EXISTS "Users can view their own %I" ON public.%I', t, t);
        EXECUTE format('CREATE POLICY "Users can view their own %I" ON public.%I FOR SELECT USING (auth.uid() = user_id OR auth.jwt() ->> ''email'' = ''admin@ascendacademy.com'')', t, t);
        
        -- INSERT: Users can insert their own
        EXECUTE format('DROP POLICY IF EXISTS "Users can insert their own %I" ON public.%I', t, t);
        EXECUTE format('CREATE POLICY "Users can insert their own %I" ON public.%I FOR INSERT WITH CHECK (auth.uid() = user_id)', t, t);
        
        -- ALL: Admins have full access
        EXECUTE format('DROP POLICY IF EXISTS "Admins have full access to %I" ON public.%I', t, t);
        EXECUTE format('CREATE POLICY "Admins have full access to %I" ON public.%I FOR ALL USING (auth.jwt() ->> ''email'' = ''admin@ascendacademy.com'')', t, t);
    END LOOP;
END $$;

-- 6. Trigger Schema Refresh
NOTIFY pgrst, 'reload schema';
