"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CustomerDialog } from "./customer-dialog";
import { ListControls } from "@/components/ui/list-controls";
import { Plus, Trash2, Edit, UserCircle, LayoutGrid, List, MoreVertical } from 'lucide-react';
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CustomersList({ initialCustomers }: { initialCustomers: any[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"card" | "list">("list");

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex-1">
          <ListControls
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search customer..."
            filterValue={statusFilter}
            onFilterChange={setStatusFilter}
            filterOptions={[
              { value: "active", label: "Active Customers" },
              { value: "inactive", label: "Inactive Customers" },
            ]}
            filterLabel="Status"
            sortValue={sortBy}
            onSortChange={setSortBy}
            sortOptions={[
              { value: "name_asc", label: "Name (A-Z)" },
              { value: "name_desc", label: "Name (Z-A)" },
              { value: "created_desc", label: "Newest First" },
            ]}
          />
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("card")}
              className={cn(
                "h-9 px-3 rounded-lg transition-all duration-200",
                viewMode === "card"
                  ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("list")}
              className={cn(
                "h-9 px-3 rounded-lg transition-all duration-200",
                viewMode === "list"
                  ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              )}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={() => {
              setEditingCustomer(null);
              setShowDialog(true);
            }}
            className="relative bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl px-6 h-11 font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Customer
          </Button>
        </div>
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

      {filteredAndSortedCustomers.length === 0 ? (
        <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-3xl blur-xl opacity-50" />
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/40 dark:to-purple-800/30 flex items-center justify-center border border-purple-200/50 dark:border-purple-800/30">
                  <UserCircle className="h-12 w-12 text-purple-500 dark:text-purple-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">No customers found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm leading-relaxed mb-8">
                We couldn't find any customers matching your search. Try adjusting your filters or create a new customer to get started.
              </p>
              <Button
                variant="outline"
                className="border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl px-6 font-medium hover:scale-105 transition-transform duration-200"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                  setSortBy("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === "card" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredAndSortedCustomers.map((customer) => (
            <Card
              key={customer.id}
              className={cn(
                "group relative border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1",
                customer.status_aktif ? "hover:border-purple-300 dark:hover:border-purple-700/50" : "hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              <div className={cn(
                "absolute top-0 left-0 right-0 h-1",
                customer.status_aktif 
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600" 
                  : "bg-gradient-to-r from-slate-400 to-slate-500"
              )} />
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-purple-500 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                        <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {customer.nama?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-50 truncate">
                          {customer.nama}
                        </h3>
                        <span
                          className={cn(
                            "inline-block px-3 py-1 rounded-lg text-xs font-bold mt-2",
                            customer.status_aktif
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          )}
                        >
                          {customer.status_aktif ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        className="h-8 w-8 p-0 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px] border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xl backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
                      <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCustomer(customer);
                          setShowDialog(true);
                        }}
                        className="cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20"
                      >
                        <Edit className="mr-2 h-4 w-4 text-blue-500" />
                        Edit Customer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer rounded-lg" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomer(customer.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {customer.description && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Description</p>
                    <p className="text-sm text-slate-900 dark:text-slate-50 line-clamp-2">{customer.description}</p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Created {new Date(customer.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="overflow-x-auto relative">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-slate-50/80 to-slate-100/50 dark:from-slate-900/80 dark:to-slate-800/50 backdrop-blur-sm">
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Customer</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Description</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">Status</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Created</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/30">
                  {filteredAndSortedCustomers.map((customer, index) => (
                    <tr
                      key={customer.id}
                      className={cn(
                        "group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-all duration-200",
                        index % 2 === 0 ? "bg-white/50 dark:bg-slate-900/50" : "bg-slate-50/20 dark:bg-slate-900/20"
                      )}
                    >
                      <td className="py-5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="absolute inset-0 bg-purple-500 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {customer.nama?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-slate-50">{customer.nama}</span>
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-slate-600 dark:text-slate-400">{customer.description || "-"}</span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span
                          className={cn(
                            "px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm",
                            customer.status_aktif
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                              : "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
                          )}
                        >
                          {customer.status_aktif ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-slate-600 dark:text-slate-400 text-sm">
                          {new Date(customer.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <div className="flex items-center justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/20 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-200 hover:scale-110">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px] border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xl backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
                              <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  setEditingCustomer(customer);
                                  setShowDialog(true);
                                }}
                                className="cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20"
                              >
                                <Edit className="mr-2 h-4 w-4 text-blue-500" />
                                Edit Customer
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer rounded-lg" 
                                onClick={() => handleDeleteCustomer(customer.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/60 px-6 shadow-sm">
        <span className="font-semibold">
          Showing <span className="font-extrabold text-slate-900 dark:text-slate-50">{filteredAndSortedCustomers.length}</span> of <span className="font-extrabold text-slate-900 dark:text-slate-50">{customers.length}</span> customers
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Last updated: just now</span>
      </div>
    </div>
  );
}

