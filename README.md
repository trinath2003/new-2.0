# Smart Skill Opportunity
Skill-first job portal (Node.js + Express + MySQL + vanilla JS).

## Run locally
1. `mysql -u root -p -e "CREATE DATABASE smart_skill"`
2. `cp .env.example .env` and fill values (or export them as env vars)
3. `npm install && npm start` → http://localhost:3000

Tables and 4 sample jobs are created automatically on first start.
Deploys on Railway as-is (reads MYSQL* variables).

## What's different from Naukri
- Seekers list skills once; every job shows **match %**, matched skills (green) and missing skills (red); results sorted by match.
- Employers list required skills; applicants are **ranked by match score** and can be Shortlisted / Rejected / Hired.
