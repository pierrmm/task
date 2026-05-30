"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, Candidate, CandidateStage, Job } from "@/lib/supabase";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    job_id: "",
    stage: "applied" as CandidateStage,
    notes: "",
  });

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("candidates")
      .select("*, job:jobs(title)")
      .order("applied_at", { ascending: false });

    if (error) {
      console.error("Error fetching candidates:", error);
    } else {
      setCandidates(data || []);
    }
    setLoading(false);
  }, []);

  const fetchJobs = useCallback(async () => {
    const { data } = await supabase.from("jobs").select("*").eq("status", "open").order("title");
    setJobs(data || []);
  }, []);

  useEffect(() => {
    fetchCandidates();
    fetchJobs();
  }, [fetchCandidates, fetchJobs]);

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("candidates").insert([newCandidate]);
    if (error) {
      console.error("Error adding candidate:", error);
      alert("Failed to add candidate.");
    } else {
      setShowAddModal(false);
      setNewCandidate({ name: "", email: "", phone: "", job_id: "", stage: "applied", notes: "" });
      fetchCandidates();
    }
    setSaving(false);
  };

  const moveCandidate = async (id: string, newStage: CandidateStage) => {
    const { error } = await supabase.from("candidates").update({ stage: newStage }).eq("id", id);
    if (error) {
      console.error("Error moving candidate:", error);
    } else {
      setCandidates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, stage: newStage } : c))
      );
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    if (!confirm("Remove this candidate?")) return;
    const { error } = await supabase.from("candidates").delete().eq("id", id);
    if (error) {
      console.error("Error deleting:", error);
    } else {
      fetchCandidates();
    }
  };

  const stages: { key: CandidateStage; label: string; color: string; bgColor: string; iconColor: string }[] = [
    { key: "applied", label: "Applied", color: "border-blue-500/30", bgColor: "bg-blue-500/10", iconColor: "text-blue-400" },
    { key: "interview", label: "Interview", color: "border-amber-500/30", bgColor: "bg-amber-500/10", iconColor: "text-amber-400" },
    { key: "hired", label: "Hired", color: "border-emerald-500/30", bgColor: "bg-emerald-500/10", iconColor: "text-emerald-400" },
  ];

  const getNextStage = (current: CandidateStage): CandidateStage | null => {
    if (current === "applied") return "interview";
    if (current === "interview") return "hired";
    return null;
  };

  const getPrevStage = (current: CandidateStage): CandidateStage | null => {
    if (current === "hired") return "interview";
    if (current === "interview") return "applied";
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Candidate Pipeline</h1>
          <p className="text-slate-400 text-sm mt-1">Track and manage candidates through the hiring process</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-indigo-500/25 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Candidate
        </button>
      </div>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {stages.map((stage) => {
          const stageCandidates = candidates.filter((c) => c.stage === stage.key);
          return (
            <div key={stage.key} className="flex flex-col">
              {/* Column Header */}
              <div className={`flex items-center gap-3 mb-4 pb-3 border-b-2 ${stage.color}`}>
                <div className={`w-8 h-8 ${stage.bgColor} rounded-lg flex items-center justify-center`}>
                  <span className={`text-sm font-bold ${stage.iconColor}`}>{stageCandidates.length}</span>
                </div>
                <h2 className="text-base font-semibold text-white">{stage.label}</h2>
              </div>

              {/* Candidate Cards */}
              <div className="space-y-3 flex-1">
                {stageCandidates.length === 0 ? (
                  <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-2xl">
                    <p className="text-slate-600 text-sm">No candidates</p>
                  </div>
                ) : (
                  stageCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-xl p-4 hover:bg-white/[0.07] transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {candidate.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{candidate.name}</p>
                          <p className="text-xs text-slate-500 truncate">{candidate.email}</p>
                          {candidate.job?.title && (
                            <p className="text-xs text-indigo-400 mt-1 truncate">
                              {candidate.job.title}
                            </p>
                          )}
                          {candidate.notes && (
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2">{candidate.notes}</p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                        <div className="flex gap-1">
                          {getPrevStage(candidate.stage) && (
                            <button
                              onClick={() => moveCandidate(candidate.id, getPrevStage(candidate.stage)!)}
                              className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all text-xs cursor-pointer"
                              title={`Move to ${getPrevStage(candidate.stage)}`}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                          )}
                          {getNextStage(candidate.stage) && (
                            <button
                              onClick={() => moveCandidate(candidate.id, getNextStage(candidate.stage)!)}
                              className="p-1.5 text-slate-500 hover:text-white hover:bg-white/10 rounded-lg transition-all text-xs cursor-pointer"
                              title={`Move to ${getNextStage(candidate.stage)}`}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteCandidate(candidate.id)}
                          className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Add New Candidate</h2>
                <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-500 hover:text-white cursor-pointer">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleAddCandidate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={newCandidate.name}
                  onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                    placeholder="john@email.com"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={newCandidate.phone}
                    onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                    placeholder="+62 812..."
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Applied for Job</label>
                <select
                  value={newCandidate.job_id}
                  onChange={(e) => setNewCandidate({ ...newCandidate, job_id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                  required
                >
                  <option value="" className="bg-slate-900">Select a job...</option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id} className="bg-slate-900">{job.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Stage</label>
                <select
                  value={newCandidate.stage}
                  onChange={(e) => setNewCandidate({ ...newCandidate, stage: e.target.value as CandidateStage })}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer"
                >
                  <option value="applied" className="bg-slate-900">Applied</option>
                  <option value="interview" className="bg-slate-900">Interview</option>
                  <option value="hired" className="bg-slate-900">Hired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Notes</label>
                <textarea
                  value={newCandidate.notes}
                  onChange={(e) => setNewCandidate({ ...newCandidate, notes: e.target.value })}
                  placeholder="Add any notes about this candidate..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-white/5 border border-white/10 text-slate-300 font-medium text-sm rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 disabled:opacity-50 shadow-lg shadow-indigo-500/25 cursor-pointer"
                >
                  {saving ? "Saving..." : "Add Candidate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
