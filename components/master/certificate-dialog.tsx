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

export function CertificateDialog({
  certificate,
  onClose,
  onSave,
}: {
  certificate: any | null;
  onClose: () => void;
  onSave: (certificate: any) => void;
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

  useEffect(() => {
    const loadCertificateProducts = async () => {
      if (certificate) {
        let productIds: string[] = [];
        
        // If certificate has product_certificates loaded from page, use them
        if (certificate.product_certificates && Array.isArray(certificate.product_certificates)) {
          productIds = certificate.product_certificates
            .map((pc: any) => pc.product?.id || pc.product_id)
            .filter((id: string) => id);
        } else if (certificate.id) {
          // Otherwise, load from database
          const supabase = createClient();
          const { data } = await supabase
            .from("product_certificates")
            .select("product_id")
            .eq("certificate_id", certificate.id);
          
          productIds = (data || []).map((pc: any) => pc.product_id);
        }

        setFormData({
          name: certificate.name || "",
          description: certificate.description || "",
          status_aktif: certificate.status_aktif ?? true,
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
    loadCertificateProducts();
  }, [certificate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();

      if (certificate) {
        // Update existing certificate
        const { data, error: updateError } = await supabase
          .from("certificates")
          .update({
            name: formData.name,
            description: formData.description || null,
            status_aktif: formData.status_aktif,
            updated_at: new Date().toISOString(),
          })
          .eq("id", certificate.id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Update product certificates
        // Delete existing product certificates
        await supabase
          .from("product_certificates")
          .delete()
          .eq("certificate_id", certificate.id);

        // Insert new product certificates
        if (formData.product_ids.length > 0) {
          const productCertificates = formData.product_ids.map((productId) => ({
            certificate_id: certificate.id,
            product_id: productId,
          }));

          const { error: pcError } = await supabase
            .from("product_certificates")
            .insert(productCertificates);

          if (pcError) throw pcError;
        }

        onSave(data);
      } else {
        // Create new certificate
        const { data, error: createError } = await supabase
          .from("certificates")
          .insert({
            name: formData.name,
            description: formData.description || null,
            status_aktif: formData.status_aktif,
          })
          .select()
          .single();

        if (createError) throw createError;

        // Insert product certificates
        if (formData.product_ids.length > 0 && data?.id) {
          const productCertificates = formData.product_ids.map((productId) => ({
            certificate_id: data.id,
            product_id: productId,
          }));

          const { error: pcError } = await supabase
            .from("product_certificates")
            .insert(productCertificates);

          if (pcError) throw pcError;
        }

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
            {certificate ? "Edit Certificate" : "Add New Certificate"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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

