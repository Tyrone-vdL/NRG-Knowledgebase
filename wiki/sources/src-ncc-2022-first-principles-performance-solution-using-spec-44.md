---
title: NCC 2022 First Principles Performance Solution Using Specification 44 (ABCB Guide)
type: source
created: 2026-06-10
source: Z - TECHNICAL INFO/SPEC 44/NCC 2022 First principles Performance Solution using Specification 44.pdf
---

# NCC 2022 First Principles Performance Solution Using Specification 44 (ABCB Guide)

## Summary

ABCB "Understanding the NCC" guide (Version 2024.1, Aug 2024) explaining how to develop a first-principles Performance Solution for housing thermal performance under NCC 2022 Performance Requirement H6P1, using the heating, cooling and thermal energy load-limit calculations in Specification 44 (clauses S44C2, S44C3, S44C4). It maps the full H6P1 compliance landscape — DTS (NatHERS / Elemental), Verification Methods (H6V2 reference building, H6V3 envelope sealing) and first principles — and walks through the A2G2(4) Performance Solution process including the performance-based design brief (PBDB). This is the PRIMARY document of a three-file set: the two "APPENDIX A" and "APPENDIX E" files in the same folder are this identical guide re-badged with appendix banners (see [[src-ncc-2022-first-principles-spec-44-appendix-a]] and [[src-ncc-2022-first-principles-spec-44-appendix-e]]).

## Key claims

- Housing energy efficiency requirements sit in Part H6 of NCC 2022 Volume Two; the two Performance Requirements are H6P1 (Thermal performance) and H6P2 (Energy use). Part H6 aims to reduce energy consumption and peak demand, reduce greenhouse gas emissions, and improve occupant health and amenity. (NCC 2022)
- H6P1 has 3 sub-clauses: total heating load, total cooling load, and total thermal energy load of habitable rooms and conditioned spaces must each not exceed the corresponding limit in Specification 44.
- Three ways to demonstrate compliance with H6P1: a Performance Solution, a DTS Solution, or a combination of both.
- Two DTS pathways: Option 1 (NatHERS) and Option 2 (Elemental). Two Verification Methods: H6V2 (verification using a reference building) and H6V3 (verification of building envelope sealing). The fifth option is a first-principles Performance Solution assessed directly against H6P1 using the Specification 44 calculations.
- The Performance Solution process has 4 steps per Clause A2G2(4): prepare a performance-based design brief (PBDB), carry out analysis, evaluate results, prepare a final report. Each step must be completed before the next.
- Because H6P1 is quantified, the Specification 44 load limits should be used as the measurable acceptance criteria in the PBDB for thermal performance.
- The H6P1 load limits derive from the heating and cooling load limits introduced in NCC 2019 as part of the NatHERS DTS provisions, now generalised. Limits allow higher heating loads in cold locations and higher cooling loads in hot, humid locations, with an area adjustment so small houses (higher surface-area-to-volume ratio) are not unfairly disadvantaged.
- All Specification 44 load limits are expressed in MJ/m².annum.
- S44C2 Heating load limit (HLL): the greater of a fixed 4 MJ/m².annum and ((0.0044 × HDH) − 5.9) × FH, where HDH is total annual heating degree hours for the location and FH is the area adjustment factor from Table S44C2 (based on total area of habitable rooms).
- S44C3 Cooling load limit (CLL): CLL = (5.4 + 0.00617 × (CDH + 1.85 DGH)) × FC, where CDH is total annual cooling degree hours, DGH is total annual dehumidification gram hours, and FC is the area adjustment factor from Table S44C3.
- S44C4 Thermal energy load limit (TLL): combines HLL, CLL and the annual average daily outdoor temperature range (Tr). As laid out in the PDF: TLL = (19.3 HLL + 22.6 CLL − 8.4) ÷ (Tr + 10.74) − 15.
- Climate data inputs (HDH, CDH, DGH) are NCC defined terms (Schedule 1, all volumes). Specification 45 (referenced in Verification Method J1V5, NCC Volume One) provides heating/cooling degree hours and dehumidification gram hours for locations across 8 climate zones and may be used — but any consistent data source is permitted.
- The "appropriate authority" (typically the building surveyor/certifier, or a government entity) determines whether a particular Performance Solution is compliant.
- A first-principles Spec 44 solution only addresses H6P1; H6P2 Energy use must still be met separately for NCC compliance.

## Concepts touched

NCC 2022, Spec 44, NatHERS, 7-Star, performance solutions, H6P1, H6P2, DTS, verification methods, climate zones, heating load limit, cooling load limit, thermal energy load limit, PBDB, building fabric

## Caveats

- ABCB guidance document (Version 2024.1, Aug 2024), Creative Commons licensed — explanatory, not the legal NCC text. The actual Table S44C2/S44C3 area adjustment factor values are not reproduced in this guide; consult NCC 2022 Specification 44 directly.
- The S44C4 fraction layout degraded slightly in text extraction; verify the TLL formula against NCC 2022 clause S44C4 before using in calculations.
- See also: the wiki concept page `concepts/spec-44.md` ([[spec-44]]), the comparison guide [[src-specification-44-vs-nathers-guide]], and the duplicate appendix-badged copies [[src-ncc-2022-first-principles-spec-44-appendix-a]] / [[src-ncc-2022-first-principles-spec-44-appendix-e]].
