// End-to-end smoke test for index.html. Runs the real page in headless Chromium against MOCK Edge Functions and a
// MOCK signed-upload endpoint, so it needs no network and never touches production data. (The real functions were
// separately exercised against the live project — see docs/SECURITY.md.)
//
//   cd culinary-coach-lms && npm i -D playwright && node tools/e2e.mjs
//   BROWSER=firefox|webkit|chromium (default chromium; install with `npx playwright install <name>`)
//   SHOTS=dir  save screenshots there
import { chromium, firefox, webkit } from 'playwright';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const PAGE = pathToFileURL(path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'index.html')).href;
const engine = { chromium, firefox, webkit }[process.env.BROWSER || 'chromium'];
const SHOTS = process.env.SHOTS;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const launchOpts = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};

let pass = 0, fail = 0;
const ok = (cond, name, extra = '') => { cond ? pass++ : fail++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : '  ' + extra}`); };

// Mock credentials — deliberately NOT the real ones.
const CODES = { 'MOCK-TEST': { name: 'TEST STUDENT' }, 'MOCK-TAMEKA': { name: 'Tameka Green' }, 'MOCK-ADMIN': { name: 'Instructor', admin: true } };
const ROSTER = ['Tameka Green', 'TEST STUDENT', 'Zed Newstudent'];
const slug = s => s.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'x';
const FILE_LABELS = { w2d1: 'Business Concept Draft (1-page)', w2d4: 'Startup Budget + Projections', w4d1: 'Brand Mood Board + Brand Guide', w3d3: 'Supplier Contact List' };
const CONFIRM = new Set(['w1d1', 'w1d2', 'w1lab', 'w2lab', 'w3lab']);

function makeBackend() {
  const rows = new Map();     // student -> {quizzes, deliverables, w2_unlocked}
  const sessions = new Map(); // token -> {name, admin}
  const files = [];           // {path, mime, bytes, filename}
  const subs = [];            // submissions rows
  const calls = [];           // every function call {fn, action}
  const urls = [];            // every request URL the page made to Supabase
  const mode = { loginDown: false, apiDown: false, locked: false, storageFails: 0, recordFails: false, expireAll: false };
  const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*', 'content-type': 'application/json' };
  const reply = (route, status, body) => route.fulfill({ status, headers: CORS, body: JSON.stringify(body) });
  const row = n => { if (!rows.has(n)) rows.set(n, { quizzes: {}, deliverables: {}, w2_unlocked: false }); return rows.get(n); };

  async function login(route) {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    calls.push({ fn: 'validate-login' });
    if (mode.loginDown) return reply(route, 503, { message: 'down' });
    if (mode.locked) return reply(route, 429, { valid: false, locked: true });
    const code = String(JSON.parse(req.postData() || '{}').access_code || '').trim().toUpperCase();
    const hit = CODES[code];
    if (!hit) return reply(route, 401, { valid: false });
    const token = 'tok-' + Math.random().toString(16).slice(2);
    sessions.set(token, { name: hit.name, admin: !!hit.admin });
    return reply(route, 200, { valid: true, is_admin: !!hit.admin, student_name: hit.name, token, expires_at: new Date(Date.now() + 43200000).toISOString() });
  }

  async function api(route) {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    const b = JSON.parse(req.postData() || '{}');
    calls.push({ fn: 'lms-api', action: b.action });
    if (mode.apiDown) return reply(route, 503, { error: 'down' });
    if (mode.expireAll) sessions.clear();
    const s = sessions.get(b.token);
    if (!s) return reply(route, 401, { error: 'session_expired' });
    const prog = r => ({ quizzes: r.quizzes, deliverables: r.deliverables, w2_unlocked: r.w2_unlocked });
    switch (b.action) {
      case 'logout': sessions.delete(b.token); return reply(route, 200, { ok: true });
      case 'load': return reply(route, 200, { progress: prog(row(s.name)) });
      case 'save': {
        if (s.admin) return reply(route, 403, { error: 'admin_preview' });
        const r = row(s.name);
        for (const [k, v] of Object.entries(b.quizzes || {})) if (/^w[1-4]d[1-4]$/.test(k)) { const c = r.quizzes[k]; if (!c || v.score > c.score || (v.passed && !c.passed)) r.quizzes[k] = { ...v, passed: v.score >= 70 }; }
        for (const [k, v] of Object.entries(b.deliverables || {})) if (CONFIRM.has(k) && !r.deliverables[k]) r.deliverables[k] = { submitted: true, kind: 'confirm', date: v.date };
        return reply(route, 200, { progress: prog(r) });
      }
      case 'create-upload': {
        if (s.admin) return reply(route, 403, { error: 'admin_preview' });
        const label = FILE_LABELS[b.assignment];
        if (!label) return reply(route, 400, { error: 'unknown_assignment' });
        const ext = (/\.([a-z0-9]+)$/i.exec(b.filename) || [])[1]?.toLowerCase();
        if (!['pdf', 'docx', 'xlsx', 'png', 'doc', 'xls', 'ppt', 'pptx', 'csv', 'txt', 'jpg', 'jpeg', 'zip'].includes(ext)) return reply(route, 400, { error: 'file_type_not_allowed' });
        const dir = `${slug(s.name)}/${slug(label)}`;
        let name = b.filename.replace(/[^A-Za-z0-9._-]+/g, '_'), n = 2;
        while (files.some(f => f.path === `${dir}/${name}`)) name = name.replace(/(-v\d+)?(\.[^.]+)$/, `-v${n++}$2`);
        const p = `${dir}/${name}`;
        const mime = ext === 'pdf' ? 'application/pdf' : ext === 'png' ? 'image/png' : 'application/octet-stream';
        return reply(route, 200, { path: p, signedUrl: `https://mock.supabase.co/storage/v1/object/upload/sign/submissions/${p}?token=t`, mime });
      }
      case 'record-submission': {
        if (s.admin) return reply(route, 403, { error: 'admin_preview' });
        if (mode.recordFails) return reply(route, 500, { error: 'server_error' });
        const label = FILE_LABELS[b.assignment];
        const dir = `${slug(s.name)}/${slug(label)}`;
        if (!b.path.startsWith(dir + '/')) return reply(route, 403, { error: 'bad_path' });
        const f = files.find(x => x.path === b.path);
        if (!f) return reply(route, 409, { error: 'file_missing' });
        let sub = subs.find(x => x.file_path === b.path);
        if (!sub) {
          sub = { id: subs.length + 1, student_name: s.name, assignment_id: b.assignment, assignment: label, file_name: b.filename, file_path: b.path, file_size: f.bytes, file_type: f.mime, attempt: subs.filter(x => x.student_name === s.name && x.assignment_id === b.assignment).length + 1, submitted_at: new Date().toISOString() };
          subs.push(sub);
        }
        const rec = { submitted: true, kind: 'file', date: sub.submitted_at, fileName: sub.file_name, fileSize: sub.file_size, fileType: sub.file_type, filePath: sub.file_path, attempts: sub.attempt };
        row(s.name).deliverables[b.assignment] = rec;
        return reply(route, 200, { record: rec, progress: prog(row(s.name)) });
      }
      case 'admin-overview': {
        if (!s.admin) return reply(route, 403, { error: 'forbidden' });
        const progress = {}; for (const [n, r] of rows) progress[n] = prog(r);
        return reply(route, 200, { roster: ROSTER, progress, submissions: [...subs].reverse() });
      }
      case 'admin-unlock': {
        if (!s.admin) return reply(route, 403, { error: 'forbidden' });
        if (!ROSTER.includes(b.student_name)) return reply(route, 404, { error: 'unknown_student' });
        row(b.student_name).w2_unlocked = true;
        return reply(route, 200, { ok: true });
      }
      case 'admin-file-url': {
        if (!s.admin) return reply(route, 403, { error: 'forbidden' });
        if (!subs.some(x => x.file_path === b.path)) return reply(route, 404, { error: 'unknown_file' });
        return reply(route, 200, { url: 'https://mock.supabase.co/storage/v1/object/sign/submissions/' + b.path + '?token=dl' });
      }
      default: return reply(route, 400, { error: 'unknown_action' });
    }
  }

  async function signedPut(route) {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    if (mode.storageFails) return reply(route, mode.storageFails, { message: mode.storageFails === 400 ? 'mime type not supported' : 'nope' });
    const u = new URL(req.url());
    const p = decodeURIComponent(u.pathname.replace('/storage/v1/object/upload/sign/submissions/', ''));
    const buf = req.postDataBuffer() || Buffer.alloc(0);
    const text = buf.toString('latin1');
    const m = /name=""; filename="([^"]*)"\r\nContent-Type: ([^\r\n]+)\r\n\r\n/.exec(text);
    let bytes = -1, mime = '';
    if (m) {
      const start = m.index + m[0].length;
      const end = text.lastIndexOf('\r\n--');
      bytes = end - start; mime = m[2];
    }
    if (req.method() !== 'PUT' || !m) return reply(route, 400, { message: 'bad multipart' });
    files.push({ path: p, mime, bytes, filename: m[1] });
    return reply(route, 200, { Key: 'submissions/' + p });
  }
  return { rows, sessions, files, subs, calls, urls, mode, login, api, signedPut };
}

async function newPage(browser, be, opts = {}) {
  const ctx = opts.ctx || await browser.newContext({ viewport: opts.viewport || { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_|Save failed|Load failed/.test(m.text())) errors.push(m.text()); });
  page.on('request', r => { if (/supabase\.co/.test(r.url())) be.urls.push(r.method() + ' ' + r.url()); });
  await page.route('**/functions/v1/validate-login', be.login);
  await page.route('**/functions/v1/lms-api', be.api);
  await page.route('**/storage/v1/object/upload/sign/**', be.signedPut);
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await page.goto(PAGE);
  return { page, ctx, errors };
}
const login = async (page, code, name = '') => { await page.fill('#login-user', name); await page.fill('#login-pass', code); await page.click('#login-btn'); };
const text = (page, sel) => page.locator(sel).first().innerText();
const appUp = page => page.waitForSelector('#app', { state: 'visible' });

const browser = await engine.launch(launchOpts);
const be = makeBackend();

// ===== 1. login + source hygiene =====
{
  const { page, errors } = await newPage(browser, be);
  const src = await page.content();
  ok(!/ADMIN2026|CE2026|TEST0000/.test(src), 'no access codes or admin code anywhere in the page source');
  ok(!/eyJ[A-Za-z0-9_-]{20,}/.test(src) && !/service_role|SERVICE_ROLE/.test(src), 'no API keys / JWTs / service-role key in the page source');
  ok(!/const STUDENTS|const ADMIN_CODE/.test(src), 'no roster or admin constant in the page script');

  await login(page, 'WRONG');
  await page.waitForSelector('#login-error', { state: 'visible' });
  ok(/Invalid access code/.test(await text(page, '#login-error')), 'bad access code is rejected with a message');
  ok(await page.locator('#login-btn').isEnabled(), 'sign-in button re-enables after a bad code');
  be.mode.locked = true;
  await login(page, 'WRONG');
  await page.waitForFunction(() => /Too many wrong attempts/.test(document.getElementById('login-error').innerText));
  ok(true, 'throttled login (429) shows a "wait a few minutes" message');
  be.mode.locked = false;
  be.mode.loginDown = true;
  await login(page, 'MOCK-TEST');
  await page.waitForFunction(() => /Could not sign in right now/.test(document.getElementById('login-error').innerText));
  ok(true, 'server error at login shows a plain-English message');
  be.mode.loginDown = false;

  await page.fill('#login-pass', ''); await page.fill('#login-pass', 'mock-test'); await page.press('#login-pass', 'Enter');
  await appUp(page);
  ok(/TEST STUDENT/.test(await text(page, '#nav-name')), 'student login works (case-insensitive code, Enter key)');
  ok(be.calls.some(c => c.action === 'load'), 'progress is loaded through lms-api');

  // ===== 2. content / dates =====
  const body = await page.locator('#app').innerText();
  ok(/Oct 12/.test(await page.content()), 'new cohort dates present');
  ok(!/April|\bMay [0-9]|Spring 2026|Easter/.test(body), 'no leftover Spring-cohort dates in visible text');
  ok(/level i/i.test(await text(page, '.dash-header')), 'dashboard says Level I');
  ok(!/VCU/i.test(await page.content()), 'no VCU references anywhere on the page');
  ok(/Food Handler/.test(body) && !/Food Manager/.test(body), 'Level I credential is ServSafe Food Handler (no Manager references)');
  ok(/Entrepreneurship I\b(?! ?I)/.test(await text(page, '.nav-brand')), 'course is titled Culinary Entrepreneurship I');

  // ===== 3. links =====
  const hrefs = await page.$$eval('a.resource-item', as => as.map(a => a.href));
  ok(hrefs.length > 25, `resource links rendered as real anchors (${hrefs.length})`);
  ok(hrefs.every(h => /^https:\/\//.test(h)), 'every resource link is https');
  ok(!hrefs.some(h => /youtube\.com\/results/.test(h)), 'no YouTube search-result links remain');
  ok(!hrefs.some(h => /youtube\.com/.test(h) && !/watch\?v=[\w-]{11}$/.test(h)), 'every YouTube link is a direct watch URL');
  ok((await page.$$eval('a.resource-item', as => as.every(a => a.rel.includes('noopener')))), 'external links use rel=noopener');

  // ===== 4. gate =====
  await page.click('.sidebar-item[data-page="w2"]');
  ok(await page.locator('#page-gate').isVisible(), 'Week 2 is gated until the instructor unlocks it');

  // ===== 5. confirm-type deliverable =====
  await page.click('.sidebar-item[data-page="w1"]');
  await page.click('.day-card-header[onclick*="w1d1"]');
  ok(/NOT SUBMITTED/.test(await text(page, '#sp-w1d1')), 'untouched deliverable reads NOT SUBMITTED');
  ok(/To do/.test(await text(page, '#ds-w1d1')), 'day shows a "To do" text chip');
  await page.click('#sp-w1d1 .btn-submit-work');
  await page.waitForFunction(() => /SUBMITTED/.test(document.getElementById('sp-w1d1').innerText) && !/NOT/.test(document.getElementById('sp-w1d1').innerText));
  ok(!!be.rows.get('TEST STUDENT').deliverables.w1d1?.date, 'confirmation written to the server');
  ok(/1 of \d+ items done/.test(await text(page, '#wc1-count')), 'week count updates', await text(page, '#wc1-count'));
  ok(/In progress/.test(await text(page, '#ds-w1d1')), 'day with quiz still open reads "In progress" (not Done)');
  ok(!be.urls.some(u => /\/rest\/v1\//.test(u)), 'the browser never calls the database REST API directly');
  ok(be.urls.every(u => /\/functions\/v1\/(validate-login|lms-api)|\/storage\/v1\/object\/upload\/sign\//.test(u)), 'every Supabase call goes to an Edge Function or a signed upload URL', be.urls.filter(u => !/functions\/v1|upload\/sign/.test(u)).join(','));
  ok(errors.length === 0, 'no JS errors in student flow', errors.join(' | '));
  await page.context().close();
}

// ===== 6. file submission (week 2 pre-unlocked) =====
be.rows.get('TEST STUDENT').w2_unlocked = true;
{
  const { page, errors } = await newPage(browser, be);
  await login(page, 'MOCK-TEST');
  await appUp(page);
  await page.click('.sidebar-item[data-page="w2"]');
  ok(await page.locator('#page-w2').isVisible(), 'Week 2 opens once unlocked');
  await page.click('.day-card-header[onclick*="w2d1"]');
  const panel = '#sp-w2d1';
  ok(await page.locator(`${panel} .btn-choose`).isVisible(), 'assignment shows a Choose file button');
  ok(await page.locator(`${panel} .btn-submit-work`).count() === 0, 'Submit is not offered before a file is chosen');
  ok(/up to 25 MB/.test(await text(page, panel)), 'panel states accepted types and size limit');

  await page.setInputFiles(`${panel} input[type=file]`, { name: 'concept-draft.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 hello') });
  ok(/FILE SELECTED — NOT YET SUBMITTED/.test(await text(page, panel)), 'selected-but-unsubmitted is its own visible state');
  ok(/concept-draft\.pdf/.test(await text(page, panel)), 'chosen filename is shown');
  ok(!be.rows.get('TEST STUDENT').deliverables.w2d1 && be.files.length === 0 && !be.calls.some(c => c.action === 'create-upload'), 'nothing is requested, uploaded or saved until Submit is clicked');
  await page.click(`${panel} .btn-submit-work.big`);
  await page.waitForFunction(() => /SUBMITTED/.test(document.getElementById('sp-w2d1').innerText) && !/NOT|SELECTED/.test(document.getElementById('sp-w2d1').innerText));
  const rec = be.rows.get('TEST STUDENT').deliverables.w2d1;
  ok(be.files.length === 1 && be.files[0].bytes === 14 && be.files[0].mime === 'application/pdf', 'the real file bytes reach storage through the signed URL', JSON.stringify(be.files));
  ok(be.files[0].path === 'test-student/business-concept-draft-1-page/concept-draft.pdf', 'path follows {student-name}/{assignment-slug}/{filename}', be.files[0].path);
  ok(rec && rec.fileName === 'concept-draft.pdf' && rec.fileSize === 14 && rec.attempts === 1 && rec.filePath === be.files[0].path, 'submission recorded: name, size, time, attempt, path', JSON.stringify(rec));
  ok(be.subs.length === 1 && be.subs[0].student_name === 'TEST STUDENT' && be.subs[0].assignment_id === 'w2d1', 'a row is written to the submissions table');
  ok(/concept-draft\.pdf/.test(await text(page, panel)) && /20\d\d/.test(await text(page, panel)), 'submitted panel shows filename + timestamp');
  ok(!be.urls.some(u => /\/rest\/v1\//.test(u)), 'still no direct database calls');

  // resubmission (same file name) -> new object, nothing overwritten
  await page.click(`${panel} .link-btn`);
  await page.setInputFiles(`${panel} input[type=file]`, { name: 'concept-draft.pdf', mimeType: 'application/pdf', buffer: Buffer.from('v2') });
  await page.click(`${panel} .btn-submit-work.big`);
  await page.waitForFunction(() => /2 B/.test(document.getElementById('sp-w2d1').innerText));
  ok(be.files.length === 2 && be.files[1].path.endsWith('concept-draft-v2.pdf'), 'same filename again is saved as -v2 (nothing overwritten)', be.files.map(f => f.path).join(','));
  ok(be.rows.get('TEST STUDENT').deliverables.w2d1.attempts === 2, 'attempt count increments');

  // client-side rejections
  await page.click('.day-card-header[onclick*="w2d4"]');
  await page.setInputFiles('#sp-w2d4 input[type=file]', { name: 'empty.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(0) });
  ok(/empty/i.test(await text(page, '#sp-w2d4')), 'empty file is rejected with a reason');
  await page.setInputFiles('#sp-w2d4 input[type=file]', { name: 'virus.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('MZ') });
  ok(/not accepted/i.test(await text(page, '#sp-w2d4')), '.exe is refused with a reason');
  await page.setInputFiles('#sp-w2d4 input[type=file]', { name: 'huge.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(26 * 1048576, 1) });
  ok(/limit is 25 MB/.test(await text(page, '#sp-w2d4')), '26 MB file is refused with the limit stated');
  ok(be.files.length === 2, 'rejected files are never uploaded');
  await page.evaluate(() => submitDeliverable('w2d4'));
  ok(!be.rows.get('TEST STUDENT').deliverables.w2d4, 'assignment cannot be submitted without a file');

  await page.click('.sidebar-item[data-page="my-grades"]');
  ok(/concept-draft\.pdf/.test(await text(page, '#my-grades-body')), 'My Grades lists the submitted file');

  // ===== 6b. storage down -> loud failure, no record, retry works =====
  await page.click('.sidebar-item[data-page="w4"]');
  await page.click('.day-card-header[onclick*="w4d1"]');
  be.mode.storageFails = 500;
  const before = be.files.length;
  await page.setInputFiles('#sp-w4d1 input[type=file]', { name: 'moodboard.png', mimeType: 'image/png', buffer: Buffer.from('png') });
  await page.click('#sp-w4d1 .btn-submit-work.big');
  await page.waitForFunction(() => /UPLOAD FAILED/.test(document.getElementById('sp-w4d1').innerText));
  ok(!be.rows.get('TEST STUDENT').deliverables.w4d1 && be.files.length === before && !be.subs.some(s => s.assignment_id === 'w4d1'), 'failed upload creates NO submitted record');
  ok(await page.locator('#sp-w4d1 .btn-submit-work.big').isVisible(), 'student can retry without re-choosing the file');
  be.mode.storageFails = 0;
  await page.click('#sp-w4d1 .btn-submit-work.big');
  await page.waitForFunction(() => /SUBMITTED/.test(document.getElementById('sp-w4d1').innerText) && !/NOT|FAILED/.test(document.getElementById('sp-w4d1').innerText));
  ok(be.rows.get('TEST STUDENT').deliverables.w4d1?.fileName === 'moodboard.png' && be.files.length === before + 1, 'retry after outage uploads and records');

  // ===== 6c. uploaded but could not be recorded -> retry does NOT re-upload =====
  await page.click('.sidebar-item[data-page="w3"]');
  await page.click('.day-card-header[onclick*="w3d3"]');
  be.mode.recordFails = true;
  const filesBefore = be.files.length;
  await page.setInputFiles('#sp-w3d3 input[type=file]', { name: 'suppliers.xlsx', mimeType: 'application/vnd.ms-excel', buffer: Buffer.from('abc') });
  await page.click('#sp-w3d3 .btn-submit-work.big');
  await page.waitForFunction(() => /could not record it yet/.test(document.getElementById('sp-w3d3').innerText));
  ok(be.files.length === filesBefore + 1 && !be.rows.get('TEST STUDENT').deliverables.w3d3, 'file stored but state stays NOT SUBMITTED until the server confirms');
  be.mode.recordFails = false;
  await page.click('#sp-w3d3 .btn-submit-work.big');
  await page.waitForFunction(() => /SUBMITTED/.test(document.getElementById('sp-w3d3').innerText) && !/NOT|FAILED|could not/.test(document.getElementById('sp-w3d3').innerText));
  ok(be.files.length === filesBefore + 1 && be.rows.get('TEST STUDENT').deliverables.w3d3?.fileName === 'suppliers.xlsx', 'finishing the record does not upload the file a second time');

  // ===== 7. progress save failure -> warning -> retry (confirm-type) =====
  await page.click('.sidebar-item[data-page="w2"]');
  be.mode.apiDown = true;
  await page.click('.day-card-header[onclick*="w2lab"]');
  await page.click('#sp-w2lab .btn-submit-work');
  await page.waitForSelector('#sp-w2lab .sub-warn');
  ok(/has not synced yet/i.test(await text(page, '#sp-w2lab')), 'failed progress-save shows an unambiguous "not synced" warning');
  ok(/Not synced/.test(await text(page, '#sync-indicator')), 'nav sync indicator shows the failure');
  ok(!be.rows.get('TEST STUDENT').deliverables.w2lab, 'server unchanged while the API is down');
  be.mode.apiDown = false;
  await page.click('#sp-w2lab .sub-warn .link-btn');
  await page.waitForFunction(() => !document.querySelector('#sp-w2lab .sub-warn'));
  ok(!!be.rows.get('TEST STUDENT').deliverables.w2lab, 'retry pushes the queued confirmation');
  ok(errors.length === 0, 'no JS errors in submission flow', errors.join(' | '));
  await page.context().close();
}

// ===== 8. persistence across a fresh browser =====
{
  const { page } = await newPage(browser, be);
  await login(page, 'MOCK-TEST');
  await appUp(page);
  await page.click('.sidebar-item[data-page="w2"]');
  await page.click('.day-card-header[onclick*="w2d1"]');
  ok(/SUBMITTED/.test(await text(page, '#sp-w2d1')) && /concept-draft\.pdf/.test(await text(page, '#sp-w2d1')), 'a fresh browser sees the saved submission (read from the server)');
  await page.context().close();
}

// ===== 9. session expiry: back to login, work kept =====
{
  const { page } = await newPage(browser, be);
  await login(page, 'MOCK-TEST');
  await appUp(page);
  await page.click('.sidebar-item[data-page="w1"]');
  await page.click('.day-card-header[onclick*="w1d2"]');
  be.mode.expireAll = true;
  await page.click('#sp-w1d2 .btn-submit-work');
  await page.waitForSelector('#login-screen', { state: 'visible' });
  ok(/session ended/i.test(await text(page, '#login-error')), 'expired session returns to login with an explanation');
  ok(await page.evaluate(() => !!localStorage.getItem('ce_l1f26_cache_TEST STUDENT')), 'the unsynced work is still saved on the device');
  be.mode.expireAll = false;
  await login(page, 'MOCK-TEST');
  await appUp(page);
  await page.waitForTimeout(500);
  ok(!!be.rows.get('TEST STUDENT').deliverables.w1d2, 'next login pushes the work that was saved offline');
  await page.context().close();
}

// ===== 10. server unreachable must not wipe progress =====
{
  const { page } = await newPage(browser, be);
  await login(page, 'MOCK-TEST');
  await appUp(page);
  const snapshot = JSON.stringify(Object.keys(be.rows.get('TEST STUDENT').deliverables).sort());
  be.mode.apiDown = true;
  await page.evaluate(() => { currentUser && sbUpsert(currentUser); });
  await page.waitForTimeout(300);
  ok(JSON.stringify(Object.keys(be.rows.get('TEST STUDENT').deliverables).sort()) === snapshot, 'server data untouched while the API is down');
  be.mode.apiDown = false;
  await page.context().close();
}

// ===== 11. admin =====
{
  const { page, errors } = await newPage(browser, be);
  await login(page, 'MOCK-ADMIN');
  await appUp(page);
  ok(await page.locator('#admin-nav').isVisible(), 'admin sees the Instructor nav');
  await page.click('.sidebar-item[data-page="admin"]');
  await page.waitForSelector('#admin-body tr td strong');
  ok(/TEST STUDENT/.test(await text(page, '#admin-body')) && /Zed Newstudent/.test(await text(page, '#admin-body')), 'tracker roster comes from the server');
  await page.waitForSelector('#admin-files .btn-dl');
  ok(/concept-draft/.test(await text(page, '#admin-files')) && /test-student\//.test(await text(page, '#admin-files')), 'instructor sees submitted files with storage paths');
  ok(await page.locator('#admin-files .btn-dl').count() >= 4, 'each file has a Download button');
  await page.evaluate(() => { window.__opened = null; window.open = u => { window.__opened = u; }; });
  await page.click('#admin-files .btn-dl');
  await page.waitForFunction(() => window.__opened);
  ok(/object\/sign\/submissions\//.test(await page.evaluate(() => window.__opened)), 'Download opens a short-lived signed link');
  ok(/^\d+$/.test((await text(page, '#admin-count')).trim()), 'enrolled count is shown');
  await page.click('#admin-body button[data-name="Zed Newstudent"]');
  await page.waitForFunction(() => /Unlocked/.test(document.getElementById('admin-body').innerText.split('Zed Newstudent')[1] || ''));
  ok(be.rows.get('Zed Newstudent')?.w2_unlocked === true, 'unlock works for a student who has never signed in');
  ok(!be.rows.has('Instructor'), 'admin browsing never writes an instructor progress row');

  // admin preview upload writes nothing
  await page.click('.sidebar-item[data-page="w2"]');
  await page.click('.day-card-header[onclick*="w2d4"]');
  const nf = be.files.length;
  await page.setInputFiles('#sp-w2d4 input[type=file]', { name: 'preview.pdf', mimeType: 'application/pdf', buffer: Buffer.from('p') });
  await page.click('#sp-w2d4 .btn-submit-work.big');
  await page.waitForFunction(() => /SUBMITTED/.test(document.getElementById('sp-w2d4').innerText));
  ok(be.files.length === nf && !be.subs.some(s => s.student_name === 'Instructor'), 'instructor preview submits nothing to storage or the database');

  await page.evaluate(() => doLogout());
  ok(!(await page.evaluate(() => sessionToken)), 'sign out clears the session token');
  await login(page, 'MOCK-TEST');
  await appUp(page);
  ok(!(await page.locator('#admin-nav').isVisible()), 'Instructor nav is hidden when a student signs in after an admin');
  const forbidden = await page.evaluate(async () => { try { await api('admin-overview'); return 'allowed'; } catch (e) { return e.code; } });
  ok(forbidden === 'forbidden', 'a student session cannot call admin actions', forbidden);
  ok(errors.length === 0, 'no JS errors in admin flow', errors.join(' | '));
  await page.context().close();
}

// ===== 12. quiz retry works =====
{
  const { page } = await newPage(browser, be);
  await login(page, 'MOCK-TAMEKA');
  await appUp(page);
  await page.click('.sidebar-item[data-page="w1"]');
  await page.click('.day-card-header[onclick*="w1d1"]');
  await page.evaluate(() => { for (let i = 0; i < QUIZZES.w1d1.questions.length; i++) selectOption('w1d1', i, (QUIZZES.w1d1.questions[i].ans + 1) % 4); });
  await page.click('#qsub-w1d1');
  await page.waitForSelector('#quiz-w1d1-container .btn-retry');
  await page.click('#quiz-w1d1-container .btn-retry');
  ok(await page.locator('#qopt-w1d1-0-0').isEnabled(), 'Retry re-opens a failed quiz');
  await page.context().close();
}

// ===== 13. mobile =====
for (const vp of [{ width: 375, height: 760 }, { width: 360, height: 740 }, { width: 768, height: 900 }]) {
  const { page, errors } = await newPage(browser, be, { viewport: vp });
  const overflowLogin = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(overflowLogin <= 0, `${vp.width}px: login has no horizontal scroll`, overflowLogin);
  await login(page, 'MOCK-TEST');
  await appUp(page);
  for (const pg of ['dashboard', 'w1', 'w2', 'w3', 'w4', 'my-grades']) {
    await page.evaluate(p => showPage(p), pg);
    await page.evaluate(() => document.querySelectorAll('.day-card-body').forEach(b => b.classList.add('open')));
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(over <= 1, `${vp.width}px: ${pg} fits the screen`, `overflow ${over}px`);
    if (SHOTS && vp.width === 375) await page.screenshot({ path: `${SHOTS}/mobile-${pg}.png`, fullPage: true });
  }
  ok(errors.length === 0, `${vp.width}px: no JS errors`, errors.join(' | '));
  await page.context().close();
}

await browser.close();
console.log(`\n${pass} passed, ${fail} failed (${process.env.BROWSER || 'chromium'})`);
process.exit(fail ? 1 : 0);
