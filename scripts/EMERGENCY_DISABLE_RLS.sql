-- Quick fix: Make products table completely public (no RLS at all for testing)

-- Temporarily disable RLS on products to test
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories DISABLE ROW LEVEL SECURITY;

-- Verify it worked
SELECT 
    'RLS DISABLED - Products should load now!' as status,
    COUNT(*) as total_products
FROM public.products;

-- Note: This is for TESTING ONLY. Re-enable RLS after confirming products load.
