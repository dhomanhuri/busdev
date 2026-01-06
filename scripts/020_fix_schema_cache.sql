-- 1. Pastikan tabel benar-benar ada di schema public
CREATE TABLE IF NOT EXISTS public.product_executives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(brand_id, user_id)
);

-- 2. Pastikan RLS dimatikan dulu untuk testing, atau beri akses penuh
ALTER TABLE public.product_executives DISABLE ROW LEVEL SECURITY;

-- 3. Berikan izin eksplisit ke API (anon, authenticated, service_role)
GRANT ALL ON public.product_executives TO anon, authenticated, service_role;
GRANT ALL ON public.brands TO anon, authenticated, service_role;
GRANT ALL ON public.users TO anon, authenticated, service_role;

-- 4. Paksa reload schema cache (jika didukung oleh role Anda)
-- Jika ini gagal, Anda harus menekan tombol "Reload Schema" di Dashboard Supabase
-- Settings -> API -> PostgREST config -> Reload Schema Cache
SELECT pg_notify('pgrst', 'reload schema');
