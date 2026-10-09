// POST /functions/v1/validate-login
// Body:    { access_code: string, student_name?: string }   (the typed name is cosmetic; the code identifies the person)
// Returns: { valid, is_admin, student_name, level, token, expires_at }  |  { valid:false }  |  429 { valid:false, locked:true }
//
// The service-role key comes from the function environment that Supabase injects. It is never in the page or the repo.
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json(405, { valid: false });

  let body: { access_code?: unknown };
  try { body = await req.json(); } catch { return json(400, { valid: false }); }
  const code = typeof body.access_code === "string" ? body.access_code : "";

  const ip = (req.headers.get("cf-connecting-ip") ||
              (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown").slice(0, 64);

  const { data, error } = await sb.rpc("lms_login", { p_code: code, p_ip: ip });
  if (error || !data) { console.error("lms_login failed", error); return json(500, { valid: false }); }

  if (data.status === "ok") {
    return json(200, {
      valid: true, is_admin: !!data.is_admin, student_name: data.student_name, level: data.level || "L1",
      token: data.token, expires_at: data.expires_at,
    });
  }
  if (data.status === "locked") return json(429, { valid: false, locked: true });
  return json(401, { valid: false });
});
