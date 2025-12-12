"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProductDialog } from "./product-dialog";
import { ListControls } from "@/components/ui/list-controls";
import { Plus, Trash2, Edit, ShoppingBag, LayoutGrid, List, MoreVertical } from 'lucide-react';
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

export function ProductsList({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"card" | "list">("list");

  const filteredAndSortedProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand?.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand?.sub_category?.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand?.sub_category?.category?.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.description?.toLowerCase().includes(search.toLowerCase()) || false);
      
      const matchesStatus = !statusFilter ||
        (statusFilter === "active" && product.status_aktif) ||
        (statusFilter === "inactive" && !product.status_aktif);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      switch (sortBy) {
        case "name_asc":
          return a.name.localeCompare(b.name);
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "category_asc":
          return (a.brand?.sub_category?.category?.name || "").localeCompare(b.brand?.sub_category?.category?.name || "");
        case "category_desc":
          return (b.brand?.sub_category?.category?.name || "").localeCompare(a.brand?.sub_category?.category?.name || "");
        case "brand_asc":
          return (a.brand?.name || "").localeCompare(b.brand?.name || "");
        case "brand_desc":
          return (b.brand?.name || "").localeCompare(a.brand?.name || "");
        case "created_asc":
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case "created_desc":
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default:
          return 0;
      }
    });

  const handleProductSaved = (updatedProduct: any) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      setEditingProduct(null);
    } else {
      setProducts([updatedProduct, ...products]);
    }
    setShowDialog(false);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;
      setProducts(products.filter(p => p.id !== productId));
    } catch (err: any) {
      alert("Failed to delete product: " + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex-1">
          <ListControls
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search product..."
            filterValue={statusFilter}
            onFilterChange={setStatusFilter}
            filterOptions={[
              { value: "active", label: "Active Products" },
              { value: "inactive", label: "Inactive Products" },
            ]}
            filterLabel="Status"
            sortValue={sortBy}
            onSortChange={setSortBy}
            sortOptions={[
              { value: "name_asc", label: "Name (A-Z)" },
              { value: "name_desc", label: "Name (Z-A)" },
              { value: "category_asc", label: "Category (A-Z)" },
              { value: "category_desc", label: "Category (Z-A)" },
              { value: "brand_asc", label: "Brand (A-Z)" },
              { value: "brand_desc", label: "Brand (Z-A)" },
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
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
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
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setShowDialog(true);
            }}
            className="relative bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl px-6 h-11 font-semibold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Product
          </Button>
        </div>
      </div>

      {showDialog && (
        <ProductDialog
          product={editingProduct}
          onClose={() => {
            setShowDialog(false);
            setEditingProduct(null);
          }}
          onSave={handleProductSaved}
        />
      )}

      {showDialog && (
        <ProductDialog
          product={editingProduct}
          onClose={() => {
            setShowDialog(false);
            setEditingProduct(null);
          }}
          onSave={handleProductSaved}
        />
      )}

      {filteredAndSortedProducts.length === 0 ? (
        <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-3xl blur-xl opacity-50" />
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/30 flex items-center justify-center border border-blue-200/50 dark:border-blue-800/30">
                  <ShoppingBag className="h-12 w-12 text-blue-500 dark:text-blue-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">No products found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm leading-relaxed mb-8">
                We couldn't find any products matching your search. Try adjusting your filters or create a new product to get started.
              </p>
              <Button
                variant="outline"
                className="border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl px-6 font-medium hover:scale-105 transition-transform duration-200"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
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
          {filteredAndSortedProducts.map((product) => (
            <Card
              key={product.id}
              className={cn(
                "group relative border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer",
                product.status_aktif ? "hover:border-blue-300 dark:hover:border-blue-700/50" : "hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              <div className={cn(
                "absolute top-0 left-0 right-0 h-1",
                product.status_aktif 
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600" 
                  : "bg-gradient-to-r from-slate-400 to-slate-500"
              )} />
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                      <span className="font-bold text-lg text-slate-900 dark:text-slate-50 truncate">
                        {product.name}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "inline-block px-3 py-1 rounded-lg text-xs font-bold",
                        product.status_aktif
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      )}
                    >
                      {product.status_aktif ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px] border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xl backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
                      <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProduct(product);
                          setShowDialog(true);
                        }}
                        className="cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20"
                      >
                        <Edit className="mr-2 h-4 w-4 text-blue-500" />
                        Edit Product
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer rounded-lg" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-3">
                  {product.brand?.sub_category?.category?.name && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Category</p>
                      <p className="font-semibold text-slate-900 dark:text-slate-50">{product.brand.sub_category.category.name}</p>
                    </div>
                  )}
                  {product.brand?.sub_category?.name && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Sub Category</p>
                      <p className="font-medium text-slate-700 dark:text-slate-300">{product.brand.sub_category.name}</p>
                    </div>
                  )}
                  {product.brand?.name && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Brand</p>
                      <p className="font-medium text-slate-700 dark:text-slate-300">{product.brand.name}</p>
                    </div>
                  )}
                </div>

                {product.product_readiness && product.product_readiness.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">Readiness</p>
                    <div className="flex flex-wrap gap-2">
                      {product.product_readiness.map((pr: any) => (
                        <Badge
                          key={pr.readiness?.id}
                          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm"
                        >
                          {pr.readiness?.name}
                        </Badge>
                      ))}
                    </div>
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
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Category</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Sub Category</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Brand</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Name</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Readiness</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">Status</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/30">
                  {filteredAndSortedProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className={cn(
                        "group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-all duration-200",
                        index % 2 === 0 ? "bg-white/50 dark:bg-slate-900/50" : "bg-slate-50/20 dark:bg-slate-900/20"
                      )}
                    >
                      <td className="py-5 px-6">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{product.brand?.sub_category?.category?.name || "-"}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-slate-700 dark:text-slate-300">{product.brand?.sub_category?.name || "-"}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{product.brand?.name || "-"}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="font-bold text-slate-900 dark:text-slate-50">{product.name}</span>
                      </td>
                      <td className="py-5 px-6">
                        {product.product_readiness && product.product_readiness.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {product.product_readiness.map((pr: any) => (
                              <Badge
                                key={pr.readiness?.id}
                                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm"
                              >
                                {pr.readiness?.name}
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
                            product.status_aktif
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                              : "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
                          )}
                        >
                          {product.status_aktif ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <div className="flex items-center justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/20 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 hover:scale-110">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px] border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xl backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
                              <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  setEditingProduct(product);
                                  setShowDialog(true);
                                }}
                                className="cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20"
                              >
                                <Edit className="mr-2 h-4 w-4 text-blue-500" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer rounded-lg" 
                                onClick={() => handleDeleteProduct(product.id)}
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
          Showing <span className="font-extrabold text-slate-900 dark:text-slate-50">{filteredAndSortedProducts.length}</span> of <span className="font-extrabold text-slate-900 dark:text-slate-50">{products.length}</span> products
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Last updated: just now</span>
      </div>
    </div>
  );
}

