---
title: NatHERS Technical Note — September 2022 (Chenath 3.22) [SUPERSEDED]
type: source
created: 2026-06-10
source: Z - TECHNICAL INFO/NATHERS/ARCHIVE/NatHERS Tech Note - 2022.pdf
---

# NatHERS Technical Note — September 2022 (Chenath 3.22) [SUPERSEDED]

## Summary

The NatHERS Technical Note version 1 September 2022 (for software tools using CSIRO Chenath engine 3.22, designed for NCC 2022) set the mandatory requirements for conducting NatHERS assessments in regulation mode — and was the first Technical Note to introduce thermal bridging rules for steel framing and the Whole of Home appliances assessment (heating/cooling, hot water, lighting, pools, PV and batteries). It is SUPERSEDED by the NatHERS Technical Note October 2024; treat it as historical reference for ratings performed under Chenath 3.22 in the 2022-2024 window only.

## Key claims

- Applies to all NatHERS assessments using Chenath engine 3.22 (NCC 2022); assessments using Chenath 3.21 continued under the June 2019 Technical Note. Covers NCC Class 1a, Class 2, and Class 4 parts of buildings; attached Class 10a buildings must be modelled as part of the assessment.
- State/territory regulatory requirements (e.g. BASIX in NSW) prevail over this Technical Note in the event of inconsistency. The Technical Note prevails over the Assessor Handbook, software manuals, AAO guidance and trainer advice.
- Thermal bridging (section 11, new in this version) applies only to repeating steel frame elements where insulation is interrupted by steel framing: external walls (Class 1, ignoring external walls of attached unconditioned garages); apartment walls adjacent to non-neighbour spaces; internal walls adjacent to unconditioned garages, roof space or subfloor zones; ceilings below a roof space, non-neighbour public areas, or directly attached to roof; suspended floors above outside air, unconditioned garages or non-neighbour public areas. Ignore between floors of multi-level Class 1 dwellings and adjacent to neighbour zones.
- Default steel framing details (Table 6) when unspecified — wall: stud 90 x 40 mm, spacing 600 mm, flange 40 mm, base metal thickness 0.75 mm, noggings 90 x 40 mm at 1200 mm; floor: joist 100 x 50 mm at 450 mm, base metal 1.5 mm; ceiling/roof without roof cavity: rafter 200 x 75 mm at 900 mm, base metal 1.5 mm.
- NZS 4214 alignment: add R0.16 to any thermally bridged external cavity wall or thermally bridged internal cavity wall to unconditioned garage/roof space (e.g. masonry/brick veneer), if the software allows.
- Thermal breaks can be modelled only after thermal bridging is applied; they are materials with R-value ≥ R0.2 separating the metal frame from cladding (e.g. timber battens ≥ 20 mm, polystyrene sheeting, plastic strips, furring channels). Default (Table 7): direct-fix lightweight external cladding = thermal break yes; cavity/brick veneer = no; cathedral metal roof direct-fix = yes; ceiling with roof cavity = no.
- Default window opening percentages (Table 3): fixed 0%; safety-restricted windows 10%; double hung 45%; sliding 45%; awning 90%; casement/tilt-n-turn 90%; louvre 90%. Combination windows use an area-weighted formula or itemised component codes. Custom window substitution requires identical opening type, U-value equal or greater, and SHGC ±5%, per AFRC protocol.
- Garage doors to outside: model 0% openability, no weather-stripping; garage windows: 0% openability with insect screens and weather-stripping.
- Default ceiling penetration modelling (Table 4) when lighting unspecified: sealed downlights with 50 mm insulation clearance — 1 downlight for zones <5 m², 2 for 5-10 m², 1 per 2.5 m² for zones >10 m²; exhaust fans unsealed 250 mm diameter; rangehoods 250 mm sealed exhaust fan; heating flue 100 mm clearance if diameter known, else 300 mm total clearance.
- Zoning: minimum three zones excluding garage (kitchen/living, bedroom, unconditioned); one main kitchen/living zone only; every dwelling needs at least one unconditioned zone (if no room qualifies, model the smallest zone as unconditioned). Main bathrooms/WCs zone as daytime if unventilated, unconditioned if externally ventilated. Studios/bedsits: kitchen/living ≥30% floor area, bedroom ≥20%, separated by an artificial plasterboard-on-stud dividing wall with wall area of no less than 40% between zones.
- Waffle pods: use the EPS pod thickness closest to documentation but never higher, measured from underside of top slab to bottom of pod; default 175 mm if unspecified; minimum 85 mm concrete cover unless plans show otherwise.
- Defaults for colours: medium = solar absorptance 0.5; light = 0.3; dark = 0.85. Roof colour defaults to medium (0.5) when unspecified — a change from the worst-case roof colour default in the June 2019 note. Solar absorptance = 1 − solar reflectance.
- Class 2 adjacency matrix (Table 2): apartment above enclosed shared basement carpark models the entire carpark zone including underground external walls as retaining walls with a 5 m thick soil layer; ventilated carpark (>50% open) treated as outside air; glazed unconditioned common corridors use the 'glazed common area' zone (applies if the apartment wall is adjacent to glazing or directly opposite glazing within 3x the corridor ceiling height).
- Whole of Home (section 12, new): default heating/cooling appliance is a reverse-cycle air conditioner with climate-based default performance (cold: HSPF 2.5/TCSPF 3.5; mixed: 3.5/3.5; hot-humid: 4.0/4.0); default hot water = 4-star gas storage where reticulated gas available, else off-peak electric storage; default lighting power density 5 W/m²; pool pump default single speed 2 stars; PV inverter capacity default = system size x 0.75; battery types limited to lithium-ion, lead acid and zinc bromine; default ovens electric, cooktops gas if reticulated gas available else electric.
- Shading: eave width measured from face of external wall to bottom of fascia or underside of outer edge of horizontal shading device — gutters at assessor's discretion (a change from June 2019, which included gutters with a 100 mm default). Neighbours: model single-storey within 10 m, two-storey within 20 m; southern shade features (168°45' to 191°15') need not be modelled south of the Tropic of Capricorn; new-development neighbour defaults mirror the rated dwelling with 1.8 m fences. Only trees with preservation orders or heritage protection may be modelled.
- Edge batts: default R3.0 and 450 mm width if values unobtainable. Data retention: minimum seven years.

## Concepts touched

NatHERS, NCC 2022, Chenath 3.22, Whole-of-Home, thermal bridging, thermal breaks, steel framing, zoning, waffle pods, windows, SHGC, U-value, ceiling penetrations, downlights, solar absorptance, shading, Class 2 adjacency, hot water, solar PV, batteries, BASIX

## Caveats

- SUPERSEDED: this September 2022 version is replaced by the NatHERS Technical Note October 2024 (being ingested separately in batch n13). Use only as a historical reference for assessments performed under Chenath 3.22 between September 2022 and the October 2024 note's adoption.
- Several modules were incomplete at publication: the pool/spa module was under review (spas could not be assessed — to be noted in 'additional notes'), and a footnote flags certificate static text pending ABCB confirmation.
- The Appendix 1 zoning matrix (room type vs allowable zone) lost its checkbox marks in text extraction; only footnote rules are reliable here — verify specific room-to-zone mappings against the source PDF or the current Technical Note.
