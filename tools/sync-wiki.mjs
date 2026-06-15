// Sync the canonical wiki (NRG Knowledge Base/wiki — the master copy Claude
// maintains) into this repo's wiki/ before committing. One-way: master → repo.
// Run from the repo root: npm run sync-wiki
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MASTER = process.env.NRG_WIKI_MASTER
  || path.resolve(__dirname, '../../../../NRG Knowledge Base/wiki');
const REPO_WIKI = path.resolve(__dirname, '../wiki');

if (!fs.existsSync(path.join(MASTER, 'index.md'))) {
  console.error(`[sync-wiki] Master wiki not found at ${MASTER} — set NRG_WIKI_MASTER`);
  process.exit(1);
}
fs.rmSync(REPO_WIKI, { recursive: true, force: true });
fs.cpSync(MASTER, REPO_WIKI, { recursive: true });
const count = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(d, e.name));
    else if (e.name.endsWith('.md')) count.push(e.name);
  }
})(REPO_WIKI);
console.log(`[sync-wiki] ${MASTER} -> wiki/ (${count.length} md files)`);
