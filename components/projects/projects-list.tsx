"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectDialog } from "./project-dialog";
import { ProjectDetailDialog } from "./project-detail-dialog";
import { ListControls } from "@/components/ui/list-controls";
import { Plus, Trash2, Edit, Eye, FolderKanban, Calendar, MoreVertical, LayoutGrid, List } from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ProjectsList({ initialProjects }: { initialProjects: any[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [viewingProject, setViewingProject] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  const filteredAndSortedProjects = projects
    .filter((project) => {
      const matchesSearch =
        (project.pid?.toLowerCase().includes(search.toLowerCase()) || false) ||
        project.customer?.nama?.toLowerCase().includes(search.toLowerCase()) ||
        project.sales?.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
        (project.distributor?.name?.toLowerCase().includes(search.toLowerCase()) || false);

      return matchesSearch;
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
    if (!updatedProject) {
      console.error("No project data returned");
      return;
    }

    console.log("handleProjectSaved called with:", updatedProject);
    console.log("Is editing:", !!editingProject);

    if (editingProject) {
      // Update existing project
      setProjects(prevProjects => {
        const updated = prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p);
        console.log("Updated projects list:", updated);
        return updated;
      });
      setEditingProject(null);
    } else {
      // Add new project to the beginning of the list
      // Ensure we don't add duplicates
      setProjects((prevProjects) => {
        // Check if project already exists (shouldn't happen, but just in case)
        const exists = prevProjects.some(p => p.id === updatedProject.id);
        if (exists) {
          console.log("Project already exists, updating instead");
          // If exists, update it instead
          return prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p);
        }
        // Add new project at the beginning
        const newList = [updatedProject, ...prevProjects];
        console.log("Added new project to list. New list length:", newList.length);
        return newList;
      });
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex-1">
          <ListControls
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search project by PID, customer..."
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
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("card")}
              className={cn(
                "h-9 px-3 rounded-lg transition-all duration-200",
                viewMode === "card"
                  ? "bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("list")}
              className={cn(
                "h-9 px-3 rounded-lg transition-all duration-200",
                viewMode === "list"
                  ? "bg-white dark:bg-slate-700 text-orange-600 dark:text-orange-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={() => {
              setEditingProject(null);
              setShowDialog(true);
            }}
            className="relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl px-6 h-11 font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
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

      {filteredAndSortedProjects.length === 0 ? (
        <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 rounded-3xl blur-xl opacity-50" />
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-800/30 flex items-center justify-center border border-orange-200/50 dark:border-orange-800/30">
                  <FolderKanban className="h-12 w-12 text-orange-500 dark:text-orange-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">No projects found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm leading-relaxed mb-8">
                We couldn't find any projects matching your search. Try adjusting your filters or create a new project to get started.
              </p>
              <Button
                variant="outline"
                className="border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl px-6 font-medium hover:scale-105 transition-transform duration-200"
                onClick={() => {
                  setSearch("");
                  setSortBy("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAndSortedProjects.map((project, index) => (
            <Card
              key={project.id}
              className={cn(
                "group relative border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer hover:border-orange-300 dark:hover:border-orange-700/50"
              )}
              onClick={() => {
                setViewingProject(project);
                setShowDetailDialog(true);
              }}
            >
              {/* Status indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
              
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />
                      <span className="font-bold text-lg text-slate-900 dark:text-slate-50 truncate">
                        {project.pid || "No PID"}
                      </span>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <Button 
                                variant="outline" 
                                className="h-9 w-9 p-0 rounded-lg bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
                              >
                                <MoreVertical className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px] border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xl backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
                          <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingProject(project);
                              setShowDetailDialog(true);
                            }}
                            className="cursor-pointer rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                          >
                            <Eye className="mr-2 h-4 w-4 text-emerald-500" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingProject(project);
                              setShowDialog(true);
                            }}
                            className="cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20"
                          >
                            <Edit className="mr-2 h-4 w-4 text-blue-500" />
                            Edit Project
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer rounded-lg" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="left" className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-none shadow-lg">
                        <p className="font-semibold">Actions</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Customer */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                    <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {project.customer?.nama?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">Customer</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-50 truncate">
                      {project.customer?.nama || "-"}
                    </p>
                  </div>
                </div>

                {/* Account Manager */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-slate-500 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                      {project.sales?.nama_lengkap?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-0.5">Account Manager</p>
                    <p className="font-medium text-slate-700 dark:text-slate-300 truncate">
                      {project.sales?.nama_lengkap || "-"}
                    </p>
                  </div>
                </div>

                {/* Revenue */}
                {project.nilai_project && (
                  <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-700/50 border border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Revenue</p>
                    <p className="font-mono text-lg font-bold text-slate-900 dark:text-slate-50">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(project.nilai_project)}
                    </p>
                  </div>
                )}

                {/* Period */}
                {project.periode_mulai && (
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
                    <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="font-medium">
                      {new Date(project.periode_mulai).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {project.periode_selesai && (
                      <>
                        <span className="text-orange-500">→</span>
                        <span className="font-medium">
                          {new Date(project.periode_selesai).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="overflow-x-auto relative">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-slate-50/80 to-slate-100/50 dark:from-slate-900/80 dark:to-slate-800/50 backdrop-blur-sm">
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Project ID</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Customer</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Account Manager</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-right">Revenue</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">Period</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/30">
                  {filteredAndSortedProjects.map((project, index) => (
                    <tr
                      key={project.id}
                      className={cn(
                        "group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-all duration-200 cursor-pointer",
                        index % 2 === 0 ? "bg-white/50 dark:bg-slate-900/50" : "bg-slate-50/20 dark:bg-slate-900/20"
                      )}
                      onClick={() => {
                        setViewingProject(project);
                        setShowDetailDialog(true);
                      }}
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-orange-500 rounded-full blur-sm opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                            <div className="relative h-3 w-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex-shrink-0 shadow-sm" />
                          </div>
                          <span className="font-bold text-slate-900 dark:text-slate-50 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {project.pid || "No PID"}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-lg blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200">
                              {project.customer?.nama?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-slate-50 truncate">
                            {project.customer?.nama || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-slate-500 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                            <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-200">
                              {project.sales?.nama_lengkap?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                          </div>
                          <span className="text-slate-700 dark:text-slate-300 text-sm truncate font-medium">
                            {project.sales?.nama_lengkap || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-right">
                        <span className="font-mono text-slate-900 dark:text-slate-50 text-sm bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 font-bold shadow-sm">
                          {project.nilai_project
                            ? new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(project.nilai_project)
                            : "-"}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex flex-col items-center gap-1">
                          {project.periode_mulai && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/60 whitespace-nowrap shadow-sm">
                              <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                              <span className="font-medium">{new Date(project.periode_mulai).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })}</span>
                              <span className="mx-0.5 text-orange-500">→</span>
                              <span className="font-medium">{project.periode_selesai ? new Date(project.periode_selesai).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }) : "?"}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <div className="flex items-center justify-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                      <Button 
                                        variant="outline" 
                                        className="h-10 w-10 p-0 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 hover:scale-110 shadow-sm hover:shadow-md"
                                      >
                                        <MoreVertical className="h-5 w-5" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[180px] border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xl backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
                                  <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setViewingProject(project);
                                      setShowDetailDialog(true);
                                    }}
                                    className="cursor-pointer rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                                  >
                                    <Eye className="mr-2 h-4 w-4 text-emerald-500" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingProject(project);
                                      setShowDialog(true);
                                    }}
                                    className="cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                  >
                                    <Edit className="mr-2 h-4 w-4 text-blue-500" />
                                    Edit Project
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer rounded-lg" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteProject(project.id);
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="left" className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-none shadow-lg">
                                <p className="font-semibold">Actions</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/60 px-6 shadow-sm">
        <span className="font-semibold">
          Showing <span className="font-extrabold text-slate-900 dark:text-slate-50">{filteredAndSortedProjects.length}</span> of <span className="font-extrabold text-slate-900 dark:text-slate-50">{projects.length}</span> projects
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Last updated: just now</span>
      </div>
    </div>
  );
}

