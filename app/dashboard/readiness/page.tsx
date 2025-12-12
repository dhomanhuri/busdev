import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { ReadinessList } from "@/components/master/readiness-list";
import { CheckCircle } from "lucide-react";

export default async function ReadinessPage() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect("/auth/login");
  }

  const { data: readiness } = await supabase
    .from("readiness")
    .select("*")
    .order("created_at", { ascending: false });

  const totalReadiness = readiness?.length || 0;

  return (
    <div className="p-6 md:p-8 min-h-screen space-y-8 bg-gradient-to-br from-slate-50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl blur-lg opacity-30 animate-pulse" />
            <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/25">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-50 dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
              Readiness
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-base font-medium">
              Manage product readiness status
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 hover:border-green-300 dark:hover:border-green-700/50 hover:shadow-xl hover:shadow-green-500/10 dark:hover:shadow-green-900/20 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Total Status</p>
            <div className="px-3 py-1 rounded-lg bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/40 dark:to-green-800/20 text-green-600 dark:text-green-400 text-xs font-bold shadow-sm">
              Total
            </div>
          </div>
          <p className="relative text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-2 tracking-tight">{totalReadiness}</p>
          <p className="relative text-xs text-slate-500 dark:text-slate-400 font-medium">All readiness levels</p>
        </div>
      </div>

      <ReadinessList initialReadiness={readiness || []} />
    </div>
  );
}

