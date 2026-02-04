-- Enable RLS (just in case)
ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS store_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public Read Access" ON products;
DROP POLICY IF EXISTS "Public Read Access" ON store_sections;
DROP POLICY IF EXISTS "Public Read Access" ON site_content;
DROP POLICY IF EXISTS "Public Read Access" ON site_settings;
DROP POLICY IF EXISTS "Allow Public Select" ON products;
DROP POLICY IF EXISTS "Allow Public Select" ON store_sections;
DROP POLICY IF EXISTS "Allow Public Select" ON site_content;
DROP POLICY IF EXISTS "Allow Public Select" ON site_settings;

-- Drop Policies if they exist to avoid conflicts (Clean Slate)
DROP POLICY IF EXISTS "Public Read Access" ON products;
DROP POLICY IF EXISTS "Public Read Access" ON store_sections;
DROP POLICY IF EXISTS "Public Read Access" ON site_content;
DROP POLICY IF EXISTS "Public Read Access" ON site_settings;

-- Create Policies
CREATE POLICY "Public Read Access" ON products FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Access" ON store_sections FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Access" ON site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public Read Access" ON site_settings FOR SELECT TO anon, authenticated USING (true);

-- Grant usage to public (sometimes needed for sequences etc)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
