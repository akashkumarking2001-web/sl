-- ==============================================================================
-- MASTER FIX SCRIPT: E-COMMERCE & AFFILIATE SYSTEM
-- ==============================================================================
-- This script fixes commonly reported issues:
-- 1. "0 Products Found" (Inserts categories and products)
-- 2. "Failed to load affiliate requests" (Ensures tables and RLS exist)
-- 3. Missing Permissions (Updates RLS policies)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. FIX PRODUCTS & CATEGORIES
-- ------------------------------------------------------------------------------

-- Ensure Categories Exist
INSERT INTO public.product_categories (name, slug, icon, description, display_order)
VALUES 
('Electronics', 'electronics', '📱', 'Smartphones, Laptops, Accessories', 1),
('Fashion', 'fashion', '👕', 'Clothing, Footwear, Watches', 2),
('Home & Kitchen', 'home-kitchen', '🏠', 'Furniture, Decor, Appliances', 3),
('Beauty', 'beauty', '💄', 'Skincare, Makeup, Grooming', 4),
('Sports', 'sports', '⚽', 'Equipment, Activewear', 5),
('Books', 'books', '📚', 'Fiction, Non-fiction, Academic', 6)
ON CONFLICT (slug) DO NOTHING;

-- Ensure Products Exist (Sample)
DO $$
BEGIN
    IF (SELECT count(*) FROM public.products) < 5 THEN
        -- Insert Electronics
        INSERT INTO public.products (category_id, name, slug, description, short_description, image_url, mrp, price, cashback_amount, stock_quantity, is_featured, tags) VALUES
        ((SELECT id FROM public.product_categories WHERE slug = 'electronics'), 'Apple iPhone 15 Pro Max', 'iphone-15-pro-max', 'Ultimate iPhone.', 'A17 Pro Chip', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', 139900, 124900, 6245, 50, true, ARRAY['smartphone', 'apple']),
        ((SELECT id FROM public.product_categories WHERE slug = 'electronics'), 'Samsung S24 Ultra', 'samsung-s24-ultra', 'AI Phone.', 'Snapdragon 8 Gen 3', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800', 129900, 114900, 5745, 45, true, ARRAY['smartphone', 'samsung']),
        ((SELECT id FROM public.product_categories WHERE slug = 'electronics'), 'Sony Headphones', 'sony-wh1000xm5', 'Noise Cancelling.', 'Best in class ANC', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800', 34990, 29990, 1499, 100, true, ARRAY['audio', 'sony']);

        -- Insert Fashion
        INSERT INTO public.products (category_id, name, slug, description, short_description, image_url, mrp, price, cashback_amount, stock_quantity, is_featured, tags) VALUES
        ((SELECT id FROM public.product_categories WHERE slug = 'fashion'), 'Nike Air Jordan 1', 'nike-air-jordan-1', 'Classic sneakers.', 'High Top Retro', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 16995, 13995, 700, 20, true, ARRAY['shoes', 'nike']);
    END IF;
END $$;

-- Fix RLS for Products (Allow Public Read)
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view categories" ON public.product_categories;
CREATE POLICY "Public can view categories" ON public.product_categories FOR SELECT USING (true);


-- ------------------------------------------------------------------------------
-- 2. FIX AFFILIATE SYSTEM
-- ------------------------------------------------------------------------------

-- Ensure Table Exists
CREATE TABLE IF NOT EXISTS public.affiliate_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    why_join TEXT,
    experience TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Fix RLS for Affiliate Applications
ALTER TABLE public.affiliate_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage applications" ON public.affiliate_applications;
CREATE POLICY "Admins can manage applications" ON public.affiliate_applications FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Users can view own applications" ON public.affiliate_applications;
CREATE POLICY "Users can view own applications" ON public.affiliate_applications FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create applications" ON public.affiliate_applications;
CREATE POLICY "Users can create applications" ON public.affiliate_applications FOR INSERT WITH CHECK (user_id = auth.uid());

-- ------------------------------------------------------------------------------
-- 3. FIX FUNCTIONS (Affiliate Commission)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.process_affiliate_commission(p_order_id UUID)
RETURNS VOID AS $$
DECLARE
    v_order RECORD;
    v_commission NUMERIC;
    v_commission_rate NUMERIC := 0.10; -- 10% commission
BEGIN
    -- Get order details
    SELECT * INTO v_order
    FROM public.shopping_orders
    WHERE id = p_order_id AND affiliate_user_id IS NOT NULL;
    
    IF v_order IS NULL THEN
        RAISE NOTICE 'Order not found or no affiliate';
        RETURN;
    END IF;
    
    -- Calculate commission (10% of total price)
    v_commission := v_order.total_price * v_commission_rate;
    
    -- Update order with commission
    UPDATE public.shopping_orders
    SET affiliate_commission = v_commission
    WHERE id = p_order_id;
    
    -- Update affiliate link stats
    UPDATE public.affiliate_links
    SET conversions = conversions + 1,
        total_commission = total_commission + v_commission
    WHERE user_id = v_order.affiliate_user_id 
    AND product_id = v_order.product_id;
    
    -- Credit affiliate wallet (agent_income)
    INSERT INTO public.agent_income (user_id, wallet)
    VALUES (v_order.affiliate_user_id, v_commission)
    ON CONFLICT (user_id) DO UPDATE
    SET wallet = COALESCE(public.agent_income.wallet, 0) + EXCLUDED.wallet;
    
    -- Create wallet history record
    INSERT INTO public.wallet_history (user_id, amount, status, description, income_type, created_at)
    VALUES (
        v_order.affiliate_user_id,
        v_commission,
        'credit',
        'Affiliate commission for order #' || p_order_id,
        'referral',
        NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 4. SETTINGS
-- ------------------------------------------------------------------------------

-- Enable Shopping
INSERT INTO public.site_settings (id, is_shopping_enabled)
VALUES ('global', true)
ON CONFLICT (id) DO UPDATE SET is_shopping_enabled = true;

-- ==============================================================================
-- DONE.
-- ==============================================================================
