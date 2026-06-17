// tools/post-digest.mjs — post the #bot-ops digest via a Discord webhook (no
// gateway needed). Reads bot-logs/metrics.json (from mine-gaps.mjs). Bound to the
// Wednesday NRG sync by the nrg-digest timer so the one human checkpoint — review
// & merge `droplet-telemetry` → `main` — rides a ritual that already happens.
//   node tools/post-digest.mjs          # post
//   node tools/post-digest.mjs --dry    # print only
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry');

let webhook = process.env.BOT_OPS_WEBHOOK || '';
const envPath = path.join(REPO, '.env');
if (!webhook && fs.existsSync(envPath)) {
  const m = fs.readFileSync(envPath, 'utf8').match(/^BOT_OPS_WEBHOOK=(.*)$/m);
  if (m) webhook = m[1].trim();
}

const metricsPath = path.join(REPO, 'bot-logs', 'metrics.json');
if (!fs.existsSync(metricsPath)) {
  console.error('[digest] no bot-logs/metrics.json — run tools/mine-gaps.mjs first');
  process.exit(1);
}
const m = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));

const box = (b) => (b ? '✅' : '⬜');
const d = m.delivery || {};
const allDelivered = d.botLive && d.willAndTaraOnboarded && d.threeIngestions;
const topGaps = (m.topGaps || []).slice(0, 3)
  .map((g, i) => `   ${i + 1}. ${g.suggest} (asked ${g.count}×${g.downvotes ? `, 👎${g.downvotes}` : ''})`)
  .join('\n') || '   (none — wiki is keeping up 🎉)';

const lines = [
  `**📊 NRG bot — weekly digest** · ${m.generatedAt.slice(0, 10)}`,
  ``,
  `**Usage:** ${m.queryCount} queries · ${m.distinctUsers.length} users (${m.distinctUsers.join(', ') || '—'})`,
  `**Quality:** amber-rate ${(m.amberRate * 100).toFixed(0)}% · 👍${m.upvotes}/👎${m.downvotes} · ${m.corrections} corrections`,
  ``,
  `**Top gaps to ingest** (drop the raw doc in #ingest → ✅):`,
  topGaps,
  ``,
  `**Progress to delivery** (invoice #2 trigger):`,
  `${box(d.botLive)} bot live   ${box(d.willAndTaraOnboarded)} Will & Tara onboarded   ${box(d.threeIngestions)} ≥3 ingestions (${m.ingestionCount})`,
  ...(allDelivered ? [`🎯 **DELIVERY CRITERIA MET — invoice #2 ($1,500) unblocked.** Notify only — send it yourself.`] : []),
  ``,
  `**👉 This week:** \`droplet-telemetry\` may hold new ingested pages + the refreshed gap queue — review/merge to \`main\`.`,
];
const body = lines.join('\n').slice(0, 1990);

if (DRY || !webhook) {
  console.log(body);
  if (!webhook) console.error('\n[digest] BOT_OPS_WEBHOOK not set — not posted.');
  process.exit(0);
}

const res = await fetch(webhook, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: body }),
});
console.log(`[digest] posted to #bot-ops (HTTP ${res.status})`);
