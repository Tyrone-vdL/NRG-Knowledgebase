---
title: NCC 2022 Residential Energy Efficiency Compliance Pathways — Specification 44 and H6V2 Verification
type: source
created: 2026-06-25
source: message.txt
---

# NCC 2022 Residential Energy Efficiency Compliance Pathways — Specification 44 and H6V2 Verification

## Summary

This document is a detailed technical guide covering the three NCC 2022 residential energy efficiency compliance pathways — elemental deemed-to-satisfy provisions, NatHERS star rating assessment, and Verification Method H6V2 — with particular focus on Specification 44's role as a quantified performance benchmark tool. It explains when each pathway applies, why NatHERS software cannot be used for H6V2 verification, the mandatory split between H6P1 thermal performance and H6P2 whole-of-home compliance, and the jurisdictional availability of H6V2 across Australian states and territories. The guide is oriented toward Victorian practice but covers national adoption differences in detail.

## Key claims

- Three distinct compliance pathways exist under NCC 2022: (1) NatHERS star rating, (2) elemental deemed-to-satisfy provisions, and (3) Verification Method H6V2; NatHERS is not the only option.
- NatHERS requires 7 stars in most Victorian climate zones, compliance with heating and cooling load limits, and a whole-of-home rating of 60 or higher; it addresses both H6P1 and H6P2 in a single assessment.
- Elemental provisions commonly cap solar absorptance at 0.7 and restrict overhangs to a maximum of 1500mm in some climate zones; elemental provisions cannot be used for H6P2 compliance in buildings over 500 m².
- Specification 44 provides formulas calculating three load limits — heating load limit (HLL), cooling load limit (CLL), and thermal energy load limit (TLL) — all expressed in MJ/m².annum; it is a calculation tool used within certain pathways, not a compliance pathway itself.
- The HLL formula is: HLL = greater of [4 OR ((0.0044 × HDH) − 5.9) × F_H], where the area adjustment factor (F_H) ranges from 1.37 for dwellings ≤50 m² down to 0.84 for larger homes.
- The CLL formula is: CLL = (5.4 + 0.00617 × (CDH + 1.85 × DGH)) × F_C, weighting the dehumidification gram hours component at 1.85 times cooling degree hours.
- The TLL formula is: TLL = (19.3 × HLL + 22.6 × CLL − 8.4 − 15) / (T_r + 10.74), weighting cooling at 22.6 and heating at 19.3.
- Specification 44 is NOT used for NatHERS pathway compliance; NatHERS uses the ABCB Standard for NatHERS Heating and Cooling Load Limits with different methodology.
- H6V2 requires internal heat gains set at 5 W/m² averaged over 24 hours and air infiltration standardised at 0.6 ACH for both proposed and reference buildings; thermostat settings are 20–21°C for heating and 25–28°C for cooling depending on climate zone.
- H6V2 modeling must comply with ANSI/ASHRAE Standard 140 and use hourly climate data representative of a typical year; NatHERS-accredited software is explicitly prohibited for H6V2 verification.
- In Climate Zones 1–2 only cooling loads require verification; in Zones 3–7 both heating and cooling loads must be equal to or less than the reference building; in Zone 8 only heating loads apply.
- Reference building specifications for H6V2 include walls of 110mm masonry veneer with solar absorptance of 0.6, roof pitched at 23 degrees with solar absorptance of 0.6 and ceiling insulation ranging from R4.6 to R5.1, and ceiling height fixed at 2.4 metres.
- Specification 44 verification covers H6P1 only; H6P2 whole-of-home compliance must be demonstrated separately — either via deemed-to-satisfy services provisions (Parts 13.6 and 13.7 of the ABCB Housing Provisions) or a NatHERS whole-of-home certificate achieving 60 or higher.
- Indicative costs: H6V2 verification $3,000–$5,000; separate NatHERS whole-of-home (if needed) $1,500–$2,000; single NatHERS assessment covering both H6P1 and H6P2 typically $1,500–$3,000 total.
- Victoria adopted NCC 2022 energy efficiency provisions on 1 May 2024; the VBA provides guidance through Building Practice Note EE-03-2022.
- H6V2 is explicitly excluded in NSW due to BASIX; Tasmania remains under NCC 2019 energy provisions (6-star, not 7-star); the Northern Territory maintains 5-star for houses and 3.5-star for apartments and has not adopted NCC 2022 energy efficiency increases.
- H6V2 is available as written in the national code in Victoria, Queensland (adopted 1 May 2023), South Australia (adopted 1 October 2024), Western Australia (adopted 1 May 2023), and the ACT (adopted 15 January 2024).
- The 17 mandatory identical parameters between proposed and reference models include orientation, floor plan, glazing locations and sizes, temperature settings, occupancy profiles, and climate data; variation is permitted only in thermal performance characteristics of the envelope.
- Acceptable software for H6V2 verification includes EnergyPlus, BetterBuilding.io (Better Building), IES-VE, DesignBuilder, and TRNSYS, among other ANSI/ASHRAE 140-compliant tools.

## Concepts touched

NCC 2022, NatHERS, 7-Star, Whole-of-Home, H6P1, H6P2, Specification 44, Verification Method H6V2, elemental deemed-to-satisfy, BASIX, climate zones, heating load limit, cooling load limit, thermal energy load limit, heating degree hours, cooling degree hours, dehumidification gram hours, ANSI/ASHRAE Standard 140, solar absorptance, glazing U-value, Solar Heat Gain Coefficient, insulation R-values, thermal bridging, building sealing, ABCB Housing Provisions, performance solutions, A2G2, VBA Practice Note EE-03-2022, Section 10 Building Act 1993, Class 1 buildings, Class 2 buildings

## Caveats

- The document does not carry a version date or named author; it reads as an advisory/explainer piece rather than official regulatory guidance, and should be cross-checked against the current NCC 2022 text, ABCB Housing Provisions, and VBA Practice Note EE-03-2022 before use in compliance advice.
- Cost estimates throughout (e.g., verification at $3,000–$5,000, NatHERS at $1,500–$3,000) are indicative ranges stated by the document author and will vary by project and market conditions; they should not be cited as fixed benchmarks.
- Jurisdictional positions for Tasmania and the Northern Territory are described as current at the time of writing; both jurisdictions may adopt NCC 2022 energy provisions as part of NCC 2025 implementation, and practitioners should verify current adoption status before relying on this summary.
