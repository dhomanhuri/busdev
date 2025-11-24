import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { SubCategoriesList } from "@/components/master/sub-categories-list";

export default async function SubCategoriesPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: subCategories } = await supabase
    .from("sub_categories")
    .select(`
      *,
      category:categories(*)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 min-h-screen space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Master Sub Category</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage product sub categories</p>
      </div>

      <SubCategoriesList initialSubCategories={subCategories || []} />
    </div>
  );
}

