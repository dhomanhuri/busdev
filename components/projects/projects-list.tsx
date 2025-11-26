"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProjectDialog } from "./project-dialog";
import { ProjectDetailDialog } from "./project-detail-dialog";
import { ListControls } from "@/components/ui/list-controls";
import { Plus, Trash2, Edit, Eye } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

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

      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          {filteredAndSortedProjects.length === 0 ? (
            <p className="text-center text-slate-600 dark:text-slate-400 py-8">No projects found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">PID</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Customer</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">AM</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Date</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="py-3 px-4 text-slate-900 dark:text-slate-50 font-medium">{project.pid || "-"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{project.customer?.nama || "-"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{project.sales?.nama_lengkap || "-"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {project.tanggal ? new Date(project.tanggal).toLocaleDateString() : "-"}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            project.status_aktif
                              ? "bg-green-900 text-green-200"
                              : "bg-gray-900 text-gray-200"
                          }
                        >
                          {project.status_aktif ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right gap-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setViewingProject(project);
                            setShowDetailDialog(true);
                          }}
                          className="text-green-400 hover:text-green-300"
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
                          className="text-blue-400 hover:text-blue-300"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

