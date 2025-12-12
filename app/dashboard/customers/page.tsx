import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { CustomersList } from "@/components/master/customers-list";
import { UserCircle } from "lucide-react";

export default async function CustomersPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  // Calculate statistics
  const totalCustomers = customers?.length || 0;
  const activeCustomers = customers?.filter(c => c.status_aktif).length || 0;

  return (
    <div className="p-6 md:p-8 min-h-screen space-y-8 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl blur-lg opacity-30 animate-pulse" />
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <UserCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-50 dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
              Customers
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-base font-medium">
              Manage your customer database
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 hover:border-purple-300 dark:hover:border-purple-700/50 hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-900/20 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Customers</p>
            <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/20 text-purple-600 dark:text-purple-400 text-xs font-bold shadow-sm">
              Total
            </div>
          </div>
          <p className="relative text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-2 tracking-tight">{totalCustomers}</p>
          <p className="relative text-xs text-slate-500 dark:text-slate-400 font-medium">{activeCustomers} active</p>
        </div>

        <div className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-900/20 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Active Customers</p>
            <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold shadow-sm">
              Active
            </div>
          </div>
          <p className="relative text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-2 tracking-tight">{activeCustomers}</p>
          <p className="relative text-xs text-slate-500 dark:text-slate-400 font-medium">
            {totalCustomers > 0 ? Math.round((activeCustomers / totalCustomers) * 100) : 0}% of total
          </p>
        </div>
      </div>

      <CustomersList initialCustomers={customers || []} />
    </div>
  );
}

