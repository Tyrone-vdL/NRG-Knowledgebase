# NRG Discord Bot

Production knowledge-base bot for NRG. Runs on a DigitalOcean droplet under PM2.

> **New here?** Read [`CLAUDE.md`](CLAUDE.md) for the project orientation — mission, architecture, what's been done, and open items.

## Repo layout & deploy flow (v3+, unified)

**`Tyrone-vdL/NRG-Knowledgebase` (`main`) is the single source of truth.** Since the 2026-06
unification, the raw source library (`Z - NCC/`, `Z - PRODUCT INFO/`, …), the `wiki/` layer, and the bot
code all live and version together in this one repo. The droplet's `/opt/nrg-bot` is a checkout of it.
(The old `ChoppaTheMegalodon/nrg-discord-bot` repo and the separate laptop "master wiki" are retired —
don't add new work there.)

Deploy a change:

```bash
node bot.js --dry-run                       # sanity: layers + catalog build clean
node bot.js --bench tools/bench-questions.txt   # if it could affect tokens/answers: check cost + quality
pm2 restart nrg-bot --update-env            # go live on the droplet
pm2 logs nrg-bot --lines 6 --nostream
# then version it: push a branch and let the owner review/merge (direct pushes to main are gated)
git add -A && git commit -m "..." && git push origin <branch>
```

Discord `#ingest` writes new `wiki/sources/*.md` directly on the droplet — commit those the same way so the
repo stays current. Keep `/opt/nrg-bot` and the repo in sync: restart pm2 to go live **and** commit the same files.

## What it does

- **`#wiki-bot` channel** — every message is a wiki query, answered by Claude with anti-fabrication rules
- **`#ingest` channel** — drop a PDF/DOCX/TXT/MD file → bot drafts a wiki source page → owner reacts ✅ to merge, ❌ to discard
- **Slash commands** — `/help`, `/reset`, `/reload` (owner), `/status`

## Files

| File | Purpose |
|---|---|
| `bot.js` | Main entrypoint — discord.js client + handlers |
| `package.json` | Dependencies + npm scripts |
| `.env.example` | Template for required env vars (copy to `.env`) |
| `ecosystem.config.cjs` | PM2 process config (`.cjs` because package is `"type":"module"`) |
| `.gitignore` | Keeps secrets and node_modules out of git |
| `DEPLOY_RUNBOOK.md` | Step-by-step droplet setup |
| `TEAM_ONBOARDING.md` | In-office script for the Wednesday rollout |

## Local quick start (for testing on Choppa's laptop)

```bash
cd discord-bot
cp .env.example .env
# fill in DISCORD_TOKEN, DISCORD_CLIENT_ID, channel IDs, OWNER_USER_ID, ANTHROPIC_API_KEY
# point WIKI_ROOT at the existing OneDrive wiki for local tests
npm install
node bot.js
```

## Production (DigitalOcean droplet)

See `DEPLOY_RUNBOOK.md` for the full sequence. Short version:

```bash
ssh root@<droplet-ip>
mkdir -p /opt/nrg-bot
# (rsync the bot folder + wiki up from your laptop)
cd /opt/nrg-bot
npm install
cp .env.example .env
# edit .env with production values
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # follow the printed instructions to enable boot-time start
```

## Knowledge architecture (v3 — retrieval)

The bot no longer ships the whole wiki on every query. Two layers:

- **Always-loaded (prompt-cached):** `index.md`, `config.md`, `concepts/`, `products/index.md` — the regulatory backbone, sent as a cached static system prefix (~$0.004/query as a cache read).
- **Retrievable:** `sources/`, `queries/` — auto-cataloged one line per page; Claude fetches only the pages a question needs via the `read_wiki_files` tool (max `MAX_TOOL_ROUNDS` rounds, `MAX_FETCH_CHARS` budget per query).

Per-query cost stays flat (~$0.02–0.05) whether the wiki holds 30 pages or 500. The previous design sent the full wiki uncached every query and would have overflowed the 200K-token context window past ~100 source pages.

**Pre-deploy check:** `WIKI_ROOT=<path> node bot.js --dry-run` prints both layers, the catalog, and the estimated cache cost without touching Discord or Anthropic.

Every query logs a `[usage]` line (rounds, pages fetched, tokens, estimated cost) and `/status` shows last-query and since-restart cost telemetry. Verify real spend in the Anthropic console.

## Anti-fabrication

The system prompt enforces a HARD RULE: if a specific value (R-value, U-value, NCC clause, etc.) is not explicitly stated in the loaded or retrieved wiki pages, the bot must reply with "I don't have that specific figure in the wiki — check `<source>`" before offering any general context. Retrieval discipline backs this: the bot must fetch the likeliest source pages before declaring the wiki silent. Confident wrong numbers destroy trust faster than admitted ignorance.

## Cost model

- DigitalOcean droplet: ~$6 USD/mo
- Anthropic API: ~$0.02–0.05 per Q&A query (cached prefix + retrieved pages), ~$0.10–0.30 per ingestion
- Expected usage: ~500 queries/mo + ~50 ingestions/mo = ~$20–35/mo all-in
- All absorbed by Kampfire Digital for the first 12 months under the v2 agreement.

## Support

For bugs, contact Tyrone at Kampfire Digital. The first 30 days post-launch are covered free under the build's quality guarantee; thereafter, ongoing operation is covered by the $100/mo Workflow Care plan.
