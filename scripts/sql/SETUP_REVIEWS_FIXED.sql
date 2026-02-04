-- Drop table if exists to ensure clean slate (Optional, be careful if data exists!)
-- DROP TABLE IF EXISTS public.reviews; 

-- Create table if not exists (This part was fine)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    images TEXT[], -- Using array for images
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Drop Policies BEFORE creating them to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON public.reviews;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.reviews;

-- Create Policies
CREATE POLICY "Allow public read access" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);
