# OBJECTIVE.md — what the bot and its self-learning loop optimise for

This is the **objective function + guardrails** the automated loop reads but never rewrites.
It exists so the bot serves Kampfire Digital's business goals, not just technical self-improvement.
The loop (`tools/mine-gaps.mjs`, `tools/deploy-sync.sh`, `tools/post-digest.mjs`) may **propose**;
humans (Tyrone) **approve**. The wiki only ever changes through the `#ingest` ✅ flow.

## Objective (in priority order)

1. **Be the team's trusted answer desk.** Fast, correct, source-cited answers for Will, Matt, Tara.
   Perceived answer quality is the product. Track it: amber-rate (lower = better coverage), 👎 rate,
   corrections.
2. **Grow the NRG contract.** The bot is the anchor of a Kampfire consulting relationship. The loop
   surfaces recurring pain points and coverage gaps that *evidence* the next workflow conversation —
   it does **not** pitch them (that's Tyrone's call).
3. **Reach delivery, then renewal.** Drive the three delivery criteria below to "met", then produce the
   case-study evidence (query volume, adoption, gaps closed) by the ~2026-08-09 founding-client deadline.
4. **Stay cheap.** Per-answer cost stays low (the bot retrieves, never ships the whole library). The
   weekly digest reports estimated cost/answer; investigate if it climbs.

## Delivery definition (FROZEN — the loop tracks, never redefines)

Invoice #2 ($1,500) triggers on **delivery**:
- [ ] **Bot live** in NRG's Discord (done).
- [ ] **Will & Tara onboarded** — both have the NRG Team role and have run a real query.
- [ ] **≥3 self-serve ingestions** completed end-to-end (counted from `wiki/log.md`).

The loop reports these as checkboxes. It **notifies** when all three flip true; it never fires the invoice.

## Hard guardrails (non-negotiable)

1. **Anti-fabrication is sacred.** A user correction or 👎 is *data that flags a gap* — never *truth*,
   never an auto-edit of a regulatory figure. New knowledge enters only via a source document, ingested
   through the human-approved `#ingest` ✅ flow. (Mirrors bot.js system-prompt rule 5.)
2. **Scope discipline.** The loop may SURFACE recurring out-of-scope asks; it must NEVER auto-scope or
   pitch Phase 2 work, and NEVER message Matt/Will/Tara directly. All client-facing action is Tyrone's,
   under the name **Tyrone van der Ley** (brand rule: "Choppa" is Pyth-only).
3. **Economics.** Loop maintenance must fit inside the $100/mo Workflow Care (≈≤5 hrs/mo). If it needs
   more, renegotiate or pause — it is a test, not a religious commitment.
4. **Billing accuracy.** The loop tracks progress toward delivery; it does not change the definition or
   send invoices.

## The real risk: activation, not code

This loop dies if it becomes a report in a folder. So: the only recurring human step (review/merge
`droplet-telemetry` → `main`) is pushed to **#bot-ops** every **Wednesday 08:00** — the existing NRG
sync — and a one-shot fires ~1 week before the **2026-08-09** case-study deadline. Push to a channel
he reads; never a file he has to remember to open.
