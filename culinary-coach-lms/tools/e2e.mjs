// End-to-end smoke test for index.html. Runs the real page in headless Chromium against a MOCK
// Supabase REST endpoint, so it needs no network and never touches production data.
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

// ---- mock Supabase ----
function makeDb() {
  const rows = new Map(); // student_name -> row
  const log = [];
  const mode = { getFails: false, writeFails: false };
  const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*', 'content-type': 'application/json' };
  async function handler(route) {
    const req = route.request();
    const url = new URL(req.url());
    const m = /student_name=eq\.([^&]+)/.exec(url.search);
    const name = m ? decodeURIComponent(m[1]) : null;
    const method = req.method();
    if (method === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    log.push({ method, name, body: req.postData() });
    if (method === 'GET') {
      if (mode.getFails) return route.fulfill({ status: 503, headers: CORS, body: JSON.stringify({ message: 'down' }) });
      return route.fulfill({ status: 200, headers: CORS, body: JSON.stringify(rows.has(name) ? [rows.get(name)] : []) });
    }
    if (mode.writeFails) return route.fulfill({ status: 500, headers: CORS, body: JSON.stringify({ message: 'boom' }) });
    if (method === 'PATCH') {
      if (!rows.has(name)) return route.fulfill({ status: 200, headers: CORS, body: '[]' });
      Object.assign(rows.get(name), JSON.parse(req.postData()));
      return route.fulfill({ status: 200, headers: CORS, body: JSON.stringify([rows.get(name)]) });
    }
    if (method === 'POST') {
      const b = JSON.parse(req.postData());
      rows.set(b.student_name, b);
      return route.fulfill({ status: 201, headers: CORS, body: JSON.stringify([b]) });
    }
    return route.fulfill({ status: 405, headers: CORS, body: '{}' });
  }
  const files = [];   // { path, mime, bytes }
  mode.storageFails = 0;
  async function storage(route) {
    const req = route.request();
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS });
    if (mode.storageFails) return route.fulfill({ status: mode.storageFails, headers: CORS, body: JSON.stringify({ message: mode.storageFails === 404 ? 'Bucket not found' : 'nope' }) });
    const u = new URL(req.url());
    files.push({ path: decodeURIComponent(u.pathname.replace('/storage/v1/object/submissions/', '')), mime: req.headers()['content-type'], bytes: req.postDataBuffer()?.length ?? 0, key: req.headers()['apikey'] });
    return route.fulfill({ status: 200, headers: CORS, body: JSON.stringify({ Key: 'submissions/x' }) });
  }
  return { rows, log, mode, handler, storage, files };
}

async function newPage(browser, db, opts = {}) {
  const ctx = opts.ctx || await browser.newContext({ viewport: opts.viewport || { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error' && !/Supabase|Failed to load resource|ERR_/.test(m.text())) errors.push(m.text()); });
  await page.route('**/rest/v1/student_progress**', db.handler);
  await page.route('**/storage/v1/object/submissions/**', db.storage);
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort()); // offline-safe
  await page.goto(PAGE);
  return { page, ctx, errors };
}
const login = async (page, code, name = 'x') => { await page.fill('#login-user', name); await page.fill('#login-pass', code); await page.click('#login-btn'); };
const text = (page, sel) => page.locator(sel).first().innerText();

const browser = await engine.launch(launchOpts);
const db = makeDb();

// ===== 1. login =====
{
  const { page, errors } = await newPage(browser, db);
  await login(page, 'WRONGCODE');
  await page.waitForSelector('#login-error', { state: 'visible' });
  ok(/Invalid access code/.test(await text(page, '#login-error')), 'bad access code is rejected with a message');
  ok(await page.locator('#login-btn').isEnabled(), 'sign-in button re-enables after a bad code');

  await login(page, 'test0000'); // lower-case should work
  await page.waitForSelector('#app', { state: 'visible' });
  ok(/TEST STUDENT/.test(await text(page, '#nav-name')), 'student login works (case-insensitive code)');
  ok(db.rows.has('TEST STUDENT'), 'first login creates the Supabase row');

  // ===== 2. content / dates =====
  const body = await page.content();
  ok(/Oct 12 – Nov 7, 2026/.test(body) || /Oct 12/.test(body), 'new cohort dates present');
  ok(!/April|\bMay [0-9]|Spring 2026|Easter/.test(await page.locator('#app').innerText()), 'no leftover Spring-cohort dates in visible text');
  ok(/level i/i.test(await text(page, '.dash-header')), 'dashboard says Level I');
  ok(!/VCU/i.test(await page.locator('#app').innerText()) && !/VCU/i.test(await page.content()), 'no VCU references anywhere on the page');
  ok(/Food Handler/.test(await page.locator('#app').innerText()) && !/Food Manager/.test(await page.locator('#app').innerText()), 'Level I credential is ServSafe Food Handler (no Manager references)');
  ok(/Entrepreneurship I\b(?! ?I)/.test(await text(page, '.nav-brand')), 'course is titled Culinary Entrepreneurship I');

  // ===== 3. links =====
  const hrefs = await page.$$eval('a.resource-item', as => as.map(a => a.href));
  ok(hrefs.length === 34 - 0 || hrefs.length > 25, `resource links rendered as real anchors (${hrefs.length})`);
  ok(hrefs.every(h => /^https:\/\//.test(h)), 'every resource link is https');
  ok(!hrefs.some(h => /youtube\.com\/results/.test(h)), 'no YouTube search-result links remain');
  ok(!hrefs.some(h => /youtube\.com/.test(h) && !/watch\?v=[\w-]{11}$/.test(h)), 'every YouTube link is a direct watch URL');
  ok((await page.$$eval('a.resource-item', as => as.every(a => a.rel.includes('noopener')))), 'external links use rel=noopener');

  // ===== 4. gate =====
  await page.click('.sidebar-item[data-page="w2"]');
  ok(await page.locator('#page-gate').isVisible(), 'Week 2 is gated until the instructor unlocks it');
  ok(/sign out and back in/i.test(await text(page, '#page-gate')), 'gate tells students to sign back in after unlock');

  // ===== 5. confirm-type deliverable =====
  await page.click('.sidebar-item[data-page="w1"]');
  await page.click('.day-card-header[onclick*="w1d1"]');
  ok(/NOT SUBMITTED/.test(await text(page, '#sp-w1d1')), 'untouched deliverable reads NOT SUBMITTED');
  ok(/To do/.test(await text(page, '#ds-w1d1')), 'day shows a "To do" text chip');
  await page.click('#sp-w1d1 .btn-submit-work');
  await page.waitForFunction(() => /SUBMITTED/.test(document.getElementById('sp-w1d1').innerText) && !/NOT/.test(document.getElementById('sp-w1d1').innerText));
  ok(true, 'confirm button flips panel to SUBMITTED');
  ok(!!db.rows.get('TEST STUDENT').deliverables.w1d1?.date, 'confirmation written to Supabase');
  ok(/1 of 5 items done|1 of \d+ items done/.test(await text(page, '#wc1-count')), 'week count updates', await text(page, '#wc1-count'));
  ok(/In progress/.test(await text(page, '#ds-w1d1')), 'day with quiz still open reads "In progress" (not Done)');
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/desktop-w1.png`, fullPage: true });
  ok(errors.length === 0, 'no JS errors in student flow', errors.join(' | '));
  await page.context().close();
}

// ===== 6. file submission (week 2 pre-unlocked) =====
db.rows.set('TEST STUDENT', { student_name: 'TEST STUDENT', quizzes: {}, deliverables: {}, w2_unlocked: true });
{
  const { page, errors } = await newPage(browser, db);
  await login(page, 'TEST0000');
  await page.waitForSelector('#app', { state: 'visible' });
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
  ok(!db.rows.get('TEST STUDENT').deliverables.w2d1 && db.files.length === 0, 'nothing is uploaded or saved until Submit is clicked');
  await page.click(`${panel} .btn-submit-work.big`);
  await page.waitForFunction(() => /SUBMITTED/.test(document.getElementById('sp-w2d1').innerText) && !/NOT|SELECTED/.test(document.getElementById('sp-w2d1').innerText));
  const rec = db.rows.get('TEST STUDENT').deliverables.w2d1;
  ok(rec && rec.fileName === 'concept-draft.pdf' && rec.fileSize === 14 && rec.attempts === 1, 'filename, size, timestamp, attempt logged in Supabase', JSON.stringify(rec));
  ok(db.files.length === 1 && db.files[0].bytes === 14 && db.files[0].mime === 'application/pdf', 'the real file bytes reach storage with the right type', JSON.stringify(db.files));
  ok(/^test-student\/w2d1\/\d+-concept-draft\.pdf$/.test(db.files[0].path) && rec.filePath === db.files[0].path, 'stored under student/assignment path and the path is recorded', db.files[0].path);
  ok(/concept-draft\.pdf/.test(await text(page, panel)) && /2026|20\d\d/.test(await text(page, panel)), 'submitted panel shows filename + timestamp');

  // resubmission
  await page.click(`${panel} .link-btn`);
  await page.setInputFiles(`${panel} input[type=file]`, { name: 'v2.docx', mimeType: 'application/octet-stream', buffer: Buffer.from('x') });
  await page.click(`${panel} .btn-submit-work.big`);
  await page.waitForFunction(() => /v2\.docx/.test(document.getElementById('sp-w2d1').innerText));
  ok(db.rows.get('TEST STUDENT').deliverables.w2d1.attempts === 2 && db.files.length === 2 && db.files[1].path !== db.files[0].path, 'resubmission uploads a NEW object (nothing overwritten) and counts the attempt');

  // empty file rejected
  await page.click('.day-card-header[onclick*="w2d4"]');
  await page.setInputFiles('#sp-w2d4 input[type=file]', { name: 'empty.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(0) });
  ok(/empty/i.test(await text(page, '#sp-w2d4')) && /NOT SUBMITTED/.test(await text(page, '#sp-w2d4')) || /UPLOAD FAILED/.test(await text(page, '#sp-w2d4')), 'empty file is rejected with a reason');
  await page.setInputFiles('#sp-w2d4 input[type=file]', { name: 'virus.exe', mimeType: 'application/octet-stream', buffer: Buffer.from('MZ') });
  ok(/not accepted/i.test(await text(page, '#sp-w2d4')), '.exe is refused with a reason');
  await page.setInputFiles('#sp-w2d4 input[type=file]', { name: 'huge.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(26 * 1048576, 1) });
  ok(/limit is 25 MB/.test(await text(page, '#sp-w2d4')), '26 MB file is refused with the limit stated');
  ok(db.files.length === 2, 'rejected files (empty / .exe / 26 MB) are never uploaded');

  // Submit w/o file via console cannot create a record
  await page.evaluate(() => submitDeliverable('w2d4'));
  ok(!db.rows.get('TEST STUDENT').deliverables.w2d4, 'assignment cannot be submitted without a file');

  // My Grades
  await page.click('.sidebar-item[data-page="my-grades"]');
  ok(/v2\.docx/.test(await text(page, '#my-grades-body')), 'My Grades lists the submitted file');

  // ===== 6b. storage down -> upload fails loudly, nothing is recorded, retry succeeds =====
  await page.click('.sidebar-item[data-page="w4"]');
  await page.click('.day-card-header[onclick*="w4d1"]');
  db.mode.storageFails = 404;
  const before = db.files.length;
  await page.setInputFiles('#sp-w4d1 input[type=file]', { name: 'moodboard.png', mimeType: 'image/png', buffer: Buffer.from('png') });
  await page.click('#sp-w4d1 .btn-submit-work.big');
  await page.waitForFunction(() => /UPLOAD FAILED/.test(document.getElementById('sp-w4d1').innerText));
  ok(/not switched on|not sent/i.test(await text(page, '#sp-w4d1')), 'missing bucket gives a plain-English error', await text(page, '#sp-w4d1'));
  ok(!db.rows.get('TEST STUDENT').deliverables.w4d1 && db.files.length === before, 'failed upload creates NO submitted record');
  ok(await page.locator('#sp-w4d1 .btn-submit-work.big').isVisible(), 'student can retry without re-choosing the file');
  db.mode.storageFails = 0;
  await page.click('#sp-w4d1 .btn-submit-work.big');
  await page.waitForFunction(() => /SUBMITTED/.test(document.getElementById('sp-w4d1').innerText) && !/NOT|FAILED/.test(document.getElementById('sp-w4d1').innerText));
  ok(db.rows.get('TEST STUDENT').deliverables.w4d1?.fileName === 'moodboard.png' && db.files.length === before + 1, 'retry after outage uploads and records');
  ok(db.files.every(f => f.key && f.key.startsWith('eyJ')), 'uploads carry the anon key only (no other credential)');

  // ===== 7. sync failure -> retry =====
  await page.click('.sidebar-item[data-page="w3"]');
  await page.click('.day-card-header[onclick*="w3d3"]');
  db.mode.writeFails = true;
  await page.setInputFiles('#sp-w3d3 input[type=file]', { name: 'suppliers.xlsx', mimeType: 'application/vnd.ms-excel', buffer: Buffer.from('abc') });
  await page.click('#sp-w3d3 .btn-submit-work.big');
  await page.waitForSelector('#sp-w3d3 .sub-warn');
  ok(/has not synced yet/i.test(await text(page, '#sp-w3d3')), 'failed progress-save shows an unambiguous "not yet synced" warning (file itself already stored)');
  ok(/Not synced/.test(await text(page, '#sync-indicator')), 'nav sync indicator shows the failure');
  ok(!db.rows.get('TEST STUDENT').deliverables.w3d3, 'server row unchanged while writes fail');
  db.mode.writeFails = false;
  await page.click('#sp-w3d3 .sub-warn .link-btn');
  await page.waitForFunction(() => !document.querySelector('#sp-w3d3 .sub-warn'));
  ok(db.rows.get('TEST STUDENT').deliverables.w3d3?.fileName === 'suppliers.xlsx', 'retry pushes the queued submission');
  if (SHOTS) {
    await page.click('.sidebar-item[data-page="w2"]');
    await page.evaluate(() => document.getElementById('w2d1').scrollIntoView());
    await page.screenshot({ path: `${SHOTS}/desktop-w2-submitted.png`, fullPage: false });
  }
  ok(errors.length === 0, 'no JS errors in submission flow', errors.join(' | '));
  await page.context().close();
}

// ===== 8. persistence across a fresh browser =====
{
  const { page } = await newPage(browser, db);
  await login(page, 'TEST0000');
  await page.waitForSelector('#app', { state: 'visible' });
  await page.click('.sidebar-item[data-page="w2"]');
  await page.click('.day-card-header[onclick*="w2d1"]');
  ok(/SUBMITTED/.test(await text(page, '#sp-w2d1')) && /v2\.docx/.test(await text(page, '#sp-w2d1')), 'a fresh browser sees the saved submission (read from Supabase)');
  await page.context().close();
}

// ===== 9. server down at login must not wipe progress =====
{
  const before = JSON.stringify(db.rows.get('TEST STUDENT').deliverables);
  db.mode.getFails = true;
  const { page } = await newPage(browser, db);
  await login(page, 'TEST0000');
  await page.waitForSelector('#app', { state: 'visible' });
  ok(/Not synced/.test(await text(page, '#sync-indicator')), 'offline login says so');
  const writes = db.log.filter(l => l.method !== 'GET' && l.method !== 'OPTIONS').length;
  db.log.length = 0;
  await page.click('.sidebar-item[data-page="w1"]');
  await page.click('.day-card-header[onclick*="w1d2"]');
  await page.click('#sp-w1d2 .btn-submit-work');
  await page.waitForTimeout(400);
  ok(db.log.every(l => l.method === 'GET' || l.method === 'OPTIONS'), 'while the row cannot be read, nothing is written over it');
  db.mode.getFails = false;
  await page.evaluate(() => retrySync());
  await page.waitForFunction(() => syncStatus === 'saved' || syncStatus === 'idle', null, { timeout: 5000 });
  const after = db.rows.get('TEST STUDENT').deliverables;
  ok(Object.keys(JSON.parse(before)).every(k => after[k]) && after.w1d2, 'after reconnect: earlier work kept AND the offline submission merged in', JSON.stringify(Object.keys(after)));
  await page.context().close();
}

// ===== 10. admin =====
{
  db.rows.delete('Zed Newstudent');
  const { page, errors } = await newPage(browser, db);
  await login(page, 'ADMIN2026', 'Chef');
  await page.waitForSelector('#app', { state: 'visible' });
  ok(await page.locator('#admin-nav').isVisible(), 'admin sees the Instructor nav');
  await page.click('.sidebar-item[data-page="admin"]');
  await page.waitForSelector('#admin-body tr td strong');
  ok(/TEST STUDENT/.test(await text(page, '#admin-body')), 'tracker lists the roster');
  await page.waitForSelector('#admin-files tr');
  ok(/concept|v2\.docx|moodboard|suppliers/.test(await text(page, '#admin-files')) && /test-student\//.test(await text(page, '#admin-files')), 'instructor sees submitted files with their storage paths');
  const unlocked = await page.evaluate(() => sbUnlockWeek2('Zed Newstudent'));
  ok(unlocked && db.rows.get('Zed Newstudent')?.w2_unlocked === true, 'unlock works for a student who has never signed in (row is created)');
  ok(!db.rows.has('Chef'), 'admin browsing never writes an instructor row');
  await page.evaluate(() => doLogout());
  await login(page, 'TEST0000');
  await page.waitForSelector('#app', { state: 'visible' });
  ok(!(await page.locator('#admin-nav').isVisible()), 'Instructor nav is hidden when a student signs in after an admin on the same screen');
  ok(errors.length === 0, 'no JS errors in admin flow', errors.join(' | '));
  await page.context().close();
}

// ===== 11. quiz retry works =====
{
  const { page } = await newPage(browser, db);
  await login(page, 'TEST0000');
  await page.waitForSelector('#app', { state: 'visible' });
  await page.click('.sidebar-item[data-page="w1"]');
  await page.click('.day-card-header[onclick*="w1d1"]');
  const qs = await page.$$eval('#quiz-w1d1-container .quiz-q', q => q.length);
  for (let i = 0; i < qs; i++) await page.click(`#qopt-w1d1-${i}-0`).catch(() => {});
  await page.evaluate(() => { for (let i = 0; i < QUIZZES.w1d1.questions.length; i++) selectOption('w1d1', i, (QUIZZES.w1d1.questions[i].ans + 1) % 4); });
  await page.click('#qsub-w1d1');
  await page.waitForSelector('#quiz-w1d1-container .btn-retry');
  await page.click('#quiz-w1d1-container .btn-retry');
  ok(await page.locator('#qopt-w1d1-0-0').isEnabled(), 'Retry re-opens a failed quiz (was permanently locked before)');
  await page.context().close();
}

// ===== 12. mobile =====
for (const vp of [{ width: 375, height: 760 }, { width: 768, height: 900 }]) {
  const { page, errors } = await newPage(browser, db, { viewport: vp });
  const overflowLogin = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(overflowLogin <= 0, `${vp.width}px: login has no horizontal scroll`, overflowLogin);
  await login(page, 'TEST0000');
  await page.waitForSelector('#app', { state: 'visible' });
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
