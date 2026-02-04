-- Add is_shopping_enabled column to site_settings table
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS is_shopping_enabled BOOLEAN DEFAULT true;

-- Update the global settings record if it exists
UPDATE site_settings SET is_shopping_enabled = true WHERE id = 'global';
