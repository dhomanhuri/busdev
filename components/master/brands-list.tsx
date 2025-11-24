"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BrandDialog } from "./brand-dialog";
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

export function BrandsList({ initialBrands }: { initialBrands: any[] }) {
  const [brands, setBrands] = useState(initialBrands);
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);

  const filteredBrands = brands.filter((brand) => {
    const matchesSearch =
      brand.name.toLowerCase().includes(search.toLowerCase()) ||
      brand.sub_category?.name.toLowerCase().includes(search.toLowerCase()) ||
      brand.sub_category?.category?.name.toLowerCase().includes(search.toLowerCase()) ||
      (brand.description?.toLowerCase().includes(search.toLowerCase()) || false);
    return matchesSearch;
  });

  const handleBrandSaved = (updatedBrand: any) => {
    if (editingBrand) {
      setBrands(brands.map(b => b.id === updatedBrand.id ? updatedBrand : b));
      setEditingBrand(null);
    } else {
      setBrands([updatedBrand, ...brands]);
    }
    setShowDialog(false);
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (!confirm("Are you sure you want to delete this brand? This will also delete all related products.")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("brands")
        .delete()
        .eq("id", brandId);

      if (error) throw error;
      setBrands(brands.filter(b => b.id !== brandId));
    } catch (err: any) {
      alert("Failed to delete brand: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          <Input
            placeholder="Search brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
          />
        </div>
        <Button
          onClick={() => {
            setEditingBrand(null);
            setShowDialog(true);
          }}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Brand
        </Button>
      </div>

      {showDialog && (
        <BrandDialog
          brand={editingBrand}
          onClose={() => {
            setShowDialog(false);
            setEditingBrand(null);
          }}
          onSave={handleBrandSaved}
        />
      )}

      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          {filteredBrands.length === 0 ? (
            <p className="text-center text-slate-600 dark:text-slate-400 py-8">No brands found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Category</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Sub Category</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Name</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Description</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Partnerships</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Created</th>
                    <th className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBrands.map((brand) => (
                    <tr
                      key={brand.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{brand.sub_category?.category?.name || "-"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{brand.sub_category?.name || "-"}</td>
                      <td className="py-3 px-4 text-slate-900 dark:text-slate-50 font-medium">{brand.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{brand.description || "-"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {brand.brand_partnerships && brand.brand_partnerships.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {brand.brand_partnerships.map((bp: any) => (
                              <Badge
                                key={bp.partnership?.id}
                                className="bg-blue-900 text-blue-200 text-xs"
                              >
                                {bp.partnership?.name}
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
                            brand.status_aktif
                              ? "bg-green-900 text-green-200"
                              : "bg-gray-900 text-gray-200"
                          }
                        >
                          {brand.status_aktif ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {new Date(brand.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right gap-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingBrand(brand);
                            setShowDialog(true);
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteBrand(brand.id)}
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

