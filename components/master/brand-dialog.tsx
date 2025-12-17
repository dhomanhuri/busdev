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

export function BrandDialog({
  brand,
  onClose,
  onSave,
}: {
  brand: any | null;
  onClose: () => void;
  onSave: (brand: any) => void;
}) {
  const [formData, setFormData] = useState({
    sub_category_id: "",
    name: "",
    description: "",
    status_aktif: true,
    partnership_ids: [] as string[],
  });
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [partnerships, setPartnerships] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSubCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("sub_categories")
        .select(`
          *,
          category:categories(*)
        `)
        .eq("status_aktif", true)
        .order("name");
      setSubCategories(data || []);
    };
    loadSubCategories();

    const loadPartnerships = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("partnerships")
        .select("*")
        .eq("status_aktif", true)
        .order("name");
      setPartnerships(data || []);
    };
    loadPartnerships();
  }, []);

  useEffect(() => {
    const loadBrandPartnerships = async () => {
      if (brand) {
        let partnershipIds: string[] = [];
        
        // If brand has brand_partnerships loaded from page, use them
        if (brand.brand_partnerships && Array.isArray(brand.brand_partnerships)) {
          partnershipIds = brand.brand_partnerships
            .map((bp: any) => bp.partnership?.id || bp.partnership_id)
            .filter((id: string) => id);
        } else if (brand.id) {
          // Otherwise, load from database
          const supabase = createClient();
          const { data } = await supabase
            .from("brand_partnerships")
            .select("partnership_id")
            .eq("brand_id", brand.id);
          
          partnershipIds = (data || []).map((bp: any) => bp.partnership_id);
        }

        setFormData({
          sub_category_id: brand.sub_category_id || "",
          name: brand.name || "",
          description: brand.description || "",
          status_aktif: brand.status_aktif ?? true,
          partnership_ids: partnershipIds,
        });
      } else {
        setFormData({
          sub_category_id: "",
          name: "",
          description: "",
          status_aktif: true,
          partnership_ids: [],
        });
      }
    };
    loadBrandPartnerships();
  }, [brand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();

      if (brand) {
        // Update existing brand
        const { data, error: updateError } = await supabase
          .from("brands")
          .update({
            sub_category_id: formData.sub_category_id,
            name: formData.name,
            description: formData.description || null,
            status_aktif: formData.status_aktif,
            updated_at: new Date().toISOString(),
          })
          .eq("id", brand.id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Update brand partnerships
        // Delete existing partnerships
        await supabase
          .from("brand_partnerships")
          .delete()
          .eq("brand_id", brand.id);

        // Insert new partnerships
        if (formData.partnership_ids.length > 0) {
          const brandPartnerships = formData.partnership_ids.map((partnershipId) => ({
            brand_id: brand.id,
            partnership_id: partnershipId,
          }));

          const { error: bpError } = await supabase
            .from("brand_partnerships")
            .insert(brandPartnerships);

          if (bpError) throw bpError;
        }

        // Close dialog first
        setIsLoading(false);
        onClose();
        
        // Call onSave (handler will also try to reload)
        onSave(data);
        
        // Force reload immediately as backup
        window.location.reload();
      } else {
        // Create new brand
        const { data, error: createError } = await supabase
          .from("brands")
          .insert({
            sub_category_id: formData.sub_category_id,
            name: formData.name,
            description: formData.description || null,
            status_aktif: formData.status_aktif,
          })
          .select()
          .single();

        if (createError) throw createError;

        // Insert brand partnerships
        if (formData.partnership_ids.length > 0 && data?.id) {
          const brandPartnerships = formData.partnership_ids.map((partnershipId) => ({
            brand_id: data.id,
            partnership_id: partnershipId,
          }));

          const { error: bpError } = await supabase
            .from("brand_partnerships")
            .insert(brandPartnerships);

          if (bpError) throw bpError;
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
            {brand ? "Edit Brand" : "Add New Brand"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-700 dark:text-slate-300">Sub Category *</Label>
            <select
              value={formData.sub_category_id}
              onChange={(e) =>
                setFormData({ ...formData, sub_category_id: e.target.value })
              }
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50"
              required
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((subCategory) => (
                <option key={subCategory.id} value={subCategory.id}>
                  {subCategory.category?.name} - {subCategory.name}
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
            <Label className="text-slate-700 dark:text-slate-300">Partnerships</Label>
            <select
              multiple
              value={formData.partnership_ids}
              onChange={(e) => {
                const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                setFormData({ ...formData, partnership_ids: selectedIds });
              }}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50 min-h-[120px]"
              size={5}
            >
              {partnerships.map((partnership) => (
                <option key={partnership.id} value={partnership.id}>
                  {partnership.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple partnerships
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

