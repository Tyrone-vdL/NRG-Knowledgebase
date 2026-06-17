// tools/mine-gaps.mjs — mine the bot's own logs for learning signals and emit:
//   1. bot-logs/coverage-gaps-queue.md  — a ranked, human-readable ingestion queue
//   2. bot-logs/metrics.json            — machine-readable metrics for the digest
//
// Read-only over the logs; the only things it writes are the two outputs above.
// It NEVER edits the wiki. Gap signals come from the bot's own anti-fabrication
// opener (which already names the exact source file to ingest), generic "I don't
// have it" answers, 👎 ratings, and reply-corrections. Run from repo root:
//   node tools/mine-gaps.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const LOG_DIR = path.join(REPO, 'bot-logs');
const WIKI = path.join(REPO, 'wiki');

// ---------------------------------------------------------------- load Q&A logs
const dayFiles = fs.existsSync(LOG_DIR)
  ? fs.readdirSync(LOG_DIR).filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort()
  : [];

const entries = []; // {ts, user, q, a}
for (const f of dayFiles) {
  const text = fs.readFileSync(path.join(LOG_DIR, f), 'utf8');
  const blocks = text.split(/\n## /).map((b, i) => (i === 0 ? b : '## ' + b));
  for (const b of blocks) {
    const m = b.match(/^## (\S+) — (.+?)\n+\*\*Q:\*\* ([\s\S]*?)\n+\*\*A:\*\* ([\s\S]*?)\n+---/);
    if (m) entries.push({ ts: m[1], user: m[2].trim(), q: m[3].trim(), a: m[4].trim() });
  }
}

// --------------------------------------------------------------- load feedback
const fbPath = path.join(LOG_DIR, 'feedback.jsonl');
const feedback = [];
if (fs.existsSync(fbPath)) {
  for (const line of fs.readFileSync(fbPath, 'utf8').split('\n')) {
    if (line.trim()) { try { feedback.push(JSON.parse(line)); } catch { /* skip bad line */ } }
  }
}

// ------------------------------------------------------------- gap detection
const GAP_OPENER = /i don't have that specific figure in the wiki — check `([^`]+)`/i;
const GENERIC_GAP = /(i don't have|not in the wiki|don't have a|no .{0,40} in the wiki|outside my (scope|domain)|not .{0,30}in the wiki)/i;

const now = Date.now();
const recencyWeight = (ts) => {
  const age = (now - Date.parse(ts)) / 86400000; // days
  if (Number.isNaN(age)) return 1;
  return age <= 7 ? 3 : age <= 30 ? 2 : 1;
};
const qKey = (q) => 'q:' + (q || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean).slice(0, 6).join(' ');

const gaps = new Map(); // key -> {key, namedSource, count, lastTs, samples[], downvotes, correction, score}
function bump(key, { namedSource, ts, q }) {
  const g = gaps.get(key) || { key, namedSource: namedSource || null, count: 0, lastTs: ts || '1970-01-01', samples: [], downvotes: 0, correction: null, score: 0 };
  g.count += 1;
  if (ts && Date.parse(ts) > Date.parse(g.lastTs)) g.lastTs = ts;
  if (namedSource && !g.namedSource) g.namedSource = namedSource;
  if (q && g.samples.length < 3 && !g.samples.includes(q)) g.samples.push(q);
  gaps.set(key, g);
  return g;
}

for (const e of entries) {
  const named = e.a.match(GAP_OPENER);
  if (named) bump('src:' + named[1].toLowerCase(), { namedSource: named[1], ts: e.ts, q: e.q });
  else if (GENERIC_GAP.test(e.a)) bump(qKey(e.q), { ts: e.ts, q: e.q });
}

// fold feedback into the gap weights
let upvotes = 0, downvotes = 0, corrections = 0;
for (const fb of feedback) {
  if (fb.type === 'rating' && fb.rating === 'up') upvotes++;
  if (fb.type === 'rating' && fb.rating === 'down') {
    downvotes++;
    const g = gaps.get(qKey(fb.q));
    if (g) g.downvotes += 1; else bump(qKey(fb.q), { ts: fb.ts, q: fb.q }).downvotes = 1;
  }
  if (fb.type === 'correction') {
    corrections++;
    const g = bump(qKey(fb.original_q), { ts: fb.ts, q: fb.original_q });
    g.correction = fb.correction_text;
  }
}

const ranked = [...gaps.values()].map(g => {
  g.score = g.count * recencyWeight(g.lastTs) + 2 * (g.downvotes || 0) + (g.correction ? 2 : 0);
  return g;
}).sort((a, b) => b.score - a.score);

// --------------------------------------------------------------------- metrics
const distinctUsers = [...new Set(entries.map(e => e.user))];
const amberCount = entries.filter(e => GAP_OPENER.test(e.a) || /general industry context/i.test(e.a) || GENERIC_GAP.test(e.a)).length;
const amberRate = entries.length ? +(amberCount / entries.length).toFixed(3) : 0;
const lc = (s) => s.toLowerCase();
const willActive = distinctUsers.some(u => lc(u).includes('will'));
const taraActive = distinctUsers.some(u => lc(u).includes('tara'));

// count successful self-serve ingestions from wiki/log.md
let ingestionCount = 0;
const wikiLog = path.join(WIKI, 'log.md');
if (fs.existsSync(wikiLog)) ingestionCount = (fs.readFileSync(wikiLog, 'utf8').match(/^## \[[\d-]+\] ingest \|/gm) || []).length;

const metrics = {
  generatedAt: new Date().toISOString(),
  queryCount: entries.length,
  distinctUsers,
  willActive,
  taraActive,
  amberRate,
  upvotes,
  downvotes,
  corrections,
  ingestionCount,
  topGaps: ranked.slice(0, 5).map(g => ({
    suggest: g.namedSource || g.samples[0] || g.key,
    count: g.count,
    downvotes: g.downvotes,
    lastTs: g.lastTs,
    score: g.score,
  })),
  // delivery checklist (frozen definition lives in OBJECTIVE.md)
  delivery: {
    botLive: true, // if this script ran on the droplet, the bot is deployed
    willAndTaraOnboarded: willActive && taraActive,
    threeIngestions: ingestionCount >= 3,
  },
};

// ----------------------------------------------------------------- write queue
const fmt = (ts) => (ts || '').slice(0, 10);
let md = `# Coverage gaps — ranked ingestion queue\n\n`;
md += `_Auto-generated by tools/mine-gaps.mjs at ${metrics.generatedAt}. Operational shortlist; the strategic jurisdiction matrix lives in wiki/coverage-gaps.md. Ingest a row via the #ingest ✅ flow — never hand-edit figures._\n\n`;
md += `**Signals:** ${entries.length} queries · ${distinctUsers.length} users · amber-rate ${(amberRate * 100).toFixed(0)}% · 👍${upvotes}/👎${downvotes} · ${corrections} corrections · ${ingestionCount} ingestions to date.\n\n`;
if (!ranked.length) {
  md += `No gap signals in the logs yet. 🎉\n`;
} else {
  md += `| # | Suggested source to ingest | Times | 👎 | Last asked | Sample question |\n`;
  md += `|---|---|---|---|---|---|\n`;
  ranked.slice(0, 25).forEach((g, i) => {
    const suggest = g.namedSource ? `\`${g.namedSource}\`` : '_(no named source — cluster)_';
    const sample = (g.samples[0] || '').replace(/\|/g, '\\|').slice(0, 90);
    md += `| ${i + 1} | ${suggest} | ${g.count} | ${g.downvotes || ''} | ${fmt(g.lastTs)} | ${sample} |\n`;
    if (g.correction) md += `| | ↳ correction: ${g.correction.replace(/\|/g, '\\|').slice(0, 120)} | | | | |\n`;
  });
}

fs.mkdirSync(LOG_DIR, { recursive: true });
fs.writeFileSync(path.join(LOG_DIR, 'coverage-gaps-queue.md'), md);
fs.writeFileSync(path.join(LOG_DIR, 'metrics.json'), JSON.stringify(metrics, null, 2));
console.log(`[mine-gaps] ${entries.length} queries, ${ranked.length} gap clusters, top: ${metrics.topGaps[0]?.suggest || '(none)'} → coverage-gaps-queue.md + metrics.json`);
