import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { LayoutDashboard } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!userProfile) {
    redirect("/auth/login");
  }

  // Fetch all data for dashboard
  const [projectsResult, customersResult, productsResult, usersResult] = await Promise.all([
    supabase
      .from("projects")
      .select(`
        *,
        customer:customers(*),
        sales:users!sales_id(*),
        project_manager:users!project_manager_id(*)
      `)
      .order("created_at", { ascending: false }),
    supabase
      .from("customers")
      .select("*")
      .eq("status_aktif", true),
    supabase
      .from("products")
      .select("*")
      .eq("status_aktif", true),
    supabase
      .from("users")
      .select("*")
      .eq("status_aktif", true),
  ]);

  const projects = projectsResult.data || [];
  const customers = customersResult.data || [];
  const products = productsResult.data || [];
  const users = usersResult.data || [];

  // Calculate statistics
  const totalProjects = projects.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const totalUsers = users.length;

  // Filter projects based on user role
  let filteredProjects = projects;
  if (userProfile.role === 'Sales') {
    filteredProjects = projects.filter(p => p.sales_id === user.id);
  } else if (userProfile.role === 'Project Manager') {
    filteredProjects = projects.filter(p => p.project_manager_id === user.id);
  }

  return (
    <div className="p-6 md:p-8 min-h-screen space-y-8 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl blur-lg opacity-30 animate-pulse" />
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
              <LayoutDashboard className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-50 dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
              Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-base font-medium">
              Welcome back, {userProfile.nama_lengkap}
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Content with Drag and Drop */}
      <DashboardContent
        userProfile={userProfile}
        projects={projects}
        filteredProjects={filteredProjects}
        totalProjects={totalProjects}
        totalCustomers={totalCustomers}
        totalProducts={totalProducts}
        totalUsers={totalUsers}
      />
    </div>
  );
}

