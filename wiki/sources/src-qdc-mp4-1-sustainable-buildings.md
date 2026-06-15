---
title: "QDC MP4.1 Sustainable Buildings — Queensland outdoor living credit + sustainable building requirements"
type: source
created: 2026-05-14
updated: 2026-05-14
sources:
  - "Z - NCC/QDCMP4.1SustainableBuildings.pdf"
publication_date: 2023-09-19
caveat: "Source dated 19 September 2023, Version 1.15. References to NCC clauses (S42C2, J3D3, J2D2, H6D1, H6P1, H6P2, J1P2, J1P3) point into the BCA (NCC 2022) — those clauses themselves are NOT in this QDC document and may need separate ingestion of NCC 2022 Volume One/Two for full clause-level traceability. Confirm against the live QDC version before quoting in client reports."
---

# QDC MP4.1 Sustainable Buildings — Queensland outdoor living credit + sustainable building requirements

## Summary

Queensland Development Code **Mandatory Part 4.1 — Sustainable Buildings** (Version 1.15, 19 September 2023). The QLD-specific overlay on top of NCC 2022 for Class 1 and Class 2 buildings, covering energy efficiency, water conservation, and electricity sub-metering. The doc is the **canonical source for the QLD outdoor living credit** — both the credit values and the ceiling fan / impervious roof / fan-area requirements that determine whether the credit is 0.5 stars or 1 star.

## Outdoor living area — full definition

A space in a class 1 building or sole-occupancy unit in a class 2 building that:

1. **Is directly accessible from, and attached to, a living area** of the building such as a lounge, kitchen, dining and family rooms; **and**
2. **Has a minimum floor area of 12.0 m² and a minimum dimension in all directions of 2.5 metres**; **and**
3. **Is fully covered by an impervious roof**; **and**
4. **Has:**
   - **(a) For a class 1 building** — two or more sides open or capable of being readily opened, not including the connection between the internal living area and the outdoor living area; **or**
   - **(b) For a sole-occupancy unit in a class 2 building** — at least one side open or capable of being readily opened, not including the connection between the internal living area and the outdoor living area.

This is the full definition — the previously-ingested PNG snippet (`OUTDOOR LIVING CREDIT PARAMETERS - NCC 2022.png`) only contained criteria (1) through (4)(a). Clause (4)(b) is captured here in full.

## Outdoor living credit — Class 1 buildings (A1(6))

Applied to single-dwelling NatHERS assessments in QLD. Climate zones 1, 2, 3, or 5 (note: NCC references to "climate zones 1 and 2" are taken to mean **CZ 1, 2, 3 or 5** when applying S42C2 in Queensland).

| Condition | Nominal credit |
|---|---|
| Outdoor living area complies with NCC clause **S42C2(1)(b)** | **0.5 stars** |
| Outdoor living area complies with NCC clause **S42C2(1)(c)** | **1 star** |

The S42C2(1)(b) vs (c) distinction points into the BCA (NCC 2022 Volume Two) and is not expanded in this QDC document. Based on the parallel Class 2 structure (below), the (b) → (c) upgrade likely corresponds to **adding a ceiling fan and meeting the impervious-roof R-Value threshold**, but **verify against NCC 2022 Volume Two Part S42 directly before applying in a Class 1 assessment.**

A class 1 building that complies with A1(2) and obtains the 1-star credit is **deemed equivalent to a 7-star NatHERS rating** (per A1(3)).

## Outdoor living credit — Class 2 buildings (A2(2))

Applied to sole-occupancy units in multi-residential buildings. Climate zones 1, 2, 3 and 5.

| Condition | Nominal credit |
|---|---|
| Sole-occupancy unit includes an outdoor living area fully covered by an impervious roof with **total R-Value ≥ 1.5** (downward heat flow) | **0.5 stars** |
| Sole-occupancy unit includes an outdoor living area fully covered by an impervious roof with **total R-Value ≥ 1.5** (downward heat flow) **AND has at least one permanently installed ceiling fan or fans with a speed controller that serves the whole floor area** | **1 star** |

**→ The ceiling fan is what doubles the credit from 0.5 to 1 star.** No fan = half the credit. This is the requirement Will asked about.

### Fan floor area limits (A2(3))

For A2(2)(a) and A2(2)(b), the floor area a fan serves must not exceed:

- **(a) 15 m²** if the blade rotation diameter is **less than 1200 mm**
- **(b) 25 m²** if the blade rotation diameter is **≥ 1200 mm**

A large outdoor living area (e.g. 30 m²) therefore needs **two fans** — one ≥1200 mm fan covers up to 25 m², the second covers the remaining area.

### Air-conditioner shutdown rule (A2(4))

**Critical add-on for the 1-star credit (A2(2)(b)):** Any air-conditioner that services a room **directly adjacent** to the outdoor living area must **automatically shut down when an external door providing access to the outdoor area is open for more than 1 minute**.

This is to prevent the AC from working against the open-door condition that the credit assumes for natural air movement. Without this automatic shutdown, the 1-star credit is not achievable.

## Why the ceiling fan requirement exists (the logic)

The outdoor living credit grants a star bonus on the basis that the dwelling has **passive cooling assistance from a covered outdoor space connected to the living area**. The Queensland regulator assumes:

1. The outdoor space is **shaded** (impervious roof — Criterion 3 / R-Value ≥ 1.5 for Class 2)
2. The outdoor space provides **air movement** that cools the adjacent indoor living area
3. The space is **fan-driven** (not just passive) — hence the ceiling fan requirement for the higher credit tier
4. The AC isn't competing against the open-door condition (hence the auto-shutdown rule)

If any of those assumptions break (no fan, AC running against open door, fan undersized for the area), the cooling-benefit basis collapses and the credit doesn't apply at the higher tier.

## Other content in this QDC document (not expanded here)

This source covers more than just the outdoor living credit. Other sections:

- **Water conservation (P7 / A7):** Dual-flush 4-star WELS toilet cisterns in serviced areas
- **Electricity sub-metering (P9):** Each meterable premises in commercial buildings must be measurable
- **Class 1 energy efficiency (A1(2)):** Reference to 3.12.0(a)(ii) in BCA 2019 (NCC 2019 Vol 2) + the outdoor living credit
- **Class 2 energy efficiency (A2):** Reference to J2D2(2) and J3D3 in BCA (NCC, Vol 1)
- **Performance requirements:** H6P1, H6P2 (class 1); J1P2, J1P3 (class 2)

These are not expanded in this source page — they're flagged for future ingestion if relevant questions surface.

## Practical implications for a NatHERS assessment

When applying the QLD outdoor living credit to an NCC 2022 NatHERS assessment:

1. **First verify** the outdoor space meets the four "outdoor living area" criteria (definition section above). If any fail → no credit at all.
2. **Then check the impervious roof R-Value** — must be ≥ 1.5 W/m²·K (downward heat flow). If the roof is uninsulated or below R 1.5, the credit drops to 0.5 stars or nil.
3. **Then check the ceiling fan(s)** — permanently installed, speed-controlled, sized to the area per the blade diameter table. If absent → 0.5 stars only. If present and correctly sized → eligible for 1 star.
4. **Then verify the AC shutdown rule** for the 1-star tier (Class 2) — auto-shut on external door open >1 minute. If the project's AC doesn't have this control, the 1-star credit cannot be claimed.
5. **Then check climate zone** — credit applies in CZ 1, 2, 3, or 5 only. Outside those zones → not applicable.
6. **Enter the credit in NatHERS software** — application method varies by software (FirstRate5, AccuRate, BERS Pro, HERO); refer to software vendor guidance for the exact star-credit entry path. This QDC document does NOT specify the software-entry method.

## Caveats

- The BCA clauses referenced (S42C2, H6D1, J2D2, J3D3) are NOT in this QDC document. Full clause-level traceability requires NCC 2022 Volume One + Volume Two ingestion.
- The 7-star equivalence claim (A1(3)) assumes a class 1 building that obtains the 1-star credit under A1(2). For other compliance paths, equivalence does not automatically follow.
- Document is dated September 2023 — verify against the current published version (QLD periodically reissues with version bumps; this is Version 1.15).
- The QDC overlay applies in addition to, not instead of, the NCC requirements. Both must be satisfied.

## Cross-references

- [[../sources/src-outdoor-living-credit-ncc-2022]] — NCC 2022 outdoor living area definition (PNG snippet — superseded for the definition, but kept for traceability to the original NCC source)
- [[../concepts/nathers]] — NatHERS star ratings
- [[../concepts/ncc]] — NCC 2022 framework
- [[../concepts/climate-zones]] — CZ 1, 2, 3, 5 are the QLD-relevant zones for this credit
- Next sources to chase for full clause traceability:
  - `Z - NCC/ncc2022-volume-two-20230501.pdf` — NCC 2022 Vol 2 (defines S42C2(1)(b) vs (c) for Class 1)
  - `Z - NCC/ncc2022-volume-one-20230501.pdf` — NCC 2022 Vol 1 (defines J2D2, J3D3 for Class 2)
