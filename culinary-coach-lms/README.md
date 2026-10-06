# Culinary Coach LMS — Culinary Entrepreneurship I · Level I · Oct 12 – Nov 7, 2026

One static page (`index.html`) + `netlify.toml`. Supabase is the backend. No build step.

## Deploy
Zip **the contents of this folder's root** (`index.html` + `netlify.toml`, not the folder) and drop it on Netlify, or point
Netlify at this repo with *Base directory* = `culinary-coach-lms`. (The repo root holds a different app.)

## Before go-live — three things only you can do
1. **Apply the storage migration** `supabase/migrations/0002_submissions_bucket.sql` (Supabase → SQL editor). Until it runs,
   uploads fail with "Uploads are not switched on yet" and nothing is recorded as submitted.
2. **Confirm the roster** in the `STUDENTS` array (search `const STUDENTS`). It still holds the 8 names/codes `CE2026A–H`
   and `TEST STUDENT`/`TEST0000` — delete the test login for go-live.
3. **Run `python3 tools/check-links.py`** from a machine with normal internet, then work the checklist in `docs/`.

## How submissions work
* Assignments (type *Assignment* / *Final*) show **Choose file → Submit**. The file uploads to the private Supabase Storage bucket
  `submissions` at `<student>/<assignment>/<timestamp>-<file>`; only then is it recorded in `student_progress.deliverables`
  (`fileName, fileSize, fileType, filePath, date, attempts`). No schema change — `deliverables` is already jsonb.
* Check-ins, study days and lab attendance stay one-click confirmations.
* Resubmitting uploads a new object (nothing is overwritten) and bumps `attempts`.
* The bucket is write-only for the public key: no list/read/overwrite/delete. Instructors open files from
  **Supabase → Storage → submissions**; the Student Tracker has a *Submitted files* table and **Export Files CSV** with each path.
* Limits: 25 MB; PDF, Word, Excel, PowerPoint, CSV, text, PNG/JPG, ZIP.

## Tests
`npm i && node tools/e2e.mjs` — 80 checks in headless Chromium against a **mock** Supabase (login, gating, uploads, failure and
retry, offline-login safety, admin, mobile widths). `BROWSER=firefox|webkit` after `npx playwright install firefox webkit`.
`tools/check-links.py` verifies every external link and YouTube video.

## Known security limits (pre-existing, not changed here)
* Access codes and `ADMIN2026` are in the page source — anyone can read them.
* `public.student_progress` has an `Allow all access` RLS policy and `anon` holds INSERT/UPDATE/DELETE/TRUNCATE, so anyone with
  the page's public key can read or wipe every student's progress. Fixing it needs a server-side login (Edge Function or Supabase Auth).
