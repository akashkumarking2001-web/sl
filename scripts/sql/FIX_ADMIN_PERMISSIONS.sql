-- 1. Ensure the Master Admin has the 'admin' role in the profiles table
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'admin@ascendacademy.com';

-- 2. Ensure the RLS policy is definitely correct and not relying on stale cache
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
CREATE POLICY "Admins can view all payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.user_id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 3. Just in case, grant generic read access to authenticated users if the above is too strict (for debugging)
-- Uncomment the below line if you want to temporarily disable strict admin checks for payments:
-- CREATE POLICY "Debug read all" ON public.payments FOR SELECT USING (true);
