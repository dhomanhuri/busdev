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
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-slate-900 dark:text-slate-50">Recent Projects</CardTitle>
        <Link 
          href="/dashboard/projects"
          className="text-sm text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {recentProjects.length === 0 ? (
          <p className="text-center text-slate-600 dark:text-slate-400 py-4">No projects yet</p>
        ) : (
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    {project.pid || 'No PID'}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {project.customer?.nama || 'No Customer'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    {project.tanggal ? new Date(project.tanggal).toLocaleDateString() : 'No Date'} • {project.sales?.nama_lengkap || 'No AM'}
                  </p>
                </div>
                <Badge
                  className={
                    project.status_aktif
                      ? "bg-green-900 text-green-200"
                      : "bg-gray-900 text-gray-200"
                  }
                >
                  {project.status_aktif ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

