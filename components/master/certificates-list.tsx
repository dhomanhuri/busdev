"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CertificateDialog } from "./certificate-dialog";
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

export function CertificatesList({ initialCertificates }: { initialCertificates: any[] }) {
  const [certificates, setCertificates] = useState(initialCertificates);
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<any>(null);

  const filteredCertificates = certificates.filter((certificate) => {
    const matchesSearch =
      certificate.name.toLowerCase().includes(search.toLowerCase()) ||
      (certificate.description?.toLowerCase().includes(search.toLowerCase()) || false);
    return matchesSearch;
  });

  const handleCertificateSaved = (updatedCertificate: any) => {
    if (editingCertificate) {
      setCertificates(certificates.map(c => c.id === updatedCertificate.id ? updatedCertificate : c));
      setEditingCertificate(null);
    } else {
      setCertificates([updatedCertificate, ...certificates]);
    }
    setShowDialog(false);
  };

  const handleDeleteCertificate = async (certificateId: string) => {
    if (!confirm("Are you sure you want to delete this certificate? This will also remove all product and user associations.")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("certificates")
        .delete()
        .eq("id", certificateId);

      if (error) throw error;
      setCertificates(certificates.filter(c => c.id !== certificateId));
    } catch (err: any) {
      alert("Failed to delete certificate: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          <Input
            placeholder="Search certificate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
          />
        </div>
        <Button
          onClick={() => {
            setEditingCertificate(null);
            setShowDialog(true);
          }}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Certificate
        </Button>
      </div>

      {showDialog && (
        <CertificateDialog
          certificate={editingCertificate}
          onClose={() => {
            setShowDialog(false);
            setEditingCertificate(null);
          }}
          onSave={handleCertificateSaved}
        />
      )}

      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          {filteredCertificates.length === 0 ? (
            <p className="text-center text-slate-600 dark:text-slate-400 py-8">No certificates found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Name</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Description</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Products</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Created</th>
                    <th className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.map((certificate) => (
                    <tr
                      key={certificate.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="py-3 px-4 text-slate-900 dark:text-slate-50 font-medium">{certificate.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{certificate.description || "-"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {certificate.product_certificates && certificate.product_certificates.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {certificate.product_certificates.map((pc: any) => (
                              <Badge
                                key={pc.product?.id}
                                className="bg-blue-900 text-blue-200 text-xs"
                              >
                                {pc.product?.name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            certificate.status_aktif
                              ? "bg-green-900 text-green-200"
                              : "bg-gray-900 text-gray-200"
                          }
                        >
                          {certificate.status_aktif ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {new Date(certificate.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right gap-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCertificate(certificate);
                            setShowDialog(true);
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCertificate(certificate.id)}
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

