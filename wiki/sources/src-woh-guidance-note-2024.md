---
title: NatHERS Whole of Home Guidance Note for Assessors (Jan 2024)
type: source
created: 2026-05-14
updated: 2026-05-14
sources:
  - "Z - TECHNICAL INFO/WoH Guidance Note 20240112.pdf"
publication_date: 2024-01-12
caveat: "This guidance note is non-binding and supports — but does not replace — the current NatHERS Technical Note (which takes precedence in any conflict). The note is described in its own text as an `interim document` that will eventually form a chapter of the NatHERS Assessor Handbook. The PDF makes broad reference to `NCC 2022` and the `Housing Provisions` but does not enumerate every specific NCC clause number (e.g. H6P2 / H6V3 / 13.7.6 etc.) — only NCC Housing Provisions 13.7.6 1a is explicitly cited (lighting default). Other clause numbers customarily associated with WoH (H6P2, H6V3, H6D2, J3D14, etc.) are not present in this document — flagged below."
---

# NatHERS Whole of Home Guidance Note for Assessors (Jan 2024)

## Summary

Official Commonwealth/Department of Climate Change, Energy, the Environment and Water guidance for accredited NatHERS assessors performing **Whole of Home (WoH)** assessments under **NCC 2022**. WoH is the energy-use performance rating that sits alongside the existing thermal star rating. A NatHERS assessment under NCC 2022 verifies **both** of:

1. The **thermal performance** requirement (handled by the 7-star thermal shell rating).
2. The **energy usage performance** requirement (handled by the WoH performance rating).

**Rating scale:** 0–150. A WoH score of **50** = same performance as the reference dwelling. A WoH score of **100** = net zero energy value. Scores above 100 mean the home is a net positive contributor to societal energy.

**Reference dwelling characteristics** (the "50" benchmark):
- 7-star thermal shell
- 3-star ducted heat pump (reverse-cycle AC) for heating and cooling (per 2019 GEMS Determination)
- 5-star instantaneous gas hot water
- Lighting power density of 4 W/m² *(note: software default is 5 W/m² per NCC Housing Provisions 13.7.6 1a)*
- No spa or pool
- No on-site energy production or storage

## NCC 2022 clauses covered

The Jan 2024 guidance note **does not enumerate specific NCC clause numbers** the way a Technical Note would. The only explicit NCC reference in the entire document is:

- **NCC Housing Provisions 13.7.6 1a** — basis for the default lighting power density of 5 W/m² used in software simulation (footnote, p.1).

All other commonly-cited WoH clause references (H6P2 Whole-of-home performance, H6V3 Verification method, H6D2 Deemed-to-Satisfy, J3D14, etc.) are **[clause TBC — not present in this source]**. To populate the clause map, ingest the NatHERS Technical Note and/or the NCC 2022 Volume Two Part H6 directly.

The doc references the broader regulatory layer in general terms:
- "Energy efficiency performance requirements of the NCC" (s.2 opening, p.4)
- "For NCC 2022, there will be 2 energy efficiency performance requirements for residential buildings: the thermal performance and the energy usage performance" (p.4)
- "ABCB Housing Provisions" — used to define "energy value" (p.2)

## What WoH includes — system-by-system breakdown

The doc identifies **five key aspects** in a WoH assessment (p.2):

> "heating, cooling and hot water — specifying appliances that are more energy efficient will reduce energy use and result in a higher Whole of Home performance rating
> spas and pools — having a pool or spa in a dwelling will reduce the Whole of Home performance rating
> cooking loads
> plug loads
> onsite energy production and storage — including onsite energy production and storage systems will offset energy use"

### Heating & cooling (Step 3)

**Available heating types in WoH software:**
- Reverse-cycle air-conditioner (heat pump) — ducted and non-ducted/room
- Gas heater — ducted and non-ducted/room
- Electric resistive heater (in-built, not plug-in)
- Slow-combustion wood heater

**Available cooling types:**
- Reverse-cycle air-conditioner (heat pump) — ducted and non-ducted/room
- Evaporative cooler — ducted and non-ducted/room (suitability varies by climate zone — see Table 1 in source)

**Zoning rules (verbatim, p.7–8):** Each conditioned zone gets an appliance assignment. A ducted system serving multiple zones applies that appliance type to all served zones. Two adjacent spaces can share equipment only if both are the same zone type (daytime or night-time). Mixed daytime/night-time spaces can share equipment only where:
> "the spaces are connected by a door or an opening, and the total floor area of the space/s without space conditioning installed is not more than 30% of the floor area of the space where the space conditioning is installed, or there is evidence demonstrating that the appliance was sized specifically to condition all spaces."

**Multi-split systems** must be modelled as individual non-ducted heat pump units in each serviced zone.

**Exclusions (p.6):**
> "1. Apartment (Class 2 buildings or Class 4 parts of a building) centralised space conditioning services cannot be specified in NatHERS. The calculation method for centralised applications is currently being developed for future implementation.
> 2. Hydronic heating — a calculation method will be developed for future implementation.
> 3. In-slab heating — a calculation method will be developed for future implementation.
> 4. Plug-in appliances."

### Hot water (Step 4)

**Available water-heater types in software:**
- Solid-fuel heater
- Heat pump
- Off-peak electric storage (large electric resistive cylinder, mainly overnight)
- Continuous electric storage (small cylinder, on-demand)
- Instantaneous electric
- Electric-boosted solar thermal
- Gas-boosted solar thermal
- Gas storage
- Gas instantaneous
- Solar PV diverter water heaters (Type 1 simple timer; Type 2 add-on modulated controller; Type 3 bespoke PV diverter — see p.10 for definitions)

If a PV diverter water heater is modelled, evidence of the energisation profile for the diverter type is required. Some software tools cannot model both a PV diverter and a battery in the same assessment.

**Apartment exclusion:** Centralised hot water for Class 2 / Class 4 part buildings cannot be specified in NatHERS. In the interim, apartments with centralised hot water must use the *Verification Using a Reference Building* method or a first-principles performance solution to demonstrate compliance with the **Single Occupancy Unit energy budget** (p.6–7) — `[specific clause TBC — not enumerated in this source]`.

### Lighting (Step 5)

- Calculate lighting density (W/m²) using the **ABCB lighting calculator** where software supports it.
- If unavailable, apply **default 5 W/m²**.
- Reference dwelling baseline is 4 W/m² but simulation default is 5 W/m² (NCC Housing Provisions 13.7.6 1a).

### Spa & pool (Step 6)

- Spas and pools shown on documentation **must** be included.
- Volume input required. If not stated, estimate using: `volume (L) = surface area (m²) × depth (1.5 m) × 1000`. If volume cannot be calculated, the feature cannot be included.
- Pump type (single / dual / multispeed) required.
- **Heating for pools and spas is NOT currently considered in WoH** (Step 2 and Step 6 exclusion).
- If software allows pump star-rating input, enter it; otherwise software applies defaults from Table 2 (single = 1 star, dual = 3 stars, multi/variable = 5 stars).

### On-site renewable energy — PV (Step 7)

Renewable energy in WoH is **limited to solar PV systems**. The software calculates hourly available electrical supply for the whole year based on:
- Location and climatic conditions (assigned from the assessment's climate zone)
- Panel slope and orientation
- Array rated output
- Inverter size
- Export capacity

**System inputs required per array:**
- Rated PV system size (kW = panels × watts-per-panel / 1000)
- Azimuth in degrees from true north (0 or 360° = due north)
- Slope/inclination (0–90°)
- Inverter capacity (kW)
- Export limit — **default 5 kW per phase**; higher values require evidence

Each separate array (different orientation/slope) must be entered individually. Shading above PV systems is **not currently included** in NatHERS (p.11).

**Apartment exclusion:** Centralised PV for Class 2 / Class 4 part buildings cannot currently be specified.

### On-site energy storage — batteries (Step 8)

Available battery types:
- Lithium-ion
- Lead acid
- Zinc bromine

Required inputs: battery technology type and nominal storage capacity (kWh). All other parameters (max depth of discharge, charge/discharge efficiency, charge rate, round-trip efficiency, assumed initial charge) use defaults unless documented otherwise.

**Why batteries matter (verbatim, p.12):**
> "Since the energy value of imports is higher than that of exports, reducing imports is more effective than increasing exports for improving the performance rating."

### Cooking (Step 9)

- **Cooktops:** gas / electricity / induction
- **Ovens:** gas / electricity
- If gas is available at the dwelling (any other gas appliance specified), the cooktop default is gas. Otherwise electric. Oven default is electric.

### Plug loads

Estimated by software based on occupant count for the dwelling. **Assessors are not required to enter any plug-load information.** Plug loads cover whitegoods, AV gear, small appliances, computers, standby, plug-in cooking (e.g. microwaves). They affect overall energy use and interact strongly with on-site PV economics.

## The energy budget — calculation method

**Energy value** is the doc's central metric (p.2):

> "Energy value is the net cost to society of energy use, including costs to the building user, the environment and energy networks (as defined in the Housing Provisions of the Australian Building Codes Board — ABCB)."

It captures retail cost of energy used **plus** greenhouse-gas emissions during production. Two main factors drive energy value per unit of energy consumed:

1. **Fuel type** — Coal-fired grid electricity has higher energy value than solar PV. Adding PV reduces energy value.
2. **Time of use** — Afternoon-peak grid electricity has higher energy value than off-peak. Batteries shift the draw, reducing energy value.

**WoH rating from energy value:** Lower energy value → higher WoH performance rating. Score of 50 = parity with reference dwelling. Score of 100 = net zero energy value. Maximum stated rating = **150**.

**Climate-zone modifiers:** Climate zone affects the underlying calculation through:
- Available solar radiation (used for PV generation calc)
- Heating/cooling appliance defaults (cold / mixed-average / hot-humid — see Table 2 in source)
- Evaporative cooler suitability (Table 1: Suitable / Marginal / Not suitable / Low cooling — 69 NatHERS climate zones listed)

The doc does **not** publish numeric kWh/m² budget caps. Compliance is checked by running the WoH calculation against the regulatory requirement in the assessment software; numeric thresholds are set by the regulatory framework (NCC Housing Provisions / state regulator), not in this guidance note.

## NCC 2022 transition timeline

The doc states the WoH requirement applies under **NCC 2022** as the energy-usage performance arm of the residential energy-efficiency requirements (p.4). **State and territory adoption dates are NOT discussed in this document.** `[State adoption timeline TBC — not in this source]`. The doc points readers to the relevant state or territory building regulator for jurisdictional specifics (p.3).

## NSW BASIX carve-out

**Not discussed in this document.** The Jan 2024 guidance note does not mention BASIX or the NSW carve-out at all. `[BASIX-NSW carve-out TBC — not in this source]` — refer to the BASIX concept page and NSW Planning sources.

## Practical implications

### Heat-pump HWS impact
Heat pump is one of 10 hot-water types selectable in WoH software. A heat pump replacing the reference dwelling's 5-star gas instantaneous will substantially reduce energy value and lift the WoH score — especially when paired with PV (the heat pump can be scheduled to run during PV generation hours). The doc does not quote a numeric uplift.

### Rooftop PV offset
PV directly reduces energy value because solar-generated kWh has lower energy value than grid kWh. Imports cost more than exports save (see verbatim quote under batteries above), so the **biggest WoH gains come from sizing PV + battery to maximise self-consumption** rather than maximising export. Default inverter capacity = system size × 0.75. Default export limit = 5 kW/phase.

### Common compliance failures (inferred from "Tips to improve a rating", s.4.1, p.17)

The doc lists optimisation levers — implicitly, these are the common failure points:
- Thermal rating too low (drives heating/cooling demand up, drags WoH down)
- Appliances under-specified or wrong efficiency tier
- Ducted AC where room reverse-cycle would perform better (ducted losses)
- Gas instantaneous HWS instead of solar/heat-pump electric
- No load-shifting (no battery, no west-facing PV array, no off-peak heat-pump HWS)
- No on-site PV
- Oversized homes — many WoH calcs are floor-area-driven, so reducing the home reduces the budget proportionally

### When re-simulation is required (s.4.2, p.17–18)

A new WoH certificate is required for:
- Updated NatHERS thermal assessment
- Change in technology type (room → ducted RCAC, instantaneous → storage HWS, gas → electric cooking, Li-ion → lead-acid battery, variable → single-speed pool pump)
- Reduction in appliance efficiency (e.g. 6-star → 5-star gas heater)
- STC change for solar HWS or heat pump where new STC is below the certificate's substitution range
- Reduced PV system size or change in orientation/slope
- Increased pool or spa volume

Like-for-like upgrades to higher efficiency within the same technology (e.g. 5-star → 6-star same type) **do not require** re-simulation but may lift the rating if re-run.

## Caveats

- **Non-binding interim document.** Where this guidance and the current NatHERS Technical Note conflict, the Technical Note wins.
- **No NCC clause enumeration.** Only NCC Housing Provisions 13.7.6 1a is named explicitly. H6 series clauses, J3D14, etc. — `[TBC — ingest NCC 2022 Vol 2 Part H6 or the Technical Note]`.
- **No state adoption timeline.** Refer to state/territory building regulators.
- **No BASIX-NSW treatment.** Refer to BASIX-specific sources.
- **No numeric energy-budget cap published.** The compliance threshold lives in the regulatory layer the software checks against, not in this note.
- **Apartments (Class 2 / Class 4 parts) are partially excluded** — centralised space conditioning, centralised HWS, and centralised PV cannot be modelled in NatHERS yet. Apartments must use Verification Using a Reference Building or first-principles performance solution.
- **Hydronic and in-slab heating not yet supported.** Calculation methods "under development."
- **Pool/spa heating not included.** Only pump energy is modelled.
- **PV shading not modelled.**
- **Four accredited WoH software tools** (s.1.3, p.3): AccuRate (CSIRO), BERS Pro (Energy Inspection), FirstRate5 (Sustainability Victoria), HERO (HERO Software).

## Cross-references

- [[../concepts/whole-of-home]]
- [[../concepts/nathers]]
- [[../concepts/7-star-rating]]
- [[../concepts/basix]]
