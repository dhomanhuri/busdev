"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, Settings, Database, Package, Tag, Layers, ShoppingBag, Handshake, CheckCircle, Award, Truck, UserCircle, FolderKanban, ChevronRight, Database as DatabaseIcon } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Profile Settings", href: "/dashboard/profile", icon: Settings },
];

const adminMenuItems = [
  { label: "User Management", href: "/dashboard/users", icon: Users },
];

const masterMenuItems = [
  { label: "Category", href: "/dashboard/categories", icon: Tag },
  { label: "Sub Category", href: "/dashboard/sub-categories", icon: Layers },
  { label: "Brand", href: "/dashboard/brands", icon: Package },
  { label: "Product", href: "/dashboard/products", icon: ShoppingBag },
  { label: "Partnership", href: "/dashboard/partnerships", icon: Handshake },
  { label: "Readiness", href: "/dashboard/readiness", icon: CheckCircle },
  { label: "Certificate", href: "/dashboard/certificates", icon: Award },
  { label: "Distributor", href: "/dashboard/distributors", icon: Truck },
  { label: "Customer", href: "/dashboard/customers", icon: UserCircle },
];

export function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const avatarUrl = user?.avatar_url;

  const MenuItem = ({ item, isActive }: { item: typeof menuItems[0]; isActive: boolean }) => (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300",
        isActive
          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30"
          : "text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 dark:hover:from-slate-700/50 dark:hover:to-slate-700/50 hover:text-orange-600 dark:hover:text-white"
      )}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg" />
      )}
      <div className={cn(
        "flex items-center justify-center transition-transform duration-300",
        isActive ? "scale-110" : "group-hover:scale-110"
      )}>
        <item.icon className={cn("h-5 w-5", isActive && "drop-shadow-sm")} />
      </div>
      <span className="flex-1">{item.label}</span>
      {isActive && (
        <ChevronRight className="h-4 w-4 opacity-70" />
      )}
    </Link>
  );

  const SectionHeader = ({ label, icon: Icon }: { label: string; icon: any }) => (
    <div className="flex items-center gap-2 px-4 py-3 mt-6 first:mt-0">
      <div className="rounded-lg bg-gradient-to-br from-orange-400/20 to-orange-600/20 dark:from-orange-400/10 dark:to-orange-600/10 p-1.5">
        <Icon className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
      </div>
      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-slate-300 dark:from-slate-600 to-transparent ml-2" />
    </div>
  );

  return (
    <div className="w-64 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-700/60 flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-br from-orange-50/80 via-white to-orange-50/30 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 p-3 shadow-lg transform hover:scale-105 transition-transform duration-300">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 shadow-sm animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-slate-900 dark:text-slate-50 tracking-tight">
              Bus Dev
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5 truncate">
              {user?.role === "Sales" ? "Account Manager" : user?.role || "User"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar scroll-smooth">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return <MenuItem key={item.href} item={item} isActive={isActive} />;
        })}

        <SectionHeader label="Master Data" icon={DatabaseIcon} />
        {masterMenuItems.map((item) => {
          const isActive = pathname === item.href;
          return <MenuItem key={item.href} item={item} isActive={isActive} />;
        })}

        {user?.role === "Admin" && (
          <>
            <SectionHeader label="Administration" icon={Users} />
            {adminMenuItems.map((item) => {
              const isActive = pathname === item.href;
              return <MenuItem key={item.href} item={item} isActive={isActive} />;
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-t from-slate-50/80 to-transparent dark:from-slate-800/80 dark:to-transparent space-y-3">
        <div className="flex items-center justify-center p-2">
          <ThemeToggle />
        </div>
        
        {/* User Profile Card */}
        <div className="p-3 rounded-xl bg-gradient-to-br from-white to-orange-50/50 dark:from-slate-700/50 dark:to-slate-700/30 border border-slate-200/50 dark:border-slate-600/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-orange-200 dark:border-orange-700 shadow-md ring-2 ring-orange-100 dark:ring-orange-900/50">
                <Image
                  src={avatarUrl}
                  alt={user?.nama_lengkap || "User avatar"}
                  width={40}
                  height={40}
                  className="object-cover h-full w-full"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md ring-2 ring-orange-100 dark:ring-orange-900/50">
                <span className="text-white font-bold text-sm">
                  {user?.nama_lengkap?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                {user?.nama_lengkap || "User"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

