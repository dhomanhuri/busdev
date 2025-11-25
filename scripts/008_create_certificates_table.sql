-- Create certificates table and junction tables
-- Many-to-many relationship between certificates and products
-- Many-to-many relationship between certificates and users

-- Certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product-Certificate junction table (many-to-many)
CREATE TABLE IF NOT EXISTS public.product_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  certificate_id UUID NOT NULL REFERENCES public.certificates(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(product_id, certificate_id)
);

-- User-Certificate junction table (many-to-many)
CREATE TABLE IF NOT EXISTS public.user_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  certificate_id UUID NOT NULL REFERENCES public.certificates(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, certificate_id)
);

-- Disable RLS on certificates tables
ALTER TABLE public.certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_certificates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_certificates DISABLE ROW LEVEL SECURITY;

-- Create trigger to auto-update updated_at for certificates
DROP TRIGGER IF EXISTS set_updated_at_certificates ON public.certificates;
CREATE TRIGGER set_updated_at_certificates
  BEFORE UPDATE ON public.certificates
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_certificates_product_id ON public.product_certificates(product_id);
CREATE INDEX IF NOT EXISTS idx_product_certificates_certificate_id ON public.product_certificates(certificate_id);
CREATE INDEX IF NOT EXISTS idx_user_certificates_user_id ON public.user_certificates(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certificates_certificate_id ON public.user_certificates(certificate_id);

