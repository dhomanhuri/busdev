"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, Users, Package, Building2, TrendingUp, UserCircle } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: "projects" | "customers" | "products" | "users" | "trending";
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  description?: string;
}

const iconMap = {
  projects: FolderKanban,
  customers: Building2,
  products: Package,
  users: Users,
  trending: TrendingUp,
};

const colorMap = {
  projects: { 
    bg: "from-orange-500 to-orange-600", 
    shadow: "shadow-orange-500/25",
    hover: "hover:border-orange-300 dark:hover:border-orange-700/50 hover:shadow-orange-500/10 dark:hover:shadow-orange-900/20",
    gradient: "from-orange-50/50 dark:from-orange-950/10",
    badge: "from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-800/20 text-orange-600 dark:text-orange-400"
  },
  customers: { 
    bg: "from-purple-500 to-purple-600", 
    shadow: "shadow-purple-500/25",
    hover: "hover:border-purple-300 dark:hover:border-purple-700/50 hover:shadow-purple-500/10 dark:hover:shadow-purple-900/20",
    gradient: "from-purple-50/50 dark:from-purple-950/10",
    badge: "from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/20 text-purple-600 dark:text-purple-400"
  },
  products: { 
    bg: "from-blue-500 to-blue-600", 
    shadow: "shadow-blue-500/25",
    hover: "hover:border-blue-300 dark:hover:border-blue-700/50 hover:shadow-blue-500/10 dark:hover:shadow-blue-900/20",
    gradient: "from-blue-50/50 dark:from-blue-950/10",
    badge: "from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-800/20 text-blue-600 dark:text-blue-400"
  },
  users: { 
    bg: "from-indigo-500 to-indigo-600", 
    shadow: "shadow-indigo-500/25",
    hover: "hover:border-indigo-300 dark:hover:border-indigo-700/50 hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/20",
    gradient: "from-indigo-50/50 dark:from-indigo-950/10",
    badge: "from-indigo-100 to-indigo-50 dark:from-indigo-900/40 dark:to-indigo-800/20 text-indigo-600 dark:text-indigo-400"
  },
  trending: { 
    bg: "from-emerald-500 to-emerald-600", 
    shadow: "shadow-emerald-500/25",
    hover: "hover:border-emerald-300 dark:hover:border-emerald-700/50 hover:shadow-emerald-500/10 dark:hover:shadow-emerald-900/20",
    gradient: "from-emerald-50/50 dark:from-emerald-950/10",
    badge: "from-emerald-100 to-emerald-50 dark:from-emerald-900/40 dark:to-emerald-800/20 text-emerald-600 dark:text-emerald-400"
  },
};

export function StatsCard({ title, value, icon, trend, description }: StatsCardProps) {
  const Icon = iconMap[icon];
  const colors = colorMap[icon];
  
  return (
    <div className={`group relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 ${colors.hover} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{title}</p>
        <div className={`px-3 py-1 rounded-lg bg-gradient-to-r ${colors.badge} text-xs font-bold shadow-sm`}>
          {icon === "customers" ? "Customers" : icon === "products" ? "Products" : icon === "users" ? "Users" : icon === "projects" ? "Projects" : "Trend"}
        </div>
      </div>
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-2 tracking-tight">
            {value}
          </p>
          {trend && (
            <p className={`text-sm font-medium ${trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}% {trend.label}
            </p>
          )}
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
              {description}
            </p>
          )}
        </div>
        <div className={`relative h-14 w-14 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg ${colors.shadow}`}>
          <Icon className="h-7 w-7 text-white" />
        </div>
      </div>
    </div>
  );
}

