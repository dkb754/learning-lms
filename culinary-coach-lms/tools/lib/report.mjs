// Tiny test reporter shared by the browser tests and the backend tests.
// Prints PASS/FAIL lines, writes test-results/<slug>.json, and appends a readable table to the GitHub Actions run
// summary ($GITHUB_STEP_SUMMARY) so pass/fail can be read without opening logs.
import { appendFileSync, mkdirSync, writeFileSync } from 'node:fs';

export class Reporter {
  constructor(title, slug) {
    this.title = title; this.slug = slug; this.sections = []; this.cur = null; this.started = Date.now();
    this.section('General');
  }
  section(name) {
    this.cur = this.sections.find(s => s.name === name);
    if (!this.cur) { this.cur = { name, checks: [] }; this.sections.push(this.cur); }
    return this;
  }
  check(cond, name, extra = '') {
    const pass = !!cond;
    this.cur.checks.push({ name, pass, extra: pass ? '' : String(extra ?? '') });
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${pass ? '' : '  ' + extra}`);
    return pass;
  }
  get totals() {
    const all = this.sections.flatMap(s => s.checks);
    return { pass: all.filter(c => c.pass).length, fail: all.filter(c => !c.pass).length };
  }
  markdown() {
    const { pass, fail } = this.totals;
    const secs = this.sections.filter(s => s.checks.length);
    let md = `## ${fail ? '❌' : '✅'} ${this.title}: ${pass} passed, ${fail} failed (${Math.round((Date.now() - this.started) / 1000)}s)\n\n`;
    md += '| Area | Passed | Failed | Result |\n|---|---:|---:|:-:|\n';
    for (const s of secs) {
      const p = s.checks.filter(c => c.pass).length, f = s.checks.length - p;
      md += `| ${s.name} | ${p} | ${f} | ${f ? '❌' : '✅'} |\n`;
    }
    const failed = secs.flatMap(s => s.checks.filter(c => !c.pass).map(c => ({ s: s.name, ...c })));
    if (failed.length) {
      md += '\n### Failures\n' + failed.map(c => `- **${c.s}:** ${c.name}${c.extra ? ` — \`${c.extra.slice(0, 300).replace(/`/g, "'")}\`` : ''}`).join('\n') + '\n';
    }
    md += '\n<details><summary>Every check</summary>\n\n' + secs.map(s => `**${s.name}**\n` + s.checks.map(c => `- ${c.pass ? '✅' : '❌'} ${c.name}`).join('\n')).join('\n\n') + '\n\n</details>\n';
    return md;
  }
  finish() {
    const { pass, fail } = this.totals;
    mkdirSync('test-results', { recursive: true });
    writeFileSync(`test-results/${this.slug}.json`, JSON.stringify({ title: this.title, pass, fail, sections: this.sections }, null, 1));
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, this.markdown() + '\n');
    console.log(`\n${pass} passed, ${fail} failed (${this.title})`);
    return fail ? 1 : 0;
  }
}
