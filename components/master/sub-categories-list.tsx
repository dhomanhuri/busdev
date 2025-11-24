"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SubCategoryDialog } from "./sub-category-dialog";
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

export function SubCategoriesList({ initialSubCategories }: { initialSubCategories: any[] }) {
  const [subCategories, setSubCategories] = useState(initialSubCategories);
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<any>(null);

  const filteredSubCategories = subCategories.filter((subCategory) => {
    const matchesSearch =
      subCategory.name.toLowerCase().includes(search.toLowerCase()) ||
      subCategory.category?.name.toLowerCase().includes(search.toLowerCase()) ||
      (subCategory.description?.toLowerCase().includes(search.toLowerCase()) || false);
    return matchesSearch;
  });

  const handleSubCategorySaved = (updatedSubCategory: any) => {
    if (editingSubCategory) {
      setSubCategories(subCategories.map(sc => sc.id === updatedSubCategory.id ? updatedSubCategory : sc));
      setEditingSubCategory(null);
    } else {
      setSubCategories([updatedSubCategory, ...subCategories]);
    }
    setShowDialog(false);
  };

  const handleDeleteSubCategory = async (subCategoryId: string) => {
    if (!confirm("Are you sure you want to delete this sub category? This will also delete all related brands and products.")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("sub_categories")
        .delete()
        .eq("id", subCategoryId);

      if (error) throw error;
      setSubCategories(subCategories.filter(sc => sc.id !== subCategoryId));
    } catch (err: any) {
      alert("Failed to delete sub category: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          <Input
            placeholder="Search sub category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
          />
        </div>
        <Button
          onClick={() => {
            setEditingSubCategory(null);
            setShowDialog(true);
          }}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Sub Category
        </Button>
      </div>

      {showDialog && (
        <SubCategoryDialog
          subCategory={editingSubCategory}
          onClose={() => {
            setShowDialog(false);
            setEditingSubCategory(null);
          }}
          onSave={handleSubCategorySaved}
        />
      )}

      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          {filteredSubCategories.length === 0 ? (
            <p className="text-center text-slate-600 dark:text-slate-400 py-8">No sub categories found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Category</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Name</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Description</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Created</th>
                    <th className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubCategories.map((subCategory) => (
                    <tr
                      key={subCategory.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{subCategory.category?.name || "-"}</td>
                      <td className="py-3 px-4 text-slate-900 dark:text-slate-50 font-medium">{subCategory.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{subCategory.description || "-"}</td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            subCategory.status_aktif
                              ? "bg-green-900 text-green-200"
                              : "bg-gray-900 text-gray-200"
                          }
                        >
                          {subCategory.status_aktif ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {new Date(subCategory.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right gap-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingSubCategory(subCategory);
                            setShowDialog(true);
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSubCategory(subCategory.id)}
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

