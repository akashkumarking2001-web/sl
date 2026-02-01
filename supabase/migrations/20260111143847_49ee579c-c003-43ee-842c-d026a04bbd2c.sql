-- =====================================================
-- MONEYWORLD ADMIN PANEL - COMPLETE DATABASE SCHEMA
-- =====================================================

-- 1. AGENT/USER INCOME (WALLET) TABLE
CREATE TABLE IF NOT EXISTS public.agent_income (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  wallet DECIMAL(12,2) NOT NULL DEFAULT 0,
  total_income DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. WALLET HISTORY (TRANSACTION LEDGER)
CREATE TABLE IF NOT EXISTS public.wallet_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'credit' CHECK (status IN ('credit', 'debit')),
  description TEXT NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. BANK ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  account_holder TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  bank_name TEXT,
  upi_id TEXT,
  usdt_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. PRODUCTS TABLE (E-COMMERCE)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  image_1 TEXT,
  image_2 TEXT,
  image_3 TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. COURSES TABLE (Enhanced)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  category TEXT,
  level TEXT CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  duration TEXT,
  package TEXT,
  course_file TEXT,
  thumbnail TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. WHATSAPP TASKS TABLE
CREATE TABLE IF NOT EXISTS public.whatsapp_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_title TEXT NOT NULL,
  task_description TEXT,
  requirements TEXT,
  media_url TEXT,
  task_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. APP TASKS TABLE
CREATE TABLE IF NOT EXISTS public.app_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_title TEXT NOT NULL,
  task_description TEXT,
  requirements TEXT,
  optional_url_1 TEXT,
  optional_url_2 TEXT,
  file_url TEXT,
  task_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  proof_type TEXT NOT NULL DEFAULT 'screenshot' CHECK (proof_type IN ('screenshot', 'userid_screenshot')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. COMPLETED WHATSAPP TASKS
CREATE TABLE IF NOT EXISTS public.completed_whatsapp_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.whatsapp_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  file_paths TEXT[],
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- 9. COMPLETED APP TASKS
CREATE TABLE IF NOT EXISTS public.completed_app_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.app_tasks(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  file_paths TEXT[],
  user_id_proof TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- 10. TASK INCOME TRACKING
CREATE TABLE IF NOT EXISTS public.task_income (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_id UUID NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('whatsapp', 'app')),
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. ADS MANAGEMENT
CREATE TABLE IF NOT EXISTS public.ads_management (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ads_title TEXT NOT NULL,
  ads_vendor TEXT,
  media_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. MESSAGES/CONTACT TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. ADMIN NOTIFICATIONS (BROADCAST)
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  target_users UUID[],
  is_broadcast BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. PAYMENT PROOFS (DEPOSIT REQUESTS)
CREATE TABLE IF NOT EXISTS public.payment_proofs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  payment_type TEXT NOT NULL DEFAULT 'INR' CHECK (payment_type IN ('INR', 'USDT')),
  proof_image TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at TIMESTAMPTZ
);

-- Add status and downline to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked'));
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS downline_count INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sponsor_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS package TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_visible TEXT;

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- AGENT INCOME
ALTER TABLE public.agent_income ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own income" ON public.agent_income FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own income" ON public.agent_income FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all income" ON public.agent_income FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- WALLET HISTORY
ALTER TABLE public.wallet_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own history" ON public.wallet_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all history" ON public.wallet_history FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- BANK ACCOUNTS
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own bank" ON public.bank_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bank accounts" ON public.bank_accounts FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- PRODUCTS (Public read, admin write)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- COURSES (Public read, admin write)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- WHATSAPP TASKS
ALTER TABLE public.whatsapp_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view active tasks" ON public.whatsapp_tasks FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage tasks" ON public.whatsapp_tasks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- APP TASKS
ALTER TABLE public.app_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view active app tasks" ON public.app_tasks FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage app tasks" ON public.app_tasks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- COMPLETED WHATSAPP TASKS
ALTER TABLE public.completed_whatsapp_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their completions" ON public.completed_whatsapp_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all completions" ON public.completed_whatsapp_tasks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- COMPLETED APP TASKS
ALTER TABLE public.completed_app_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their app completions" ON public.completed_app_tasks FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all app completions" ON public.completed_app_tasks FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- TASK INCOME
ALTER TABLE public.task_income ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their task income" ON public.task_income FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage task income" ON public.task_income FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- ADS MANAGEMENT
ALTER TABLE public.ads_management ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active ads" ON public.ads_management FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage ads" ON public.ads_management FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- MESSAGES
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert messages" ON public.messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage messages" ON public.messages FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- ADMIN NOTIFICATIONS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view broadcast notifications" ON public.admin_notifications FOR SELECT USING (is_broadcast = true OR auth.uid() = ANY(target_users));
CREATE POLICY "Admins can manage notifications" ON public.admin_notifications FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- PAYMENT PROOFS
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their proofs" ON public.payment_proofs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all proofs" ON public.payment_proofs FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- =====================================================
-- ENABLE REALTIME
-- =====================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.wallet_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_proofs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.completed_whatsapp_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.completed_app_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- =====================================================
-- TRIGGER FOR UPDATED_AT
-- =====================================================
CREATE TRIGGER update_agent_income_updated_at BEFORE UPDATE ON public.agent_income FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON public.bank_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();