# Security model — what changed, what was tested, what is still weak

## Before → after
| | Before | After |
|---|---|---|
| Access codes | Hard-coded JS array in the page | bcrypt hashes in `student_access_codes`; checked by `validate-login` |
| Admin code | In the page source | A row in the same table with `is_admin`; checked server-side |
| Database access | Public anon key, `Allow all access` RLS, anon had INSERT/UPDATE/DELETE/TRUNCATE | Anon has **no rights** on any LMS table; page holds **no key** |
| Who can read all rows | Anyone with the page source | Only an admin session, through `lms-api` (service role) |
| Student writes | Browser PATCHed its own row (and could set `w2_unlocked`) | `lms-api` merges quizzes + confirmations only; unlock flag and file records are server-owned |
| Uploads | n/a | One-time signed URL issued for the signed-in student; bucket private; no anon read/list/overwrite/delete |

The service-role key exists only in the Edge Function environment that Supabase injects. It is not in the page, the repo, or CI.

## How a request is authorised
`validate-login(code)` → session token (random 256-bit, only its SHA-256 stored, 12 h) → every `lms-api` call carries the token →
the **student identity comes from the session, never from the request body** → the function uses the service role against that one name.
Upload path is `{student-name}/{assignment-slug}/{filename}` built server-side; `record-submission` re-checks the path prefix and that the object really exists.

## Tested against the live project (Oct 6 2026)
- valid / invalid / throttled login; case + whitespace tolerant; 15 failures per IP per 10 min then refused
- save with forged `w2_unlocked`, a forged file record, and a bogus quiz id → all ignored
- `.exe` refused; admin actions as a student → 403; unknown/expired token → 401; another student's path → 403; never-uploaded file → 409; repeat record call is idempotent
- real signed-URL upload + record + admin signed download link (5 min)
- after lock-down, with the public key: read/insert `student_progress`, read `student_access_codes`, read `submissions`, call `lms_login` → all `permission denied`; unsigned storage write → `new row violates row-level security policy`
- browser suite (`tools/e2e.mjs`) asserts the page never calls `/rest/v1/` and contains no codes or keys

## Still weak — decide before relying on it
1. **Codes are short and patterned** (the existing student codes and the admin code). Throttling slows guessing but 26 possibilities is nothing. The admin code is the worst: it can read every student's files.
   → Replace with long random codes: `select public.lms_set_code('Instructor', '<random>', true);` (see `supabase/seed.example.sql`). Same for students if you can distribute them.
2. Throttling is per IP. A classroom behind one IP shares the budget; an attacker rotating IPs gets more tries.
3. Quiz scores are computed in the browser (answers are in the page). A student can fake a pass. The server only validates shape and applies the 70% rule to the score it is sent.
4. `Access-Control-Allow-Origin: *` on the functions. Harmless without a session token, but you can pin it to the Netlify domain.
5. Sessions last 12 h and live until expiry or sign-out.
6. Last cohort's progress rows still exist under the same names (see README → "Before go-live").
