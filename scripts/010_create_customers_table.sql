-- Create customers table
-- Simple table with name and description fields

-- Customers table
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nama TEXT NOT NULL UNIQUE,
  description TEXT,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Disable RLS on customers table
ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;

-- Create trigger to auto-update updated_at for customers
DROP TRIGGER IF EXISTS set_updated_at_customers ON public.customers;
CREATE TRIGGER set_updated_at_customers
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_customers_nama ON public.customers(nama);

