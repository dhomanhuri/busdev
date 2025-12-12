"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface RecentProjectsProps {
  projects: any[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  const recentProjects = projects.slice(0, 5);

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-slate-50">Recent Projects</CardTitle>
        <Link 
          href="/dashboard/projects"
          className="text-sm font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 flex items-center gap-2 transition-colors group"
        >
          View all
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardHeader>
      <CardContent className="pt-6">
        {recentProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400 font-medium">No projects yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentProjects.map((project, index) => (
              <div
                key={project.id}
                className="group flex items-center justify-between p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30 dark:to-transparent hover:from-orange-50/80 hover:to-orange-50/40 dark:hover:from-orange-950/20 dark:hover:to-transparent hover:border-orange-300 dark:hover:border-orange-700/50 transition-all duration-200"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />
                    <p className="font-bold text-slate-900 dark:text-slate-50">
                      {project.pid || 'No PID'}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-5">
                    {project.customer?.nama || 'No Customer'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 ml-5">
                    {project.tanggal ? new Date(project.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'No Date'} • {project.sales?.nama_lengkap || 'No AM'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

