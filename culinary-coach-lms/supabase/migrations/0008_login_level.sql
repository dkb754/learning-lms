-- validate-login now also returns the student's level (L1 / L2). Same function as 0003 plus one field; no data changes.
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
  return jsonb_build_object('status', 'ok', 'student_name', r.student_name, 'is_admin', r.is_admin, 'level', r.level,
                            'token', tok, 'expires_at', exp);
end $$;

revoke all on function public.lms_login(text, text) from public, anon, authenticated;
grant execute on function public.lms_login(text, text) to service_role;
