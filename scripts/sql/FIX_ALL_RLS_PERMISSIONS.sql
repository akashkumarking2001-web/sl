-- FINAL COMPREHENSIVE RLS FIX
-- This script ensures all public tables are readable by everyone

-- 1. Courses & Episodes
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public View Courses" ON public.courses;
CREATE POLICY "Public View Courses" ON public.courses FOR SELECT USING (true);

ALTER TABLE public.course_episodes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public View Episodes" ON public.course_episodes;
CREATE POLICY "Public View Episodes" ON public.course_episodes FOR SELECT USING (true);

-- 2. Products & Categories
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public View Products" ON public.products;
CREATE POLICY "Public View Products" ON public.products FOR SELECT USING (true);

ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public View Categories" ON public.product_categories;
CREATE POLICY "Public View Categories" ON public.product_categories FOR SELECT USING (true);

-- 3. Site Settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public View Settings" ON public.site_settings;
CREATE POLICY "Public View Settings" ON public.site_settings FOR SELECT USING (true);

-- 4. Admin Management Policies (Using explicit casting for ID mismatch)
DROP POLICY IF EXISTS "Admin Manage Courses" ON public.courses;
CREATE POLICY "Admin Manage Courses" ON public.courses FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id::text = auth.uid()::text AND role = 'admin')
);

DROP POLICY IF EXISTS "Admin Manage Episodes" ON public.course_episodes;
CREATE POLICY "Admin Manage Episodes" ON public.course_episodes FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id::text = auth.uid()::text AND role = 'admin')
);

DROP POLICY IF EXISTS "Admin Manage Products" ON public.products;
CREATE POLICY "Admin Manage Products" ON public.products FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id::text = auth.uid()::text AND role = 'admin')
);

DROP POLICY IF EXISTS "Admin Manage Categories" ON public.product_categories;
CREATE POLICY "Admin Manage Categories" ON public.product_categories FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id::text = auth.uid()::text AND role = 'admin')
);

DROP POLICY IF EXISTS "Admin Manage Settings" ON public.site_settings;
CREATE POLICY "Admin Manage Settings" ON public.site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id::text = auth.uid()::text AND role = 'admin')
);

-- 5. Grant Permissions to anon and authenticated
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT SELECT ON public.course_episodes TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.product_categories TO anon, authenticated;
GRANT SELECT ON public.site_settings TO anon, authenticated;
