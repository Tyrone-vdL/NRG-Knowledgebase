# CLAUDE.md — NRG Knowledge Base & Discord Bot

Project context for any Claude/LLM session working in this repo. For instructions on *answering
questions from the wiki* and *ingesting sources*, see [`wiki/CLAUDE.md`](wiki/CLAUDE.md) — this file
is the higher-level orientation: what the project is, how it's built, what's been done, and what's next.

---

## 1. What this is

**NRG** is an Australian residential **energy-efficiency consultancy** (NatHERS / 7-Star / Whole-of-Home /
BASIX / NCC compliance). This repo holds two things that together make their internal **knowledge bot**:

1. **The raw source library** — ~198 PDFs + spreadsheets/slides of Australian energy regulation and
   building-product data, under `Z - NCC/`, `Z - PRODUCT INFO/`, `Z - RESOURCES_FORMS/`, `Z - TECHNICAL INFO/`.
2. **The bot + wiki layer** — a Discord bot (`bot.js`) that answers the team's questions, backed by
   `wiki/` (distilled markdown summaries of the raw docs + concept pages).

The bot runs live on a droplet at `/opt/nrg-bot` under pm2 (process `nrg-bot`), serving NRG's Discord.

### Repo of record
- **`Tyrone-vdL/NRG-Knowledgebase`** (default branch `main`) — the single source of truth.
- `ChoppaTheMegalodon/nrg-discord-bot` — the *former* bot-only repo. The bot was accidentally split
  across two repos; it has been **unified** into `NRG-Knowledgebase`. Don't add new work to the old repo.

---

## 2. Mission — what we're trying to achieve

1. **Be a trustworthy answer desk.** Fast, correct, **source-cited** answers on Australian energy regs and
   product specs. The product's whole value rests on the **anti-fabrication guarantee**: never invent an
   R-value / U-value / clause number — if the wiki is silent, say so and point at the source to ingest.
2. **Be comprehensive across all of Australia.** QLD/NSW/VIC/ACT are workable; **SA, WA, NT are critically
   thin** (`wiki/coverage-gaps.md`). Closing jurisdiction/topic gaps is ongoing.
3. **Keep per-answer cost low.** Scale to a large library without shipping it all every query (see §4, §6).
4. **Live testing.** The team uses the bot for real; every gap or wrong answer feeds back into ingestion +
   hardening. The `bot-logs/` Q&A history is the test record.

---

## 3. Architecture

### Two-layer knowledge model (scales past the context window)
- **Always-loaded (prompt-cached static prefix):** `wiki/index.md`, `wiki/config.md`, and all
  `wiki/concepts/*` (the regulatory backbone). Shipped in every system prompt, cached.
- **Retrievable (fetched on demand):** `wiki/sources/src-*.md` (one per source doc), `wiki/queries/`,
  `wiki/products/index.md`, `wiki/coverage-gaps.md`. Listed as a one-line **catalog** in the system prompt;
  the model pulls only what it needs via the `read_wiki_files` tool — and for **large** pages, only the
  specific **section** it needs (`path#Section`).

### Directory map
```
bot.js                 # the Discord bot (single file)
ecosystem.config.cjs   # pm2 config
tools/                 # extract-raw-text.mjs, sync-wiki.mjs, bench-questions.txt,
                       #   deploy-sync.sh, mine-gaps.mjs, post-digest.mjs (self-learning loop)
wiki/
  index.md             # master index + "not yet ingested" gap list  (always-loaded)
  config.md            # source-root path config                       (always-loaded)
  concepts/*.md        # NatHERS/7-Star/WoH/BASIX/NCC/Spec-44/...       (always-loaded)
  sources/src-*.md     # one distilled page per raw document           (retrievable)
  products/index.md    # product catalogue                              (retrievable)
  coverage-gaps.md     # jurisdiction coverage + gap register           (retrievable)
  queries/             # filed-back Q&A                                 (retrievable)
  CLAUDE.md            # how to query/ingest the wiki
  log.md               # append-only wiki operations log
Z - NCC/ , Z - PRODUCT INFO/ , Z - RESOURCES_FORMS/ , Z - TECHNICAL INFO/   # raw source library
```
Each `wiki/sources/*.md` declares its raw `source:` path in frontmatter, resolved relative to the repo
root (`config.md` source root = `.`). All source pages (165 at the 2026-07 audit — the count grows with
every ingest) are verified to resolve to real raw docs.

---

## 4. The bot — how it works (`bot.js`)

- **Channels:** `#wiki-bot` (every message → a wiki query) and `#ingest` (file upload **or pasted text**
  → drafted source page, merged on the owner's ✅; PR #3, 2026-06-25). All other channels ignored.
- **Model:** `claude-sonnet-4-6` (env `MODEL`). **Do not downgrade** — the answer discipline (§2.1)
  depends on it. `max_tokens` 1500 for answers.
- **Retrieval loop (`answerWithRetrieval`):** multi-round tool use. Round 0 reads the question + cached
  prefix and calls `read_wiki_files`; later rounds fetch more or answer. Capped by `MAX_TOOL_ROUNDS` and an
  **adaptive page cap** (`MAX_FETCH_PAGES`) that forces an answer once enough pages are fetched.
- **Section-level retrieval:** `read_wiki_files` accepts `"sources/x.md#Key claims"`. Pages ≥
  `SECTION_CATALOG_MIN_CHARS` show their `## ` section list after a `§` in the catalog so the model can
  fetch one section instead of the whole page (big token saver on the NCC volumes/handbooks).
- **Caching:** the static prefix is one ephemeral cache block — cache-read is ~80–90% of input cost. Nothing
  dynamic precedes it. Don't reorder the system prompt.
- **Instrumentation:** per-page fetch counts persist to `logs/fetch-stats.json` and show in `/status`
  (data for audit-driven catalog pruning). The `[usage]` log line reports rounds/tokens/$ per answer.
- **Slash commands:** `/help`, `/reset`, `/status`, `/reload` (owner-only — rebuilds the wiki + prompt).

### Key env vars (`.env`, template in `.env.example`)
`DISCORD_*`, `OWNER_USER_ID`, `NRG_TEAM_ROLE_ID`, `ANTHROPIC_API_KEY`, `WIKI_ROOT`, `MODEL`,
`MAX_TOOL_ROUNDS` (3), `MAX_FETCH_CHARS` (120000), `MAX_FETCH_PAGES` (6), `SECTION_CATALOG_MIN_CHARS` (8000),
`MAX_INGEST_BYTES`.

---

## 5. Working on it

### Commands
```bash
node bot.js --dry-run                      # build wiki+prompt, print stats, exit (run before deploy)
node bot.js --bench tools/bench-questions.txt   # replay benchmark Qs, print per-answer token cost
pm2 restart nrg-bot --update-env           # deploy a change to the live bot
pm2 logs nrg-bot      /    tail -f logs/out.log
```

### Conventions
- **Anti-fabrication is non-negotiable** (bot.js system-prompt rule 5). Any change that could let the bot
  state an unsourced figure is a regression.
- **Verify token changes with the benchmark.** Capture before/after with `--bench`; confirm the
  figure-bearing answers in `tools/bench-questions.txt` stay correct (that file doubles as the quality guard).
- **Ingesting a source:** follow `wiki/CLAUDE.md` §"How to ingest" — create `wiki/sources/src-<slug>.md`,
  update `index.md`, append to `log.md`, sync to the live bot, then `/reload` or restart.
- **Git:** the local SSH deploy key can push to `NRG-Knowledgebase`. **Direct pushes to `main` are gated** —
  push a branch and let the owner review/merge. Commit messages end with the Co-Authored-By trailer.
- **Live bot vs repo:** `/opt/nrg-bot` is the running checkout. After editing there, restart pm2 to go live,
  *and* commit the same files to `NRG-Knowledgebase` so the repo stays the source of truth.

---

## 6. What's been done so far

Reverse-chronological, one line per shipped item — full detail in `git log` and `wiki/log.md`.

- **#ingest accepts pasted text** as well as file uploads (PR #3, 2026-06-25).
- **Self-learning + auto-sync loop — LIVE** (PR #2): 👍/👎 + reply-corrections → `bot-logs/feedback.jsonl` (DATA only, never auto-edits the wiki); `mine-gaps.mjs` gap ranking; `deploy-sync.sh` gated ff-only auto-deploy + telemetry push; `post-digest.mjs` Wed `#bot-ops` digest. Details: `OBJECTIVE.md`, `deploy/README.md`.
- **Droplet cutover:** merge to `main` → droplet auto-ff-pulls ≤15 min, `--dry-run` gate, restart, rollback on failure. Old scp/manual flow retired; old ChoppaTheMegalodon remote dead.
- **NCC-version discipline** (system-prompt rule 4): bot asks which NCC version applies; never cross-cites versions.
- **Token-spend reduction + gap register** (PR #1): section retrieval, adaptive caps, `--bench` harness — **$0.0863 → $0.0557/answer (−35%)**, no quality regression. Added `wiki/coverage-gaps.md`.
- **KB coverage audit:** QLD/NSW/VIC/ACT workable; **SA/WA/NT critically thin** (`wiki/coverage-gaps.md`).
- **NCC 2019 Vol 2 floor provisions ingested** (`src-ncc-2019-volume-two-amdt1.md`); live Q&A audit + corrections shipped.
- **Repo unification (2026-06-15):** bot + `wiki/` merged into `Tyrone-vdL/NRG-Knowledgebase`; `config.md` source root = repo root.

---

## 7. Current state & open items

> **Resume here.** This file is the repo-resident system state — accurate as of 2026-07-03.
> The per-client *session & decision history* (and non-repo items like billing) lives in the operator's Work Life
> memory and auto-loads when Claude Code is started from the `Work Life` directory.

- **The self-learning loop is LIVE and running** — both systemd timers (`nrg-sync`, `nrg-digest`) enabled on the
  droplet, `#bot-ops` webhook wired, repo/droplet/local clone all in sync on `main`. Nothing here is "awaiting review".
- **Done — live smoke test (verified 2026-07-03):** a 👍 on a fresh answer (matt_nrg, 2026-06-24) wrote to
  `bot-logs/feedback.jsonl` and synced to the `droplet-telemetry` branch — feedback capture + telemetry confirmed end-to-end.
- **Quality item (open):** the FirstRate5 **combination-window operability** answer is unstable — 60% in the
  original live thread vs 66.7%/67% in benchmarks. It's a genuine domain-convention question; needs a
  **definitive worked example ingested** to pin the bot to one number. Don't assume either value is right.
- **Ingestion backlog (fillable from the repo now):** full NCC 2019 Vol 2 (beyond floors); BASIX calculator
  xlsx; Bradnams glazing xlsx; NSW/VIC/SA climate-zone-map OCR; re-extract the degraded NCC 2022 Housing
  Provisions tables. These **auto-surface** in `bot-logs/coverage-gaps-queue.md` + the weekly `#bot-ops`
  digest as the team hits them — ingest the top item via the `#ingest` ✅ flow.
- **Needs external sourcing (flagged, not fetched):** SA/WA/NT Building Acts; SA/WA/VIC/TAS/NT NCC state
  schedules; ABCB Whole-of-Home Efficiency-Factor tables; NCC 2025 state-adoption timeline; Class 2 examples.
- **Future token lever (not yet done):** audit-driven catalog pruning once `logs/fetch-stats.json` has a few
  weeks of data (move never-fetched/superseded pages out of the catalog).

---

## 8. Pointers
- `OBJECTIVE.md` — the self-learning loop's objective function + hard guardrails.
- `deploy/README.md` — droplet sync/digest setup + how the loop operates day-to-day.
- `tools/` — `deploy-sync.sh` (auto-deploy + telemetry push), `mine-gaps.mjs` (gap ranking),
  `post-digest.mjs` (weekly digest), `extract-raw-text.mjs`, `sync-wiki.mjs`, `bench-questions.txt`.
- `OPERATIONS.md` — query/ingest/maintenance manual + the source-page template.
- `wiki/CLAUDE.md` — how to answer from the wiki + ingest sources.
- `wiki/coverage-gaps.md` — jurisdiction coverage matrix + prioritised gaps.
- `wiki/log.md` — append-only operations log (ingests, changes).
- `bot-logs/*.md` — the live Discord Q&A record (the test corpus). **Droplet-side only:** raw dailies are
  gitignored; only `feedback.jsonl` + `coverage-gaps-queue.md` sync back via the `droplet-telemetry` branch,
  so a fresh local checkout has no `bot-logs/` directory.
- `README.md`, `DEPLOY_RUNBOOK.md`, `TEAM_ONBOARDING.md`, `LLM_BACKEND_OPTIONS.md` — ops/onboarding docs.
