-- Add affiliate commission columns to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS affiliate_commission_amount DECIMAL(12,2) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS affiliate_commission_percentage DECIMAL(5,2) DEFAULT 0;

-- Comment for clarity
COMMENT ON COLUMN products.affiliate_commission_amount IS 'Fixed commission amount paid to affiliates per sale';
COMMENT ON COLUMN products.affiliate_commission_percentage IS 'Percentage of sale price paid as commission (if amount is 0)';
