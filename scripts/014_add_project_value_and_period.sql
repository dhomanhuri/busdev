-- Migration script to add nilai_project and periode (start/end dates), remove tanggal field
-- Run this after 011_create_projects_table.sql and related migrations

-- Add nilai_project field (project value - numeric for monetary value)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS nilai_project NUMERIC(15, 2);

-- Add periode_mulai field (project start date)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS periode_mulai DATE;

-- Add periode_selesai field (project end date)
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS periode_selesai DATE;

-- Drop the index on tanggal before removing the column
DROP INDEX IF EXISTS idx_projects_tanggal;

-- Remove tanggal field
ALTER TABLE public.projects 
DROP COLUMN IF EXISTS tanggal;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_nilai_project ON public.projects(nilai_project);
CREATE INDEX IF NOT EXISTS idx_projects_periode_mulai ON public.projects(periode_mulai);
CREATE INDEX IF NOT EXISTS idx_projects_periode_selesai ON public.projects(periode_selesai);

