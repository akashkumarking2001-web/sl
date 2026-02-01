-- ==============================================================================
-- FIXED E-COMMERCE DEPLOYMENT SCRIPT
-- ==============================================================================
-- This script safely deploys the e-commerce platform
-- Handles existing tables and renames conflicts
-- ==============================================================================

-- ==============================================================================
-- STEP 1: RENAME OLD PRODUCTS TABLE IF IT EXISTS
-- ==============================================================================

DO $$
BEGIN
    -- Check if old products table exists and rename it
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        -- Rename old table to backup
        ALTER TABLE IF EXISTS public.products RENAME TO products_old_backup;
        RAISE NOTICE 'Old products table renamed to products_old_backup';
    END IF;
END $$;

-- ==============================================================================
-- STEP 2: CREATE NEW TABLES
-- ==============================================================================

-- Product Categories Table
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table (New E-Commerce Schema)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    image_url TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    mrp NUMERIC(10,2) NOT NULL DEFAULT 0,
    price NUMERIC(10,2) NOT NULL DEFAULT 0,
    cashback_amount NUMERIC(10,2) DEFAULT 0,
    cashback_percentage NUMERIC(5,2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    specifications JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT price_check CHECK (price >= 0),
    CONSTRAINT mrp_check CHECK (mrp >= price),
    CONSTRAINT stock_check CHECK (stock_quantity >= 0)
);

-- Affiliate Applications Table
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

-- Affiliate Links Table
CREATE TABLE IF NOT EXISTS public.affiliate_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    referral_code TEXT UNIQUE NOT NULL,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    total_commission NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Affiliate Clicks Table
CREATE TABLE IF NOT EXISTS public.affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_link_id UUID REFERENCES public.affiliate_links(id) ON DELETE CASCADE NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    referrer TEXT,
    clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shopping Orders Table
CREATE TABLE IF NOT EXISTS public.shopping_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    affiliate_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    cashback_amount NUMERIC(10,2) DEFAULT 0,
    affiliate_commission NUMERIC(10,2) DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'failed')),
    shipping_address JSONB,
    tracking_number TEXT,
    transaction_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlist Table
CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- ==============================================================================
-- STEP 3: CREATE INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_affiliate_apps_user ON public.affiliate_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_apps_status ON public.affiliate_applications(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_user ON public.affiliate_links(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_product ON public.affiliate_links(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_code ON public.affiliate_links(referral_code);
CREATE INDEX IF NOT EXISTS idx_shopping_orders_user ON public.shopping_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_orders_affiliate ON public.shopping_orders(affiliate_user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON public.wishlist(user_id);

-- ==============================================================================
-- STEP 4: ENABLE RLS
-- ==============================================================================

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- STEP 5: CREATE RLS POLICIES
-- ==============================================================================

-- Product Categories Policies
DROP POLICY IF EXISTS "Anyone can view active categories" ON public.product_categories;
CREATE POLICY "Anyone can view active categories" ON public.product_categories FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage categories" ON public.product_categories;
CREATE POLICY "Admins can manage categories" ON public.product_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Products Policies
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Affiliate Applications Policies
DROP POLICY IF EXISTS "Users can view own applications" ON public.affiliate_applications;
CREATE POLICY "Users can view own applications" ON public.affiliate_applications FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create applications" ON public.affiliate_applications;
CREATE POLICY "Users can create applications" ON public.affiliate_applications FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage applications" ON public.affiliate_applications;
CREATE POLICY "Admins can manage applications" ON public.affiliate_applications FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Affiliate Links Policies
DROP POLICY IF EXISTS "Users can view own links" ON public.affiliate_links;
CREATE POLICY "Users can view own links" ON public.affiliate_links FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all links" ON public.affiliate_links;
CREATE POLICY "Admins can view all links" ON public.affiliate_links FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Shopping Orders Policies
DROP POLICY IF EXISTS "Users can view own orders" ON public.shopping_orders;
CREATE POLICY "Users can view own orders" ON public.shopping_orders FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create orders" ON public.shopping_orders;
CREATE POLICY "Users can create orders" ON public.shopping_orders FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage orders" ON public.shopping_orders;
CREATE POLICY "Admins can manage orders" ON public.shopping_orders FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Wishlist Policies
DROP POLICY IF EXISTS "Users can manage own wishlist" ON public.wishlist;
CREATE POLICY "Users can manage own wishlist" ON public.wishlist FOR ALL USING (user_id = auth.uid());

-- ==============================================================================
-- STEP 6: CREATE TRIGGERS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_product_categories_updated_at ON public.product_categories;
CREATE TRIGGER update_product_categories_updated_at BEFORE UPDATE ON public.product_categories
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_affiliate_applications_updated_at ON public.affiliate_applications;
CREATE TRIGGER update_affiliate_applications_updated_at BEFORE UPDATE ON public.affiliate_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_shopping_orders_updated_at ON public.shopping_orders;
CREATE TRIGGER update_shopping_orders_updated_at BEFORE UPDATE ON public.shopping_orders
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ==============================================================================
-- STEP 7: CREATE FUNCTIONS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.generate_affiliate_code(p_user_id UUID, p_product_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_code TEXT;
    v_exists BOOLEAN;
BEGIN
    LOOP
        v_code := upper(substring(md5(random()::text || p_user_id::text || p_product_id::text) from 1 for 8));
        SELECT EXISTS(SELECT 1 FROM public.affiliate_links WHERE referral_code = v_code) INTO v_exists;
        EXIT WHEN NOT v_exists;
    END LOOP;
    RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.create_affiliate_link(p_user_id UUID, p_product_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_code TEXT;
    v_is_approved BOOLEAN;
BEGIN
    SELECT status = 'approved' INTO v_is_approved
    FROM public.affiliate_applications
    WHERE user_id = p_user_id;
    
    IF NOT v_is_approved THEN
        RAISE EXCEPTION 'User is not an approved affiliate';
    END IF;
    
    SELECT referral_code INTO v_code
    FROM public.affiliate_links
    WHERE user_id = p_user_id AND product_id = p_product_id;
    
    IF v_code IS NOT NULL THEN
        RETURN v_code;
    END IF;
    
    v_code := public.generate_affiliate_code(p_user_id, p_product_id);
    
    INSERT INTO public.affiliate_links (user_id, product_id, referral_code)
    VALUES (p_user_id, p_product_id, v_code);
    
    RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.track_affiliate_click(
    p_referral_code TEXT,
    p_ip TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
    v_link_id UUID;
BEGIN
    SELECT id INTO v_link_id
    FROM public.affiliate_links
    WHERE referral_code = p_referral_code;
    
    IF v_link_id IS NULL THEN
        RETURN;
    END IF;
    
    INSERT INTO public.affiliate_clicks (affiliate_link_id, ip_address, user_agent)
    VALUES (v_link_id, p_ip, p_user_agent);
    
    UPDATE public.affiliate_links
    SET clicks = clicks + 1
    WHERE id = v_link_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.process_affiliate_commission(p_order_id UUID)
RETURNS VOID AS $$
DECLARE
    v_order RECORD;
    v_commission NUMERIC;
    v_commission_rate NUMERIC := 0.10;
BEGIN
    SELECT * INTO v_order
    FROM public.shopping_orders
    WHERE id = p_order_id AND status = 'delivered' AND affiliate_user_id IS NOT NULL;
    
    IF v_order IS NULL THEN
        RETURN;
    END IF;
    
    v_commission := v_order.total_price * v_commission_rate;
    
    UPDATE public.shopping_orders
    SET affiliate_commission = v_commission
    WHERE id = p_order_id;
    
    UPDATE public.affiliate_links
    SET conversions = conversions + 1,
        total_commission = total_commission + v_commission
    WHERE user_id = v_order.affiliate_user_id 
    AND product_id = v_order.product_id;
    
    UPDATE public.profiles
    SET wallet_balance = wallet_balance + v_commission
    WHERE id = v_order.affiliate_user_id;
    
    INSERT INTO public.transactions (user_id, type, amount, description, status)
    VALUES (
        v_order.affiliate_user_id,
        'affiliate_commission',
        v_commission,
        'Affiliate commission for order #' || p_order_id,
        'completed'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- STEP 8: INSERT CATEGORIES
-- ==============================================================================

INSERT INTO public.product_categories (name, slug, description, icon, display_order) VALUES
('Electronics', 'electronics', 'Latest gadgets and electronic devices', '📱', 1),
('Fashion', 'fashion', 'Trendy clothing and accessories', '👕', 2),
('Home & Kitchen', 'home-kitchen', 'Everything for your home', '🏠', 3),
('Beauty & Personal Care', 'beauty-personal-care', 'Beauty and grooming products', '💄', 4),
('Sports & Fitness', 'sports-fitness', 'Sports equipment and fitness gear', '⚽', 5),
('Books & Stationery', 'books-stationery', 'Books, office supplies, and more', '📚', 6)
ON CONFLICT (slug) DO NOTHING;

-- ==============================================================================
-- STEP 9: INSERT SAMPLE PRODUCTS
-- ==============================================================================

DO $$
DECLARE
    cat_electronics UUID;
    cat_fashion UUID;
    cat_home UUID;
BEGIN
    SELECT id INTO cat_electronics FROM public.product_categories WHERE slug = 'electronics';
    SELECT id INTO cat_fashion FROM public.product_categories WHERE slug = 'fashion';
    SELECT id INTO cat_home FROM public.product_categories WHERE slug = 'home-kitchen';

    INSERT INTO public.products (category_id, name, slug, description, short_description, image_url, mrp, price, cashback_amount, stock_quantity, is_featured, tags) VALUES
    
    (cat_electronics, 'Apple iPhone 15 Pro Max (256GB)', 'iphone-15-pro-max-256gb',
     'Experience the pinnacle of smartphone technology with the iPhone 15 Pro Max. Featuring the powerful A17 Pro chip, ProMotion display, and advanced camera system with 5x optical zoom.',
     'Latest iPhone with A17 Pro chip and titanium design',
     'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
     139900, 124900, 6245, 50, true,
     ARRAY['smartphone', 'apple', 'premium', 'flagship']),
    
    (cat_electronics, 'Sony WH-1000XM5 Wireless Headphones', 'sony-wh1000xm5-headphones',
     'Industry-leading noise cancellation with crystal-clear audio. 30-hour battery life and premium comfort for all-day listening.',
     'Premium noise-canceling headphones',
     'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
     34990, 29990, 1499, 100, true,
     ARRAY['headphones', 'sony', 'wireless', 'noise-canceling']),
    
    (cat_fashion, 'Nike Air Force 1 07 - White', 'nike-air-force-1-white',
     'Iconic basketball-inspired sneakers with premium leather and Air cushioning.',
     'Classic white sneakers',
     'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
     8995, 7495, 374, 80, true,
     ARRAY['sneakers', 'nike', 'shoes', 'casual']),
    
    (cat_home, 'Philips Air Fryer HD9252/90 (4.1L)', 'philips-air-fryer-41l',
     'Healthy cooking with Rapid Air technology. Fry, bake, grill, and roast with little to no oil.',
     'Digital air fryer with 7 presets',
     'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
     12995, 9995, 499, 40, true,
     ARRAY['air-fryer', 'philips', 'kitchen', 'appliance'])
    
    ON CONFLICT (slug) DO NOTHING;
    
END $$;

-- ==============================================================================
-- DEPLOYMENT COMPLETE!
-- ==============================================================================

SELECT 'E-Commerce schema deployed successfully!' as status,
       (SELECT COUNT(*) FROM product_categories) as categories,
       (SELECT COUNT(*) FROM products) as products;
