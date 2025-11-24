import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { CategoriesList } from "@/components/master/categories-list";

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 min-h-screen space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Master Category</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage product categories</p>
      </div>

      <CategoriesList initialCategories={categories || []} />
    </div>
  );
}

