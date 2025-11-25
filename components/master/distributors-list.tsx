"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DistributorDialog } from "./distributor-dialog";
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

export function DistributorsList({ initialDistributors }: { initialDistributors: any[] }) {
  const [distributors, setDistributors] = useState(initialDistributors);
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingDistributor, setEditingDistributor] = useState<any>(null);

  const filteredDistributors = distributors.filter((distributor) => {
    const matchesSearch =
      distributor.name.toLowerCase().includes(search.toLowerCase()) ||
      (distributor.description?.toLowerCase().includes(search.toLowerCase()) || false);
    return matchesSearch;
  });

  const handleDistributorSaved = (updatedDistributor: any) => {
    if (editingDistributor) {
      setDistributors(distributors.map(d => d.id === updatedDistributor.id ? updatedDistributor : d));
      setEditingDistributor(null);
    } else {
      setDistributors([updatedDistributor, ...distributors]);
    }
    setShowDialog(false);
  };

  const handleDeleteDistributor = async (distributorId: string) => {
    if (!confirm("Are you sure you want to delete this distributor? This will also remove all product associations.")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("distributors")
        .delete()
        .eq("id", distributorId);

      if (error) throw error;
      setDistributors(distributors.filter(d => d.id !== distributorId));
    } catch (err: any) {
      alert("Failed to delete distributor: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          <Input
            placeholder="Search distributor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
          />
        </div>
        <Button
          onClick={() => {
            setEditingDistributor(null);
            setShowDialog(true);
          }}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Distributor
        </Button>
      </div>

      {showDialog && (
        <DistributorDialog
          distributor={editingDistributor}
          onClose={() => {
            setShowDialog(false);
            setEditingDistributor(null);
          }}
          onSave={handleDistributorSaved}
        />
      )}

      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          {filteredDistributors.length === 0 ? (
            <p className="text-center text-slate-600 dark:text-slate-400 py-8">No distributors found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Nama</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Deskripsi</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Products</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Created</th>
                    <th className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDistributors.map((distributor) => (
                    <tr
                      key={distributor.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="py-3 px-4 text-slate-900 dark:text-slate-50 font-medium">{distributor.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{distributor.description || "-"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {distributor.distributor_products && distributor.distributor_products.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {distributor.distributor_products.map((dp: any) => (
                              <Badge
                                key={dp.product?.id}
                                className="bg-indigo-900 text-indigo-200 text-xs"
                              >
                                {dp.product?.name}
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
                            distributor.status_aktif
                              ? "bg-green-900 text-green-200"
                              : "bg-gray-900 text-gray-200"
                          }
                        >
                          {distributor.status_aktif ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {new Date(distributor.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right gap-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingDistributor(distributor);
                            setShowDialog(true);
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDistributor(distributor.id)}
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

