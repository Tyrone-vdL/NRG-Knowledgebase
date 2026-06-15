---
title: NatHERS Assessor Handbook 2024 — assessment rules, zoning, defaults, windows, certificates (surgical extract)
type: source
created: 2026-06-10
source: Z - TECHNICAL INFO/NATHERS/NatHERS_Assessor_Handbook_2024.pdf
---

# NatHERS Assessor Handbook 2024 — assessment rules, zoning, defaults, windows, certificates (surgical extract)

## Summary

The NatHERS Assessor Handbook (DCCEEW 2024, Version 1.1) is the primary current procedural manual for accredited NatHERS assessors — it sets out, chapter by chapter, the mandatory rules ("key requirements", cross-referenced to NatHERS Technical Note clauses) for conducting a NatHERS thermal and Whole of Home assessment in regulatory mode: zoning, climate/exposure/orientation selection, floors, walls, windows and doors (including the full NatHERS default window library with U-values and SHGCs), ceilings/roofs, shading, thermal bridging, Whole of Home appliance modelling, and finalising/certifying the assessment. This page is a surgical extract of the highest-value assessment rules: zoning rules (Ch 5), default values used when documentation is silent (Chs 2, 6, 9, 12), window/glazing defaults and openability percentages (Ch 8), outdoor living area treatment, and certification/stamping requirements (Ch 13). The handbook is a "living document" updated in alignment with the NatHERS Technical Note — assessors must always follow the current Technical Note and state/territory requirements.

## Structure of the handbook (14 chapters)

1. Introduction (NatHERS, the Chenath engine, assessor/AAO requirements)
2. Before you start (software tools, documentation, default settings, individual ratings, assessment goal, thermal performance principles)
3. Data entry and retention (project details, scaling/measurement, data retention)
4. Climate, exposure, ground reflectance and orientation
5. Zoning
6. Floors
7. Walls
8. Windows and doors
9. Ceilings and roofs
10. Shading
11. Thermal bridging
12. Appliances (Whole of Home assessments only)
13. Finalising the assessment
14. Definitions (glossary)

Mandatory rules are numbered per chapter (e.g. 5a–5k, 8a–8j, 9a–9n, 13a–13i) and cite the corresponding NatHERS Technical Note clause.

## Foundations (Chs 1–2)

- NatHERS uses a **10-star rating system** estimating heating/cooling thermal performance. Each star band is defined by a **maximum thermal energy load (MJ/m²/yr)** that **varies by climate zone** (star bands published at nathers.gov.au).
- All NatHERS tools are underpinned by or benchmarked against the **Chenath engine** (CSIRO). Engine assumptions (thermal properties, climate data, infiltration, internal heat gains, thermostat settings, usage schedules) are documented in the Chenath repository (hstar.com.au/Home/Chenath).
- Accredited assessors must hold a **Certificate IV in NatHERS Assessment** and maintain accreditation with an **Assessor Accrediting Organisation (AAO)**. Whether regulatory assessments must be done by accredited assessors varies by state/territory.
- **Default settings (Section 2.3):** where documentation lacks detail, defaults represent **average practice (e.g. floor coverings) or worst-case (e.g. roof colour)**. Where worst-case, the assessor must test that the default actually produces the minimum achievable rating (may need multiple simulations). Rule 2g: assessors must advise the client when defaults are used, and **any defaults used must be detailed in the NatHERS Certificate 'additional notes'** (Tech Note clauses 3.8, 3.9). There are NO defaults for number/location of lights or ceiling penetrations — the certificate must state the dwelling was rated without downlights/penetrations and must be re-rated if present.
- **Individual ratings (2h):** every dwelling must have its own rating and NatHERS Certificate — including every Class 2 unit even with repeated designs. When duplicating a base file across similar units, adjust terrain exposure, orientation, height above ground and shading per unit.
- **Renovations (2j):** NatHERS software must NOT be used to rate only part of a dwelling — a rating for an addition/extension must model the existing plus proposed areas of the whole dwelling (Tech Note clause 1.3). Class 10a structures included only if attached.
- **Data retention (2k):** the drawing set, documentation and all supporting information must be retained by the assessor and produced if audited.

## Climate, exposure, orientation (Ch 4)

- NatHERS divides Australia into **69 climate zones**, generally aligned to postcode boundaries. Rule 4a: the **principal climate zone must always be used** unless an alternative zone exists for the location and the justification is recorded in the certificate's Additional Notes (Tech Note clause 4.1).
- Rule 4b: regulatory assessments must use the correct postcode; for new suburbs without one, use the nearest suburb with similar climatic properties and note it on the certificate.
- **Terrain/exposure categories (Table 4-1):** Exposed (few/no obstructions); Open (scattered obstructions ≤10 m high); Suburban (numerous closely spaced obstructions ≤10 m, e.g. suburban housing); Protected (numerous closely spaced obstructions >10 m, e.g. city/industrial). Exposure of multistorey dwellings generally increases with elevation — calculate for the building then for the individual dwelling (Tech Note clause 4.2).
- Rule 4d: orientation must be based on **true north, not magnetic north**.

## Zoning rules (Ch 5) — key requirements 5a–5k

- **5a:** ALL parts within the dwelling envelope must be allocated to a zone (zone type definitions in Table 5-1 = Appendix 1 of the NatHERS Technical Note).
- **5b — minimum zoning:** every dwelling must contain **a minimum of three zones excluding the garage** (e.g. kitchen/living, bedroom, unconditioned); at least one **unconditioned zone**; every zone must have walls, a floor, and a ceiling and/or roof.
- Only **one main kitchen/living zone** per dwelling — additional kitchens/kitchenettes are zoned "living". Maximum **two living areas** (the two largest); other living areas zoned "daytime". If no room fits "unconditioned", the smallest zone is modelled as unconditioned.
- **5c:** workshops/storerooms/laundries may be combined with the garage only if within the garage, accessed only from the garage and/or an external door, and with no internal door to the dwelling.
- **5d:** if the dwelling has **more than 50 zones**, adjacent same-type zones may be combined if they have external windows/doors on the same orientation, same zone type and conditioning, open to the same internal zone, and no external ventilation to more than one orientation. Otherwise zones must NOT be combined, even when zone types match (e.g. laundry, WC, bathroom each zoned separately).
- **5e — small spaces:** non-habitable spaces **≤700 mm deep** (small pantries, built-in robes, plumbing/wall voids, service ducts) are included in the zone they're attached to. Anything >700 mm deep (walk-in robes, walk-in pantries) is its own zone. Powder rooms and WCs are NOT small air spaces (ventilation assumptions) and must be zoned separately.
- **5f:** small under-stair storage can be zoned with the staircase.
- **5g:** ensuites or WIRs accessible only from a bedroom are **night-time zones**, regardless of windows or door vs permanent opening. Parent's retreats/WIRs are **daytime** if they form the access path from a living/daytime zone to the bedroom, **night-time** if accessible only via the bedroom.
- **5h — airlocks:** may be modelled unconditioned only if located at a dwelling entrance, with one or more external walls, one or more internal walls, an external door, and internal door(s) of which **only one opens to a conditioned zone**. A so-called airlock opening to two conditioned zones functions as a hallway → zone as daytime. If in doubt, daytime.
- **5i — studios/bedsits/open-plan apartments:** minimum three zones (kitchen/living, bedroom, unconditioned). Where no obvious features exist: kitchen/living ≥30% of total conditioned floor area, bedroom ≥20%; separated by an artificial plasterboard-on-stud dividing wall with permanent openings no greater than 60% of the wall area (handbook states wall area of no less than 40% between zones) (Tech Note clause 5.3).
- **5j/5k — outdoor living areas:** an "outdoor living area" on plans (glazed verandah, portico, sunroom, wintergarden, conservatory, enclosed balcony, alfresco) is **assigned a zone only if it is mechanically heated or cooled AND capable of being fully enclosed by solid construction elements** (walls, windows, bi-fold/sliding doors). Otherwise — enclosed or partially open outdoor living areas, alfresco spaces and detached garages are NOT zoned; they are modelled **for shading purposes only**. A space with plastic blinds as a wall element is not "fully enclosed by solid construction". A fan or fireplace does not count as mechanical heating/cooling. BUT if the space is permanently open to other zones of the dwelling, it must be modelled as a zone regardless. For glazed-roof outdoor areas modelled as shading, a ~10% shading factor for clear glass may be appropriate (solid structures = 100%).
- **Double-height voids (5.5.8):** with Chenath 3.21+, the upper void is incorporated into the parent zone (one combined zone). Two-zone methods are only for Chenath 3.13 or earlier.
- **Domestic lifts (5.5.9):** enclosed lift shafts are modelled as a 'daytime' shaft zone per level (except AccuRate, which allows a single shaft zone); semi-enclosed through-floor lifts modelled as a horizontal opening; lifts in a double-height void need no modelling.
- **Adjacency zones (5.6, Chenath 3.21):** the only two zones modelled OUTSIDE the dwelling envelope: (1) **'Glazed common area'** — unconditioned glazed common corridors in Class 2/4 buildings (not used for semi-enclosed/verandah-style or conditioned corridors — those walls are 'adjacent to neighbour'); (2) **'Shared basement carpark'** — dwelling directly above an underground carpark where the carpark floor is on ground, and external walls fully adjacent to earth or <50% exposed; model the uppermost carpark level, underground walls as retaining walls with a 5 m soil layer. Neither zone's area counts toward the certificate's total floor area.
- **Conditioning terminology (5.3):** in NatHERS, 'conditioned' relates to room purpose/usage assumptions, not actual heating/cooling appliances. Most spaces in the envelope are conditioned except bathrooms, WCs, laundries with an external opening, and garages. NatHERS 'dwelling envelope' includes conditioned AND unconditioned zones — different from the NCC building/thermal envelope definition.
- **Ambiguous spaces (5.7):** ignore the room name on drawings; zone by features and intended use (could it be a bedroom? does it have a robe? what adjoins it?).
- **Internal heat gain assumptions (Table 5-2):** Chenath schedules internal sensible+latent gains by zone type and time of day (basis: 160 m² dwelling, 2 adults + 2 children, 80 m² living / 80 m² bedrooms). E.g. 6pm–7pm living-with-kitchen carries the cooking peak; bedrooms get occupant gains overnight. (Table layout degraded in extraction — verify exact wattages against the source PDF or Chenath repository.)

## Floors (Ch 6) — defaults

- **6c — floor covering defaults** where not specified: garages = concrete; wet areas, butler's pantries and kitchens = ceramic tiles; small storage/voids = same finish as parent zone; **all other areas = carpet with rubber underlay**. If covering colour unspecified: default colour **medium (solar absorptance = 0.5)**.
- **6a:** correct floor height above ground must be entered (drives wind exposure). Assumed slab FFL minimum 150 mm above ground if unknown; basements can be negative.
- **Waffle pods:** where pod thickness not documented, default **175 mm** thickness.
- **6d:** floor adjacency above carparks/unconditioned public spaces per Table 6-1 (Tech Note Table 2, clause 6.7). **6e:** steel-framed construction requires thermal bridging modelling (Ch 11).

## Walls (Ch 7) — key points

- Wall colour: if unspecified, default colour **'medium'** (Tech Note clause 7.2).
- Software tools contain default R-values for construction elements; insulation R-values specified in documentation must be modelled (calculating wall R-values and air gaps covered in 7.3.2–7.3.3).
- Adjacency: external walls default to 'outdoor' unless modelled otherwise; Class 2/4 wall adjacency options include neighbour, external wall, glazed common areas (Tech Note clause 7.3, Table 3).

## Windows and doors (Ch 8) — performance values, libraries, defaults

- **Performance values (8.1):** window energy performance is measured by **Uw** (whole-of-window U-value — lower = better insulating) and **SHGCw** (solar heat gain coefficient, 0–1 — fraction of incident solar heat transmitted). Both are total-window-system values (frame + glazing).
- **8a:** assessors must use AFRC custom window codes matching the documented windows, or the WERSLink default window library, or the NatHERS default window libraries (Tech Note clause 8.3).
- **Two default window libraries (8.3.1):**
  - **WERSLink DWL** (AGWA, available with Chenath 3.23): **1,279 windows** representing real-world products (1,034 Housing + 245 Apartments; "Apartment" = buildings ≥15 m / 6 storeys with sub-frames). 11-character codes, e.g. HAAWS-060-051 = Housing, Aluminium, Awning Window, Single glazed, Uw 6.0, SHGC 0.51.
  - **NatHERS DWL** (all tools): **136 default windows**, 6 frame types × 12 glazing types — statistical representations (not actual products) derived from >10,000 AFRC-rated windows; U-values at the 75th percentile, SHGC at adjusted median.
- **Group A vs Group B:** Group A = larger frame fraction (awning, bifold, casement, tilt'n'turn, entry/French/hinged doors); Group B = smaller frame fraction (fixed, double-hung, louvre, sliding windows/doors, stackers).
- **NatHERS DWL code convention:** frame (ALM/ATB/TIM/uPVC/CMP/FIB) + group/glazing/gas (001 = Grp A single, 002 = Grp B single, 003/004 = double air, 005/006 = double argon) + glass coating (01 clear, 02 tint, 03 HSG low-e, 04 LSG low-e) + engine frame letter (A/B/I/W).
- **Selected NatHERS default window values (Table 8-6, Uw / SHGCw):**
  - ALM-001-01 (alum Grp A single clear): **6.7 / 0.57**; ALM-002-01 (Grp B single clear): **6.7 / 0.70**
  - ALM-003-01 (alum Grp A DG air clear): **4.8 / 0.51**; ALM-005-01 (argon): **4.5 / 0.50**
  - ATB-003-01 (thermally broken alum Grp A DG air clear): **3.6 / 0.47**; ATB-005-03 (Grp A DG argon HSG low-e): **2.9 / 0.44**
  - TIM/PVC/FIB-001-01 (timber/uPVC/fibreglass Grp A single clear): **5.4 / 0.56**; TIM-003-01 (Grp A DG air clear): **3.0 / 0.48**; TIM-005-01 (argon): **2.6 / 0.50**; best timber/uPVC defaults ~**2.0** Uw (DG argon low-e)
  - CMP-001-01 (composite Grp A single clear): **5.9 / 0.57**; CMP-005-04 (Grp A DG argon LSG low-e): **2.2 / 0.32**
  - Full 136-row table in source Section 8.7 (some rows OCR-degraded; verify before client use).
- **8d:** minimum documentation for windows/doors: size, glass type, frame type, openable percentage, opening style and location (Tech Note clause 2.5). If missing, refer back to the client — a NatHERS Certificate should not be finalised without it.
- **Obscure glass (8e/8f):** not AFRC-rateable; model as **clear** if clear-patterned or **tint** if tinted/translucent laminate (default windows, or matching custom range).
- **Default opening percentages (Table 8-3 = Tech Note Table 4):** Fixed **0%**; any openable window with restricted-opening safety requirements (no complying security screen) **10%**; double hung **45%**; sliding **45%**; awning **90%**; casement/tilt'n'turn **90%**; louvre **90%**. Custom windows: use manufacturer ventilation charts; fall back to these defaults if unavailable (8g/8h).
- **Combination windows (8.4.6):** total openability c% = (Σ openable component area × its default opening %) ÷ total combined window area × 100. Worked example: 0.6×1.2 m awning (90%) + fixed in a 1.2 m² unit → 54%.
- **8j — garages:** unconditioned external garage doors modelled not weather-stripped; unconditioned garage windows not weather-stripped with insect screens; conditioned garage doors/windows weather-stripped (Tech Note clause 8.1).
- **Glazed doors (8i):** glazed portion modelled as a window; if glazing is **<25% of the door**, model as a solid door (Tech Note clause 8.2). Fully glazed hinged/pivot doors with no library product → Group A casement. Partially glazed entry doors → solid door (reduced size) + Group A casement at 100% openability. Sidelights → Group B fixed windows. Internal glazed doors → modelled as solid internal doors (Chenath doesn't apply solar transmission to them).
- **Roof/high-level glazing (8.6):** four types — skylights (shaft through roof space), roof windows (no roof space), clerestory and highlight windows (entered as windows). Default window types must be used for roof glazing unless a custom product exists. Double-height windows are modelled as two stacked windows, one per level.

## Ceilings and roofs (Ch 9) — defaults

- **9c:** roof colour unspecified → default **'medium' (solar absorptance = 0.5)**. **9d:** ceiling colour unspecified → 'medium'.
- **9e:** if no electrical schedule/ceiling plan exists, the certificate must state the dwelling was modelled **without recessed light fittings**.
- **9f–9l ceiling penetrations:** all recessed lights, vents and exhaust fans modelled as penetrations; minimum **50 mm insulation clearance** unless manufacturer states otherwise; fittings rated as insulation-coverable modelled 'insulated'/no clearance; vents and exhaust fans **unsealed** unless documented otherwise; gas cooker exhaust modelled 'sealed'; flued gas heaters etc. modelled as wall/ceiling vents.
- **Table 9-3 — default ceiling penetration modelling** (when info incomplete): no lighting spec → sealed downlights, 1 per zone <5 m², 2 for 5–10 m², 1 per 2.5 m² for zones >10 m², 50 mm clearance; lights indicated without details → sealed downlight + 50 mm; exhaust fan → sealed in conditioned / unsealed in unconditioned zones, 250 mm diameter, 50 mm clearance; rangehood → 250 mm sealed; heating flue → +100 mm clearance if diameter known, else 300 mm total clearance.
- **Roof edge insulation:** default **R3.0 and 450 mm width** for perimeter edge batts where values unattainable.
- **9m — ceiling fans:** modelled ONLY if documented. Unknown size → default **900 mm diameter**. Available diameters 900–3000 mm; fans affect air movement (cooling benefit averaged over zone area), not infiltration.
- **9n:** steel-framed construction → thermal bridging must be modelled.

## Thermal bridging (Ch 11) — scope

Thermal bridging modelling is mandatory for steel-framed dwellings (Tech Note clause 11). The chapter covers default steel framing specifications, thermal breaks, airspaces adjacent to framing, continuous insulation and roof blankets. (Detail not extracted — see source Ch 11.)

## Whole of Home (Ch 12) — appliance defaults

- Whole of Home assessments add heating/cooling appliances, hot water, pool/spa pumps, solar PV, batteries, lighting, cooking and plug loads on top of the thermal rating.
- **12.2.16 default appliance values (Table 12-7)** when information is missing (defaults must be noted on the certificate; Tech Note clause 12.1):
  - Heating (room reverse-cycle AC): cold climate HSPF 2.5 (1.0 star); mixed HSPF 3.5 (2.0 star); hot/humid HSPF 4.0 (2.5 star) — 2019 GEMS ratings
  - Cooling (room reverse-cycle AC): cold TCSPF 3.5 (2.0 star); mixed TCSPF 3.5 (2.0 star); hot/humid TCSPF 4.0 (2.0 star)
  - Wood heater: slow combustion 60%
  - Hot water: gas storage 4.0 star if reticulated gas available, else electric storage off-peak
  - Lighting: **5 W/m²**; cooktop gas if gas available else electric; oven electric
  - Pools/spas and solar PV: cannot be included unless specified in documentation. Pool pump stars: single speed 1 star, dual speed 3 stars, multi/variable 5 stars. PV inverter capacity default = total system size (kW) × 0.75; PV slope/azimuth = documented roof pitch/direction.
  - Climate groupings for these defaults are by NatHERS climate zone lists (cold zones incl. 14, 18, 20–26, 47–49, 55, 57–69; hot/humid incl. 1–5, 7, 10, 29–40).
- **Re-simulation triggers (12.5):** updated thermal assessment; technology-type change (e.g. room → ducted AC, gas instantaneous → storage, gas → electric cooking); reduced appliance efficiency; reduced STCs below the certificate's substitution range; reduced/re-oriented PV; increased pool/spa volume. A like-for-like higher-efficiency swap does NOT require re-simulation.

## Finalising and certificates (Ch 13) — key requirements 13a–13i

- **Software outputs:** star rating, adjusted annual heating load (MJ/m²), adjusted annual cooling load (MJ/m²). Sanity checks: cold climates heating-dominant, warm climates cooling-dominant, mild climates roughly equal.
- **Improvement workflow (13.2):** (1) review heating vs cooling loads; (2) analyse performance by zone; (3) test options one change at a time on a copy of the base file, recording each run (cost-vs-benefit table); (4) select final inclusions with the client; (5) amend the drawing set — assessors must NOT amend drawings unless they are the original author; new drawing version numbers are cited on the certificate.
- **13a/13b:** all recommendations must be client-agreed and included in the final drawing set; ALL information used in the rating must appear on the final approved drawings (graphics or notations). The only exception to drawings-match-assessment is where default values were applied (which are recorded on the certificate).
- **Certification requirements (13.4.1):** minimum production set = site plan, floor plans, elevations, sections, electrical/lighting layout, window schedule (size, glass and frame type, opening style); construction material details; NatHERS QR-code stamp on each relevant page; QR code within certificate and stamp; AAO stamp if required; NatHERS Certificate.
- **13c:** Class 2 buildings — each individual dwelling/unit needs its own NatHERS certificate AND the building needs a NatHERS summary certificate (Tech Note clause 13.6). Many jurisdictions require both a minimum per-dwelling star rating and a building average. **13d:** combined buildings sharing a lot can have a single summary certificate on client request where NCC combined-building requirements are met.
- **13e/13f:** before stamping or issuing a certificate, confirm all Technical Note requirements are met and the assessment matches the documentation; mismatches go back to the client/drawing author for re-issue.
- **13g — stamping:** the NatHERS QR code stamp must be applied electronically to ALL design documentation relevant to the assessment — site/floor plans, elevations/sections, materials documentation, window/skylight/door schedules, shadow drawings, electrical plans (lighting + mechanical ventilation), insulation information, appliance schedule, design amendments, supporting reports. The stamp must not obscure information or another practitioner's mark. **13h:** follow AAO directions/stamping. **13i:** Class 2 summary QR stamp on each relevant page.
- Certificates are generated via NatHERS software with an online certification portal; NCC 2022 certificates come in thermal-only and Whole of Home variants, produced by accredited or non-accredited assessors (different certificate forms).

## Concepts touched

NatHERS, 7-Star, Whole-of-Home, NCC 2022, NCC 2019, climate zones, zoning, glazing, windows, insulation, thermal bridging, ceiling fans, ceiling penetrations, roofing, walls, flooring, shading, certificates, training, alterations

## Caveats

- **Surgical extract** of a 178-page handbook (~428K chars). Deep-extracted: Ch 2 (defaults, individual ratings), Ch 4 (climate/exposure), Ch 5 (zoning, complete), Ch 6/7/9 (default values), Ch 8 (windows, complete incl. default window table), Ch 12 (WoH appliance defaults), Ch 13 (certification, complete). NOT extracted in detail: Ch 3 (data entry/scaling mechanics), Ch 6–7 construction-type detail (floor types, wall R-value calculation worked examples), Ch 9 roof types/ventilation/volume detail, Ch 10 (shading — horizontal/vertical projections, neighbouring buildings, vegetation), Ch 11 (thermal bridging modelling detail, default steel framing specs), Ch 12 appliance background sections (12.2.3–12.2.15), Ch 14 (glossary). Consult the source PDF for those.
- The handbook defers to the **current NatHERS Technical Note** and state/territory requirements on every mandatory rule — the Technical Note is the binding instrument (see the separate NatHERS Technical Note 2024-10-23 source). The handbook describes itself as a living document; check nathers.gov.au for the current version (this is Version 1.1, © 2024).
- The handbook uses "default values", not "provisional values" — note when querying.
- Several tables (Table 5-1 zone types, Table 5-2 heat gains, Table 8-6 window specs, Table 13-1) suffered layout degradation in text extraction; the values quoted above are the unambiguous ones — verify figures against the source PDF before relying on them in client work.
