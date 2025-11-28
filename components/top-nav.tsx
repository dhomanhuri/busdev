"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Bell, Search, LogOut, Settings, User, Menu, X, ChevronRight, Home, Clock } from 'lucide-react';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

const getBreadcrumbs = (pathname: string) => {
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Home', href: '/dashboard', icon: Home }];
  
  // If we're already at dashboard, just return Home
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
    // Skip 'dashboard' in path since we already have Home
    if (path === 'dashboard') {
      return;
    }
    
    currentPath += `/${path}`;
    const label = pathMap[path] || path.charAt(0).toUpperCase() + path.slice(1);
    breadcrumbs.push({ label, href: currentPath, icon: null });
  });

  return breadcrumbs;
};

export function TopNav({ user }: { user: any }) {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const avatarUrl = user?.avatar_url;
  const breadcrumbs = getBreadcrumbs(pathname);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    if (isDropdownOpen || isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isNotificationOpen]);

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
    <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-50/80 via-white to-orange-50/80 dark:from-slate-900/95 dark:via-slate-800/95 dark:to-slate-900/95 backdrop-blur-xl border-b border-orange-200/50 dark:border-orange-900/30 shadow-lg shadow-orange-500/5">
      <div className="px-4 lg:px-6 py-2.5">
        {/* Top Row - Breadcrumbs and Actions */}
        <div className="flex items-center justify-between mb-2">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-1.5 text-xs lg:text-sm">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const Icon = crumb.icon;
              
              return (
                <div key={`${crumb.href}-${index}`} className="flex items-center space-x-1.5">
                  {Icon && (
                    <Link
                      href={crumb.href}
                      className="flex items-center p-1 rounded-md bg-gradient-to-br from-orange-400/20 to-orange-500/10 dark:from-orange-600/20 dark:to-orange-700/10 text-orange-600 dark:text-orange-400 hover:from-orange-400/30 hover:to-orange-500/20 dark:hover:from-orange-600/30 dark:hover:to-orange-700/20 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
                    >
                      <Icon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
                    </Link>
                  )}
                  {!Icon && index > 0 && (
                    <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4 text-orange-400 dark:text-orange-500" />
                  )}
                  <Link
                    href={crumb.href}
                    className={cn(
                      "font-medium transition-all duration-200 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-md",
                      isLast
                        ? "text-orange-700 dark:text-orange-300 bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 shadow-sm font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-900/10"
                    )}
                  >
                    {crumb.label}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Right Side - Time, Notifications, User */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Time & Date */}
            <div className="hidden md:flex flex-col items-end text-[10px] lg:text-xs bg-gradient-to-br from-orange-100/50 to-orange-50/50 dark:from-orange-900/20 dark:to-orange-800/10 px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg border border-orange-200/50 dark:border-orange-800/30 shadow-sm">
              <div className="flex items-center gap-1 text-orange-700 dark:text-orange-300">
                <Clock className="h-3 w-3 lg:h-3.5 lg:w-3.5" />
                <span className="font-semibold">{currentTime}</span>
              </div>
              <span className="text-orange-600 dark:text-orange-400 font-medium">{currentDate.split(',')[0]}</span>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-500/10 rounded-lg blur-sm opacity-50"></div>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-orange-500 dark:text-orange-400 z-10" />
              <input
                type="text"
                placeholder="Quick search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative pl-9 pr-3 py-1.5 w-56 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-800/50 rounded-lg text-xs lg:text-sm text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 dark:focus:ring-orange-600/50 dark:focus:border-orange-600 transition-all shadow-sm hover:shadow-md"
              />
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-1.5 lg:p-2 rounded-lg bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20 hover:from-orange-200 hover:to-orange-100 dark:hover:from-orange-800/40 dark:hover:to-orange-700/30 border border-orange-200/50 dark:border-orange-800/50 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
              >
                <Bell className="h-4 w-4 lg:h-5 lg:w-5" />
                <span className="absolute top-0.5 right-0.5 lg:top-1 lg:right-1 h-2 w-2 lg:h-2.5 lg:w-2.5 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-white dark:border-slate-900 shadow-sm animate-pulse"></span>
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-2 border-orange-200/50 dark:border-orange-800/50 shadow-2xl shadow-orange-500/10 z-50 overflow-hidden">
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-900/30 dark:to-orange-800/20 border-b border-orange-200/50 dark:border-orange-800/50">
                    <h3 className="font-bold text-orange-700 dark:text-orange-300 flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Notifications
                    </h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-center text-slate-500 dark:text-slate-400 py-8">
                      No new notifications
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 lg:gap-2.5 px-2 lg:px-2.5 py-1 lg:py-1.5 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100/50 dark:from-orange-900/30 dark:to-orange-800/20 hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-800/40 dark:hover:to-orange-700/30 border border-orange-200/50 dark:border-orange-800/50 transition-all duration-200 group shadow-sm hover:shadow-md hover:scale-105"
              >
                {avatarUrl ? (
                  <div className="h-7 w-7 lg:h-8 lg:w-8 rounded-full overflow-hidden border-2 border-orange-300 dark:border-orange-700 shadow-md ring-2 ring-orange-200/50 dark:ring-orange-900/50 group-hover:ring-orange-400 dark:group-hover:ring-orange-700 transition-all">
                    <Image
                      src={avatarUrl}
                      alt={user?.nama_lengkap || "User avatar"}
                      width={32}
                      height={32}
                      className="object-cover h-full w-full"
                    />
                  </div>
                ) : (
                  <div className="h-7 w-7 lg:h-8 lg:w-8 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center shadow-md ring-2 ring-orange-200/50 dark:ring-orange-900/50 group-hover:ring-orange-400 dark:group-hover:ring-orange-700 transition-all">
                    <span className="text-white font-bold text-xs lg:text-sm">
                      {user?.nama_lengkap?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div className="hidden lg:block text-left">
                  <p className="text-xs lg:text-sm font-bold text-orange-700 dark:text-orange-300 leading-tight">
                    {user?.nama_lengkap || "User"}
                  </p>
                  <p className="text-[10px] lg:text-xs text-orange-600 dark:text-orange-400 font-medium leading-tight">
                    {user?.role === "Sales" ? "Account Manager" : user?.role || "User"}
                  </p>
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border-2 border-orange-200/50 dark:border-orange-800/50 shadow-2xl shadow-orange-500/10 z-50 overflow-hidden transform transition-all duration-200">
                  {/* User Info Header */}
                  <div className="p-4 bg-gradient-to-br from-orange-400/10 via-orange-300/10 to-orange-200/10 dark:from-orange-900/40 dark:via-orange-800/30 dark:to-orange-700/20 border-b border-orange-200/50 dark:border-orange-800/50">
                    <div className="flex items-center gap-3">
                      {avatarUrl ? (
                        <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-orange-300 dark:border-orange-700 shadow-lg ring-2 ring-orange-200/50 dark:ring-orange-900/50">
                          <Image
                            src={avatarUrl}
                            alt={user?.nama_lengkap || "User avatar"}
                            width={48}
                            height={48}
                            className="object-cover h-full w-full"
                          />
                        </div>
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center shadow-lg ring-2 ring-orange-200/50 dark:ring-orange-900/50">
                          <span className="text-white font-bold text-lg">
                            {user?.nama_lengkap?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-orange-700 dark:text-orange-300 truncate">
                          {user?.nama_lengkap || "User"}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                          {user?.email || ""}
                        </p>
                        <p className="text-xs text-orange-600 dark:text-orange-400 font-bold mt-0.5 bg-orange-100/50 dark:bg-orange-900/30 px-2 py-0.5 rounded-md inline-block">
                          {user?.role === "Sales" ? "Account Manager" : user?.role || "User"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2 bg-gradient-to-b from-transparent to-orange-50/30 dark:to-orange-900/10">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-orange-700 dark:text-orange-300 hover:bg-gradient-to-r hover:from-orange-100 hover:to-orange-50 dark:hover:from-orange-900/30 dark:hover:to-orange-800/20 hover:text-orange-700 dark:hover:text-orange-300 transition-all duration-200 group shadow-sm hover:shadow-md"
                    >
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-200 to-orange-100 dark:from-orange-800/50 dark:to-orange-900/30 group-hover:from-orange-300 group-hover:to-orange-200 dark:group-hover:from-orange-700 dark:group-hover:to-orange-800 transition-all shadow-sm">
                        <Settings className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <span>Profile Settings</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-100 hover:to-red-50 dark:hover:from-red-900/30 dark:hover:to-red-800/20 transition-all duration-200 group mt-1 shadow-sm hover:shadow-md"
                    >
                      <div className="p-1.5 rounded-lg bg-gradient-to-br from-red-200 to-red-100 dark:from-red-800/50 dark:to-red-900/30 group-hover:from-red-300 group-hover:to-red-200 dark:group-hover:from-red-700 dark:group-hover:to-red-800 transition-all shadow-sm">
                        <LogOut className="h-4 w-4" />
                      </div>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-orange-500/10 rounded-lg blur-sm opacity-50"></div>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-orange-500 dark:text-orange-400 z-10" />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative w-full pl-9 pr-3 py-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-2 border-orange-200 dark:border-orange-800/50 rounded-lg text-xs lg:text-sm text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 dark:focus:ring-orange-600/50 dark:focus:border-orange-600 transition-all shadow-sm hover:shadow-md"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
