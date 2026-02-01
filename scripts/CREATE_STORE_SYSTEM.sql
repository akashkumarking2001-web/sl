-- Create Banners Table
CREATE TABLE IF NOT EXISTS public.store_banners (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    image_url TEXT NOT NULL,
    redirect_link TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for store_banners
ALTER TABLE public.store_banners ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active banners
CREATE POLICY "Public can view active banners" ON public.store_banners
    FOR SELECT
    USING (is_active = true);

-- Allow admins to manage banners (assuming admin role or logic handled in app, or just open for now like other tables if strictly controlled by app logic. matching 'packages' style)
CREATE POLICY "Admins can manage banners" ON public.store_banners
    FOR ALL
    USING (auth.role() = 'authenticated'); -- Simplified for now, can be tightened to admin role

-- Create Store Sections Table (for dynamic toggles like Deal of the Day)
CREATE TABLE IF NOT EXISTS public.store_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_key TEXT UNIQUE NOT NULL, -- e.g. 'deal_of_the_day', 'best_sellers', 'hero_slider'
    title TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    config JSONB DEFAULT '{}'::jsonb, -- Store dynamic config like timer, background color, linked product IDs
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for store_sections
ALTER TABLE public.store_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active sections" ON public.store_sections
    FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage sections" ON public.store_sections
    FOR ALL
    USING (auth.role() = 'authenticated');

-- Add image_url to product_categories if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_categories' AND column_name = 'image_url') THEN
        ALTER TABLE public.product_categories ADD COLUMN image_url TEXT;
    END IF;
END $$;

-- Seed default sections
INSERT INTO public.store_sections (section_key, title, display_order, is_active, config)
VALUES 
    ('hero_slider', 'Hero Slider', 1, true, '{}'),
    ('category_circles', 'Shop By Category', 2, true, '{}'),
    ('deal_of_the_day', 'Deal of the Day', 3, true, '{"timer_enabled": true}'),
    ('best_sellers', 'Best Sellers', 4, true, '{"limit": 8}'),
    ('just_for_you', 'Just For You', 5, true, '{"grid_cols": 4}')
ON CONFLICT (section_key) DO NOTHING;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_store_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_store_banners_updated_at
    BEFORE UPDATE ON public.store_banners
    FOR EACH ROW
    EXECUTE FUNCTION update_store_updated_at();

CREATE TRIGGER update_store_sections_updated_at
    BEFORE UPDATE ON public.store_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_store_updated_at();
