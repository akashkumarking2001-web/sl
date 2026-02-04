-- Drop existing site_settings table if it exists
DROP TABLE IF EXISTS public.site_settings CASCADE;

-- Create site_settings table with correct schema
CREATE TABLE public.site_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage settings (simplified - admins can be managed separately)
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (
    auth.uid() IS NOT NULL
);

-- Allow everyone to read settings
DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
CREATE POLICY "Anyone can view site settings" ON public.site_settings FOR SELECT USING (true);

-- Insert default shopping enabled setting
INSERT INTO public.site_settings (key, value, description) VALUES
('shopping_enabled', 'true', 'Enable or disable the shopping feature');

SELECT 'Site settings table created successfully!' as status;
