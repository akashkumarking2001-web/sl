-- ==========================================
-- SETUP STORAGE FOR PAYMENT PROOFS
-- ==========================================

-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('payments', 'payments', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public to read images (for admin and user screens)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'payments' );

-- 3. Allow authenticated users to upload their own proofs
CREATE POLICY "Users can upload their own proofs"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'payments' 
    AND (auth.role() = 'authenticated')
);

-- 4. Allow admins full access
CREATE POLICY "Admins full access"
ON storage.objects FOR ALL
USING (
    bucket_id = 'payments' 
    AND (auth.jwt() ->> 'email' = 'admin@ascendacademy.com')
);
