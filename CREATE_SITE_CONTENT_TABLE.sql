-- Create a table to store dynamic site content
CREATE TABLE IF NOT EXISTS site_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key TEXT NOT NULL UNIQUE, -- e.g., 'hero', 'about', 'plans'
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can view site content" 
ON site_content FOR SELECT 
USING (true);

-- Allow admins to update
CREATE POLICY "Admins can update site content" 
ON site_content FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Insert default data for Hero Section to prevent empty state
INSERT INTO site_content (section_key, content) 
VALUES (
  'hero', 
  '{
    "title": "Unlock Your Potential with Ascend Academy",
    "subtitle": "Join the world''s fastest-growing learning platform and start earning today.",
    "ctaText": "Get Started Now",
    "ctaLink": "/register"
  }'::jsonb
) ON CONFLICT (section_key) DO NOTHING;
