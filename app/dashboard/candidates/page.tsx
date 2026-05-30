"use client";

import { useEffect, useState } from "react";
import { supabase, Candidate, Job, CandidateStage } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const stages: { id: CandidateStage; label: string; color: string; indicator: string }[] = [
    { id: "applied", label: "Applied", color: "bg-zinc-50 border-zinc-200 dark:bg-zinc-900/20 dark:border-zinc-800", indicator: "bg-blue-500" },
    { id: "interview", label: "Interview", color: "bg-zinc-50 border-zinc-200 dark:bg-zinc-900/20 dark:border-zinc-800", indicator: "bg-yellow-500" },
    { id: "hired", label: "Hired", color: "bg-zinc-50 border-zinc-200 dark:bg-zinc-900/20 dark:border-zinc-800", indicator: "bg-green-500" },
  ];

  return (
    <div className="space-y-6 h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Candidate Pipeline</h1>
          <p className="text-sm text-zinc-500">Track and manage candidates across different stages.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search candidates..."
              className="pl-9 bg-white dark:bg-zinc-950"
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
              <div className="p-4 border-b border-inherit flex justify-between items-center bg-white/50 dark:bg-zinc-950/50 rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${stage.indicator}`} />
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">{stage.label}</h3>
                </div>
                <Badge variant="secondary" className="bg-white/50 dark:bg-zinc-800">
                  {filteredCandidates.filter(c => c.stage === stage.id).length}
                </Badge>
              </div>
              
              <div className="p-3 flex-1 overflow-y-auto space-y-3">
                {loading ? (
                  <div className="h-24 bg-white dark:bg-zinc-950 rounded-lg animate-pulse" />
                ) : (
                  filteredCandidates
                    .filter((c) => c.stage === stage.id)
                    .map((candidate) => (
                      <div 
                        key={candidate.id} 
                        className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-grab active:cursor-grabbing hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-sm font-medium text-zinc-600 dark:text-zinc-300">
                              {candidate.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">{candidate.name}</h4>
                              <p className="text-xs text-zinc-500 font-medium">{candidate.job?.title}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-2">
                            <MoreHorizontal className="w-4 h-4 text-zinc-400" />
                          </Button>
                        </div>
                        
                        <div className="space-y-1.5 mb-4">
                          <div className="flex items-center text-xs text-zinc-500 gap-2">
                            <Mail className="w-3.5 h-3.5" /> <span className="truncate">{candidate.email}</span>
                          </div>
                          {candidate.phone && (
                            <div className="flex items-center text-xs text-zinc-500 gap-2">
                              <Phone className="w-3.5 h-3.5" /> <span>{candidate.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center text-xs text-zinc-500 gap-2">
                            <Clock className="w-3.5 h-3.5" /> 
                            <span>{new Date(candidate.applied_at).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Select 
                            value={candidate.stage} 
                            onValueChange={(val) => updateCandidateStage(candidate.id, val as CandidateStage)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue placeholder="Move to..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="applied">Move to Applied</SelectItem>
                              <SelectItem value="interview">Move to Interview</SelectItem>
                              <SelectItem value="hired">Move to Hired</SelectItem>
                            </SelectContent>
                          </Select>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-950 rounded-xl shadow-lg w-full max-w-md overflow-hidden border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Add Candidate</h2>
                <p className="text-sm text-zinc-500">Manually add a candidate to the pipeline.</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleAddCandidate} className="p-6 space-y-4 text-zinc-950 dark:text-zinc-50">
              <div className="space-y-2">
                <label className="text-sm font-medium">Candidate Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
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
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
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
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
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
                <Select
                  value={newCandidate.job_id}
                  onValueChange={(val) => setNewCandidate({ ...newCandidate, job_id: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.title}
                      </SelectItem>
                    ))}
                    {jobs.length === 0 && <SelectItem value="">No open jobs available</SelectItem>}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800 mt-6">
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
