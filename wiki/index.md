---
title: NRG Knowledge Base — Master Index
type: index
created: 2026-05-05
updated: 2026-06-10
---

# NRG Knowledge Base — Master Index

How this wiki is organized and what it covers. As of 2026-06-15 the wiki holds **~165 pages covering 95%+ of NRG's reference library** (190+ source documents).

**Source root (raw documents):** see `config.md` — currently `C:\Users\tyron\OneDrive\Documents\Kampfire.Digital\NRG Knowledge Base\`

---

## Concept Pages (regulatory backbone)

The "spines" most questions hang off. Start here for regulation questions; they link to the detailed source pages.

- [[concepts/nathers]] — NatHERS scheme, ratings, Assessor Handbook
- [[concepts/7-star-rating]] — 7-Star NatHERS minimum, NCC 2022 transition
- [[concepts/whole-of-home]] — WoH ratings, energy budget, what's included
- [[concepts/basix]] — NSW BASIX scheme, thermal performance protocol
- [[concepts/ncc]] — National Construction Code (2019, 2022, 2025 PCD)
- [[concepts/spec-44]] — Specification 44 performance solutions
- [[concepts/sda-wsud]] — Sustainable Design Assessment & Water Sensitive Urban Design
- [[concepts/climate-zones]] — Australian climate zone maps
- [[concepts/alterations-existing-dwellings]] — regulatory framework for extensions/alterations

## Product Pages

- [[products/index]] — Product catalog grouped by type (insulation, windows, wraps, etc.)

## Source Pages (`wiki/sources/` — 163 pages)

One page per source document, filename `src-<slug>.md`. Each page: Summary, Key claims (exact figures with units), Concepts touched, Caveats. Large reference volumes (NCC volumes, Building Acts, NatHERS Assessor Handbook) are **surgical extracts** — navigation plus deep extraction of the energy-efficiency sections, with an explicit note of what was not extracted.

Coverage by category (counts approximate):

| Category | Pages | What's in it |
|---|---|---|
| NCC core | 20 | NCC 2022 Vol 1/Vol 2(H6)/Housing Provisions/Consolidated PRs, Amdt 1, NCC 2025 PCD ×2, handbooks, livable housing, **NCC 2019 Vol 2 floor provisions (surgical)** |
| State regs | 18 | QLD/VIC/ACT/TAS Building Acts (key sections in full: QLD s61/s81), QDC 4.1 + MP4.1, ACT Appendix |
| NatHERS | 17 | Assessor Handbook 2024 (deep extract), Technical Note Oct 2024 (current), load limits, TPA rulings, superseded tech notes (marked) |
| 7-Star | 17 | Fact sheets, upgrade guides, Acacia/Telopea reference designs across 3 climates with per-city spec differences |
| Products | 51 | Datasheets by family: glazing (13), insulation (18), wraps (6), flooring (7), roofing (3), walls (3), other (1) — exact R/U/SA values |
| Spec 44 | 6 | First-principles performance solution guide + ANSNAC; duplicate appendix copies documented as pointers |
| Training | 10 | ABCB BCA/Section J training materials, historic EE handbooks (clearly caveated by edition) |
| WoH | 4 | Guidance notes + fact sheets |
| NRG materials | 5 | NRG's own 7 Star booklets (incl. pricing), learning info |
| Climate zones | 4 | AUST/QLD/TAS/WA map text (maps themselves are visual — see raw PDFs) |
| BASIX | 2 | Thermal Performance Protocol June 2024, thermal load caps (from screenshot) |
| SDA/WSUD | 3 | Stormwater management, Brimbank ESD guidance |

## Saved Queries (`wiki/queries/`)

- [[queries/q-hebel-200mm-wall-r-value]] — R-value of 200mm Hebel wall (across all products and moisture states)

---

# Not yet ingested (the gap list)

When a question lands here, say so and point at the raw file. For the full standing register —
jurisdiction coverage scores + prioritised gaps with dispositions — see [[coverage-gaps]]
(retrieve it when asked "do we cover <state/topic>?").

## Needs OCR (image-only PDFs — no extractable text)

- `Z - NCC/ABCB-Liveable-housing-design-standard-case-studies-Issue-B.pdf`
- `Z - NCC/_CLIMATE ZONE MAPS/ClimateZoneMapNSW.pdf`, `ClimateZoneMapSA.pdf`, `ClimateZoneMapVIC.pdf`
- `Z - PRODUCT INFO/EXSULITE CLAD.pdf`
- `Z - PRODUCT INFO/MasterWall_New_Brochure.pdf`
- `Z - RESOURCES_FORMS/7 STAR INFO/Technical Drawings Telopea_Brisbane.pdf`

## Needs conversion or manual review (spreadsheets / slide decks / Pages)

- `Z - PRODUCT INFO/BRADNAMS WINDOWS/BRADNAMS - Alternative Glass Mapping Table (1).xlsx`
- `Z - PRODUCT INFO/Copy of NatHERS Proxy Codes....2025.xlsx` — NatHERS glazing proxy codes 2025
- `Z - TECHNICAL INFO/BASIX/Energy+target+and+thermal+loads+calculator_V4_21+09+2023+1+v1.xlsx` — BASIX energy target calculator
- ABCB training decks + glazing calculator exercises (`Z - NCC/_ABCB/**/*.pptx`, `*.xlsx` — 9 files)
- NRG 7 Star Booklet Apple Pages source files (3 — PDF exports already ingested)
- `Z - RESOURCES_FORMS/NRGEH LEARNING INFORMATION.docx` — extracted near-empty; placeholder page exists

## Deliberately skipped — superseded editions (`Z - NCC/_ARCHIVE/`, 15 files)

BCA 1996/2009, NCC 2015/2016/2019 volumes and guides. Historic editions: only relevant for buildings approved under those codes. Raw PDFs remain available; ingest on demand.

> **Partial ingest (2026-06-15):** NCC 2019 Volume Two **Part 3.12.1.5 Floors + Table 3.12.1.4**
> have been surgically extracted into [[sources/src-ncc-2019-volume-two-amdt1]] (closed a live floor-R-value
> gap). The rest of NCC 2019 Vol 2 remains un-ingested.

---

# How this index gets maintained

New sources ingested via Discord `#ingest` (or batch runs) create `wiki/sources/src-<slug>.md` pages automatically. The bot auto-catalogs every source page at startup — this index deliberately does NOT list pages individually; keep it lean. Update the category table counts and the gap list when batches land. See `OPERATIONS.md`.
