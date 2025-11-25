-- Create readiness table and product_readiness junction table
-- Many-to-many relationship between products and readiness

-- Readiness table
CREATE TABLE IF NOT EXISTS public.readiness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product-Readiness junction table (many-to-many)
CREATE TABLE IF NOT EXISTS public.product_readiness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  readiness_id UUID NOT NULL REFERENCES public.readiness(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, readiness_id)
);

-- Disable RLS on readiness tables
ALTER TABLE public.readiness DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_readiness DISABLE ROW LEVEL SECURITY;

-- Create trigger to auto-update updated_at for readiness
DROP TRIGGER IF EXISTS set_updated_at_readiness ON public.readiness;
CREATE TRIGGER set_updated_at_readiness
  BEFORE UPDATE ON public.readiness
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_readiness_product_id ON public.product_readiness(product_id);
CREATE INDEX IF NOT EXISTS idx_product_readiness_readiness_id ON public.product_readiness(readiness_id);

