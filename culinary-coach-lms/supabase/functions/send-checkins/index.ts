// POST /functions/v1/send-checkins
// Sends the 90-day check-in email through Resend (https://api.resend.com/emails).
//   Caller: the daily cron job (header x-cron-secret) OR the instructor's signed-in session ({ token, test_to }).
//   Cron run:  does nothing until 90 days after Lab 4; then emails every student who opted in, attended Lab 4 and has not
//              been emailed. Each student is claimed (checkin_sent_at) BEFORE sending so a repeat run can never double-send;
//              a failed send releases the claim so the next daily run retries.
//   Test run:  { token, test_to: "you@example.com" } sends ONE sample email to that address, touching no student data.
// Secrets (Supabase dashboard -> Edge Functions -> Secrets):  RESEND_API_KEY (required)
//   optional: CHECKIN_FROM (default "Culinary Coach <checkin@culinarycoach.org>" — the domain must be verified in Resend),
//             CHECKIN_REPLY_TO (default duane@culinarycoach.org)
// Survey link: set lms_settings.checkin_survey_url (empty = the email asks students to reply instead).
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const COHORT = "L1-F2026";
const LAB4 = Date.UTC(2026, 10, 7);            // Saturday, Nov 7, 2026
const SEND_ON = LAB4 + 90 * 86400000;          // Feb 5, 2027
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}

async function setting(key: string): Promise<any> {
  const { data, error } = await sb.from("lms_settings").select("value").eq("key", key).maybeSingle();
  if (error) throw error;
  return data?.value;
}

function message(first: string, survey: string) {
  const reply = Deno.env.get("CHECKIN_REPLY_TO") || "duane@culinarycoach.org";
  const ask = survey
    ? `<p>Please take 3 minutes to tell us how it's going: <a href="${esc(survey)}">${esc(survey)}</a></p>`
    : `<p>Just reply to this email and tell us how it's going: are you working in food, building your business, or still planning?</p>`;
  const html = `<p>Hi ${esc(first)},</p>
<p>It has been 90 days since Lab 4 of Culinary Entrepreneurship I. We would like to hear how you are doing.</p>${ask}
<p>Open your KRP Portfolio any time to look back at your Honest Map and Professional Identity Statement.</p>
<p>Chef Duane Brown<br>Culinary Coach</p>`;
  const text = `Hi ${first},\n\nIt has been 90 days since Lab 4 of Culinary Entrepreneurship I. We would like to hear how you are doing.\n\n` +
    (survey ? `Please take 3 minutes to tell us how it's going: ${survey}\n\n` : `Just reply to this email and tell us how it's going.\n\n`) +
    `Chef Duane Brown\nCulinary Coach\n`;
  return { html, text, reply };
}

async function sendMail(to: string, first: string, survey: string, subject = "90 days after Lab 4: how is it going?") {
  const key = Deno.env.get("RESEND_API_KEY");
  if (!key) throw new Error("resend_not_configured");
  const m = message(first, survey);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: Deno.env.get("CHECKIN_FROM") || "Culinary Coach <checkin@culinarycoach.org>",
      to: [to], reply_to: m.reply, subject, html: m.html, text: m.text,
    }),
  });
  if (!res.ok) throw new Error(`resend_${res.status}: ${(await res.text()).slice(0, 200)}`);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });
  let body: any = {};
  try { body = await req.json(); } catch { /* cron posts {} */ }

  try {
    // ---- who is calling?
    const header = req.headers.get("x-cron-secret") || "";
    const secret = String((await setting("checkin_cron_secret"))?.secret || "");
    const isCron = !!secret && safeEqual(header, secret);
    let isAdmin = false;
    if (!isCron && typeof body.token === "string") {
      const { data: sess } = await sb.rpc("lms_session", { p_token: body.token });
      isAdmin = !!sess?.is_admin;
    }
    if (!isCron && !isAdmin) return json(401, { error: "unauthorized" });

    const survey = String((await setting("checkin_survey_url")) || "");

    // ---- instructor test mail
    if (body.test_to !== undefined) {
      if (!isAdmin) return json(403, { error: "forbidden" });
      const to = String(body.test_to).trim();
      if (!EMAIL_RE.test(to) || to.length > 254) return json(400, { error: "bad_email" });
      await sendMail(to, "Chef", survey, "TEST — 90-day check-in email");
      return json(200, { ok: true, sent_to: to });
    }
    if (!isCron) return json(400, { error: "nothing_to_do" });

    // ---- scheduled run
    if (Date.now() < SEND_ON) return json(200, { due: false, send_on: new Date(SEND_ON).toISOString().slice(0, 10) });
    if (!Deno.env.get("RESEND_API_KEY")) return json(503, { error: "resend_not_configured" });

    const { data: rows, error } = await sb.from("student_progress")
      .select("student_name,checkin_email,lab_attendance")
      .eq("cohort", COHORT).eq("checkin_opt_in", true).is("checkin_sent_at", null).not("checkin_email", "is", null);
    if (error) throw error;
    const results: Record<string, string> = {};
    for (const r of rows || []) {
      if (!r.lab_attendance?.lab4 || !EMAIL_RE.test(r.checkin_email || "")) { results[r.student_name] = "skipped"; continue; }
      const claim = await sb.from("student_progress").update({ checkin_sent_at: new Date().toISOString() })
        .eq("student_name", r.student_name).is("checkin_sent_at", null).select("student_name");
      if (claim.error || !claim.data?.length) { results[r.student_name] = "already_claimed"; continue; }
      try {
        await sendMail(r.checkin_email, r.student_name.split(" ")[0], survey);
        results[r.student_name] = "sent";
      } catch (e) {
        await sb.from("student_progress").update({ checkin_sent_at: null }).eq("student_name", r.student_name);
        console.error("check-in send failed", r.student_name, String(e));
        results[r.student_name] = "failed";
      }
    }
    return json(200, { due: true, results });
  } catch (e) {
    if (String(e).includes("resend_not_configured")) return json(503, { error: "resend_not_configured" });
    console.error("send-checkins error", e);
    return json(500, { error: String(e).startsWith("Error: resend_") ? String(e).slice(7) : "server_error" });
  }
});
