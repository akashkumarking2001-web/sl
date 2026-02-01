-- 1. Income Settings Table (Admin Configurable)
CREATE TABLE public.income_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    package_name TEXT NOT NULL UNIQUE,
    referral_commission DECIMAL(10,2) DEFAULT 0,
    spillover_level_1 DECIMAL(10,2) DEFAULT 0,
    spillover_level_2 DECIMAL(10,2) DEFAULT 0,
    spillover_level_3 DECIMAL(10,2) DEFAULT 0,
    spillover_level_4 DECIMAL(10,2) DEFAULT 0,
    revenue_share_level_1 DECIMAL(10,2) DEFAULT 0,
    revenue_share_level_2 DECIMAL(10,2) DEFAULT 0,
    revenue_share_level_3 DECIMAL(10,2) DEFAULT 0,
    revenue_share_level_4 DECIMAL(10,2) DEFAULT 0,
    revenue_share_level_5 DECIMAL(10,2) DEFAULT 0,
    revenue_share_level_6 DECIMAL(10,2) DEFAULT 0,
    revenue_share_level_7 DECIMAL(10,2) DEFAULT 0,
    revenue_share_level_8 DECIMAL(10,2) DEFAULT 0,
    level_1_income DECIMAL(10,2) DEFAULT 0,
    level_2_income DECIMAL(10,2) DEFAULT 0,
    level_3_income DECIMAL(10,2) DEFAULT 0,
    level_4_income DECIMAL(10,2) DEFAULT 0,
    level_5_income DECIMAL(10,2) DEFAULT 0,
    level_6_income DECIMAL(10,2) DEFAULT 0,
    level_7_income DECIMAL(10,2) DEFAULT 0,
    level_8_income DECIMAL(10,2) DEFAULT 0,
    level_9_income DECIMAL(10,2) DEFAULT 0,
    level_10_income DECIMAL(10,2) DEFAULT 0,
    level_11_income DECIMAL(10,2) DEFAULT 0,
    level_12_income DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Revenue Share Tree Table
CREATE TABLE public.revenue_share_tree (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    placement_id UUID,
    left_pos UUID,
    mid_pos UUID,
    right_pos UUID,
    downline_count INT DEFAULT 0,
    level INT DEFAULT 1,
    package_type TEXT,
    is_upgraded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. Add spillover_count to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS spillover_count INT DEFAULT 0;

-- 4. Insert default income settings for all packages
INSERT INTO public.income_settings (package_name, referral_commission, level_1_income, level_2_income, level_3_income, level_4_income, level_5_income, level_6_income, level_7_income, level_8_income, level_9_income, level_10_income, level_11_income, level_12_income, spillover_level_1, spillover_level_2, spillover_level_3, spillover_level_4, revenue_share_level_1, revenue_share_level_2, revenue_share_level_3, revenue_share_level_4, revenue_share_level_5, revenue_share_level_6, revenue_share_level_7, revenue_share_level_8)
VALUES 
    ('Bronze', 100, 20, 15, 10, 8, 6, 5, 4, 3, 2, 2, 2, 2, 50, 100, 200, 500, 25, 50, 100, 200, 400, 800, 1600, 3200),
    ('Silver', 200, 40, 30, 20, 15, 12, 10, 8, 6, 4, 4, 4, 4, 100, 200, 400, 1000, 50, 100, 200, 400, 800, 1600, 3200, 6400),
    ('Gold', 400, 80, 60, 40, 30, 24, 20, 16, 12, 8, 8, 8, 8, 200, 400, 800, 2000, 100, 200, 400, 800, 1600, 3200, 6400, 12800),
    ('Platinum', 800, 160, 120, 80, 60, 48, 40, 32, 24, 16, 16, 16, 16, 400, 800, 1600, 4000, 200, 400, 800, 1600, 3200, 6400, 12800, 25600),
    ('Diamond', 1600, 320, 240, 160, 120, 96, 80, 64, 48, 32, 32, 32, 32, 800, 1600, 3200, 8000, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200);

-- 5. Enable RLS
ALTER TABLE public.income_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_share_tree ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for income_settings (Admin only for write, public read)
CREATE POLICY "Anyone can view income settings" ON public.income_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage income settings" ON public.income_settings FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 7. RLS Policies for revenue_share_tree
CREATE POLICY "Users can view their own tree" ON public.revenue_share_tree FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all trees" ON public.revenue_share_tree FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 8. Add income_type to wallet_history for better tracking
ALTER TABLE public.wallet_history ADD COLUMN IF NOT EXISTS income_type TEXT;
ALTER TABLE public.wallet_history ADD COLUMN IF NOT EXISTS level_number INT;
ALTER TABLE public.wallet_history ADD COLUMN IF NOT EXISTS from_user_id UUID;

-- 9. Create trigger for updated_at
CREATE TRIGGER update_income_settings_updated_at
BEFORE UPDATE ON public.income_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_revenue_share_tree_updated_at
BEFORE UPDATE ON public.revenue_share_tree
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();