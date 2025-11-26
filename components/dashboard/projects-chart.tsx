"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface ProjectsChartProps {
  data: any[];
}

const COLORS = ['#FA812F', '#FAB12F', '#f59e0b', '#f97316', '#ea580c'];

export function ProjectsByStatusChart({ data }: ProjectsChartProps) {
  const statusData = [
    { name: 'Active', value: data.filter(p => p.status_aktif).length },
    { name: 'Inactive', value: data.filter(p => !p.status_aktif).length },
  ];

  return (
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-50">Projects by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
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
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-50">Projects by AM</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis 
              dataKey="name" 
              className="text-slate-600 dark:text-slate-400"
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis className="text-slate-600 dark:text-slate-400" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="value" fill="#FA812F" radius={[8, 8, 0, 0]} />
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
    <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-900 dark:text-slate-50">Projects Trend (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
            <XAxis 
              dataKey="name" 
              className="text-slate-600 dark:text-slate-400"
            />
            <YAxis className="text-slate-600 dark:text-slate-400" />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey="value" fill="#FAB12F" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

