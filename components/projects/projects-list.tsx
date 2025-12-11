"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectDialog } from "./project-dialog";
import { ProjectDetailDialog } from "./project-detail-dialog";
import { ListControls } from "@/components/ui/list-controls";
import { Plus, Trash2, Edit, Eye, FolderKanban, Calendar, MoreVertical } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProjectsList({ initialProjects }: { initialProjects: any[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [viewingProject, setViewingProject] = useState<any>(null);

  const filteredAndSortedProjects = projects
    .filter((project) => {
      const matchesSearch =
        (project.pid?.toLowerCase().includes(search.toLowerCase()) || false) ||
        project.customer?.nama?.toLowerCase().includes(search.toLowerCase()) ||
        project.sales?.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
        (project.distributor?.name?.toLowerCase().includes(search.toLowerCase()) || false);

      const matchesStatus = !statusFilter ||
        (statusFilter === "active" && project.status_aktif) ||
        (statusFilter === "inactive" && !project.status_aktif);

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;

      switch (sortBy) {
        case "pid_asc":
          return (a.pid || "").localeCompare(b.pid || "");
        case "pid_desc":
          return (b.pid || "").localeCompare(a.pid || "");
        case "customer_asc":
          return (a.customer?.nama || "").localeCompare(b.customer?.nama || "");
        case "customer_desc":
          return (b.customer?.nama || "").localeCompare(a.customer?.nama || "");
        case "nilai_asc":
          return (a.nilai_project || 0) - (b.nilai_project || 0);
        case "nilai_desc":
          return (b.nilai_project || 0) - (a.nilai_project || 0);
        case "created_asc":
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case "created_desc":
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default:
          return 0;
      }
    });

  const handleProjectSaved = (updatedProject: any) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
      setEditingProject(null);
    } else {
      setProjects([updatedProject, ...projects]);
    }
    setShowDialog(false);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm("Are you sure you want to delete this project? This will also remove all related data.")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) throw error;
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err: any) {
      alert("Failed to delete project: " + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between">
        <div className="flex-1">
          <ListControls
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search project by PID, customer..."
            filterValue={statusFilter}
            onFilterChange={setStatusFilter}
            filterOptions={[
              { value: "active", label: "Active Projects" },
              { value: "inactive", label: "Inactive Projects" },
            ]}
            filterLabel="Status"
            sortValue={sortBy}
            onSortChange={setSortBy}
            sortOptions={[
              { value: "pid_asc", label: "PID (A-Z)" },
              { value: "pid_desc", label: "PID (Z-A)" },
              { value: "customer_asc", label: "Customer (A-Z)" },
              { value: "nilai_desc", label: "Revenue (High-Low)" },
              { value: "created_desc", label: "Newest First" },
            ]}
          />
        </div>
        <Button
          onClick={() => {
            setEditingProject(null);
            setShowDialog(true);
          }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/20 rounded-xl px-6 h-10 transition-all hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {showDialog && (
        <ProjectDialog
          project={editingProject}
          onClose={() => {
            setShowDialog(false);
            setEditingProject(null);
          }}
          onSave={handleProjectSaved}
        />
      )}

      {showDetailDialog && (
        <ProjectDetailDialog
          project={viewingProject}
          onClose={() => {
            setShowDetailDialog(false);
            setViewingProject(null);
          }}
        />
      )}

      <Card className="border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl ring-1 ring-slate-200/50 dark:ring-slate-800/50 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {filteredAndSortedProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-4 animate-pulse">
                <FolderKanban className="h-10 w-10 text-orange-400 dark:text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">No projects found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-2">
                We couldn't find any projects matching your search. Try adjusting options or create a new one.
              </p>
              <Button
                variant="outline"
                className="mt-6 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                  setSortBy("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto relative">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
                    <th className="py-4 px-6 text-xs font-extra-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Project ID</th>
                    <th className="py-4 px-6 text-xs font-extra-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Customer</th>
                    <th className="py-4 px-6 text-xs font-extra-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider">Account Manager</th>
                    <th className="py-4 px-6 text-xs font-extra-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider text-right">Revenue</th>
                    <th className="py-4 px-6 text-xs font-extra-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider text-center">Period</th>
                    <th className="py-4 px-6 text-xs font-extra-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider text-center">Status</th>
                    <th className="py-4 px-6 text-xs font-extra-bold text-slate-700 dark:text-slate-400 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredAndSortedProjects.map((project, index) => (
                    <tr
                      key={project.id}
                      className={cn(
                        "group transition-all duration-200 hover:bg-orange-50/30 dark:hover:bg-orange-950/10",
                        index % 2 === 0 ? "bg-white dark:bg-slate-900/80" : "bg-slate-50/30 dark:bg-slate-900/40"
                      )}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-2 rounded-full bg-orange-500/20 group-hover:bg-orange-500 transition-colors" />
                          <div>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                              {project.pid || "No PID"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-800/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs shadow-sm">
                            {project.customer?.nama?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-800 dark:text-slate-300">
                            {project.customer?.nama || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold">
                            {project.sales?.nama_lengkap?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                            {project.sales?.nama_lengkap || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-mono font-medium text-slate-700 dark:text-slate-300 text-sm bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                          {project.nilai_project
                            ? new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }).format(project.nilai_project)
                            : "-"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col items-center gap-1">
                          {project.periode_mulai && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded-full">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(project.periode_mulai).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })}
                              <span className="text-orange-400 mx-1">→</span>
                              {project.periode_selesai ? new Date(project.periode_selesai).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }) : "?"}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm",
                            project.status_aktif
                              ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30"
                              : "bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/30"
                          )}
                        >
                          {project.status_aktif ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-orange-500">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[160px]">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => {
                                setViewingProject(project);
                                setShowDetailDialog(true);
                              }}>
                                <Eye className="mr-2 h-4 w-4 text-emerald-500" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                setEditingProject(project);
                                setShowDialog(true);
                              }}>
                                <Edit className="mr-2 h-4 w-4 text-blue-500" />
                                Edit Project
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20" onClick={() => handleDeleteProject(project.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 px-2">
        <span>Showing {filteredAndSortedProjects.length} of {projects.length} projects</span>
        <span>Last updated: just now</span>
      </div>
    </div>
  );
}

