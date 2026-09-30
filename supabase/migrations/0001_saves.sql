-- Applied to project gcgyqsgsjrcthvnbigmr (adam-build-mode).
-- Kept in the repo so the backend is reviewable next to the client that calls it.

create table if not exists public.saves (
  code       text primary key,
  state      jsonb not null,
  answered   integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS on with NO policies: the anon role cannot read or write this table
-- directly. The two security-definer functions below are the only way in.
alter table public.saves enable row level security;
revoke all on table public.saves from anon, authenticated;

create or replace function public.load_save(p_code text)
returns jsonb
language sql
security definer
set search_path = public, pg_temp
as $$
  select s.state from public.saves s where s.code = upper(p_code);
$$;

-- Refuses to overwrite a save that is further along than the incoming one, so a
-- stale device syncing late can never erase newer progress.
create or replace function public.put_save(p_code text, p_state jsonb, p_answered integer)
returns timestamptz
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_code text := upper(p_code);
  v_ts   timestamptz;
begin
  if v_code !~ '^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$' then
    raise exception 'invalid save code';
  end if;
  if pg_column_size(p_state) > 262144 then
    raise exception 'save too large';
  end if;

  insert into public.saves as s (code, state, answered)
  values (v_code, p_state, greatest(coalesce(p_answered, 0), 0))
  on conflict (code) do update
     set state = excluded.state,
         answered = excluded.answered,
         updated_at = now()
   where excluded.answered >= s.answered
  returning s.updated_at into v_ts;

  if v_ts is null then
    select s2.updated_at into v_ts from public.saves s2 where s2.code = v_code;
  end if;
  return v_ts;
end;
$$;

revoke all on function public.load_save(text) from public;
revoke all on function public.put_save(text, jsonb, integer) from public;
grant execute on function public.load_save(text) to anon;
grant execute on function public.put_save(text, jsonb, integer) to anon;

-- The app never signs anyone in, so `authenticated` is not part of the surface.
revoke execute on function public.load_save(text) from authenticated;
revoke execute on function public.put_save(text, jsonb, integer) from authenticated;
