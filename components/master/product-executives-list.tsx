"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Trash2, Edit, UserCircle, MoreVertical } from 'lucide-react';
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
import { ProductExecutiveDialog } from "./product-executive-dialog";

export function ProductExecutivesList({ initialExecutives }: { initialExecutives: any[] }) {
  const [executives, setExecutives] = useState(initialExecutives);
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingExecutive, setEditingExecutive] = useState<any>(null);

  const filteredExecutives = executives.filter((item) => {
    const matchesSearch =
      item.brand?.name.toLowerCase().includes(search.toLowerCase()) ||
      item.user?.full_name.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const handleSaved = (updatedItem: any) => {
    if (editingExecutive) {
      setExecutives(executives.map(e => e.id === updatedItem.id ? updatedItem : e));
      setEditingExecutive(null);
    } else {
      setExecutives([updatedItem, ...executives]);
    }
    setShowDialog(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product executive assignment?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("product_executives")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setExecutives(executives.filter(e => e.id !== id));
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
            <Input
              placeholder="Search by brand or executive name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 rounded-xl"
            />
          </div>
        </div>
        <Button
          onClick={() => {
            setEditingExecutive(null);
            setShowDialog(true);
          }}
          className="relative bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl px-6 h-11 font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Product Executive
        </Button>
      </div>

      {showDialog && (
        <ProductExecutiveDialog
          executive={editingExecutive}
          onClose={() => {
            setShowDialog(false);
            setEditingExecutive(null);
          }}
          onSave={handleSaved}
        />
      )}

      {filteredExecutives.length === 0 ? (
        <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 rounded-3xl blur-xl opacity-50" />
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/40 dark:to-orange-800/30 flex items-center justify-center border border-orange-200/50 dark:border-orange-800/30">
                  <UserCircle className="h-12 w-12 text-orange-500 dark:text-orange-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">No product executives found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm leading-relaxed mb-8">
                We couldn't find any product executive assignments matching your search.
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
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Brand</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Product Executive</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">Status</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Created</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/30">
                  {filteredExecutives.map((item, index) => (
                    <tr
                      key={item.id}
                      className={cn(
                        "group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-all duration-200",
                        index % 2 === 0 ? "bg-white/50 dark:bg-slate-900/50" : "bg-slate-50/20 dark:bg-slate-900/20"
                      )}
                    >
                      <td className="py-5 px-6">
                        <span className="font-bold text-slate-900 dark:text-slate-50">{item.brand?.name}</span>
                      </td>
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                            <UserCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                          </div>
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{item.user?.full_name}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span
                          className={cn(
                            "px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm",
                            item.status_aktif
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                              : "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
                          )}
                        >
                          {item.status_aktif ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-slate-600 dark:text-slate-400 text-sm">
                          {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                            <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl border-slate-200/60 dark:border-slate-800/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl">
                              <DropdownMenuLabel className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-800" />
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditingExecutive(item);
                                  setShowDialog(true);
                                }}
                                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 cursor-pointer"
                              >
                                <Edit className="h-4 w-4 mr-3" />
                                Edit Assignment
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(item.id)}
                                className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4 mr-3" />
                                Delete Assignment
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
    </div>
  );
}
