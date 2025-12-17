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

export function ProductDialog({
  product,
  onClose,
  onSave,
}: {
  product: any | null;
  onClose: () => void;
  onSave: (product: any) => void;
}) {
  const [formData, setFormData] = useState({
    brand_id: "",
    name: "",
    description: "",
    status_aktif: true,
    readiness_ids: [] as string[],
  });
  const [brands, setBrands] = useState<any[]>([]);
  const [readiness, setReadiness] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBrands = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("brands")
        .select(`
          *,
          sub_category:sub_categories(
            *,
            category:categories(*)
          )
        `)
        .eq("status_aktif", true)
        .order("name");
      setBrands(data || []);
    };
    loadBrands();

    const loadReadiness = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("readiness")
        .select("*")
        .eq("status_aktif", true)
        .order("name");
      setReadiness(data || []);
    };
    loadReadiness();
  }, []);

  useEffect(() => {
    const loadProductReadiness = async () => {
      if (product) {
        let readinessIds: string[] = [];
        
        // If product has product_readiness loaded from page, use them
        if (product.product_readiness && Array.isArray(product.product_readiness)) {
          readinessIds = product.product_readiness
            .map((pr: any) => pr.readiness?.id || pr.readiness_id)
            .filter((id: string) => id);
        } else if (product.id) {
          // Otherwise, load from database
          const supabase = createClient();
          const { data } = await supabase
            .from("product_readiness")
            .select("readiness_id")
            .eq("product_id", product.id);
          
          readinessIds = (data || []).map((pr: any) => pr.readiness_id);
        }

        setFormData({
          brand_id: product.brand_id || "",
          name: product.name || "",
          description: product.description || "",
          status_aktif: product.status_aktif ?? true,
          readiness_ids: readinessIds,
        });
      } else {
        setFormData({
          brand_id: "",
          name: "",
          description: "",
          status_aktif: true,
          readiness_ids: [],
        });
      }
    };
    loadProductReadiness();
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();

      if (product) {
        // Update existing product
        const { data, error: updateError } = await supabase
          .from("products")
          .update({
            brand_id: formData.brand_id,
            name: formData.name,
            description: formData.description || null,
            status_aktif: formData.status_aktif,
            updated_at: new Date().toISOString(),
          })
          .eq("id", product.id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Update product readiness
        // Delete existing readiness
        await supabase
          .from("product_readiness")
          .delete()
          .eq("product_id", product.id);

        // Insert new readiness
        if (formData.readiness_ids.length > 0) {
          const productReadiness = formData.readiness_ids.map((readinessId) => ({
            product_id: product.id,
            readiness_id: readinessId,
          }));

          const { error: prError } = await supabase
            .from("product_readiness")
            .insert(productReadiness);

          if (prError) throw prError;
        }

        // Close dialog first
        setIsLoading(false);
        onClose();
        
        // Call onSave (handler will also try to reload)
        onSave(data);
        
        // Force reload immediately as backup
        window.location.reload();
      } else {
        // Create new product
        const { data, error: createError } = await supabase
          .from("products")
          .insert({
            brand_id: formData.brand_id,
            name: formData.name,
            description: formData.description || null,
            status_aktif: formData.status_aktif,
          })
          .select()
          .single();

        if (createError) throw createError;

        // Insert product readiness
        if (formData.readiness_ids.length > 0 && data?.id) {
          const productReadiness = formData.readiness_ids.map((readinessId) => ({
            product_id: data.id,
            readiness_id: readinessId,
          }));

          const { error: prError } = await supabase
            .from("product_readiness")
            .insert(productReadiness);

          if (prError) throw prError;
        }

        // Close dialog first
        setIsLoading(false);
        onClose();
        
        // Call onSave (handler will also try to reload)
        onSave(data);
        
        // Force reload immediately as backup
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-50">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-700 dark:text-slate-300">Brand *</Label>
            <select
              value={formData.brand_id}
              onChange={(e) =>
                setFormData({ ...formData, brand_id: e.target.value })
              }
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50"
              required
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.sub_category?.category?.name} - {brand.sub_category?.name} - {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-slate-700 dark:text-slate-300">Name *</Label>
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
            <Label className="text-slate-700 dark:text-slate-300">Description</Label>
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
            <Label className="text-slate-700 dark:text-slate-300">Readiness</Label>
            <select
              multiple
              value={formData.readiness_ids}
              onChange={(e) => {
                const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                setFormData({ ...formData, readiness_ids: selectedIds });
              }}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50 min-h-[120px]"
              size={5}
            >
              {readiness.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple readiness
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
              onClick={onClose}
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

