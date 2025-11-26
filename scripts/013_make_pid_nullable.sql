-- Migration script to make PID nullable in projects table
-- Run this after 011_create_projects_table.sql

-- Drop the existing NOT NULL constraint on pid
ALTER TABLE public.projects 
ALTER COLUMN pid DROP NOT NULL;

-- Note: The UNIQUE constraint will remain, which means:
-- - Multiple NULL values are allowed (NULL != NULL in SQL)
-- - Non-NULL values must be unique

