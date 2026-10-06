-- Week 1 scaling exercises: best result per exercise, graded by lms-api-v2 (answers never reach the browser).
alter table public.student_progress add column if not exists exercises jsonb not null default '{}'::jsonb;
