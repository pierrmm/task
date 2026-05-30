"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, Users, FileText, ArrowUpRight } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCandidates: 0,
    totalApplications: 0,
  });
  const [recentCandidates, setRecentCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for the chart since we don't have historical data in the DB yet
  const chartData = [
    { name: "Jan", hires: 4, applicants: 40 },
    { name: "Feb", hires: 3, applicants: 30 },
    { name: "Mar", hires: 2, applicants: 20 },
    { name: "Apr", hires: 7, applicants: 80 },
    { name: "May", hires: 5, applicants: 60 },
    { name: "Jun", hires: 9, applicants: 110 },
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: jobsCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true });

      const { data: candidatesData } = await supabase
        .from("candidates")
        .select("*, job:jobs(title)")
        .order("applied_at", { ascending: false });

      setStats({
        totalJobs: jobsCount || 0,
        totalCandidates: candidatesData?.length || 0,
        totalApplications: candidatesData?.length || 0,
      });

      setRecentCandidates(candidatesData?.slice(0, 5) || []);
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
    },
    {
      title: "Total Candidates",
      value: stats.totalCandidates,
      icon: Users,
      trend: "+4% from last month",
    },
    {
      title: "Active Applications",
      value: stats.totalApplications,
      icon: FileText,
      trend: "+18% from last month",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Overview</h1>
        <p className="text-sm text-zinc-500">Here's what's happening with your recruitment pipeline today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="overflow-hidden border-zinc-200 dark:border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-8 w-16 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded mt-1" />
              ) : (
                <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {stat.value}
                </div>
              )}
              <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-zinc-900 dark:text-zinc-50" />
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle>Hiring Activity</CardTitle>
            <CardDescription>Number of applicants vs hires over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#18181b', fontSize: '14px' }}
                />
                <Line type="monotone" dataKey="applicants" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="hires" stroke="#a1a1aa" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800">
          <CardHeader>
            <CardTitle>Recent Applicants</CardTitle>
            <CardDescription>You received {stats.totalApplications} applications this month.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-1/3 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                      <div className="h-3 w-1/2 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentCandidates.length === 0 ? (
              <div className="text-center text-sm text-zinc-500 py-10">
                No recent applicants found.
              </div>
            ) : (
              <div className="space-y-6">
                {recentCandidates.map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-9 w-9 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {candidate.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{candidate.name}</span>
                        <span className="text-xs text-zinc-500">{candidate.email}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{candidate.job?.title}</span>
                      <p className="text-xs text-zinc-500 capitalize">{candidate.stage}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
