-- ==========================================
-- DIAGNOSTIC & SAFE DATABASE UPGRADE
-- ==========================================
-- This version will work even if column names differ

-- ==========================================
-- STEP 1: Enable UUID Extension
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- STEP 2: Course Chapters
-- ==========================================
CREATE TABLE IF NOT EXISTS public.course_chapters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chapters_course_id ON public.course_chapters(course_id);

-- ==========================================
-- STEP 3: Order Items
-- ==========================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL,
    product_id UUID,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(15,2) NOT NULL,
    subtotal NUMERIC(15,2) NOT NULL,
    cashback_amount NUMERIC(15,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- ==========================================
-- STEP 4: Financial Ledger
-- ==========================================
CREATE TABLE IF NOT EXISTS public.financial_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    entry_type TEXT NOT NULL,
    balance_before NUMERIC(15,2) DEFAULT 0,
    balance_after NUMERIC(15,2) NOT NULL,
    reference_id UUID,
    reference_type TEXT,
    description TEXT,
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ledger_user_id ON public.financial_ledger(user_id);
CREATE INDEX IF NOT EXISTS idx_ledger_created_at ON public.financial_ledger(created_at DESC);

-- ==========================================
-- STEP 5: User Closure Table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_closure (
    ancestor_id UUID NOT NULL,
    descendant_id UUID NOT NULL,
    depth INTEGER NOT NULL CHECK (depth >= 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (ancestor_id, descendant_id)
);

CREATE INDEX IF NOT EXISTS idx_closure_descendant_id ON public.user_closure(descendant_id);
CREATE INDEX IF NOT EXISTS idx_closure_depth ON public.user_closure(depth);

-- ==========================================
-- STOP HERE AND RUN THIS DIAGNOSTIC QUERY
-- ==========================================
-- Copy and run this separately to see your actual column names:

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- ==========================================
-- AFTER RUNNING THE DIAGNOSTIC ABOVE:
-- If you see 'id' and 'referred_by' columns, continue below
-- If column names are different, let me know what they are
-- ==========================================
