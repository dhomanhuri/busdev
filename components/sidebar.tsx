"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { useState } from "react";
import { LayoutDashboard, Users, Settings, Package, Tag, Layers, ShoppingBag, Handshake, CheckCircle, Award, Truck, UserCircle, FolderKanban, ChevronRight, ChevronLeft, Database as DatabaseIcon } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    master: true,
    admin: true
  });
  const avatarUrl = user?.avatar_url;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const MenuItem = ({ item, isActive }: { item: typeof menuItems[0]; isActive: boolean }) => {
    const linkContent = (
      <Link
        href={item.href}
        className={cn(
          "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
          isActive
            ? "bg-gradient-to-r from-orange-500/10 to-orange-100/50 dark:from-orange-950/40 dark:to-orange-900/20 text-orange-700 dark:text-orange-300 shadow-[0_1px_3px_rgba(0,0,0,0.05)] border border-orange-200/50 dark:border-orange-800/20"
            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 hover:text-orange-600 dark:hover:text-orange-400 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50",
          isCollapsed && "justify-center px-0 py-3 mx-1"
        )}
      >
        <div className={cn(
          "flex items-center justify-center transition-all duration-300 rounded-lg p-1",
          isActive
            ? "text-orange-600 dark:text-orange-400 scale-110"
            : "text-slate-500 dark:text-slate-500 group-hover:text-orange-600 dark:group-hover:text-orange-400 group-hover:scale-110"
        )}>
          <item.icon className="h-5 w-5" />
        </div>
        {!isCollapsed && (
          <span className={cn(
            "flex-1 transition-all duration-300 truncate",
            isActive && "font-semibold"
          )}>{item.label}</span>
        )}
        {!isCollapsed && isActive && (
          <div className="absolute right-3 h-2 w-2 rounded-full bg-orange-500 dark:bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse" />
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {linkContent}
          </TooltipTrigger>
          <TooltipContent side="right" className="font-medium bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-none">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkContent;
  };

  const SectionHeader = ({ label, icon: Icon, sectionKey }: { label: string; icon: any; sectionKey?: string }) => {
    const isExpanded = sectionKey ? expandedSections[sectionKey] : true;

    return (
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-3 mt-4 first:mt-2 transition-opacity duration-300 select-none group",
          isCollapsed ? "justify-center px-2" : "",
          sectionKey && !isCollapsed && "cursor-pointer"
        )}
        onClick={() => sectionKey && toggleSection(sectionKey)}
      >
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="h-px w-8 bg-slate-200 dark:bg-slate-700 my-2 group-hover:bg-orange-400 transition-colors" />
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs text-slate-500">
              {label}
            </TooltipContent>
          </Tooltip>
        ) : (
          <>
            <div className={cn(
              "rounded-md p-1 transition-colors duration-300",
              sectionKey ? "group-hover:bg-orange-50 dark:group-hover:bg-orange-950/30" : "bg-orange-50 dark:bg-orange-950/20"
            )}>
              <Icon className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap flex-1 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
              {label}
            </span>
            {sectionKey && (
              <ChevronRight
                size={14}
                className={cn(
                  "text-slate-500 transition-transform duration-300 group-hover:text-orange-500",
                  isExpanded ? "rotate-90" : ""
                )}
              />
            )}
            {!sectionKey && <div className="flex-1 h-px bg-gradient-to-r from-slate-200 dark:from-slate-700 to-transparent ml-2" />}
          </>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className={cn(
        "relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] z-50",
        isCollapsed ? "w-20" : "w-72"
      )}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 z-50 p-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:scale-110 transition-all duration-300"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Header */}
        <div className={cn(
          "relative overflow-hidden transition-all duration-500",
          isCollapsed ? "px-2 py-6" : "p-6"
        )}>
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent dark:from-orange-950/20 opacity-50 transition-opacity",
            isCollapsed && "opacity-0"
          )} />

          <div className={cn("relative flex items-center", isCollapsed ? "justify-center flex-col gap-2" : "gap-4")}>
            <div className="relative group">
              <div className="rounded-xl bg-gradient-to-tr from-orange-500 to-rose-500 p-0.5 shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                <div className="bg-white dark:bg-slate-800 rounded-[10px] p-2">
                  <LayoutDashboard className="h-6 w-6 text-orange-500 dark:text-orange-400" />
                </div>
              </div>
              {!isCollapsed && (
                <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-emerald-500 rounded-full border-[3px] border-white dark:border-slate-900 shadow-sm animate-pulse" />
              )}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-500">
                <h1 className="font-800 text-xl bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
                  Bus Dev
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {user?.role === "Sales" ? "Account Manager" : user?.role || "User"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 pb-4">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return <MenuItem key={item.href} item={item} isActive={isActive} />;
            })}

            <SectionHeader label="Master Data" icon={DatabaseIcon} sectionKey="master" />
            <div className={cn(
              "space-y-1 transition-all duration-300 overflow-hidden origin-top",
              expandedSections.master ? "max-h-[1000px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
            )}>
              {masterMenuItems.map((item) => {
                const isActive = pathname === item.href;
                return <MenuItem key={item.href} item={item} isActive={isActive} />;
              })}
            </div>

            {user?.role === "Admin" && (
              <>
                <SectionHeader label="Administration" icon={Users} sectionKey="admin" />
                <div className={cn(
                  "space-y-1 transition-all duration-300 overflow-hidden origin-top",
                  expandedSections.admin ? "max-h-[500px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"
                )}>
                  {adminMenuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return <MenuItem key={item.href} item={item} isActive={isActive} />;
                  })}
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm space-y-4">
          <div className={cn("flex items-center justify-center", isCollapsed ? "" : "bg-slate-100/50 dark:bg-slate-800/50 rounded-lg p-1")}>
            <ThemeToggle />
          </div>

          {/* User Profile Card */}
          <div className={cn(
            "group relative rounded-xl transition-all duration-300 cursor-pointer overflow-hidden",
            isCollapsed
              ? "w-10 h-10 mx-auto rounded-full ring-2 ring-slate-200 dark:ring-slate-700 hover:ring-orange-400 p-0"
              : "bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/20 border border-slate-200/60 dark:border-slate-700/60 p-3 hover:shadow-md hover:border-orange-200 dark:hover:border-orange-900/50"
          )}>
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

            <div className={cn("flex items-center relative", isCollapsed ? "justify-center h-full w-full" : "gap-3")}>
              {avatarUrl ? (
                <div className={cn(
                  "relative rounded-full overflow-hidden transition-all duration-300",
                  isCollapsed ? "w-full h-full" : "h-9 w-9 border-2 border-white dark:border-slate-700 shadow-sm"
                )}>
                  <Image
                    src={avatarUrl}
                    alt={user?.nama_lengkap || "User avatar"}
                    width={40}
                    height={40}
                    className="object-cover h-full w-full"
                  />
                </div>
              ) : (
                <div className={cn(
                  "rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shadow-inner",
                  isCollapsed ? "w-full h-full" : "h-9 w-9 border-2 border-white dark:border-slate-700"
                )}>
                  <span className="text-white font-bold text-xs">
                    {user?.nama_lengkap?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              {!isCollapsed && (
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {user?.nama_lengkap || "User"}
                  </p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate font-medium">
                    {user?.email || ""}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
