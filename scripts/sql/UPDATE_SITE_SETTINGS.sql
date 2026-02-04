
-- Add separate payment columns for Shopping (E-Commerce)
alter table public.site_settings 
add column if not exists shop_upi_id text,
add column if not exists shop_usdt_address text,
add column if not exists shop_qr_code_url text;

-- Rename existing columns to clarify they are for global/course if needed, 
-- but for backward compatibility we will treat existing `upi_id` as the Course/Default one.
