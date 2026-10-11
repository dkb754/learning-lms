-- LOCK-DOWN: the public (anon) key can no longer read or write anything the LMS owns.
-- Applied AFTER the new page ships, because the old page read/wrote student_progress directly with the anon key.
--
-- Why not the JWT-claim policies (student_name = request.jwt.claims->>'student_name')?
--   Nothing issues a JWT carrying a student_name claim, so those policies would deny every student. Instead the page
--   never touches the database: validate-login / lms-api check the access code, then use the service role (which
--   bypasses RLS) and always act on the session's own student_name. A student can therefore only ever reach their own row.
--
-- Production note: this was applied with ALTER POLICY rather than DROP POLICY (same effect — the policy now matches no
-- rows). To remove the dead policies entirely, run:
--     drop policy "Allow all access" on public.student_progress;
--     drop policy "submissions: anon can upload" on storage.objects;

alter policy "Allow all access" on public.student_progress using (false) with check (false);
revoke all on public.student_progress from anon, authenticated;

-- Uploads now use one-time signed URLs issued by lms-api for the authenticated student, so anon needs no insert right.
alter policy "submissions: anon can upload" on storage.objects with check (false);
