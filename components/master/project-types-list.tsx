"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProjectTypeDialog } from "./project-type-dialog";
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

export function ProjectTypesList({ initialProjectTypes }: { initialProjectTypes: any[] }) {
  const [projectTypes, setProjectTypes] = useState(initialProjectTypes);
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingProjectType, setEditingProjectType] = useState<any>(null);

  const filteredProjectTypes = projectTypes.filter((projectType) => {
    const matchesSearch =
      projectType.name.toLowerCase().includes(search.toLowerCase()) ||
      (projectType.description?.toLowerCase().includes(search.toLowerCase()) || false);
    return matchesSearch;
  });

  const handleProjectTypeSaved = (updatedProjectType: any) => {
    if (editingProjectType) {
      setProjectTypes(projectTypes.map(pt => pt.id === updatedProjectType.id ? updatedProjectType : pt));
      setEditingProjectType(null);
    } else {
      setProjectTypes([updatedProjectType, ...projectTypes]);
    }
    setShowDialog(false);
  };

  const handleDeleteProjectType = async (projectTypeId: string) => {
    if (!confirm("Are you sure you want to delete this project type? This action cannot be undone.")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("project_types")
        .delete()
        .eq("id", projectTypeId);

      if (error) throw error;
      setProjectTypes(projectTypes.filter(pt => pt.id !== projectTypeId));
    } catch (err: any) {
      alert("Failed to delete project type: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          <Input
            placeholder="Search project type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
          />
        </div>
        <Button
          onClick={() => {
            setEditingProjectType(null);
            setShowDialog(true);
          }}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Project Type
        </Button>
      </div>

      {showDialog && (
        <ProjectTypeDialog
          projectType={editingProjectType}
          onClose={() => {
            setShowDialog(false);
            setEditingProjectType(null);
          }}
          onSave={handleProjectTypeSaved}
        />
      )}

      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          {filteredProjectTypes.length === 0 ? (
            <p className="text-center text-slate-600 dark:text-slate-400 py-8">No project types found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Name</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Description</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Created</th>
                    <th className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjectTypes.map((projectType) => (
                    <tr
                      key={projectType.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="py-3 px-4 text-slate-900 dark:text-slate-50 font-medium">{projectType.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{projectType.description || "-"}</td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            projectType.status_aktif
                              ? "bg-green-900 text-green-200"
                              : "bg-gray-900 text-gray-200"
                          }
                        >
                          {projectType.status_aktif ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {new Date(projectType.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right gap-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingProjectType(projectType);
                            setShowDialog(true);
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProjectType(projectType.id)}
                          className="text-red-400 hover:text-red-300"
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
