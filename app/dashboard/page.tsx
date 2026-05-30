"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Users, FileText, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    totalApplications: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: jobsCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true });

      const { count: candidatesCount } = await supabase
        .from("candidates")
        .select("*", { count: "exact", head: true });

      setStats({
        totalJobs: jobsCount || 0,
        totalCandidates: candidatesCount || 0,
        totalApplications: candidatesCount || 0, // Using candidates count as applications for this demo
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: Briefcase,
      trend: "+12% from last month",
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Candidates",
      value: stats.totalCandidates,
      icon: Users,
      trend: "+4% from last month",
      color: "text-indigo-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    },
    {
      title: "Active Applications",
      value: stats.totalApplications,
      icon: FileText,
      trend: "+18% from last month",
      color: "text-emerald-500",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Overview</h1>
        <p className="text-slate-500 mt-2">Here's what's happening with your recruitment pipeline today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded mt-1" />
              ) : (
                <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                  {stat.value}
                </div>
              )}
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for future charts or recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-96 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/20 border-dashed">
          <div className="text-center text-slate-500">
            <Briefcase className="h-8 w-8 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">Hiring Activity Chart</p>
            <p className="text-xs opacity-70">Coming soon in next update</p>
          </div>
        </Card>
        <Card className="h-96 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/20 border-dashed">
          <div className="text-center text-slate-500">
            <Users className="h-8 w-8 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">Recent Applicants</p>
            <p className="text-xs opacity-70">Coming soon in next update</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
