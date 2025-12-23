"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, X, ChevronDown } from "lucide-react";

export function ProjectDialog({
  project,
  onClose,
  onSave,
}: {
  project: any | null;
  onClose: () => void;
  onSave: (project: any) => void;
}) {
  const [open, setOpen] = useState(true);

  const resetForm = async () => {
    if (project) {
      let productIds: string[] = [];
      let presalesIds: string[] = [];
      let engineerIds: string[] = [];

      // Load junction table data
      const supabase = createClient();

      let productDistributors: Record<string, string> = {};
      let productTypes: Record<string, string> = {};

      if (project.project_products && Array.isArray(project.project_products)) {
        productIds = project.project_products
          .map((pp: any) => pp.product?.id || pp.product_id)
          .filter((id: string) => id);
        // Load distributor and project type for each product
        project.project_products.forEach((pp: any) => {
          const productId = pp.product?.id || pp.product_id;
          if (productId && pp.distributor_id) {
            productDistributors[productId] = pp.distributor_id;
          }
          if (productId && pp.project_type_id) {
            productTypes[productId] = pp.project_type_id;
          }
        });
      } else if (project.id) {
        const { data: productsData } = await supabase
          .from("project_products")
          .select("product_id, distributor_id, project_type_id")
          .eq("project_id", project.id);
        productIds = (productsData || []).map((pp: any) => pp.product_id);
        productsData?.forEach((pp: any) => {
          if (pp.product_id && pp.distributor_id) {
            productDistributors[pp.product_id] = pp.distributor_id;
          }
          if (pp.product_id && pp.project_type_id) {
            productTypes[pp.product_id] = pp.project_type_id;
          }
        });
      }

      if (project.project_presales && Array.isArray(project.project_presales)) {
        presalesIds = project.project_presales
          .map((pp: any) => pp.user?.id || pp.user_id)
          .filter((id: string) => id);
      } else if (project.id) {
        const { data: presalesData } = await supabase
          .from("project_presales")
          .select("user_id")
          .eq("project_id", project.id);
        presalesIds = (presalesData || []).map((pp: any) => pp.user_id);
      }

      if (project.project_engineers && Array.isArray(project.project_engineers)) {
        engineerIds = project.project_engineers
          .map((pe: any) => pe.user?.id || pe.user_id)
          .filter((id: string) => id);
      } else if (project.id) {
        const { data: engineersData } = await supabase
          .from("project_engineers")
          .select("user_id")
          .eq("project_id", project.id);
        engineerIds = (engineersData || []).map((pe: any) => pe.user_id);
      }

      // Format dates for input[type="date"]
      const periodeMulaiValue = project.periode_mulai
        ? new Date(project.periode_mulai).toISOString().split('T')[0]
        : "";
      const periodeSelesaiValue = project.periode_selesai
        ? new Date(project.periode_selesai).toISOString().split('T')[0]
        : "";

      setFormData({
        pid: project.pid || "",
        customer_id: project.customer_id || "",
        sales_id: project.sales_id || "",
        nilai_project: project.nilai_project?.toString() || "",
        periode_mulai: periodeMulaiValue,
        periode_selesai: periodeSelesaiValue,
        description: project.description || "",
        project_manager_id: project.project_manager_id || "",
        product_ids: productIds,
        product_distributors: productDistributors,
        product_types: productTypes,
        presales_ids: presalesIds,
        engineer_ids: engineerIds,
      });
    } else {
      setFormData({
        pid: "",
        customer_id: "",
        sales_id: "",
        nilai_project: "",
        periode_mulai: "",
        periode_selesai: "",
        description: "",
        project_manager_id: "",
        product_ids: [],
        product_distributors: {},
        product_types: {},
        presales_ids: [],
        engineer_ids: [],
      });
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
        // Hard reload to ensure all state is reset
        window.location.reload();
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
      // Hard reload to ensure all state is reset
      window.location.reload();
    }, 100);
  };

  const [formData, setFormData] = useState({
    pid: "",
    customer_id: "",
    sales_id: "",
    nilai_project: "",
    periode_mulai: "",
    periode_selesai: "",
    description: "",
    project_manager_id: "",
    product_ids: [] as string[],
    product_distributors: {} as Record<string, string>, // product_id -> distributor_id
    product_types: {} as Record<string, string>, // product_id -> project_type_id
    presales_ids: [] as string[],
    engineer_ids: [] as string[],
  });
  const [customers, setCustomers] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [presales, setPresales] = useState<any[]>([]);
  const [engineers, setEngineers] = useState<any[]>([]);
  const [projectManagers, setProjectManagers] = useState<any[]>([]);
  const [distributors, setDistributors] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [projectTypes, setProjectTypes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");
  const [productPopoverOpen, setProductPopoverOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const supabase = createClient();

      // Load customers
      const { data: customersData } = await supabase
        .from("customers")
        .select("*")
        .eq("status_aktif", true)
        .order("nama");
      setCustomers(customersData || []);

      // Load sales (users with role Sales)
      const { data: salesData } = await supabase
        .from("users")
        .select("*")
        .eq("role", "Sales")
        .eq("status_aktif", true)
        .order("nama_lengkap");
      setSales(salesData || []);

      // Load presales (users with role Presales)
      const { data: presalesData } = await supabase
        .from("users")
        .select("*")
        .eq("role", "Presales")
        .eq("status_aktif", true)
        .order("nama_lengkap");
      setPresales(presalesData || []);

      // Load engineers (users with role Engineer)
      const { data: engineersData } = await supabase
        .from("users")
        .select("*")
        .eq("role", "Engineer")
        .eq("status_aktif", true)
        .order("nama_lengkap");
      setEngineers(engineersData || []);

      // Load project managers (users with role Project Manager)
      const { data: projectManagersData } = await supabase
        .from("users")
        .select("*")
        .eq("role", "Project Manager")
        .eq("status_aktif", true)
        .order("nama_lengkap");
      setProjectManagers(projectManagersData || []);

      // Load distributors
      const { data: distributorsData } = await supabase
        .from("distributors")
        .select("*")
        .eq("status_aktif", true)
        .order("name");
      setDistributors(distributorsData || []);

      // Load products
      const { data: productsData } = await supabase
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
      setProducts(productsData || []);

      // Load project types
      const { data: projectTypesData } = await supabase
        .from("project_types")
        .select("*")
        .eq("status_aktif", true)
        .order("name");
      setProjectTypes(projectTypesData || []);
    };
    loadData();
  }, []);

  useEffect(() => {
    resetForm();
    
    // Reset dialog state when project changes
    setOpen(true);
    setIsLoading(false);
    setError("");
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();

      if (project) {
        // Update existing project
        const { data, error: updateError } = await supabase
          .from("projects")
          .update({
            pid: formData.pid || null,
            customer_id: formData.customer_id,
            sales_id: formData.sales_id,
            nilai_project: formData.nilai_project ? parseFloat(formData.nilai_project) : null,
            periode_mulai: formData.periode_mulai || null,
            periode_selesai: formData.periode_selesai || null,
            description: formData.description || null,
            project_manager_id: formData.project_manager_id || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", project.id)
          .select()
          .single();

        if (updateError) throw updateError;

        // Update project products
        await supabase
          .from("project_products")
          .delete()
          .eq("project_id", project.id);
        if (formData.product_ids.length > 0) {
          const projectProducts = formData.product_ids.map((productId) => ({
            project_id: project.id,
            product_id: productId,
            distributor_id: formData.product_distributors[productId] || null,
            project_type_id: formData.product_types[productId] || null,
          }));
          const { error: ppError } = await supabase
            .from("project_products")
            .insert(projectProducts);
          if (ppError) throw ppError;
        }

        // Update project presales
        await supabase
          .from("project_presales")
          .delete()
          .eq("project_id", project.id);
        if (formData.presales_ids.length > 0) {
          const projectPresales = formData.presales_ids.map((userId) => ({
            project_id: project.id,
            user_id: userId,
          }));
          const { error: ppsError } = await supabase
            .from("project_presales")
            .insert(projectPresales);
          if (ppsError) throw ppsError;
        }

        // Update project engineers
        await supabase
          .from("project_engineers")
          .delete()
          .eq("project_id", project.id);
        if (formData.engineer_ids.length > 0) {
          const projectEngineers = formData.engineer_ids.map((userId) => ({
            project_id: project.id,
            user_id: userId,
          }));
          const { error: peError } = await supabase
            .from("project_engineers")
            .insert(projectEngineers);
          if (peError) throw peError;
        }

        // Reload project with all relations
        const { data: updatedProject, error: reloadError } = await supabase
          .from("projects")
          .select(`
            *,
            customer:customers(*),
            sales:users!sales_id(*),
            project_manager:users!project_manager_id(*),
            project_products(
              distributor_id,
              project_type_id,
              product:products(
                *,
                brand:brands(
                  *,
                  sub_category:sub_categories(
                    *,
                    category:categories(*)
                  )
                )
              ),
              distributor:distributors(*),
              project_type:project_types(*)
            ),
            project_presales(
              user:users(*)
            ),
            project_engineers(
              user:users(*)
            )
          `)
          .eq("id", project.id)
          .single();

        if (reloadError) throw reloadError;
        
        if (!updatedProject) {
          throw new Error("Failed to load updated project");
        }
        
        // Close dialog first
        setIsLoading(false);
        setOpen(false);
        await resetForm();
        
        // Call onSave (handler will also try to reload)
        setTimeout(() => {
          onSave(updatedProject);
          onClose();
          window.location.reload();
        }, 100);
      } else {
        // Create new project
        const { data, error: createError } = await supabase
          .from("projects")
          .insert({
            pid: formData.pid || null,
            customer_id: formData.customer_id,
            sales_id: formData.sales_id,
            nilai_project: formData.nilai_project ? parseFloat(formData.nilai_project) : null,
            periode_mulai: formData.periode_mulai || null,
            periode_selesai: formData.periode_selesai || null,
            description: formData.description || null,
            project_manager_id: formData.project_manager_id || null,
          })
          .select()
          .single();

        if (createError) throw createError;

        // Insert project products
        if (formData.product_ids.length > 0 && data?.id) {
          const projectProducts = formData.product_ids.map((productId) => ({
            project_id: data.id,
            product_id: productId,
            distributor_id: formData.product_distributors[productId] || null,
            project_type_id: formData.product_types[productId] || null,
          }));
          const { error: ppError } = await supabase
            .from("project_products")
            .insert(projectProducts);
          if (ppError) throw ppError;
        }

        // Insert project presales
        if (formData.presales_ids.length > 0 && data?.id) {
          const projectPresales = formData.presales_ids.map((userId) => ({
            project_id: data.id,
            user_id: userId,
          }));
          const { error: ppsError } = await supabase
            .from("project_presales")
            .insert(projectPresales);
          if (ppsError) throw ppsError;
        }

        // Insert project engineers
        if (formData.engineer_ids.length > 0 && data?.id) {
          const projectEngineers = formData.engineer_ids.map((userId) => ({
            project_id: data.id,
            user_id: userId,
          }));
          const { error: peError } = await supabase
            .from("project_engineers")
            .insert(projectEngineers);
          if (peError) throw peError;
        }

        // Reload project with all relations
        const { data: newProject, error: reloadError } = await supabase
          .from("projects")
          .select(`
            *,
            customer:customers(*),
            sales:users!sales_id(*),
            project_manager:users!project_manager_id(*),
            project_products(
              distributor_id,
              project_type_id,
              product:products(
                *,
                brand:brands(
                  *,
                  sub_category:sub_categories(
                    *,
                    category:categories(*)
                  )
                )
              ),
              distributor:distributors(*),
              project_type:project_types(*)
            ),
            project_presales(
              user:users(*)
            ),
            project_engineers(
              user:users(*)
            )
          `)
          .eq("id", data.id)
          .single();

        if (reloadError) {
          console.error("Error reloading project:", reloadError);
          // Fallback: use the basic data from insert if reload fails
          // This ensures the project still appears in the list
          const fallbackProject = {
            ...data,
            customer: null,
            sales: null,
            project_manager: null,
            distributor: null,
            project_products: [],
            project_presales: [],
            project_engineers: []
          };
          console.log("Using fallback project data:", fallbackProject);
          // Close dialog first
          setIsLoading(false);
          setOpen(false);
          await resetForm();
          
          // Call onSave (handler will also try to reload)
          setTimeout(() => {
            onSave(fallbackProject);
            onClose();
            window.location.reload();
          }, 100);
        } else if (!newProject) {
          console.error("No project data returned from reload");
          // Fallback: use the basic data from insert
          const fallbackProject = {
            ...data,
            customer: null,
            sales: null,
            project_manager: null,
            distributor: null,
            project_products: [],
            project_presales: [],
            project_engineers: []
          };
          console.log("Using fallback project data:", fallbackProject);
          // Close dialog first
          setIsLoading(false);
          setOpen(false);
          await resetForm();
          
          // Call onSave (handler will also try to reload)
          setTimeout(() => {
            onSave(fallbackProject);
            onClose();
            window.location.reload();
          }, 100);
        } else {
          console.log("Project created successfully:", newProject);
          // Close dialog first
          setIsLoading(false);
          setOpen(false);
          await resetForm();
          
          // Call onSave (handler will also try to reload)
          setTimeout(() => {
            onSave(newProject);
            onClose();
            window.location.reload();
          }, 100);
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
      console.error("Error saving project:", err);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-50">
            {project ? "Edit Project" : "Add New Project"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-700 dark:text-slate-300">PID (Project ID)</Label>
              <Input
                value={formData.pid}
                onChange={(e) =>
                  setFormData({ ...formData, pid: e.target.value })
                }
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-50"
              />
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300">Revenue</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.nilai_project}
                onChange={(e) =>
                  setFormData({ ...formData, nilai_project: e.target.value })
                }
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-50"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-700 dark:text-slate-300">Tanggal Mulai</Label>
              <Input
                type="date"
                value={formData.periode_mulai}
                onChange={(e) =>
                  setFormData({ ...formData, periode_mulai: e.target.value })
                }
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-50"
              />
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300">Tanggal Selesai</Label>
              <Input
                type="date"
                value={formData.periode_selesai}
                onChange={(e) =>
                  setFormData({ ...formData, periode_selesai: e.target.value })
                }
                className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-50"
              />
            </div>
          </div>

          <div>
            <Label className="text-slate-700 dark:text-slate-300">Customer *</Label>
            <select
              value={formData.customer_id}
              onChange={(e) =>
                setFormData({ ...formData, customer_id: e.target.value })
              }
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-slate-700 dark:text-slate-300">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-50"
              rows={4}
              placeholder="Enter project description..."
            />
          </div>

          <div>
            <Label className="text-slate-700 dark:text-slate-300">AM *</Label>
            <select
              value={formData.sales_id}
              onChange={(e) =>
                setFormData({ ...formData, sales_id: e.target.value })
              }
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50"
              required
            >
              <option value="">Select AM</option>
              {sales.map((sale) => (
                <option key={sale.id} value={sale.id}>
                  {sale.nama_lengkap}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label className="text-slate-700 dark:text-slate-300">Project Manager</Label>
            <select
              value={formData.project_manager_id}
              onChange={(e) =>
                setFormData({ ...formData, project_manager_id: e.target.value })
              }
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50"
            >
              <option value="">Select Project Manager</option>
              {projectManagers.map((pm) => (
                <option key={pm.id} value={pm.id}>
                  {pm.nama_lengkap}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Label className="text-slate-700 dark:text-slate-300">Products *</Label>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-50"
                onClick={() => setProductPopoverOpen(!productPopoverOpen)}
              >
                <span className="truncate">
                  {formData.product_ids.length === 0
                    ? "Select products..."
                    : `${formData.product_ids.length} product${formData.product_ids.length > 1 ? "s" : ""} selected`}
                </span>
                <ChevronDown className={`ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform ${productPopoverOpen ? "rotate-180" : ""}`} />
              </Button>
              
              {productPopoverOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setProductPopoverOpen(false)}
                  />
                  <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search products..."
                          value={productSearchQuery}
                          onChange={(e) => setProductSearchQuery(e.target.value)}
                          className="pl-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-50"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {products.length === 0 ? (
                        <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                          Loading products...
                        </div>
                      ) : (
                        <>
                          {products
                            .filter((product) => {
                              if (!productSearchQuery) return true;
                              const searchLower = productSearchQuery.toLowerCase();
                              const categoryName = product.brand?.sub_category?.category?.name || "";
                              const subCategoryName = product.brand?.sub_category?.name || "";
                              const brandName = product.brand?.name || "";
                              const productName = product.name || "";
                              const productText = `${categoryName} ${subCategoryName} ${brandName} ${productName}`.toLowerCase();
                              return productText.includes(searchLower);
                            })
                            .filter((product) => !formData.product_ids.includes(product.id))
                            .map((product) => {
                              const categoryName = product.brand?.sub_category?.category?.name || "";
                              const subCategoryName = product.brand?.sub_category?.name || "";
                              const brandName = product.brand?.name || "";
                              const productName = product.name || "";
                              const productLabel = `${categoryName} - ${subCategoryName} - ${brandName} - ${productName}`;
                              
                              return (
                                <button
                                  key={product.id}
                                  type="button"
                                  className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    
                                    if (formData.product_ids.includes(product.id)) {
                                      return;
                                    }
                                    
                                    const newSelectedIds = [...formData.product_ids, product.id];
                                    const newDistributors = { ...formData.product_distributors };
                                    const newTypes = { ...formData.product_types };
                                    if (!newDistributors[product.id]) {
                                      newDistributors[product.id] = "";
                                    }
                                    if (!newTypes[product.id]) {
                                      newTypes[product.id] = "";
                                    }

                                    setFormData({
                                      ...formData,
                                      product_ids: newSelectedIds,
                                      product_distributors: newDistributors,
                                      product_types: newTypes,
                                    });
                                    
                                    setProductSearchQuery("");
                                  }}
                                >
                                  <span className="text-sm text-slate-900 dark:text-slate-50 block">
                                    {productLabel}
                                  </span>
                                </button>
                              );
                            })}
                          {products.filter((product) => {
                            if (!productSearchQuery) return false;
                            const searchLower = productSearchQuery.toLowerCase();
                            const categoryName = product.brand?.sub_category?.category?.name || "";
                            const subCategoryName = product.brand?.sub_category?.name || "";
                            const brandName = product.brand?.name || "";
                            const productName = product.name || "";
                            const productText = `${categoryName} ${subCategoryName} ${brandName} ${productName}`.toLowerCase();
                            return productText.includes(searchLower);
                          }).filter((product) => !formData.product_ids.includes(product.id)).length === 0 && productSearchQuery && (
                            <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                              No products found
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    {formData.product_ids.length > 0 && (
                      <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {formData.product_ids.length} selected
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData({
                              ...formData,
                              product_ids: [],
                              product_distributors: {},
                              product_types: {},
                            });
                          }}
                          className="h-7 text-xs"
                        >
                          Clear all
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            {formData.product_ids.length > 0 && (
              <div className="mt-3 space-y-2">
                <Label className="text-slate-700 dark:text-slate-300 text-sm">Selected Products:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.product_ids.map((productId) => {
                    const product = products.find((p) => p.id === productId);
                    if (!product) return null;
                    const categoryName = product.brand?.sub_category?.category?.name || "";
                    const subCategoryName = product.brand?.sub_category?.name || "";
                    const brandName = product.brand?.name || "";
                    const productName = product.name || "";
                    const productLabel = `${categoryName} - ${subCategoryName} - ${brandName} - ${productName}`;
                    
                    return (
                      <div
                        key={productId}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-md text-sm border border-blue-200 dark:border-blue-800"
                      >
                        <span className="truncate max-w-[300px]">{productLabel}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newSelectedIds = formData.product_ids.filter((id) => id !== productId);
                            const newDistributors = { ...formData.product_distributors };
                            const newTypes = { ...formData.product_types };
                            delete newDistributors[productId];
                            delete newTypes[productId];
                            setFormData({
                              ...formData,
                              product_ids: newSelectedIds,
                              product_distributors: newDistributors,
                              product_types: newTypes,
                            });
                          }}
                          className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded p-0.5 transition-colors"
                          title="Remove product"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Distributor and Project Type selection for each selected product */}
            {formData.product_ids.length > 0 && (
              <div className="mt-4 space-y-3">
                <Label className="text-slate-700 dark:text-slate-300">Distributor & Project Type per Product</Label>
                {formData.product_ids.map((productId) => {
                  const product = products.find((p) => p.id === productId);
                  return (
                    <div key={productId} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-50 truncate">
                          {product?.brand?.sub_category?.category?.name} - {product?.brand?.sub_category?.name} - {product?.brand?.name} - {product?.name}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={formData.product_distributors[productId] || ""}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              product_distributors: {
                                ...formData.product_distributors,
                                [productId]: e.target.value,
                              },
                            });
                          }}
                          className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50 text-sm"
                        >
                          <option value="">No Distributor</option>
                          {distributors.map((distributor) => (
                            <option key={distributor.id} value={distributor.id}>
                              {distributor.name}
                            </option>
                          ))}
                        </select>
                        <select
                          value={formData.product_types[productId] || ""}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              product_types: {
                                ...formData.product_types,
                                [productId]: e.target.value,
                              },
                            });
                          }}
                          className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50 text-sm"
                        >
                          <option value="">No Project Type</option>
                          {projectTypes.map((projectType) => (
                            <option key={projectType.id} value={projectType.id}>
                              {projectType.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-700 dark:text-slate-300">Presales</Label>
              <select
                multiple
                value={formData.presales_ids}
                onChange={(e) => {
                  const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData({ ...formData, presales_ids: selectedIds });
                }}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50 min-h-[120px]"
                size={5}
              >
                {presales.map((presale) => (
                  <option key={presale.id} value={presale.id}>
                    {presale.nama_lengkap}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple
              </p>
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300">Engineers</Label>
              <select
                multiple
                value={formData.engineer_ids}
                onChange={(e) => {
                  const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData({ ...formData, engineer_ids: selectedIds });
                }}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-slate-50 min-h-[120px]"
                size={5}
              >
                {engineers.map((engineer) => (
                  <option key={engineer.id} value={engineer.id}>
                    {engineer.nama_lengkap}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple
              </p>
            </div>
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
