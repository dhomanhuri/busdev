"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-slate-900 dark:text-slate-50">Top Customers</CardTitle>
        <Link 
          href="/dashboard/customers"
          className="text-sm text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        {topCustomers.length === 0 ? (
          <p className="text-center text-slate-600 dark:text-slate-400 py-4">No customers yet</p>
        ) : (
          <div className="space-y-4">
            {topCustomers.map((item, index) => (
              <div
                key={item.customer.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-slate-50">
                      {item.customer.nama}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {item.customer.description || 'No description'}
                    </p>
                  </div>
                </div>
                <Badge className="bg-orange-900 text-orange-200">
                  {item.count} {item.count === 1 ? 'project' : 'projects'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

