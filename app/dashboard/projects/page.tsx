import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { ProjectsList } from "@/components/projects/projects-list";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: projects } = await supabase
    .from("projects")
    .select(`
      *,
      customer:customers(*),
      sales:users(*),
      distributor:distributors(*),
      project_products(
        product:products(
          *,
          brand:brands(
            *,
            sub_category:sub_categories(
              *,
              category:categories(*)
            )
          )
        )
      ),
      project_presales(
        user:users(*)
      ),
      project_engineers(
        user:users(*)
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8 min-h-screen space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Project Management</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage projects</p>
      </div>

      <ProjectsList initialProjects={projects || []} />
    </div>
  );
}

