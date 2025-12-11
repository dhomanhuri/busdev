"use client";

import Image from "next/image";
import { useState } from "react";
import { Bell, Search, LogOut, Settings, Clock, ChevronRight, Home, Menu, X } from 'lucide-react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const getBreadcrumbs = (pathname: string) => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs: { label: string; href: string; icon?: any }[] = [{ label: 'Home', href: '/dashboard', icon: Home }];

  if (pathname === '/dashboard') {
    return breadcrumbs;
  }

  const pathMap: Record<string, string> = {
    'projects': 'Projects',
    'customers': 'Customers',
    'categories': 'Categories',
    'sub-categories': 'Sub Categories',
    'brands': 'Brands',
    'products': 'Products',
    'partnerships': 'Partnerships',
    'readiness': 'Readiness',
    'certificates': 'Certificates',
    'distributors': 'Distributors',
    'users': 'Users',
    'profile': 'Profile Settings',
  };

  let currentPath = '';
  paths.forEach((path, index) => {
    if (path === 'dashboard') {
      return;
    }

    currentPath += `/${path}`;
    const label = pathMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
    breadcrumbs.push({ label, href: currentPath, icon: undefined });
  });

  return breadcrumbs;
};

export function TopNav({ user }: { user: any }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const avatarUrl = user?.avatar_url;
  const breadcrumbs = getBreadcrumbs(pathname);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300">
      <div className="px-4 lg:px-6 py-3">
        {/* Top Row - Breadcrumbs and Actions */}
        <div className="flex items-center justify-between">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-1.5 text-xs lg:text-sm overflow-x-auto no-scrollbar mask-gradient-r">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const Icon = crumb.icon;

              return (
                <div key={`${crumb.href}-${index}`} className="flex items-center space-x-1.5 flex-shrink-0">
                  {Icon && (
                    <Link
                      href={crumb.href}
                      className="flex items-center p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-200"
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  )}
                  {!Icon && index > 0 && (
                    <ChevronRight className="h-4 w-4 text-slate-400 dark:text-slate-600" />
                  )}
                  <Link
                    href={crumb.href}
                    className={cn(
                      "font-medium transition-all duration-200 px-2 py-1 rounded-lg",
                      isLast
                        ? "text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/20 shadow-sm"
                        : "text-slate-700 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    {crumb.label}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right Side - Time, Notifications, User */}
          <div className="flex items-center gap-2 lg:gap-4 ml-4">
            {/* Time & Date */}
            <div className="hidden xl:flex flex-col items-end text-xs mx-2">
              <span className="font-bold text-slate-700 dark:text-slate-200 font-mono tracking-tight">{currentTime}</span>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{currentDate.split(',')[0]}</span>
            </div>

            {/* Separator */}
            <div className="hidden xl:block h-8 w-px bg-slate-200 dark:bg-slate-800" />

            {/* Search Bar */}
            <div className="hidden lg:flex relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-orange-500 transition-colors z-10" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-48 focus:w-64 bg-slate-100/50 dark:bg-slate-800/50 border border-transparent focus:border-orange-300 dark:focus:border-orange-700 rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300"
              />
            </div>

            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm animate-pulse"></span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 mr-4 mt-2 border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50">Notifications</h3>
                    <span className="text-xs text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-full">New</span>
                  </div>
                </div>
                <div className="p-8 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3">
                    <Bell className="h-6 w-6 text-slate-300 dark:text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No new notifications
                  </p>
                </div>
              </PopoverContent>
            </Popover>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-orange-500 group">
                  <div className="relative">
                    {avatarUrl ? (
                      <div className="h-8 w-8 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-orange-300 dark:group-hover:ring-orange-700 transition-all">
                        <Image
                          src={avatarUrl}
                          alt={user?.nama_lengkap || "User avatar"}
                          width={32}
                          height={32}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 group-hover:ring-orange-300 dark:group-hover:ring-orange-700 transition-all">
                        <span className="text-white font-bold text-xs">
                          {user?.nama_lengkap?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 shadow-sm" />
                  </div>
                  <div className="hidden md:block text-left mr-1">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      {user?.nama_lengkap || "User"}
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate max-w-[100px]">
                      {user?.role === "Sales" ? "Account Manager" : user?.role || "User"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 mt-2 p-1 border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl">
                <div className="p-3 mb-1 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                  <div className="flex items-center gap-3">
                    {avatarUrl ? (
                      <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                        <Image
                          src={avatarUrl}
                          alt={user?.nama_lengkap || "User avatar"}
                          width={40}
                          height={40}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user?.nama_lengkap?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                        {user?.nama_lengkap}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider font-medium">Account</DropdownMenuLabel>
                <DropdownMenuItem className="cursor-pointer gap-2 p-2 focus:bg-orange-50 dark:focus:bg-orange-950/20 focus:text-orange-700 dark:focus:text-orange-300" asChild>
                  <Link href="/dashboard/profile">
                    <Settings className="h-4 w-4" />
                    <span>Profile Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer gap-2 p-2 text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20 focus:text-red-700 dark:focus:text-red-300"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mt-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-orange-500 z-10" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 w-full bg-slate-100/50 dark:bg-slate-800/50 border border-transparent focus:border-orange-300 dark:focus:border-orange-700 rounded-xl text-sm text-slate-900 dark:text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

