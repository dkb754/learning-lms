/* Lesson activities: interactive, auto-graded practice that sits inside each lesson PART.
 * Data lives in content/activities-w1.js … w4.js as   ACTIVITIES.<dayId>.<p1|p2|p3|intro|end> = [ {type, title, …}, … ]
 * Types:  choice | order | match | fill | reflect | diagram      (diagram is a figure only; the rest are graded)
 * Grading happens here in the browser (formative practice, like the quizzes); the best score, the attempt count and any
 * written answers are saved to the student's record through lms-api-v2 `save-activity`.  Pass mark: 70%.
 * Depends on globals from index.html: esc, api, memCache, isAdmin, currentUser, mergeProgress, fromServer, writeLocal,
 * showToast, updateProgress, DAYS, session handling.  Everything here runs at call time, so load order is not critical. */
const ACTIVITIES = {};
const ACT_PASS = 70;
const actState = {};

// ---- registry ------------------------------------------------------------------------------------------------
function actDefs(dayId) {
  const out = [];
  const a = ACTIVITIES[dayId] || {};
  for (const key of ['intro', 'p1', 'p2', 'p3', 'p4', 'end']) {
    (a[key] || []).forEach((def, i) => out.push({ id: `a_${dayId}_${key}${i ? '_' + (i + 1) : ''}`, key, def, graded: def.type !== 'diagram' }));
  }
  return out;
}
const actGraded = dayId => actDefs(dayId).filter(x => x.graded);
const ALL_ACTS = () => DAYS.flatMap(d => actDefs(d.id).map(x => ({ ...x, day: d })));

// ---- lesson HTML with activity slots after each PART ---------------------------------------------------------
function lessonHtml(d) {
  if (!d.lesson) return '';
  const defs = actDefs(d.id);
  const slot = key => defs.filter(x => x.key === key).map(x => `<div class="act" id="act-${x.id}"></div>`).join('');
  const sections = d.lesson.split(/(?=<h4>)/);
  let out = '';
  sections.forEach((sec, i) => {
    const m = /^<h4>PART (\d+)/.exec(sec);
    if (!m && i === 0) { // text before the first PART heading
      out += sec + slot('intro');
    } else {
      out += sec + (m ? slot('p' + m[1]) : '');
    }
  });
  out += slot('end');
  return `<div class="lesson-body">${out}</div>`;
}

// ---- helpers --------------------------------------------------------------------------------------------------
const aHash = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
function aShuffle(n, seed) { // deterministic, never returns the identity order
  const idx = [...Array(n).keys()];
  let h = aHash(seed);
  for (let i = n - 1; i > 0; i--) { h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  if (n > 1 && idx.every((v, i) => v === i)) idx.push(idx.shift());
  return idx;
}
const aWords = s => (String(s).trim().match(/[A-Za-z0-9’'$%.\-]+/g) || []).length;
function aSt(id, def) {
  if (!actState[id]) {
    const rec = (memCache.exercises || {})[id];
    const st = { vals: {}, picks: {}, results: null, msg: '', busy: false, score: null, order: def.type === 'order' ? aShuffle(def.steps.length, id) : null, open: false };
    if (def.type === 'reflect') {
      if (rec && rec.text) st.vals = { ...rec.text };
      else { try { const dr = localStorage.getItem(CACHE_PREFIX + 'draft_' + currentUser + '_' + id); if (dr) st.vals = JSON.parse(dr); } catch (e) { /* no draft */ } }
    }
    actState[id] = st;
  }
  return actState[id];
}
const aRec = id => (memCache.exercises || {})[id];

// ---- rendering --------------------------------------------------------------------------------------------------
function renderActivities() {
  ALL_ACTS().forEach(x => {
    const el = document.getElementById('act-' + x.id);
    if (!el) return;
    if (el.contains(document.activeElement) && /^(TEXTAREA|INPUT|SELECT)$/.test(document.activeElement.tagName)) return; // never steal focus while typing
    el.innerHTML = actHtml(x);
  });
}
function actRerender(id) {
  const x = ALL_ACTS().find(a => a.id === id);
  const el = document.getElementById('act-' + id);
  if (x && el) el.innerHTML = actHtml(x);
}

function actHead(x, extra = '') {
  const rec = aRec(x.id), def = x.def;
  const badge = !x.graded ? '' : rec && rec.passed ? `<span class="score-badge score-pass">✓ Done · best ${rec.best}%</span>`
    : rec ? `<span class="score-badge score-pending">Best ${rec.best}% · try again</span>` : '<span class="score-badge score-pending">To do</span>';
  const tag = { choice: 'Check your understanding', order: 'Put it in order', match: 'Match', fill: 'Work it out', reflect: 'Write it', diagram: 'Diagram' }[def.type];
  return `<div class="act-head"><span class="layer-chip">${esc(tag)}</span><strong>${esc(def.title || '')}</strong> ${badge}</div>${def.intro ? `<p class="act-intro">${esc(def.intro)}</p>` : ''}${extra}`;
}

function actHtml(x) {
  const def = x.def, id = x.id;
  if (def.type === 'diagram') {
    const svg = (typeof DIAGRAMS !== 'undefined' && DIAGRAMS[def.svg]) || '';
    return `<figure class="act act-figure"><div class="act-head"><span class="layer-chip">Diagram</span><strong>${esc(def.title || '')}</strong></div>${svg}<figcaption>${esc(def.caption || '')}</figcaption></figure>`;
  }
  const st = aSt(id, def);
  const done = st.results;
  let body = '';
  if (def.type === 'choice') {
    body = def.items.map((it, qi) => {
      const pick = st.picks[qi], r = done ? done[qi] : undefined;
      const opts = aShuffle(it.opts.length, id + '#' + qi).map(oi => [it.opts[oi], oi]).map(([o, oi]) => `<label class="act-opt ${done && oi === it.ans ? 'right' : ''} ${done && pick === oi && oi !== it.ans ? 'wrong' : ''}"><input type="radio" name="${id}-${qi}" ${pick === oi ? 'checked' : ''} ${st.busy ? 'disabled' : ''} onchange="actPick('${id}',${qi},${oi})"> ${esc(o)}</label>`).join('');
      return `<div class="act-q"><div class="act-qt">${qi + 1}. ${esc(it.q)} ${r === true ? '<span class="act-mark ok">✓</span>' : r === false ? '<span class="act-mark no">✗</span>' : ''}</div>${opts}${done && it.why ? `<div class="act-why">${esc(it.why)}</div>` : ''}</div>`;
    }).join('');
  } else if (def.type === 'order') {
    body = `<ol class="act-order">${st.order.map((si, pos) => {
      const r = done ? done[pos] : undefined;
      return `<li class="${r === true ? 'right' : r === false ? 'wrong' : ''}"><span class="act-step">${esc(def.steps[si])}</span>
        <span class="act-move"><button aria-label="Move up" ${pos === 0 || st.busy ? 'disabled' : ''} onclick="actMove('${id}',${pos},-1)">▲</button><button aria-label="Move down" ${pos === st.order.length - 1 || st.busy ? 'disabled' : ''} onclick="actMove('${id}',${pos},1)">▼</button></span>
        ${r === true ? '<span class="act-mark ok">✓</span>' : r === false ? '<span class="act-mark no">✗</span>' : ''}</li>`;
    }).join('')}</ol>${done && def.why ? `<div class="act-why">${esc(def.why)}</div>` : ''}`;
  } else if (def.type === 'match') {
    body = def.rows.map((row, ri) => {
      const r = done ? done[ri] : undefined;
      return `<div class="act-row"><label for="${id}-m${ri}">${esc(row.label)}</label><span><select id="${id}-m${ri}" ${st.busy ? 'disabled' : ''} onchange="actPick('${id}',${ri},this.value)"><option value="">Choose…</option>${def.options.map((o, oi) => `<option value="${oi}" ${String(st.picks[ri]) === String(oi) ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>
        ${r === true ? '<span class="act-mark ok">✓</span>' : r === false ? '<span class="act-mark no">✗</span>' : ''}</span></div>`;
    }).join('') + (done && def.why ? `<div class="act-why">${esc(def.why)}</div>` : '');
  } else if (def.type === 'fill') {
    body = def.rows.map((row, ri) => {
      const r = done ? done[ri] : undefined;
      return `<div class="act-row"><label for="${id}-f${ri}">${esc(row.label)}</label><span class="ex-field"><input id="${id}-f${ri}" inputmode="decimal" autocomplete="off" value="${esc(st.vals[ri] ?? '')}" ${st.busy ? 'disabled' : ''} oninput="actVal('${id}',${ri},this.value)"> <span class="ex-unit">${esc(row.unit || '')}</span>
        ${r === true ? '<span class="act-mark ok">✓</span>' : r === false ? '<span class="act-mark no">✗ try again</span>' : ''}</span></div>`;
    }).join('') + (done && def.why ? `<div class="act-why">${esc(def.why)}</div>` : '');
  } else if (def.type === 'reflect') {
    const eg = def.exampleFirst && def.model && !done ? `<details class="act-model"><summary>Not sure where to start? See an example first</summary><div>${esc(def.model).replace(/\n/g, '<br>')}</div></details>` : '';
    body = eg + def.prompts.map(p => {
      const fb = done ? done[p.key] : null;
      return `<div class="act-prompt"><label for="${id}-${p.key}"><strong>${esc(p.label)}</strong>${p.help ? `<span class="act-help"> ${esc(p.help)}</span>` : ''}</label>
        <textarea id="${id}-${p.key}" rows="${p.rows || 4}" maxlength="1500" placeholder="${esc(p.placeholder || (p.items > 1 ? 'One idea per line' : 'Write here'))}" ${st.busy ? 'disabled' : ''} oninput="actVal('${id}','${p.key}',this.value)">${esc(st.vals[p.key] || '')}</textarea>
        ${fb ? `<div class="act-fb ${fb.ok ? 'ok' : 'no'}">${fb.ok ? '✓ ' : '✗ '}${esc(fb.msg)}${fb.tips && fb.tips.length ? `<div class="act-tip">Think about: ${fb.tips.map(esc).join('; ')}</div>` : ''}</div>` : ''}</div>`;
    }).join('') + (done && def.model ? `<details class="act-model"><summary>See a model answer to compare with yours</summary><div>${esc(def.model).replace(/\n/g, '<br>')}</div></details>` : '')
      + (def.download ? `<div class="sub-actions"><button class="btn-choose" onclick="actDownload('${id}')">⬇ Download my ${esc(def.download.label || 'answers')}</button></div>` : '');
  }
  const needs = actReady(x);
  return `<div class="act-card ${aRec(id) && aRec(id).passed ? 'done' : ''}">${actHead(x)}${body}
    <div class="sub-actions"><button class="btn-submit-work" ${st.busy || !needs ? 'disabled' : ''} onclick="actCheck('${id}')">${st.busy ? 'Checking…' : done ? 'Check again' : 'Check my answers'}</button>
    ${!needs ? '<span class="act-help"> Answer every item to check.</span>' : ''}</div>
    <div class="act-msg" role="status" aria-live="polite">${esc(st.msg)}</div></div>`;
}

function actReady(x) {
  const def = x.def, st = aSt(x.id, def);
  if (def.type === 'choice') return def.items.every((_, i) => st.picks[i] !== undefined);
  if (def.type === 'match') return def.rows.every((_, i) => st.picks[i] !== undefined && st.picks[i] !== '');
  if (def.type === 'fill') return def.rows.every((_, i) => Number.isFinite(exParse(st.vals[i])));
  if (def.type === 'reflect') return def.prompts.every(p => String(st.vals[p.key] || '').trim().length > 0);
  return true;
}

// ---- interaction --------------------------------------------------------------------------------------------------
function actDef(id) { return ALL_ACTS().find(a => a.id === id); }
function actPick(id, i, v) { const x = actDef(id), st = aSt(id, x.def); st.picks[i] = x.def.type === 'match' ? v : v; st.results = null; st.msg = ''; actRerender(id); }
function actVal(id, k, v) {
  const x = actDef(id), st = aSt(id, x.def);
  st.vals[k] = v;
  if (x.def.type === 'reflect' && currentUser) { try { localStorage.setItem(CACHE_PREFIX + 'draft_' + currentUser + '_' + id, JSON.stringify(st.vals)); } catch (e) { /* storage blocked: the server copy still saves on Check */ } }
  const btn = document.querySelector(`#act-${id} .btn-submit-work`);
  if (btn) btn.disabled = !actReady(x) || st.busy;
}
function actMove(id, pos, dir) {
  const x = actDef(id), st = aSt(id, x.def);
  const j = pos + dir; if (j < 0 || j >= st.order.length) return;
  [st.order[pos], st.order[j]] = [st.order[j], st.order[pos]];
  st.results = null; st.msg = ''; actRerender(id);
  const b = document.querySelector(`#act-${id} .act-order li:nth-child(${j + 1}) .act-move button:${dir < 0 ? 'first' : 'last'}-child`); if (b) b.focus();
}

function actGrade(x) {
  const def = x.def, st = aSt(x.id, def);
  let res, correct, total;
  if (def.type === 'choice') { res = def.items.map((it, i) => st.picks[i] === it.ans); }
  else if (def.type === 'order') { res = st.order.map((si, pos) => si === pos); }
  else if (def.type === 'match') { res = def.rows.map((r, i) => Number(st.picks[i]) === r.ans); }
  else if (def.type === 'fill') { res = def.rows.map((r, i) => Math.abs(exParse(st.vals[i]) - r.ans) <= (r.tol ?? 0.01)); }
  else if (def.type === 'reflect') {
    res = {}; const flags = [];
    def.prompts.forEach(p => {
      const need = p.items || 1, minW = p.minWords || (need > 1 ? 3 : 12);
      const lines = String(st.vals[p.key] || '').split('\n').map(s => s.trim()).filter(Boolean);
      const good = lines.filter(l => aWords(l) >= minW);
      const ok = good.length >= need;
      const tips = (p.keywords || []).filter(k => !new RegExp('\\b' + k.match, 'i').test(st.vals[p.key] || '')).map(k => k.tip).slice(0, 3);
      let msg;
      if (ok) msg = need > 1 ? `${good.length} specific entries. Good.` : `${aWords(st.vals[p.key])} words. Good.`;
      else if (need > 1) msg = `Add ${need - good.length} more entr${need - good.length === 1 ? 'y' : 'ies'} (one per line, at least ${minW} words each; say what it is and why it matters).`;
      else msg = `Write at least ${minW} words (you have ${aWords(st.vals[p.key])}). Be specific: who, what, when.`;
      res[p.key] = { ok, msg, tips: ok ? [] : tips };
      flags.push(ok);
    });
    return { res, correct: flags.filter(Boolean).length, total: flags.length };
  }
  correct = res.filter(Boolean).length; total = res.length;
  return { res, correct, total };
}

async function actCheck(id) {
  const x = actDef(id), st = aSt(id, x.def);
  if (!actReady(x)) return;
  const { res, correct, total } = actGrade(x);
  const score = Math.round(correct / total * 100);
  st.results = res; st.score = score;
  st.msg = score === 100 ? 'Everything is right. Nice work!' : score >= ACT_PASS ? `${score}%: passed. Look at the ✗ items and fix them if you like.` : `${score}%: you need ${ACT_PASS}% to complete this. Read the notes and try again.`;
  st.busy = true; actRerender(id);
  const texts = x.def.type === 'reflect' ? Object.fromEntries(Object.entries(st.vals).map(([k, v]) => [k, String(v).slice(0, 1500)])) : undefined;
  if (!isAdmin) {
    try {
      const d = await api('save-activity', { id, score, texts });
      memCache = mergeProgress(fromServer(d.progress), memCache);
      if (currentUser) writeLocal(currentUser, memCache);
    } catch (e) { if (e.code === 'session_expired') return; st.msg += ' (Could not save to your record. Check your connection and press Check again.)'; }
  }
  st.busy = false; actRerender(id); updateProgress();
  if (score >= ACT_PASS) showToast('✅ ' + (x.def.title || 'Activity') + ' complete', '🧩');
}

function actDownload(id) {
  const x = actDef(id), st = aSt(id, x.def), d = x.def.download || {};
  const lines = [d.title || x.def.title, `Name: ${currentUser || ''}`, `Date: ${new Date().toLocaleDateString()}`, ''];
  x.def.prompts.forEach(p => { lines.push(p.label.toUpperCase()); String(st.vals[p.key] || '').split('\n').map(s => s.trim()).filter(Boolean).forEach(s => lines.push('  - ' + s)); lines.push(''); });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([lines.join('\r\n')], { type: 'text/plain' }));
  a.download = (d.filename || 'my-answers') + '.txt';
  document.body.appendChild(a); a.click(); a.remove();
  showToast('Downloaded. You can submit this file as your deliverable.', '⬇');
}
