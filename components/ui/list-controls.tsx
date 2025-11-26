"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
}: ListControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 dark:text-slate-400" />
        <Input
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50"
        />
      </div>

      {filterOptions && onFilterChange && (
        <select
          value={filterValue || ""}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 min-w-[150px]"
        >
          <option value="">All {filterLabel}</option>
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {sortOptions && onSortChange && (
        <select
          value={sortValue || ""}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 min-w-[150px]"
        >
          <option value="">{sortLabel}</option>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

