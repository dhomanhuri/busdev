-- Migration script to add project_type_id to project_products table
-- This allows each product in a project to have its own project type
-- Run this after 016_create_project_types_table.sql

-- Add project_type_id field to project_products table (optional, can be NULL)
ALTER TABLE public.project_products
ADD COLUMN IF NOT EXISTS project_type_id UUID REFERENCES public.project_types(id) ON DELETE SET NULL;

-- Create index for project_type_id for better query performance
CREATE INDEX IF NOT EXISTS idx_project_products_project_type_id ON public.project_products(project_type_id);
