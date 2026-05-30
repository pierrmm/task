"use client";

import { useEffect, useState } from "react";
import { supabase, Candidate, Job, CandidateStage } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MoreHorizontal, Mail, Phone, Clock, User, X } from "lucide-react";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    job_id: "",
    stage: "applied" as CandidateStage,
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [candidatesRes, jobsRes] = await Promise.all([
        supabase.from("candidates").select("*, job:jobs(*)").order("applied_at", { ascending: false }),
        supabase.from("jobs").select("*").eq("status", "open"),
      ]);

      if (candidatesRes.data) setCandidates(candidatesRes.data as any[]);
      if (jobsRes.data) setJobs(jobsRes.data);
      
      if (jobsRes.data && jobsRes.data.length > 0 && !newCandidate.job_id) {
        setNewCandidate((prev) => ({ ...prev, job_id: jobsRes.data[0].id }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("candidates").insert([{
      name: newCandidate.name,
      email: newCandidate.email,
      phone: newCandidate.phone,
      job_id: newCandidate.job_id,
      stage: newCandidate.stage,
      notes: newCandidate.notes
    }]);
    
    if (error) {
      console.error("Error adding candidate:", error);
      alert("Failed to add candidate.");
    } else {
      setIsModalOpen(false);
      setNewCandidate({ ...newCandidate, name: "", email: "", phone: "", notes: "" });
      fetchData();
    }
    setSaving(false);
  };

  const updateCandidateStage = async (id: string, stage: CandidateStage) => {
    const { error } = await supabase.from("candidates").update({ stage }).eq("id", id);
    if (!error) {
      setCandidates(candidates.map(c => c.id === id ? { ...c, stage } : c));
    }
  };

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.job?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stages: { id: CandidateStage; label: string; color: string }[] = [
    { id: "applied", label: "Applied", color: "bg-slate-100 border-slate-200 dark:bg-slate-800/50 dark:border-slate-800" },
    { id: "interview", label: "Interview", color: "bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/50" },
    { id: "hired", label: "Hired", color: "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/50" },
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Candidate Pipeline</h1>
          <p className="text-sm text-slate-500">Track and manage candidates across different stages.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search candidates..."
              className="pl-9 bg-white dark:bg-slate-950"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-6 h-full min-w-max pb-4">
          {stages.map((stage) => (
            <div key={stage.id} className={`w-80 rounded-xl border flex flex-col ${stage.color}`}>
              <div className="p-4 border-b border-inherit flex justify-between items-center bg-white/50 dark:bg-slate-950/50 rounded-t-xl">
                <h3 className="font-semibold text-slate-900 dark:text-slate-50">{stage.label}</h3>
                <Badge variant="secondary" className="bg-white/50 dark:bg-slate-800">
                  {filteredCandidates.filter(c => c.stage === stage.id).length}
                </Badge>
              </div>
              
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {loading ? (
                  <div className="h-24 bg-white dark:bg-slate-950 rounded-lg animate-pulse" />
                ) : (
                  filteredCandidates
                    .filter((c) => c.stage === stage.id)
                    .map((candidate) => (
                      <div 
                        key={candidate.id} 
                        className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm cursor-grab active:cursor-grabbing hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-medium text-slate-600 dark:text-slate-300">
                              {candidate.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-50">{candidate.name}</h4>
                              <p className="text-xs text-slate-500 font-medium">{candidate.job?.title}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
                            <MoreHorizontal className="w-4 h-4 text-slate-400" />
                          </Button>
                        </div>
                        
                        <div className="space-y-1.5 mb-4">
                          <div className="flex items-center text-xs text-slate-500 gap-2">
                            <Mail className="w-3.5 h-3.5" /> <span className="truncate">{candidate.email}</span>
                          </div>
                          {candidate.phone && (
                            <div className="flex items-center text-xs text-slate-500 gap-2">
                              <Phone className="w-3.5 h-3.5" /> <span>{candidate.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center text-xs text-slate-500 gap-2">
                            <Clock className="w-3.5 h-3.5" /> 
                            <span>{new Date(candidate.applied_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <select
                            className="w-full h-8 text-xs px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-950 dark:focus:ring-slate-300"
                            value={candidate.stage}
                            onChange={(e) => updateCandidateStage(candidate.id, e.target.value as CandidateStage)}
                          >
                            <option value="applied">Move to Applied</option>
                            <option value="interview">Move to Interview</option>
                            <option value="hired">Move to Hired</option>
                          </select>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-950 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-lg font-semibold">Add Candidate</h2>
                <p className="text-sm text-slate-500">Manually add a candidate to the pipeline.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleAddCandidate} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Candidate Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    required
                    className="pl-9"
                    value={newCandidate.name}
                    onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="email"
                    required
                    className="pl-9"
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    className="pl-9"
                    value={newCandidate.phone}
                    onChange={(e) => setNewCandidate({ ...newCandidate, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="space-y-2 flex flex-col">
                <label className="text-sm font-medium">Applied For</label>
                <select
                  className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 dark:border-slate-800 dark:bg-slate-950"
                  required
                  value={newCandidate.job_id}
                  onChange={(e) => setNewCandidate({ ...newCandidate, job_id: e.target.value })}
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                  {jobs.length === 0 && <option value="">No open jobs available</option>}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving || jobs.length === 0}>
                  {saving ? "Saving..." : "Add Candidate"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
