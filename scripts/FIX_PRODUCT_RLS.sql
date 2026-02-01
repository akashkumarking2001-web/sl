-- Fix RLS policies to allow public read access to products and categories

-- Products table - Allow everyone to read active products
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (true);

-- Product categories - Allow everyone to read active categories  
DROP POLICY IF EXISTS "Anyone can view categories" ON public.product_categories;
CREATE POLICY "Anyone can view categories" ON public.product_categories
    FOR SELECT USING (true);

-- Allow authenticated users to manage their wishlist
DROP POLICY IF EXISTS "Users can manage their wishlist" ON public.wishlist;
CREATE POLICY "Users can manage their wishlist" ON public.wishlist
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Allow authenticated users to view their orders
DROP POLICY IF EXISTS "Users can view their orders" ON public.shopping_orders;
CREATE POLICY "Users can view their orders" ON public.shopping_orders
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Allow authenticated users to create orders
DROP POLICY IF EXISTS "Users can create orders" ON public.shopping_orders;
CREATE POLICY "Users can create orders" ON public.shopping_orders
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

SELECT 'RLS policies fixed - products are now publicly viewable!' as status;
