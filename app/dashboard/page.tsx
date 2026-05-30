"use client";

import { useState, useEffect } from "react";
import { supabase, Candidate } from "@/lib/supabase";
import Link from "next/link";

interface Stats {
  totalJobs: number;
  totalCandidates: number;
  totalApplications: number;
  openJobs: number;
  applied: number;
  interview: number;
  hired: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalJobs: 0,
    totalCandidates: 0,
    totalApplications: 0,
    openJobs: 0,
    applied: 0,
    interview: 0,
    hired: 0,
  });
  const [recentCandidates, setRecentCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [
        { count: totalJobs },
        { count: openJobs },
        { count: totalCandidates },
        { count: applied },
        { count: interview },
        { count: hired },
        { data: recent },
      ] = await Promise.all([
        supabase.from("jobs").select("*", { count: "exact", head: true }),
        supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "open"),
        supabase.from("candidates").select("*", { count: "exact", head: true }),
        supabase.from("candidates").select("*", { count: "exact", head: true }).eq("stage", "applied"),
        supabase.from("candidates").select("*", { count: "exact", head: true }).eq("stage", "interview"),
        supabase.from("candidates").select("*", { count: "exact", head: true }).eq("stage", "hired"),
        supabase.from("candidates").select("*, job:jobs(title)").order("applied_at", { ascending: false }).limit(5),
      ]);

      setStats({
        totalJobs: totalJobs || 0,
        totalCandidates: totalCandidates || 0,
        totalApplications: totalCandidates || 0,
        openJobs: openJobs || 0,
        applied: applied || 0,
        interview: interview || 0,
        hired: hired || 0,
      });
      setRecentCandidates(recent || []);
      setLoading(false);
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Jobs",
      value: stats.totalJobs,
      change: `${stats.openJobs} open`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-blue-500 to-cyan-500",
      bgGlow: "bg-blue-500/20",
    },
    {
      label: "Total Candidates",
      value: stats.totalCandidates,
      change: `${stats.interview} in interview`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-500",
      bgGlow: "bg-purple-500/20",
    },
    {
      label: "Total Applications",
      value: stats.totalApplications,
      change: `${stats.applied} pending`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: "from-amber-500 to-orange-500",
      bgGlow: "bg-amber-500/20",
    },
    {
      label: "Hired",
      value: stats.hired,
      change: "Total hires",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: "from-emerald-500 to-teal-500",
      bgGlow: "bg-emerald-500/20",
    },
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "applied": return "bg-blue-500/15 text-blue-400";
      case "interview": return "bg-amber-500/15 text-amber-400";
      case "hired": return "bg-emerald-500/15 text-emerald-400";
      default: return "bg-slate-500/15 text-slate-400";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome back! Here&apos;s your recruitment summary.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="relative bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-5 overflow-hidden hover:bg-white/[0.07] transition-all duration-300 group"
          >
            <div className={`absolute -top-8 -right-8 w-24 h-24 ${card.bgGlow} rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-300`} />
            <div className="relative">
              <div className={`w-10 h-10 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                <div className="text-white">{card.icon}</div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="text-xs text-slate-500 mt-1">{card.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Overview & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Candidate Pipeline</h2>
            <Link href="/dashboard/candidates" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { stage: "Applied", count: stats.applied, color: "bg-blue-500", total: stats.totalCandidates },
              { stage: "Interview", count: stats.interview, color: "bg-amber-500", total: stats.totalCandidates },
              { stage: "Hired", count: stats.hired, color: "bg-emerald-500", total: stats.totalCandidates },
            ].map((item) => (
              <div key={item.stage}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300">{item.stage}</span>
                  <span className="text-sm font-medium text-white">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Candidates */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Recent Candidates</h2>
            <Link href="/dashboard/candidates" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
              View all →
            </Link>
          </div>
          {recentCandidates.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No candidates yet.</p>
          ) : (
            <div className="space-y-3">
              {recentCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {candidate.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{candidate.name}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {candidate.job?.title || "No job assigned"}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStageColor(candidate.stage)}`}>
                    {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
