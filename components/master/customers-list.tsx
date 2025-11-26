"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CustomerDialog } from "./customer-dialog";
import { ListControls } from "@/components/ui/list-controls";
import { Plus, Trash2, Edit } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

export function CustomersList({ initialCustomers }: { initialCustomers: any[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  const filteredAndSortedCustomers = customers
    .filter((customer) => {
      const matchesSearch =
        customer.nama.toLowerCase().includes(search.toLowerCase()) ||
        (customer.description?.toLowerCase().includes(search.toLowerCase()) || false);
      
      const matchesStatus = !statusFilter ||
        (statusFilter === "active" && customer.status_aktif) ||
        (statusFilter === "inactive" && !customer.status_aktif);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      switch (sortBy) {
        case "name_asc":
          return a.nama.localeCompare(b.nama);
        case "name_desc":
          return b.nama.localeCompare(a.nama);
        case "created_asc":
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case "created_desc":
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default:
          return 0;
      }
    });

  const handleCustomerSaved = (updatedCustomer: any) => {
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
      setEditingCustomer(null);
    } else {
      setCustomers([updatedCustomer, ...customers]);
    }
    setShowDialog(false);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", customerId);

      if (error) throw error;
      setCustomers(customers.filter(c => c.id !== customerId));
    } catch (err: any) {
      alert("Failed to delete customer: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-start">
        <div className="flex-1">
          <ListControls
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search customer..."
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
              { value: "created_asc", label: "Created (Oldest)" },
              { value: "created_desc", label: "Created (Newest)" },
            ]}
          />
        </div>
        <Button
          onClick={() => {
            setEditingCustomer(null);
            setShowDialog(true);
          }}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {showDialog && (
        <CustomerDialog
          customer={editingCustomer}
          onClose={() => {
            setShowDialog(false);
            setEditingCustomer(null);
          }}
          onSave={handleCustomerSaved}
        />
      )}

      <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          {filteredAndSortedCustomers.length === 0 ? (
            <p className="text-center text-slate-600 dark:text-slate-400 py-8">No customers found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Nama</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Description</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-slate-700 dark:text-slate-300">Created</th>
                    <th className="text-right py-3 px-4 text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    >
                      <td className="py-3 px-4 text-slate-900 dark:text-slate-50 font-medium">{customer.nama}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{customer.description || "-"}</td>
                      <td className="py-3 px-4">
                        <Badge
                          className={
                            customer.status_aktif
                              ? "bg-green-900 text-green-200"
                              : "bg-gray-900 text-gray-200"
                          }
                        >
                          {customer.status_aktif ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                        {new Date(customer.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right gap-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCustomer(customer);
                            setShowDialog(true);
                          }}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id)}
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

