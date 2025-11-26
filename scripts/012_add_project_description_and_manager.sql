-- Migration script to add description and project_manager_id to projects table
-- Run this after 011_create_projects_table.sql

-- Add description field (optional, can be NULL)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add project_manager_id field (optional, can be NULL)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS project_manager_id UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- Create index for project_manager_id for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_project_manager_id ON public.projects(project_manager_id);

