"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProjectsChartProps {
  data: any[];
}


export function ProjectsByStatusChart({ data }: ProjectsChartProps) {
  // Group projects by customer
  const customerCounts: Record<string, number> = {};
  data.forEach(project => {
    const customerName = project.customer?.nama || 'No Customer';
    customerCounts[customerName] = (customerCounts[customerName] || 0) + 1;
  });

  const chartData = Object.entries(customerCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 customers

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-slate-50">Top Customers by Projects</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
            <XAxis type="number" tick={{ fill: 'rgb(71, 85, 105)' }} />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fill: 'rgb(71, 85, 105)' }}
              width={120}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(226, 232, 240, 0.6)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="value" fill="#FA812F" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ProjectsByAMChart({ data }: ProjectsChartProps) {
  // Group projects by AM/Sales
  const amCounts: Record<string, number> = {};
  data.forEach(project => {
    const amName = project.sales?.nama_lengkap || 'Unassigned';
    amCounts[amName] = (amCounts[amName] || 0) + 1;
  });

  const chartData = Object.entries(amCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-slate-50">Projects by AM</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'rgb(71, 85, 105)' }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis tick={{ fill: 'rgb(71, 85, 105)' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(226, 232, 240, 0.6)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="value" fill="#FA812F" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ProjectsByAMRevenueChart({ data }: ProjectsChartProps) {
  // Group revenue by AM/Sales
  const amRevenue: Record<string, number> = {};
  data.forEach(project => {
    const amName = project.sales?.nama_lengkap || 'Unassigned';
    const revenue = project.nilai_project || 0;
    amRevenue[amName] = (amRevenue[amName] || 0) + revenue;
  });

  const chartData = Object.entries(amRevenue)
    .map(([name, value]) => ({ 
      name, 
      value: value / 1000000, // Convert to millions for better readability
      valueFormatted: value 
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact',
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-lg">
          <p className="font-semibold text-slate-900 dark:text-slate-50 mb-1">{payload[0].payload.name}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Revenue: <span className="font-bold text-orange-600 dark:text-orange-400">{formatCurrency(payload[0].payload.valueFormatted)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-slate-50">Revenue by AM</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
            <XAxis 
              type="number" 
              tick={{ fill: 'rgb(71, 85, 105)' }}
              tickFormatter={(value) => `${value}M`}
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              tick={{ fill: 'rgb(71, 85, 105)' }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#4FD1C5" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ProjectsTrendChart({ data }: ProjectsChartProps) {
  // Group projects by month
  const monthlyCounts: Record<string, number> = {};
  data.forEach(project => {
    if (project.created_at) {
      const date = new Date(project.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
    }
  });

  const chartData = Object.entries(monthlyCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(-6); // Last 6 months

  return (
    <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
        <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-slate-50">Projects Trend (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.3)" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'rgb(71, 85, 105)' }}
            />
            <YAxis tick={{ fill: 'rgb(71, 85, 105)' }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(226, 232, 240, 0.6)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar dataKey="value" fill="#FAB12F" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

