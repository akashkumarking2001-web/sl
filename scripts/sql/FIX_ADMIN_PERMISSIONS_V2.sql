-- 1. Grant admin role to BOTH potential admin emails to be safe
UPDATE public.profiles
SET role = 'admin'
WHERE email IN ('admin@ascendacademy.com', 'admin@ascend.com');

-- 2. Ensure RLS allows access
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
CREATE POLICY "Admins can view all payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.user_id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 3. Also allow 'service_role' or specific UUIDs if needed (optional safety net)
-- But the above should cover it if the profile exists.
