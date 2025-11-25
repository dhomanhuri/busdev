import { createClient } from "@/lib/supabase/server";
import { redirect } from 'next/navigation';
import { ReadinessList } from "@/components/master/readiness-list";

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

  return (
    <div className="p-8 min-h-screen space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">Master Readiness</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Manage readiness status</p>
      </div>

      <ReadinessList initialReadiness={readiness || []} />
    </div>
  );
}

