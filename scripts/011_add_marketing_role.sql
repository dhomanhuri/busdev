-- Migration script to add 'Marketing' role
-- Run this if you already have the users table

-- Drop the existing constraint
ALTER TABLE IF EXISTS public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add the new constraint with Marketing role
ALTER TABLE public.users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('Admin', 'GM', 'Sales', 'Presales', 'Engineer', 'Project Manager', 'Marketing'));

