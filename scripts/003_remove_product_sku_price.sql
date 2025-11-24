-- Migration script to remove SKU and price columns from products table
-- Run this if you already have the products table with SKU and price columns

-- Remove price column
ALTER TABLE IF EXISTS public.products DROP COLUMN IF EXISTS price;

-- Remove sku column
ALTER TABLE IF EXISTS public.products DROP COLUMN IF EXISTS sku;

