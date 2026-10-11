-- Server-side login, sessions and submission records for the Culinary Coach LMS.
-- ADDITIVE ONLY: nothing here changes how the currently deployed page behaves.
-- (The lock-down that removes the old open access is 0004_lockdown.sql, applied after the new page ships.)
--
-- Every table below has RLS ON with NO policies and no grants to anon/authenticated, so the public key
-- cannot touch them. They are reached only by the `validate-login` and `lms-api` Edge Functions, which run
-- with the service role (injected by Supabase into the function environment — never in the page or the repo).

-- 1. Access codes — stored as bcrypt hashes, never plaintext ----------------------------------------
create table if not exists public.student_access_codes (
  id               uuid primary key default gen_random_uuid(),
  student_name     text not null unique,
  access_code_hash text not null,
  is_admin         boolean not null default false,
  created_at       timestamptz not null default now()
);

-- 2. Server-side sessions: the browser holds a random token, the DB holds only its SHA-256 -----------
create table if not exists public.lms_sessions (
  token_hash   text primary key,
  student_name text not null,
  is_admin     boolean not null,
  created_at   timestamptz not null default now(),
  expires_at   timestamptz not null
);

-- 3. Failed-login log for throttling --------------------------------------------------------------
create table if not exists public.login_attempts (
  id  bigint generated always as identity primary key,
  ip  text not null,
  ok  boolean not null,
  at  timestamptz not null default now()
);
create index if not exists login_attempts_ip_at on public.login_attempts (ip, at);

-- 4. One row per uploaded file (metadata only — the file lives in the private `submissions` bucket) --
create table if not exists public.submissions (
  id            uuid primary key default gen_random_uuid(),
  student_name  text not null,
  assignment_id text not null,
  assignment    text not null,
  file_name     text not null,
  file_path     text not null unique,
  file_size     bigint,
  file_type     text,
  attempt       int  not null default 1,
  submitted_at  timestamptz not null default now()
);
create index if not exists submissions_student on public.submissions (student_name, assignment_id);

alter table public.student_access_codes enable row level security;
alter table public.lms_sessions         enable row level security;
alter table public.login_attempts       enable row level security;
alter table public.submissions          enable row level security;
revoke all on public.student_access_codes, public.lms_sessions, public.login_attempts, public.submissions from anon, authenticated;

-- 5. Functions (service_role only) ------------------------------------------------------------------
create or replace function public.lms_set_code(p_name text, p_code text, p_admin boolean default false)
returns void language sql security definer set search_path = public, extensions as $$
  insert into public.student_access_codes (student_name, access_code_hash, is_admin)
  values (p_name, crypt(upper(trim(p_code)), gen_salt('bf', 8)), p_admin)
  on conflict (student_name) do update
    set access_code_hash = excluded.access_code_hash, is_admin = excluded.is_admin;
$$;

create or replace function public.lms_cleanup()
returns void language sql security definer set search_path = public as $$
  delete from public.lms_sessions where expires_at < now();
$$;

create or replace function public.lms_cleanup_attempts()
returns void language sql security definer set search_path = public as $$
  delete from public.login_attempts where at < now() - interval '1 day';
$$;

-- 15 failed attempts per IP per 10 minutes, then that IP is refused (a classroom can share one IP, so keep it generous).
create or replace function public.lms_login(p_code text, p_ip text)
returns jsonb language plpgsql security definer set search_path = public, extensions as $$
declare
  r record; tok text; fails int; exp timestamptz := now() + interval '12 hours';
begin
  perform public.lms_cleanup();
  perform public.lms_cleanup_attempts();
  select count(*) into fails from public.login_attempts
   where ip = coalesce(p_ip, 'unknown') and not ok and at > now() - interval '10 minutes';
  if fails >= 15 then return jsonb_build_object('status', 'locked'); end if;

  if p_code is null or length(p_code) = 0 or length(p_code) > 64 then
    insert into public.login_attempts (ip, ok) values (coalesce(p_ip, 'unknown'), false);
    return jsonb_build_object('status', 'invalid');
  end if;

  select * into r from public.student_access_codes
   where access_code_hash = crypt(upper(trim(p_code)), access_code_hash) limit 1;
  if not found then
    insert into public.login_attempts (ip, ok) values (coalesce(p_ip, 'unknown'), false);
    return jsonb_build_object('status', 'invalid');
  end if;

  tok := encode(gen_random_bytes(32), 'hex');
  insert into public.lms_sessions (token_hash, student_name, is_admin, expires_at)
  values (encode(digest(tok, 'sha256'), 'hex'), r.student_name, r.is_admin, exp);
  return jsonb_build_object('status', 'ok', 'student_name', r.student_name, 'is_admin', r.is_admin,
                            'token', tok, 'expires_at', exp);
end $$;

create or replace function public.lms_session(p_token text)
returns jsonb language sql security definer set search_path = public, extensions stable as $$
  select jsonb_build_object('student_name', student_name, 'is_admin', is_admin)
    from public.lms_sessions
   where token_hash = encode(digest(coalesce(p_token, ''), 'sha256'), 'hex') and expires_at > now();
$$;

create or replace function public.lms_logout(p_token text)
returns void language sql security definer set search_path = public, extensions as $$
  delete from public.lms_sessions where token_hash = encode(digest(coalesce(p_token, ''), 'sha256'), 'hex');
$$;

revoke all on function public.lms_set_code(text, text, boolean), public.lms_login(text, text), public.lms_session(text),
                       public.lms_logout(text), public.lms_cleanup(), public.lms_cleanup_attempts() from public, anon, authenticated;
grant execute on function public.lms_set_code(text, text, boolean), public.lms_login(text, text), public.lms_session(text),
                          public.lms_logout(text), public.lms_cleanup(), public.lms_cleanup_attempts() to service_role;
