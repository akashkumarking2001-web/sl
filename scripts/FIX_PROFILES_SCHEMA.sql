-- Migration: Add missing columns to profiles table
DO $$ 
BEGIN 
    -- Add purchased_plan if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='purchased_plan') THEN
        ALTER TABLE public.profiles ADD COLUMN purchased_plan TEXT;
    END IF;

    -- Add package if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='package') THEN
        ALTER TABLE public.profiles ADD COLUMN package TEXT;
    END IF;

    -- Add has_purchased if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='has_purchased') THEN
        ALTER TABLE public.profiles ADD COLUMN has_purchased BOOLEAN DEFAULT false;
    END IF;
END $$;
