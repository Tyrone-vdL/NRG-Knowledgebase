---
title: Whole of Home (WoH)
type: concept
created: 2026-05-05
updated: 2026-05-14
sources:
  - "Z - TECHNICAL INFO/WoH Guidance Note 20240112.pdf"
  - "Z - RESOURCES_FORMS/7 STAR INFO/Guidance note-WOH.pdf"
  - "Z - RESOURCES_FORMS/7 STAR INFO/Fact sheet - Introducing Whole of Home ratings_1.pdf"
  - "Z - RESOURCES_FORMS/7 STAR INFO/Fact sheet - Top tips for Whole of Home ratings.pdf"
  - "Z - RESOURCES_FORMS/7 STAR INFO/FOR BOOKLET/Pages from Guidance note-WOH.pdf"
---

# Whole of Home (WoH)

**Whole of Home (WoH)** is the NCC 2022 energy-usage performance rating that sits alongside the NatHERS thermal star rating. Under NCC 2022, residential buildings must satisfy **two** energy-efficiency performance requirements: thermal performance (handled by the 7-star shell rating) **and** energy usage performance (handled by WoH). A dwelling can pass one and fail the other — both must be met.

See [[../sources/src-woh-guidance-note-2024]] for the primary source breakdown.

## The rating

- Scale: **0 to 150**.
- **50** = same performance as the reference dwelling.
- **100** = net zero energy value (a "net zero home").
- Above 100 = net positive contribution to societal energy.

Higher rating = lower energy value = better performance.

## Reference dwelling (the "50" benchmark)

- 7-star thermal shell
- 3-star ducted heat pump (reverse-cycle AC) for heating & cooling — per 2019 GEMS Determination
- 5-star instantaneous gas hot water
- Lighting power density 4 W/m² *(software simulation default is 5 W/m² per NCC Housing Provisions 13.7.6 1a)*
- No spa or pool
- No on-site PV or storage

## Energy value — the core metric

WoH ratings derive from **energy value**: the net societal cost of energy use, defined in the ABCB Housing Provisions. It captures retail energy cost plus emissions from energy production. Two drivers:

1. **Fuel type** — coal-grid electricity has higher energy value than solar PV.
2. **Time of use** — peak-afternoon grid electricity costs more than off-peak; batteries that shift draw reduce energy value.

Lower energy value → higher WoH score. The guidance note does not publish a numeric kWh/m² cap; compliance is determined by running the calculation in accredited software against the regulatory threshold.

## What WoH covers

The guidance note lists **five key aspects**:

1. **Heating, cooling, and hot water** — appliance type and efficiency
2. **Spas and pools** — pump energy only (pool/spa heating NOT yet modelled)
3. **Cooking loads** — cooktop and oven fuel/technology
4. **Plug loads** — estimated by software from occupant count; assessors don't input
5. **On-site energy production and storage** — solar PV and batteries

### System inputs at a glance

| System | What's modelled | Default if not specified |
|---|---|---|
| Heating | RCAC, gas, electric resistive, slow-combustion wood | Climate-zone-banded RCAC (cold: HSPF 2.5 / mixed: HSPF 3.5 / hot-humid: HSPF 4.0) |
| Cooling | RCAC, evaporative (climate-zone-restricted) | Climate-zone-banded RCAC (TCSPF 3.5–4.0) |
| Hot water | 10 types incl. heat pump, solar thermal, PV diverter, gas/electric storage & instantaneous | Gas storage 4-star (if gas at dwelling) or off-peak electric storage |
| Lighting | W/m² density | 5 W/m² |
| Cooktop | Gas / electric / induction | Gas if gas at dwelling, else electric |
| Oven | Gas / electric | Electric |
| Pool/spa pump | Single / dual / multispeed | 1 / 3 / 5 star respectively |
| PV | Per-array kW, azimuth, slope, inverter, export | Cannot be included unless specified |
| Battery | Lithium-ion / lead-acid / zinc-bromine + capacity | Cannot be included unless specified |

## Apartment exclusions (Class 2 / Class 4 parts)

Centralised systems cannot currently be modelled in NatHERS:
- Centralised space conditioning
- Centralised hot water (use Verification Using a Reference Building or first-principles performance solution in the interim)
- Centralised PV

Hydronic heating, in-slab heating, and pool/spa heating also lack a current calculation method.

## How to lift a WoH score (top tips)

From s.4.1 of the guidance note:

- Raise the thermal star rating first (reduces heating/cooling demand)
- Higher-efficiency appliances, correctly sized
- Room reverse-cycle AC instead of ducted (no duct losses, better zoning)
- Switch fuel: gas instantaneous → solar/heat-pump electric HWS
- Load-shifting: batteries, west-facing PV array, heat-pump HWS scheduled off-peak
- Add or upsize PV
- Reduce floor area — many WoH calcs scale with m²

**Key insight (verbatim from the guidance note):** "Since the energy value of imports is higher than that of exports, reducing imports is more effective than increasing exports for improving the performance rating." Translation: maximise self-consumption (PV + battery + scheduled heat-pump HWS) over export.

## Re-simulation triggers

A new WoH certificate is required when:
- The NatHERS thermal assessment is updated
- Technology **type** changes (ducted ↔ room, gas ↔ electric, Li-ion ↔ lead-acid, variable ↔ single-speed pump)
- Appliance efficiency drops (e.g. 6-star → 5-star gas heater)
- STC value for solar HWS / heat pump drops below the certificate's substitution range
- PV system shrinks or changes orientation/slope
- Pool/spa volume increases

Like-for-like efficiency upgrades within the same technology don't require re-simulation (but may yield a better rating if re-run).

## Software

Four accredited WoH tools: **AccuRate** (CSIRO), **BERS Pro** (Energy Inspection), **FirstRate5** (Sustainability Victoria), **HERO** (HERO Software).

## Open questions / gaps

- **NCC clause map** — the Jan 2024 guidance note only cites NCC Housing Provisions 13.7.6 1a explicitly. H6P2 / H6V3 / H6D2 / J3D14 etc. are not enumerated. `[clause map TBC — ingest NCC 2022 Vol 2 Part H6 or the NatHERS Technical Note]`
- **State adoption timeline** — not in the guidance note. Refer to state/territory regulators.
- **NSW BASIX carve-out** — not mentioned in this source. See [[basix]].
- **NCC 2022 vs NCC 2025 differences** — not discussed in this Jan 2024 source.

## Cross-references

- [[../sources/src-woh-guidance-note-2024]] — primary source page (Jan 2024 Guidance Note)
- [[nathers]] — NatHERS rates the thermal shell; WoH rates the systems
- [[7-star-rating]] — NCC 2022 thermal minimum, paired with WoH
- [[basix]] — NSW handles WoH-equivalent through BASIX
