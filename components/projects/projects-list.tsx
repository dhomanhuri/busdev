"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProjectDialog } from "./project-dialog";
import { ProjectDetailDialog } from "./project-detail-dialog";
import { ListControls } from "@/components/ui/list-controls";
import { Plus, Trash2, Edit, Eye, Calendar, FolderKanban } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

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
        case "tanggal_asc":
          return new Date(a.tanggal || 0).getTime() - new Date(b.tanggal || 0).getTime();
        case "tanggal_desc":
          return new Date(b.tanggal || 0).getTime() - new Date(a.tanggal || 0).getTime();
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
    <div className="space-y-6">
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <ListControls
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search project by PID, customer, AM, or distributor..."
            filterValue={statusFilter}
            onFilterChange={setStatusFilter}
            filterOptions={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
            filterLabel="Status"
            sortValue={sortBy}
            onSortChange={setSortBy}
            sortOptions={[
              { value: "pid_asc", label: "PID (A-Z)" },
              { value: "pid_desc", label: "PID (Z-A)" },
              { value: "customer_asc", label: "Customer (A-Z)" },
              { value: "customer_desc", label: "Customer (Z-A)" },
              { value: "tanggal_asc", label: "Date (Oldest)" },
              { value: "tanggal_desc", label: "Date (Newest)" },
              { value: "created_asc", label: "Created (Oldest)" },
              { value: "created_desc", label: "Created (Newest)" },
            ]}
          />
        </div>
        <Button
          onClick={() => {
            setEditingProject(null);
            setShowDialog(true);
          }}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Project
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

      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          {filteredAndSortedProjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                <FolderKanban className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">No projects found</p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 border-b-2 border-orange-200 dark:border-orange-800/50">
                    <th className="text-left py-4 px-6 text-sm font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
                      PID
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
                      Account Manager
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-center py-4 px-6 text-sm font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredAndSortedProjects.map((project, index) => (
                    <tr
                      key={project.id}
                      className="group bg-white dark:bg-slate-800 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-orange-50/30 dark:hover:from-orange-900/10 dark:hover:to-orange-800/5 transition-all duration-200 cursor-pointer"
                      onClick={() => {
                        setViewingProject(project);
                        setShowDetailDialog(true);
                      }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-400 dark:bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span className="font-semibold text-slate-900 dark:text-slate-50">
                            {project.pid || (
                              <span className="text-slate-400 dark:text-slate-500 italic">No PID</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {project.customer?.nama?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {project.customer?.nama || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {project.sales?.nama_lengkap?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <span className="text-slate-600 dark:text-slate-400">
                            {project.sales?.nama_lengkap || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                          <span className="text-slate-600 dark:text-slate-400">
                            {project.tanggal 
                              ? new Date(project.tanggal).toLocaleDateString('en-US', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })
                              : "-"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center">
                          <Badge
                            className={cn(
                              "px-3 py-1 font-semibold shadow-sm",
                              project.status_aktif
                                ? "bg-gradient-to-r from-green-500 to-green-600 text-white border-0"
                                : "bg-gradient-to-r from-slate-400 to-slate-500 text-white border-0"
                            )}
                          >
                            {project.status_aktif ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setViewingProject(project);
                              setShowDetailDialog(true);
                            }}
                            className="h-8 w-8 p-0 bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 hover:from-green-200 hover:to-green-100 dark:hover:from-green-800/40 dark:hover:to-green-700/30 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 border border-green-200 dark:border-green-800/50 shadow-sm hover:shadow-md transition-all"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingProject(project);
                              setShowDialog(true);
                            }}
                            className="h-8 w-8 p-0 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 hover:from-blue-200 hover:to-blue-100 dark:hover:from-blue-800/40 dark:hover:to-blue-700/30 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-blue-200 dark:border-blue-800/50 shadow-sm hover:shadow-md transition-all"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteProject(project.id)}
                            className="h-8 w-8 p-0 bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20 hover:from-red-200 hover:to-red-100 dark:hover:from-red-800/40 dark:hover:to-red-700/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border border-red-200 dark:border-red-800/50 shadow-sm hover:shadow-md transition-all"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
    </div>
  );
}

