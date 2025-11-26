"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, Users, Package, Building2, TrendingUp } from "lucide-react";

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

export function StatsCard({ title, value, icon, trend, description }: StatsCardProps) {
  const Icon = iconMap[icon];
  
  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              {value}
            </p>
            {trend && (
              <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}% {trend.label}
              </p>
            )}
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

