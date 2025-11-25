-- Create projects table and junction tables
-- Projects can have multiple products, presales, and engineers
-- Projects have single customer, sales, and distributor

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pid TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  sales_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  distributor_id UUID REFERENCES public.distributors(id) ON DELETE SET NULL,
  tanggal DATE NOT NULL,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Project-Product junction table (many-to-many)
CREATE TABLE IF NOT EXISTS public.project_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, product_id)
);

-- Project-Presales junction table (many-to-many)
CREATE TABLE IF NOT EXISTS public.project_presales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Project-Engineers junction table (many-to-many)
CREATE TABLE IF NOT EXISTS public.project_engineers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Disable RLS on projects tables
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_presales DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_engineers DISABLE ROW LEVEL SECURITY;

-- Create trigger to auto-update updated_at for projects
DROP TRIGGER IF EXISTS set_updated_at_projects ON public.projects;
CREATE TRIGGER set_updated_at_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_pid ON public.projects(pid);
CREATE INDEX IF NOT EXISTS idx_projects_customer_id ON public.projects(customer_id);
CREATE INDEX IF NOT EXISTS idx_projects_sales_id ON public.projects(sales_id);
CREATE INDEX IF NOT EXISTS idx_projects_distributor_id ON public.projects(distributor_id);
CREATE INDEX IF NOT EXISTS idx_projects_tanggal ON public.projects(tanggal);
CREATE INDEX IF NOT EXISTS idx_project_products_project_id ON public.project_products(project_id);
CREATE INDEX IF NOT EXISTS idx_project_products_product_id ON public.project_products(product_id);
CREATE INDEX IF NOT EXISTS idx_project_presales_project_id ON public.project_presales(project_id);
CREATE INDEX IF NOT EXISTS idx_project_presales_user_id ON public.project_presales(user_id);
CREATE INDEX IF NOT EXISTS idx_project_engineers_project_id ON public.project_engineers(project_id);
CREATE INDEX IF NOT EXISTS idx_project_engineers_user_id ON public.project_engineers(user_id);

