"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown, Settings } from 'lucide-react';
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

export function TopNav({ user }: { user: any }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const avatarUrl = user?.avatar_url;

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {avatarUrl ? (
          <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-600 shadow-md">
            <Image
              src={avatarUrl}
              alt={user?.nama_lengkap || "User avatar"}
              width={40}
              height={40}
              className="object-cover h-full w-full"
            />
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">
              {user?.nama_lengkap?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
        )}
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Welcome back,</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{user?.nama_lengkap}</p>
        </div>
      </div>
      
      {/* Dropdown Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100 dark:from-slate-700 dark:to-slate-700 hover:from-orange-100 hover:to-orange-200 dark:hover:from-slate-600 dark:hover:to-slate-600 text-slate-700 dark:text-slate-300 hover:text-orange-700 dark:hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <User className="h-4 w-4" />
          <span className="font-medium hidden sm:inline">Profile</span>
          <ChevronDown className={cn(
            "h-4 w-4 transition-transform duration-200",
            isDropdownOpen && "rotate-180"
          )} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-50 overflow-hidden transform transition-all duration-200 ease-out origin-top-right opacity-100 scale-100 translate-y-0">
            <div className="p-2">
              <div className="px-3 py-2 mb-2 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                  {user?.nama_lengkap || "User"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || ""}
                </p>
              </div>
              
              <Link
                href="/dashboard/profile"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100/50 dark:hover:from-slate-700 dark:hover:to-slate-700 hover:text-orange-600 dark:hover:text-white transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
                <span>Profile Settings</span>
              </Link>
              
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 dark:hover:from-red-900/20 dark:hover:to-orange-900/20 transition-all duration-200 mt-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
