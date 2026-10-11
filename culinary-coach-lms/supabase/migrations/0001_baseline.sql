-- Baseline for a BLANK database (CI and local development). Production already has these objects, so every statement here
-- is idempotent. They are the two tables the original page used before the server-side rewrite; 0002–0004 build on them.
create table if not exists public.student_progress (
  id           uuid primary key default gen_random_uuid(),
  student_name text not null unique,
  quizzes      jsonb not null default '{}'::jsonb,
  deliverables jsonb not null default '{}'::jsonb,
  w2_unlocked  boolean not null default false,
  last_updated timestamptz not null default now()
);
alter table public.student_progress enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'student_progress' and policyname = 'Allow all access') then
    create policy "Allow all access" on public.student_progress for all using (true) with check (true);
  end if;
end $$;
