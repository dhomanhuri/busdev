"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CustomerDialog } from "./customer-dialog";
import { Plus, Search, Trash2, Edit } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

export function CustomersList({ initialCustomers }: { initialCustomers: any[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.nama.toLowerCase().includes(search.toLowerCase()) ||
      (customer.description?.toLowerCase().includes(search.toLowerCase()) || false);
    return matchesSearch;
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
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-400" />
          <Input
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
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
          {filteredCustomers.length === 0 ? (
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
                  {filteredCustomers.map((customer) => (
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

