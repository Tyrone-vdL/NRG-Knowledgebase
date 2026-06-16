---
title: Knowledge Base Coverage Gaps & Jurisdiction Register
type: reference
created: 2026-06-16
updated: 2026-06-16
---

# Knowledge Base Coverage Gaps & Jurisdiction Register

A standing register of what the wiki does **not** yet cover well, so the bot can answer
"do we cover X?" honestly and the team can prioritise ingestion. Retrievable on demand (not
always-loaded — costs no tokens unless fetched). Compiled 2026-06-16 from a coverage audit of the
ingested wiki + the raw `Tyrone-vdL/NRG-Knowledgebase` document tree.

**Disposition tags** used below:
- `[ingest-from-repo]` — raw document already exists in the repo; just needs ingesting.
- `[re-extract]` — already ingested but the extraction is degraded; needs a cleaner pass.
- `[needs-external-sourcing]` — the source document is **not in the repo**; must be obtained externally
  before it can be ingested. **Flagged only — not actioned.**

---

## Coverage by jurisdiction

Scores are a rough maturity read (regulatory depth / topic breadth / product & design refs), not precise.

| Jurisdiction | Overall | Strong | Headline gap |
|---|---|---|---|
| **QLD** | ~85% | QDC MP4.1 (current + 2019 5-star DTS) fully ingested; Building Act s61/s81; outdoor-living credit deep | Minor only |
| **VIC** | ~70% | Building Act 1993 (+ alteration def); Melbourne design options; Dowell VIC tech | No VIC NCC schedule / Building Regs 2018 variations; ESD scheme |
| **NSW** | ~55% | BASIX Thermal Performance Protocol (Jun 2024); thermal load caps | BASIX energy/appliance pathway thin; energy+thermal calculator xlsx not ingested |
| **ACT** | ~48% | ACT Appendix 2023 No.3; Building Act 2004; ACT NCC pages | Thin beyond the Appendix |
| **TAS** | ~42% | CBOS condensation guide; Hobart design options; Building Act 2016 item 53 | Full Building Act; **TAS NCC state schedule** (varies Part 13 — flagged in audit) |
| **SA** | ~21% | Climate-zone map only | **No Building Act, no state NCC schedule, no Adelaide design guidance** |
| **WA** | ~19% | Climate-zone map only (WA buildings DO need load compliance — zones 5/13/40) | **No Building Act, no state NCC schedule, no Perth design guidance** |
| **NT** | ~10% | Climate-zone map fragment | **Essentially absent** — no Building Act, no schedule, no NT guidance |

**Bottom line:** QLD/NSW/VIC/ACT are workable; **SA, WA, NT are not safe to advise on from the wiki alone.**

---

## Prioritised gap list

### Tier 1 — blocks compliance work
1. **SA & WA Building Acts/Regulations** `[needs-external-sourcing]` — WA Building Regs 2012, SA Building
   Regs 2023. Not in repo. Without these, any SA/WA project advice is incomplete.
2. **State NCC schedules (NCC 2022 variations)** — VIC, SA, WA, TAS, NT. `[needs-external-sourcing]`
   Only the ACT Appendix is present. These schedules modify elemental R-values per climate zone,
   condensation rules and services requirements — quoting national-baseline figures for these states
   can be wrong. (This is the live caveat already hit on the Tasmania answer.)
3. **Whole-of-Home Efficiency-Factor tables** `[needs-external-sourcing]` — the ABCB Standard / Table
   13.6.2b referenced by Housing Provisions 13.6.2 is not in the repo. Blocks the Part 13.6 WoH energy
   pathway (can describe it, can't compute it).
4. **NCC 2025 state-adoption timeline** `[needs-external-sourcing]` — KB has the 2025 PCD but no record of
   *when each state legally adopts 2025* (expected 2027–2028). Needed to answer "which code applies when".

### Tier 2 — high value (regional + Class 2)
5. **Class 2 / multi-residential design examples** `[needs-external-sourcing]` — all design guides are
   Class 1 (Acacia/Telopea houses). No apartment case studies or Class 2 WoH examples. ~30%+ of new builds.
6. **Housing Provisions R-value & glazing-factor tables** `[re-extract]` — Part 13.2/13.3/13.5–6 matrices
   are degraded in the current extraction (log.md flags "verify against PDF"; ~60 glazing factor tables
   not transcribed). Core technical lookup currently requires falling back to the PDF.
7. **TAS / WA / SA / NT state guidance** `[needs-external-sourcing]` — no state energy-efficiency handbooks
   outside QLD/NSW/VIC (e.g. CBOS for TAS exists; equivalents for the others do not).

### Tier 3 — fillable from the repo now
8. **Full NCC 2019 Volume Two** `[ingest-from-repo]` — only Part 3.12.1.5 Floors is extracted
   (`src-ncc-2019-volume-two-amdt1.md`). Roofs/walls/glazing/sealing for 2019-era buildings are not
   ingested. Raw: `Z - NCC/_ARCHIVE/NCC_2019_Volume_Two_Amendment 1.pdf`.
9. **BASIX energy & thermal calculator** `[ingest-from-repo]` — `Z - TECHNICAL INFO/BASIX/Energy+target+
   and+thermal+loads+calculator_V4_21+09+2023+1+v1.xlsx`. Closes the NSW energy pathway. Needs xlsx→md.
10. **Bradnams glazing data** `[ingest-from-repo]` — `Z - PRODUCT INFO/BRADNAMS WINDOWS/BRADNAMS -
    Alternative Glass Mapping Table (1).xlsx` (a live question already missed this). Needs xlsx→md.
11. **Climate-zone maps NSW / VIC / SA** `[ingest-from-repo]` — image-only PDFs; need OCR / postcode→zone
    transcription (WA already done). `Z - NCC/_CLIMATE ZONE MAPS/ClimateZoneMap{NSW,VIC,SA}.pdf`.
12. **NatHERS glazing proxy codes 2025** `[ingest-from-repo]` — `Z - PRODUCT INFO/Copy of NatHERS Proxy
    Codes...2025.xlsx`. Needs xlsx→md.

### Tier 4 — polish / nice-to-have
13. ABCB training decks (`Vol-2-Energy`, `BCA-*` PPTX/xlsx) `[ingest-from-repo]` — training reference.
14. Liveable Housing Design case studies (`ABCB-Liveable-...Issue-B.pdf`) `[ingest-from-repo]` — image-only, OCR.
15. Image-only product brochures (`EXSULITE CLAD.pdf`, `MasterWall_New_Brochure.pdf`) `[ingest-from-repo]` — OCR.

---

## Topic gaps (cross-jurisdiction)
- **Electrification (NCC 2025-only)** — switchboard spare capacity + EV charging (13.7.10–11) are a 2025
  addition; no guidance docs in repo. `[needs-external-sourcing]`
- **Condensation Part 10.8** — NCC 2022 ingested; NCC 2025 PCD expanded it (drained cavity, CZ4–5 roof
  ventilation, cathedral ceilings) — verify depth. State-specific moisture guidance only exists for TAS (CBOS).
- **BASIX beyond thermal** — water/electricity/appliance compliance pathway is thin.

---

## How to use this register
- When a question lands in a `[needs-external-sourcing]` gap, the bot should say so plainly and point at
  the jurisdiction/topic here rather than guessing.
- When it lands in an `[ingest-from-repo]` gap, flag that the raw doc exists and could be ingested.
- Keep this file updated as gaps are closed (move items to a "Closed" list with the date + source page).
