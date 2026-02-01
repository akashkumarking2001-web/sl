
-- 1. Course Architecture Change: Sessions/Episodes
CREATE TABLE IF NOT EXISTS public.course_episodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for episodes
ALTER TABLE public.course_episodes ENABLE ROW LEVEL SECURITY;

-- RLS: Anyone can view episodes of active courses
CREATE POLICY "Anyone can view episodes of active courses" ON public.course_episodes
    FOR SELECT USING (EXISTS (SELECT 1 FROM public.courses WHERE id = course_id AND is_active = true));

-- RLS: Admins can manage episodes
CREATE POLICY "Admins can manage episodes" ON public.course_episodes
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));


-- 2. User Management: Student ID & Unique Identifier
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS student_id TEXT UNIQUE;

-- Function to generate unique Student ID
CREATE OR REPLACE FUNCTION public.generate_student_id()
RETURNS TEXT AS $$
DECLARE
    v_id TEXT;
    v_exists BOOLEAN;
BEGIN
    LOOP
        v_id := 'SL' || lpad(floor(random() * 1000000)::text, 6, '0');
        SELECT EXISTS(SELECT 1 FROM public.profiles WHERE student_id = v_id) INTO v_exists;
        EXIT WHEN NOT v_exists;
    END LOOP;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql;

-- Update handle_new_user to include student_id
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, student_id)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'user', public.generate_student_id());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Site Settings: Online Shopping Mode
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    is_shopping_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.site_settings (id, is_shopping_enabled) 
VALUES ('global', true) 
ON CONFLICT (id) DO NOTHING;

-- Enable RLS for settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS: Public read, admin write
CREATE POLICY "Anyone can view settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.site_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Income Types Update
-- (Note: This is logic-based, but we ensure columns for various income types exist)
ALTER TABLE public.agent_income 
ADD COLUMN IF NOT EXISTS referral_income NUMERIC(20,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS level_income NUMERIC(20,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS share_income NUMERIC(20,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS task_income NUMERIC(20,2) DEFAULT 0;

-- 5. Fix RLS for Products (Open access for anonymous users to see active products)
DROP POLICY IF EXISTS "Anyone can view active products" ON public.products;
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (is_active = true);
-- Allow anon to see active products
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.product_categories TO anon;
