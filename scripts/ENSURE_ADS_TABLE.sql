-- ==============================================================================
-- ENSURE ADS MANAGEMENT TABLE
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.ads_management (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ads_title TEXT NOT NULL,
    ads_vendor TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- RLS
ALTER TABLE public.ads_management ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view ads" ON public.ads_management;
CREATE POLICY "Public view ads" ON public.ads_management FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins manage ads" ON public.ads_management;
CREATE POLICY "Admins manage ads" ON public.ads_management FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Trigger for update
DROP TRIGGER IF EXISTS update_ads_management_updated_at ON public.ads_management;
CREATE TRIGGER update_ads_management_updated_at BEFORE UPDATE ON public.ads_management
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
