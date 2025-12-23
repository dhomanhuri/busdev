-- Migration script to create project_types table
-- Run this after previous migrations

-- Create project_types table
CREATE TABLE IF NOT EXISTS public.project_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Disable RLS on project_types table
ALTER TABLE public.project_types DISABLE ROW LEVEL SECURITY;

-- Create trigger to auto-update updated_at for project_types
DROP TRIGGER IF EXISTS set_updated_at_project_types ON public.project_types;
CREATE TRIGGER set_updated_at_project_types
  BEFORE UPDATE ON public.project_types
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_project_types_name ON public.project_types(name);
CREATE INDEX IF NOT EXISTS idx_project_types_status_aktif ON public.project_types(status_aktif);

-- Insert default project types
INSERT INTO public.project_types (name, description, status_aktif) VALUES
  ('License', 'Software license project', true),
  ('Subscription', 'Subscription-based project', true),
  ('Services', 'Service delivery project', true),
  ('Support', 'Technical support project', true),
  ('Maintenance', 'Maintenance and upkeep project', true)
ON CONFLICT (name) DO NOTHING;
