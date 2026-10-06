// POST /functions/v1/lms-api   { token, action, ...args }
// Every data operation for the LMS. The browser never talks to the tables or the bucket directly.
//   student: load, save, create-upload, record-submission, logout
//   admin:   admin-overview, admin-unlock, admin-file-url
// Identity always comes from the server-side session (token -> student_name); it is never read from the request body.
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

const BUCKET = "submissions";
const MAX_BYTES = 25 * 1024 * 1024;
const PASS_MARK = 70;

// Keep in sync with DELIVERABLE_LABELS in index.html (file: true)
const FILE_ASSIGNMENTS: Record<string, string> = {
  w2d1: "Business Concept Draft (1-page)",
  w2d2: "Compliance Checklist Review",
  w2d4: "Startup Budget + Projections",
  w3d1: "Recipe Costing (3 Recipes)",
  w3d3: "Supplier Contact List",
  w4d1: "Brand Mood Board + Brand Guide",
  w4d2: "30-Day Social Media Plan",
  w4d3: "3 Sales Channels Plan",
  w4lab: "Final Business Plan + Pitch Deck",
};
const CONFIRM_IDS = new Set(["w1d1", "w1d2", "w1lab", "w2lab", "w3lab"]);
const EXT_MIME: Record<string, string> = {
  pdf: "application/pdf", doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  csv: "text/csv", txt: "text/plain", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", zip: "application/zip",
};

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey, x-client-info",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

class HttpError extends Error { constructor(public status: number, public code: string) { super(code); } }

const slug = (s: string) =>
  s.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "x";
const extOf = (n: string) => (/\.([A-Za-z0-9]+)$/.exec(n)?.[1] || "").toLowerCase();
function safeName(n: string): string {
  const ext = extOf(n);
  const base = n.replace(/\.[^.]*$/, "").replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^[._]+/, "").slice(0, 60) || "file";
  return ext ? `${base}.${ext}` : base;
}
function withSuffix(name: string, suffix: string): string {
  const ext = extOf(name);
  return ext ? `${name.slice(0, -(ext.length + 1))}${suffix}.${ext}` : name + suffix;
}

// ---------- progress rows ----------
type Progress = { quizzes: Record<string, any>; deliverables: Record<string, any>; w2_unlocked: boolean };
const toProgress = (r: any): Progress => ({
  quizzes: r?.quizzes || {}, deliverables: r?.deliverables || {}, w2_unlocked: !!r?.w2_unlocked,
});

async function getRow(name: string) {
  const { data, error } = await sb.from("student_progress").select("*").eq("student_name", name).maybeSingle();
  if (error) throw error;
  return data;
}
async function ensureRow(name: string) {
  const row = await getRow(name);
  if (row) return row;
  const ins = await sb.from("student_progress")
    .insert({ student_name: name, quizzes: {}, deliverables: {}, w2_unlocked: false }).select().single();
  if (ins.error) { const again = await getRow(name); if (again) return again; throw ins.error; }
  return ins.data;
}
async function writeRow(name: string, patch: Record<string, unknown>) {
  const { data, error } = await sb.from("student_progress")
    .update({ ...patch, last_updated: new Date().toISOString() }).eq("student_name", name).select().single();
  if (error) throw error;
  return data;
}

function mergeQuizzes(cur: Record<string, any>, inc: unknown) {
  const out = { ...cur };
  if (inc && typeof inc === "object") {
    for (const [k, v] of Object.entries(inc as Record<string, any>)) {
      if (!/^w[1-4]d[1-4]$/.test(k)) continue;
      const score = Number(v?.score);
      if (!Number.isFinite(score) || score < 0 || score > 100) continue;
      const rec = {
        score: Math.round(score), passed: score >= PASS_MARK,
        correct: Number.isInteger(v?.correct) ? v.correct : undefined,
        total: Number.isInteger(v?.total) ? v.total : undefined,
      };
      const c = out[k];
      if (!c || (rec.passed && !c.passed) || (rec.passed === !!c.passed && rec.score > c.score)) out[k] = rec;
    }
  }
  return out;
}
function mergeConfirms(cur: Record<string, any>, inc: unknown) {
  const out = { ...cur };
  if (inc && typeof inc === "object") {
    for (const [k, v] of Object.entries(inc as Record<string, any>)) {
      if (!CONFIRM_IDS.has(k) || out[k]) continue; // file deliverables are written only by record-submission
      const t = Date.parse(v?.date);
      const date = Number.isFinite(t) && t < Date.now() + 86_400_000 ? new Date(t).toISOString() : new Date().toISOString();
      out[k] = { submitted: true, kind: "confirm", date };
    }
  }
  return out;
}

// ---------- handler ----------
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });

  let body: any;
  try { body = await req.json(); } catch { return json(400, { error: "bad_json" }); }
  const token = typeof body?.token === "string" ? body.token : "";
  const action = String(body?.action || "");

  try {
    const { data: sess, error: sErr } = await sb.rpc("lms_session", { p_token: token });
    if (sErr) throw sErr;
    if (!sess) return json(401, { error: "session_expired" });
    const user: string = sess.student_name;
    const isAdmin: boolean = !!sess.is_admin;
    const needStudent = () => { if (isAdmin) throw new HttpError(403, "admin_preview"); };
    const needAdmin = () => { if (!isAdmin) throw new HttpError(403, "forbidden"); };

    switch (action) {
      case "logout": {
        await sb.rpc("lms_logout", { p_token: token });
        return json(200, { ok: true });
      }

      case "load": {
        if (isAdmin) return json(200, { progress: toProgress(null), is_admin: true });
        return json(200, { progress: toProgress(await ensureRow(user)) });
      }

      case "save": {
        needStudent();
        const row = await ensureRow(user);
        const saved = await writeRow(user, {
          quizzes: mergeQuizzes(row.quizzes || {}, body.quizzes),
          deliverables: mergeConfirms(row.deliverables || {}, body.deliverables),
          // w2_unlocked is deliberately NOT accepted from the browser
        });
        return json(200, { progress: toProgress(saved) });
      }

      case "create-upload": {
        needStudent();
        const id = String(body.assignment || "");
        const label = FILE_ASSIGNMENTS[id];
        if (!label) throw new HttpError(400, "unknown_assignment");
        const filename = String(body.filename || "");
        const ext = extOf(filename);
        if (!EXT_MIME[ext]) throw new HttpError(400, "file_type_not_allowed");
        const size = Number(body.size);
        if (!Number.isFinite(size) || size <= 0) throw new HttpError(400, "empty_file");
        if (size > MAX_BYTES) throw new HttpError(413, "file_too_large");

        const dir = `${slug(user)}/${slug(label)}`;
        const listed = await sb.storage.from(BUCKET).list(dir, { limit: 1000 });
        if (listed.error) throw listed.error;
        const taken = new Set((listed.data || []).map((o) => o.name));
        const base = safeName(filename);
        let name = base, n = 2;
        while (taken.has(name)) name = withSuffix(base, `-v${n++}`);
        const path = `${dir}/${name}`;

        const signed = await sb.storage.from(BUCKET).createSignedUploadUrl(path);
        if (signed.error) throw signed.error;
        return json(200, { path, signedUrl: signed.data.signedUrl, mime: EXT_MIME[ext] });
      }

      case "record-submission": {
        needStudent();
        const id = String(body.assignment || "");
        const label = FILE_ASSIGNMENTS[id];
        if (!label) throw new HttpError(400, "unknown_assignment");
        const path = String(body.path || "");
        const dir = `${slug(user)}/${slug(label)}`;
        if (!path.startsWith(dir + "/") || path.includes("..") || path.slice(dir.length + 1).includes("/"))
          throw new HttpError(403, "bad_path");
        const name = path.slice(dir.length + 1);

        // The file must really be in storage — a record can never claim a file that was not received
        const found = await sb.storage.from(BUCKET).list(dir, { limit: 100, search: name });
        if (found.error) throw found.error;
        const obj = (found.data || []).find((o) => o.name === name);
        if (!obj) throw new HttpError(409, "file_missing");

        const displayName = String(body.filename || name).slice(0, 200);
        const prior = await sb.from("submissions").select("id", { count: "exact", head: true })
          .eq("student_name", user).eq("assignment_id", id);
        const attempt = (prior.count || 0) + 1;
        const meta = {
          student_name: user, assignment_id: id, assignment: label, file_name: displayName, file_path: path,
          file_size: obj.metadata?.size ?? null, file_type: obj.metadata?.mimetype ?? null, attempt,
        };
        let s: any;
        const ins = await sb.from("submissions").insert(meta).select().single();
        if (ins.error) { // same path recorded twice (a retry) -> idempotent
          const again = await sb.from("submissions").select("*").eq("file_path", path).eq("student_name", user).maybeSingle();
          if (!again.data) throw ins.error;
          s = again.data;
        } else s = ins.data;
        const rec = {
          submitted: true, kind: "file", date: s.submitted_at, fileName: s.file_name, fileSize: s.file_size,
          fileType: s.file_type, filePath: s.file_path, attempts: s.attempt,
        };
        const row = await ensureRow(user);
        const saved = await writeRow(user, { deliverables: { ...(row.deliverables || {}), [id]: rec } });
        return json(200, { record: rec, progress: toProgress(saved) });
      }

      case "admin-overview": {
        needAdmin();
        const [rows, subs, roster] = await Promise.all([
          sb.from("student_progress").select("*"),
          sb.from("submissions").select("*").order("submitted_at", { ascending: false }).limit(2000),
          sb.from("student_access_codes").select("student_name").eq("is_admin", false).order("student_name"),
        ]);
        for (const r of [rows, subs, roster]) if (r.error) throw r.error;
        const progress: Record<string, Progress> = {};
        for (const r of rows.data || []) progress[r.student_name] = toProgress(r);
        return json(200, {
          roster: (roster.data || []).map((r) => r.student_name), progress, submissions: subs.data || [],
        });
      }

      case "admin-unlock": {
        needAdmin();
        const target = String(body.student_name || "");
        const ok = await sb.from("student_access_codes").select("student_name").eq("student_name", target).eq("is_admin", false).maybeSingle();
        if (!ok.data) throw new HttpError(404, "unknown_student");
        await ensureRow(target);
        await writeRow(target, { w2_unlocked: true });
        return json(200, { ok: true });
      }

      case "admin-file-url": {
        needAdmin();
        const path = String(body.path || "");
        const known = await sb.from("submissions").select("file_name").eq("file_path", path).maybeSingle();
        if (!known.data) throw new HttpError(404, "unknown_file");
        const url = await sb.storage.from(BUCKET).createSignedUrl(path, 300, { download: known.data.file_name });
        if (url.error) throw url.error;
        return json(200, { url: url.data.signedUrl });
      }

      default:
        return json(400, { error: "unknown_action" });
    }
  } catch (e) {
    if (e instanceof HttpError) return json(e.status, { error: e.code });
    console.error("lms-api error", action, e);
    return json(500, { error: "server_error" });
  }
});
