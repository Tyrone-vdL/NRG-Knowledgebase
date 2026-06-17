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
2. **Be comprehensive across all of Australia.** Regulation varies by state/territory. Today QLD/NSW/VIC/ACT
   are workable; **SA, WA, NT are critically thin** (see `wiki/coverage-gaps.md`). Closing jurisdiction and
   topic gaps is ongoing.
3. **Keep per-answer cost low.** The bot scales to a large library without shipping it all every query, and
   we actively minimise token spend per answer (see §4, §6).
4. **Live testing.** The team is using the bot for real; every question that finds a gap or a wrong answer
   feeds back into ingestion + hardening. Treat the `bot-logs/` Q&A history as the test record.

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
tools/                 # extract-raw-text.mjs, sync-wiki.mjs, bench-questions.txt
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
root (`config.md` source root = `.`). 156 source pages were verified to resolve to real raw docs.

---

## 4. The bot — how it works (`bot.js`)

- **Channels:** `#wiki-bot` (every message → a wiki query) and `#ingest` (file upload → drafted source
  page, merged on the owner's ✅). All other channels ignored.
- **Model:** `claude-sonnet-4-6` (env `MODEL`). **Do not downgrade** — the anti-fabrication discipline
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
- **Git:** the local SSH deploy key can push to `NRG-Knowledgebase` (config persisted). **Direct pushes to
  `main` are gated** — push a branch and let the owner review/merge. Commit messages end with the
  Co-Authored-By trailer.
- **Live bot vs repo:** `/opt/nrg-bot` is the running checkout. After editing here, restart pm2 to go live,
  *and* commit the same files to `NRG-Knowledgebase` so the repo stays the source of truth.

---

## 6. What's been done so far (2026-06)

Reverse-chronological; see `wiki/log.md` for the wiki-level detail.

- **Self-learning + auto-sync loop — LIVE** (PR #2, merged): the bot captures 👍/👎 + reply-corrections to
  `bot-logs/feedback.jsonl` (DATA only — never auto-edits the wiki); `tools/mine-gaps.mjs` ranks gaps into
  `bot-logs/coverage-gaps-queue.md`; `tools/deploy-sync.sh` (systemd `nrg-sync.timer`, every 15 min) does gated
  ff-only auto-deploy + telemetry push to the `droplet-telemetry` branch; `tools/post-digest.mjs`
  (`nrg-digest.timer`, Wed 08:00 Sydney) posts a `#bot-ops` digest. See `OBJECTIVE.md` + `deploy/README.md`.
- **Droplet cutover:** `/opt/nrg-bot` repointed from the dead ChoppaTheMegalodon repo to NRG-Knowledgebase via a
  write deploy key + `droplet-telemetry` worktree. **Deploy flow is now: merge to `main` → the droplet
  auto-ff-pulls within 15 min, runs `node bot.js --dry-run` as a gate, restarts, rolls back on failure.** The
  old scp/manual flow is retired.
- **NCC-version discipline (system-prompt rule 4):** the bot now asks which NCC version applies when a question
  doesn't state it, and never cross-cites another version's rules (the root-cause fix for the wrong QLD CZ2
  floor answer). Requested twice by Will.
- **Token-spend reduction + coverage gap register** (merged, PR #1): section-level retrieval, `products/index.md`
  demoted to retrievable, adaptive round cap, fetch counters + `--bench` harness. Measured
  **$0.0863 → $0.0557/answer (−35% all-in, ~−43% warm-cache)** with no quality regression. Added
  `wiki/coverage-gaps.md`.
- **KB coverage audit** → `wiki/coverage-gaps.md`: QLD/NSW/VIC/ACT workable; **SA/WA/NT critically thin**;
  state NCC schedules + several Building Acts aren't in the repo (flagged for external sourcing).
- **NCC 2019 Vol 2 floor provisions ingested** (`wiki/sources/src-ncc-2019-volume-two-amdt1.md`) — Table
  3.12.1.4 (CZ2 suspended floor = R1.0) + clause 3.12.1.5. Closed the gap behind two wrong/incomplete answers.
- **Live #wiki-bot audit** of the logged Q&A: found a wrong NCC-2019 floor answer (it had used NCC 2022
  rules), an under-specified outdoor-living-credit answer, and confirmed several correct ones. Drafted
  corrections; changelog posted to #general.
- **Repo unification:** merged the bot code + `wiki/` layer into `Tyrone-vdL/NRG-Knowledgebase` so raw docs
  and their summaries version together. `config.md` source root repointed to the repo root.

---

## 7. Current state & open items

> **Resume here.** This file is the repo-resident system state — accurate as of the loop going live (2026-06-17).
> The per-client *session & decision history* (and non-repo items like billing) lives in the operator's Work Life
> memory and auto-loads when Claude Code is started from the `Work Life` directory.

- **The self-learning loop is LIVE and running** — both systemd timers (`nrg-sync`, `nrg-digest`) enabled on the
  droplet, `#bot-ops` webhook wired, repo/droplet/local clone all in sync on `main`. Nothing here is "awaiting review".
- **Open — live smoke test:** confirm a 👍/👎 (or reply-correction) on a *fresh* answer writes a line to
  `bot-logs/feedback.jsonl` (the in-memory `answerFeedback` map only tracks answers given since the last restart).
- **Quality item (open):** the FirstRate5 **combination-window operability** answer is unstable — 60% in the
  original live thread vs 66.7%/67% in benchmarks. It's a genuine domain-convention question; needs a
  **definitive worked example ingested** to pin the bot to one number. Don't assume either value is right.
- **Ingestion backlog (fillable from the repo now):** full NCC 2019 Vol 2 (beyond floors); BASIX
  energy/thermal calculator xlsx; Bradnams glazing xlsx; NSW/VIC/SA climate-zone-map OCR; re-extract the
  degraded NCC 2022 Housing Provisions R-value / glazing-factor tables. These now **auto-surface** in
  `bot-logs/coverage-gaps-queue.md` + the weekly `#bot-ops` digest as the team actually hits them — ingest the
  top item via the `#ingest` ✅ flow.
- **Operator (non-repo) items:** $1,500 deposit invoice (signing trigger; see the operator's billing doc);
  recurring commercial model = decide later.
- **Needs external sourcing (flagged, not fetched):** SA/WA/NT Building Acts; SA/WA/VIC/TAS/NT NCC state
  schedules; ABCB Whole-of-Home Efficiency-Factor tables; NCC 2025 state-adoption timeline; Class 2 examples.
- **Future token lever (not yet done):** audit-driven catalog pruning once `logs/fetch-stats.json` has a few
  weeks of data (move never-fetched/superseded pages out of the catalog).

---

## 8. Pointers
- `OBJECTIVE.md` — the self-learning loop's objective function + hard guardrails (anti-fabrication, scope, billing).
- `deploy/README.md` — droplet sync/digest setup + how the loop operates day-to-day.
- `tools/deploy-sync.sh` — the auto-deploy + telemetry-push script (run by `nrg-sync.timer`).
- `tools/mine-gaps.mjs` — mines `bot-logs/` → ranked `coverage-gaps-queue.md` + `metrics.json`.
- `tools/post-digest.mjs` — posts the weekly `#bot-ops` digest (run by `nrg-digest.timer`).
- `wiki/CLAUDE.md` — how to answer from the wiki + ingest sources.
- `wiki/coverage-gaps.md` — jurisdiction coverage matrix + prioritised gaps.
- `wiki/log.md` — append-only operations log (ingests, changes).
- `bot-logs/*.md` — the live Discord Q&A record (the test corpus).
- `README.md`, `DEPLOY_RUNBOOK.md`, `TEAM_ONBOARDING.md`, `LLM_BACKEND_OPTIONS.md` — ops/onboarding docs.
