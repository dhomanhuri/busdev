"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function ProductExecutiveDialog({
  executive,
  onClose,
  onSave,
}: {
  executive: any | null;
  onClose: () => void;
  onSave: (executive: any) => void;
}) {
  const [formData, setFormData] = useState({
    brand_id: "",
    user_id: "",
    status_aktif: true,
  });
  const [brands, setBrands] = useState<any[]>([]);
  const [marketingUsers, setMarketingUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();
      
      // Load active brands
      const { data: brandsData } = await supabase
        .from("brands")
        .select("*")
        .eq("status_aktif", true)
        .order("name");
      setBrands(brandsData || []);

      // Load marketing users
      const { data: usersData } = await supabase
        .from("users")
        .select("*")
        .eq("role", "Marketing")
        .eq("status_aktif", true)
        .order("full_name");
      setMarketingUsers(usersData || []);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (executive) {
      setFormData({
        brand_id: executive.brand_id || "",
        user_id: executive.user_id || "",
        status_aktif: executive.status_aktif ?? true,
      });
    } else {
      setFormData({
        brand_id: "",
        user_id: "",
        status_aktif: true,
      });
    }
  }, [executive]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brand_id || !formData.user_id) {
      setError("Please select both a brand and a marketing user.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();

      if (executive) {
        // Update existing
        const { data, error: updateError } = await supabase
          .from("product_executives")
          .update({
            brand_id: formData.brand_id,
            user_id: formData.user_id,
            status_aktif: formData.status_aktif,
            updated_at: new Date().toISOString(),
          })
          .eq("id", executive.id)
          .select(`
            *,
            brand:brands(*),
            user:users(*)
          `)
          .single();

        if (updateError) throw updateError;

        setIsLoading(false);
        setOpen(false);
        
        setTimeout(() => {
          onSave(data);
          onClose();
        }, 100);
      } else {
        // Create new
        const { data, error: createError } = await supabase
          .from("product_executives")
          .insert({
            brand_id: formData.brand_id,
            user_id: formData.user_id,
            status_aktif: formData.status_aktif,
          })
          .select(`
            *,
            brand:brands(*),
            user:users(*)
          `)
          .single();

        if (createError) {
          if (createError.code === '23505') {
            throw new Error("This Brand and Product Executive combination already exists.");
          }
          throw createError;
        }

        setIsLoading(false);
        setOpen(false);
        
        setTimeout(() => {
          onSave(data);
          onClose();
        }, 100);
      }
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {executive ? "Edit Product Executive" : "Add Product Executive"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {error && (
            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Select
              value={formData.brand_id}
              onValueChange={(val) => setFormData({ ...formData, brand_id: val })}
            >
              <SelectTrigger id="brand">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user">Product Executive (Marketing)</Label>
            <Select
              value={formData.user_id}
              onValueChange={(val) => setFormData({ ...formData, user_id: val })}
            >
              <SelectTrigger id="user">
                <SelectValue placeholder="Select marketing user" />
              </SelectTrigger>
              <SelectContent>
                {marketingUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status_aktif}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, status_aktif: checked })
              }
            />
            <Label htmlFor="status">Active Status</Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
