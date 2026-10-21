# NRG Knowledge Base — Operations Manual

Step-by-step instructions for the three things you'll do with this wiki: **query**, **ingest**, and
**maintain**. Ported (and updated for the 2026-06-15 repo unification) from the original pre-unification
operations manual — the raw sources now live in this repo under the `Z - *` folders, not OneDrive, and the
Phase-2 "future bot" is now the live Discord bot (`bot.js`, see `CLAUDE.md`).

---

## 1. How to ask a question (interactive session)

For the live team, questions go through the Discord bot in `#wiki-bot`. For an interactive Claude/LLM
session in this repo:

1. Ask in plain English (e.g. *"What's the R-value of Kingspan Kooltherm K8?"*).
2. The LLM follows `wiki/CLAUDE.md`: reads `wiki/index.md`, then the relevant concept pages and
   `wiki/sources/src-*.md` summaries, falling back to the raw file under `Z - */` if no summary exists.
3. Answers lead with the verdict and cite source filenames.
4. If the answer was hard-won and likely to recur, ask to *"save this as a wiki query"* →
   `wiki/queries/<slug>.md`.

## 2. How to ingest a new source document

1. **Drop the file** into the appropriate raw folder (`Z - NCC/`, `Z - PRODUCT INFO/`,
   `Z - RESOURCES_FORMS/`, `Z - TECHNICAL INFO/`). Live-team path: upload the file (or paste text)
   in Discord `#ingest` and approve with ✅.
2. **Tell Claude** *"Ingest [path]"*. It follows `wiki/CLAUDE.md` §"How to ingest": full read →
   brief takeaways → source page → `index.md` entry → concept/product page updates → `log.md` entry.
3. **Spot check** the new source page; if anything looks off, say what to fix.

### Source page template (`wiki/sources/src-<slug>.md`)

```markdown
---
title: <Full descriptive title of the source document>
type: source
created: YYYY-MM-DD
source: <path relative to repo root, e.g. Z - PRODUCT INFO/Some Datasheet.pdf>
---

# <Same title as frontmatter>

## Summary

One paragraph: what the document is, who published it, what it's useful for in this knowledge base.
Verdict first.

## Key claims

- Hard facts only — R-values, U-values, SHGC, clause/table numbers — with units, context, and the
  NCC/NatHERS version they belong to.
- Never state a figure the source doesn't contain.
```

Longer sources may add further `## ` sections (the bot can retrieve individual sections by heading).
The `source:` path must resolve from the repo root — `wiki/config.md` defines the source root (`.`).

## 3. Maintenance — keeping the wiki healthy

- **Weekly (5 min):** glance at `wiki/log.md` and the `#bot-ops` digest — what was added, what gaps surfaced?
- **Monthly (~30 min):** tell Claude *"Run a wiki lint."* It scans for contradictions, stale dates,
  orphan pages, missing pages (referenced but nonexistent), and weak concept coverage, then logs
  `## [YYYY-MM-DD] lint | <findings>` to `wiki/log.md`.
- **When NCC/NatHERS publishes an update:** drop the document in, ingest it, and update any concept
  pages it conflicts with — flag the version explicitly.

## 4. What NOT to do

- **Don't modify the raw `Z - *` source files.** They are the source of truth; the wiki is the editable layer.
- **Don't skip `log.md`.** Every meaningful wiki change gets logged.
- **Don't fabricate R-values, U-values, or compliance figures.** If the source doesn't say it, the answer
  is "I don't have that — check [source]".
- **Don't try to ingest everything at once.** Fill the wiki as real questions surface gaps
  (see `bot-logs/coverage-gaps-queue.md` on the `droplet-telemetry` branch).
