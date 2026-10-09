// Backend integration tests. They call the REAL Edge Functions (validate-login, lms-api-v2, send-checkins) running on a
// local Supabase stack (Postgres + Storage + PostgREST + Edge runtime) built from supabase/migrations, then read the
// database back with psql to prove the rows were really written. Nothing here touches the production project.
//
//   supabase start && supabase functions serve --no-verify-jwt &      (CI does this; see .github/workflows/ci.yml)
//   psql "$DB_URL" -f tests/backend/seed.sql
//   API_URL=http://127.0.0.1:54321 DB_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres ANON_KEY=... node tools/backend-tests.mjs
import { execFileSync } from 'node:child_process';
import { Reporter } from './lib/report.mjs';

const API = (process.env.API_URL || 'http://127.0.0.1:54321').replace(/\/$/, '');
const DB = process.env.DB_URL || 'postgresql://postgres:postgres@127.0.0.1:54322/postgres';
const ANON = process.env.ANON_KEY || '';
const R = new Reporter('Backend integration tests (Edge Functions + Postgres + Storage)', 'backend');
const ok = (c, n, x = '') => R.check(c, n, x);
const eq = (a, b, n) => R.check(JSON.stringify(a) === JSON.stringify(b), n, `got ${JSON.stringify(a)}, expected ${JSON.stringify(b)}`);

const sql = q => execFileSync('psql', [DB, '-At', '-v', 'ON_ERROR_STOP=1', '-c', q], { encoding: 'utf8' }).trim();
const jsonQ = q => JSON.parse(sql(`select coalesce(json_agg(t), '[]'::json) from (${q}) t`) || '[]');
async function call(name, body, headers = {}, method = 'POST') {
  const r = await fetch(`${API}/functions/v1/${name}`, { method, headers: { 'content-type': 'application/json', ...headers }, body: method === 'POST' ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined });
  let j = null; try { j = await r.json(); } catch { /* not json */ }
  return { status: r.status, body: j };
}
let ipN = 10;
const freshIp = () => `198.51.100.${ipN++}`;
async function login(code, ip = freshIp()) { return call('validate-login', { access_code: code }, { 'cf-connecting-ip': ip }); }
const api = (token, action, extra = {}) => call('lms-api-v2', { token, action, ...extra });
async function session(code) { const r = await login(code); if (r.status !== 200) throw new Error(`login ${code} failed ${r.status}`); return r.body.token; }
const rows = (table, where) => jsonQ(`select * from public.${table} where ${where}`);
const progress = name => rows('student_progress', `student_name = '${name}'`)[0];

async function upload(token, assignment, filename, bytes, claimSize) {
  const c = await api(token, 'create-upload', { assignment, filename, size: claimSize ?? bytes.length });
  if (c.status !== 200) return { c };
  const u = new URL(c.body.signedUrl); const base = new URL(API); u.protocol = base.protocol; u.host = base.host; // the function sees the stack by its docker name
  const fd = new FormData(); fd.append('cacheControl', '3600'); fd.append('', new Blob([bytes], { type: c.body.mime }), filename);
  const put = await fetch(u, { method: 'PUT', body: fd });
  return { c, put };
}
async function t(name, fn) { try { await fn(); } catch (e) { ok(false, `${name}: unexpected error`, String(e && e.stack || e).split('\n').slice(0, 3).join(' | ')); } }

const A = 'CI Student A', B = 'CI Student B', C = 'CI Student C', D = 'CI Student D', H = 'CI Student H';
const QUIZ_IDS = ['w1d1', 'w1d2', 'w1d3', 'w1d4', 'w2d1', 'w2d2', 'w2d3', 'w2d4', 'w3d1', 'w3d2', 'w3d3', 'w3d4', 'w4d1', 'w4d2'];

// ---------------------------------------------------------------------------------------------------------------
R.section('validate-login');
await t('login', async () => {
  const r = await login('CI-FIXTURE-A');
  ok(r.status === 200 && r.body.valid === true, 'a valid student code returns 200 and valid:true', JSON.stringify(r));
  eq(r.body.student_name, A, 'it returns the right student name');
  eq(r.body.level, 'L1', 'it returns the student level (L1)');
  eq(r.body.is_admin, false, 'a student is not an admin');
  ok(/^[0-9a-f]{64}$/.test(r.body.token || ''), 'it issues a random 256-bit session token');
  ok(new Date(r.body.expires_at) > new Date(Date.now() + 11 * 3600e3), 'the session lasts about 12 hours');
  eq(Number(sql(`select count(*) from public.lms_sessions where token_hash = '${r.body.token}'`)), 0, 'the database stores only a hash of the token, never the token');
  const sloppy = await login('  ci-fixture-a  ');
  ok(sloppy.status === 200 && sloppy.body.student_name === A, 'codes are case-insensitive and trimmed');
  const bad = await login('CI-FIXTURE-NOPE');
  ok(bad.status === 401 && bad.body.valid === false && !bad.body.token, 'an invalid code returns 401 with no token', JSON.stringify(bad));
  eq((await login('')).status, 401, 'an empty code returns 401');
  eq((await call('validate-login', { access_code: 12345 })).status, 401, 'a non-text code returns 401');
  eq((await call('validate-login', '{bad json', {})).status, 400, 'malformed JSON returns 400');
  eq((await call('validate-login', {}, {}, 'GET')).status, 405, 'GET is refused (405)');
  const adm = await login('CI-FIXTURE-ADMIN');
  ok(adm.status === 200 && adm.body.is_admin === true && adm.body.student_name === 'CI Instructor', 'the admin code returns is_admin:true', JSON.stringify(adm));
  ok(!rows('student_access_codes', "true").some(r => /CI-FIXTURE/i.test(r.access_code_hash)), 'access codes are stored as bcrypt hashes, not plaintext');
  sql(`update public.student_access_codes set level = 'L2' where student_name = '${H}'`);
  eq((await login('CI-FIXTURE-H')).body.level, 'L2', 'the level comes from the student record (L2 shows as L2)');
  sql(`update public.student_access_codes set level = 'L1' where student_name = '${H}'`);
});
await t('throttle', async () => {
  const ip = '192.0.2.77';
  for (let i = 0; i < 15; i++) await login('WRONG-' + i, ip);
  const locked = await login('CI-FIXTURE-A', ip);
  ok(locked.status === 429 && locked.body.locked === true, 'after 15 wrong codes from one address, even the right code is refused (429)', JSON.stringify(locked));
  eq((await login('CI-FIXTURE-A', freshIp())).status, 200, 'other addresses are not affected by the lockout');
});

// ---------------------------------------------------------------------------------------------------------------
R.section('Authorization on lms-api-v2');
const adminTok = await session('CI-FIXTURE-ADMIN');
const aTok = await session('CI-FIXTURE-A');
await t('auth', async () => {
  const ALL = ['load', 'save', 'create-upload', 'record-submission', 'set-checkin', 'submit-exercise', 'save-activity', 'admin-overview', 'admin-unlock', 'admin-file-url', 'admin-set-attendance', 'admin-set-servsafe', 'admin-save-rubric', 'admin-set-published'];
  const noTok = await Promise.all(ALL.map(a => call('lms-api-v2', { action: a })));
  ok(noTok.every(r => r.status === 401 && r.body.error === 'session_expired'), 'every action refuses a request with no session (401)', noTok.map(r => r.status).join(','));
  const junk = await Promise.all(ALL.map(a => api('0'.repeat(64), a)));
  ok(junk.every(r => r.status === 401), 'every action refuses a made-up token (401)');
  const adminOnly = ['admin-overview', 'admin-unlock', 'admin-file-url', 'admin-set-attendance', 'admin-set-servsafe', 'admin-save-rubric', 'admin-set-published'];
  const asStudent = await Promise.all(adminOnly.map(a => api(aTok, a, { student_name: B, lab: 'lab1', present: true, quiz_id: 'w1d1', published: true })));
  ok(asStudent.every(r => r.status === 403 && r.body.error === 'forbidden'), 'a student session is refused (403) on every instructor action', asStudent.map(r => r.status).join(','));
  const studentOnly = ['save', 'create-upload', 'record-submission', 'set-checkin'];
  const asAdmin = await Promise.all(studentOnly.map(a => api(adminTok, a, { quizzes: {}, assignment: 'w1d4', filename: 'x.txt', size: 1, path: 'x', opt_in: false })));
  ok(asAdmin.every(r => r.status === 403 && r.body.error === 'admin_preview'), 'the instructor session cannot write student data (403)', asAdmin.map(r => r.status).join(','));
  eq((await api(aTok, 'no-such-action')).status, 400, 'an unknown action returns 400');
  eq((await call('lms-api-v2', {}, {}, 'GET')).status, 405, 'GET is refused (405)');
  const spoof = await api(aTok, 'save', { student_name: B, quizzes: {} });
  ok(spoof.status === 200 && progress(B) === undefined, 'a student cannot act as someone else: the name in the request body is ignored');
  const tmp = await session('CI-FIXTURE-C');
  await api(tmp, 'logout');
  eq((await api(tmp, 'load')).status, 401, 'after logout the token no longer works');
});
await t('rls', async () => {
  if (!ANON) return ok(true, 'direct-database access check skipped (no anon key supplied)');
  const h = { apikey: ANON, authorization: `Bearer ${ANON}` };
  for (const table of ['student_progress', 'student_access_codes', 'submissions', 'lms_sessions', 'cst_rubric_scores', 'lms_settings']) {
    const r = await fetch(`${API}/rest/v1/${table}?select=*`, { headers: h }); const body = await r.json().catch(() => null);
    ok(r.status >= 400 || (Array.isArray(body) && body.length === 0), `the public key cannot read ${table} directly`, `${r.status} ${JSON.stringify(body).slice(0, 80)}`);
  }
  const w = await fetch(`${API}/rest/v1/student_progress`, { method: 'POST', headers: { ...h, 'content-type': 'application/json' }, body: JSON.stringify({ student_name: 'hacker' }) });
  ok(w.status >= 400, 'the public key cannot write student_progress directly', String(w.status));
  const up = await fetch(`${API}/storage/v1/object/submissions/hacker.txt`, { method: 'POST', headers: { ...h, 'content-type': 'text/plain' }, body: 'x' });
  ok(up.status >= 400, 'the public key cannot upload to the submissions bucket directly', String(up.status));
});

// ---------------------------------------------------------------------------------------------------------------
R.section('Progress and quiz scores');
await t('quizzes', async () => {
  const load = await api(aTok, 'load');
  ok(load.status === 200 && load.body.progress && Array.isArray(load.body.settings.published_quizzes), 'load returns the progress object and settings');
  const row = progress(A);
  ok(row && row.cohort === 'L1-F2026' && row.level === 'L1', 'the first sign-in creates the student row for this cohort at level L1', JSON.stringify(row && { c: row.cohort, l: row.level }));
  await api(aTok, 'save', { quizzes: { w1d1: { score: 100, correct: 10, total: 10 } } });
  eq(progress(A).quizzes, {}, 'a score for an unpublished quiz is ignored');
  const pub = await api(adminTok, 'admin-set-published', { quiz_id: 'w1d1', published: true });
  ok(pub.status === 200 && pub.body.published_quizzes.includes('w1d1'), 'the instructor can publish a quiz');
  eq(sql("select value::jsonb ? 'w1d1' from public.lms_settings where key = 'published_quizzes'"), 't', 'the published list is stored in the database');
  const s = await api(aTok, 'save', { quizzes: { w1d1: { score: 100, correct: 10, total: 10 } } });
  eq(s.status, 200, 'saving a score for a published quiz succeeds');
  const q = progress(A).quizzes.w1d1;
  ok(q && q.score === 100 && q.passed === true, 'the score is written to the student row and marked passed', JSON.stringify(q));
  await api(adminTok, 'admin-set-published', { quiz_id: 'w1d2', published: true });
  await api(aTok, 'save', { quizzes: { w1d2: { score: 60 } } });
  ok(progress(A).quizzes.w1d2.passed === false && progress(A).quizzes.w1d2.score === 60, '60% is saved but not passed (pass mark is 70%)');
  await api(aTok, 'save', { quizzes: { w1d2: { score: 90 } } });
  ok(progress(A).quizzes.w1d2.passed === true && progress(A).quizzes.w1d2.score === 90, 'a retry that passes replaces the failed score');
  await api(aTok, 'save', { quizzes: { w1d2: { score: 50 } } });
  eq(progress(A).quizzes.w1d2.score, 90, 'a later lower score never reduces the best score');
  await api(aTok, 'save', { quizzes: { w1d1: { score: 150 }, nope: { score: 100 } } });
  ok(progress(A).quizzes.w1d1.score === 100 && !progress(A).quizzes.nope, 'impossible scores and unknown quiz ids are ignored');
  await api(adminTok, 'admin-set-published', { quiz_id: 'w1d2', published: false });
  eq(sql("select value::jsonb ? 'w1d2' from public.lms_settings where key = 'published_quizzes'"), 'f', 'the instructor can unpublish a quiz');
  eq((await api(adminTok, 'admin-set-published', { quiz_id: 'bogus', published: true })).status, 400, 'publishing an unknown quiz id is refused');
});

// ---------------------------------------------------------------------------------------------------------------
R.section('Lab attendance');
await t('attendance', async () => {
  const bTok = await session('CI-FIXTURE-B'); await api(bTok, 'load');
  eq(progress(B).w2_unlocked, false, 'Weeks 2–4 start locked');
  const on = await api(adminTok, 'admin-set-attendance', { student_name: B, lab: 'lab1', present: true });
  ok(on.status === 200, 'the instructor can record Lab 1 attendance');
  ok(progress(B).lab_attendance.lab1 === true && progress(B).w2_unlocked === true, 'Lab 1 present sets the flag in the student row and unlocks Weeks 2–4', JSON.stringify(progress(B)));
  await api(adminTok, 'admin-set-attendance', { student_name: B, lab: 'lab1', present: false });
  ok(progress(B).lab_attendance.lab1 === false && progress(B).w2_unlocked === true, 'marking Lab 1 absent clears the flag but does not re-lock the weeks');
  const cTok = await session('CI-FIXTURE-C'); await api(cTok, 'load');
  await api(adminTok, 'admin-set-attendance', { student_name: C, lab: 'lab2', present: true });
  ok(progress(C).lab_attendance.lab2 === true && progress(C).w2_unlocked === false, 'only Lab 1 unlocks Weeks 2–4 (Lab 2 does not)');
  eq((await api(adminTok, 'admin-set-attendance', { student_name: C, lab: 'lab9', present: true })).status, 400, 'an unknown lab is refused');
  eq((await api(adminTok, 'admin-set-attendance', { student_name: 'Nobody Here', lab: 'lab1', present: true })).status, 404, 'an unknown student is refused (404)');
  await api(adminTok, 'admin-unlock', { student_name: C });
  eq(progress(C).w2_unlocked, true, 'the instructor can unlock Weeks 2–4 manually');
});

// ---------------------------------------------------------------------------------------------------------------
R.section('File submissions (storage + submissions table)');
await t('files', async () => {
  const bytes = Buffer.from('my honest map, version one');
  const u1 = await upload(aTok, 'w1d4', 'honest-map.txt', bytes);
  ok(u1.c.status === 200 && u1.c.body.path === 'L1/ci-student-a/honest-map/honest-map.txt', 'create-upload returns the path L1/{student}/{assignment}/{file}', JSON.stringify(u1.c.body));
  ok(u1.put && u1.put.status >= 200 && u1.put.status < 300, 'the file bytes upload through the signed URL', String(u1.put && u1.put.status));
  eq(Number(sql(`select count(*) from storage.objects where bucket_id = 'submissions' and name = 'L1/ci-student-a/honest-map/honest-map.txt'`)), 1, 'the object exists in the submissions bucket');
  const rec = await api(aTok, 'record-submission', { assignment: 'w1d4', path: u1.c.body.path, filename: 'honest-map.txt' });
  ok(rec.status === 200 && rec.body.record.attempts === 1, 'record-submission confirms the file', JSON.stringify(rec.body));
  const sub = rows('submissions', `student_name = '${A}' and assignment_id = 'w1d4'`)[0];
  ok(sub && sub.assignment === 'Honest Map' && sub.file_name === 'honest-map.txt' && sub.file_path === u1.c.body.path && Number(sub.file_size) === bytes.length && sub.attempt === 1, 'metadata is written to the submissions table (name, path, size, attempt)', JSON.stringify(sub));
  const pr = progress(A);
  ok(pr.deliverables.w1d4 && pr.deliverables.w1d4.fileName === 'honest-map.txt' && pr.krp_portfolio.honest_map, 'the student row shows the deliverable and the KRP portfolio entry');
  const u2 = await upload(aTok, 'w1d4', 'honest-map.txt', Buffer.from('v2'));
  ok(u2.c.body.path.endsWith('honest-map-v2.txt'), 'the same file name again becomes -v2 (nothing is overwritten)', u2.c.body.path);
  await api(aTok, 'record-submission', { assignment: 'w1d4', path: u2.c.body.path, filename: 'honest-map.txt' });
  eq(rows('submissions', `student_name = '${A}' and assignment_id = 'w1d4'`).length, 2, 'both attempts are kept as separate rows');
  eq(progress(A).deliverables.w1d4.attempts, 2, 'the attempt counter increments');
  const again = await api(aTok, 'record-submission', { assignment: 'w1d4', path: u2.c.body.path, filename: 'honest-map.txt' });
  ok(again.status === 200 && rows('submissions', `student_name = '${A}' and assignment_id = 'w1d4'`).length === 2, 'recording the same upload twice does not create a duplicate row');
  eq((await api(aTok, 'record-submission', { assignment: 'w1d4', path: 'L1/ci-student-a/honest-map/never-uploaded.txt', filename: 'x.txt' })).status, 409, 'a record cannot claim a file that was never uploaded (409)');
  eq((await api(aTok, 'record-submission', { assignment: 'w1d4', path: 'L1/ci-student-b/honest-map/x.txt', filename: 'x.txt' })).status, 403, 'a student cannot record into another student’s folder (403)');
  eq((await api(aTok, 'create-upload', { assignment: 'w1d4', filename: 'virus.exe', size: 10 })).status, 400, 'a .exe file is refused');
  eq((await api(aTok, 'create-upload', { assignment: 'w1d4', filename: 'big.pdf', size: 26 * 1048576 })).status, 413, 'a file over 25 MB is refused (413)');
  eq((await api(aTok, 'create-upload', { assignment: 'w1d4', filename: 'empty.pdf', size: 0 })).status, 400, 'an empty file is refused');
  eq((await api(aTok, 'create-upload', { assignment: 'zzz', filename: 'a.pdf', size: 5 })).status, 400, 'an unknown assignment is refused');
  const url = await api(adminTok, 'admin-file-url', { path: u1.c.body.path });
  ok(url.status === 200 && url.body.url, 'the instructor gets a short-lived download link');
  const dl = new URL(url.body.url); const base = new URL(API); dl.protocol = base.protocol; dl.host = base.host;
  const got = await fetch(dl); const gotText = await got.text();
  ok(got.status === 200 && gotText === bytes.toString(), 'the download returns exactly the uploaded bytes', `${got.status} ${gotText.slice(0, 40)}`);
  eq((await api(adminTok, 'admin-file-url', { path: 'L1/anything/else.txt' })).status, 404, 'download links are only issued for recorded files');
});

// ---------------------------------------------------------------------------------------------------------------
R.section('Level II eligibility (is_l2_eligible)');
await t('l2', async () => {
  const hTok = await session('CI-FIXTURE-H'); await api(hTok, 'load');
  const flag = () => progress(H).is_l2_eligible;
  eq(flag(), false, 'a new student is not eligible');
  for (const id of QUIZ_IDS) await api(adminTok, 'admin-set-published', { quiz_id: id, published: true });
  const all = Object.fromEntries(QUIZ_IDS.map(id => [id, { score: 100 }]));
  await api(hTok, 'save', { quizzes: all });
  ok(Object.keys(progress(H).quizzes).length === 14 && flag() === false, 'all 14 quizzes passed alone is not enough');
  await api(adminTok, 'admin-set-servsafe', { student_name: H, exam_result: 'passed', exam_score: 88 });
  eq(flag(), false, 'quizzes + ServSafe passed, but no Concept Brief yet: still not eligible');
  const up = await upload(hTok, 'w4lab', 'concept-brief.txt', Buffer.from('concept brief'));
  await api(hTok, 'record-submission', { assignment: 'w4lab', path: up.c.body.path, filename: 'concept-brief.txt' });
  eq(flag(), true, 'ServSafe passed + Concept Brief submitted + all 14 quizzes passed: is_l2_eligible = true');
  await api(adminTok, 'admin-set-servsafe', { student_name: H, exam_result: 'failed' });
  eq(flag(), false, 'ServSafe changed to not passed: the flag turns off');
  await api(adminTok, 'admin-set-servsafe', { student_name: H, exam_result: 'passed' });
  eq(flag(), true, 'ServSafe passed again: the flag turns back on');
  eq((await api(adminTok, 'admin-set-servsafe', { student_name: H, practice_score: 140 })).status, 400, 'a ServSafe score over 100 is refused');
  // a student who is missing just one quiz
  const dTok = await session('CI-FIXTURE-D'); await api(dTok, 'load');
  await api(adminTok, 'admin-set-servsafe', { student_name: D, exam_result: 'passed' });
  const up2 = await upload(dTok, 'w4lab', 'brief.txt', Buffer.from('brief'));
  await api(dTok, 'record-submission', { assignment: 'w4lab', path: up2.c.body.path, filename: 'brief.txt' });
  const almost = { ...all }; delete almost.w4d2;
  await api(dTok, 'save', { quizzes: almost });
  eq(progress(D).is_l2_eligible, false, 'one quiz missing: not eligible');
  await api(dTok, 'save', { quizzes: { w4d2: { score: 69 } } });
  eq(progress(D).is_l2_eligible, false, 'a failed last quiz (69%): still not eligible');
  await api(dTok, 'save', { quizzes: { w4d2: { score: 70 } } });
  eq(progress(D).is_l2_eligible, true, 'the last quiz at exactly 70%: eligible');
});

// ---------------------------------------------------------------------------------------------------------------
R.section('Exercises, activities, rubric, check-in, cohort rollover');
await t('misc', async () => {
  const wrong = await api(aTok, 'submit-exercise', { exercise_id: 'ex1', answers: { factor: 6, oil: 24, vinegar: 11, dijon: 6, salt: 6 } });
  ok(wrong.status === 200 && wrong.body.correct === 4 && wrong.body.passed === false && !JSON.stringify(wrong.body).includes('"ans"'), 'a scaling exercise is graded on the server (4 of 5) without revealing answers');
  const right = await api(aTok, 'submit-exercise', { exercise_id: 'ex1', answers: { factor: 6, oil: 24, vinegar: 12, dijon: 6, salt: 6 } });
  ok(right.body.passed === true && progress(A).exercises.ex1.passed === true && progress(A).exercises.ex1.attempts === 2, 'all five right: passed, attempts counted, stored in the row');
  eq((await api(aTok, 'submit-exercise', { exercise_id: 'nope', answers: {} })).status, 400, 'an unknown exercise is refused');
  const act = await api(aTok, 'save-activity', { id: 'a_w1d1_p3', score: 100, texts: { physical: 'Standing on a hard floor all day', 'bad key!': 'x' } });
  ok(act.status === 200 && progress(A).exercises.a_w1d1_p3.passed === true && progress(A).exercises.a_w1d1_p3.text.physical === 'Standing on a hard floor all day' && !('bad key!' in progress(A).exercises.a_w1d1_p3.text), 'a lesson activity result and written answer are saved (bad keys dropped)');
  await api(aTok, 'save-activity', { id: 'a_w1d1_p3', score: 40 });
  ok(progress(A).exercises.a_w1d1_p3.best === 100 && progress(A).exercises.a_w1d1_p3.text.physical, 'a lower later score keeps the best score and the saved text');
  eq((await api(aTok, 'save-activity', { id: 'evil', score: 100 })).status, 400, 'an invalid activity id is refused');
  eq((await api(aTok, 'save-activity', { id: 'a_w1d1_p1', score: 500 })).status, 400, 'an impossible activity score is refused');
  eq((await api(aTok, 'set-checkin', { opt_in: true, email: 'not-an-email' })).status, 400, 'check-in opt-in needs a valid email');
  await api(aTok, 'set-checkin', { opt_in: true, email: 'student@example.com' });
  ok(progress(A).checkin_opt_in === true && progress(A).checkin_email === 'student@example.com', 'check-in opt-in is stored');
  await api(aTok, 'set-checkin', { opt_in: false, email: '' });
  ok(progress(A).checkin_opt_in === false && progress(A).checkin_email === null, 'opting out clears the email');
  const scores = {}; for (let i = 1; i <= 5; i++) scores['s1_' + i] = 4; for (let i = 1; i <= 8; i++) scores['s2_' + i] = 3; for (let i = 1; i <= 6; i++) scores['s3_' + i] = 4; for (let i = 1; i <= 6; i++) scores['s4_' + i] = 3;
  const rub = await api(adminTok, 'admin-save-rubric', { student_name: A, lab: 1, scores, notes: 'ci' });
  ok(rub.status === 200 && rub.body.rubric.total === 20 + 24 + 24 + 18 && rub.body.rubric.band === 'Pass', 'the CST rubric total (86) and band (Pass) are computed on the server', JSON.stringify(rub.body.rubric));
  eq(Number(sql(`select total from public.cst_rubric_scores where student_name = '${A}' and lab = 1`)), 86, 'the rubric is stored in cst_rubric_scores');
  eq((await api(adminTok, 'admin-save-rubric', { student_name: A, lab: 1, scores: { s1_1: 9 } })).status, 400, 'a rubric score outside 1–4 is refused');
  const mine = await api(aTok, 'load');
  ok(mine.body.cst && mine.body.cst[0] && mine.body.cst[0].total === 86, 'the student can read their own rubric result');
  // a row left over from an earlier cohort is archived and reset on first sign-in
  sql(`insert into public.student_progress (student_name, quizzes, cohort, level) values ('${C}', '{"w1d1":{"score":100,"passed":true}}', 'OLD-COHORT', 'L1') on conflict (student_name) do update set quizzes = excluded.quizzes, cohort = 'OLD-COHORT'`);
  const cTok = await session('CI-FIXTURE-C'); await api(cTok, 'load'); await api(cTok, 'load');
  eq(progress(C).cohort, 'L1-F2026', 'a row from an earlier cohort is moved to this cohort on first sign-in');
  eq(progress(C).quizzes, {}, '…and starts clean');
  eq(Number(sql(`select count(*) from public.student_progress_archive where student_name = '${C}'`)), 1, '…and the old data is kept once in the archive table (not duplicated by a second load)');
  const ov = await api(adminTok, 'admin-overview');
  ok(ov.status === 200 && ov.body.roster.includes(A) && ov.body.levels[A] === 'L1' && Array.isArray(ov.body.submissions), 'the instructor overview lists the roster, levels and submissions');
});
await t('checkins', async () => {
  eq((await call('send-checkins', {})).status, 401, 'send-checkins refuses callers with no secret or instructor session (401)');
  eq((await call('send-checkins', {}, { 'x-cron-secret': 'wrong' })).status, 401, 'send-checkins refuses a wrong cron secret (401)');
  eq((await call('send-checkins', { token: aTok, test_to: 'a@example.com' })).status, 401, 'a student session cannot trigger the email function (401)');
  const secret = sql("select value->>'secret' from public.lms_settings where key = 'checkin_cron_secret'");
  ok(secret.length >= 32, 'a cron secret was generated by the migration');
  const cron = await call('send-checkins', {}, { 'x-cron-secret': secret });
  ok(cron.status === 200 || (cron.status === 503 && cron.body.error === 'resend_not_configured'), 'the scheduled run is accepted (waits until 90 days after Lab 4, or needs the Resend key)', JSON.stringify(cron));
  const test = await call('send-checkins', { token: adminTok, test_to: 'chef@example.com' });
  eq([test.status, test.body && test.body.error], [503, 'resend_not_configured'], 'the instructor test email reports clearly that the Resend key is missing');
  eq((await call('send-checkins', { token: adminTok, test_to: 'nope' })).status, 400, 'the test email needs a valid address');
});

process.exit(R.finish());
