-- Create packages table to store dynamic content
CREATE TABLE IF NOT EXISTS public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL, -- Internal reference (SPARK, MOMENTUM, etc.)
    name TEXT NOT NULL, -- Display Name (e.g., "The Creator's Asset Vault")
    price NUMERIC NOT NULL,
    headline TEXT,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb, -- Array of strings
    bonus TEXT, -- Bonus text
    level INT, -- 1 to 5 for ordering
    color_theme TEXT, -- 'bronze', 'silver', 'gold', 'platinum', 'diamond' to map to UI styles
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Public read packages" ON public.packages;
CREATE POLICY "Public read packages" ON public.packages FOR SELECT USING (true);

-- Allow admin write access
DROP POLICY IF EXISTS "Admin manage packages" ON public.packages;
CREATE POLICY "Admin manage packages" ON public.packages FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_packages_updated_at ON public.packages;
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON public.packages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed Data (Upsert based on code)
INSERT INTO public.packages (code, name, price, headline, description, features, bonus, level, color_theme)
VALUES
(
    'SPARK',
    'Package 1: The Creator''s Asset Vault',
    699,
    'Start Your Digital Product Business Today!',
    'This isn’t just a starter pack; it’s a business-in-a-box.',
    '[
        "200 GB+ Premium Digital Assets: A massive cloud library containing everything a creator needs.",
        "Monetization Ready: Includes Private Label Rights (PLR) articles and ebooks.",
        "Pro Video Editing Suite: 5000+ Premiere Pro & After Effects templates, LUTS, Transitions.",
        "Graphic Design Bundle: 10,000+ AI-generated images, editable PSDs, Canva templates.",
        "Royalty-Free Media: Unlimited access to copyright-free music tracks and stock footage."
    ]'::jsonb,
    NULL,
    1,
    'bronze'
),
(
    'MOMENTUM',
    'Package 2: Social Media & Content Mastery',
    1499,
    'Hack the Algorithm & Build Your Personal Brand',
    'Stop guessing and start growing. This package reveals the hidden algorithms.',
    '[
        "Algorithm Hacking Secrets: Decode the exact metrics that trigger viral growth.",
        "Faceless Channel Blueprint: Learn how to build cash-cow YouTube channels.",
        "Multi-Platform Dominance: Specialized strategies for Telegram, Facebook, and Twitter.",
        "Revenue Optimization: Land brand deals and sponsorships.",
        "Smart Content Strategy: Generate 30 days of content in just 2 hours using AI."
    ]'::jsonb,
    'Includes Complete Package 1 for FREE',
    2,
    'silver'
),
(
    'SUMMIT',
    'Package 3: E-Commerce & Affiliate Tycoon',
    2850,
    'Build Automated Income Streams',
    'Designed for those who want to make money while they sleep.',
    '[
        "High-Ticket Affiliate Marketing: Sell high-value software and courses.",
        "Direct Selling Psychology: Master the art of closing via WhatsApp or Call.",
        "Automated Email Funnels: Set up Drip Campaigns that nurture leads.",
        "E-Commerce & Dropshipping 2.0: Launch online stores without inventory.",
        "Sales Funnel Architecture: Build high-converting Landing Pages."
    ]'::jsonb,
    'Includes Package 1 + Package 2 for FREE',
    3,
    'gold'
),
(
    'TITAN',
    'Package 4: AI-Powered Digital Marketing Agency',
    4880,
    'Dominate the Market with Next-Gen Strategies',
    'Become a full-stack Digital Marketer with Enterprise-level strategies.',
    '[
        "Advanced SEO & Semantic Search: Rank #1 on Google for competitive terms.",
        "Performance Marketing (Ads): Master Facebook Ads & Google Ads (ROAS focused).",
        "Data Analytics & CRO: Learn GA4 and Conversion Rate Optimization.",
        "Social Media Marketing (SMM): Generate B2B and B2C leads.",
        "AI Marketing Tools: Automate copywriting, creatives, and support."
    ]'::jsonb,
    'Includes Package 1, 2 + 3 for FREE',
    4,
    'platinum'
),
(
    'LEGACY',
    'Package 5: The Alpha Trader & Business Suite',
    8599,
    'Master the Financial Markets & Wealth Creation',
    'The Elite Tier. High-income skills combined with financial mastery.',
    '[
        "Binary Trading Masterclass: Market structure, support/resistance, candlestick psychology.",
        "Price Action Strategy: Trade naked charts without lagging indicators.",
        "Risk Management Protocols: Protect capital and grow portfolios consistent.",
        "Live Market Analysis: Real-time case studies and trade breakdowns.",
        "Business Scaling & Investment: Diversify profits into long-term assets."
    ]'::jsonb,
    'Ultimate Access - Get ALL Previous Packages 1, 2, 3 & 4 FREE',
    5,
    'diamond'
)
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    headline = EXCLUDED.headline,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    bonus = EXCLUDED.bonus,
    updated_at = NOW();
