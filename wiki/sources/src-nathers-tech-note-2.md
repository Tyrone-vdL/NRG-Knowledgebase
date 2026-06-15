---
title: NatHERS Technical Note 2 — Guidance for Calculating Ceiling Penetrations (2012)
type: source
created: 2026-06-10
source: Z - TECHNICAL INFO/NATHERS/GUIDANCE NOTES/NATHERS TECH NOTE 2.pdf
---

# NatHERS Technical Note 2 — Guidance for Calculating Ceiling Penetrations (2012)

## Summary

NatHERS Technical Note 2 (Version 1.0, October 2012) giving assessors techniques to account for uninsulated ceiling area created by AS/NZS 3000 clearances around downlights and other ceiling penetrations (exhaust fans, flues, resistance heaters) in NatHERS ratings. It provides default uninsulated-area allowances per fitting type, a 0.5% materiality threshold, and a zone-by-zone modelling methodology, warning that downlight clearances can halve to quarter the effective R-value of ceiling insulation in affected rooms.

## Key claims

- AS/NZS 3000-2007 clearance requirements around downlights create significant uninsulated ceiling area, increasing heat loss/gain; assessors must account for this by entering the uninsulated penetration area separately, zone by zone — NatHERS tools require room-by-room ceiling R-values, not a whole-house average.
- BCA Table 3.12.1.1b (adjustment of minimum R-value for loss of ceiling insulation) cannot be used to derive NatHERS inputs — it works on whole-of-building averages and overall roof/ceiling R-values, not the ceiling-only, zone-level values NatHERS needs.
- Halogen downlights are typically installed at ~1 per 2.5 m²; in a 10 m² room this leaves 0.81 m² of ceiling uninsulated, which can reduce effective R3.5 insulation to about R1.2.
- Table 1 impact figures (halogen downlights with 450 × 450 mm clearance): at 4 downlights per 10 m², initial R3.5 ceiling insulation drops to an area-weighted average of R1.20; at 5 per 10 m², R5.0 drops to R1.12. Effective R-value is cut by between 50% (low R-values) and 75% (high R-values) in rooms with dense downlight layouts.
- Default uninsulated-area allowances per penetration (Table 2): halogen (incl. transformer) 450 × 450 mm = 0.21 m²; incandescent 260 × 260 mm = 0.07 m²; CFL 160 × 160 mm = 0.03 m²; LED (GU10 or standard) 150 × 150 mm = 0.03 m²; separate transformer 75 × 75 mm = 0.06 m². For this note, LEDs and CFLs take the same clearances as incandescent lamps.
- Other penetrations (Table 3): exhaust fans, vents, flues and ceiling speakers by diameter (e.g. 250 mm = 0.063 m², 300 mm = 0.09 m²); exhaust fan with electrical resistance heater and lights = actual size plus 100 mm clearance (e.g. 262 × 262 mm unit = 0.131 m² total).
- Downlight covers: an approved ventilated cover allows insulation close to the sides — use the cover's area as the penetration; an approved non-ventilated cover allowing insulation over the top requires no penetration allowance. Cover use must be noted on the electrical plan, otherwise defaults apply; assessors cannot certify plans that don't explicitly show approved covers that were assumed in the rating.
- Air infiltration: unless noted otherwise on the electrical plan, all downlights are treated as ventilated (a significant air-leakage source).
- Methodology: if total penetration area is less than 0.5% of the insulated ceiling area, no action is needed (note it in comments); if greater, for each affected zone enter both the insulated ceiling area and the uninsulated penetration area. Worked example: 50 m² living zone, R4.1 ceiling, 6 halogen downlights → 1.22 m² entered as uninsulated plasterboard ceiling + 48.78 m² as insulated.
- Ceiling insulation must extend 50 mm beyond the top plate of external walls to prevent thermal bridging; in sloping/attic junctions (~180 mm clearance at 22.5° pitch) compression or omission of insulation at roof/ceiling junctions should also be accounted for.
- BCA's 5 W/m² maximum lighting power density limits total downlight numbers across the house but individual rooms can still have high densities, so concentrated downlights in high-load rooms can cost up to a star if ignored.

## Concepts touched

NatHERS, ceiling penetrations, downlights, insulation, R-values, BCA, AS/NZS 3000, building sealing, lighting power density, thermal bridging, NatHERS assessor practice

## Caveats

- Published October 2012 for the BCA/NCC of that era (references BCA Table 3.12.1.1b and 2007 wiring standard). The current NatHERS Technical Note (Version 20241023) now sets the operative ceiling-penetration defaults — e.g. default downlight density 1 per 5 m², 90 mm diameter, 50 mm clearance — and prevails for current assessments. Use this note for background methodology and legacy default areas only; see src-nathers-technical-note-20241023.md.
- Table 3 figures are partially garbled in extraction (e.g. the 160 mm and 225 mm columns); verify against the source PDF before quoting.
