# Culinary Coach LMS — Culinary Entrepreneurship I · Level I · Oct 12 – Nov 7, 2026

One static page (`index.html`) + `netlify.toml`. Supabase is the backend. No build step.

## Deploy
Auto-deploy from GitHub — see `docs/DEPLOY.md`. (This folder is meant to be the root of its own repo; inside `learning-lms` it lives in `culinary-coach-lms/`.)

## Architecture (short)
`index.html` (static) → `validate-login` / `lms-api` Edge Functions (service role) → Postgres tables (`student_progress`, `submissions`, `student_access_codes`, …) and the private `submissions` bucket.
**The page holds no keys, codes or database access.** Details and test evidence: `docs/SECURITY.md`. Deploy flow: `docs/DEPLOY.md`.

## Before go-live
1. **Connect GitHub → Netlify** and turn on branch protection (`docs/DEPLOY.md`).
2. **Reset last cohort's progress.** The 8 names still have Apr–May progress in `student_progress`; students would see a finished course. Archive then reset (SQL in `supabase/seed.example.sql`).
3. **Replace the short access codes** (`docs/SECURITY.md` → "Still weak"). Remove the `TEST STUDENT` login when you no longer need it.
4. **Run `python3 tools/check-links.py`** from a normal connection, then work the checklist in `docs/`.
5. Confirm host kitchen/address and the Nov 6 final-deliverable deadline in the page text.

## How submissions work
* Assignments (type *Assignment* / *Final*): **Choose file → Submit**. The page asks `lms-api` for an upload slot (checks who you are, type, size), uploads the file straight to the private bucket at
  `{student-name}/{assignment-slug}/{filename}` (`-v2`, `-v3` if the name repeats — nothing is ever overwritten), then `lms-api` confirms the object exists and records it in `submissions`
  and in the student's progress. "Submitted" is shown only after that confirmation.
* Check-ins, study days and lab attendance stay one-click confirmations.
* Instructor: Student Tracker → **Submitted files** → Download (5-minute signed link) or Export Files CSV.
* Limits: 25 MB; PDF, Word, Excel, PowerPoint, CSV, text, PNG/JPG, ZIP.

## Tests
`npm i && node tools/e2e.mjs` — 100+ checks in headless Chromium against **mock** Edge Functions (login, gating, signed uploads, failure and
retry, session expiry, admin, no-direct-DB-calls, mobile widths). `BROWSER=firefox|webkit` after `npx playwright install firefox webkit`.
`tools/check-links.py` verifies every external link and YouTube video.

## Security
See `docs/SECURITY.md` for what is protected, what was tested, and what is still weak.
