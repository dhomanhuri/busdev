"use client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ProjectDetailDialog({
  project,
  onClose,
}: {
  project: any | null;
  onClose: () => void;
}) {
  if (!project) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-50">
            Project Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  PID (Project ID)
                </label>
                <p className="text-slate-900 dark:text-slate-50 mt-1">
                  {project.pid || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Date
                </label>
                <p className="text-slate-900 dark:text-slate-50 mt-1">
                  {project.tanggal
                    ? new Date(project.tanggal).toLocaleDateString()
                    : "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Customer
                </label>
                <p className="text-slate-900 dark:text-slate-50 mt-1">
                  {project.customer?.nama || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  AM
                </label>
                <p className="text-slate-900 dark:text-slate-50 mt-1">
                  {project.sales?.nama_lengkap || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Project Manager
                </label>
                <p className="text-slate-900 dark:text-slate-50 mt-1">
                  {project.project_manager?.nama_lengkap || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Distributor
                </label>
                <p className="text-slate-900 dark:text-slate-50 mt-1">
                  {project.distributor?.name || "-"}
                </p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <p className="text-slate-900 dark:text-slate-50 mt-1 whitespace-pre-wrap">
                  {project.description || "-"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status
                </label>
                <div className="mt-1">
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
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Products
            </h3>
            {project.project_products && project.project_products.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.project_products.map((pp: any) => (
                  <Badge
                    key={pp.product?.id}
                    className="bg-blue-900 text-blue-200"
                  >
                    {pp.product?.brand?.sub_category?.category?.name} -{" "}
                    {pp.product?.brand?.sub_category?.name} -{" "}
                    {pp.product?.brand?.name} - {pp.product?.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-400">No products</p>
            )}
          </div>

          {/* Presales */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Presales
            </h3>
            {project.project_presales && project.project_presales.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.project_presales.map((pp: any) => (
                  <Badge
                    key={pp.user?.id}
                    className="bg-purple-900 text-purple-200"
                  >
                    {pp.user?.nama_lengkap}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-400">No presales</p>
            )}
          </div>

          {/* Engineers */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
              Engineers
            </h3>
            {project.project_engineers && project.project_engineers.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {project.project_engineers.map((pe: any) => (
                  <Badge
                    key={pe.user?.id}
                    className="bg-orange-900 text-orange-200"
                  >
                    {pe.user?.nama_lengkap}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-400">No engineers</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

