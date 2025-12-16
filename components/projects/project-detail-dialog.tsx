"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FolderKanban,
  Calendar,
  Building2,
  UserCircle,
  Users,
  Truck,
  ShoppingBag,
  Code,
  FileText,
  CheckCircle2,
  XCircle,
  DollarSign,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ProjectDetailDialog({
  project,
  onClose,
}: {
  project: any | null;
  onClose: () => void;
}) {
  if (!project) return null;

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string | React.ReactNode;
  }) => (
    <div className="group flex items-start gap-3 p-4 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 hover:border-orange-300 dark:hover:border-orange-700/50 hover:shadow-md transition-all duration-200">
      <div className="relative mt-0.5">
        <div className="absolute inset-0 bg-orange-500 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
        <div className="relative rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 shadow-sm">
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-900 dark:text-slate-50 break-words">
          {value || "-"}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={!!project} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-slate-200/60 dark:border-slate-800/60 text-slate-900 dark:text-slate-50 max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar scroll-smooth rounded-2xl shadow-2xl">
        <DialogHeader className="pb-6 border-b-2 border-slate-200/60 dark:border-slate-800/60">
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-start gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500 rounded-2xl blur-xl opacity-30 animate-pulse" />
                <div className="relative rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-5 shadow-lg shadow-orange-500/25">
                  <FolderKanban className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <DialogTitle className="text-3xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-50 dark:to-slate-300 bg-clip-text text-transparent tracking-tight mb-3">
                  {project.pid || "Project Details"}
                </DialogTitle>
                <div className="flex items-center gap-3 flex-wrap">
                  {(project.periode_mulai || project.periode_selesai) && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      {project.periode_mulai && project.periode_selesai
                        ? `${new Date(project.periode_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(project.periode_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
                        : project.periode_mulai
                          ? `Mulai: ${new Date(project.periode_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
                          : `Selesai: ${new Date(project.periode_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 rounded-xl p-4 border border-blue-200/60 dark:border-blue-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Revenue</p>
                </div>
                <p className="text-lg font-extrabold text-slate-900 dark:text-slate-50">
                  {project.nilai_project
                    ? new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(project.nilai_project)
                    : "-"}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10 rounded-xl p-4 border border-purple-200/60 dark:border-purple-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <ShoppingBag className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <p className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">Products</p>
                </div>
                <p className="text-lg font-extrabold text-slate-900 dark:text-slate-50">
                  {project.project_products?.length || 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-xl p-4 border border-emerald-200/60 dark:border-emerald-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">Presales</p>
                </div>
                <p className="text-lg font-extrabold text-slate-900 dark:text-slate-50">
                  {project.project_presales?.length || 0}
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10 rounded-xl p-4 border border-orange-200/60 dark:border-orange-800/30">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <p className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide">Engineers</p>
                </div>
                <p className="text-lg font-extrabold text-slate-900 dark:text-slate-50">
                  {project.project_engineers?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-6">
          {/* Customer Card */}
          <Card className="bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-950/20 dark:to-slate-900/80 backdrop-blur-sm border-blue-200/60 dark:border-blue-800/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-extrabold text-slate-900 dark:text-slate-50 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2 shadow-md">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-20" />
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {project.customer?.nama?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mb-1">
                      {project.customer?.nama || "-"}
                    </p>
                    {project.distributor?.name && (
                      <div className="flex items-center gap-2 mt-2">
                        <Truck className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                          {project.distributor.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Overview */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-slate-50 flex items-center gap-3">
                  <div className="rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 p-2 shadow-md">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Account Manager */}
                  {project.sales?.nama_lengkap && (
                    <InfoItem
                      icon={UserCircle}
                      label="Account Manager"
                      value={project.sales.nama_lengkap}
                    />
                  )}

                  {/* Project Manager */}
                  {project.project_manager?.nama_lengkap && (
                    <InfoItem
                      icon={UserCircle}
                      label="Project Manager"
                      value={project.project_manager.nama_lengkap}
                    />
                  )}

                  {/* Presales */}
                  {project.project_presales && project.project_presales.length > 0 && (
                    <>
                      {project.project_presales.map((pp: any, index: number) => (
                        <InfoItem
                          key={pp.user?.id}
                          icon={Users}
                          label={index === 0 ? `Presales (${project.project_presales.length})` : "Presales"}
                          value={pp.user?.nama_lengkap || "-"}
                        />
                      ))}
                    </>
                  )}

                  {/* Engineers */}
                  {project.project_engineers && project.project_engineers.length > 0 && (
                    <>
                      {project.project_engineers.map((pe: any, index: number) => (
                        <InfoItem
                          key={pe.user?.id}
                          icon={Code}
                          label={index === 0 ? `Engineer (${project.project_engineers.length})` : "Engineer"}
                          value={pe.user?.nama_lengkap || "-"}
                        />
                      ))}
                    </>
                  )}

                  {/* Empty State */}
                  {!project.sales?.nama_lengkap && 
                   !project.project_manager?.nama_lengkap && 
                   (!project.project_presales || project.project_presales.length === 0) && 
                   (!project.project_engineers || project.project_engineers.length === 0) && (
                    <div className="col-span-2 text-center py-12 text-slate-500 dark:text-slate-400">
                      <div className="relative w-16 h-16 mx-auto mb-4">
                        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-900/20 rounded-xl blur-lg opacity-50" />
                        <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/20 flex items-center justify-center border border-slate-200/50 dark:border-slate-800/30">
                          <Users className="h-8 w-8 opacity-50" />
                        </div>
                      </div>
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No team members assigned</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Assign team members to this project</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

          {/* Basic Information */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-slate-50 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 p-2 shadow-md">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem
                  icon={FolderKanban}
                  label="Project ID"
                  value={project.pid || "-"}
                />
                <InfoItem
                  icon={Clock}
                  label="Tanggal Mulai"
                  value={
                    project.periode_mulai
                      ? new Date(project.periode_mulai).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      : "-"
                  }
                />
                {project.periode_selesai && (
                  <InfoItem
                    icon={Clock}
                    label="Tanggal Selesai"
                    value={
                      new Date(project.periode_selesai).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    }
                  />
                )}
              </div>
              {project.description && (
                <div className="mt-6 p-5 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-700/50 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                    Description
                  </p>
                  <p className="text-sm text-slate-900 dark:text-slate-50 whitespace-pre-wrap leading-relaxed font-medium">
                    {project.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products */}
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-slate-50 flex items-center gap-3">
                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2 shadow-md">
                  <ShoppingBag className="h-5 w-5 text-white" />
                </div>
                Products
                {project.project_products && project.project_products.length > 0 && (
                  <Badge className="ml-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg font-bold shadow-sm">
                    {project.project_products.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.project_products && project.project_products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.project_products.map((pp: any, index: number) => (
                    <div
                      key={pp.product?.id || index}
                      className="group p-5 rounded-xl bg-gradient-to-br from-blue-50/80 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 backdrop-blur-sm border-2 border-blue-200/60 dark:border-blue-700/50 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                          <ShoppingBag className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-extrabold text-slate-900 dark:text-slate-50 mb-2 text-base leading-tight">
                            {pp.product?.name || "Unknown Product"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {pp.product?.brand?.sub_category?.category?.name && (
                          <Badge className="bg-slate-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                            {pp.product.brand.sub_category.category.name}
                          </Badge>
                        )}
                        {pp.product?.brand?.sub_category?.name && (
                          <Badge className="bg-slate-500 text-white text-xs font-bold px-3 py-1 rounded-lg">
                            {pp.product.brand.sub_category.name}
                          </Badge>
                        )}
                        {pp.product?.brand?.name && (
                          <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
                            {pp.product.brand.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                  <div className="relative w-20 h-20 mx-auto mb-5">
                    <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-2xl blur-lg opacity-50" />
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center border border-blue-200/50 dark:border-blue-800/30">
                      <ShoppingBag className="h-10 w-10 opacity-50" />
                    </div>
                  </div>
                  <p className="text-base font-bold text-slate-700 dark:text-slate-300">No products assigned</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Add products to this project to get started</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </DialogContent>
    </Dialog>
  );
}

