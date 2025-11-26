import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { StatsCard } from "@/components/dashboard/stats-card";
import { ProjectsByStatusChart, ProjectsByAMChart, ProjectsTrendChart } from "@/components/dashboard/projects-chart";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { TopCustomers } from "@/components/dashboard/top-customers";

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
  const activeProjects = projects.filter(p => p.status_aktif).length;
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
    <div className="p-6 md:p-8 min-h-screen space-y-6">
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">📊</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm md:text-base">
              Welcome back, {userProfile.nama_lengkap}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Projects"
          value={userProfile.role === 'Admin' || userProfile.role === 'GM' ? totalProjects : filteredProjects.length}
          icon="projects"
          description={userProfile.role === 'Admin' || userProfile.role === 'GM' ? `${activeProjects} active` : `${filteredProjects.filter(p => p.status_aktif).length} active`}
        />
        <StatsCard
          title="Customers"
          value={totalCustomers}
          icon="customers"
          description="Active customers"
        />
        <StatsCard
          title="Products"
          value={totalProducts}
          icon="products"
          description="Active products"
        />
        <StatsCard
          title="Users"
          value={totalUsers}
          icon="users"
          description="Active users"
        />
      </div>

      {/* Charts and Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectsByStatusChart data={userProfile.role === 'Admin' || userProfile.role === 'GM' ? projects : filteredProjects} />
        <ProjectsByAMChart data={userProfile.role === 'Admin' || userProfile.role === 'GM' ? projects : filteredProjects} />
      </div>

      <ProjectsTrendChart data={userProfile.role === 'Admin' || userProfile.role === 'GM' ? projects : filteredProjects} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentProjects projects={filteredProjects} />
        <TopCustomers projects={userProfile.role === 'Admin' || userProfile.role === 'GM' ? projects : filteredProjects} />
      </div>
    </div>
  );
}

