import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createBrowserClient(supabaseUrl, supabaseKey);

// Types
export type JobStatus = "open" | "closed" | "draft";

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string; // full-time, part-time, contract
  status: JobStatus;
  description: string;
  created_at: string;
}

export type CandidateStage = "applied" | "interview" | "hired";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  job_id: string;
  stage: CandidateStage;
  applied_at: string;
  notes: string;
  job?: Job;
}
