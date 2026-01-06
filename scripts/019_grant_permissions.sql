-- Ensure permissions are granted for all master tables
GRANT ALL ON public.categories TO authenticated, anon, service_role;
GRANT ALL ON public.sub_categories TO authenticated, anon, service_role;
GRANT ALL ON public.brands TO authenticated, anon, service_role;
GRANT ALL ON public.products TO authenticated, anon, service_role;
GRANT ALL ON public.users TO authenticated, anon, service_role;
GRANT ALL ON public.product_executives TO authenticated, anon, service_role;

-- Ensure sequences are also granted if any
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon, service_role;
