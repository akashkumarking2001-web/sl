
-- 1. Insert Categories (Using specific UUIDs so we can reference them)
INSERT INTO product_categories (id, name, slug) VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Premium Software', 'software'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Digital Assets', 'assets'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Pro Courses', 'courses'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Design Templates', 'templates')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Products (Sample Data)
INSERT INTO products (name, slug, description, price, mrp, category_id, is_active, image_url, cashback_amount) VALUES 
('Ultimate Video Editor Pro', 'ultimate-video-editor-pro', 'Professional video editing software with AI capabilities. Perfect for creators.', 4999, 9999, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', true, 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44c?q=80&w=600&auto=format', 200),
('3D Asset Mega Pack', '3d-asset-mega-pack', 'Over 500 high-quality 3D assets for game development and rendering.', 2499, 4999, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', true, 'https://images.unsplash.com/photo-1616469829941-c7200edec809?q=80&w=600&auto=format', 100),
('Social Media Masterclass', 'social-media-masterclass', 'Complete guide to growing your brand on Instagram and YouTube.', 1999, 3999, 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', true, 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=600&auto=format', 50),
('E-commerce UI Kit', 'e-commerce-ui-kit', 'Complete UI kit for building modern e-commerce websites (Figma).', 1499, 2999, 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', true, 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format', 75),
('AI Content Generator', 'ai-content-generator', 'Generate blogs, ads, and emails in seconds using advanced AI models.', 3999, 7999, 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', true, 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=600&auto=format', 150),
('Stock Photo Bundle (5k+)', 'stock-photo-bundle', 'Royalty-free high resolution stock photos for commercial use.', 999, 1999, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', true, 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=600&auto=format', 20)
ON CONFLICT DO NOTHING;

-- 3. Insert Store Sections
-- Note: Store sections usually use generated UUIDs, but we key off 'section_key' for unique constraint if configured.
-- If conflict on section_key isn't set up, we might get duplicates, but standard update is safe.
INSERT INTO store_sections (section_key, title, is_active, display_order, config) VALUES 
('hero_slider', 'Hero Slider', true, 1, '{"autoPlay": true}'),
('category_circles', 'Categories', true, 2, '{}'),
('deal_of_the_day', 'Deal of the Day', true, 3, '{"highlight": true}'),
('best_sellers', 'Best Sellers', true, 4, '{"limit": 4}'),
('just_for_you', 'Just For You', true, 5, '{"limit": 8}')
ON CONFLICT (section_key) DO UPDATE SET is_active = true;

-- 4. Content for Hero Section (Site Content table)
INSERT INTO site_content (section_key, content) VALUES
('hero', '{"title": "Welcome to Skill Learners", "subtitle": "Upgrade your skills through our expert-led courses and achieve financial freedom.", "ctaText": "Start Learning", "ctaLink": "/register"}')
ON CONFLICT (section_key) DO NOTHING;

