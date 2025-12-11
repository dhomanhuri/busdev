"use client";

import { Input } from "@/components/ui/input";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterOption {
  value: string;
  label: string;
}

interface SortOption {
  value: string;
  label: string;
}

interface ListControlsProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  filterLabel?: string;
  sortValue?: string;
  onSortChange?: (value: string) => void;
  sortOptions?: SortOption[];
  sortLabel?: string;
  className?: string;
}

export function ListControls({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterValue,
  onFilterChange,
  filterOptions,
  filterLabel = "Filter",
  sortValue,
  onSortChange,
  sortOptions,
  sortLabel = "Sort By",
  className,
}: ListControlsProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row gap-4 items-start sm:items-center p-1", className)}>
      <div className="relative flex-1 w-full min-w-[200px] group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:border-orange-300 dark:focus:border-orange-700 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/20 rounded-xl transition-all shadow-sm hover:shadow-md"
        />
      </div>

      <div className="flex gap-3 w-full sm:w-auto">
        {filterOptions && onFilterChange && (
          <Select value={filterValue || "all"} onValueChange={(value) => onFilterChange(value === "all" ? "" : value)}>
            <SelectTrigger className="h-10 min-w-[140px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-orange-100 dark:focus:ring-orange-900/20 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Filter className="h-3.5 w-3.5" />
                <SelectValue placeholder={filterLabel} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All {filterLabel}</SelectItem>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {sortOptions && onSortChange && (
          <Select value={sortValue || "default"} onValueChange={(value) => onSortChange(value === "default" ? "" : value)}>
            <SelectTrigger className="h-10 min-w-[160px] bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-orange-100 dark:focus:ring-orange-900/20 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <SelectValue placeholder={sortLabel} />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">{sortLabel}</SelectItem>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
}

