-- COMPREHENSIVE FIX: Products, RLS, and Admin Policies

-- 1. Drop ALL existing RLS policies on products table
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.products;
DROP POLICY IF EXISTS "Public products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- 2. Create simple, working policies
-- Allow EVERYONE to view products (no auth required)
CREATE POLICY "public_read_products" ON public.products
    FOR SELECT USING (true);

-- Allow authenticated admins to manage products
CREATE POLICY "admin_manage_products" ON public.products
    FOR ALL USING (auth.uid() IS NOT NULL);

-- 3. Fix product_categories policies
DROP POLICY IF EXISTS "Anyone can view categories" ON public.product_categories;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.product_categories;

CREATE POLICY "public_read_categories" ON public.product_categories
    FOR SELECT USING (true);

CREATE POLICY "admin_manage_categories" ON public.product_categories
    FOR ALL USING (auth.uid() IS NOT NULL);

-- 4. Verify products exist
DO $$
DECLARE
    product_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO product_count FROM public.products;
    RAISE NOTICE 'Total products in database: %', product_count;
    
    IF product_count = 0 THEN
        RAISE NOTICE 'WARNING: No products found! Please run DEPLOY_ECOMMERCE_FIXED.sql and ADD_REMAINING_PRODUCTS.sql';
    END IF;
END $$;

SELECT 
    'RLS Fixed!' as status,
    COUNT(*) as total_products,
    COUNT(*) FILTER (WHERE is_active = true) as active_products
FROM public.products;
