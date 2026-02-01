-- Create storage buckets for file uploads

-- Payment proofs bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Task media bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-media', 'task-media', false)
ON CONFLICT (id) DO NOTHING;

-- Course files bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-files', 'course-files', false)
ON CONFLICT (id) DO NOTHING;

-- Product images bucket (public for display)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Ads media bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('ads-media', 'ads-media', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for payment-proofs bucket
CREATE POLICY "Users can upload payment proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own payment proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-proofs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all payment proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-proofs' AND EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

-- RLS policies for task-media bucket
CREATE POLICY "Users can upload task proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'task-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own task proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'task-media' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all task proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'task-media' AND EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can upload to task-media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'task-media' AND EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

-- RLS policies for course-files bucket
CREATE POLICY "Purchased users can view course files"
ON storage.objects FOR SELECT
USING (bucket_id = 'course-files' AND EXISTS (
  SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND has_purchased = true
));

CREATE POLICY "Admins can manage course files"
ON storage.objects FOR ALL
USING (bucket_id = 'course-files' AND EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

-- RLS policies for product-images bucket (public read)
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Admins can manage product images"
ON storage.objects FOR ALL
USING (bucket_id = 'product-images' AND EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

-- RLS policies for ads-media bucket (public read)
CREATE POLICY "Anyone can view ads media"
ON storage.objects FOR SELECT
USING (bucket_id = 'ads-media');

CREATE POLICY "Admins can manage ads media"
ON storage.objects FOR ALL
USING (bucket_id = 'ads-media' AND EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

-- Add package_purchase_requests table for manual package approval
CREATE TABLE IF NOT EXISTS public.package_purchase_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_proof_id UUID REFERENCES public.payment_proofs(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on package_purchase_requests
ALTER TABLE public.package_purchase_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for package_purchase_requests
CREATE POLICY "Users can view own package requests"
ON public.package_purchase_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create package requests"
ON public.package_purchase_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all package requests"
ON public.package_purchase_requests FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Admins can update package requests"
ON public.package_purchase_requests FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

-- Enable realtime for package_purchase_requests
ALTER PUBLICATION supabase_realtime ADD TABLE public.package_purchase_requests;