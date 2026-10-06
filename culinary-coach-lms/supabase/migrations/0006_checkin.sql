-- 90-day check-in (Level I): students opt in on the KRP page, a daily job sends the email 90 days after Lab 4 (Nov 7, 2026 -> Feb 5, 2027).
-- Additive only. Email goes through Resend (secret RESEND_API_KEY, set in the Supabase dashboard — never in this repo).
alter table public.student_progress
  add column if not exists checkin_email    text,
  add column if not exists checkin_opt_in   boolean not null default false,
  add column if not exists checkin_sent_at  timestamptz;

-- Settings the check-in function reads. The cron secret is random and lives only in this table; the daily job and the
-- function both read it server-side, so no key has to be pasted anywhere.
insert into public.lms_settings (key, value)
  values ('checkin_cron_secret', jsonb_build_object('secret', encode(extensions.gen_random_bytes(24), 'hex')))
  on conflict (key) do nothing;
insert into public.lms_settings (key, value) values ('checkin_survey_url', '""'::jsonb) on conflict (key) do nothing;

-- Daily at 15:00 UTC (11:00 AM Eastern). The function does nothing until 90 days after Lab 4.
select cron.schedule('lms-send-checkins', '0 15 * * *', $$
  select net.http_post(
    url := 'https://mddvqxesxfifqxhuzhsi.supabase.co/functions/v1/send-checkins',
    headers := jsonb_build_object('Content-Type', 'application/json',
      'x-cron-secret', (select value->>'secret' from public.lms_settings where key = 'checkin_cron_secret')),
    body := '{}'::jsonb);
$$);
