# RecruitPro - Mini Recruitment Dashboard

A modern, responsive recruitment management dashboard built with Next.js 16, Supabase, and Tailwind CSS 4.

![RecruitPro Dashboard](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-blue?style=for-the-badge&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## 🚀 Live Demo

**[Live Demo on Vercel →]()**

### Demo Credentials
- **Email:** `admin@recruiter.com`
- **Password:** `password123`

## ✨ Features

### 1. Login Page (Dummy Auth)
- Email & password authentication
- Glassmorphic UI with animated background
- Client-side auth with localStorage
- Auto-redirect to dashboard on success

### 2. Dashboard Overview
- **Total Jobs** - Count of all job listings
- **Total Candidates** - Count of all candidates
- **Total Applications** - Count of all applications
- **Hired** - Count of hired candidates
- Pipeline progress visualization
- Recent candidates activity feed

### 3. Job Management
- ✅ List all jobs with details
- ✅ Search jobs by title, department, or location
- ✅ Filter by status (Open, Closed, Draft)
- ✅ Add new job with modal form
- ✅ Delete jobs

### 4. Candidate Pipeline (Kanban)
- 🔵 **Applied** - New applications
- 🟡 **Interview** - In interview process
- 🟢 **Hired** - Successfully hired
- Move candidates between stages
- Add new candidates with job assignment

### 5. UI/UX
- 🌙 Dark theme with modern SaaS design
- 📱 Fully responsive (mobile, tablet, desktop)
- ✨ Glassmorphism & gradient effects
- 🎨 Smooth animations & transitions
- 📊 Clean Kanban-style pipeline view

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript 5** | Type safety |
| **Tailwind CSS 4** | Utility-first CSS |
| **Supabase** | PostgreSQL database & API |
| **Vercel** | Deployment platform |

## 📁 Project Structure

```
interview/
├── app/
│   ├── layout.tsx              # Root layout with fonts & metadata
│   ├── page.tsx                # Home (redirects to /login)
│   ├── globals.css             # Global styles & theme
│   ├── login/
│   │   └── page.tsx            # Login page (dummy auth)
│   └── dashboard/
│       ├── layout.tsx          # Dashboard layout (sidebar + topbar)
│       ├── page.tsx            # Dashboard overview with stats
│       ├── jobs/
│       │   └── page.tsx        # Job management (CRUD + search/filter)
│       └── candidates/
│           └── page.tsx        # Candidate pipeline (Kanban board)
├── lib/
│   └── supabase.ts             # Supabase client & TypeScript types
├── supabase-setup.sql          # Database schema & seed data
├── .env.local                  # Environment variables (not committed)
├── .env.example                # Environment variables template
└── package.json                # Dependencies & scripts
```

## 🔧 Setup Instructions

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd interview
npm install
```

### 2. Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** and paste the contents of `supabase-setup.sql`
3. Click **Run** to create tables and seed data
4. Go to **Settings > API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configure Environment Variables
```bash
cp .env.example .env.local
```
Fill in your Supabase credentials in `.env.local`

### 4. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel
```bash
npx vercel
```
Set environment variables in Vercel dashboard under **Settings > Environment Variables**.

## 📝 License

This project was created as a recruitment assessment submission.
# task
