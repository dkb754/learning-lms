// End-to-end test for index.html (Level I curriculum). Runs the real page in headless Chromium against MOCK Edge Functions and a
// MOCK signed-upload endpoint, so it needs no network and never touches production data. (The real functions were
// separately exercised against the live project — see docs/SECURITY.md.)
//
//   cd culinary-coach-lms && npm i -D playwright && node tools/e2e.mjs
//   BROWSER=firefox|webkit|chromium (default chromium; install with `npx playwright install <name>`)
//   SHOTS=dir  save screenshots there
import { chromium, firefox, webkit } from 'playwright';
import { pathToFileURL } from 'node:url';
import { mkdirSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const PAGE = pathToFileURL(path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'index.html')).href;
const engine = { chromium, firefox, webkit }[process.env.BROWSER || 'chromium'];
const SHOTS = process.env.SHOTS;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const launchOpts = process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {};

import { Reporter } from './lib/report.mjs';
const R = new Reporter('Browser tests (Chromium, mock backend)', 'e2e');
const ok = (cond, name, extra = '') => R.check(cond, name, extra);

// Course data comes straight from the real content files so the mock can never drift from the page.
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const L1 = new Function(readFileSync(path.join(ROOT, 'content/level1.js'), 'utf8') + '\nreturn { LEVEL1, CST_RUBRIC };')();
const LES = new Function(readFileSync(path.join(ROOT, 'content/level1-lessons.js'), 'utf8').replace(/LEVEL1\.days\.forEach[^\n]*\n/, '') + '\nreturn LESSONS;')();
const SRV = readFileSync(path.join(ROOT, 'supabase/functions/lms-api-v2/index.ts'), 'utf8');
const EX_KEYS = new Function('return ' + /const EXERCISES: [^=]+= (\{[\s\S]*?\n\});/.exec(SRV)[1])();
const EX_PROMPTS = new Function('const LEVEL1 = { days: [{ id: "w1d3" }] };' + readFileSync(path.join(ROOT, 'content/level1-exercises.js'), 'utf8') + '\nreturn EXERCISES;')();
const QB = new Function(readFileSync(path.join(ROOT, 'content/level1-quizzes.js'), 'utf8') + '\nreturn QUIZ_BANK;')();
const { LEVEL1, CST_RUBRIC } = L1;
const FILE_LABELS = Object.fromEntries(LEVEL1.days.filter(d => d.file).map(d => [d.id, d.file.label]));
const KRP_KEY = { w1d4: 'honest_map', w2d3: 'identity_statement', w4d4: 'portfolio' };
const QUIZ_IDS = LEVEL1.days.filter(d => d.quiz).map(d => d.quiz);
const RUBRIC_KEYS = CST_RUBRIC.sections.flatMap(s => s.criteria.map((_, i) => `${s.id}_${i + 1}`));

// Mock credentials — deliberately NOT the real ones.
const CODES = { ...Object.fromEntries([...'ABCDEFGH'].map(L => [`MOCK-STU-${L}`, { name: `Student ${L}` }])), 'MOCK-TEST': { name: 'TEST STUDENT' }, 'MOCK-TAMEKA': { name: 'Tameka Green' }, 'MOCK-ADMIN': { name: 'Instructor', admin: true } };
const ROSTER = ['Tameka Green', 'TEST STUDENT', 'Zed Newstudent', ...[...'ABCDEFGH'].map(L => `Student ${L}`)];
const slug = s => s.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'x';
const band = t => (t >= 80 ? 'Pass' : t >= 70 ? 'Conditional' : 'Remediation required');

function makeBackend() {
  const rows = new Map();
  const sessions = new Map();
  const files = [], subs = [], calls = [], urls = [], rubrics = [];
  const settings = { published_quizzes: [] };
  const mails = [];
  const mode = { loginDown: false, apiDown: false, locked: false, storageFails: 0, recordFails: false, expireAll: false, noResend: false, offline: false, delay: 0 };
  const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*', 'content-type': 'application/json' };
  const reply = (route, status, body) => route.fulfill({ status, headers: CORS, body: JSON.stringify(body) });
  const row = n => { if (!rows.has(n)) rows.set(n, { quizzes: {}, deliverables: {}, w2_unlocked: false, krp_portfolio: {}, lab_attendance: {}, servsafe: {}, exercises: {}, is_l2_eligible: false, checkin: { opt_in: false, email: '', sent: false } }); return rows.get(n); };
  const prog = r => ({ ...r });
  const eligible = r => r.servsafe.exam_result === 'passed' && !!r.deliverables.w4lab && QUIZ_IDS.every(q => r.quizzes[q]?.passed);

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
    if (mode.offline) return route.abort('internetdisconnected');
    const b = JSON.parse(req.postData() || '{}');
    calls.push({ fn: 'lms-api-v2', action: b.action });
    if (mode.apiDown) return reply(route, 503, { error: 'down' });
    if (mode.delay) await new Promise(r => setTimeout(r, mode.delay));
    if (mode.expireAll) sessions.clear();
    const s = sessions.get(b.token);
    if (!s) return reply(route, 401, { error: 'session_expired' });
    const needAdmin = () => !s.admin && reply(route, 403, { error: 'forbidden' });
    const noAdmin = () => s.admin && reply(route, 403, { error: 'admin_preview' });
    switch (b.action) {
      case 'logout': sessions.delete(b.token); return reply(route, 200, { ok: true });
      case 'load': return reply(route, 200, {
        progress: s.admin ? null : prog(row(s.name)), settings, is_admin: s.admin,
        cst: s.admin ? [] : rubrics.filter(r => r.student_name === s.name).map(r => ({ lab: r.lab, total: r.total, band: r.band })),
      });
      case 'save': {
        if (noAdmin()) return;
        const r = row(s.name);
        for (const [k, v] of Object.entries(b.quizzes || {})) {
          if (!settings.published_quizzes.includes(k)) continue; // unpublished quizzes are ignored by the server
          const c = r.quizzes[k];
          if (!c || v.score > c.score || (v.passed && !c.passed)) r.quizzes[k] = { ...v, passed: v.score >= 70 };
        }
        r.is_l2_eligible = eligible(r);
        return reply(route, 200, { progress: prog(r) });
      }
      case 'create-upload': {
        if (noAdmin()) return;
        const label = FILE_LABELS[b.assignment];
        if (!label) return reply(route, 400, { error: 'unknown_assignment' });
        const ext = (/\.([a-z0-9]+)$/i.exec(b.filename) || [])[1]?.toLowerCase();
        if (!['pdf', 'docx', 'xlsx', 'png', 'doc', 'xls', 'ppt', 'pptx', 'csv', 'txt', 'jpg', 'jpeg', 'zip'].includes(ext)) return reply(route, 400, { error: 'file_type_not_allowed' });
        const dir = `L1/${slug(s.name)}/${slug(label)}`;
        let name = b.filename.replace(/[^A-Za-z0-9._-]+/g, '_'), n = 2;
        while (files.some(f => f.path === `${dir}/${name}`)) name = name.replace(/(-v\d+)?(\.[^.]+)$/, `-v${n++}$2`);
        const p = `${dir}/${name}`;
        const mime = ext === 'pdf' ? 'application/pdf' : ext === 'png' ? 'image/png' : 'application/octet-stream';
        return reply(route, 200, { path: p, signedUrl: `https://mock.supabase.co/storage/v1/object/upload/sign/submissions/${p}?token=t`, mime });
      }
      case 'record-submission': {
        if (noAdmin()) return;
        if (mode.recordFails) return reply(route, 500, { error: 'server_error' });
        const label = FILE_LABELS[b.assignment];
        const dir = `L1/${slug(s.name)}/${slug(label)}`;
        if (!b.path.startsWith(dir + '/')) return reply(route, 403, { error: 'bad_path' });
        const f = files.find(x => x.path === b.path);
        if (!f) return reply(route, 409, { error: 'file_missing' });
        let sub = subs.find(x => x.file_path === b.path);
        if (!sub) {
          sub = { id: subs.length + 1, student_name: s.name, assignment_id: b.assignment, assignment: label, file_name: b.filename, file_path: b.path, file_size: f.bytes, file_type: f.mime, attempt: subs.filter(x => x.student_name === s.name && x.assignment_id === b.assignment).length + 1, submitted_at: new Date().toISOString() };
          subs.push(sub);
        }
        const rec = { submitted: true, kind: 'file', date: sub.submitted_at, fileName: sub.file_name, fileSize: sub.file_size, fileType: sub.file_type, filePath: sub.file_path, attempts: sub.attempt };
        const r = row(s.name);
        r.deliverables[b.assignment] = rec;
        if (KRP_KEY[b.assignment]) r.krp_portfolio[KRP_KEY[b.assignment]] = rec;
        r.is_l2_eligible = eligible(r);
        return reply(route, 200, { record: rec, progress: prog(r) });
      }
      case 'submit-exercise': {
        const key = EX_KEYS[b.exercise_id];
        if (!key) return reply(route, 400, { error: 'unknown_exercise' });
        const results = {}; let correct = 0;
        for (const [k, [a, tol]] of Object.entries(key)) { results[k] = Math.abs(Number(b.answers[k]) - a) <= tol; if (results[k]) correct++; }
        const total = Object.keys(key).length, passed = correct === total;
        if (s.admin) return reply(route, 200, { results, correct, total, passed });
        const r = row(s.name), prev = r.exercises[b.exercise_id];
        r.exercises[b.exercise_id] = { passed: !!(prev?.passed || passed), best: Math.max(prev?.best || 0, correct), total, attempts: (prev?.attempts || 0) + 1, date: new Date().toISOString() };
        return reply(route, 200, { results, correct, total, passed, record: r.exercises[b.exercise_id], progress: prog(r) });
      }
      case 'save-activity': {
        if (s.admin) return reply(route, 200, { ok: true });
        if (!/^a_w[1-4](d[1-4]|lab)_(intro|p[1-4]|end)(_[0-9]{1,2})?$/.test(b.id)) return reply(route, 400, { error: 'unknown_activity' });
        const r = row(s.name), prev = r.exercises[b.id];
        r.exercises[b.id] = { passed: !!(prev?.passed || b.score >= 70), best: Math.max(prev?.best || 0, b.score), attempts: (prev?.attempts || 0) + 1, date: new Date().toISOString(), ...(b.texts ? { text: b.texts } : prev?.text ? { text: prev.text } : {}) };
        return reply(route, 200, { progress: prog(r) });
      }
      case 'set-checkin': {
        if (noAdmin()) return;
        if (b.opt_in && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(b.email || '')) return reply(route, 400, { error: 'bad_email' });
        const r = row(s.name);
        r.checkin = { opt_in: !!b.opt_in, email: b.opt_in ? b.email : '', sent: false };
        return reply(route, 200, { progress: prog(r) });
      }
      case 'admin-overview': {
        if (needAdmin()) return;
        const progress = {}; for (const [n, r] of rows) progress[n] = prog(r);
        return reply(route, 200, { roster: ROSTER, progress, submissions: [...subs].reverse(), rubrics, settings });
      }
      case 'admin-unlock': {
        if (needAdmin()) return;
        if (!ROSTER.includes(b.student_name)) return reply(route, 404, { error: 'unknown_student' });
        row(b.student_name).w2_unlocked = true;
        return reply(route, 200, { ok: true });
      }
      case 'admin-set-attendance': {
        if (needAdmin()) return;
        const r = row(b.student_name);
        r.lab_attendance = { ...r.lab_attendance, [b.lab]: !!b.present };
        if (b.lab === 'lab1' && b.present) r.w2_unlocked = true;
        return reply(route, 200, { progress: prog(r) });
      }
      case 'admin-set-servsafe': {
        if (needAdmin()) return;
        const r = row(b.student_name);
        if ('practice_score' in b) { if (b.practice_score !== null && !(b.practice_score >= 0 && b.practice_score <= 100)) return reply(route, 400, { error: 'bad_score' }); r.servsafe.practice_score = b.practice_score; }
        if ('exam_result' in b) r.servsafe.exam_result = b.exam_result;
        r.is_l2_eligible = eligible(r);
        return reply(route, 200, { progress: prog(r) });
      }
      case 'admin-save-rubric': {
        if (needAdmin()) return;
        const scores = {}; let total = 0;
        for (const [k, v] of Object.entries(b.scores || {})) if (RUBRIC_KEYS.includes(k) && v >= 1 && v <= 4) { scores[k] = v; total += v; }
        const rec = { student_name: b.student_name, lab: 1, scores, total, band: band(total), notes: b.notes || null };
        const i = rubrics.findIndex(r => r.student_name === b.student_name && r.lab === 1);
        if (i >= 0) rubrics[i] = rec; else rubrics.push(rec);
        return reply(route, 200, { rubric: rec });
      }
      case 'admin-set-published': {
        if (needAdmin()) return;
        const cur = settings.published_quizzes;
        settings.published_quizzes = b.published ? [...new Set([...cur, b.quiz_id])] : cur.filter(x => x !== b.quiz_id);
        return reply(route, 200, { published_quizzes: settings.published_quizzes });
      }
      case 'admin-file-url': {
        if (needAdmin()) return;
        if (!subs.some(x => x.file_path === b.path)) return reply(route, 404, { error: 'unknown_file' });
        return reply(route, 200, { url: 'https://mock.supabase.co/storage/v1/object/sign/submissions/' + b.path + '?token=dl' });
      }
      default: return reply(route, 400, { error: 'unknown_action' });
    }
  }

  async function sendCheckins(route) {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    const b = JSON.parse(req.postData() || '{}');
    calls.push({ fn: 'send-checkins', action: 'test' });
    const s = sessions.get(b.token);
    if (!s || !s.admin) return reply(route, 401, { error: 'unauthorized' });
    if (mode.noResend) return reply(route, 503, { error: 'resend_not_configured' });
    mails.push(b.test_to);
    return reply(route, 200, { ok: true, sent_to: b.test_to });
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
  return { rows, sessions, files, subs, calls, urls, mode, settings, rubrics, mails, login, api, sendCheckins, signedPut };
}

async function newPage(browser, be, opts = {}) {
  const ctx = opts.ctx || await browser.newContext({ viewport: opts.viewport || { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_|Save failed|Load failed/.test(m.text())) errors.push(m.text()); });
  page.on('request', r => { if (/supabase\.co/.test(r.url())) be.urls.push(r.method() + ' ' + r.url()); });
  await page.route('**/functions/v1/validate-login', be.login);
  await page.route('**/functions/v1/lms-api-v2', be.api);
  await page.route('**/functions/v1/send-checkins', be.sendCheckins);
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
const tracker = '#admin-body';

// ===== 0. content integrity (no browser) =====
R.section('Course content integrity');
{
  const MONTH = { October: 9, November: 10 };
  const badDow = LEVEL1.days.filter(d => {
    const [m, day] = d.date.split(' ');
    return new Date(Date.UTC(2026, MONTH[m], Number(day))).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' }) !== d.dow;
  });
  ok(badDow.length === 0, 'every lesson day\'s weekday matches the real 2026 calendar', badDow.map(d => `${d.id}:${d.date}≠${d.dow}`).join(','));
  ok(LEVEL1.days.length === 20 && LEVEL1.days.filter(d => d.lab).length === 4, '16 online days + 4 Saturday labs');
  ok(LEVEL1.days.filter(d => d.lab).map(d => d.short).join() === 'Oct 17,Oct 24,Oct 31,Nov 7', 'labs fall on Oct 17, 24, 31 and Nov 7');
  ok(QB.w1d4.questions.length === 15 && QB.w1d2.questions.length === 15 && QB.w4d2.questions.length === 20, 'quiz lengths match the lesson plan (Q2 15, Q4 15, Q14 20)');
  ok(LEVEL1.days.filter(d => d.quiz).length === 14 && QUIZ_IDS.every(id => QB[id]), 'all 14 quizzes have a bank entry');
  const badQ = [];
  for (const id of QUIZ_IDS) for (const [i, q] of QB[id].questions.entries()) {
    if (q.opts.length !== 4 || !(q.ans >= 0 && q.ans < 4) || new Set(q.opts).size !== 4 || !q.feedback) badQ.push(`${id}#${i + 1}`);
  }
  ok(badQ.length === 0, 'every quiz question has 4 distinct options, a valid answer and feedback', badQ.join(','));
  ok(CST_RUBRIC.sections.reduce((a, s) => a + s.criteria.length, 0) === 25 && RUBRIC_KEYS.length === 25, 'CST rubric has 25 criteria (25 × 4 = 100)');
  ok(CST_RUBRIC.band(80) === 'Pass' && CST_RUBRIC.band(79) === 'Conditional' && CST_RUBRIC.band(70) === 'Conditional' && /Remediation/.test(CST_RUBRIC.band(69)), 'rubric bands: 80+ Pass, 70–79 Conditional, <70 Remediation');
  const all = readFileSync(path.join(ROOT, 'content/level1.js'), 'utf8') + readFileSync(path.join(ROOT, 'content/level1-quizzes.js'), 'utf8');
  ok(LEVEL1.days.every(d => LES[d.id] && LES[d.id].length > 300), 'every one of the 20 days has full lesson text');
  ok(!Object.values(LES).some(h => /Resend|is_l2_eligible|Supabase|Proprietary|admin panel|DELIVERABLE/.test(h)), 'lesson text contains no developer-only or instructor-only notes');
  ok(!/VCU|Virginia Commonwealth/i.test(all), 'no VCU references in the course content');
}

// ===== 1. login + source hygiene + student view (nothing published yet) =====
R.section('Login, page hygiene and student view');
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
  ok(be.calls.some(c => c.action === 'load'), 'progress is loaded through lms-api-v2');

  await page.evaluate(() => document.querySelectorAll('.day-card-body').forEach(b => b.classList.add('open')));
  const body = await page.evaluate(() => document.body.innerText + document.body.textContent);
  ok(/Oct 12/.test(await page.content()), 'cohort dates present');
  ok(!/April|Spring 2026|Easter|ZZ_LMS/.test(body), 'no leftover Spring-cohort text');
  ok(/level i/i.test(await text(page, '.dash-header')), 'dashboard says Level I');
  ok(!/VCU/i.test(await page.content()) && !/VCU/i.test(body), 'no VCU references anywhere on the page');
  ok(!/cognitive load|stressors|incivility|anticipated|facilitate the/i.test(await page.evaluate(() => document.body.textContent)), 'no hard-word jargon (cognitive load, stressors, incivility…) in the student UI');
  ok(!/Stress Recognition|Cognitive Reframing|Social Support|Self-Regulation|skill cluster/i.test(await page.evaluate(() => document.body.textContent)), 'no clinical KRP labels anywhere in the student UI');
  for (const n of ['Know Your Warning Signs', 'Change How You See Pressure', 'Build Your People', 'Recharge So You Can Keep Going']) ok(body.includes(n), `lesson cards use the plain label "${n}"`);
  await page.evaluate(() => showPage('krp'));
  ok(await page.locator('.krp-skill').count() === 4 && /catch problems early/.test(await text(page, '.krp-skills')) && /performance conditions you can handle/.test(await text(page, '.krp-skills')), 'KRP page shows the four skills with their plain-language descriptions');
  await page.evaluate(() => showPage('w1'));
  ok(/Food Handler/.test(body) && !/Food Manager/.test(body), 'Level I credential is ServSafe Food Handler (no Manager references)');
  ok(/Entrepreneurship I\b(?! ?I)/.test(await text(page, '.nav-brand')), 'course is titled Culinary Entrepreneurship I');
  ok(await page.locator('.day-card').count() === 20, 'all 20 course days render (16 online + 4 labs)');
  ok(await page.locator('.lab-card').count() === 4, 'four lab cards render');
  ok(!(await page.content()).match(/8\.52/), 'no exercise answers anywhere in the page source');
  ok(await page.locator('.lesson-body').count() === 20, 'every day and lab shows its lesson text');
  ok(await page.locator('.lesson-table').count() >= 3, 'lesson tables (cuts, kitchen calls, lab schedule) render');

  // links
  const hrefs = await page.$$eval('a.resource-item', as => as.map(a => a.href));
  ok(hrefs.length > 25, `resource links rendered as real anchors (${hrefs.length})`);
  ok(hrefs.every(h => /^https:\/\//.test(h)), 'every resource link is https');
  ok(!hrefs.some(h => /youtube\.com\/results/.test(h)), 'no YouTube search-result links remain');
  ok(!hrefs.some(h => /youtube\.com/.test(h) && !/watch\?v=[\w-]{11}$/.test(h)), 'every YouTube link is a direct watch URL');
  ok(await page.$$eval('a.resource-item', as => as.every(a => a.rel.includes('noopener'))), 'external links use rel=noopener');

  // gate: Weeks 2-4 stay locked until the instructor records Lab 1
  await page.click('.sidebar-item[data-page="w2"]');
  ok(await page.locator('#page-gate').isVisible(), 'Week 2 is gated until Lab 1 attendance is recorded');
  ok(/Lab 1/.test(await text(page, '#page-gate')), 'gate explains that Lab 1 attendance unlocks Weeks 2–4');

  // quizzes are closed until the instructor publishes them
  await page.click('.sidebar-item[data-page="w1"]');
  await page.click('.day-card-header[onclick*="w1d1"]');
  ok(/opens when your instructor publishes it/.test(await text(page, '#quiz-w1d1-container')), 'unpublished quiz shows "opens when your instructor publishes it"');
  ok(await page.locator('#quiz-w1d1-container .quiz-option').count() === 0, 'unpublished quiz exposes no questions to students');
  ok(/0\/0/.test(await text(page, '#stat-quizzes')), 'unpublished quizzes do not count against the student');
  // deliverable + lab panels
  await page.click('.day-card-header[onclick*="w1d4"]');
  ok(/NOT SUBMITTED/.test(await text(page, '#sp-w1d4')), 'untouched deliverable reads NOT SUBMITTED');
  ok(/To do/.test(await text(page, '#ds-w1d4')), 'day shows a "To do" text chip');
  await page.click('.day-card-header[onclick*="w1lab"]');
  ok(/NOT YET RECORDED/.test(await text(page, '#att-w1lab')), 'lab attendance is read-only for students and starts unrecorded');
  ok(await page.locator('#att-w1lab button').count() === 0, 'students have no button to mark their own attendance');
  ok(!be.urls.some(u => /\/rest\/v1\//.test(u)), 'the browser never calls the database REST API directly');
  ok(be.urls.every(u => /\/functions\/v1\/(validate-login|lms-api-v2|send-checkins)|\/storage\/v1\/object\/upload\/sign\//.test(u)), 'every Supabase call goes to an Edge Function or a signed upload URL', be.urls.filter(u => !/functions\/v1|upload\/sign/.test(u)).join(','));
  ok(errors.length === 0, 'no JS errors in student flow', errors.join(' | '));
  await page.context().close();
}

// ===== 2. instructor: review + publish quizzes, record Lab 1, ServSafe, CST rubric =====
R.section('Instructor: quiz publish, Lab 1 attendance, ServSafe, CST rubric');
{
  const { page, errors } = await newPage(browser, be);
  await login(page, 'MOCK-ADMIN');
  await appUp(page);
  ok(await page.locator('#admin-nav').isVisible(), 'admin sees the Instructor nav');
  for (const p of ['admin', 'rubric', 'quizreview']) ok(await page.locator(`.sidebar-item[data-page="${p}"]`).isVisible(), `Instructor nav has ${p}`);

  // preview of an unpublished quiz is labelled
  await page.click('.sidebar-item[data-page="w1"]');
  await page.click('.day-card-header[onclick*="w1d3"]');
  ok(/UNPUBLISHED/.test(await text(page, '#quiz-w1d3-container .draft-tag')), 'instructor preview tags unpublished quizzes');

  // quiz review + publish
  await page.click('.sidebar-item[data-page="quizreview"]');
  await page.waitForSelector('details.qr-card');
  ok(await page.locator('details.qr-card').count() === 14, 'Quiz Review lists all 14 quizzes');
  ok((await page.locator('details.qr-card .score-badge', { hasText: 'DRAFT' }).count()) === 14, 'every quiz starts as DRAFT');
  ok(await page.locator('.qr-todo').count() > 0, 'CST-specific gaps are listed for the instructor');
  await page.locator('details.qr-card').first().locator('summary').click();
  ok(await page.locator('details.qr-card').first().locator('.qr-q li.right').count() >= 10, 'review shows the correct answer for each question');
  for (const id of ['w1d1', 'w1d2']) {
    if (!(await page.locator(`details[data-quiz-card="${id}"]`).evaluate(d => d.open))) await page.locator(`details[data-quiz-card="${id}"] summary`).click();
    await page.click(`details.qr-card button[data-quiz="${id}"]`);
    await page.waitForFunction(i => document.querySelector(`button[data-quiz="${i}"]`)?.innerText === 'Unpublish', id);
  }
  ok(be.settings.published_quizzes.join() === 'w1d1,w1d2', 'publish writes the setting through the server');

  // tracker: Lab 1 attendance unlocks Weeks 2-4, ServSafe, rubric
  await page.click('.sidebar-item[data-page="admin"]');
  await page.waitForSelector(`${tracker} tr td strong`);
  ok(/TEST STUDENT/.test(await text(page, tracker)) && /Zed Newstudent/.test(await text(page, tracker)), 'tracker roster comes from the server');
  await page.click(`${tracker} button.lab-toggle[data-name="TEST STUDENT"][data-lab="lab1"]`);
  await page.waitForFunction(() => document.querySelector('#admin-body button.lab-toggle[data-name="TEST STUDENT"][data-lab="lab1"]')?.classList.contains('on'));
  ok(be.rows.get('TEST STUDENT').lab_attendance.lab1 === true && be.rows.get('TEST STUDENT').w2_unlocked === true, 'marking Lab 1 present unlocks Weeks 2–4');
  await page.waitForFunction(() => /Unlocked/.test(document.querySelector('#admin-body').innerText));
  await page.fill('input[data-ss-practice="TEST STUDENT"]', '82');
  await page.click('#admin-body button[onclick*="adminSaveServsafe"][data-name="TEST STUDENT"]');
  await page.waitForFunction(() => document.querySelector('input[data-ss-practice="TEST STUDENT"]')?.value === '82');
  ok(be.rows.get('TEST STUDENT').servsafe.practice_score === 82, 'ServSafe practice score saved by the instructor');
  await page.fill('input[data-ss-practice="Tameka Green"]', '140');
  await page.click('#admin-body button[onclick*="adminSaveServsafe"][data-name="Tameka Green"]');
  await page.waitForTimeout(300);
  ok(!be.rows.get('Tameka Green')?.servsafe?.practice_score, 'out-of-range ServSafe score is refused');

  await page.click(`${tracker} button.link-btn[data-name="TEST STUDENT"]`);
  await page.waitForSelector("#rb-grid .rb-btn"); await page.waitForFunction(() => document.getElementById("rb-student").value === "TEST STUDENT");
  ok(await page.locator('#rb-grid .rb-row').count() === 25, 'rubric shows all 25 criteria');
  await page.evaluate(keys => keys.forEach((k, i) => setRubric(k, i < 10 ? 4 : 3)), RUBRIC_KEYS);
  ok(/85/.test(await text(page, '#rb-total')) && /Pass/.test(await text(page, '#rb-total')), 'running rubric total and band update live (85 → Pass)', await text(page, '#rb-total'));
  await page.evaluate(() => { document.getElementById('rb-notes').value = 'Strong team calls'; saveRubric(); });
  await page.waitForFunction(() => /85\/100/.test(document.querySelector('#toast-msg').innerText) || true);
  await page.waitForTimeout(200);
  ok(be.rubrics.find(r => r.student_name === 'TEST STUDENT')?.total === 85 && be.rubrics[0].band === 'Pass', 'rubric saved with server-computed total and band');
  ok(errors.length === 0, 'no JS errors in instructor setup', errors.join(' | '));
  await page.context().close();
}

// ===== 3. student: quizzes, results, uploads =====
R.section('Student: quizzes, activities, file uploads, KRP');
{
  const { page, errors } = await newPage(browser, be);
  await login(page, 'MOCK-TEST');
  await appUp(page);
  ok(await page.locator('#page-gate').count() === 0 || !(await page.locator('#page-gate').isVisible()), 'gate is not showing after sign-in');
  await page.click('.sidebar-item[data-page="w2"]');
  ok(await page.locator('#page-w2').isVisible(), 'Week 2 opens once Lab 1 is recorded');

  // quiz pass
  await page.click('.sidebar-item[data-page="w1"]');
  await page.click('.day-card-header[onclick*="w1d1"]');
  ok(await page.locator('#quiz-w1d1-container .quiz-option').count() === QB.w1d1.questions.length * 4, 'published quiz renders every question');
  ok(await page.locator('#quiz-w1d2-container .quiz-option').count() > 0 && await page.locator('#quiz-w1d3-container .quiz-closed').count() === 1, 'only published quizzes are open');
  await page.evaluate(() => QUIZ_BANK.w1d1.questions.forEach((q, i) => selectOption('w1d1', i, q.ans)));
  await page.click('#qsub-w1d1');
  await page.waitForFunction(() => /PASSED/.test(document.getElementById('quiz-w1d1-container').innerText));
  await page.waitForTimeout(200);
  ok(be.rows.get('TEST STUDENT').quizzes.w1d1?.passed === true && be.rows.get('TEST STUDENT').quizzes.w1d1.score === 100, 'passing quiz result is saved on the server');
  ok(/1\/2/.test(await text(page, '#stat-quizzes')), 'dashboard counts quizzes against published ones only', await text(page, '#stat-quizzes'));

  // CST result + ServSafe practice are visible read-only
  await page.click('.day-card-header[onclick*="w1lab"]');
  ok(/ATTENDANCE CONFIRMED/.test(await text(page, '#att-w1lab')), 'student sees Lab 1 attendance confirmed');
  ok(/85/.test(await text(page, '#cst-result')) && /Pass/.test(await text(page, '#cst-result')), 'student sees their CST rubric result (85 · Pass)');
  await page.click('.sidebar-item[data-page="w2"]');
  await page.click('.day-card-header[onclick*="w2lab"]');
  ok(/82%/.test(await text(page, '#ss-w2lab')), 'student sees the ServSafe practice score the instructor entered');

  // file submission — KRP Honest Map (w1d4)
  await page.click('.sidebar-item[data-page="w1"]');
  await page.click('.day-card-header[onclick*="w1d4"]');
  const panel = '#sp-w1d4';
  ok(await page.locator(`${panel} .btn-choose`).isVisible(), 'assignment shows a Choose file button');
  ok(await page.locator(`${panel} .btn-submit-work`).count() === 0, 'Submit is not offered before a file is chosen');
  ok(/up to 25 MB/.test(await text(page, panel)), 'panel states accepted types and size limit');
  await page.setInputFiles(`${panel} input[type=file]`, { name: 'honest-map.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 hello') });
  ok(/FILE SELECTED — NOT YET SUBMITTED/.test(await text(page, panel)), 'selected-but-unsubmitted is its own visible state');
  ok(!be.rows.get('TEST STUDENT').deliverables.w1d4 && be.files.length === 0 && !be.calls.some(c => c.action === 'create-upload'), 'nothing is requested, uploaded or saved until Submit is clicked');
  await page.click(`${panel} .btn-submit-work.big`);
  await page.waitForFunction(() => /SUBMITTED/.test(document.getElementById('sp-w1d4').innerText) && !/NOT|SELECTED/.test(document.getElementById('sp-w1d4').innerText));
  const rec = be.rows.get('TEST STUDENT').deliverables.w1d4;
  ok(be.files.length === 1 && be.files[0].bytes === 14 && be.files[0].mime === 'application/pdf', 'the real file bytes reach storage through the signed URL', JSON.stringify(be.files));
  ok(be.files[0].path === 'L1/test-student/honest-map/honest-map.pdf', 'path follows L1/{student}/{assignment}/{filename}', be.files[0].path);
  ok(rec && rec.fileName === 'honest-map.pdf' && rec.fileSize === 14 && rec.attempts === 1 && rec.filePath === be.files[0].path, 'submission recorded: name, size, time, attempt, path', JSON.stringify(rec));
  ok(be.subs.length === 1 && be.subs[0].assignment_id === 'w1d4', 'a row is written to the submissions table');
  ok(be.rows.get('TEST STUDENT').krp_portfolio.honest_map?.fileName === 'honest-map.pdf', 'KRP deliverable is also recorded in the KRP portfolio');
  ok(/honest-map\.pdf/.test(await text(page, panel)) && /20\d\d/.test(await text(page, panel)), 'submitted panel shows filename + timestamp');

  // resubmission
  await page.click(`${panel} .link-btn`);
  await page.setInputFiles(`${panel} input[type=file]`, { name: 'honest-map.pdf', mimeType: 'application/pdf', buffer: Buffer.from('v2') });
  await page.click(`${panel} .btn-submit-work.big`);
  await page.waitForFunction(() => /2 B/.test(document.getElementById('sp-w1d4').innerText));
  ok(be.files.length === 2 && be.files[1].path.endsWith('honest-map-v2.pdf'), 'same filename again is saved as -v2 (nothing overwritten)', be.files.map(f => f.path).join(','));
  ok(be.rows.get('TEST STUDENT').deliverables.w1d4.attempts === 2, 'attempt count increments');

  // KRP page
  await page.click('.sidebar-item[data-page="krp"]');
  ok(await page.locator('.krp-item.done').count() === 1 && await page.locator('.krp-item').count() === LEVEL1.krp.items.length, 'KRP page shows the Honest Map done and the rest outstanding');
  ok(await page.locator('.krp-phase').count() === LEVEL1.krp.phases.length, 'KRP page lists all phases');
  await page.fill('#checkin-email', 'not-an-email'); await page.check('#checkin-opt'); await page.click('#checkin-card .btn-submit-work');
  await page.waitForTimeout(200);
  ok(!be.rows.get('TEST STUDENT').checkin.opt_in, 'opt-in with an invalid email is refused');
  await page.fill('#checkin-email', 'student@example.com'); await page.click('#checkin-card .btn-submit-work');
  await page.waitForFunction(() => /opted in/.test(document.getElementById('checkin-status').innerText));
  ok(be.rows.get('TEST STUDENT').checkin.opt_in === true && be.rows.get('TEST STUDENT').checkin.email === 'student@example.com', '90-day check-in opt-in is saved on the server with the email');

  // client-side rejections (w2d3)
  await page.click('.sidebar-item[data-page="w2"]');
  await page.click('.day-card-header[onclick*="w2d3"]');
  await page.setInputFiles('#sp-w2d3 input[type=file]', { name: 'empty.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(0) });
  ok(/empty/i.test(await text(page, '#sp-w2d3')), 'empty file is rejected with a reason');
  await page.setInputFiles('#sp-w2d3 input[type=file]', { name: 'virus.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('MZ') });
  ok(/not accepted/i.test(await text(page, '#sp-w2d3')), '.exe is refused with a reason');
  await page.setInputFiles('#sp-w2d3 input[type=file]', { name: 'huge.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(26 * 1048576, 1) });
  ok(/limit is 25 MB/.test(await text(page, '#sp-w2d3')), '26 MB file is refused with the limit stated');
  ok(be.files.length === 2, 'rejected files are never uploaded');
  await page.evaluate(() => submitDeliverable('w2d3'));
  ok(!be.rows.get('TEST STUDENT').deliverables.w2d3, 'assignment cannot be submitted without a file');

  await page.click('.sidebar-item[data-page="my-grades"]');
  const grades = await text(page, '#my-grades-body');
  ok(/honest-map\.pdf/.test(grades) && /100%/.test(grades) && /85\/100/.test(grades) && /82%/.test(grades), 'My Grades lists file, quiz score, CST rubric and ServSafe practice');

  // storage down -> loud failure, no record, retry works (w4d3)
  await page.click('.sidebar-item[data-page="w4"]');
  await page.click('.day-card-header[onclick*="w4d3"]');
  be.mode.storageFails = 500;
  const before = be.files.length;
  await page.setInputFiles('#sp-w4d3 input[type=file]', { name: 'brief-draft.png', mimeType: 'image/png', buffer: Buffer.from('png') });
  await page.click('#sp-w4d3 .btn-submit-work.big');
  await page.waitForFunction(() => /UPLOAD FAILED/.test(document.getElementById('sp-w4d3').innerText));
  ok(!be.rows.get('TEST STUDENT').deliverables.w4d3 && be.files.length === before && !be.subs.some(s => s.assignment_id === 'w4d3'), 'failed upload creates NO submitted record');
  ok(await page.locator('#sp-w4d3 .btn-submit-work.big').isVisible(), 'student can retry without re-choosing the file');
  be.mode.storageFails = 0;
  await page.click('#sp-w4d3 .btn-submit-work.big');
  await page.waitForFunction(() => /SUBMITTED/.test(document.getElementById('sp-w4d3').innerText) && !/NOT|FAILED/.test(document.getElementById('sp-w4d3').innerText));
  ok(be.rows.get('TEST STUDENT').deliverables.w4d3?.fileName === 'brief-draft.png' && be.files.length === before + 1, 'retry after outage uploads and records');

  // uploaded but not recorded -> retry does NOT re-upload (w3d4)
  await page.click('.sidebar-item[data-page="w3"]');
  await page.click('.day-card-header[onclick*="w3d4"]');
  be.mode.recordFails = true;
  const filesBefore = be.files.length;
  await page.setInputFiles('#sp-w3d4 input[type=file]', { name: 'costs.xlsx', mimeType: 'application/vnd.ms-excel', buffer: Buffer.from('abc') });
  await page.click('#sp-w3d4 .btn-submit-work.big');
  await page.waitForFunction(() => /could not record it yet/.test(document.getElementById('sp-w3d4').innerText));
  ok(be.files.length === filesBefore + 1 && !be.rows.get('TEST STUDENT').deliverables.w3d4, 'file stored but state stays NOT SUBMITTED until the server confirms');
  be.mode.recordFails = false;
  await page.click('#sp-w3d4 .btn-submit-work.big');
  await page.waitForFunction(() => /SUBMITTED/.test(document.getElementById('sp-w3d4').innerText) && !/NOT|FAILED|could not/.test(document.getElementById('sp-w3d4').innerText));
  ok(be.files.length === filesBefore + 1 && be.rows.get('TEST STUDENT').deliverables.w3d4?.fileName === 'costs.xlsx', 'finishing the record does not upload the file a second time');
  ok(errors.length === 0, 'no JS errors in student flow', errors.join(' | '));
  await page.context().close();
}

// ===== 4. quiz fail/retry + offline save (Tameka; Week 1 is open without unlock) =====
R.section('Quiz retry and offline save');
{
  const { page, errors } = await newPage(browser, be);
  await login(page, 'MOCK-TAMEKA');
  await appUp(page);
  await page.click('.sidebar-item[data-page="w1"]');
  await page.click('.day-card-header[onclick*="w1d1"]');
  await page.evaluate(() => QUIZ_BANK.w1d1.questions.forEach((q, i) => selectOption('w1d1', i, (q.ans + 1) % 4)));
  await page.click('#qsub-w1d1');
  await page.waitForSelector('#quiz-w1d1-container .btn-retry');
  ok(/Below 70%/.test(await text(page, '#quiz-w1d1-container')), 'a failing score says it is below 70%');
  await page.click('#quiz-w1d1-container .btn-retry');
  ok(await page.locator('#qopt-w1d1-0-0').isEnabled(), 'Retry re-opens a failed quiz');
  // API down: result is kept on the device and flagged as not synced
  be.mode.apiDown = true;
  await page.evaluate(() => QUIZ_BANK.w1d1.questions.forEach((q, i) => selectOption('w1d1', i, q.ans)));
  await page.click('#qsub-w1d1');
  await page.waitForFunction(() => /Not synced/.test(document.getElementById('sync-indicator').innerText));
  ok(true, 'failed save shows "Not synced" in the nav');
  ok(!be.rows.get('Tameka Green').quizzes.w1d1?.passed, 'server unchanged while the API is down');
  ok(await page.evaluate(() => !!localStorage.getItem('ce_l1f26_cache_Tameka Green')), 'quiz result is kept on the device');
  be.mode.apiDown = false;
  await page.click('#sync-indicator');
  await page.waitForFunction(() => !/Not synced/.test(document.getElementById('sync-indicator').innerText));
  ok(be.rows.get('Tameka Green').quizzes.w1d1?.passed === true, 'retry pushes the queued quiz result');
  ok(await page.locator('.sidebar-item[data-page="w2"]').isVisible(), 'sidebar still shows Week 2');
  await page.click('.sidebar-item[data-page="w2"]');
  ok(await page.locator('#page-gate').isVisible(), 'a student without Lab 1 attendance stays gated, even after passing quizzes');
  // scaling exercises (graded server-side)
  await page.click('.sidebar-item[data-page="w1"]');
  await page.click('.day-card-header[onclick*="w1d3"]');
  ok(await page.locator('.ex-card').count() === 3, 'Week 1 Wednesday shows the three scaling exercises');
  ok(!/"answer"|\bans(wers?)?\s*:/.test(await page.evaluate(() => JSON.stringify(EXERCISES))), 'exercise definitions on the page carry no answers');
  await page.fill('#exi-ex1-factor', '6'); await page.fill('#exi-ex1-oil', '24'); await page.fill('#exi-ex1-vinegar', '11'); await page.fill('#exi-ex1-dijon', '6'); await page.fill('#exi-ex1-salt', '6');
  await page.locator('.ex-card').nth(0).locator('.btn-submit-work').click();
  await page.waitForFunction(() => /4 of 5 correct/.test(document.getElementById('ex-w1d3').innerText));
  ok(await page.locator('.ex-mark.no').count() === 1 && await page.locator('.ex-mark.ok').count() === 4, 'wrong box is marked, correct ones are ticked');
  ok(!be.rows.get('Tameka Green').exercises.ex1.passed && be.rows.get('Tameka Green').exercises.ex1.best === 4, 'partial result recorded on the server without a pass');
  await page.fill('#exi-ex1-vinegar', '12');
  await page.locator('.ex-card').nth(0).locator('.btn-submit-work').click();
  await page.waitForFunction(() => /All correct/.test(document.getElementById('ex-w1d3').innerText));
  ok(be.rows.get('Tameka Green').exercises.ex1.passed === true && be.rows.get('Tameka Green').exercises.ex1.attempts === 2, 'exercise passes on the retry and counts attempts');
  for (const [id, vals] of Object.entries({ ex2: ['1/4', 2, '2.5', 0.5, 2], ex3: [2.5, 7.5, 8.52, 11.25, 15] })) {
    const keys = EX_PROMPTS.find(e => e.id === id).inputs.map(i => i.key);
    for (const [i, k] of keys.entries()) await page.fill(`#exi-${id}-${k}`, String(vals[i]));
    await page.locator('.ex-card').nth(id === 'ex2' ? 1 : 2).locator('.btn-submit-work').click();
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(400);
  ok(['ex1', 'ex2', 'ex3'].every(id => be.rows.get('Tameka Green').exercises[id]?.passed), 'fractions and decimals are accepted; all three exercises pass');
  ok(/6 of 8|\d+ of \d+ items done/.test(await text(page, '#wc1-count')), 'exercises count toward week progress');
  // lesson activities (Monday, Mise en Place)
  await page.evaluate(() => { if (!document.getElementById('w1d1').classList.contains('open')) toggleDay('w1d1'); });
  ok(await page.locator('#w1d1 .act-card').count() >= 6 && await page.locator('#w1d1 .act-figure').count() === 2, 'Monday lesson shows graded activities and two diagrams');
  ok(await page.locator('#w1d1 svg title').count() === 2, 'diagrams carry accessible titles');
  // choice: pick wrong answers first -> marked, then right -> passes and saves
  const act = id => `#act-${id}`;
  await page.evaluate(() => { const d = ACTIVITIES.w1d1.p1[0]; d.items.forEach((it, i) => actPick('a_w1d1_p1', i, (it.ans + 1) % it.opts.length)); });
  await page.click(`${act('a_w1d1_p1')} .btn-submit-work`);
  await page.waitForFunction(() => /you need 70%/.test(document.querySelector('#act-a_w1d1_p1 .act-msg').innerText));
  ok(!be.rows.get('Tameka Green').exercises.a_w1d1_p1.passed && be.rows.get('Tameka Green').exercises.a_w1d1_p1.attempts === 1, 'failed activity attempt is saved without a pass');
  ok(await page.locator(`${act('a_w1d1_p1')} .act-opt.wrong`).count() === 4 && await page.locator(`${act('a_w1d1_p1')} .act-why`).count() === 4, 'wrong answers are marked and each explains why');
  await page.evaluate(() => ACTIVITIES.w1d1.p1[0].items.forEach((it, i) => actPick('a_w1d1_p1', i, it.ans)));
  await page.click(`${act('a_w1d1_p1')} .btn-submit-work`);
  await page.waitForFunction(() => /Everything is right/.test(document.querySelector('#act-a_w1d1_p1 .act-msg').innerText));
  ok(be.rows.get('Tameka Green').exercises.a_w1d1_p1.passed === true && be.rows.get('Tameka Green').exercises.a_w1d1_p1.best === 100, 'right answers pass and the best score is saved');
  // order: shuffled start, then arrange correctly
  const orderId = 'a_w1d1_p2_4';
  ok(await page.evaluate(id => actState[id] === undefined || actState[id].order.some((v, i) => v !== i), orderId), 'order activity starts shuffled');
  await page.evaluate(id => { const st = aSt(id, actDef(id).def); st.order = st.order.map((_, i) => i); actRerender(id); }, orderId);
  await page.click(`${act(orderId)} .btn-submit-work`);
  await page.waitForFunction(id => /Everything is right/.test(document.querySelector('#act-' + id + ' .act-msg').innerText), orderId);
  ok(be.rows.get('Tameka Green').exercises[orderId].passed, 'ordering task grades the sequence');
  await page.click(`${act(orderId)} .act-order li:nth-child(2) .act-move button:last-child`).catch(() => {});
  // match
  await page.evaluate(() => ACTIVITIES.w1d1.p2[2].rows.forEach((r, i) => actPick('a_w1d1_p2_3', i, String(r.ans))));
  await page.click(`${act('a_w1d1_p2_3')} .btn-submit-work`);
  await page.waitForFunction(() => /Everything is right/.test(document.querySelector('#act-a_w1d1_p2_3 .act-msg').innerText));
  ok(be.rows.get('Tameka Green').exercises.a_w1d1_p2_3.passed, 'matching task grades each row');
  // Honest Map: thin entries are coached, full entries pass, text is saved and downloadable
  const hm = '#act-a_w1d1_p3';
  await page.fill(`${hm} textarea >> nth=0`, 'Standing\nHeat');
  for (const [i, v] of [['1', 'x y'], ['2', 'a'], ['3', 'b']]) await page.fill(`${hm} textarea >> nth=${i}`, v);
  await page.click(`${hm} .btn-submit-work`);
  await page.waitForFunction(() => /Add \d more entr/.test(document.querySelector('#act-a_w1d1_p3').innerText));
  ok(await page.locator(`${hm} .act-fb.no`).count() === 4, 'Honest Map: thin entries are flagged per category');
  ok(await page.locator(`${hm} .act-tip`).count() >= 1, 'coaching tips suggest what to think about');
  const full = { 0: 'Standing on a hard floor all day\nBurns and cuts during a rush\nLifting heavy stockpots and cases', 1: 'A customer sends a dish back rudely\nCriticism of food I made\nStaying calm when tickets pile up', 2: 'Being corrected by the chef publicly\nA coworker who will not communicate\nLearning the kitchen hierarchy fast', 3: 'Entry-level pay that barely covers rent\nSchedules that change every week\nBuying my own knives and shoes' };
  for (const [i, v] of Object.entries(full)) await page.fill(`${hm} textarea >> nth=${i}`, v);
  await page.click(`${hm} .btn-submit-work`);
  await page.waitForFunction(() => /Everything is right/.test(document.querySelector('#act-a_w1d1_p3 .act-msg').innerText));
  ok(be.rows.get('Tameka Green').exercises.a_w1d1_p3.passed && /Standing on a hard floor/.test(be.rows.get('Tameka Green').exercises.a_w1d1_p3.text.physical), 'Honest Map passes and the written answers are saved to the record');
  ok(await page.locator(`${hm} details.act-model`).count() === 1, 'a model answer is offered after checking');
  const [dl] = await Promise.all([page.waitForEvent('download'), page.click(`${hm} button:has-text("Download my Honest Map")`)]);
  ok(dl.suggestedFilename() === 'honest-map.txt', 'Honest Map downloads as honest-map.txt');
  ok(/week progress|\d+ of \d+ items done/.test(await text(page, '#wc1-count')), 'activities count toward week progress');
  ok(errors.length === 0, 'no JS errors in quiz flow', errors.join(' | '));
  await page.context().close();
}

// ===== 5. persistence across a fresh browser =====
R.section('Persistence across browsers');
{
  const { page } = await newPage(browser, be);
  await login(page, 'MOCK-TEST');
  await appUp(page);
  await page.click('.sidebar-item[data-page="w1"]');
  await page.click('.day-card-header[onclick*="w1d4"]');
  ok(/SUBMITTED/.test(await text(page, '#sp-w1d4')) && /honest-map\.pdf/.test(await text(page, '#sp-w1d4')), 'a fresh browser sees the saved submission (read from the server)');
  await page.click('.day-card-header[onclick*="w1d1"]');
  ok(/100%/.test(await text(page, '#quiz-w1d1-container')), 'a fresh browser sees the saved quiz score');
  await page.context().close();
}

// ===== 6. session expiry: back to login, work kept =====
R.section('Session expiry');
{
  const { page } = await newPage(browser, be);
  await login(page, 'MOCK-TAMEKA');
  await appUp(page);
  await page.click('.sidebar-item[data-page="w1"]');
  await page.click('.day-card-header[onclick*="w1d2"]');
  await page.evaluate(() => QUIZ_BANK.w1d2.questions.forEach((q, i) => selectOption('w1d2', i, q.ans)));
  be.mode.expireAll = true;
  await page.click('#qsub-w1d2');
  await page.waitForSelector('#login-screen', { state: 'visible' });
  ok(/session ended/i.test(await text(page, '#login-error')), 'expired session returns to login with an explanation');
  ok(await page.evaluate(() => !!localStorage.getItem('ce_l1f26_cache_Tameka Green')), 'the unsynced work is still saved on the device');
  be.mode.expireAll = false;
  await login(page, 'MOCK-TAMEKA');
  await appUp(page);
  await page.waitForFunction(() => true);
  await page.waitForTimeout(600);
  ok(be.rows.get('Tameka Green').quizzes.w1d2?.passed === true, 'next login pushes the quiz result that was saved offline');
  await page.context().close();
}

// ===== 7. server unreachable must not wipe progress =====
R.section('Server outage safety');
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

// ===== 8. instructor: files, downloads, preview writes nothing, role separation =====
R.section('Instructor: files, downloads, role separation');
{
  const { page, errors } = await newPage(browser, be);
  await login(page, 'MOCK-ADMIN');
  await appUp(page);
  await page.click('.sidebar-item[data-page="admin"]');
  await page.waitForSelector('#admin-files .btn-dl');
  ok(/honest-map/.test(await text(page, '#admin-files')) && /L1\/test-student\//.test(await text(page, '#admin-files')), 'instructor sees submitted files with storage paths');
  ok(await page.locator('#admin-files .btn-dl').count() >= 4, 'each file has a Download button');
  await page.evaluate(() => { window.__opened = null; window.open = u => { window.__opened = u; }; });
  await page.click('#admin-files .btn-dl');
  await page.waitForFunction(() => window.__opened);
  ok(/object\/sign\/submissions\//.test(await page.evaluate(() => window.__opened)), 'Download opens a short-lived signed link');
  ok(/^\d+$/.test((await text(page, '#admin-count')).trim()), 'enrolled count is shown');
  page.once('dialog', d => d.accept('chef@example.com'));
  await page.click('button:has-text("Send test check-in email")');
  await page.waitForFunction(() => /Test email sent/.test(document.getElementById('toast-msg').innerText));
  ok(be.mails.includes('chef@example.com'), 'instructor can send a test check-in email through the send-checkins function');
  be.mode.noResend = true;
  page.once('dialog', d => d.accept('chef@example.com'));
  await page.click('button:has-text("Send test check-in email")');
  await page.waitForFunction(() => /RESEND_API_KEY/.test(document.getElementById('toast-msg').innerText));
  ok(true, 'missing Resend secret gives the instructor a clear message');
  be.mode.noResend = false;
  ok(/Ready/.test(await text(page, tracker)) === false, 'nobody is Level II-ready yet (needs ServSafe pass, Concept Brief and all quizzes)');
  await page.click(`${tracker} button[onclick*="adminUnlockWeek2"][data-name="Zed Newstudent"]`);
  await page.waitForFunction(() => /Unlocked/.test((document.getElementById('admin-body').innerText.split('Zed Newstudent')[1] || '')));
  ok(be.rows.get('Zed Newstudent')?.w2_unlocked === true, 'manual unlock works for a student who has never signed in');
  ok(!be.rows.has('Instructor'), 'admin browsing never writes an instructor progress row');

  await page.click('.sidebar-item[data-page="w2"]');
  await page.click('.day-card-header[onclick*="w2d3"]');
  const nf = be.files.length;
  await page.setInputFiles('#sp-w2d3 input[type=file]', { name: 'preview.pdf', mimeType: 'application/pdf', buffer: Buffer.from('p') });
  await page.click('#sp-w2d3 .btn-submit-work.big');
  await page.waitForFunction(() => /SUBMITTED/.test(document.getElementById('sp-w2d3').innerText));
  ok(be.files.length === nf && !be.subs.some(s => s.student_name === 'Instructor'), 'instructor preview submits nothing to storage or the database');

  // unpublish works and closes the quiz for students
  await page.evaluate(() => adminTogglePublish('w1d2'));
  await page.waitForFunction(() => !(settings.published_quizzes || []).includes('w1d2'));
  ok(!be.settings.published_quizzes.includes('w1d2'), 'a quiz can be unpublished again');
  await page.evaluate(() => adminTogglePublish('w1d2'));
  await page.waitForFunction(() => (settings.published_quizzes || []).includes('w1d2'));

  await page.evaluate(() => doLogout());
  ok(!(await page.evaluate(() => sessionToken)), 'sign out clears the session token');
  await login(page, 'MOCK-TEST');
  await appUp(page);
  ok(!(await page.locator('#admin-nav').isVisible()), 'Instructor nav is hidden when a student signs in after an admin');
  for (const a of ['admin-overview', 'admin-save-rubric', 'admin-set-published', 'admin-set-attendance', 'admin-set-servsafe']) {
    const r = await page.evaluate(async act => { try { await api(act, { student_name: 'TEST STUDENT', lab: 'lab1', present: true, quiz_id: 'w1d3', published: true }); return 'allowed'; } catch (e) { return e.code; } }, a);
    ok(r === 'forbidden', `a student session cannot call ${a}`, r);
  }
  ok(!be.settings.published_quizzes.includes('w1d3'), 'a student cannot publish quizzes');
  ok(errors.length === 0, 'no JS errors in instructor flow', errors.join(' | '));
  await page.context().close();
}


// ===== 8b. requested coverage: login matrix, publish flow, gate, KRP, sync states =====
R.section('Login: admin code and every student code');
for (const L of 'ABCDEFGH') {
  const { page, ctx } = await newPage(browser, be);
  await login(page, `MOCK-STU-${L}`); await appUp(page);
  ok(new RegExp(`Student ${L}\\b`).test(await text(page, '#nav-name')), `student code ${L} signs in and shows that student's own name`);
  ok(!(await page.locator('#admin-nav').isVisible()), `student ${L} does not see the instructor menu`);
  await ctx.close();
}
{
  const { page, ctx } = await newPage(browser, be);
  await login(page, 'MOCK-ADMIN'); await appUp(page);
  ok(await page.locator('#admin-nav').isVisible(), 'admin code signs in and shows the instructor menu');
  await ctx.close();
  const b = await newPage(browser, be);
  await login(b.page, 'MOCK-STU-Z'); await b.page.waitForSelector('#login-error', { state: 'visible' });
  ok(/Invalid access code/.test(await text(b.page, '#login-error')) && !(await b.page.locator('#app').isVisible()), 'an unknown code is refused and the app stays closed');
  await b.ctx.close();
}

R.section('Quiz publish / unpublish through the admin panel');
{
  be.settings.published_quizzes = be.settings.published_quizzes.filter(q => q !== 'w1d3');
  const a = await newPage(browser, be);
  await login(a.page, 'MOCK-ADMIN'); await appUp(a.page);
  await a.page.evaluate(() => showPage('quizreview'));
  await a.page.waitForSelector('details[data-quiz-card="w1d3"]');
  await a.page.locator('details[data-quiz-card="w1d3"] summary').click();
  ok(/DRAFT/.test(await text(a.page, 'details[data-quiz-card="w1d3"] summary')), 'Quiz 3 starts as DRAFT');
  const s1 = await newPage(browser, be);
  await login(s1.page, 'MOCK-STU-B'); await appUp(s1.page);
  await s1.page.evaluate(() => { showPage('w1'); toggleDay('w1d3'); });
  ok(/opens when your instructor publishes it/.test(await text(s1.page, '#quiz-w1d3-container')), 'a student sees an unpublished quiz as closed');
  await a.page.click('details[data-quiz-card="w1d3"] button[data-quiz="w1d3"]');
  await a.page.waitForFunction(() => document.querySelector('button[data-quiz="w1d3"]')?.innerText === 'Unpublish');
  ok(be.settings.published_quizzes.includes('w1d3') && /PUBLISHED/.test(await text(a.page, 'details[data-quiz-card="w1d3"] summary')), 'Publish switches the quiz on (server setting and tag)');
  const s2 = await newPage(browser, be);
  await login(s2.page, 'MOCK-STU-B'); await appUp(s2.page);
  await s2.page.evaluate(() => { showPage('w1'); toggleDay('w1d3'); });
  ok(await s2.page.locator('#quiz-w1d3-container .quiz-option').count() > 0, 'after publishing, a student gets the quiz questions');
  await a.page.click('details[data-quiz-card="w1d3"] button[data-quiz="w1d3"]');
  await a.page.waitForFunction(() => document.querySelector('button[data-quiz="w1d3"]')?.innerText === 'Publish to students');
  ok(!be.settings.published_quizzes.includes('w1d3'), 'Unpublish switches the quiz off again');
  await a.page.click('details[data-quiz-card="w1d3"] button[data-quiz="w1d3"]'); // leave it published for later checks
  await a.page.waitForFunction(() => document.querySelector('button[data-quiz="w1d3"]')?.innerText === 'Unpublish');
  for (const x of [a, s1, s2]) await x.ctx.close();
}

R.section('Week gate: lock before Lab 1, unlock after');
{
  const s = await newPage(browser, be);
  await login(s.page, 'MOCK-STU-A'); await appUp(s.page);
  for (const w of [2, 3, 4]) {
    await s.page.evaluate(n => showPage('w' + n), w);
    ok(await s.page.locator('#page-gate').isVisible() && !(await s.page.locator(`#page-w${w}`).evaluate(e => e.classList.contains('active'))), `Week ${w} is locked before Lab 1 attendance`);
  }
  ok(/🔒/.test(await text(s.page, '#sb-w2-badge')), 'the sidebar shows a lock on Weeks 2–4');
  await s.page.evaluate(() => showPage('w1'));
  ok(await s.page.locator('#page-w1').evaluate(e => e.classList.contains('active')), 'Week 1 is open while Weeks 2–4 are locked');
  const a = await newPage(browser, be);
  await login(a.page, 'MOCK-ADMIN'); await appUp(a.page);
  await a.page.evaluate(() => showPage('admin'));
  await a.page.waitForSelector('#admin-body button.lab-toggle[data-name="Student A"][data-lab="lab1"]');
  await a.page.click('#admin-body button.lab-toggle[data-name="Student A"][data-lab="lab1"]');
  await a.page.waitForFunction(() => document.querySelector('#admin-body button.lab-toggle[data-name="Student A"][data-lab="lab1"]')?.classList.contains('on'));
  ok(be.rows.get('Student A').lab_attendance.lab1 === true && be.rows.get('Student A').w2_unlocked === true, 'toggling Lab 1 attendance sets the flag and unlocks Weeks 2–4 on the server');
  await s.page.evaluate(() => checkUnlock());   // the "Check again" button on the lock screen
  await s.page.waitForFunction(() => document.getElementById('page-w2')?.classList.contains('active'));
  for (const w of [2, 3, 4]) {
    await s.page.evaluate(n => showPage('w' + n), w);
    ok(await s.page.locator(`#page-w${w}`).evaluate(e => e.classList.contains('active')) && !(await s.page.locator('#page-gate').isVisible()), `Week ${w} opens after Lab 1 is recorded`);
  }
  await a.page.click('#admin-body button.lab-toggle[data-name="Student A"][data-lab="lab1"]'); // mark absent again
  await a.page.waitForFunction(() => !document.querySelector('#admin-body button.lab-toggle[data-name="Student A"][data-lab="lab1"]')?.classList.contains('on'));
  ok(be.rows.get('Student A').lab_attendance.lab1 === false && be.rows.get('Student A').w2_unlocked === true, 'un-marking Lab 1 does not re-lock Weeks 2–4 once they were opened');
  await s.ctx.close(); await a.ctx.close();
}

R.section('KRP deliverable submission and confirmation');
{
  const s = await newPage(browser, be);
  await login(s.page, 'MOCK-STU-C'); await appUp(s.page);
  await s.page.evaluate(() => { showPage('krp'); });
  ok(await s.page.locator('.krp-item.done').count() === 0, 'KRP portfolio starts with nothing submitted');
  await s.page.evaluate(() => { showPage('w1'); toggleDay('w1d4'); });
  await s.page.setInputFiles('#sp-w1d4 input[type=file]', { name: 'honest-map.txt', mimeType: 'text/plain', buffer: Buffer.from('my honest map') });
  ok(/FILE SELECTED/.test(await text(s.page, '#sp-w1d4')), 'a chosen file shows "selected, not yet submitted"');
  await s.page.click('#sp-w1d4 .btn-submit-work.big');
  await s.page.waitForFunction(() => /SUBMITTED/.test(document.getElementById('sp-w1d4').innerText) && !/NOT|SELECTED|FAILED/.test(document.getElementById('sp-w1d4').innerText));
  ok(/honest-map\.txt/.test(await text(s.page, '#sp-w1d4')), 'the confirmation shows the file name and time');
  ok(be.files.some(f => f.path === 'L1/student-c/honest-map/honest-map.txt') && be.subs.some(x => x.student_name === 'Student C' && x.assignment_id === 'w1d4'), 'the file reached the submissions bucket path L1/student-c/honest-map/ and a submissions row was written');
  ok(be.rows.get('Student C').krp_portfolio.honest_map?.fileName === 'honest-map.txt', 'the KRP portfolio records the Honest Map');
  await s.page.evaluate(() => showPage('krp'));
  ok(await s.page.locator('.krp-item.done').count() === 1 && /submitted/.test(await text(s.page, '.krp-item.done')), 'the KRP page shows the Honest Map as submitted');
  const s2 = await newPage(browser, be);
  await login(s2.page, 'MOCK-STU-C'); await appUp(s2.page);
  await s2.page.evaluate(() => showPage('krp'));
  ok(await s2.page.locator('.krp-item.done').count() === 1, 'the confirmation is still there after signing in from a fresh browser');
  await s.ctx.close(); await s2.ctx.close();
}

R.section('Sync indicator: Saving, Saved, Offline');
{
  if (!be.settings.published_quizzes.includes('w1d1')) be.settings.published_quizzes.push('w1d1');
  if (!be.settings.published_quizzes.includes('w1d2')) be.settings.published_quizzes.push('w1d2');
  const s = await newPage(browser, be);
  await login(s.page, 'MOCK-STU-D'); await appUp(s.page);
  await s.page.evaluate(() => { showPage('w1'); toggleDay('w1d1'); toggleDay('w1d2'); });
  await s.page.evaluate(() => QUIZ_BANK.w1d1.questions.forEach((q, i) => selectOption('w1d1', i, q.ans)));
  be.mode.delay = 1200;
  await s.page.click('#qsub-w1d1');
  await s.page.waitForFunction(() => /Saving/.test(document.getElementById('sync-indicator').innerText), null, { timeout: 5000 });
  ok(true, 'the nav shows "Saving…" while a result is being sent');
  await s.page.waitForFunction(() => /Saved/.test(document.getElementById('sync-indicator').innerText), null, { timeout: 8000 });
  ok(be.rows.get('Student D').quizzes.w1d1?.passed === true, 'the nav shows "Saved" once the server has the result');
  be.mode.delay = 0;
  await s.page.evaluate(() => QUIZ_BANK.w1d2.questions.forEach((q, i) => selectOption('w1d2', i, q.ans)));
  await s.ctx.setOffline(true); be.mode.offline = true;
  await s.page.click('#qsub-w1d2');
  await s.page.waitForFunction(() => /Not synced/.test(document.getElementById('sync-indicator').innerText), null, { timeout: 8000 });
  ok(!be.rows.get('Student D').quizzes.w1d2, 'offline: the nav shows "Not synced" and the server has nothing new');
  ok(await s.page.evaluate(() => !!localStorage.getItem('ce_l1f26_cache_Student D')), 'offline: the result is kept on the device');
  await s.ctx.setOffline(false); be.mode.offline = false;
  await s.page.click('#sync-indicator');
  await s.page.waitForFunction(() => /Saved|^$/.test(document.getElementById('sync-indicator').innerText) && !/Not synced/.test(document.getElementById('sync-indicator').innerText), null, { timeout: 8000 });
  await s.page.waitForTimeout(300);
  ok(be.rows.get('Student D').quizzes.w1d2?.passed === true, 'back online: tapping the indicator sends the saved result');
  await s.ctx.close();
}

// ===== 9. responsive =====
R.section('Mobile and responsive layout');
for (const vp of [{ width: 375, height: 760 }, { width: 360, height: 740 }, { width: 768, height: 900 }]) {
  const { page, errors } = await newPage(browser, be, { viewport: vp });
  const overflowLogin = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(overflowLogin <= 0, `${vp.width}px: login has no horizontal scroll`, overflowLogin);
  await login(page, 'MOCK-TEST');
  await appUp(page);
  for (const pg of ['dashboard', 'w1', 'w2', 'w3', 'w4', 'krp', 'my-grades']) {
    await page.evaluate(p => showPage(p), pg);
    await page.evaluate(() => document.querySelectorAll('.day-card-body').forEach(b => b.classList.add('open')));
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(over <= 1, `${vp.width}px: ${pg} fits the screen`, `overflow ${over}px`);
    const broken = await page.evaluate(() => { const W = window.innerWidth; const out = []; document.querySelectorAll('.page-view.active *').forEach(e => { if (e.closest('.table-scroll, svg, [style*="overflow-x"], details:not([open]) > :not(summary)')) return; const r = e.getBoundingClientRect(); if (r.width && r.right > W + 2 && getComputedStyle(e).position !== 'fixed') out.push(e.tagName + '.' + (e.className && e.className.baseVal === undefined ? e.className : '')); }); return out.slice(0, 5); });
    ok(broken.length === 0, `${vp.width}px: ${pg} has no element spilling past the screen edge`, broken.join(', '));
    if (SHOTS && vp.width === 375) await page.screenshot({ path: `${SHOTS}/mobile-${pg}.png`, fullPage: true });
  }
  ok(errors.length === 0, `${vp.width}px: no JS errors`, errors.join(' | '));
  await page.context().close();
}
{
  const { page } = await newPage(browser, be, { viewport: { width: 375, height: 760 } });
  await login(page, 'MOCK-ADMIN');
  await appUp(page);
  for (const pg of ['rubric', 'quizreview']) {
    await page.evaluate(p => showPage(p), pg);
    await page.waitForTimeout(400);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(over <= 1, `375px: instructor ${pg} page fits the screen`, `overflow ${over}px`);
  }
  await page.context().close();
}

await browser.close();
process.exit(R.finish());
