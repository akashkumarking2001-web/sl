-- Create Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only Admins can view logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id::text = auth.uid()::text AND role = 'admin')
    );

-- Log creators (system/admins) can insert
CREATE POLICY "Admins can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.profiles WHERE user_id::text = auth.uid()::text AND role = 'admin')
    );

-- Grant permissions
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;

-- Comment for clarity
COMMENT ON TABLE public.audit_logs IS 'System-wide tracking of critical admin actions for security and debugging.';
