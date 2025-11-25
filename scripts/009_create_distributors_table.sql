-- Create distributors table and distributor_products junction table
-- Many-to-many relationship between distributors and products

-- Distributors table
CREATE TABLE IF NOT EXISTS public.distributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Distributor-Product junction table (many-to-many)
CREATE TABLE IF NOT EXISTS public.distributor_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distributor_id UUID NOT NULL REFERENCES public.distributors(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(distributor_id, product_id)
);

-- Disable RLS on distributors tables
ALTER TABLE public.distributors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.distributor_products DISABLE ROW LEVEL SECURITY;

-- Create trigger to auto-update updated_at for distributors
DROP TRIGGER IF EXISTS set_updated_at_distributors ON public.distributors;
CREATE TRIGGER set_updated_at_distributors
  BEFORE UPDATE ON public.distributors
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_distributor_products_distributor_id ON public.distributor_products(distributor_id);
CREATE INDEX IF NOT EXISTS idx_distributor_products_product_id ON public.distributor_products(product_id);

