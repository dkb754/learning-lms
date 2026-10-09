// POST /functions/v1/lms-api-v2   { token, action, ...args }
// Level I curriculum API (Culinary Entrepreneurship I, Fall 2026). Supersedes lms-api, which stays deployed only
// until the new page is live. The browser never touches tables or the bucket directly; identity always comes
// from the server-side session (token -> student_name), never from the request body.
//   student: load, save, create-upload, record-submission, set-checkin, submit-exercise, save-activity, logout
//   admin:   admin-overview, admin-unlock, admin-file-url, admin-set-attendance, admin-set-servsafe,
//            admin-save-rubric, admin-set-published
import { createClient } from "npm:@supabase/supabase-js@2";

const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
  auth: { persistSession: false },
});

const BUCKET = "submissions";
const MAX_BYTES = 25 * 1024 * 1024;
const PASS_MARK = 70;
const LEVEL = "L1";
const COHORT = "L1-F2026"; // rows from any other cohort are archived and reset the first time that student signs in

// Keep in sync with CURRICULUM in index.html. `krp` = also recorded in student_progress.krp_portfolio.
const FILE_ASSIGNMENTS: Record<string, { label: string; krp?: string }> = {
  w1d4: { label: "Honest Map", krp: "honest_map" },
  w2d3: { label: "Professional Identity Statement", krp: "identity_statement" },
  w3d4: { label: "Recipe Cost Sheet" },
  w3lab: { label: "Costed Recipe Card" },
  w4d3: { label: "Concept Brief Draft" },
  w4d4: { label: "KRP Portfolio", krp: "portfolio" },
  w4lab: { label: "Concept Brief" },
};
const QUIZ_IDS = [
  "w1d1", "w1d2", "w1d3", "w1d4", "w2d1", "w2d2", "w2d3", "w2d4", "w3d1", "w3d2", "w3d3", "w3d4", "w4d1", "w4d2",
];
// Week 1 scaling exercises: key -> [correct answer, tolerance]. Keep keys in sync with content/level1-exercises.js.
const EXERCISES: Record<string, Record<string, [number, number]>> = {
  ex1: { factor: [6, 0.001], oil: [24, 0.01], vinegar: [12, 0.01], dijon: [6, 0.01], salt: [6, 0.01] },
  ex2: { factor: [0.25, 0.001], onion: [2, 0.01], stock: [2.5, 0.01], cream: [0.5, 0.01], cream_cups: [2, 0.01] },
  ex3: { factor: [2.5, 0.001], onion_ep: [7.5, 0.01], onion_ap: [8.52, 0.05], chicken_ep: [11.25, 0.01], chicken_ap: [15, 0.05] },
};
const LABS = ["lab1", "lab2", "lab3", "lab4"];
const EXT_MIME: Record<string, string> = {
  pdf: "application/pdf", doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  csv: "text/csv", txt: "text/plain", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", zip: "application/zip",
};
// CST Module 1 rubric: 25 criteria x 4 pts = 100. Section 4 has six criteria (three named in the brief + three proposed).
const RUBRIC_KEYS = [
  ...[1, 2, 3, 4, 5].map((i) => `s1_${i}`),
  ...[1, 2, 3, 4, 5, 6, 7, 8].map((i) => `s2_${i}`),
  ...[1, 2, 3, 4, 5, 6].map((i) => `s3_${i}`),
  ...[1, 2, 3, 4, 5, 6].map((i) => `s4_${i}`),
];

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
type Row = Record<string, any>;
const EMPTY_PATCH = () => ({
  quizzes: {}, deliverables: {}, w2_unlocked: false, krp_portfolio: {}, lab_attendance: {}, servsafe: {},
  is_l2_eligible: false, exercises: {}, checkin_opt_in: false, checkin_email: null, checkin_sent_at: null,
});
const toProgress = (r: Row | null | undefined) => ({
  quizzes: r?.quizzes || {}, deliverables: r?.deliverables || {}, w2_unlocked: !!r?.w2_unlocked,
  krp_portfolio: r?.krp_portfolio || {}, lab_attendance: r?.lab_attendance || {}, servsafe: r?.servsafe || {},
  is_l2_eligible: !!r?.is_l2_eligible, exercises: r?.exercises || {},
  checkin: { opt_in: !!r?.checkin_opt_in, email: r?.checkin_email || "", sent: !!r?.checkin_sent_at },
});
// A row that belongs to an earlier cohort is shown as empty everywhere until the student signs in and it is archived.
const view = (r: Row | undefined) => (r && r.cohort === COHORT ? toProgress(r) : toProgress(null));

async function getRow(name: string) {
  const { data, error } = await sb.from("student_progress").select("*").eq("student_name", name).maybeSingle();
  if (error) throw error;
  return data as Row | null;
}
async function writeRow(name: string, patch: Row) {
  const { data, error } = await sb.from("student_progress")
    .update({ ...patch, last_updated: new Date().toISOString() }).eq("student_name", name).select().single();
  if (error) throw error;
  return data as Row;
}
async function ensureRow(name: string): Promise<Row> {
  let row = await getRow(name);
  if (!row) {
    const ins = await sb.from("student_progress")
      .insert({ student_name: name, ...EMPTY_PATCH(), level: LEVEL, cohort: COHORT }).select().single();
    if (ins.error) { row = await getRow(name); if (!row) throw ins.error; } else return ins.data as Row;
  }
  if (row.cohort !== COHORT) {
    // Earlier cohort's data is preserved in the archive table, then the row starts clean for this cohort.
    // Idempotent: parallel first requests must not archive the same old row twice.
    const dup = await sb.from("student_progress_archive").select("id", { count: "exact", head: true })
      .eq("student_name", name).eq("row_data->>id", String(row.id));
    if (dup.error) throw dup.error;
    if (!dup.count) {
      const arch = await sb.from("student_progress_archive")
        .insert({ student_name: name, reason: `cohort rollover to ${COHORT}`, row_data: row });
      if (arch.error) throw arch.error;
    }
    row = await writeRow(name, { ...EMPTY_PATCH(), level: LEVEL, cohort: COHORT });
  }
  return row;
}

function eligible(r: Row): boolean {
  const q = r.quizzes || {};
  return r.servsafe?.exam_result === "passed" && !!r.deliverables?.w4lab && QUIZ_IDS.every((id) => q[id]?.passed);
}

async function getPublished(): Promise<string[]> {
  const { data, error } = await sb.from("lms_settings").select("value").eq("key", "published_quizzes").maybeSingle();
  if (error) throw error;
  return Array.isArray(data?.value) ? (data!.value as string[]) : [];
}

function mergeQuizzes(cur: Record<string, any>, inc: unknown, published: string[]) {
  const out = { ...cur };
  if (inc && typeof inc === "object") {
    for (const [k, v] of Object.entries(inc as Record<string, any>)) {
      if (!QUIZ_IDS.includes(k) || !published.includes(k)) continue; // only published quizzes can be scored
      const score = Number((v as any)?.score);
      if (!Number.isFinite(score) || score < 0 || score > 100) continue;
      const rec = {
        score: Math.round(score), passed: score >= PASS_MARK,
        correct: Number.isInteger((v as any)?.correct) ? (v as any).correct : undefined,
        total: Number.isInteger((v as any)?.total) ? (v as any).total : undefined,
      };
      const c = out[k];
      if (!c || (rec.passed && !c.passed) || (rec.passed === !!c.passed && rec.score > c.score)) out[k] = rec;
    }
  }
  return out;
}

const band = (total: number) => (total >= 80 ? "Pass" : total >= 70 ? "Conditional" : "Remediation required");

async function studentCst(name: string) {
  const { data, error } = await sb.from("cst_rubric_scores").select("lab,total,band,scores,scored_at").eq("student_name", name);
  if (error) throw error;
  return (data || []).map((r) => ({ lab: r.lab, total: r.total, band: r.band, scored_at: r.scored_at }));
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
    const target = async () => {
      const name = String(body.student_name || "");
      const ok = await sb.from("student_access_codes").select("student_name").eq("student_name", name).eq("is_admin", false).maybeSingle();
      if (!ok.data) throw new HttpError(404, "unknown_student");
      return name;
    };

    switch (action) {
      case "logout": {
        await sb.rpc("lms_logout", { p_token: token });
        return json(200, { ok: true });
      }

      case "load": {
        const published = await getPublished();
        if (isAdmin) return json(200, { progress: toProgress(null), is_admin: true, settings: { published_quizzes: published }, cst: [] });
        const row = await ensureRow(user);
        return json(200, { progress: toProgress(row), settings: { published_quizzes: published }, cst: await studentCst(user) });
      }

      case "save": {
        needStudent();
        const row = await ensureRow(user);
        const quizzes = mergeQuizzes(row.quizzes || {}, body.quizzes, await getPublished());
        const next = { ...row, quizzes };
        const saved = await writeRow(user, { quizzes, is_l2_eligible: eligible(next) });
        return json(200, { progress: toProgress(saved) });
      }

      case "create-upload": {
        needStudent();
        const id = String(body.assignment || "");
        const a = FILE_ASSIGNMENTS[id];
        if (!a) throw new HttpError(400, "unknown_assignment");
        const filename = String(body.filename || "");
        const ext = extOf(filename);
        if (!EXT_MIME[ext]) throw new HttpError(400, "file_type_not_allowed");
        const size = Number(body.size);
        if (!Number.isFinite(size) || size <= 0) throw new HttpError(400, "empty_file");
        if (size > MAX_BYTES) throw new HttpError(413, "file_too_large");

        const dir = `${LEVEL}/${slug(user)}/${slug(a.label)}`;
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
        const a = FILE_ASSIGNMENTS[id];
        if (!a) throw new HttpError(400, "unknown_assignment");
        const path = String(body.path || "");
        const dir = `${LEVEL}/${slug(user)}/${slug(a.label)}`;
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
          student_name: user, assignment_id: id, assignment: a.label, file_name: displayName, file_path: path,
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
        const deliverables = { ...(row.deliverables || {}), [id]: rec };
        const patch: Row = { deliverables };
        if (a.krp) patch.krp_portfolio = { ...(row.krp_portfolio || {}), [a.krp]: { date: rec.date, fileName: rec.fileName, filePath: rec.filePath, attempts: rec.attempts } };
        patch.is_l2_eligible = eligible({ ...row, deliverables });
        const saved = await writeRow(user, patch);
        return json(200, { record: rec, progress: toProgress(saved) });
      }

      case "submit-exercise": { // graded here; the correct answers are never sent to the browser
        const id = String(body.exercise_id || "");
        const key = EXERCISES[id];
        if (!key) throw new HttpError(400, "unknown_exercise");
        const given = (body.answers && typeof body.answers === "object" ? body.answers : {}) as Record<string, unknown>;
        const results: Record<string, boolean> = {};
        for (const [k, [ans, tol]] of Object.entries(key)) {
          const v = Number(given[k]);
          results[k] = Number.isFinite(v) && Math.abs(v - ans) <= tol;
        }
        const total = Object.keys(key).length;
        const correct = Object.values(results).filter(Boolean).length;
        const passed = correct === total;
        if (isAdmin) return json(200, { results, correct, total, passed }); // instructor preview: graded, nothing recorded
        const row = await ensureRow(user);
        const prev = (row.exercises || {})[id];
        const rec = {
          passed: !!(prev?.passed || passed), best: Math.max(prev?.best || 0, correct), total,
          attempts: (prev?.attempts || 0) + 1, date: new Date().toISOString(),
        };
        const saved = await writeRow(user, { exercises: { ...(row.exercises || {}), [id]: rec } });
        return json(200, { results, correct, total, passed, record: rec, progress: toProgress(saved) });
      }

      case "save-activity": { // lesson activities are graded in the browser (practice); the server keeps best score, attempts and written answers
        const id = String(body.id || "");
        if (!/^a_w[1-4](d[1-4]|lab)_(intro|p[1-4]|end)(_[0-9]{1,2})?$/.test(id)) throw new HttpError(400, "unknown_activity");
        const score = Math.round(Number(body.score));
        if (!Number.isFinite(score) || score < 0 || score > 100) throw new HttpError(400, "bad_score");
        let text: Record<string, string> | undefined;
        if (body.texts && typeof body.texts === "object") {
          text = {};
          for (const [k, v] of Object.entries(body.texts as Record<string, unknown>).slice(0, 8)) {
            if (/^[a-z0-9_]{1,24}$/.test(k)) text[k] = String(v).slice(0, 1500);
          }
        }
        if (isAdmin) return json(200, { ok: true }); // instructor preview: nothing recorded
        const row = await ensureRow(user);
        const cur = row.exercises || {};
        if (!cur[id] && Object.keys(cur).filter((k) => k.startsWith("a_")).length >= 150) throw new HttpError(400, "too_many_activities");
        const prev = cur[id];
        const rec: Record<string, unknown> = {
          passed: !!(prev?.passed || score >= 70), best: Math.max(prev?.best || 0, score), attempts: (prev?.attempts || 0) + 1,
          date: new Date().toISOString(),
        };
        if (text) rec.text = text; else if (prev?.text) rec.text = prev.text;
        const saved = await writeRow(user, { exercises: { ...cur, [id]: rec } });
        return json(200, { progress: toProgress(saved) });
      }

      case "set-checkin": { // student opts in/out of the 90-day follow-up email
        needStudent();
        const optIn = !!body.opt_in;
        const email = String(body.email || "").trim();
        if (optIn && (email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))) throw new HttpError(400, "bad_email");
        await ensureRow(user);
        const saved = await writeRow(user, optIn ? { checkin_opt_in: true, checkin_email: email } : { checkin_opt_in: false, checkin_email: null });
        return json(200, { progress: toProgress(saved) });
      }

      case "admin-overview": {
        needAdmin();
        const [rows, subs, roster, rubrics, published] = await Promise.all([
          sb.from("student_progress").select("*"),
          sb.from("submissions").select("*").order("submitted_at", { ascending: false }).limit(2000),
          sb.from("student_access_codes").select("student_name,level").eq("is_admin", false).order("student_name"),
          sb.from("cst_rubric_scores").select("*"),
          getPublished(),
        ]);
        for (const r of [rows, subs, roster, rubrics]) if (r.error) throw r.error;
        const progress: Record<string, unknown> = {};
        for (const r of rows.data || []) progress[r.student_name] = view(r);
        return json(200, {
          roster: (roster.data || []).map((r) => r.student_name), levels: Object.fromEntries((roster.data || []).map((r) => [r.student_name, r.level])),
          progress, submissions: subs.data || [], rubrics: rubrics.data || [], settings: { published_quizzes: published },
        });
      }

      case "admin-unlock": {
        needAdmin();
        const name = await target();
        await ensureRow(name);
        await writeRow(name, { w2_unlocked: true });
        return json(200, { ok: true });
      }

      case "admin-set-attendance": {
        needAdmin();
        const name = await target();
        const lab = String(body.lab || "");
        if (!LABS.includes(lab)) throw new HttpError(400, "unknown_lab");
        const row = await ensureRow(name);
        const lab_attendance = { ...(row.lab_attendance || {}), [lab]: !!body.present };
        const patch: Row = { lab_attendance };
        if (lab === "lab1" && body.present) patch.w2_unlocked = true; // Lab 1 attendance unlocks Weeks 2-4
        const saved = await writeRow(name, patch);
        return json(200, { progress: toProgress(saved) });
      }

      case "admin-set-servsafe": {
        needAdmin();
        const name = await target();
        const row = await ensureRow(name);
        const cur = row.servsafe || {};
        const next = { ...cur };
        const score = (v: unknown) => (v === null || v === "" ? null : Number.isFinite(Number(v)) && Number(v) >= 0 && Number(v) <= 100 ? Math.round(Number(v)) : undefined);
        if ("practice_score" in body) { const v = score(body.practice_score); if (v === undefined) throw new HttpError(400, "bad_score"); next.practice_score = v; }
        if ("exam_score" in body) { const v = score(body.exam_score); if (v === undefined) throw new HttpError(400, "bad_score"); next.exam_score = v; }
        if ("exam_result" in body) {
          if (!["pending", "passed", "failed"].includes(String(body.exam_result))) throw new HttpError(400, "bad_result");
          next.exam_result = body.exam_result;
        }
        const saved = await writeRow(name, { servsafe: next, is_l2_eligible: eligible({ ...row, servsafe: next }) });
        return json(200, { progress: toProgress(saved) });
      }

      case "admin-save-rubric": {
        needAdmin();
        const name = await target();
        const lab = Number(body.lab ?? 1);
        if (!Number.isInteger(lab) || lab < 1 || lab > 4) throw new HttpError(400, "unknown_lab");
        const scores: Record<string, number> = {};
        for (const [k, v] of Object.entries((body.scores || {}) as Record<string, unknown>)) {
          if (!RUBRIC_KEYS.includes(k)) throw new HttpError(400, "unknown_criterion");
          const n = Number(v);
          if (!Number.isInteger(n) || n < 1 || n > 4) throw new HttpError(400, "bad_score");
          scores[k] = n;
        }
        const total = Object.values(scores).reduce((a, b) => a + b, 0);
        const complete = RUBRIC_KEYS.every((k) => k in scores);
        const { data, error } = await sb.from("cst_rubric_scores").upsert({
          student_name: name, lab, scores, total, band: complete ? band(total) : "Incomplete",
          notes: typeof body.notes === "string" ? body.notes.slice(0, 2000) : null, scored_by: user, scored_at: new Date().toISOString(),
        }, { onConflict: "student_name,lab" }).select().single();
        if (error) throw error;
        return json(200, { rubric: data });
      }

      case "admin-set-published": {
        needAdmin();
        const id = String(body.quiz_id || "");
        if (!QUIZ_IDS.includes(id)) throw new HttpError(400, "unknown_quiz");
        const cur = await getPublished();
        const next = body.published ? Array.from(new Set([...cur, id])) : cur.filter((x) => x !== id);
        const { error } = await sb.from("lms_settings")
          .upsert({ key: "published_quizzes", value: next, updated_at: new Date().toISOString() }, { onConflict: "key" });
        if (error) throw error;
        return json(200, { published_quizzes: next });
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
    console.error("lms-api-v2 error", action, e);
    return json(500, { error: "server_error" });
  }
});
