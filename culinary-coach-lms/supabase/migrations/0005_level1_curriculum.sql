-- Level I curriculum support. ADDITIVE ONLY: the previous page and `lms-api` keep working against these tables.
-- Pairs with the new `lms-api-v2` Edge Function (the old `lms-api` is left deployed until the new page is live).
--
-- Brief mapping (CE_LevelMap_PlatformBrief):
--   student_access_codes.level / admin_override ... which level a code grants; instructor override for Level II
--   student_progress.level / is_l2_eligible ....... Level II readiness (set by the server, never by the browser)
--   student_progress.krp_portfolio ................ Honest Map, Identity Statement, KRP Portfolio uploads
--   student_progress.lab_attendance ............... {lab1: true, ...} set by the instructor only
--   student_progress.servsafe ..................... {practice_score, exam_result, exam_score} set by the instructor only
--   student_progress.cohort ....................... tag for the cohort a row belongs to; rows from an earlier cohort are
--                                                   archived automatically the first time that student signs in
--   cst_rubric_scores ............................. 100-point CST Module 1 rubric, entered by the instructor
--   lms_settings .................................. instructor-controlled switches (which quizzes are published)
--
-- NOT done here (Level II phase): making student_progress unique on (student_name, level). The current unique
-- constraint on student_name stays, so for now there is one row per student. Changing it needs an ALTER ... DROP CONSTRAINT.

alter table public.student_progress
  add column if not exists cohort text,
  add column if not exists level text not null default 'L1',
  add column if not exists is_l2_eligible boolean not null default false,
  add column if not exists krp_portfolio jsonb not null default '{}'::jsonb,
  add column if not exists lab_attendance jsonb not null default '{}'::jsonb,
  add column if not exists servsafe jsonb not null default '{}'::jsonb;

alter table public.student_access_codes
  add column if not exists level text not null default 'L1',
  add column if not exists admin_override boolean not null default false;

create table if not exists public.student_progress_archive (
  id          bigint generated always as identity primary key,
  student_name text not null,
  archived_at  timestamptz not null default now(),
  reason       text,
  row_data     jsonb not null
);

create table if not exists public.cst_rubric_scores (
  id           uuid primary key default gen_random_uuid(),
  student_name text not null,
  lab          int  not null default 1,
  scores       jsonb not null default '{}'::jsonb,
  total        int  not null default 0,
  band         text not null default '',
  notes        text,
  scored_by    text,
  scored_at    timestamptz not null default now(),
  unique (student_name, lab)
);

create table if not exists public.lms_settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.lms_settings (key, value) values ('published_quizzes', '[]'::jsonb) on conflict (key) do nothing;

alter table public.student_progress_archive enable row level security;
alter table public.cst_rubric_scores        enable row level security;
alter table public.lms_settings             enable row level security;
revoke all on public.student_progress_archive, public.cst_rubric_scores, public.lms_settings from anon, authenticated;
