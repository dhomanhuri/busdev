import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { BrandsList } from "@/components/master/brands-list";

export default async function BrandsPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: brands } = await supabase
    .from("brands")
    .select(`
      *,
      sub_category:sub_categories(
        *,
        category:categories(*)
      ),
      brand_partnerships(
        partnership:partnerships(*)
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 min-h-screen space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Master Brand</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage product brands</p>
      </div>

      <BrandsList initialBrands={brands || []} />
    </div>
  );
}

