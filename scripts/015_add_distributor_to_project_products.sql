-- Migration script to add distributor_id to project_products table
-- This allows each product in a project to have its own distributor
-- Run this after 011_create_projects_table.sql

-- Add distributor_id field to project_products table (optional, can be NULL)
ALTER TABLE public.project_products 
ADD COLUMN IF NOT EXISTS distributor_id UUID REFERENCES public.distributors(id) ON DELETE SET NULL;

-- Create index for distributor_id for better query performance
CREATE INDEX IF NOT EXISTS idx_project_products_distributor_id ON public.project_products(distributor_id);

