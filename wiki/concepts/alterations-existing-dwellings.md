---
title: "Alterations to Existing Dwellings"
type: concept
created: 2026-05-14
updated: 2026-05-14
sources:
  - "Z - TECHNICAL INFO/PN - EE-04-Alterations-to-existing-Class-1-buildings - NCC 2022.pdf"
---

# Alterations to Existing Dwellings

Quick-reference for the regulatory framework around extending, altering, relocating or otherwise modifying existing Class 1 (and 10a) dwellings under NCC 2022. Primary source: [[../sources/src-ee-04-alterations-ncc-2022]].

## Why this is a separate compliance regime to new builds

A new build must fully comply with NCC 2022 energy efficiency — 7-star NatHERS (H6P1) plus Whole-of-Home (H6P2). An alteration or extension to an existing dwelling triggers the same performance requirements **in principle**, but the regulatory framework recognises that retrofitting an existing structure to new-build standards is often physically impractical or economically prohibitive.

The Victorian Building Regulations 2018 give the **Relevant Building Surveyor (RBS) discretion under Regulation 233(3)** to consent to **partial compliance**. This is the key lever distinguishing the alterations regime from the new-build regime. The trade-off: the RBS must require "the highest level of compliance that can reasonably be achieved" — partial compliance is not a permission slip to skip the requirements, it's a tool for handling cases where full compliance is unreasonable.

## The Victorian Reg 233(6) framework

### The two trigger thresholds

| Trigger | Source | What it does |
|---|---|---|
| **50% of original volume** (alteration, cumulative over 3 years) | Reg 233(2) | Forces entire building into compliance — not just the altered part |
| **25% of existing floor area OR 1000 m² (whichever is lesser)** (extension) | Reg 233(6) | Above this threshold: the extension must fully comply. Partial compliance no longer available for the extension itself (still possible for the existing building) |

### Partial compliance matrix (Table 1 from EE-04)

| Alteration (% volume) | Extension (% floor area) | Partial compliance consent |
|---|---|---|
| Nil | <25% | Available |
| Nil | >25% | Not available |
| <50% | Nil | Available |
| <50% | <25% | Available |
| <50% | >25% | Only available for the alteration |
| >50% | Nil | Available |
| >50% | <25% | Available |
| >50% | >25% | Only available for the alteration |

### The three compliance pathways (NCC, applied to alterations)

1. **DtS via NatHERS** — Rate the whole building (existing + new work) to ≥7 stars (H6D2(1)(a)) and meet WoH (H6D2(2)(a)). NatHERS can only rate the building as a whole.
2. **DtS via Elemental Provisions** — Use the ABCB Housing Provisions Part 13.2 (fabric), 13.6 (WoH calculation), 13.7 (services) directly. Often more practical for minor alterations.
3. **Performance Solution (clause A2G2)** — Where NatHERS or another method demonstrates equivalence to DtS or compliance with the quantified performance requirement for part of the building.

Plus the Victorian-specific lever:

4. **Consent to Partial Compliance (Reg 233(3))** — RBS discretion. Distinct from a Performance Solution. Must be documented on Form 18 and recorded on the building permit.

H6P1 (thermal fabric) and H6P2 (WoH) are assessed **independently**. PV cannot offset poor thermal fabric.

## Two NatHERS methods for partial compliance assessment

1. **Star Rating Formula** — calculates a required overall star rating (SRr) based on existing area (Ae) at existing star (Sre) plus new work area (An) at new star (SRn ≈ 7.0). Now area-based, not volume-based (revised to align with NatHERS tools).
2. **Rating Only the Renovated Home** — rate the renovated house, get the highest achievable rating, give a preview certificate to the RBS for partial compliance decision, then re-rate after RBS determines omitted features. No rating of the existing unaltered house required.

See [[../sources/src-ee-04-alterations-ncc-2022]] for the full formulas and worked examples (Sre = 3.2 → SRr = 3.6; Sre = 2.0 with Ani = 35.6 m² → SRr = 3.3).

## H6P2 (Whole-of-Home) sub-pathways

- **NatHERS WoH** — score ≥60 for Class 1 dwellings. PV (existing in working order or new) counts.
- **Elemental DtS WoH** (Part 13.6 + ABCB WoH Calculator) — only usable where works are below 25% area / 50% volume thresholds AND building fabric ≥ 4.5 stars equivalent. Minimum 3 kW PV expected unless constraints exist.

## What triggers what — quick decision tree

```
Is volume of alterations (incl. last 3 years) > 50% of original?
├── YES → Entire building must comply (Reg 233(2))
│         RBS may consent to partial compliance on the whole job
└── NO  → Only the altered part needs to comply
          RBS may consent to partial compliance

Is there an extension?
├── NO  → Done
└── YES → Is floor area > lesser of 25% existing area / 1000 m²?
          ├── YES → Extension must fully comply (no partial)
          │         (Partial still possible for existing-building work)
          └── NO  → Partial compliance available for extension
```

## "Reasonable improvements" — typical RBS expectations (DEECA 2023)

Even under partial compliance, the RBS is likely to expect:

- Roof/ceiling insulation upgrade if existing R-value < **R2.5** (flat/skillion roofs)
- External wall insulation when cladding or linings are removed as part of the reno
- Floor insulation in living areas with heaters/ducted outlets (subfloor access permitting)
- Double glazing with argon + high SHG low-e in living areas with heaters/ducted outlets

## State-by-state notes

The EE-04 Practice Note is **Victorian only** — it cites the Building Regulations 2018 and Reg 233, which are Victorian instruments.

- **Victoria** — Reg 233 framework as above. Form 18 documents partial compliance. RBS is the decision-maker. VBA publishes EE-04.
- **NSW** — Alterations to existing dwellings interact with BASIX rather than the NCC alterations framework. The NCC performance requirements H6P1/H6P2 still apply for permits, but the alterations regime sits within BASIX SEPP. Not covered in the PN.
- **Other states (QLD, SA, WA, TAS, NT, ACT)** — Each has its own building regulation/Act that adopts the NCC. The Reg 233 discretion is **not** generalisable. The NCC pathways (NatHERS DtS, Elemental DtS, Performance Solution under A2G2) are national and apply everywhere.

**Action for non-Victorian projects:** verify the equivalent regulatory mechanism for partial-compliance-on-alterations in that state before quoting the EE-04 framework.

## Edge cases worth flagging

- **Relocated homes** — treated as alterations exceeding 50% volume trigger. RBS discretion applies. Best practice: insulate where accessible, seal openings.
- **Prefab kit homes / transportable buildings / dongas** — treated as **new dwellings**, full compliance required. Separate NatHERS rating required for each orientation/site.
- **Heritage walls** — light-coloured walls required for heritage match can be partially compensated with highest-R-value wall insulation for the climate zone.
- **No new appliances** — WoH (H6P2) may not need to be applied if no fixed appliances are being installed/replaced.
- **Lighting** — existing fittings usually grandfathered unless full re-wire or safety issue. Replacement fittings must comply (Part 13.7.6).

## NCC 2019 vs NCC 2022 (for alterations)

- NCC 2019: performance requirements P2.6.1 / P2.6.2 used the **qualitative** "to the degree necessary" — more wiggle room.
- NCC 2022: H6P1 and H6P2 are **quantified** (7 stars, WoH ≥60). Performance Solutions must demonstrate equivalence to these specific values.
- NCC 2022: glazing assessment now multi-storey-as-one, new Glazing Calculator inputs (room type, frame colour, window openability, etc.), star rating formula revised to area-based.

For NCC 2019 alterations, use Practice Note EE-04-2019 (not EE-04 NCC 2022).

## Cross-references

- [[../sources/src-ee-04-alterations-ncc-2022]] — full source summary, formulas, worked examples
- [[ncc]] — National Construction Code overview
- [[7-star-rating]] — H6P1 / H6D2(1)(a)
- [[nathers]] — NatHERS software, accreditation, certificates
