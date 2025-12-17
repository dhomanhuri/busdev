"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DistributorDialog({
  distributor,
  onClose,
  onSave,
}: {
  distributor: any | null;
  onClose: () => void;
  onSave: (distributor: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status_aktif: true,
    product_ids: [] as string[],
  });
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("products")
        .select(`
          *,
          brand:brands(
            *,
            sub_category:sub_categories(
              *,
              category:categories(*)
            )
          )
        `)
        .eq("status_aktif", true)
        .order("name");
      setProducts(data || []);
    };
    loadProducts();
  }, []);

  const resetForm = async () => {
    if (distributor) {
      let productIds: string[] = [];
      
      // If distributor has distributor_products loaded from page, use them
      if (distributor.distributor_products && Array.isArray(distributor.distributor_products)) {
        productIds = distributor.distributor_products
          .map((dp: any) => dp.product?.id || dp.product_id)
          .filter((id: string) => id);
      } else if (distributor.id) {
        // Otherwise, load from database
        const supabase = createClient();
        const { data } = await supabase
          .from("distributor_products")
          .select("product_id")
          .eq("distributor_id", distributor.id);
        
        productIds = (data || []).map((dp: any) => dp.product_id);
      }

      setFormData({
        name: distributor.name || "",
        description: distributor.description || "",
        status_aktif: distributor.status_aktif ?? true,
        product_ids: productIds,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        status_aktif: true,
        product_ids: [],
      });
    }
  };

  useEffect(() => {
    resetForm();
  }, [distributor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();

      if (distributor) {
        // Update existing distributor
        const { data, error: updateError } = await supabase
          .from("distributors")
          .update({
            name: formData.name,
            description: formData.description || null,
            status_aktif: formData.status_aktif,
            updated_at: new Date().toISOString(),
          })
          .eq("id", distributor.id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Update distributor products
        // Delete existing distributor products
        await supabase
          .from("distributor_products")
          .delete()
          .eq("distributor_id", distributor.id);

        // Insert new distributor products
        if (formData.product_ids.length > 0) {
          const distributorProducts = formData.product_ids.map((productId) => ({
            distributor_id: distributor.id,
            product_id: productId,
          }));

          const { error: dpError } = await supabase
            .from("distributor_products")
            .insert(distributorProducts);

          if (dpError) throw dpError;
        }

        // Close dialog first
        setIsLoading(false);
        setOpen(false);
        await resetForm();
        
        // Call onSave (handler will also try to reload)
        setTimeout(() => {
          onSave(data);
          onClose();
          window.location.reload();
        }, 100);
      } else {
        // Create new distributor
        const { data, error: createError } = await supabase
          .from("distributors")
          .insert({
            name: formData.name,
            description: formData.description || null,
            status_aktif: formData.status_aktif,
          })
          .select()
          .single();

        if (createError) throw createError;

        // Insert distributor products
        if (formData.product_ids.length > 0 && data?.id) {
          const distributorProducts = formData.product_ids.map((productId) => ({
            distributor_id: data.id,
            product_id: productId,
          }));

          const { error: dpError } = await supabase
            .from("distributor_products")
            .insert(distributorProducts);

          if (dpError) throw dpError;
        }

        // Close dialog first
        setIsLoading(false);
        setOpen(false);
        await resetForm();
        
        // Call onSave (handler will also try to reload)
        setTimeout(() => {
          onSave(data);
          onClose();
          window.location.reload();
        }, 100);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset all states when closing
      setIsLoading(false);
      setError("");
      resetForm();
      // Delay to ensure dialog closes properly before calling onClose
      setTimeout(() => {
        onClose();
      }, 100);
    }
  };

  const handleCancel = () => {
    setIsLoading(false);
    setError("");
    resetForm();
    setOpen(false);
    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-50">
            {distributor ? "Edit Distributor" : "Add New Distributor"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-700 dark:text-slate-300">Nama *</Label>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-50"
              required
            />
          </div>

          <div>
            <Label className="text-slate-700 dark:text-slate-300">Deskripsi</Label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50 min-h-[100px]"
              rows={4}
            />
          </div>

          <div>
            <Label className="text-slate-700 dark:text-slate-300">Products</Label>
            <select
              multiple
              value={formData.product_ids}
              onChange={(e) => {
                const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                setFormData({ ...formData, product_ids: selectedIds });
              }}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50 min-h-[120px]"
              size={5}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.brand?.sub_category?.category?.name} - {product.brand?.sub_category?.name} - {product.brand?.name} - {product.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple products
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="status_aktif"
              checked={formData.status_aktif}
              onChange={(e) =>
                setFormData({ ...formData, status_aktif: e.target.checked })
              }
              className="rounded"
            />
            <Label htmlFor="status_aktif" className="text-slate-700 dark:text-slate-300">
              Active Status
            </Label>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

