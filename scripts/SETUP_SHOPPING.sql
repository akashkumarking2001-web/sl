-- ==========================================
-- SETUP SHOPPING MODULE
-- ==========================================

DO $$ 
BEGIN
    -- 1. Enhance products table
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'mrp') THEN
        ALTER TABLE public.products ADD COLUMN mrp numeric DEFAULT 0;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'cashback') THEN
        ALTER TABLE public.products ADD COLUMN cashback numeric DEFAULT 0;
    END IF;

    -- 2. Create shopping_orders table
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'shopping_orders') THEN
        CREATE TABLE public.shopping_orders (
            id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id uuid REFERENCES auth.users(id),
            product_id uuid REFERENCES public.products(id),
            quantity integer DEFAULT 1,
            total_amount numeric NOT NULL,
            cashback_amount numeric DEFAULT 0,
            transaction_id text NOT NULL,
            screenshot_url text,
            status text DEFAULT 'pending', -- pending, approved, rejected
            delivery_status text DEFAULT 'pending', -- pending, shipped, delivered
            shipping_address text,
            admin_notes text,
            created_at timestamp with time zone DEFAULT now(),
            updated_at timestamp with time zone DEFAULT now()
        );

        -- Add RLS
        ALTER TABLE public.shopping_orders ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Users can view their own orders" 
        ON public.shopping_orders FOR SELECT 
        USING (auth.uid() = user_id);

        CREATE POLICY "Admins can view all orders" 
        ON public.shopping_orders FOR SELECT 
        USING (public.has_role('admin', auth.uid()));

        CREATE POLICY "Users can insert their own orders" 
        ON public.shopping_orders FOR INSERT 
        WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Admins can update orders" 
        ON public.shopping_orders FOR UPDATE 
        USING (public.has_role('admin', auth.uid()));
    END IF;

    -- 3. Create storage bucket for product images if not exists
    -- Note: This is usually done via Supabase dashboard or API, but we can't do it here easily.
    -- We'll assume the 'products' bucket exists or we'll use the 'payments' bucket/general public one.
    
END $$;

-- Force a schema cache refresh
NOTIFY pgrst, 'reload schema';
