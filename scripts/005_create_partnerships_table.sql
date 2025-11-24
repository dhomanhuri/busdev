-- Create partnerships table and brand_partnerships junction table
-- Many-to-many relationship between brands and partnerships

-- Partnerships table
CREATE TABLE IF NOT EXISTS public.partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Brand-Partnership junction table (many-to-many)
CREATE TABLE IF NOT EXISTS public.brand_partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  partnership_id UUID NOT NULL REFERENCES public.partnerships(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(brand_id, partnership_id)
);

-- Disable RLS on partnerships tables
ALTER TABLE public.partnerships DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_partnerships DISABLE ROW LEVEL SECURITY;

-- Create trigger to auto-update updated_at for partnerships
DROP TRIGGER IF EXISTS set_updated_at_partnerships ON public.partnerships;
CREATE TRIGGER set_updated_at_partnerships
  BEFORE UPDATE ON public.partnerships
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_brand_partnerships_brand_id ON public.brand_partnerships(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_partnerships_partnership_id ON public.brand_partnerships(partnership_id);

