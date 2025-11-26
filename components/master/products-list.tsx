"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProductDialog } from "./product-dialog";
import { ListControls } from "@/components/ui/list-controls";
import { Plus, Trash2, Edit } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

export function ProductsList({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

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
    <div className="space-y-6">
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <ListControls
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search product..."
            filterValue={statusFilter}
            onFilterChange={setStatusFilter}
            filterOptions={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
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
              { value: "created_asc", label: "Created (Oldest)" },
              { value: "created_desc", label: "Created (Newest)" },
            ]}
          />
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setShowDialog(true);
          }}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
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

      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          {filteredAndSortedProducts.length === 0 ? (
            <p className="text-center text-slate-600 dark:text-slate-400 py-8">No products found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Category</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Sub Category</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Brand</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Name</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Readiness</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{product.brand?.sub_category?.category?.name || "-"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{product.brand?.sub_category?.name || "-"}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{product.brand?.name || "-"}</td>
                      <td className="py-3 px-4 text-slate-900 dark:text-slate-50 font-medium">{product.name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {product.product_readiness && product.product_readiness.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {product.product_readiness.map((pr: any) => (
                              <Badge
                                key={pr.readiness?.id}
                                className="bg-purple-900 text-purple-200 text-xs"
                              >
                                {pr.readiness?.name}
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
                            product.status_aktif
                              ? "bg-green-900 text-green-200"
                              : "bg-gray-900 text-gray-200"
                          }
                        >
                          {product.status_aktif ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right gap-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingProduct(product);
                            setShowDialog(true);
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
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

