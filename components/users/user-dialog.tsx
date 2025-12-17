"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import { ImageCropper } from "@/components/ui/image-cropper";

export function UserDialog({
  user,
  onClose,
  onSave,
}: {
  user: any | null;
  onClose: () => void;
  onSave: (user: any) => void;
}) {
  const [open, setOpen] = useState(true);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset all states when closing
      setShowCropper(false);
      setImageToCrop("");
      setUploading(false);
      setIsLoading(false);
      setError("");
      onClose();
    }
  };

  useEffect(() => {
    // Reset open state when user changes (dialog opens)
    setOpen(true);
    // Reset cropper state when dialog opens
    setShowCropper(false);
    setImageToCrop("");
    setUploading(false);
  }, [user]);

  const [formData, setFormData] = useState({
    nama_lengkap: "",
    email: "",
    role: "Sales",
    gm_id: "",
    department: "",
    status_aktif: true,
    password: "",
    avatar_url: "",
    certificate_ids: [] as string[],
  });
  const [managers, setManagers] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load GMs for dropdown
    const loadManagers = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("users")
        .select("id, nama_lengkap")
        .eq("role", "GM");
      setManagers(data || []);
    };

    // Load certificates for dropdown
    const loadCertificates = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("certificates")
        .select("*")
        .eq("status_aktif", true)
        .order("name");
      setCertificates(data || []);
    };

    loadManagers();
    loadCertificates();
  }, []);

  useEffect(() => {
    const loadUserCertificates = async () => {
      if (user) {
        let certificateIds: string[] = [];
        
        // If user has user_certificates loaded from page, use them
        if (user.user_certificates && Array.isArray(user.user_certificates)) {
          certificateIds = user.user_certificates
            .map((uc: any) => uc.certificate?.id || uc.certificate_id)
            .filter((id: string) => id);
        } else if (user.id) {
          // Otherwise, load from database
          const supabase = createClient();
          const { data } = await supabase
            .from("user_certificates")
            .select("certificate_id")
            .eq("user_id", user.id);
          
          certificateIds = (data || []).map((uc: any) => uc.certificate_id);
        }

        setFormData({
          nama_lengkap: user.nama_lengkap,
          email: user.email,
          role: user.role,
          gm_id: user.gm_id || "",
          department: user.department || "",
          status_aktif: user.status_aktif,
          password: "",
          avatar_url: user.avatar_url || "",
          certificate_ids: certificateIds,
        });
        setPreviewUrl(user.avatar_url || "");
      } else {
        setFormData({
          nama_lengkap: "",
          email: "",
          role: "Sales",
          gm_id: "",
          department: "",
          status_aktif: true,
          password: "",
          avatar_url: "",
          certificate_ids: [],
        });
      }
    };
    loadUserCertificates();
  }, [user]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    // Read file and show cropper
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageToCrop(reader.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
    setError("");

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    setUploading(true);
    setError("");

    try {
      const supabase = createClient();
      const fileExt = "jpg";
      const fileName = `${user?.id || "new"}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Delete old avatar if exists
      if (formData.avatar_url && user) {
        const oldPath = formData.avatar_url.split("/").slice(-2).join("/");
        await supabase.storage.from("avatars").remove([oldPath]);
      }

      // For new users, store the blob
      if (!user) {
        setPendingFile(new File([croppedImageBlob], fileName, { type: "image/jpeg" }));
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(croppedImageBlob);
        setShowCropper(false);
        setUploading(false);
        return;
      }

      // For existing users, upload immediately
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, croppedImageBlob, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setFormData({ ...formData, avatar_url: publicUrl });
      setPreviewUrl(publicUrl);
      setShowCropper(false);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!formData.avatar_url && !pendingFile) return;

    // For new users, just remove pending file
    if (pendingFile && !user) {
      setPendingFile(null);
      setPreviewUrl("");
      return;
    }

    // For existing users, remove from storage
    if (formData.avatar_url && user) {
      try {
        const supabase = createClient();
        const filePath = formData.avatar_url.split("/").slice(-2).join("/");
        await supabase.storage.from("avatars").remove([filePath]);
      } catch (err: any) {
        console.error("Error removing avatar:", err);
      }
    }
    
    setFormData({ ...formData, avatar_url: "" });
    setPreviewUrl("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();

      if (user) {
        // Update existing user
        const { error: updateError } = await supabase
          .from("users")
          .update({
            nama_lengkap: formData.nama_lengkap,
            role: formData.role,
            gm_id: formData.role === "Sales" ? (formData.gm_id || null) : null,
            department: formData.role === "GM" ? (formData.department || null) : null,
            avatar_url: formData.avatar_url || null,
            status_aktif: formData.status_aktif,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id);

        if (updateError) throw updateError;

        // Update user certificates
        // Delete existing user certificates
        await supabase
          .from("user_certificates")
          .delete()
          .eq("user_id", user.id);

        // Insert new user certificates
        if (formData.certificate_ids.length > 0) {
          const userCertificates = formData.certificate_ids.map((certificateId) => ({
            user_id: user.id,
            certificate_id: certificateId,
          }));

          const { error: ucError } = await supabase
            .from("user_certificates")
            .insert(userCertificates);

          if (ucError) throw ucError;
        }

        const updatedUser = { ...user, ...formData };
        
        // Reset states and close dialog
        setIsLoading(false);
        setShowCropper(false);
        setImageToCrop("");
        setUploading(false);
        setError("");
        setOpen(false);
        onClose();
        
        // Call onSave which will reload the page
        onSave(updatedUser);
      } else {
        // Create new user via auth
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email: formData.email,
            password: formData.password || Math.random().toString(36).substring(7),
            options: {
              data: {
                nama_lengkap: formData.nama_lengkap,
                role: formData.role,
              },
            },
          });

        if (signUpError) throw signUpError;

        let avatarUrl = formData.avatar_url;

        // Upload pending file if exists (cropped image)
        if (pendingFile && signUpData.user?.id) {
          try {
            const fileName = `${signUpData.user.id}-${Date.now()}.jpg`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
              .from("avatars")
              .upload(filePath, pendingFile, {
                cacheControl: "3600",
                upsert: false,
                contentType: "image/jpeg",
              });

            if (!uploadError) {
              const {
                data: { publicUrl },
              } = supabase.storage.from("avatars").getPublicUrl(filePath);
              avatarUrl = publicUrl;
            }
          } catch (uploadErr) {
            console.error("Error uploading avatar:", uploadErr);
          }
        }

        // Ensure profile row is completed with gm_id, department, avatar_url and status_aktif
        if (signUpData.user?.id) {
          const { error: profileUpdateError } = await supabase
            .from("users")
            .update({
              nama_lengkap: formData.nama_lengkap,
              role: formData.role,
              gm_id: formData.role === "Sales" ? (formData.gm_id || null) : null,
              department: formData.role === "GM" ? (formData.department || null) : null,
              avatar_url: avatarUrl || null,
              status_aktif: formData.status_aktif,
              updated_at: new Date().toISOString(),
            })
            .eq("id", signUpData.user.id);
          if (profileUpdateError) throw profileUpdateError;

          // Insert user certificates
          if (formData.certificate_ids.length > 0 && signUpData.user?.id) {
            const userCertificates = formData.certificate_ids.map((certificateId) => ({
              user_id: signUpData.user!.id,
              certificate_id: certificateId,
            }));

            const { error: ucError } = await supabase
              .from("user_certificates")
              .insert(userCertificates);

            if (ucError) throw ucError;
          }
        }

        const newUser = {
          id: signUpData.user?.id,
          ...formData,
          avatar_url: avatarUrl,
        };
        
        // Reset states and close dialog
        setIsLoading(false);
        setShowCropper(false);
        setImageToCrop("");
        setUploading(false);
        setError("");
        setOpen(false);
        onClose();
        
        // Call onSave which will reload the page
        onSave(newUser);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50">
          <DialogHeader>
            <DialogTitle className="text-slate-900 dark:text-slate-50">{user ? "Edit User" : "Add New User"}</DialogTitle>
          </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
            <Avatar className="h-24 w-24">
              <AvatarImage src={previewUrl} alt={formData.nama_lengkap || "User"} />
              <AvatarFallback className="text-2xl">
                {formData.nama_lengkap
                  ? formData.nama_lengkap
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
                id="avatar-upload"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? "Uploading..." : previewUrl ? "Change Photo" : "Upload Photo"}
              </Button>
              {previewUrl && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveAvatar}
                  className="border-red-200 dark:border-red-600 text-red-600 dark:text-red-400"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          </div>

          <div>
            <Label className="text-slate-700 dark:text-slate-300">Full Name</Label>
            <Input
              value={formData.nama_lengkap}
              onChange={(e) =>
                setFormData({ ...formData, nama_lengkap: e.target.value })
              }
              className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-50"
              required
            />
          </div>

          {!user && (
            <div>
              <Label className="text-slate-700 dark:text-slate-300">Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-50"
                required
              />
            </div>
          )}

          {!user && (
            <div>
              <Label className="text-slate-700 dark:text-slate-300">Password</Label>
              <Input
                type="password"
                placeholder="Leave empty to auto-generate"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-50"
              />
            </div>
          )}

          <div>
            <Label className="text-slate-700 dark:text-slate-300">Role</Label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50"
            >
              <option value="Sales">AM</option>
              <option value="GM">General Manager</option>
              <option value="Admin">Admin</option>
              <option value="Presales">Presales</option>
              <option value="Engineer">Engineer</option>
              <option value="Project Manager">Project Manager</option>
            </select>
          </div>

          {formData.role === "Sales" && (
            <div>
              <Label className="text-slate-700 dark:text-slate-300">Manager (GM)</Label>
              <select
                value={formData.gm_id}
                onChange={(e) =>
                  setFormData({ ...formData, gm_id: e.target.value })
                }
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50"
              >
                <option value="">Select Manager</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.nama_lengkap}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.role === "GM" && (
            <div>
              <Label className="text-slate-700 dark:text-slate-300">Department</Label>
              <Input
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                placeholder="Enter department name"
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-50"
              />
            </div>
          )}

          <div>
            <Label className="text-slate-700 dark:text-slate-300">Certificates</Label>
            <select
              multiple
              value={formData.certificate_ids}
              onChange={(e) => {
                const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                setFormData({ ...formData, certificate_ids: selectedIds });
              }}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50 min-h-[120px]"
              size={5}
            >
              {certificates.map((certificate) => (
                <option key={certificate.id} value={certificate.id}>
                  {certificate.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple certificates
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

      {showCropper && (
        <ImageCropper
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onClose={() => {
            setShowCropper(false);
            setImageToCrop("");
          }}
          aspect={1}
        />
      )}
    </>
  );
}
