// Bulk text extraction for the NRG Knowledge Base batch ingest.
// =============================================================================
// Walks the OneDrive source library, extracts text from every PDF/DOCX/TXT,
// and writes a mirrored .txt staging tree + a manifest for triage.
//
// Usage:
//   node tools/extract-raw-text.mjs [--force]
//
// Inputs  (SOURCE_ROOT): C:\Users\tyron\OneDrive\Documents\Kampfire.Digital\NRG Knowledge Base
// Outputs (STAGING):     <kampfire-digital>\NRG Knowledge Base\ingest\raw-text\<mirrored path>.txt
//                        <kampfire-digital>\NRG Knowledge Base\ingest\manifest.json
//
// Skipped (recorded in manifest, handled separately):
//   .png  — need a vision pass (Claude Code reads images directly)
//   .xlsx/.pptx/.pages — need conversion or manual review
// =============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SOURCE_ROOT = process.env.NRG_SOURCE_ROOT
  || 'C:/Users/tyron/OneDrive/Documents/Kampfire.Digital/NRG Knowledge Base';
const KB_ROOT = process.env.NRG_KB_ROOT
  || path.resolve(__dirname, '../../../../NRG Knowledge Base');
const STAGING = path.join(KB_ROOT, 'ingest', 'raw-text');
const MANIFEST = path.join(KB_ROOT, 'ingest', 'manifest.json');
const FORCE = process.argv.includes('--force');

const SKIP_DIRS = new Set(['.git', 'node_modules', 'wiki']);
const MIN_CHARS = 100; // below this, treat as scanned/empty

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) out.push(...walk(path.join(dir, entry.name)));
    } else {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

async function extract(full, ext) {
  const buffer = fs.readFileSync(full);
  if (ext === '.pdf') return (await pdfParse(buffer)).text;
  if (ext === '.docx') return (await mammoth.extractRawText({ buffer })).value;
  if (ext === '.txt' || ext === '.md') return buffer.toString('utf-8');
  return null;
}

const manifest = [];
const files = walk(SOURCE_ROOT);
console.log(`Found ${files.length} files under source root`);

let ok = 0, skipped = 0, failed = 0, empty = 0;

for (const full of files) {
  const rel = path.relative(SOURCE_ROOT, full).replace(/\\/g, '/');
  const ext = path.extname(full).toLowerCase();
  const entry = { rel, ext, bytes: fs.statSync(full).size };

  if (['.pdf', '.docx', '.txt', '.md'].includes(ext)) {
    const target = path.join(STAGING, rel + '.txt');
    try {
      if (!FORCE && fs.existsSync(target)) {
        entry.status = 'ok';
        entry.chars = fs.statSync(target).size;
        entry.cached = true;
        ok++;
      } else {
        const text = (await extract(full, ext)) || '';
        const clean = text.replace(/\r\n/g, '\n').trim();
        if (clean.length < MIN_CHARS) {
          entry.status = 'empty';
          entry.chars = clean.length;
          entry.note = 'likely scanned/image-only — needs OCR or vision pass';
          empty++;
        } else {
          fs.mkdirSync(path.dirname(target), { recursive: true });
          fs.writeFileSync(target, clean);
          entry.status = 'ok';
          entry.chars = clean.length;
          ok++;
        }
      }
    } catch (err) {
      entry.status = 'error';
      entry.error = err.message.slice(0, 200);
      failed++;
    }
  } else if (ext === '.png') {
    entry.status = 'vision';
    entry.note = 'image — summarize via Claude Code vision pass';
    skipped++;
  } else if (['.xlsx', '.pptx', '.pages'].includes(ext)) {
    entry.status = 'manual';
    entry.note = 'needs conversion or manual review';
    skipped++;
  } else {
    continue; // .gitignore, hook samples, etc.
  }

  manifest.push(entry);
  if (manifest.length % 25 === 0) console.log(`  ...${manifest.length} processed`);
}

fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));

console.log(`\nDone. ${manifest.length} source files in manifest:`);
console.log(`  extracted ok: ${ok}`);
console.log(`  empty/scanned (needs OCR/vision): ${empty}`);
console.log(`  vision pass (png): ${manifest.filter(m => m.status === 'vision').length}`);
console.log(`  manual (xlsx/pptx/pages): ${manifest.filter(m => m.status === 'manual').length}`);
console.log(`  errors: ${failed}`);
console.log(`\nManifest: ${MANIFEST}`);
console.log(`Staging:  ${STAGING}`);
