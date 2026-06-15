---
title: NatHERS Technical Note — June 2019 (Chenath 3.13/3.21) [SUPERSEDED]
type: source
created: 2026-06-10
source: Z - TECHNICAL INFO/NATHERS/ARCHIVE/NatHERS Tech note June 2019.pdf
---

# NatHERS Technical Note — June 2019 (Chenath 3.13/3.21) [SUPERSEDED]

## Summary

The NatHERS Technical Note version June 2019 (effective 1 June 2019, for software using CSIRO Chenath engines V3.13 and V3.21) set the mandatory requirements for NatHERS assessments in the NCC 2019 era — climate zone selection, zoning, floors, walls, windows, ceilings/roofs, shading and certificate stamping. It replaced Technical Note 1 version 1.2 (2014) and is itself SUPERSEDED, first by the September 2022 Technical Note (Chenath 3.22) and now by the NatHERS Technical Note October 2024. It contains no thermal bridging or Whole-of-Home provisions — those arrived in the 2022 note.

## Key claims

- Mandatory for all NatHERS assessments commenced on or after 1 June 2019; assessments commenced earlier could use Technical Note 1 v1.2 (2014), noted in the certificate's 'additional notes'. State/territory regulatory requirements prevail in event of inconsistency.
- Minimum design documentation: site plan with north point, floor plans, elevations, sections, construction material details, lighting location plan/electrical schedule, and window/skylight/roof window/door schedule (size, glass and frame type, opening style, location).
- Each dwelling must have its own individual rating, including every Class 2 dwelling in a development. NatHERS tools assess the ENTIRE dwelling — additions/extensions must be modelled as part of the whole dwelling.
- Climate zone: use the principal climate zone allocated to the postcode in most cases; alternative climate zones only with justification (e.g. altitude change) recorded in 'additional notes'. New suburbs without a postcode use the nearest suburb with similar climatic properties.
- Ground reflectance 0.2 must be modelled at all times. Orientation is rotation with respect to true north, not magnetic north. Exposure categories: Exposed, Open (obstructions ≤10 m, scattered), Suburban (numerous closely spaced obstructions ≤10 m), Protected (numerous obstructions >10 m).
- Zoning: minimum three zones excluding garage (e.g. kitchen/living, bedroom, unconditioned); each zone needs walls, floor and ceiling and/or roof. Studios/bedsits/open-plan apartments: at least three zones, with an artificial plasterboard-on-stud internal wall with a permanent opening no greater than 60% of the wall area between zones; minimum conditioned floor areas of 30% (kitchen/living) and 20% (bedroom) where no obvious zoning features exist.
- Zone combining permitted only in two situations: (1) workshops/store rooms/laundries within the garage with no internal door to the dwelling; (2) dwellings with more than 50 zones may combine adjacent same-type zones with same orientation, conditioning and connecting internal zone, and no external ventilation to more than one orientation.
- Waffle pods: use the EPS pod thickness closest to documentation but never higher, measured from underside of top slab to bottom of pod; the provisional 175 mm thickness applies when not shown.
- Floor covering provisions when unspecified: garages concrete; wet areas and kitchens ceramic tiles; all other areas carpet with rubber underlay.
- Class 2 floors (Chenath 3.21, Table 2): dwelling above highly ventilated carpark (>50% open) = above outdoor air; above an underground carpark (<50% open, >50% wall area against earth) = above 'Shared Basement Carpark' zone modelling the entire carpark level, with underground external walls as retaining walls with a 5 m thick soil layer; above commercial premises or mostly enclosed common areas = above neighbour. (Appendices 2-3 give the simpler V3.13 equivalents.)
- Colours: exterior wall colour as documented, else provisional 'medium'; internal wall and ceiling colours 'medium' where the software allows and nothing is specified. Roof colour when unspecified = WORST-CASE scenario (e.g. dark roof in tropical areas, light roof in temperate/cool climates; multiple runs may be required) — note the later 2022 Technical Note changed this default to medium (0.5).
- Insulation: remove any air gap thickness displaced by bulk insulation; compressed bulk insulation must not be modelled — it must fit the wall cavity.
- Windows: glazed hinged and sliding doors are windows; a partially glazed door with glazing under 25% may be modelled as a solid door. Custom windows use AFRC custom window codes; substitutes need identical opening type, U-value equal or greater, and SHGC within ±5%. Default windows use clear glass in lieu of obscure glass. Provisional opening percentages (Table 5): awning 90%/45% (single/double pane), casement or tilt'n'turn 90%/45%, double hung 45%/22%, louvre 90%/45%, sliding N/A/45%; windows with safety restrictors and no complying screen default to 10%.
- Ceiling penetrations: all downlights, vents and exhaust fans modelled; unsealed if unspecified; minimum 50 mm insulation clearance if unspecified; gas cooker exhausts treated as 'sealed' exhaust fans; ductless (recirculating) rangehoods need not be modelled; permanent static vents (e.g. unflued gas heater vent) treated as wall or ceiling vents.
- Ceiling fans modelled only if documented; provisional 900 mm diameter when size unspecified.
- Shading: model all documented shade features (if software limits the count, model the three with largest impact). Eave/shading width measured from face of external wall to outer-most protrusion INCLUDING gutters; assume 100 mm gutter width if unspecified; if the fascia casts a greater shadow, measure from the bottom of the fascia. Neighbours: model single-storey within 10 m and two-storey within 20 m; north of the Tropic of Capricorn southern features within 168°45'-191°15' must also be modelled. New-development defaults: neighbour mirrors the rated dwelling's envelope and setback, 1.8 m side/rear fences.
- Balconies with solid/glazed walls beside the parent wall = wing walls; balcony walls in front of the parent wall = vertical shading device at 100% shading (solid portion) and 10% shading (glazed portion).
- Protected trees: only trees with an existing preservation order or heritage protection may be modelled, with canopy drawn to scale and the order/listing documented.
- Appendix 1 zone types: Living (max two living areas; extras become daytime), Kitchen/living (exactly one), Daytime (default; includes halls, corridors, studies without built-in robes, unventilated wet rooms), Bedroom (includes studies with built-in robe/WIR/ensuite), Night-time (spaces accessed only via a bedroom), Unconditioned (externally ventilated laundries/bathrooms/WCs/powder rooms, qualifying airlocks, underground cellars; every dwelling needs at least one — else the smallest daytime zone), Garage / Garage-conditioned, Glazed common area (Class 2/4), Shared basement carpark (Class 2/4). Small air spaces (pantries ≤700 mm depth, built-in robes, voids, ducts) join their parent zone.

## Concepts touched

NatHERS, NCC 2019, Chenath 3.13, Chenath 3.21, zoning, climate zones, waffle pods, windows, SHGC, U-value, ceiling penetrations, downlights, shading, eaves, Class 2 adjacency, exposure categories, ground reflectance, certificates, QR code stamping

## Caveats

- SUPERSEDED twice over: replaced by the NatHERS Technical Note September 2022 (Chenath 3.22, NCC 2022) and subsequently by the NatHERS Technical Note October 2024 (being ingested separately in batch n13). Historical reference only — note the 2022+ notes changed key defaults (roof colour worst-case → medium; gutters in eave width mandatory → discretionary) and added thermal bridging and Whole-of-Home requirements absent here.
- Pre-dates the 7-star NCC 2022 requirement; written for the NCC 2019 6-star regime.
