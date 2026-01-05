-- Create product_executives table
-- Link between brands and users with role 'Marketing'

CREATE TABLE IF NOT EXISTS public.product_executives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(brand_id, user_id)
);

-- Disable RLS on product_executives table
ALTER TABLE public.product_executives DISABLE ROW LEVEL SECURITY;

-- Create trigger to auto-update updated_at for product_executives
DROP TRIGGER IF EXISTS set_updated_at_product_executives ON public.product_executives;
CREATE TRIGGER set_updated_at_product_executives
  BEFORE UPDATE ON public.product_executives
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_executives_brand_id ON public.product_executives(brand_id);
CREATE INDEX IF NOT EXISTS idx_product_executives_user_id ON public.product_executives(user_id);
