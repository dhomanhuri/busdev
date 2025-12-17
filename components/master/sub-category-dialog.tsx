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

export function SubCategoryDialog({
  subCategory,
  onClose,
  onSave,
}: {
  subCategory: any | null;
  onClose: () => void;
  onSave: (subCategory: any) => void;
}) {
  const [formData, setFormData] = useState({
    category_id: "",
    name: "",
    description: "",
    status_aktif: true,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(true);

  const resetForm = () => {
    if (subCategory) {
      setFormData({
        category_id: subCategory.category_id || "",
        name: subCategory.name || "",
        description: subCategory.description || "",
        status_aktif: subCategory.status_aktif ?? true,
      });
    } else {
      setFormData({
        category_id: "",
        name: "",
        description: "",
        status_aktif: true,
      });
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("status_aktif", true)
        .order("name");
      setCategories(data || []);
    };
    loadCategories();
  }, []);

  useEffect(() => {
    resetForm();
  }, [subCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();

      if (subCategory) {
        // Update existing sub category
        const { data, error: updateError } = await supabase
          .from("sub_categories")
          .update({
            category_id: formData.category_id,
            name: formData.name,
            description: formData.description || null,
            status_aktif: formData.status_aktif,
            updated_at: new Date().toISOString(),
          })
          .eq("id", subCategory.id)
          .select()
          .single();

        if (updateError) throw updateError;
        
        // Close dialog first
        setIsLoading(false);
        setOpen(false);
        resetForm();
        
        // Call onSave (handler will also try to reload)
        setTimeout(() => {
          onSave(data);
          onClose();
          window.location.reload();
        }, 100);
      } else {
        // Create new sub category
        const { data, error: createError } = await supabase
          .from("sub_categories")
          .insert({
            category_id: formData.category_id,
            name: formData.name,
            description: formData.description || null,
            status_aktif: formData.status_aktif,
          })
          .select()
          .single();

        if (createError) throw createError;
        
        // Close dialog first
        setIsLoading(false);
        setOpen(false);
        resetForm();
        
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
      <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-50">
            {subCategory ? "Edit Sub Category" : "Add New Sub Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-700 dark:text-slate-300">Category *</Label>
            <select
              value={formData.category_id}
              onChange={(e) =>
                setFormData({ ...formData, category_id: e.target.value })
              }
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
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

