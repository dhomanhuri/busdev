"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProjectDialog } from "./project-dialog";
import { ProjectDetailDialog } from "./project-detail-dialog";
import { Plus, Search, Trash2, Edit, Eye } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

export function ProjectsList({ initialProjects }: { initialProjects: any[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [viewingProject, setViewingProject] = useState<any>(null);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      (project.pid?.toLowerCase().includes(search.toLowerCase()) || false) ||
      project.customer?.nama?.toLowerCase().includes(search.toLowerCase()) ||
      project.sales?.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
      (project.distributor?.name?.toLowerCase().includes(search.toLowerCase()) || false);
    return matchesSearch;
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
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          <Input
            placeholder="Search project by PID, customer, AM, or distributor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
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
          {filteredProjects.length === 0 ? (
            <p className="text-center text-slate-600 dark:text-slate-400 py-8">No projects found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">PID</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Customer</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">AM</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Tanggal</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
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

