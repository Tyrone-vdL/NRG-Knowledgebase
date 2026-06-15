# NRG Onboarding — Wednesday In-Office Script

**Target date:** Wednesday 3rd June
**Location:** NRG office
**Duration:** Plan for ~60 minutes; budget 90 with overflow

The job in one line: **get the team using the bot today, get the contract signed today, get the first invoice sent today.**

---

## Pre-meeting checklist (the night before)

- [ ] Bot running on droplet (verified via `pm2 status nrg-bot` shows `online`)
- [ ] You've successfully done one wiki Q&A and one ingestion end-to-end on the droplet
- [ ] Laptop charged + charger in bag
- [ ] Mobile hotspot ready as backup (NRG WiFi can be flaky)
- [ ] `CONTRACT_NRG_v2.md` printed × 2 (you + Matt) OR loaded on laptop
- [ ] `INVOICE_001_KB_DEPOSIT.md` ready to fire from your phone the moment Matt signs
- [ ] Discord mobile app installed on your phone (for assisted onboarding)
- [ ] Two test files ready on your laptop: one PDF the bot can already answer about (e.g. COLORBOND chart — proves baseline), one PDF the bot has NEVER seen (e.g. any new spec sheet — proves the ingestion magic)
- [ ] A short list of 3 wiki queries you KNOW work (proof points, not surprises)
- [ ] You've eaten and you've had coffee. This is a sales meeting in a polo shirt.

---

## Order of operations in the office

| # | Block | Time | Outcome |
|---|---|---|---|
| 1 | Frame the meeting | 5 min | Matt knows what you're delivering and what he's signing |
| 2 | Demo wiki Q&A | 10 min | "Holy shit it works" |
| 3 | Demo self-serve ingestion | 15 min | Matt uploads HIS file, sees HIS wiki page get drafted, approves it |
| 4 | Onboard the team | 15 min | Matt, Will, Tara on the server with NRG Team role |
| 5 | Walk the contract | 10 min | Matt understands what he's signing |
| 6 | Sign + invoice + next steps | 5 min | Pen on paper, invoice in his inbox before you leave |
| **Total** | | **~60 min** | |

---

## Block 1 — Frame the meeting (5 min)

**Open with the deal, not the demo.** Matt is a builder. Builders price every job. Make sure he knows the structure before you wow him.

*Suggested language:*

> "Right — quick frame before I show you anything. What we're doing today is bringing the wiki bot from the demo we had on my laptop to a proper production deployment that lives independent of me, on Discord, that your team can use without me being online, and that you can feed yourselves. The price for this build is the $3,000 we already talked about — $1,500 today on signing, $1,500 when we've done the team onboarding and three test ingests. I'll invoice the first instalment from my phone before I leave today.
>
> After this, every new automation we do is its own job, its own price, no monthly retainer. You opt in to keeping the bot maintained for $100/mo per workflow — that's the only ongoing thing, and you can cancel any time with 30 days' notice. That should match what you wanted."

Watch for: does Matt nod? If he hesitates on the $100/mo Care line, this is the moment to explain it covers the droplet + API + bug fixes + minor tweaks. Don't drop the price; the Care plan is the whole game for ongoing income.

---

## Block 2 — Demo wiki Q&A (10 min)

**Open Discord on the boardroom screen** (cast from your laptop, or use the office TV via HDMI).

Show the three channels: `#general`, `#wiki-bot`, `#ingest`.

In `#wiki-bot`, run **three queries you know work**. Don't improvise — you've pre-tested these. Suggested:

1. **Easy product spec** — "What's the solar absorptance for COLORBOND Monument?" (proves source citation)
2. **Regulatory** — "What method of assessment applies to a Victorian renovation where additional floor area exceeds 25%?" (proves the regulatory backbone)
3. **The anti-fab safety net** — Ask a question the wiki CAN'T answer, like "What's the R-value of [random brand product not in the wiki]?" The bot will say "I don't have that — check [source]." Pause and explain:

   > "That's the safety rail. We've hard-coded the bot to refuse to make up numbers. If the wiki doesn't have it, the bot tells you it doesn't have it. That matters for you — you're using this for energy assessment, an invented R-value walks straight into a misissued certificate."

This is the moment Matt understands you're not selling him another ChatGPT wrapper.

---

## Block 3 — Demo self-serve ingestion (15 min — the headline)

**Hand him the laptop or have him use his own.**

*Suggested language:*

> "OK, watch this. I'm going to give you the keys. Drop any product datasheet or guidance note into `#ingest`."

Matt drops a file. Bot reacts 👀. ~20 seconds later, the draft preview appears.

Walk him through the preview:
- Title (auto-generated)
- Summary section
- **Key claims with quoted numbers/clauses** — point at this. "Notice every specific value is lifted directly from his document. If a value isn't in the document, it doesn't get into the draft."
- Concepts touched
- Caveats

*Suggested language:*

> "Right now only I can approve a merge with the ✅ — that's deliberate while we're still building trust in the workflow. Once you've watched a few go through and seen the quality, we'll move the approval to you or to a senior person on your team. Watch."

You react ✅. Bot confirms: "Merged into wiki as sources/src-xxx.md. Wiki now has X+1 files in context."

Then re-query the bot about the new content:

*"Now ask the bot a question about that file you just uploaded."*

Matt asks. Bot answers, citing the just-ingested file. **This is the wow moment** — he just added knowledge and queried it back, no Choppa required.

If time allows, run a second ingest with the team watching.

**Discuss the policy on who approves:**

> "The owner approval lock is here to protect the wiki — one bad ingest and the bot starts citing wrong numbers. Three options going forward, depending on how comfortable you get: (1) Tyrone keeps approving, slow but safe; (2) you approve, fast and you're accountable; (3) we set up a senior staff role with approval rights. We can change this any time, takes me five minutes."

---

## Block 4 — Onboard the team (15 min)

**Matt, Will, Tara — get them on the server.**

1. In Discord → server name dropdown → **Invite People**
2. Copy the invite link
3. Send the link to each person via WhatsApp or email or hand them your phone
4. They join Discord (download the app if needed) → join the server
5. As they appear in the member list, right-click each → Roles → tick **NRG Team**
6. Quick walkthrough for each: "Type in `#wiki-bot` to query. Drop files in `#ingest`. Type `/help` for a refresher."

**For Pakistan contractors:** explain you'll send them invite links separately once everyone here is set up — keeps the in-office flow tight.

**Common snag:** Matt's IT may block Discord at the network level. If so, have everyone use their mobile data for the demo, and flag a follow-up to whitelist Discord at the router.

---

## Block 5 — Walk the contract (10 min)

Open `CONTRACT_NRG_v2.md` on the laptop or hand him the printed copy.

**Read together, section by section. Don't speed-read.**

Sections to hit explicitly:

- **Section 1 (Engagement Overview)** — "Five layers. Setup is what we're doing today. Workflows beyond this are quoted per-job. Care is opt-in maintenance. Quarterly health check is the only thing that's vaguely retainer-like and it's $500 a quarter. Ad-hoc is for the random one-off stuff at $150/hr."
- **Section 2 (Production Build)** — "This is the $3K. Two instalments. Today, and on delivery."
- **Section 4 (Workflow Care)** — "$100/mo per workflow. 30 days free included. You can cancel any time with 30 days' notice. This is the only ongoing thing."
- **Section 7 (Right of First Refusal)** — "If you decide to commission another automation from someone else, give me 5 days to quote it first. Doesn't bind you — you can take their quote — just keeps me in the loop." *(Matt will probably ask "what does this cost me" — answer: "nothing, it just gives me a fair shot.")*
- **Section 8 (Founding Client Deliverables)** — "Quote, case study permission, three intros. Within 60 days of go-live. The same deal we already discussed."
- **Section 15 (Cancellation Summary)** — "Easy to walk away from. Nothing locks you in."

End with: "Anything you want to change before we sign?"

---

## Block 6 — Sign + invoice + next steps (5 min)

1. **Sign.** Both signatures, both dates.
2. **Photograph** the signed contract on your phone. Email it to him and yourself.
3. **Fire the invoice** — open `INVOICE_001_KB_DEPOSIT.md` on your phone, fill in dates, paste your bank details, attach the contract image, send to Matt's billing email. Do this in front of him. "Done — $1,500, 7 days to pay."
4. **Lock the next milestone:** "I'll do final tuning over the next 7 days while you start using it. Once we've done 3 successful ingests and the team's settled in, I send the second $1,500 invoice. Sound right?"
5. **Care plan default:** "After the 30-day free support window I'll send the first $100 Care invoice — opt-in by default. If you decide that's not for you in those 30 days, just text me and we cancel it. You keep the bot, I just stop the maintenance."

---

## Likely questions and prepared answers

| Question | Answer |
|---|---|
| *"What if I want to add Pakistan contractors to the wiki bot too?"* | "Easy — they get an invite link, I assign them a contractor role with read-only access to `#wiki-bot`. Free, part of this build. They can query, they just can't ingest." |
| *"Can I host this on my own server instead of yours?"* | "Yes, eventually. For now you're paying $0 for hosting because I absorb the droplet. If you ever want to take it in-house, the wiki is yours, and we'd hand off the bot code as a separate engagement." |
| *"What happens if you get hit by a bus?"* | "The wiki is plain markdown in your OneDrive — your team can read and edit it any time without me. The bot code is documented; another developer could pick it up. The droplet is in your name if we decide to move it there." (Half-truth — droplet is currently in your DO account. Don't lie. If pushed, say "let's transfer it to your DO account as a follow-up.") |
| *"Why $100/mo if you're absorbing the infrastructure?"* | "Infrastructure is $6 of the $100. The other $94 is me actually fixing things, applying API key rotations, tuning the prompt when answers drift, applying security patches, monitoring uptime. The day you don't see value in that, you cancel." |
| *"Can we skip Workflow Care and just call you ad-hoc?"* | "Yes — you can opt out in the 30-day support window. Hourly ad-hoc is $150/hr, and I can't guarantee responsiveness without the Care contract. Most clients on the equivalent of Care get same-day responses for issues; ad-hoc is best-effort." |
| *"What's the difference between Care and the quarterly Health Check?"* | "Care keeps it running. Health Check keeps it accurate. Different jobs. You don't need both, but most people end up wanting both after six months." |
| *"What if I don't want a contract and just want to pay per job?"* | "That's exactly what this is — there's no retainer in here. The contract is just the standing rules for how we work together; every job inside it is still a fixed price you opt into." |

---

## What you do NOT do in this meeting

- Discuss the contractor portal pricing (it's a separate job — give him the headline that it's quoted at $2,200 if asked, but don't try to close it today)
- Bring up the form builder (it's been killed — his web admin is doing it; don't open old conversations)
- Negotiate price on the spot for anything (anything new gets a written quote within 2 BD, that's the contract)
- Promise specific outcomes (hours saved, query accuracy) — the contract Section 14 says you don't, and the bot's value will prove itself

---

## After the meeting (back at your desk)

- [ ] File the signed contract under `clients/morelli-group/signed/CONTRACT_NRG_v2-signed-YYYY-MM-DD.pdf`
- [ ] Update memory: `projects.md` — NRG status → "v2 signed, deposit invoiced"
- [ ] Update history: `kampfire-digital/history/YYYY-MM-DD.md` — what closed today
- [ ] Schedule reminder: "Invoice 002 ($1,500 balance)" — 7-14 days from today
- [ ] Schedule reminder: "First Care invoice ($100)" — 30 days from go-live
- [ ] LinkedIn post draft: "Built and shipped NRG's production knowledge base today. Discord, self-serve ingestion, anti-hallucination safety rails. The founding-client case study is live." *(Don't post until you have his written quote from Section 8 — anonymise until then.)*

---

*This is the closing meeting. You've done the work. Walk in like you're already running their knowledge stack — because you are.*
