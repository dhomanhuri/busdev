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

export function CustomerDialog({
  customer,
  onClose,
  onSave,
}: {
  customer: any | null;
  onClose: () => void;
  onSave: (customer: any) => void;
}) {
  const [formData, setFormData] = useState({
    nama: "",
    description: "",
    status_aktif: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (customer) {
      setFormData({
        nama: customer.nama || "",
        description: customer.description || "",
        status_aktif: customer.status_aktif ?? true,
      });
    } else {
      setFormData({
        nama: "",
        description: "",
        status_aktif: true,
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();

      if (customer) {
        // Update existing customer
        const { data, error: updateError } = await supabase
          .from("customers")
          .update({
            nama: formData.nama,
            description: formData.description || null,
            status_aktif: formData.status_aktif,
            updated_at: new Date().toISOString(),
          })
          .eq("id", customer.id)
          .select()
          .single();

        if (updateError) throw updateError;
        onSave(data);
      } else {
        // Create new customer
        const { data, error: createError } = await supabase
          .from("customers")
          .insert({
            nama: formData.nama,
            description: formData.description || null,
            status_aktif: formData.status_aktif,
          })
          .select()
          .single();

        if (createError) throw createError;
        onSave(data);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-50">
            {customer ? "Edit Customer" : "Add New Customer"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-700 dark:text-slate-300">Nama *</Label>
            <Input
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
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

