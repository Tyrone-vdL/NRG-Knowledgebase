---
title: NatHERS Technical Note 1 — Version 1.2 (2014) [SUPERSEDED]
type: source
created: 2026-06-10
source: Z - TECHNICAL INFO/NATHERS/ARCHIVE/Tech Note 1.2 (2014).pdf
---

# NatHERS Technical Note 1 — Version 1.2 (2014) [SUPERSEDED]

## Summary

NatHERS Technical Note 1, Version 1.2 (2014), effective 1 October 2014 for software using Chenath engine V3.13, codified the original "Principles for Ratings in Regulation Mode" — orientation, zoning, windows, shading, default settings and waffle pod R-values — for all NatHERS-accredited assessors. It replaced the 2012 Software Modelling Principles and earlier Technical Note versions, and is SUPERSEDED by the June 2019 Technical Note, the September 2022 Technical Note, and now the NatHERS Technical Note October 2024. Its waffle pod R-value table and terrain exposure categories remain useful context for understanding how later defaults evolved.

## Key claims

- For use with Chenath engine V3.13 only. Replaced the Discussion document NatHERS Software Modelling Principles v4.1 (2012), Technical Note v1.0, v1.1 2013 and Addendum 1.2013, plus Technical Note 2 v1.0-2012 and Addendum 1.2012.
- Regulatory requirements prevail over the note; NSW assessors also refer to the BASIX thermal comfort protocol; WA assessments must follow the WA Government's NatHERS technical requirements; the note does not apply to ACT licensed building assessors under the ACT Building Act unless adopted by regulation.
- Each dwelling must have its own individual rating even for repeated designs. NatHERS tools must not rate only part of a dwelling — additions must be incorporated in a new rating for the entire dwelling. Plans and supporting documentation must be retained for seven years.
- Building orientation is based on true north, not magnetic north. Ground reflectance default 0.2 at all times.
- Terrain exposure categories (Table 1): Category 1 Exposed (few/no obstructions; exposed high-rise above 10 floors); Category 2 Open (scattered obstructions below 10 m; medium-rise unit above 3 floors); Category 3 Suburban (numerous closely spaced obstructions below 10 m); Category 4 Protected (numerous closely spaced obstructions over 10 m; city/industrial areas).
- Climate zone: use the principal climate zone for the postcode; assessor discretion only where an alternate zone exists (e.g. elevation); no 'dummy' postcodes; the NatHERS online Climate Zone Map is reference only — software selection has precedence.
- Neighbouring buildings: do not model neighbouring fences/single-storey buildings more than 10 m away, double-storey more than 20 m away, or features to the south (168°45'0" to 191°15'0") — except in the Tropics where southern features may impact shading.
- Zoning: all dwellings must contain multiple zones with at least one unconditioned zone excluding the garage (normally a bathroom, laundry or WC; if none has an external window/door, the smallest must still be selected as unconditioned). Exactly one main kitchen zone; a maximum of two living areas (the two largest; others zoned Day-time). Maximum 50 zones, with limited bedroom-combining rules when exceeded.
- Zone types (Table 2): Living; Kitchen/Living; Day-time (default; corridors and hallways, third-plus living areas, unventilated wet rooms); Unconditioned (externally ventilated laundry/WC/bathroom/powder rooms and airlocks); Bedroom (including studies with built-in robe/WIR/ensuite); Night-time (areas accessed only from a bedroom — ensuites, WIRs, parents' retreats); Garage; Garage Conditioned.
- Bedsits/open-plan studios: model separate zones with assumed plasterboard-on-stud internal walls with permanent openings no greater than 60% of wall area; minimum zone areas kitchen/living 30%, bedroom 20%, bathroom/toilet/laundry 10%.
- Windows: default performance values (U and SHGC) are defined by operating type — if the opening style is not clearly shown, the drawings must be returned to the client and NOT rated. Default opening percentages (Table 5): awning 90%/45% (single/double pane), casement 90%/45%, double hung 45%/22%, louvre 90%/45%, sliding 45%/45%. Height-safety restricted windows without complying screens default to 10% opening.
- Glazed verandahs, loggias, wintergardens, porticos and balconies are not internal zones; side walls are wing walls, front solid portions are external screens at 100% shading and glazed portions at 10% shading.
- Shading device width measured from the face of the external wall to the outer-most protrusion including gutters (assume 100 mm gutter width if unspecified); measure from the bottom of a deep fascia if it casts the greater shadow.
- Defaults when information is requested but not received: roof colour worst-case (dark in tropical areas, light in temperate/cool); wall colour medium; floor coverings — garages concrete, wet areas/kitchens ceramic tiles, all other areas carpet with rubber underlay; ceiling penetrations unsealed/worst performance; 50 mm bulk insulation clearance around penetrations.
- Waffle pod R-values (section 11, maximum allowed): 175 mm pods R0.6; 225 mm R0.7; 300 mm R0.8; 375 mm R0.9. Values apply to EPS pods (with or without air cavities) only; round down for intermediate thicknesses; R0.6 is the default where thickness is not indicated.
- Protected trees with preservation orders or heritage protection are the ONLY vegetation that may be modelled, with canopy to scale and supporting documentation.
- Stamping: the unique NatHERS QR code stamp must be added to every principal page of the drawing set; Class 2 dwellings require per-unit certificates plus a summary showing the average rating; drawing sets that don't align with the certificate must be returned to the designer before stamping.

## Concepts touched

NatHERS, Chenath 3.13, zoning, waffle pods, windows, SHGC, shading, eaves, default settings, exposure categories, ground reflectance, BASIX, Class 2, QR code stamping, ceiling penetrations

## Caveats

- SUPERSEDED: replaced by the NatHERS Technical Note June 2019, then September 2022 (Chenath 3.22), and now the NatHERS Technical Note October 2024 (being ingested separately in batch n13). Historical reference only.
- Written for the BCA/NCC 6-star era and Chenath V3.13 — defaults and zone rules differ materially from current practice (e.g. waffle pod handling, roof colour defaults, no thermal bridging or Whole-of-Home provisions).
- The companion "Zoning guide for Technical Note 1.2 (2014)" illustrates Table 2 with worked floor plans — see that source page.
