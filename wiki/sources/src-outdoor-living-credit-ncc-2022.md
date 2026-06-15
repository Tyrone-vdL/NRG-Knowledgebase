---
title: "Outdoor Living Area — qualifying criteria (NCC 2022)"
type: source
created: 2026-05-14
updated: 2026-05-14
sources:
  - "Z - NCC/OUTDOOR LIVING CREDIT PARAMETERS - NCC 2022.png"
publication_date: undated
caveat: "Source is a single PNG snippet of the NCC 2022 'outdoor living area' definition — the qualifying criteria for the QLD outdoor living star credit. The snippet shown ends mid-clause (4)(a) with 'or', implying clause (4)(b) (likely the Class 2 building alternative) continues but is not captured in this image. The actual star credit value (number of stars / kWh allowance) is NOT in this snippet — that lives in the QDC 4.1 documents (yet to be ingested). Verify against the source PNG and QDC 4.1 before quoting in client reports."
---

# Outdoor Living Area — qualifying criteria (NCC 2022)

## Summary

The QLD outdoor living credit (sometimes called the "outdoor living star credit") allows a small reduction in the required NatHERS star rating for dwellings with a qualifying covered outdoor living area. The credit is a Queensland-specific provision implemented via the Queensland Development Code (QDC 4.1) on top of NCC 2022 NatHERS requirements.

This source captures the **NCC 2022 definition of a qualifying "outdoor living area"** — i.e. the criteria a deck, alfresco, or covered patio must satisfy to be eligible for the credit at all. The credit value itself (stars or kWh allowance) is **NOT in this source** and must be looked up in QDC 4.1 or the relevant Queensland implementation document.

## Definition — Outdoor living area (NCC 2022)

**Outdoor living area** means a space in a class 1 building or sole-occupancy unit in a class 2 building that:

1. **Is directly accessible from, and attached to, a living area of the building** such as a lounge, kitchen, dining and family rooms; **and**
2. **Has a minimum floor area of 12.0 m² and a minimum dimension in all directions of 2.5 metres**; **and**
3. **Is fully covered by an impervious roof**; **and**
4. **Has:**
   - **(a)** for a class 1 building — **two or more sides open or capable of being readily opened**, not including the connection between the internal living area and the outdoor living area; **or**
   - **(b)** *[continuation not captured in the source PNG — likely the Class 2 alternative requirement. Verify against the full NCC 2022 text or re-ingest the complete source.]*

## Practical implications for a NatHERS assessment

When applying the QLD outdoor living credit, the assessor needs to verify that the proposed outdoor area satisfies **all four criteria above** for the dwelling to be eligible:

- **Connection (Criterion 1):** Must be off a living area (lounge / kitchen / dining / family). Off a bedroom or laundry → does NOT qualify.
- **Size (Criterion 2):** Must be ≥ 12 m² in floor area AND ≥ 2.5 m in every direction. A long narrow area (e.g. 1.5 m × 8 m = 12 m²) **fails** because the narrow dimension is below 2.5 m, even though the area is sufficient.
- **Roof (Criterion 3):** Must be **fully** covered by an **impervious** roof. Partial cover, pergolas with gaps, or shade-cloth roofs do NOT qualify.
- **Openness (Criterion 4):** For class 1 — at least two sides open or operable-open (sliding doors, bifolds, opening louvres). The internal connection (e.g. the doorway from the kitchen) doesn't count toward the two sides.

If all four are met, the dwelling is eligible to apply the QLD outdoor living credit — but **the actual credit value and how it's applied to the star rating must come from QDC 4.1 / Queensland implementation guidance**, not from this source.

## Gaps in this source

- **Clause (4)(b) — Class 2 building alternative** — not captured in the snippet
- **Credit value (stars or kWh)** — not in this source; look up QDC 4.1
- **Application method** — how to enter the credit in NatHERS software (FirstRate5, AccuRate, BERS Pro, HERO) — not in this source
- **NCC 2019 vs 2022 differences for this credit** — not captured; the QDC 4.1 NCC 2019 PDF may have older parameters

## Caveats

- Source PNG was extracted from a larger NCC 2022 document — the surrounding context (which clause this lives under, the credit value, application notes) is not in the snippet.
- The credit is **Queensland-specific** — does not apply in VIC, NSW, ACT, TAS, SA, WA, NT NatHERS assessments.
- Confirm against the live NCC 2022 text before applying in a client report. NCC text is updated periodically (Amendment 1 already issued).

## Cross-references

- [[../concepts/nathers]] — NatHERS star ratings under NCC 2022
- [[../concepts/ncc]] — NCC 2022 framework
- [[../concepts/climate-zones]] — relevant climate zone context (QLD covers CZ 1, 2, 3, 5)
- Related but **not yet ingested** sources to chase next:
  - `Z - NCC/QDC 4.1 - NCC 2019 5STAR DTS.pdf` (NCC 2019 era — older parameters may differ)
  - `Z - NCC/QDCMP4.1SustainableBuildings.pdf` (QDC MP4.1 Sustainable Buildings — likely has the credit value)
