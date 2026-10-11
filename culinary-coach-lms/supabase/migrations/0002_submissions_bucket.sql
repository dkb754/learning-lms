-- Private storage bucket for LMS assignment uploads (Culinary Coach LMS, Level I · Fall 2026).
--
-- Design: the page ships the project's anon key, so the bucket is deliberately WRITE-ONLY for anon.
--   * anon can INSERT objects into 'submissions' (a student uploading a file)
--   * there is NO select / update / delete policy -> anon cannot list, read, overwrite or remove anything
--   * upsert is off client-side, so a new submission is always a new object
--   * the bucket itself caps size (25 MB) and allowed file types
-- The instructor opens files from Supabase dashboard -> Storage -> submissions (service role bypasses RLS).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'submissions', 'submissions', false, 26214400,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/csv', 'text/plain', 'image/png', 'image/jpeg', 'application/zip'
  ]
)
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "submissions: anon can upload" on storage.objects;
create policy "submissions: anon can upload"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'submissions');
