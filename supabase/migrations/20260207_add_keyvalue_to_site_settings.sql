-- Migration: Update existing site_settings table to support key-value pattern
-- The table already exists with columns like is_shopping_enabled, upi_id, etc.
-- We need to add key and value columns for flexible configuration

-- Step 1: Check existing structure and add new columns
DO $$ 
BEGIN
    -- Add key column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_settings' AND column_name = 'key'
    ) THEN
        ALTER TABLE public.site_settings ADD COLUMN key TEXT;
    END IF;

    -- Add value column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_settings' AND column_name = 'value'
    ) THEN
        ALTER TABLE public.site_settings ADD COLUMN value TEXT;
    END IF;

    -- Add description column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'site_settings' AND column_name = 'description'
    ) THEN
        ALTER TABLE public.site_settings ADD COLUMN description TEXT;
    END IF;
END $$;

-- Step 2: Migrate existing boolean to key-value format
-- Insert shopping_enabled setting based on existing is_shopping_enabled column
INSERT INTO public.site_settings (id, key, value, description, created_at, updated_at)
SELECT 
    gen_random_uuid(),
    'shopping_enabled',
    CASE WHEN is_shopping_enabled THEN 'true' ELSE 'false' END,
    'Enable/disable the shopping module globally',
    COALESCE(created_at, now()),
    COALESCE(updated_at, now())
FROM public.site_settings
WHERE id = (SELECT id FROM public.site_settings LIMIT 1)
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = now();

-- Step 3: Add unique constraint on key if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'site_settings_key_unique'
    ) THEN
        ALTER TABLE public.site_settings ADD CONSTRAINT site_settings_key_unique UNIQUE (key);
    END IF;
END $$;

-- Step 4: Insert additional default settings
INSERT INTO public.site_settings (key, value, description)
VALUES 
    ('maintenance_mode', 'false', 'Enable maintenance mode to disable site access'),
    ('registration_enabled', 'true', 'Allow new user registrations')
ON CONFLICT (key) DO NOTHING;

-- Step 5: Create index on key for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- Note: Keep existing columns (is_shopping_enabled, upi_id, etc.) for backward compatibility
-- The code will use the key-value pattern going forward
