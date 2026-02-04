-- ==========================================
-- CREATE GLOBAL SETTINGS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    updated_at TIMESTAMPTZ DEFAULT now(),
    upi_id TEXT DEFAULT 'skillhonors@upi',
    qr_code_url TEXT,
    usdt_address TEXT DEFAULT 'TRC20_ADDRESS_HERE',
    whatsapp_number TEXT DEFAULT '+910000000000',
    payment_instructions TEXT DEFAULT 'Please make the payment and share the transaction ID for verification.'
);

-- Seed initial values if not present
INSERT INTO public.site_settings (id, upi_id, usdt_address, whatsapp_number)
VALUES ('global', 'skillhonors@upi', 'TRC20_ADDRESS_HERE', '+910000000000')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can READ (for payment gateway)
DROP POLICY IF EXISTS "Public read access for site_settings" ON public.site_settings;
CREATE POLICY "Public read access for site_settings" ON public.site_settings FOR SELECT USING (true);

-- Only Admin can UPDATE
DROP POLICY IF EXISTS "Admin full access for site_settings" ON public.site_settings;
CREATE POLICY "Admin full access for site_settings" ON public.site_settings FOR ALL USING (auth.jwt() ->> 'email' = 'admin@ascendacademy.com');

-- 2. ENABLE REALTIME FOR PAYMENTS (For the 60s timer logic)
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.payments;
COMMIT;

-- Trigger Schema Refresh
NOTIFY pgrst, 'reload schema';
