-- ==========================================
-- FIX MISSING COLUMNS IN PROFILES TABLE
-- ==========================================

DO $$ 
BEGIN
    -- 1. Ensure 'status' column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'status') THEN
        ALTER TABLE public.profiles ADD COLUMN status text DEFAULT 'active';
    END IF;

    -- 2. Ensure 'role' column exists (Backup)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'user';
    END IF;

    -- 3. Ensure 'has_purchased' column exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'has_purchased') THEN
        ALTER TABLE public.profiles ADD COLUMN has_purchased boolean DEFAULT false;
    END IF;

    -- 4. Fill in missing status for existing users
    UPDATE public.profiles SET status = 'active' WHERE status IS NULL;
    
END $$;

-- Force a schema cache refresh by doing a dummy alter (PostgREST listens to these)
NOTIFY pgrst, 'reload schema';
