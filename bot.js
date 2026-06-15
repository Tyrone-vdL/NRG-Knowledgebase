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
//   ALWAYS-LOADED (cached): index.md, config.md, concepts/, products/index.md
//     — the regulatory backbone, sent as a prompt-cached static system prefix.
//   RETRIEVABLE: sources/, queries/ — listed in a one-line catalog; Claude
//     pulls only the pages it needs per query via the read_wiki_files tool.
//   Result: per-query cost stays flat (~$0.02-0.05) whether the wiki holds
//   30 pages or 500. The old design shipped the entire wiki uncached every
//   query and would overflow the context window past ~100 source pages.
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

// `node bot.js --dry-run` builds the wiki layers + system prompt, prints stats,
// and exits before touching Discord or Anthropic. Run before every deploy.
const DRY_RUN = process.argv.includes('--dry-run');

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
  if (!v && !DRY_RUN) {
    console.error(`[fatal] Missing required env var: ${k}`);
    process.exit(1);
  }
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// -----------------------------------------------------------------------------
// Wiki loader — two layers
//   ALWAYS-LOADED: regulatory backbone, ships (cached) in every system prompt
//   RETRIEVABLE:   source/query pages, cataloged + fetched on demand via tool
// -----------------------------------------------------------------------------
// Files/dirs (relative to WIKI_ROOT) that are always in context:
const ALWAYS_FILES = ['index.md', 'config.md', 'products/index.md'];
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

function loadWiki() {
  const always = [];
  const retrievable = new Map(); // rel path -> { content, catalogLine }
  for (const full of walkMd(WIKI_ROOT)) {
    const rel = relPath(full);
    if (EXCLUDE_FILES.has(rel) || rel.endsWith('/README.md')) continue;
    const content = fs.readFileSync(full, 'utf-8');
    if (isAlwaysLoaded(rel)) {
      always.push({ path: rel, content });
    } else {
      retrievable.set(rel, { content, catalogLine: summarizeForCatalog(content) });
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
    .map(([rel, f]) => `- ${rel} — ${f.catalogLine}`)
    .join('\n');

  return `You are NRG's internal knowledge base assistant. NRG is an Australian residential energy efficiency consultancy. NRG's team members (Will, Matt, Tara, and contractors in Pakistan) query you for quick answers about Australian energy efficiency regulations and building products.

DOMAIN: NatHERS, 7-Star ratings, Whole-of-Home (WoH), BASIX (NSW), National Construction Code (NCC 2019/2022/2025 PCD), Specification 44, climate zones, and product datasheets (insulation, glazing, wraps, walls, flooring, roofing).

HOW YOUR KNOWLEDGE BASE WORKS:
- ALWAYS-LOADED PAGES (full text at the bottom of this prompt): the master index, concept pages (regulatory backbone), and the product catalog.
- SOURCE PAGE CATALOG (one line per page, below): the full text of these pages is NOT loaded. To read any of them, call the read_wiki_files tool. Batch every page you think you'll need into a SINGLE call — don't fetch one at a time.
- RETRIEVAL DISCIPLINE: never answer a question involving specific figures (R-values, U-values, clause numbers, solar absorptance, star credits, etc.) from the catalog one-liner or from memory — retrieve the source page first. Only declare "I don't have that in the wiki" AFTER you have scanned the catalog and retrieved the likeliest pages. The master index also lists the raw (un-ingested) document library — when the wiki is silent, point to the raw document that should be ingested next.

RULES:
1. Lead with the answer. Be direct. (If the answer is "I don't have it", that IS the answer — lead with it.)
2. Cite specific source files by name when you use them (e.g. "from sources/src-hebel.md").
3. Use Australian English and Australian regulatory terminology.
4. ALWAYS note which NCC version a regulatory claim relates to (2019, 2022, 2025 PCD).
5. **HARD RULE — NEVER FABRICATE SPECIFICS.** If a specific R-value, U-value, k-value, solar absorptance, NCC clause number, regulation number, or any other numeric/regulatory specific is NOT explicitly stated in the always-loaded pages or in source pages you have retrieved this conversation, your reply MUST:
   (a) **Open with**: "I don't have that specific figure in the wiki — check \`<exact source filename from the catalog or raw library>\`."
   (b) Only after that opening line, you MAY offer general context, but it MUST be prefixed with: "**General industry context (not from the wiki, verify before quoting):**" and you MUST NOT state a specific figure with confidence — use ranges or qualitative language only.
   Confident wrong numbers destroy trust. "I don't know — check X" is always the right answer when the wiki is silent.
6. Keep answers concise and practical — NRG's team is querying you to save time, not to read essays.
7. If a question requires professional judgement (e.g. plan interpretation, conflicting client notes), recommend the team verify with the source, don't just decide for them.
8. Use Discord markdown formatting — **bold**, *italic*, \`code\`, and line breaks. Avoid headings (#) — they look messy in Discord.

SOURCE PAGE CATALOG (retrievable via read_wiki_files):
${catalog || '- (no retrievable pages yet)'}

ALWAYS-LOADED PAGES BELOW:
${alwaysContents}`;
}

let SYSTEM_PROMPT = buildSystemPrompt();
console.log(`[startup] System prompt size: ${SYSTEM_PROMPT.length} chars (cached static prefix)`);

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
  description: 'Read the full contents of one or more wiki pages from the source page catalog. Batch every page you expect to need into a single call.',
  input_schema: {
    type: 'object',
    properties: {
      paths: {
        type: 'array',
        items: { type: 'string' },
        description: 'Wiki-relative paths exactly as they appear in the source page catalog, e.g. "sources/src-hebel-r-value.md"',
      },
    },
    required: ['paths'],
  },
}];

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
  for (const p of [...new Set(paths)]) {
    const page = wiki.retrievable.get(p);
    if (!page) {
      parts.push(`=== FILE: ${p} ===\n(NOT FOUND — use an exact path from the source page catalog)`);
      continue;
    }
    if (budget.remaining - page.content.length < 0) {
      parts.push(`=== FILE: ${p} ===\n(SKIPPED — retrieval budget for this query is exhausted. Answer with what you have, or tell the user the question is too broad for one query.)`);
      continue;
    }
    budget.remaining -= page.content.length;
    fetched++;
    parts.push(`=== FILE: ${p} ===\n${page.content}`);
  }
  return { text: parts.join('\n\n'), fetched };
}

// Multi-round Claude call: cached static prefix + on-demand page retrieval.
async function answerWithRetrieval(history, userText) {
  const messages = [...history, { role: 'user', content: userText }];
  const usage = emptyUsage();
  const budget = { remaining: MAX_FETCH_CHARS };

  for (let round = 0; ; round++) {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      tools: RETRIEVAL_TOOLS,
      // Past the round cap, force a text answer from whatever has been fetched.
      tool_choice: round < MAX_TOOL_ROUNDS ? { type: 'auto' } : { type: 'none' },
      messages,
    });
    addUsage(usage, response);

    if (response.stop_reason !== 'tool_use') {
      const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
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
  }
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

client.login(DISCORD_TOKEN);
