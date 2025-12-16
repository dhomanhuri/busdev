"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface TopCustomersProps {
  projects: any[];
}

export function TopCustomers({ projects }: TopCustomersProps) {
  // Count projects per customer
  const customerCounts: Record<string, { count: number; customer: any }> = {};
  projects.forEach(project => {
    if (project.customer) {
      const customerId = project.customer.id;
      if (!customerCounts[customerId]) {
        customerCounts[customerId] = {
          count: 0,
          customer: project.customer
        };
      }
      customerCounts[customerId].count++;
    }
  });

  const topCustomers = Object.values(customerCounts)
    .sort((a, b) => b.count - a.count);

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-slate-50">Top Customers</CardTitle>
        <Link 
          href="/dashboard/customers"
          className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center gap-2 transition-colors group"
        >
          View all
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardHeader>
      <CardContent className="pt-6">
        {topCustomers.length === 0 ? (
          <div className="text-center py-12 h-[300px] flex items-center justify-center">
            <p className="text-slate-500 dark:text-slate-400 font-medium">No customers yet</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3 pr-4">
              {topCustomers.map((item, index) => (
                <div
                  key={item.customer.id}
                  className="group flex items-center justify-between p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-800/30 dark:to-transparent hover:from-purple-50/80 hover:to-purple-50/40 dark:hover:from-purple-950/20 dark:hover:to-transparent hover:border-purple-300 dark:hover:border-purple-700/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <div className="absolute inset-0 bg-purple-500 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                      <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-extrabold text-base shadow-md">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 dark:text-slate-50">
                        {item.customer.nama}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {item.customer.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <Badge className="px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    {item.count} {item.count === 1 ? 'project' : 'projects'}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

