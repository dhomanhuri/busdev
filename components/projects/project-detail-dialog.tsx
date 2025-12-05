"use client";

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
    <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
      <div className="mt-0.5 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 p-2">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 break-words">
          {value || "-"}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar scroll-smooth">
        <DialogHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 p-3 shadow-lg">
              <FolderKanban className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {project.pid || "Project Details"}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  className={cn(
                    "text-xs font-semibold px-3 py-1",
                    project.status_aktif
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                      : "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
                  )}
                >
                  {project.status_aktif ? (
                    <>
                      <CheckCircle2 className="h-3 w-3 mr-1.5 inline" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3 mr-1.5 inline" />
                      Inactive
                    </>
                  )}
                </Badge>
                {(project.periode_mulai || project.periode_selesai) && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {project.periode_mulai && project.periode_selesai
                      ? `${new Date(project.periode_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} - ${new Date(project.periode_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
                      : project.periode_mulai
                      ? `Mulai: ${new Date(project.periode_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
                      : `Selesai: ${new Date(project.periode_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-6">
          {/* Basic Information */}
          <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200 dark:border-slate-700 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 p-1.5">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InfoItem
                  icon={FolderKanban}
                  label="Project ID"
                  value={project.pid || "-"}
                />
                <InfoItem
                  icon={DollarSign}
                  label="Nilai Project"
                  value={
                    project.nilai_project
                      ? new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(project.nilai_project)
                      : "-"
                  }
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
                <InfoItem
                  icon={Clock}
                  label="Tanggal Selesai"
                  value={
                    project.periode_selesai
                      ? new Date(project.periode_selesai).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "-"
                  }
                />
                <InfoItem
                  icon={Building2}
                  label="Customer"
                  value={project.customer?.nama || "-"}
                />
                <InfoItem
                  icon={UserCircle}
                  label="Account Manager"
                  value={project.sales?.nama_lengkap || "-"}
                />
                <InfoItem
                  icon={Users}
                  label="Project Manager"
                  value={project.project_manager?.nama_lengkap || "-"}
                />
                <InfoItem
                  icon={Truck}
                  label="Distributor"
                  value={project.distributor?.name || "-"}
                />
              </div>
              {project.description && (
                <div className="mt-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                    Description
                  </p>
                  <p className="text-sm text-slate-900 dark:text-slate-50 whitespace-pre-wrap leading-relaxed">
                    {project.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Products */}
          <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200 dark:border-slate-700 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 p-1.5">
                  <ShoppingBag className="h-4 w-4 text-white" />
                </div>
                Products
                {project.project_products && project.project_products.length > 0 && (
                  <Badge className="ml-2 bg-blue-500 text-white">
                    {project.project_products.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.project_products && project.project_products.length > 0 ? (
                <div className="space-y-3">
                  {project.project_products.map((pp: any, index: number) => (
                    <div
                      key={pp.product?.id || index}
                      className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700/50 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                            {pp.product?.name || "Unknown Product"}
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {pp.product?.brand?.sub_category?.category?.name && (
                              <Badge className="bg-slate-600 text-white text-xs">
                                {pp.product.brand.sub_category.category.name}
                              </Badge>
                            )}
                            {pp.product?.brand?.sub_category?.name && (
                              <Badge className="bg-slate-500 text-white text-xs">
                                {pp.product.brand.sub_category.name}
                              </Badge>
                            )}
                            {pp.product?.brand?.name && (
                              <Badge className="bg-blue-600 text-white text-xs">
                                {pp.product.brand.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm font-medium">No products assigned</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Presales */}
            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <div className="rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 p-1.5">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  Presales
                  {project.project_presales && project.project_presales.length > 0 && (
                    <Badge className="ml-2 bg-purple-500 text-white">
                      {project.project_presales.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.project_presales && project.project_presales.length > 0 ? (
                  <div className="space-y-2">
                    {project.project_presales.map((pp: any) => (
                      <div
                        key={pp.user?.id}
                        className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700/50 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-gradient-to-br from-purple-400 to-purple-600 p-2">
                            <UserCircle className="h-4 w-4 text-white" />
                          </div>
                          <p className="font-medium text-slate-900 dark:text-slate-50">
                            {pp.user?.nama_lengkap || "-"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                    <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-medium">No presales assigned</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Engineers */}
            <Card className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 border-slate-200 dark:border-slate-700 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  <div className="rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 p-1.5">
                    <Code className="h-4 w-4 text-white" />
                  </div>
                  Engineers
                  {project.project_engineers && project.project_engineers.length > 0 && (
                    <Badge className="ml-2 bg-orange-500 text-white">
                      {project.project_engineers.length}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {project.project_engineers && project.project_engineers.length > 0 ? (
                  <div className="space-y-2">
                    {project.project_engineers.map((pe: any) => (
                      <div
                        key={pe.user?.id}
                        className="p-3 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700/50 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-gradient-to-br from-orange-400 to-orange-600 p-2">
                            <UserCircle className="h-4 w-4 text-white" />
                          </div>
                          <p className="font-medium text-slate-900 dark:text-slate-50">
                            {pe.user?.nama_lengkap || "-"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 dark:text-slate-400">
                    <Code className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-xs font-medium">No engineers assigned</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

