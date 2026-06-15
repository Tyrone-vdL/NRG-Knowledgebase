# Wiki Operations Log

Append-only record of every wiki operation. Most recent at top.

---

## [2026-05-14] ingest | NCC 2022 Volume Two — Part H6 + Spec 42 + Spec 44 (surgical)

Ingested from `Z - NCC/ncc2022-volume-two-20230501.pdf` (via `pdftotext -layout` extraction, 16874 lines). PDF is 12.7 MB / ~700 pages — full ingest infeasible (would overflow Claude's context). **Surgical extract** focused on energy efficiency: Part H6 (objectives, H6P1/P2 performance requirements, H6V1-V3 verification methods, H6D1/D2 DtS provisions), Specification 42 (S42C1 scope, S42C2 heating/cooling loads + outdoor living credit, S42C3 net equivalent energy usage, S42C4 additional DtS), and Specification 44 (load limit calculation formulae). Created [[sources/src-ncc-2022-vol-2-h6-energy-efficiency]]. **Closes the bot's gap on outdoor living credit clauses** — S42C2(1)(b)/(c) now fully captured including 6.5★ / 6★ thresholds, 2.1m breeze path opening, 900mm side clearance, ceiling fan blade diameter rules. Other NCC parts (structure, fire, plumbing, etc.) not captured — ingest separately as needed. ABCB Housing Provisions (Section 13) referenced throughout but is a separate document — flagged as next ingest priority.

## [2026-05-14] ingest | QDC MP4.1 Sustainable Buildings (Sep 2023)

Ingested from `Z - NCC/QDCMP4.1SustainableBuildings.pdf` (via text extraction in `raw/QDCMP4.1SustainableBuildings.txt`). Created [[sources/src-qdc-mp4-1-sustainable-buildings]]. **Second live ingestion** during Choppa's demo with Will — Will pushed back on the outdoor living source noting that a ceiling fan is required for the credit. Source confirms: **ceiling fan + speed controller is what doubles the credit from 0.5 to 1 star** (Class 2 / A2(2)(b)). Also captures fan blade diameter floor-area limits (≤15 m² for <1200 mm blade, ≤25 m² for ≥1200 mm), AC auto-shutdown rule for class 2 (must shut off on external door open >1 min), and the full "outdoor living area" definition including the previously-missing clause (4)(b) for Class 2 buildings. The PNG snippet from the previous ingest is now superseded for the definition but kept for NCC traceability.

## [2026-05-14] ingest | Outdoor Living Area qualifying criteria (NCC 2022)

Ingested from `Z - NCC/OUTDOOR LIVING CREDIT PARAMETERS - NCC 2022.png` (workspace copy in raw/). Created [[sources/src-outdoor-living-credit-ncc-2022]]. **Live ingestion** during Choppa's demo with Will — Will asked "What requirements need to be met to apply the QLD star credit to an NCC 2022 NatHERS assessment?", bot correctly admitted the gap and cited the PNG as the source to ingest. This is the loop closing in real time. **Gap captured:** the PNG snippet ends at clause (4)(a) — clause (4)(b) (Class 2 building alternative) and the actual credit value (stars/kWh) are NOT in this source; QDC 4.1 docs (`QDC 4.1 - NCC 2019 5STAR DTS.pdf`, `QDCMP4.1SustainableBuildings.pdf`) are the next sources to ingest for full coverage.

## [2026-05-14] ingest | WoH Guidance Note (Jan 2024)

Ingested from `Z - TECHNICAL INFO/WoH Guidance Note 20240112.pdf` (via text extraction in `raw/WoH Guidance Note 20240112.txt`). Created [[sources/src-woh-guidance-note-2024]]. Expanded [[concepts/whole-of-home]] from stub to full page. Notable: the Jan 2024 guidance note does NOT contain NCC clause references like H6P2 — those live in NCC 2022 Vol 2 Part H6 (not yet ingested). One explicit NCC reference present: Housing Provisions 13.7.6 1a (lighting default).

## [2026-05-14] ingest | EE-04 Alterations to Existing Class 1 Buildings (NCC 2022)

Ingested ABCB Practice Note from `Z - TECHNICAL INFO/PN - EE-04-Alterations-to-existing-Class-1-buildings - NCC 2022.pdf` (workspace copy at raw/). Created [[sources/src-ee-04-alterations-ncc-2022]] and new concept [[concepts/alterations-existing-dwellings]]. Triggered by partial-answer failure during pre-demo testing — bot returned 2 pathways when the PN sets out 3 NCC pathways + Reg 233(3) RBS discretion as a Victorian-only fourth lever.

## [2026-05-14] ingest | COLORBOND Solar Absorptance Chart

Ingested full chart from `Z - PRODUCT INFO/COLORBOND SOLAR ABSORPTANCE CHART.pdf`. Created [[sources/src-colorbond-solar-absorptance]] with all 29 colours (22 Standard + 6 Metallic + 1 Coolmax) and both BCA + BASIX classifications. Triggered by Q2 hallucination during pre-demo testing — bot stated Monument = 0.87 when correct value is 0.73.

## [2026-05-14] harden | Bot system prompt — anti-fabrication rule

Rewrote rule 5 in `bot.js` system prompt to enforce "I don't have that — check [source]" as the lead line for any query missing a specific R-value, U-value, k-value, solar absorptance, clause number, or regulation number from the wiki. Industry-general context must be explicitly labelled and qualitative only. Triggered by Q2 failure mode — confident wrong number with disclaimer buried at the bottom.

## [2026-05-05] query | "What's the R-value of a 200mm Hebel wall?"

- Test query to verify the wiki end-to-end loop
- Read `wiki/index.md` → found ingested Hebel source
- Read `wiki/sources/src-hebel-r-value.md` for figures
- Synthesized answer with table, caveats (2006 source, fabric-only, moisture sensitivity), and practical implications for 7-star compliance
- Filed back as `wiki/queries/q-hebel-200mm-wall-r-value.md` for reuse
- Result: loop works. Wiki successfully indexed → retrieved → synthesized → cited → filed back.

## [2026-05-05] ingest | CSR Hebel Technical Manual — R-value table (Jan 2006)

- Read `Z - PRODUCT INFO/Hebel R value.pdf` (single-page extract)
- Created `wiki/sources/src-hebel-r-value.md` with full Table 3.1 transcribed (Thermoblok, Sonoblok, PowerPanel, SoundFloor, Wall Sound Barrier, Floor, Lintels, Stair Treads — all thicknesses, all 3 moisture states)
- Updated `wiki/index.md` source summaries section
- Updated `wiki/products/index.md` to link the source page from the Hebel entry
- Flagged caveat: source is from 2006, values may be superseded — confirm before quoting

## [2026-05-05] scaffold | Initial wiki created

- Built directory structure: `wiki/concepts/`, `wiki/products/`, `wiki/sources/`, `wiki/queries/`
- Wrote `index.md` cataloging 190 source files across 4 top-level categories
- Stubbed concept pages: NatHERS, 7-Star Rating, Whole-of-Home, BASIX, NCC, Spec 44, SDA/WSUD, Climate Zones
- Stubbed product index grouped by product type
- Authored `CLAUDE.md` (LLM instructions), `config.md` (paths), `OPERATIONS.md` (user instructions)
- No source documents fully ingested yet — concept pages reference primary sources by filename only

**Next:** Demo end-to-end query loop, then begin filling concept pages and ingesting top-priority sources (NRG 7 Star Booklet, NatHERS Assessor Handbook 2024, NCC 2022 Housing Provisions).

## [2026-06-10] ingest | BATCH — full library ingest (156 pages)

Batch-ingested the OneDrive reference library via 18 parallel Claude Code agents:
135 standard docs + 9 monster volumes (surgical extracts) + 12 PNG screenshots (vision).
0 failures. Coverage now 95%+ of the 190-file library.
Notable: Spec 44 + EE-04 "appendix" PDFs found to be byte-identical duplicates of their
primary docs (documented as pointer pages); per-climate-zone R-value tables in Housing
Provisions degraded in extraction (caveated, verify against PDF).
Skipped: 15 _ARCHIVE superseded editions, 8 image-only PDFs (need OCR), 17 xlsx/pptx/pages.
index.md rebuilt lean (category counts + gap list; per-page catalog now auto-generated by bot v3).
Reports: ingest/reports/batch-*.json. Manifest: ingest/manifest.json.
