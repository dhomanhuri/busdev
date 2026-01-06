-- Script untuk memeriksa apakah tabel ada di schema public
SELECT 
    schemaname, 
    tablename, 
    tableowner 
FROM 
    pg_catalog.pg_tables 
WHERE 
    schemaname = 'public' 
    AND tablename = 'product_executives';

-- Jika hasil di atas KOSONG, berarti tabel BELUM TERBUAT.
-- Jalankan ulang script ini:

CREATE TABLE IF NOT EXISTS public.product_executives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status_aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(brand_id, user_id)
);

-- Pastikan izin diberikan ke role yang benar
GRANT ALL ON public.product_executives TO authenticated, anon, service_role;

-- Penting: Jika menggunakan Supabase, pastikan Anda menekan "Reload Schema" 
-- di Settings -> API jika tabel baru saja dibuat tetapi tidak muncul di API.
