// NRG Knowledge Base — Discord Bot (production)
// =============================================================================
// Replaces the Telegram demo. Runs on a DigitalOcean droplet under PM2.
//
// Two channels, two jobs:
//   #wiki-bot — every message is a query against the wiki, answered by Claude
//   #ingest   — file uploads are summarised into draft wiki source pages
//               and merged into the wiki on owner approval (✅ reaction)
//
// All other channels are ignored.
//
// Knowledge architecture (v3 — scales past the 200K context window):
//   ALWAYS-LOADED (cached): index.md, config.md, concepts/ — the regulatory
//     backbone, sent as a prompt-cached static system prefix.
//   RETRIEVABLE: sources/, queries/, products/index.md — listed in a one-line
//     catalog; Claude pulls only the pages (or, for large pages, the specific
//     SECTIONS via `path#Section`) it needs per query via read_wiki_files.
//   Result: per-query cost stays flat (~$0.02-0.05) whether the wiki holds
//   30 pages or 500. The old design shipped the entire wiki uncached every
//   query and would overflow the context window past ~100 source pages.
//   Token tuning (2026-06-16): products/index.md demoted to retrievable;
//   section-level retrieval; adaptive round cap (MAX_FETCH_PAGES); per-page
//   fetch counters (logs/fetch-stats.json, surfaced in /status) for pruning.
//
// Setup:
//   1. Copy .env.example to .env and fill in every value
//   2. npm install
//   3. node bot.js  (or `pm2 start ecosystem.config.cjs` in production)
// =============================================================================

import 'dotenv/config';
import {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  EmbedBuilder,
  MessageFlags,
  REST,
  Routes,
  SlashCommandBuilder,
} from 'discord.js';
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------------------------------
// Environment
// -----------------------------------------------------------------------------
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
const WIKI_BOT_CHANNEL_ID = process.env.WIKI_BOT_CHANNEL_ID;
const INGEST_CHANNEL_ID = process.env.INGEST_CHANNEL_ID;
const OWNER_USER_ID = process.env.OWNER_USER_ID;
const NRG_TEAM_ROLE_ID = process.env.NRG_TEAM_ROLE_ID || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const WIKI_ROOT = process.env.WIKI_ROOT || path.join(__dirname, 'wiki');
const MODEL = process.env.MODEL || 'claude-sonnet-4-6';
const MAX_INGEST_BYTES = parseInt(process.env.MAX_INGEST_BYTES || '20971520', 10); // 20 MB
const MAX_TOOL_ROUNDS = parseInt(process.env.MAX_TOOL_ROUNDS || '3', 10);
const MAX_FETCH_CHARS = parseInt(process.env.MAX_FETCH_CHARS || '120000', 10); // per-query retrieval budget
// Adaptive cap: once a query has fetched this many pages, force a text answer on
// the next round instead of allowing another retrieval (stops greedy multi-round
// re-sends of the whole conversation). 0 disables.
const MAX_FETCH_PAGES = parseInt(process.env.MAX_FETCH_PAGES || '6', 10);
// Pages at/above this size get their section list shown in the catalog, so the
// model can fetch `path#Section` instead of the whole page. Small/medium pages
// don't — section-fetching them saves little, and their markers bloat the cached
// prefix. Only the big reference volumes (NCC, handbooks) clear this bar.
const SECTION_CATALOG_MIN_CHARS = parseInt(process.env.SECTION_CATALOG_MIN_CHARS || '8000', 10);

// `node bot.js --dry-run` builds the wiki layers + system prompt, prints stats,
// and exits before touching Discord or Anthropic. Run before every deploy.
const DRY_RUN = process.argv.includes('--dry-run');

// `node bot.js --bench [questions.txt]` replays a question set through the real
// retrieval path (no Discord) and prints per-question token usage + cost — used
// to measure token-spend changes before/after. Needs ANTHROPIC_API_KEY only.
const BENCH = process.argv.includes('--bench');

const requiredEnv = {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  DISCORD_GUILD_ID,
  WIKI_BOT_CHANNEL_ID,
  INGEST_CHANNEL_ID,
  OWNER_USER_ID,
  ANTHROPIC_API_KEY,
};
for (const [k, v] of Object.entries(requiredEnv)) {
  if (!v && !DRY_RUN && !BENCH) {
    console.error(`[fatal] Missing required env var: ${k}`);
    process.exit(1);
  }
}
if (BENCH && !ANTHROPIC_API_KEY) {
  console.error('[fatal] --bench requires ANTHROPIC_API_KEY');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// -----------------------------------------------------------------------------
// Wiki loader — two layers
//   ALWAYS-LOADED: regulatory backbone, ships (cached) in every system prompt
//   RETRIEVABLE:   source/query pages, cataloged + fetched on demand via tool
// -----------------------------------------------------------------------------
// Files/dirs (relative to WIKI_ROOT) that are always in context:
// products/index.md was moved to retrievable (2026-06-16) — it's ~12K chars and
// rarely needed every query; product questions fetch it on demand.
const ALWAYS_FILES = ['index.md', 'config.md'];
const ALWAYS_DIRS = ['concepts'];
// Wiki-root files that are neither loaded nor cataloged:
const EXCLUDE_FILES = new Set(['CLAUDE.md', 'log.md']);

function walkMd(dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkMd(full));
    } else if (entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

function relPath(full) {
  return path.relative(WIKI_ROOT, full).replace(/\\/g, '/');
}

function isAlwaysLoaded(rel) {
  return ALWAYS_FILES.includes(rel) || ALWAYS_DIRS.some(d => rel.startsWith(d + '/'));
}

// One-line catalog entry: frontmatter title + first Summary line (or first prose line).
function summarizeForCatalog(content) {
  let title = '';
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (fm) {
    const t = fm[1].match(/^title:\s*(.+)$/m);
    if (t) title = t[1].trim();
  }
  let summary = '';
  const sm = content.match(/##\s*Summary\s*\n+([^\n]+)/);
  if (sm) {
    summary = sm[1].trim();
  } else {
    const body = content.replace(/^---[\s\S]*?---/, '');
    summary = (body.split('\n').find(l => l.trim() && !l.trim().startsWith('#')) || '').trim();
  }
  return `${title || '(untitled)'} — ${summary}`.slice(0, 240);
}

// Split a page into its `## ` (h2) sections so the model can fetch just the part
// it needs. Returns the frontmatter title + an ordered [{name, body}] list.
// Content before the first `##` (frontmatter, h1, intro) isn't a section — when a
// section is requested we re-attach the title for context.
function parseSections(content) {
  let title = '';
  const fm = content.match(/^---\n([\s\S]*?)\n---/);
  if (fm) { const t = fm[1].match(/^title:\s*(.+)$/m); if (t) title = t[1].trim(); }
  const sections = [];
  let cur = null;
  for (const line of content.split('\n')) {
    const h = line.match(/^##\s+(.+?)\s*$/);
    if (h) { cur = { name: h[1].trim(), body: [] }; sections.push(cur); }
    else if (cur) { cur.body.push(line); }
  }
  return { title, sections: sections.map(s => ({ name: s.name, body: s.body.join('\n').trim() })) };
}

function loadWiki() {
  const always = [];
  const retrievable = new Map(); // rel path -> { content, catalogLine, title, sections }
  for (const full of walkMd(WIKI_ROOT)) {
    const rel = relPath(full);
    if (EXCLUDE_FILES.has(rel) || rel.endsWith('/README.md')) continue;
    const content = fs.readFileSync(full, 'utf-8');
    if (isAlwaysLoaded(rel)) {
      always.push({ path: rel, content });
    } else {
      const { title, sections } = parseSections(content);
      retrievable.set(rel, { content, catalogLine: summarizeForCatalog(content), title, sections });
    }
  }
  return { always, retrievable };
}

let wiki = loadWiki();
console.log(`[startup] Wiki loaded: ${wiki.always.length} always-loaded pages, ${wiki.retrievable.size} retrievable pages`);

function wikiFileCount() {
  return wiki.always.length + wiki.retrievable.size;
}

function reloadWiki() {
  wiki = loadWiki();
  SYSTEM_PROMPT = buildSystemPrompt();
  return wikiFileCount();
}

// -----------------------------------------------------------------------------
// System prompt — static prefix, prompt-cached. Same anti-fabrication rules,
// adapted for retrieval: the bot must FETCH before it answers or denies.
// -----------------------------------------------------------------------------
function buildSystemPrompt() {
  const alwaysContents = wiki.always
    .map(f => `\n=== FILE: ${f.path} ===\n${f.content}`)
    .join('\n');

  const catalog = [...wiki.retrievable.entries()]
    .map(([rel, f]) => {
      let line = `- ${rel} — ${f.catalogLine}`;
      // Large reference pages: list their sections so the model can fetch just one.
      if (f.content.length >= SECTION_CATALOG_MIN_CHARS && f.sections.length > 1) {
        line += `  · §${f.sections.map(s => s.name).join(' | ')}`;
      }
      return line;
    })
    .join('\n');

  return `You are NRG's internal knowledge base assistant. NRG is an Australian residential energy efficiency consultancy. NRG's team members (Will, Matt, Tara, and contractors in Pakistan) query you for quick answers about Australian energy efficiency regulations and building products.

DOMAIN: NatHERS, 7-Star ratings, Whole-of-Home (WoH), BASIX (NSW), National Construction Code (NCC 2019/2022/2025 PCD), Specification 44, climate zones, and product datasheets (insulation, glazing, wraps, walls, flooring, roofing).

HOW YOUR KNOWLEDGE BASE WORKS:
- ALWAYS-LOADED PAGES (full text at the bottom of this prompt): the master index, concept pages (regulatory backbone), and the product catalog.
- SOURCE PAGE CATALOG (one line per page, below): the full text of these pages is NOT loaded. To read any of them, call the read_wiki_files tool. Batch every page you think you'll need into a SINGLE call — don't fetch one at a time.
- SECTION ADDRESSING (saves tokens): large reference pages list their sections after a "§" in the catalog. Fetch only the section(s) you need by appending "#Section name" to the path — e.g. "sources/src-ncc2022-housing-provisions-2022.md#Key claims". Use a bare path (whole page) for short datasheets, or when you're unsure which section holds the figure. If a fetched section turns out not to contain the figure, fetch another section or the whole page — never guess the number.
- RETRIEVAL DISCIPLINE: never answer a question involving specific figures (R-values, U-values, clause numbers, solar absorptance, star credits, etc.) from the catalog one-liner or from memory — retrieve the source page first. Only declare "I don't have that in the wiki" AFTER you have scanned the catalog and retrieved the likeliest pages. The master index also lists the raw (un-ingested) document library — when the wiki is silent, point to the raw document that should be ingested next.

RULES:
1. **BE BRIEF — THIS IS THE MOST IMPORTANT RULE ALONGSIDE RULE 5.** NRG's team queries you to save time. Lead with the direct answer in the FIRST sentence, then give only the supporting detail that question actually needs. Default to **3–6 short sentences or a tight bullet list**. Only go longer if the user explicitly asks for "everything", "the full process", a step-by-step, or a comparison. Never pad. When the answer is "I don't have it", that IS the answer — lead with it and stop.
   - Answer ONLY the question asked. Don't volunteer adjacent topics, upgrade lists, or caveats the user didn't ask for.
   - Cut throat-clearing ("Great —", "Here's the full picture", "Here's a practical rundown"). Open with the substance.
2. Cite specific source files by name when you use them (e.g. "from sources/src-hebel.md").
3. Use Australian English and Australian regulatory terminology.
4. **NCC VERSION DISCIPLINE.** Energy provisions differ between NCC 2019, NCC 2022, and NCC 2025 (PCD), and answering with the wrong version's rules is a serious error.
   (a) If the question does NOT state which NCC version applies, ASK the user to confirm (2019, 2022, or 2025) BEFORE giving any version-specific figure, clause, or table — do not assume the latest.
   (b) When answering about one version, use ONLY that version's provisions. NEVER substitute or cross-cite another version's rules as if they apply (e.g. do not answer an NCC 2019 question with NCC 2022 Housing Provisions constructs).
   (c) ALWAYS label which NCC version every regulatory claim comes from.
5. **HARD RULE — NEVER FABRICATE SPECIFICS.** If a specific R-value, U-value, k-value, solar absorptance, NCC clause number, regulation number, or any other numeric/regulatory specific is NOT explicitly stated in the always-loaded pages or in source pages you have retrieved this conversation, your reply MUST:
   (a) **Open with**: "I don't have that specific figure in the wiki — check \`<exact source filename from the catalog or raw library>\`."
   (b) Only after that opening line, you MAY offer general context, but it MUST be prefixed with: "**General industry context (not from the wiki, verify before quoting):**" and you MUST NOT state a specific figure with confidence — use ranges or qualitative language only.
   Confident wrong numbers destroy trust. "I don't know — check X" is always the right answer when the wiki is silent.
6. (See rule 1 — brevity is paramount.) Practical over exhaustive: give the figure/clause and the one thing they need to do with it, not a textbook chapter.
7. If a question requires professional judgement (e.g. plan interpretation, conflicting client notes), recommend the team verify with the source, don't just decide for them.
8. FORMATTING — keep it clean and minimal for Discord. Use **bold** for the key figure/term, \`code\` for clause numbers and filenames, and short bullets. HARD BANS: no \`#\`/\`##\` headings, no \`---\` horizontal-rule dividers, no emoji section icons (🧱🪟💨 etc.), no decorative tables. A markdown table is allowed ONLY when the user explicitly asked to compare options side by side. Put the source citation inline or in one short line at the end — not as its own banner section.

SOURCE PAGE CATALOG (retrievable via read_wiki_files):
${catalog || '- (no retrievable pages yet)'}

ALWAYS-LOADED PAGES BELOW:
${alwaysContents}`;
}

let SYSTEM_PROMPT = buildSystemPrompt();
console.log(`[startup] System prompt size: ${SYSTEM_PROMPT.length} chars (cached static prefix)`);

// Short, uncached reminder sent as a SECOND system block AFTER the big cached
// prefix — lands right before generation so brevity isn't diluted by the ~90k
// chars of wiki content above it. This is the main brevity lever; the prompt
// rules alone get buried by recency.
const BREVITY_REMINDER = `BEFORE YOU ANSWER, RE-READ THIS:
You are answering in Discord, not writing a document. Keep it SHORT.
- Hard ceiling: **6 sentences OR 8 bullet points, whichever you use — never both, never more.** Most answers should be 1–3 sentences.
- First sentence = the direct answer (the figure, the clause, the yes/no). Stop as soon as it's answered.
- NO headings, NO \`---\` dividers, NO emoji icons, NO tables (unless an explicit side-by-side compare was asked).
- NO preamble ("Great —", "Here's the full picture"), NO closing summary, NO "quick summary" recap. Say it once.
- Answer ONLY what was asked. Do not add adjacent tips, upgrade lists, or unrequested caveats.
- Cite the source as a short trailing line, e.g. "Source: \`src-xxx.md\`". That's it.
If you're about to write more than 6 sentences, you are doing it wrong — cut it down.`;

if (DRY_RUN) {
  console.log('\n[dry-run] Always-loaded pages:');
  for (const f of wiki.always) console.log(`  ${f.path} (${f.content.length} chars)`);
  console.log('\n[dry-run] Retrievable catalog:');
  for (const [rel, f] of wiki.retrievable) console.log(`  ${rel} — ${f.catalogLine}`);
  console.log(`\n[dry-run] Static prefix ≈ ${Math.round(SYSTEM_PROMPT.length / 4).toLocaleString()} tokens; cache read ≈ $${(SYSTEM_PROMPT.length / 4 * 0.3 / 1e6).toFixed(4)}/query`);
  process.exit(0);
}

// -----------------------------------------------------------------------------
// Per-user conversation memory (in-memory, per Discord user ID)
// -----------------------------------------------------------------------------
const conversations = new Map();
const MAX_HISTORY = 10;

function getHistory(userId) {
  return conversations.get(userId) || [];
}

function appendHistory(userId, userMsg, assistantMsg) {
  const h = getHistory(userId);
  h.push({ role: 'user', content: userMsg });
  h.push({ role: 'assistant', content: assistantMsg });
  conversations.set(userId, h.slice(-MAX_HISTORY));
}

// -----------------------------------------------------------------------------
// Audit log — every Q&A feeds back to wiki/bot-logs/YYYY-MM-DD.md
// -----------------------------------------------------------------------------
function logQuery(user, question, answer) {
  try {
    const logDir = path.join(WIKI_ROOT, '..', 'bot-logs');
    fs.mkdirSync(logDir, { recursive: true });
    const today = new Date().toISOString().slice(0, 10);
    const logFile = path.join(logDir, `${today}.md`);
    const ts = new Date().toISOString();
    const entry = `\n## ${ts} — ${user}\n\n**Q:** ${question}\n\n**A:** ${answer}\n\n---\n`;
    fs.appendFileSync(logFile, entry);
  } catch (err) {
    console.error('[audit] Failed to log query:', err.message);
  }
}

// -----------------------------------------------------------------------------
// Access control
// -----------------------------------------------------------------------------
function isAllowed(member) {
  if (!NRG_TEAM_ROLE_ID) return true;
  if (!member) return false;
  return member.roles.cache.has(NRG_TEAM_ROLE_ID) || member.id === OWNER_USER_ID;
}

// -----------------------------------------------------------------------------
// Message chunking (Discord 2000-char limit)
// -----------------------------------------------------------------------------
async function sendChunked(channel, text) {
  const limit = 1900;
  if (text.length <= limit) {
    await channel.send(text);
    return;
  }
  for (let i = 0; i < text.length; i += limit) {
    await channel.send(text.slice(i, i + limit));
  }
}

// -----------------------------------------------------------------------------
// Rich embed answers (Q&A in #wiki-bot)
// -----------------------------------------------------------------------------
const COLOR_WIKI = 0x2ECC71;    // green  — answer grounded in the wiki
const COLOR_CAUTION = 0xF59E0B; // amber  — wiki silent / general context, verify
const COLOR_ERROR = 0xED4245;   // red    — something broke
const COLOR_BRAND = 0xE97451;   // orange — NRG brand (help/info)

// Color the embed by trust: amber if the anti-fabrication opener fired or the
// answer leaned on non-wiki context (system prompt rules 5a/5b), else green.
function pickAnswerColor(answer) {
  const a = answer.toLowerCase();
  if (a.includes("i don't have") || a.includes('not from the wiki')) return COLOR_CAUTION;
  return COLOR_WIKI;
}

// Pull cited wiki filenames out of the answer for the Sources field.
function extractSources(answer) {
  const matches = [...answer.matchAll(/(?:[a-z0-9_-]+\/)?(?:src-[a-z0-9_-]+|index|config|log|CLAUDE)\.md/gi)]
    .map(m => m[0]);
  return [...new Set(matches)];
}

// Discord embed descriptions cap at 4096 chars — split long answers on a newline.
function chunkForEmbed(text, size = 4000) {
  if (text.length <= size) return [text];
  const chunks = [];
  let rest = text;
  while (rest.length > size) {
    let cut = rest.lastIndexOf('\n', size);
    if (cut < size * 0.5) cut = size; // no sensible break point — hard cut
    chunks.push(rest.slice(0, cut));
    rest = rest.slice(cut);
  }
  if (rest.trim()) chunks.push(rest);
  return chunks;
}

function truncate(str, max) {
  return str.length <= max ? str : str.slice(0, max - 1) + '…';
}

async function sendAnswerEmbed(message, question, answer) {
  const color = pickAnswerColor(answer);
  const sources = extractSources(answer);
  const chunks = chunkForEmbed(answer);

  for (let i = 0; i < chunks.length; i++) {
    const embed = new EmbedBuilder().setColor(color).setDescription(chunks[i]);

    if (i === 0) {
      embed.setAuthor({ name: truncate(`❓ ${question}`, 256) });
    }
    if (i === chunks.length - 1) {
      if (sources.length) {
        embed.addFields({
          name: '📎 Sources',
          value: truncate(sources.map(s => `\`${s}\``).join('  ·  '), 1024),
        });
      }
      embed.setFooter({ text: `NRG Knowledge Base  ·  ${MODEL}` });
    }

    if (i === 0) {
      await message.reply({ embeds: [embed] });
    } else {
      await message.channel.send({ embeds: [embed] });
    }
  }
}

// -----------------------------------------------------------------------------
// Discord client
// -----------------------------------------------------------------------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// -----------------------------------------------------------------------------
// Slash commands
// -----------------------------------------------------------------------------
const slashCommands = [
  new SlashCommandBuilder().setName('help').setDescription('Show what the NRG bot does and how to use it'),
  new SlashCommandBuilder().setName('reset').setDescription('Clear your own conversation history with the bot'),
  new SlashCommandBuilder().setName('reload').setDescription('Reload the wiki from disk (owner only)'),
  new SlashCommandBuilder().setName('status').setDescription('Show bot status — wiki size, uptime, model'),
].map(c => c.toJSON());

async function registerSlashCommands() {
  const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN);
  try {
    await rest.put(
      Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_GUILD_ID),
      { body: slashCommands },
    );
    console.log('[startup] Slash commands registered');
  } catch (err) {
    console.error('[startup] Slash command registration failed:', err.message);
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const { commandName, user } = interaction;

  if (commandName === 'help') {
    const embed = new EmbedBuilder()
      .setColor(COLOR_BRAND)
      .setTitle('NRG Knowledge Base Bot — quick guide')
      .setDescription("Your team's instant answer desk for Australian energy-efficiency regs and product specs.")
      .addFields(
        {
          name: '💬  #wiki-bot',
          value: "Ask anything about NatHERS, NCC, BASIX, climate zones, or product specs. I'll cite the source. If I don't know, I'll say so — I won't make up numbers.",
        },
        {
          name: '📥  #ingest',
          value: "Drop a PDF, Word doc, or text file here. I'll draft a wiki summary and post it for approval. The wiki only changes after Tyrone reacts ✅.",
        },
        {
          name: '⚙️  Slash commands',
          value: "`/reset` — clear your chat history\n`/status` — uptime + wiki size\n`/help` — this message",
        },
      )
      .setFooter({ text: '🟢 green = from the wiki  ·  🟠 amber = verify before quoting' });
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }

  if (commandName === 'reset') {
    conversations.delete(user.id);
    await interaction.reply({ content: 'Your conversation history has been cleared.', flags: MessageFlags.Ephemeral });
    return;
  }

  if (commandName === 'reload') {
    if (user.id !== OWNER_USER_ID) {
      await interaction.reply({ content: 'Only the bot owner can reload the wiki.', flags: MessageFlags.Ephemeral });
      return;
    }
    const count = reloadWiki();
    await interaction.reply({ content: `Wiki reloaded — ${count} files in context.`, flags: MessageFlags.Ephemeral });
    return;
  }

  if (commandName === 'status') {
    const uptimeSec = Math.floor(process.uptime());
    const h = Math.floor(uptimeSec / 3600);
    const m = Math.floor((uptimeSec % 3600) / 60);
    const embed = new EmbedBuilder()
      .setColor(COLOR_WIKI)
      .setTitle('📊  Bot status')
      .setDescription('🟢 Online')
      .addFields(
        { name: 'Wiki pages', value: `${wikiFileCount()} (${wiki.always.length} core + ${wiki.retrievable.size} retrievable)`, inline: true },
        { name: 'Uptime', value: `${h}h ${m}m`, inline: true },
        { name: 'Model', value: `\`${MODEL}\``, inline: true },
        { name: 'Core context', value: `${SYSTEM_PROMPT.length.toLocaleString()} chars (prompt-cached)`, inline: true },
        { name: 'Last query', value: lastUsage ? `${lastUsage.rounds} round(s), ${lastUsage.pagesFetched} page(s), ~$${estCost(lastUsage).toFixed(4)}` : '—', inline: true },
        { name: 'Since restart', value: `${sessionUsage.queries} queries, ~$${sessionUsage.cost.toFixed(2)}`, inline: true },
        { name: 'Retrieval coverage', value: `${Object.keys(fetchCounts).length}/${wiki.retrievable.size} pages fetched ≥1× (all-time)`, inline: true },
      )
      .setFooter({ text: 'NRG Knowledge Base' });
    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    return;
  }
});

// -----------------------------------------------------------------------------
// Retrieval tool + usage accounting
// -----------------------------------------------------------------------------
const RETRIEVAL_TOOLS = [{
  name: 'read_wiki_files',
  description: 'Read wiki pages (or specific sections of large pages) from the source page catalog. Batch every page/section you expect to need into a SINGLE call. To read just one section of a large page, append "#Section name" to the path (section names are listed after "§" in the catalog); a bare path returns the whole page.',
  input_schema: {
    type: 'object',
    properties: {
      paths: {
        type: 'array',
        items: { type: 'string' },
        description: 'Wiki-relative path exactly as in the catalog, optionally with a section, e.g. "sources/src-hebel-r-value.md" (whole page) or "sources/src-ncc2022-housing-provisions-2022.md#Key claims" (one section).',
      },
    },
    required: ['paths'],
  },
}];

// Per-page retrieval counts (persisted) — data for audit-driven catalog pruning.
const FETCH_STATS_FILE = path.join(__dirname, 'logs', 'fetch-stats.json');
let fetchCounts = {};
try { fetchCounts = JSON.parse(fs.readFileSync(FETCH_STATS_FILE, 'utf-8')); } catch { fetchCounts = {}; }
function bumpFetch(p) { fetchCounts[p] = (fetchCounts[p] || 0) + 1; }
function saveFetchStats() { try { fs.writeFileSync(FETCH_STATS_FILE, JSON.stringify(fetchCounts)); } catch { /* logs/ may be read-only */ } }

// Resolve a requested section name against a page's sections: exact, then prefix
// (so "13.2" matches "13.2 Fabric"), then substring. Case-insensitive.
function matchSection(page, want) {
  const w = want.toLowerCase();
  return page.sections.find(s => s.name.toLowerCase() === w)
      || page.sections.find(s => s.name.toLowerCase().startsWith(w))
      || page.sections.find(s => s.name.toLowerCase().includes(w));
}

// Sonnet pricing (USD per MTok) for the console cost line — estimate only.
const PRICE = { input: 3, output: 15, cacheWrite: 3.75, cacheRead: 0.3 };

function emptyUsage() {
  return { input: 0, output: 0, cacheWrite: 0, cacheRead: 0, rounds: 0, pagesFetched: 0 };
}

function addUsage(totals, response) {
  const u = response.usage || {};
  totals.input += u.input_tokens || 0;
  totals.output += u.output_tokens || 0;
  totals.cacheWrite += u.cache_creation_input_tokens || 0;
  totals.cacheRead += u.cache_read_input_tokens || 0;
  totals.rounds += 1;
}

function estCost(t) {
  return (t.input * PRICE.input + t.output * PRICE.output
    + t.cacheWrite * PRICE.cacheWrite + t.cacheRead * PRICE.cacheRead) / 1e6;
}

let lastUsage = null;
const sessionUsage = { queries: 0, cost: 0 };

// Serve a read_wiki_files call. Unknown paths get a corrective message rather
// than an error so the model can re-request; a per-query char budget keeps a
// greedy fetch from blowing out cost.
function readPagesForTool(paths, budget) {
  const parts = [];
  let fetched = 0;
  for (const raw of [...new Set(paths)]) {
    const hash = raw.indexOf('#');
    const p = (hash >= 0 ? raw.slice(0, hash) : raw).trim();
    const wantSection = hash >= 0 ? raw.slice(hash + 1).trim() : null;
    const page = wiki.retrievable.get(p);
    if (!page) {
      parts.push(`=== FILE: ${raw} ===\n(NOT FOUND — use an exact path from the source page catalog)`);
      continue;
    }

    // Default: whole page. If a section was requested and matches, return just that
    // section (re-attaching the page title for context); otherwise fall back to the
    // whole page with a note listing the available sections.
    let label = p;
    let body = page.content;
    if (wantSection) {
      const sec = matchSection(page, wantSection);
      if (sec) {
        label = `${p}#${sec.name}`;
        body = `# ${page.title || p}\n\n## ${sec.name}\n${sec.body}`;
      } else {
        parts.push(`=== NOTE ===\n(Section "${wantSection}" not found in ${p} — returning whole page. Sections: ${page.sections.map(s => s.name).join(', ') || 'none'})`);
      }
    }

    if (budget.remaining - body.length < 0) {
      parts.push(`=== FILE: ${label} ===\n(SKIPPED — retrieval budget for this query is exhausted. Answer with what you have, or tell the user the question is too broad for one query.)`);
      continue;
    }
    budget.remaining -= body.length;
    fetched++;
    bumpFetch(p);
    parts.push(`=== FILE: ${label} ===\n${body}`);
  }
  return { text: parts.join('\n\n'), fetched };
}

// Multi-round Claude call: cached static prefix + on-demand page retrieval.
async function answerWithRetrieval(history, userText) {
  const messages = [...history, { role: 'user', content: userText }];
  const usage = emptyUsage();
  const budget = { remaining: MAX_FETCH_CHARS };
  let forceAnswer = false; // set once enough pages are fetched (adaptive cap)

  for (let round = 0; ; round++) {
    // Allow another retrieval only if under the round cap AND the adaptive
    // page cap hasn't tripped — otherwise force a text answer (no more re-sends).
    const allowTools = round < MAX_TOOL_ROUNDS && !forceAnswer;
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 800,
      system: [
        { type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: BREVITY_REMINDER },
      ],
      tools: RETRIEVAL_TOOLS,
      tool_choice: allowTools ? { type: 'auto' } : { type: 'none' },
      messages,
    });
    addUsage(usage, response);

    if (response.stop_reason !== 'tool_use') {
      const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
      saveFetchStats();
      return { text, usage };
    }

    messages.push({ role: 'assistant', content: response.content });
    const toolResults = [];
    for (const block of response.content) {
      if (block.type !== 'tool_use') continue;
      const paths = Array.isArray(block.input?.paths) ? block.input.paths : [];
      const { text, fetched } = readPagesForTool(paths, budget);
      usage.pagesFetched += fetched;
      console.log(`[retrieve] round ${round + 1}: ${paths.join(', ')} (${fetched} served)`);
      toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: text || '(no paths requested)' });
    }
    messages.push({ role: 'user', content: toolResults });
    // Adaptive cap: enough fetched — answer next round rather than retrieve again.
    if (MAX_FETCH_PAGES > 0 && usage.pagesFetched >= MAX_FETCH_PAGES) forceAnswer = true;
  }
}

// -----------------------------------------------------------------------------
// Benchmark mode — replay a question set through answerWithRetrieval (no Discord)
// and print per-question + aggregate token usage. `node bot.js --bench [file]`.
// One process = one ephemeral-cache window, so Q2+ read the cached prefix exactly
// like real back-to-back queries.
// -----------------------------------------------------------------------------
async function runBench() {
  const idx = process.argv.indexOf('--bench');
  const fileArg = process.argv[idx + 1];
  const qfile = fileArg && !fileArg.startsWith('--') ? fileArg : null;
  const questions = (qfile ? fs.readFileSync(qfile, 'utf-8') : '')
    .split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
  if (!questions.length) {
    console.error('[bench] no questions — pass a file: node bot.js --bench questions.txt');
    process.exit(1);
  }
  console.log(`[bench] model=${MODEL} | static prefix ≈ ${Math.round(SYSTEM_PROMPT.length / 4)} tok | ${questions.length} questions\n`);
  let totalCost = 0, totalRounds = 0, totalPages = 0;
  for (const q of questions) {
    const { text, usage } = await answerWithRetrieval([], q);
    const cost = estCost(usage);
    totalCost += cost; totalRounds += usage.rounds; totalPages += usage.pagesFetched;
    console.log(`[bench] Q: ${q}`);
    console.log(`[bench]   rounds=${usage.rounds} pages=${usage.pagesFetched} in=${usage.input} out=${usage.output} cache_read=${usage.cacheRead} cache_write=${usage.cacheWrite} est=$${cost.toFixed(4)}`);
    console.log(`[bench]   A: ${text.slice(0, 160).replace(/\n/g, ' ')}…\n`);
  }
  const n = questions.length;
  console.log(`[bench] === ${n} Q | total=$${totalCost.toFixed(4)} | avg=$${(totalCost / n).toFixed(4)}/answer | avg rounds=${(totalRounds / n).toFixed(1)} pages=${(totalPages / n).toFixed(1)} ===`);
  process.exit(0);
}

// -----------------------------------------------------------------------------
// Wiki Q&A handler — fires on every message in #wiki-bot
// -----------------------------------------------------------------------------
async function handleWikiQuery(message) {
  if (!isAllowed(message.member)) {
    await message.reply("Sorry, this bot is restricted to authorised NRG team members. Ask Matt or Tyrone to assign you the NRG Team role.");
    return;
  }

  const userText = message.content.trim();
  if (!userText) return;

  console.log(`[query] ${message.author.username}: ${userText}`);

  let typingInterval;
  try {
    await message.channel.sendTyping();
    typingInterval = setInterval(() => message.channel.sendTyping().catch(() => {}), 8000);

    const history = getHistory(message.author.id);
    const { text: reply, usage } = await answerWithRetrieval(history, userText);

    lastUsage = usage;
    sessionUsage.queries += 1;
    sessionUsage.cost += estCost(usage);
    console.log(`[usage] rounds=${usage.rounds} pages=${usage.pagesFetched} in=${usage.input} out=${usage.output} cache_read=${usage.cacheRead} cache_write=${usage.cacheWrite} est=$${estCost(usage).toFixed(4)}`);

    appendHistory(message.author.id, userText, reply);
    logQuery(message.author.username, userText, reply);

    clearInterval(typingInterval);
    await sendAnswerEmbed(message, userText, reply);

    console.log(`[reply] ${message.author.username}: ${reply.slice(0, 80)}...`);
  } catch (err) {
    clearInterval(typingInterval);
    console.error('[query error]', err);
    await message.reply({
      embeds: [new EmbedBuilder()
        .setColor(COLOR_ERROR)
        .setTitle('⚠️ Error')
        .setDescription(`Hit an error: \`${err.message}\`\n\nTry \`/reset\` and ask again.`)],
    });
  }
}

// -----------------------------------------------------------------------------
// Ingestion handler — fires on file uploads in #ingest
// -----------------------------------------------------------------------------
const pendingIngestions = new Map(); // previewMessageId -> { sourceText, suggestedFilename, originalAttachmentName, requestedBy }

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function downloadToBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} downloading attachment`));
        return;
      }
      const chunks = [];
      let total = 0;
      res.on('data', (chunk) => {
        total += chunk.length;
        if (total > MAX_INGEST_BYTES) {
          reject(new Error(`File too large (>${MAX_INGEST_BYTES} bytes)`));
          res.destroy();
          return;
        }
        chunks.push(chunk);
      });
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function extractText(buffer, filename) {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.pdf')) {
    const data = await pdfParse(buffer);
    return data.text;
  }
  if (lower.endsWith('.docx')) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  if (lower.endsWith('.txt') || lower.endsWith('.md')) {
    return buffer.toString('utf-8');
  }
  throw new Error(`Unsupported file type: ${filename}. Supported: PDF, DOCX, TXT, MD.`);
}

async function draftWikiSourcePage(rawText, attachmentName) {
  const truncated = rawText.slice(0, 80000); // keep token cost bounded
  const promptText = `You are drafting a wiki source page for NRG's knowledge base from the document below. The document was uploaded by an NRG team member who wants this added to the searchable wiki.

OUTPUT FORMAT — produce EXACTLY this markdown structure, nothing else:

---
title: <concise title derived from the document>
type: source
created: ${new Date().toISOString().slice(0, 10)}
source: ${attachmentName}
---

# <Same concise title>

## Summary

<2-4 sentence summary of what this document is and what it covers. Plain prose. No bullets.>

## Key claims

<5-15 bullet points. Each bullet captures one specific claim, value, or rule from the document. Where the document gives a specific number (R-value, U-value, percentage, clause reference), quote it exactly with the unit. Where the document is qualitative, paraphrase precisely.>

## Concepts touched

<Comma-separated list of regulatory concepts or product categories this document relates to. Examples: NatHERS, 7-Star, Whole-of-Home, BASIX, NCC 2022, Spec 44, climate zones, insulation, glazing, wraps, walls, flooring, roofing.>

## Caveats

<1-3 bullet points flagging anything that limits the document's authority. Examples: version date, jurisdictional scope, draft status, conflicting claims with other sources. If none, write: "None identified."

HARD RULE — NEVER FABRICATE. If a specific value isn't in the document, do not invent one. Use qualitative language ("the document discusses solar absorptance ranges") rather than a specific number you can't substantiate. Confident wrong numbers destroy the wiki's value.

DOCUMENT TEXT BELOW:
---
${truncated}`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2500,
    system: 'You are a careful technical editor. You produce concise, factually grounded wiki summaries. You never fabricate specifics. Australian English. Australian regulatory context.',
    messages: [{ role: 'user', content: promptText }],
  });

  return response.content[0].text.trim();
}

async function handleIngest(message) {
  if (message.author.id !== OWNER_USER_ID && !isAllowed(message.member)) {
    await message.reply("Only NRG team members can ingest files. Ask Matt or Tyrone for access.");
    return;
  }

  const attachment = message.attachments.first();
  if (!attachment) {
    return; // user sent a plain message in #ingest — ignore
  }

  if (attachment.size > MAX_INGEST_BYTES) {
    await message.reply(`File too large (${Math.round(attachment.size / 1024 / 1024)} MB). Limit is ${Math.round(MAX_INGEST_BYTES / 1024 / 1024)} MB.`);
    return;
  }

  await message.react('👀');
  console.log(`[ingest] ${message.author.username} uploaded ${attachment.name}`);

  let draft;
  try {
    const buffer = await downloadToBuffer(attachment.url);
    const text = await extractText(buffer, attachment.name);

    if (text.trim().length < 100) {
      await message.reply(`I couldn't extract meaningful text from \`${attachment.name}\`. If it's a scanned PDF I'd need OCR — share the source another way.`);
      return;
    }

    draft = await draftWikiSourcePage(text, attachment.name);
  } catch (err) {
    console.error('[ingest error]', err);
    await message.reply(`Couldn't process \`${attachment.name}\`: ${err.message}`);
    return;
  }

  // Suggested filename for the wiki/sources/ file
  const baseSlug = slugify(attachment.name);
  const suggestedFilename = `src-${baseSlug || 'untitled'}.md`;

  // Post preview embed
  const previewBody = draft.length > 3500 ? draft.slice(0, 3500) + '\n\n*…truncated for preview; full draft will be written on approval.*' : draft;

  const embed = new EmbedBuilder()
    .setTitle(`Draft wiki page: ${suggestedFilename}`)
    .setDescription(`\`\`\`md\n${previewBody}\n\`\`\``)
    .setColor(0xE97451)
    .setFooter({ text: `Source: ${attachment.name}  ·  Uploaded by ${message.author.username}  ·  React ✅ to merge or ❌ to discard.` });

  const previewMsg = await message.channel.send({ embeds: [embed] });
  await previewMsg.react('✅');
  await previewMsg.react('❌');

  pendingIngestions.set(previewMsg.id, {
    draft,
    suggestedFilename,
    originalAttachmentName: attachment.name,
    requestedBy: message.author.username,
  });

  // Clear pending entry after 24h to avoid memory leak
  setTimeout(() => pendingIngestions.delete(previewMsg.id), 24 * 60 * 60 * 1000);
}

// -----------------------------------------------------------------------------
// Reaction handler — owner approves/rejects ingestions
// -----------------------------------------------------------------------------
client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;
  if (reaction.partial) await reaction.fetch().catch(() => {});

  const previewMsg = reaction.message;
  if (!pendingIngestions.has(previewMsg.id)) return;
  if (user.id !== OWNER_USER_ID) {
    // Non-owner reacted — quietly remove their reaction
    await reaction.users.remove(user.id).catch(() => {});
    return;
  }

  const pending = pendingIngestions.get(previewMsg.id);

  if (reaction.emoji.name === '✅') {
    try {
      const sourcesDir = path.join(WIKI_ROOT, 'sources');
      fs.mkdirSync(sourcesDir, { recursive: true });

      let targetPath = path.join(sourcesDir, pending.suggestedFilename);
      let suffix = 1;
      while (fs.existsSync(targetPath)) {
        const base = pending.suggestedFilename.replace(/\.md$/, '');
        targetPath = path.join(sourcesDir, `${base}-${suffix}.md`);
        suffix++;
      }
      fs.writeFileSync(targetPath, pending.draft + '\n');

      // Append to index.md
      const indexPath = path.join(WIKI_ROOT, 'index.md');
      const titleMatch = pending.draft.match(/^# (.+)$/m);
      const title = titleMatch ? titleMatch[1] : pending.suggestedFilename;
      const indexEntry = `- [[sources/${path.basename(targetPath, '.md')}]] — ${title} *(ingested ${new Date().toISOString().slice(0, 10)})*\n`;
      if (fs.existsSync(indexPath)) {
        fs.appendFileSync(indexPath, indexEntry);
      } else {
        fs.writeFileSync(indexPath, `# Wiki Index\n\n## Source Summaries\n\n${indexEntry}`);
      }

      // Append to log.md
      const logPath = path.join(WIKI_ROOT, 'log.md');
      const logEntry = `\n## [${new Date().toISOString().slice(0, 10)}] ingest | ${title}\n\nFile: \`sources/${path.basename(targetPath)}\`\nOriginal upload: \`${pending.originalAttachmentName}\`\nRequested by: ${pending.requestedBy}\nApproved by: ${user.username}\n`;
      if (fs.existsSync(logPath)) {
        fs.appendFileSync(logPath, logEntry);
      } else {
        fs.writeFileSync(logPath, `# Wiki Log\n${logEntry}`);
      }

      // Reload wiki + acknowledge
      const count = reloadWiki();
      await previewMsg.react('🎉');
      await previewMsg.channel.send(`Merged into wiki as \`sources/${path.basename(targetPath)}\`. Wiki now has **${count}** files in context.`);
      pendingIngestions.delete(previewMsg.id);
      console.log(`[ingest] APPROVED → ${path.basename(targetPath)}`);
    } catch (err) {
      console.error('[ingest approve error]', err);
      await previewMsg.channel.send(`Couldn't merge: \`${err.message}\``);
    }
    return;
  }

  if (reaction.emoji.name === '❌') {
    pendingIngestions.delete(previewMsg.id);
    await previewMsg.react('🗑️');
    await previewMsg.channel.send('Discarded. Wiki unchanged.');
    console.log(`[ingest] REJECTED → ${pending.suggestedFilename}`);
  }
});

// -----------------------------------------------------------------------------
// Message router
// -----------------------------------------------------------------------------
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return; // ignore DMs

  if (message.channel.id === WIKI_BOT_CHANNEL_ID) {
    await handleWikiQuery(message);
    return;
  }

  if (message.channel.id === INGEST_CHANNEL_ID) {
    await handleIngest(message);
    return;
  }
  // any other channel: ignored
});

// -----------------------------------------------------------------------------
// Boot
// -----------------------------------------------------------------------------
client.once(Events.ClientReady, async (c) => {
  console.log(`[ready] Logged in as ${c.user.tag}`);
  await registerSlashCommands();
  console.log('[ready] NRG Discord bot is running.');
});

client.on(Events.Error, (err) => console.error('[client error]', err));
process.on('unhandledRejection', (err) => console.error('[unhandled]', err));

if (BENCH) {
  await runBench();
} else {
  client.login(DISCORD_TOKEN);
}
