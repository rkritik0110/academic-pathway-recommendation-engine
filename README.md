# Academic Pathway Recommendation Engine

A production-ready web application that collects user profiles, generates academic/career pathway recommendations using a deterministic rules-based engine, stores every submission in Supabase, and displays previous submissions on a public admin-style page.


---

## Features

- Profile form with validation using Zod and React Hook Form
- Rules-based recommendation engine
- Four pathway outcomes:
  - Certification Program
  - DBA
  - PhD
  - Honorary Doctorate
- Supabase database integration for persistent storage
- Public `/submissions` page for viewing stored entries
- Searchable submissions table
- Tooltip support for long career goals
- Toast notifications for success and error states
- Loading indicators and skeleton states
- Responsive UI for mobile and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |

---

## Recommendation Logic

The application evaluates the following user inputs:

- Highest Qualification
- Years of Work Experience
- Current Profession
- Career Goal

Based on these factors, it assigns one of the following recommendations:

- Certification Program
- DBA
- PhD
- Honorary Doctorate

Each recommendation includes a short explanation so the user understands why that pathway was suggested.

---

## Supabase Setup

### Prerequisite
Create a free Supabase account at `supabase.com`.

### 1) Create a New Project
1. Go to the Supabase dashboard.
2. Click **New Project**.
3. Enter a project name.
4. Set a strong database password.
5. Choose your preferred region.
6. Wait for the project to finish provisioning.

### 2) Create the Database Table
Open **SQL Editor** and run the following SQL:

```sql
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  qualification TEXT NOT NULL,
  experience INTEGER NOT NULL CHECK (experience >= 0 AND experience <= 60),
  profession TEXT NOT NULL,
  career_goal TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submissions_created_at
ON submissions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_submissions_email
ON submissions (email);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts"
ON submissions
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow anonymous reads"
ON submissions
FOR SELECT
USING (true);