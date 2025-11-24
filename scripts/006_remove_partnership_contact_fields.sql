-- Migration script to remove contact fields from partnerships table
-- Run this if you already have the partnerships table with contact fields

-- Remove contact and address columns
ALTER TABLE IF EXISTS public.partnerships DROP COLUMN IF EXISTS contact_person;
ALTER TABLE IF EXISTS public.partnerships DROP COLUMN IF EXISTS contact_email;
ALTER TABLE IF EXISTS public.partnerships DROP COLUMN IF EXISTS contact_phone;
ALTER TABLE IF EXISTS public.partnerships DROP COLUMN IF EXISTS address;

