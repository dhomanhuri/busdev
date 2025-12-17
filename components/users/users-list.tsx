"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserDialog } from "./user-dialog";
import { ListControls } from "@/components/ui/list-controls";
import { Plus, Trash2, MoreVertical, Edit, Users } from 'lucide-react';
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

export function UsersList({ initialUsers }: { initialUsers: any[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const filteredAndSortedUsers = users
    .filter((user) => {
      const matchesSearch =
        user.nama_lengkap.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !roleFilter || user.role === roleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (!sortBy) return 0;
      
      switch (sortBy) {
        case "name_asc":
          return a.nama_lengkap.localeCompare(b.nama_lengkap);
        case "name_desc":
          return b.nama_lengkap.localeCompare(a.nama_lengkap);
        case "email_asc":
          return a.email.localeCompare(b.email);
        case "email_desc":
          return b.email.localeCompare(a.email);
        case "role_asc":
          return a.role.localeCompare(b.role);
        case "role_desc":
          return b.role.localeCompare(a.role);
        case "created_asc":
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
        case "created_desc":
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
        default:
          return 0;
      }
    });

  const handleUserSaved = async (updatedUser: any) => {
    // Close dialog first
    setShowDialog(false);
    setEditingUser(null);
    
    // Reload the page to refresh all data and clear any state issues
    // This ensures a clean state after edit
    window.location.reload();
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", userId);

      if (error) throw error;
      
      // Reload page to refresh data
      window.location.reload();
    } catch (err: any) {
      alert("Failed to delete user: " + err.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col xl:flex-row gap-4 xl:items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex-1">
          <ListControls
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search user..."
            filterValue={roleFilter}
            onFilterChange={setRoleFilter}
            filterOptions={[
              { value: "Admin", label: "Admin" },
              { value: "GM", label: "General Manager" },
              { value: "Sales", label: "AM" },
              { value: "Presales", label: "Presales" },
              { value: "Engineer", label: "Engineer" },
              { value: "Project Manager", label: "Project Manager" },
            ]}
            filterLabel="Roles"
            sortValue={sortBy}
            onSortChange={setSortBy}
            sortOptions={[
              { value: "name_asc", label: "Name (A-Z)" },
              { value: "name_desc", label: "Name (Z-A)" },
              { value: "email_asc", label: "Email (A-Z)" },
              { value: "email_desc", label: "Email (Z-A)" },
              { value: "role_asc", label: "Role (A-Z)" },
              { value: "role_desc", label: "Role (Z-A)" },
              { value: "created_desc", label: "Newest First" },
            ]}
          />
        </div>
        <Button
          onClick={() => {
            setEditingUser(null);
            setShowDialog(true);
          }}
          className="relative bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl px-6 h-11 font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          New User
        </Button>
      </div>

      {showDialog && (
        <UserDialog
          user={editingUser}
          onClose={() => {
            setShowDialog(false);
            setEditingUser(null);
          }}
          onSave={handleUserSaved}
        />
      )}

      {filteredAndSortedUsers.length === 0 ? (
        <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-indigo-900/30 dark:to-indigo-800/20 rounded-3xl blur-xl opacity-50" />
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-800/30 flex items-center justify-center border border-indigo-200/50 dark:border-indigo-800/30">
                  <Users className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3">No users found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md text-sm leading-relaxed mb-8">
                We couldn't find any users matching your search. Try adjusting your filters or create a new user to get started.
              </p>
              <Button
                variant="outline"
                className="border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl px-6 font-medium hover:scale-105 transition-transform duration-200"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("");
                  setSortBy("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-0">
            <div className="overflow-x-auto relative">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-r from-slate-50/80 to-slate-100/50 dark:from-slate-900/80 dark:to-slate-800/50 backdrop-blur-sm">
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Photo</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Name</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Email</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Role</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider hidden">Department</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Certificates</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">Status</th>
                    <th className="py-5 px-6 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/30">
                  {filteredAndSortedUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={cn(
                        "group hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-all duration-200",
                        index % 2 === 0 ? "bg-white/50 dark:bg-slate-900/50" : "bg-slate-50/20 dark:bg-slate-900/20"
                      )}
                    >
                      <td className="py-5 px-6">
                        <Avatar className="h-12 w-12 border-2 border-slate-200 dark:border-slate-700 shadow-md">
                          <AvatarImage src={user.avatar_url} alt={user.nama_lengkap} />
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white font-bold">
                            {user.nama_lengkap
                              ? user.nama_lengkap
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)
                              : "U"}
                          </AvatarFallback>
                        </Avatar>
                      </td>
                      <td className="py-5 px-6">
                        <span className="font-bold text-slate-900 dark:text-slate-50">{user.nama_lengkap}</span>
                      </td>
                      <td className="py-5 px-6">
                        <span className="text-slate-600 dark:text-slate-400">{user.email}</span>
                      </td>
                      <td className="py-5 px-6">
                        <Badge
                          className={cn(
                            "px-3 py-1 rounded-lg text-xs font-bold",
                            user.role === "Admin" ? "bg-gradient-to-r from-red-500 to-red-600 text-white" :
                            user.role === "GM" ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" :
                            user.role === "Presales" ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white" :
                            user.role === "Engineer" ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white" :
                            user.role === "Project Manager" ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white" :
                            "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                          )}
                        >
                          {user?.role=="Sales" ? "AM" : user?.role}
                        </Badge>
                      </td>
                      <td className="py-5 px-6 hidden">
                        <span className="text-slate-600 dark:text-slate-400">{user.role === "GM" ? (user.department || "-") : "-"}</span>
                      </td>
                      <td className="py-5 px-6">
                        {user.user_certificates && user.user_certificates.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {user.user_certificates.map((uc: any) => (
                              <Badge
                                key={uc.certificate?.id}
                                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm"
                              >
                                {uc.certificate?.name}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">-</span>
                        )}
                      </td>
                      <td className="py-5 px-6 text-center">
                        <span
                          className={cn(
                            "px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm",
                            user.status_aktif
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white"
                              : "bg-gradient-to-r from-slate-400 to-slate-500 text-white"
                          )}
                        >
                          {user.status_aktif ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <div className="flex items-center justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 hover:scale-110">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px] border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-xl backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
                              <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => {
                                  setEditingUser(user);
                                  setShowDialog(true);
                                }}
                                className="cursor-pointer rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20"
                              >
                                <Edit className="mr-2 h-4 w-4 text-blue-500" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20 cursor-pointer rounded-lg" 
                                onClick={() => handleDeleteUser(user.id)}
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
          Showing <span className="font-extrabold text-slate-900 dark:text-slate-50">{filteredAndSortedUsers.length}</span> of <span className="font-extrabold text-slate-900 dark:text-slate-50">{users.length}</span> users
        </span>
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Last updated: just now</span>
      </div>
    </div>
  );
}
