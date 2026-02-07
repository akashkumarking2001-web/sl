# Database Update - Site Settings Fix

## ❌ Error Encountered
```
ERROR: column "key" of relation "site_settings" does not exist
```

## ✅ Root Cause
The `site_settings` table **already exists** in your database with this structure:
```sql
- id
- is_shopping_enabled (boolean)
- upi_id
- usdt_address
- qr_code_url
- whatsapp_number
- payment_instructions
- shop_upi_id
- shop_usdt_address
- shop_qr_code_url
- created_at
- updated_at
```

But the code expects a **key-value pattern**:
```sql
- id
- key (TEXT)
- value (TEXT)
- description (TEXT)
```

## 🔧 Solution: Updated Migration

I've created a new migration that **adds** the key-value columns to the existing table:

📄 **File:** `supabase/migrations/20260207_add_keyvalue_to_site_settings.sql`

### Run This SQL in Supabase Dashboard

```sql
-- Add new columns to existing table
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS key TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS value TEXT;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS description TEXT;

-- Add unique constraint on key
ALTER TABLE public.site_settings 
ADD CONSTRAINT site_settings_key_unique UNIQUE (key);

-- Migrate existing is_shopping_enabled to key-value format
INSERT INTO public.site_settings (key, value, description)
SELECT 
    'shopping_enabled',
    CASE WHEN is_shopping_enabled THEN 'true' ELSE 'false' END,
    'Enable/disable the shopping module globally'
FROM public.site_settings
WHERE id = (SELECT id FROM public.site_settings LIMIT 1)
ON CONFLICT (key) DO UPDATE SET 
    value = EXCLUDED.value,
    updated_at = now();

-- Add other default settings
INSERT INTO public.site_settings (key, value, description)
VALUES 
    ('maintenance_mode', 'false', 'Enable maintenance mode'),
    ('registration_enabled', 'true', 'Allow new registrations')
ON CONFLICT (key) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);
```

### Alternative: Simpler Approach

If the above is too complex, you can run this simpler version:

```sql
-- Just add the columns
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS key TEXT,
ADD COLUMN IF NOT EXISTS value TEXT,
ADD COLUMN IF NOT EXISTS description TEXT;

-- Make key unique
ALTER TABLE public.site_settings 
DROP CONSTRAINT IF EXISTS site_settings_key_unique;

ALTER TABLE public.site_settings 
ADD CONSTRAINT site_settings_key_unique UNIQUE (key);

-- Insert the shopping toggle setting
INSERT INTO public.site_settings (key, value, description)
VALUES ('shopping_enabled', 'true', 'Enable/disable shopping module')
ON CONFLICT (key) DO NOTHING;
```

### Verification

After running the migration, verify:

```sql
-- Check table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'site_settings';

-- Check data
SELECT key, value, description 
FROM site_settings 
WHERE key IS NOT NULL;
```

You should see:
```
key                  | value | description
---------------------|-------|---------------------------
shopping_enabled     | true  | Enable/disable shopping...
```

### Why This Approach?

- ✅ Preserves existing columns (backward compatible)
- ✅ Adds new key-value functionality
- ✅ Migrates existing `is_shopping_enabled` to new format
- ✅ Allows both old and new patterns to coexist

---

**Next Step:** Run the SQL above in your Supabase SQL Editor, then the shopping toggle will work!
