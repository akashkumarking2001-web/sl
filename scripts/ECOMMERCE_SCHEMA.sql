-- ==============================================================================
-- E-COMMERCE & AFFILIATE SYSTEM SCHEMA
-- ==============================================================================
-- Creates tables for product catalog, categories, affiliate program, and orders
-- ==============================================================================

-- 1. PRODUCT CATEGORIES
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    short_description TEXT,
    image_url TEXT,
    gallery_images TEXT[], -- Array of image URLs
    mrp DECIMAL(10,2) NOT NULL CHECK (mrp > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    cashback_amount DECIMAL(10,2) DEFAULT 0 CHECK (cashback_amount >= 0),
    cashback_percentage DECIMAL(5,2) DEFAULT 0 CHECK (cashback_percentage >= 0),
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    tags TEXT[],
    specifications JSONB, -- Product specs as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. AFFILIATE APPLICATIONS
CREATE TABLE IF NOT EXISTS public.affiliate_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    why_join TEXT,
    experience TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    admin_notes TEXT,
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- 4. AFFILIATE LINKS (Track unique referral links)
CREATE TABLE IF NOT EXISTS public.affiliate_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    referral_code TEXT NOT NULL UNIQUE,
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    total_commission DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, product_id)
);

-- 5. AFFILIATE CLICKS (Track each click)
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_link_id UUID REFERENCES public.affiliate_links(id) ON DELETE CASCADE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 6. SHOPPING ORDERS (Enhanced)
-- Check if table exists, if not create it
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'shopping_orders') THEN
        CREATE TABLE public.shopping_orders (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
            product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
            affiliate_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
            quantity INT DEFAULT 1 CHECK (quantity > 0),
            unit_price DECIMAL(10,2) NOT NULL,
            total_price DECIMAL(10,2) NOT NULL,
            cashback_amount DECIMAL(10,2) DEFAULT 0,
            affiliate_commission DECIMAL(10,2) DEFAULT 0,
            status TEXT CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')) DEFAULT 'pending',
            payment_status TEXT CHECK (payment_status IN ('pending', 'approved', 'failed')) DEFAULT 'pending',
            shipping_address JSONB,
            tracking_number TEXT,
            transaction_id TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
    END IF;
END $$;

-- 7. WISHLIST
CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id, product_id)
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_shopping_orders_user ON public.shopping_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_orders_status ON public.shopping_orders(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_user ON public.affiliate_links(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_product ON public.affiliate_links(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON public.wishlist(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- CATEGORIES (Public read, Admin manage)
CREATE POLICY "Public view active categories" ON public.product_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage categories" ON public.product_categories FOR ALL USING (is_admin());

-- PRODUCTS (Public read active, Admin manage)
CREATE POLICY "Public view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins manage products" ON public.products FOR ALL USING (is_admin());

-- AFFILIATE APPLICATIONS
CREATE POLICY "Users view own application" ON public.affiliate_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create application" ON public.affiliate_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage applications" ON public.affiliate_applications FOR ALL USING (is_admin());

-- AFFILIATE LINKS
CREATE POLICY "Users view own links" ON public.affiliate_links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all links" ON public.affiliate_links FOR SELECT USING (is_admin());

-- SHOPPING ORDERS
CREATE POLICY "Users view own orders" ON public.shopping_orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create orders" ON public.shopping_orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins manage orders" ON public.shopping_orders FOR ALL USING (is_admin());

-- WISHLIST
CREATE POLICY "Users manage own wishlist" ON public.wishlist FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- TRIGGERS
-- ==============================================================================

CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON public.product_categories 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_applications_updated_at BEFORE UPDATE ON public.affiliate_applications 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_orders_updated_at BEFORE UPDATE ON public.shopping_orders 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- SAMPLE DATA - CATEGORIES
-- ==============================================================================

INSERT INTO public.product_categories (name, slug, description, icon, display_order) VALUES
('Electronics', 'electronics', 'Latest gadgets and electronic devices', 'Smartphone', 1),
('Fashion', 'fashion', 'Trendy clothing and accessories', 'Shirt', 2),
('Home & Kitchen', 'home-kitchen', 'Home essentials and kitchen appliances', 'Home', 3),
('Beauty & Personal Care', 'beauty-personal-care', 'Beauty products and personal care items', 'Sparkles', 4),
('Sports & Fitness', 'sports-fitness', 'Sports equipment and fitness gear', 'Dumbbell', 5),
('Books & Stationery', 'books-stationery', 'Books, notebooks, and office supplies', 'BookOpen', 6)
ON CONFLICT (slug) DO NOTHING;

-- ==============================================================================
-- FUNCTIONS
-- ==============================================================================

-- Generate unique affiliate referral code
CREATE OR REPLACE FUNCTION generate_affiliate_code(p_user_id UUID, p_product_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_code TEXT;
    v_profile RECORD;
BEGIN
    -- Get user's referral code
    SELECT referral_code INTO v_profile FROM public.profiles WHERE user_id = p_user_id;
    
    -- Generate code: USER_CODE + PRODUCT_ID_SHORT
    v_code := UPPER(COALESCE(v_profile.referral_code, 'USER')) || '-' || 
              UPPER(SUBSTRING(p_product_id::TEXT, 1, 8));
    
    RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Create affiliate link for approved user
CREATE OR REPLACE FUNCTION create_affiliate_link(p_user_id UUID, p_product_id UUID)
RETURNS UUID AS $$
DECLARE
    v_link_id UUID;
    v_code TEXT;
    v_is_approved BOOLEAN;
BEGIN
    -- Check if user is approved affiliate
    SELECT (status = 'approved') INTO v_is_approved 
    FROM public.affiliate_applications 
    WHERE user_id = p_user_id;
    
    IF NOT v_is_approved THEN
        RAISE EXCEPTION 'User is not an approved affiliate';
    END IF;
    
    -- Generate unique code
    v_code := generate_affiliate_code(p_user_id, p_product_id);
    
    -- Insert or get existing link
    INSERT INTO public.affiliate_links (user_id, product_id, referral_code)
    VALUES (p_user_id, p_product_id, v_code)
    ON CONFLICT (user_id, product_id) DO UPDATE SET referral_code = EXCLUDED.referral_code
    RETURNING id INTO v_link_id;
    
    RETURN v_link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Track affiliate click
CREATE OR REPLACE FUNCTION track_affiliate_click(p_referral_code TEXT, p_ip TEXT, p_user_agent TEXT)
RETURNS VOID AS $$
DECLARE
    v_link_id UUID;
BEGIN
    -- Get link ID
    SELECT id INTO v_link_id FROM public.affiliate_links WHERE referral_code = p_referral_code;
    
    IF v_link_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Increment click count
    UPDATE public.affiliate_links SET clicks = clicks + 1 WHERE id = v_link_id;
    
    -- Log click
    INSERT INTO public.affiliate_clicks (affiliate_link_id, ip_address, user_agent)
    VALUES (v_link_id, p_ip, p_user_agent);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Process affiliate commission on order
CREATE OR REPLACE FUNCTION process_affiliate_commission(p_order_id UUID)
RETURNS VOID AS $$
DECLARE
    v_order RECORD;
    v_commission DECIMAL;
    v_link_id UUID;
BEGIN
    -- Get order details
    SELECT * INTO v_order FROM public.shopping_orders WHERE id = p_order_id;
    
    IF v_order.affiliate_user_id IS NULL THEN
        RETURN;
    END IF;
    
    -- Calculate commission (10% of product price)
    v_commission := v_order.total_price * 0.10;
    
    -- Update order with commission
    UPDATE public.shopping_orders 
    SET affiliate_commission = v_commission 
    WHERE id = p_order_id;
    
    -- Get affiliate link
    SELECT id INTO v_link_id 
    FROM public.affiliate_links 
    WHERE user_id = v_order.affiliate_user_id AND product_id = v_order.product_id;
    
    IF v_link_id IS NOT NULL THEN
        -- Update link stats
        UPDATE public.affiliate_links 
        SET conversions = conversions + 1,
            total_commission = total_commission + v_commission
        WHERE id = v_link_id;
        
        -- Credit affiliate wallet
        PERFORM internal_credit_wallet(
            v_order.affiliate_user_id,
            v_commission,
            'Affiliate Commission - Product Sale',
            'referral',
            NULL,
            v_order.user_id
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- End of Script
