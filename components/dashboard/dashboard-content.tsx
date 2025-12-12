"use client";

import { StatsCard } from "@/components/dashboard/stats-card";
import { ProjectsByStatusChart, ProjectsByAMChart, ProjectsByAMRevenueChart, ProjectsTrendChart, TopCustomersByRevenueChart } from "@/components/dashboard/projects-chart";
import { RecentProjects } from "@/components/dashboard/recent-projects";
import { TopCustomers } from "@/components/dashboard/top-customers";
import { DraggableDashboard } from "./draggable-dashboard";

interface DashboardContentProps {
  userProfile: any;
  projects: any[];
  filteredProjects: any[];
  totalProjects: number;
  totalCustomers: number;
  totalProducts: number;
  totalUsers: number;
}

export function DashboardContent({
  userProfile,
  projects,
  filteredProjects,
  totalProjects,
  totalCustomers,
  totalProducts,
  totalUsers,
}: DashboardContentProps) {
  const statsCards = [
    <StatsCard
      key="stats-0"
      title="Total Projects"
      value={userProfile.role === 'Admin' || userProfile.role === 'GM' ? totalProjects : filteredProjects.length}
      icon="projects"
      description="All projects"
    />,
    <StatsCard
      key="stats-1"
      title="Customers"
      value={totalCustomers}
      icon="customers"
      description="Active customers"
    />,
    <StatsCard
      key="stats-2"
      title="Products"
      value={totalProducts}
      icon="products"
      description="Active products"
    />,
    <StatsCard
      key="stats-3"
      title="Users"
      value={totalUsers}
      icon="users"
      description="Active users"
    />,
  ];

  const charts = [
    <ProjectsByStatusChart
      key="chart-0"
      data={userProfile.role === 'Admin' || userProfile.role === 'GM' ? projects : filteredProjects}
    />,
    <ProjectsByAMChart
      key="chart-1"
      data={userProfile.role === 'Admin' || userProfile.role === 'GM' ? projects : filteredProjects}
    />,
    <ProjectsByAMRevenueChart
      key="chart-2"
      data={userProfile.role === 'Admin' || userProfile.role === 'GM' ? projects : filteredProjects}
    />,
    <TopCustomersByRevenueChart
      key="chart-3"
      data={userProfile.role === 'Admin' || userProfile.role === 'GM' ? projects : filteredProjects}
    />,
    <ProjectsTrendChart
      key="chart-4"
      data={userProfile.role === 'Admin' || userProfile.role === 'GM' ? projects : filteredProjects}
    />,
  ];

  const lists = [
    <RecentProjects
      key="list-0"
      projects={filteredProjects}
    />,
    <TopCustomers
      key="list-1"
      projects={userProfile.role === 'Admin' || userProfile.role === 'GM' ? projects : filteredProjects}
    />,
  ];

  return (
    <DraggableDashboard
      statsCards={statsCards}
      charts={charts}
      lists={lists}
    />
  );
}
