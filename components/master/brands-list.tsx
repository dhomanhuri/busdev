"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BrandDialog } from "./brand-dialog";
import { Plus, Search, Trash2, Edit, Package, MoreVertical } from 'lucide-react';
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder="Search brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 rounded-xl"
            />
          </div>
        </div>
        <Button
          onClick={() => {
            setEditingBrand(null);
            setShowDialog(true);
          }}
          className="relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl px-6 h-11 font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Brand
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

      {filteredBrands.length === 0 ? (
        <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 rounded-3xl blur-xl opacity-50" />
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-800/30 flex items-center justify-center border border-orange-200/50 dark:border-orange-800/30">
                  <Package className="h-12 w-12 text-orange-500 dark:text-orange-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">No brands found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm leading-relaxed mb-8">
                We couldn't find any brands matching your search. Try adjusting your search or create a new brand to get started.
              </p>
              <Button
                variant="outline"
                className="border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl px-6 font-medium hover:scale-105 transition-transform duration-200"
                onClick={() => setSearch("")}
              >
                Clear Search
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="overflow-x-auto relative">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-slate-50/80 to-slate-100/50 dark:from-slate-900/80 dark:to-slate-800/50 backdrop-blur-sm">
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Category</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Sub Category</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Name</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Description</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Partnerships</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">Status</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Created</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/30">
                  {filteredBrands.map((brand, index) => (
                    <tr
                      key={brand.id}
                      className={cn(
                        "group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-all duration-200",
                        index % 2 === 0 ? "bg-white/50 dark:bg-slate-900/50" : "bg-slate-50/20 dark:bg-slate-900/20"
                      )}
                    >
                      <td className="py-5 px-6">
                        <span className="text-slate-700 dark:text-slate-300">{brand.sub_category?.category?.name || "-"}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-slate-700 dark:text-slate-300">{brand.sub_category?.name || "-"}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="font-bold text-slate-900 dark:text-slate-50">{brand.name}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-slate-600 dark:text-slate-400 text-sm">{brand.description || "-"}</span>
                      </td>
                      <td className="py-5 px-6">
                        {brand.brand_partnerships && brand.brand_partnerships.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {brand.brand_partnerships.map((bp: any) => (
                              <Badge
                                key={bp.partnership?.id}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm"
                              >
                                {bp.partnership?.name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span
                          className={cn(
                            "px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm",
                            brand.status_aktif
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                              : "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
                          )}
                        >
                          {brand.status_aktif ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-slate-600 dark:text-slate-400 text-sm">
                          {new Date(brand.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <div className="flex items-center justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-950/20 text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 hover:scale-110">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px] border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xl backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
                              <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  setEditingBrand(brand);
                                  setShowDialog(true);
                                }}
                                className="cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20"
                              >
                                <Edit className="mr-2 h-4 w-4 text-blue-500" />
                                Edit Brand
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer rounded-lg" 
                                onClick={() => handleDeleteBrand(brand.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
          Showing <span className="font-extrabold text-slate-900 dark:text-slate-50">{filteredBrands.length}</span> of <span className="font-extrabold text-slate-900 dark:text-slate-50">{brands.length}</span> brands
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Last updated: just now</span>
      </div>
    </div>
  );
}

