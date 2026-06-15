# NRG Bot — LLM Backend Options (cost reduction)

**Status:** Open / not started — pick up when ready
**Raised:** 2026-06-10
**Context:** Bot is live on the droplet using Claude (`claude-sonnet-4-6`). Choppa wants to explore swapping to Kimi (Moonshot AI) because it's "free and capable" for this low-complexity lift. This doc captures the full analysis so the decision can be made later with data, not vibes.

---

## TL;DR — recommended sequence

1. **Do first (today, zero risk):** Add Anthropic **prompt caching** to the Claude call. Likely kills ~80% of the cost problem on its own. No model change, no quality risk, fully reversible.
2. **Then, if still want free:** Build a **provider-switch abstraction** (env var `LLM_PROVIDER=claude|kimi`) + a **15-question eval harness**. Run Claude vs Kimi head-to-head. **Decide on fabrication-rate parity on trap questions, not on "can it answer."**
3. Keep Claude as a one-env-var rollback regardless of outcome.

---

## The reframe: we may be solving the wrong problem

Cost is NOT high because of Claude. It's high because **every query ships the full ~142K-char wiki as an UNCACHED system prompt** (`bot.js` ~line 307 — no `cache_control` on the `anthropic.messages.create` call). That's ~35K input tokens **per question**, paid in full every time.

| Setup | ~Cost / 500 queries-mo | Quality risk |
|---|---|---|
| Claude now (no caching) | ~$50–75/mo | none |
| **Claude + prompt caching** | **~$6–10/mo** | **none** |
| Kimi K2 (API) | ~$2–8/mo, maybe free tier | **unknown — must test** |

Prompt caching = ~90% off the cached (static system-prompt) tokens. One change takes it from ~$60 → ~$8/mo without touching the model. This is the highest leverage-per-minute move on the board.

> NOTE: the cost numbers above are estimates from a ~35K-token system prompt at Sonnet pricing. The README's older "~$0.04/query" estimate predates the wiki growing to 142K chars and looks low. Verify actual spend in the Anthropic console (Usage) before/after caching.

---

## The risk being underweighted (why NOT to migrate blind)

This is a **building-compliance** tool. Its entire value is the **HARD RULE** — refusing to invent an R-value, U-value, or NCC clause number (system prompt rule 5). 

- "Can Kimi answer the question" = the easy bar.
- "Does Kimi hold the anti-fabrication line under a TRAP question as reliably as Claude" = the bar that matters.

A confident wrong NCC clause in a doc NRG hands a certifier is **Kampfire's liability** (we built it). The system prompt is tuned against Claude's instruction-following; Kimi may need re-tuning to hold the line.

**Cost/benefit framing:** saving is ~$240/yr. Risk is the one differentiator sold to NRG. Bad trade — UNLESS Kimi proves parity, in which case "free" compounds across every future client this bot pattern is templated for. **The real prize isn't NRG's $20/mo; it's a zero-marginal-cost backend for the whole product line.** That's worth a proper eval.

---

## How to do it — a switch, not a migration

### 1. Provider abstraction (~1 hr)
Extract a single `getCompletion(system, messages)` helper used by BOTH call sites:
- Q&A handler (`handleWikiQuery`)
- Ingest drafting (the `anthropic.messages.create` that writes the wiki-page draft)

Behind env var `LLM_PROVIDER=claude|kimi`, route to either provider.

Kimi is **OpenAI-compatible** — use the `openai` npm SDK:
```js
import OpenAI from 'openai';
const kimi = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: 'https://api.moonshot.ai/v1',   // intl endpoint (.cn for China)
});
const r = await kimi.chat.completions.create({
  model: 'kimi-k2-0905-preview',           // confirm current model id
  max_tokens: 1500,
  messages: [{ role: 'system', content: system }, ...messages],
});
const reply = r.choices[0].message.content;
```

**Code deltas vs Anthropic SDK:**
- System prompt: Anthropic = top-level `system` param; OpenAI = first message in `messages` array (role `system`).
- Response shape: Anthropic `response.content[0].text` → OpenAI `response.choices[0].message.content`.
- That's basically it — both take the same conversation history shape.

### 2. Two gotchas to verify BEFORE betting on Kimi
- **Context window.** System prompt is ~35K tokens. Kimi K2 (128K ctx) fits fine. The cheaper `moonshot-v1-8k` / `-32k` endpoints DO NOT. A free tier may cap context or rate-limit hard — confirm it holds 35K + conversation history.
- **"Free" is almost certainly the chat app, not the API.** The API is cheap, not free. Possible free promo credits — verify on platform.moonshot.ai.
  - You **cannot self-host Kimi K2** on the $6 droplet — it's a ~1T-param MoE. "Free" must mean API free tier or OpenRouter, not local.
  - OpenRouter has free Kimi variants but with aggressive rate limits that would throttle a team tool. Probably not viable for production; fine for the eval.

### 3. The eval gate (what makes this a real decision)
Build a fixed **~15-question set**:
- Half answerable directly from the wiki (test correctness + citation accuracy).
- Half **deliberate traps** where the wiki is SILENT (test fabrication resistance — the thing that matters).

Run all 15 through both models. Score:
1. Correct citations (names the right source file).
2. **Fabrication rate on the traps** (does it invent a number, or correctly say "I don't have that — check X"?).

**Switch only if Kimi matches Claude on the trap score.** Don't pick on speed or vibes.

---

## Next actions (checkboxes for pick-up)

- [ ] **Wire Anthropic prompt caching** into the Claude `messages.create` (cache the static system prompt block). Measure before/after in Anthropic console.
- [ ] Decide whether cost after caching is low enough to drop the Kimi idea entirely.
- [ ] If proceeding: get a Moonshot API key (platform.moonshot.ai), confirm free-tier context limit + rate limits.
- [ ] Build `getCompletion()` provider abstraction + `LLM_PROVIDER` env var.
- [ ] Write the 15-question eval set (esp. the trap questions — pull real NRG-style queries the wiki can't answer).
- [ ] Run the A/B, record trap-fabrication rates for both.
- [ ] Decision: keep Claude+caching, or switch to Kimi (with Claude as env-var rollback).

## Open questions to resolve
- Is Moonshot's free tier real for API use, and what are its context + rate limits?
- Current exact Kimi model id (`kimi-k2-0905-preview` vs turbo vs newer)?
- Does the ingest-drafting path have the same quality sensitivity, or can it use the cheaper model even if Q&A stays on Claude? (Could run a hybrid: Claude for Q&A trust, Kimi for ingest drafts.)
