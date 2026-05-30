-- =============================================
-- RecruitPro - Supabase Database Setup
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'full-time',
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'draft')),
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidates Table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  stage TEXT NOT NULL DEFAULT 'applied' CHECK (stage IN ('applied', 'interview', 'hired')),
  notes TEXT DEFAULT '',
  applied_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (required by Supabase)
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

-- Allow public access (for demo purposes)
CREATE POLICY "Allow all access to jobs" ON jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to candidates" ON candidates FOR ALL USING (true) WITH CHECK (true);

-- Seed Data: Jobs
INSERT INTO jobs (title, department, location, type, status, description) VALUES
  ('Senior Frontend Developer', 'Engineering', 'Jakarta, ID', 'full-time', 'open', 'We are looking for an experienced Frontend Developer proficient in React, Next.js, and TypeScript to join our growing engineering team.'),
  ('Product Designer', 'Design', 'Bandung, ID', 'full-time', 'open', 'Join our design team to create beautiful and intuitive user experiences for our SaaS platform.'),
  ('Backend Engineer', 'Engineering', 'Remote', 'full-time', 'open', 'Build scalable backend services using Node.js, PostgreSQL, and cloud infrastructure.'),
  ('Marketing Manager', 'Marketing', 'Jakarta, ID', 'full-time', 'open', 'Lead our marketing efforts to drive growth and brand awareness in the Southeast Asian market.'),
  ('DevOps Engineer', 'Engineering', 'Remote', 'contract', 'open', 'Manage our cloud infrastructure, CI/CD pipelines, and ensure high availability of our services.'),
  ('Data Analyst', 'Data', 'Surabaya, ID', 'full-time', 'draft', 'Analyze recruitment metrics and provide insights to improve our hiring process.'),
  ('HR Coordinator', 'Human Resources', 'Jakarta, ID', 'part-time', 'closed', 'Coordinate recruitment activities, schedule interviews, and manage candidate communications.');

-- Seed Data: Candidates
INSERT INTO candidates (name, email, phone, job_id, stage, notes) VALUES
  ('Andi Pratama', 'andi.pratama@email.com', '+62 812-3456-7890', (SELECT id FROM jobs WHERE title = 'Senior Frontend Developer' LIMIT 1), 'interview', 'Strong React experience. 5 years in frontend development.'),
  ('Siti Nurhaliza', 'siti.n@email.com', '+62 813-1234-5678', (SELECT id FROM jobs WHERE title = 'Product Designer' LIMIT 1), 'applied', 'Portfolio looks great. Figma expert.'),
  ('Budi Santoso', 'budi.s@email.com', '+62 817-9876-5432', (SELECT id FROM jobs WHERE title = 'Senior Frontend Developer' LIMIT 1), 'applied', 'Fresh graduate but shows strong potential.'),
  ('Dewi Lestari', 'dewi.l@email.com', '+62 821-5555-1234', (SELECT id FROM jobs WHERE title = 'Backend Engineer' LIMIT 1), 'hired', 'Excellent Node.js skills. Strong system design knowledge.'),
  ('Rizky Hakim', 'rizky.h@email.com', '+62 856-7777-8888', (SELECT id FROM jobs WHERE title = 'Marketing Manager' LIMIT 1), 'interview', '8 years marketing experience. Led campaigns for major brands.'),
  ('Maya Putri', 'maya.p@email.com', '+62 878-2222-3333', (SELECT id FROM jobs WHERE title = 'DevOps Engineer' LIMIT 1), 'applied', 'AWS certified. Kubernetes experience.'),
  ('Fajar Rahman', 'fajar.r@email.com', '+62 815-4444-9999', (SELECT id FROM jobs WHERE title = 'Product Designer' LIMIT 1), 'interview', 'Great UI/UX skills. Previously at a fintech startup.'),
  ('Indah Permata', 'indah.p@email.com', '+62 838-6666-1111', (SELECT id FROM jobs WHERE title = 'Backend Engineer' LIMIT 1), 'applied', 'Go and Python developer. Interested in transitioning to Node.js.');
