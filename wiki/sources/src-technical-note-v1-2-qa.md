---
title: NatHERS Technical Note V1.2 — Assessor Questions and Answers (Chenath 3.13)
type: source
created: 2026-06-10
source: Z - TECHNICAL INFO/NATHERS/GUIDANCE NOTES/Technical Note V1.2 Q&A.pdf
---

# NatHERS Technical Note V1.2 — Assessor Questions and Answers (Chenath 3.13)

## Summary

A 70-question assessor Q&A accompanying the NatHERS Technical Note V1.2 update for software using Chenath engine V3.13, answering practitioner questions on zoning, ceiling penetrations, NCC/jurisdictional interactions, the (then-new) Universal Certificate, waffle pods/insulated slabs and general modelling matters. Useful as a record of NatHERS zoning logic and assessor protocol rationale, though the underlying Technical Note version is long superseded.

## Key claims

- In regulation mode, assessors must apply the agreed Technical Note protocols approved by all states and territories — no "first principles" individual judgement except where clause 1.4 covers areas the Notes don't address; queries go through the assessor's AAO (Q1, Q64).
- Every dwelling must be modelled with at least one unconditioned zone — normally a bathroom, toilet or laundry; if ducted heating/cooling serves all such rooms, the smallest room is selected as the unconditioned zone. Consistent zoning for QA purposes overrides the minor technical impact (Q3, Q4).
- Ensuites without windows are still separate (night-time) zones, not combined with the bedroom; unconditioned laundries/bathrooms/WCs cannot be combined even with the same orientation; walk-in robes are separate zones because they lack bedroom occupancy loads (Q5, Q13, Q18).
- Room naming on plans governs zoning: a room labelled "bedroom" is zoned as a bedroom regardless of missing built-in robes (Q7, Q10); spaces are zoned per the Technical Note regardless of fanciful plan names (Q19).
- Underfloor heating is treated as a plug-in appliance, not equivalent to a reverse-cycle air conditioning vent for conditioning status (Q6).
- Ceiling penetrations: insulation installed merely "close" to a fitting still causes a loss of ceiling insulation that must be calculated; ducted heating/cooling vents and evaporative cooling vents are NOT entered as penetrations because the BCA requires them to be insulated (Q25, Q29, Q30, Q33).
- Most fireproof downlight covers are 1-hour fire rated and cannot have insulation laid over them; most LEDs void their warranty if covered (Q34).
- If the project ends up with more ceiling penetrations than noted on the Universal Certificate, the assessment becomes invalid and must be redone (Q35).
- Jurisdictional precedence: where the BASIX protocol (NSW) contradicts the Technical Note, BASIX prevails for that requirement; when complying via the NatHERS modelling method, the Technical Note's modelling method is followed rather than NCC DtS prescriptive tables (Q38-Q40).
- The Universal Certificate displays whether the assessor is accredited or unaccredited (unaccredited raters cannot use the NatHERS logo) and notes the Uw and SHGCw values of all windows used, so these values need not be on the plans (Q42, Q59, Q65).
- Waffle pod values: new values are built into software insulation libraries from Chenath 3.13; until then assessors use the figures from Addendum 1.1 (2013). Insulation inputs are actual product R-values, not system values; slab edge insulation modelling was unresolved at time of writing (Q48, Q50, Q51).
- Default insect screens and Holland blinds are applied within the software in new dwelling mode — no assessor involvement; modifiable only in non-regulatory mode (Q47).
- Chenath V3.13 supports up to 20 construction lines for external walls (16 wall types + 4 doors) (Q58).
- BCA climate zones and NatHERS climate zones are different systems (e.g. Bendigo is BCA zone 6 but NatHERS zone 66) (Q55).
- Exhaust fan and downlight sizes must be specified on the plans; window opening percentages used in modelling do not need to be (Q68, Q70).

## Concepts touched

NatHERS, zoning, ceiling penetrations, downlights, Universal Certificate, BASIX, NCC, climate zones, waffle pods, insulation, glazing, windows, assessor accreditation, AAO, Chenath engine

## Caveats

- Undated document tied to Technical Note V1.2 / Chenath engine V3.13 (circa 2014-2017) — long superseded. The current operative document is the NatHERS Technical Note Version 20241023 (Chenath 3.22/3.23), which changed several of these rules (e.g. zone-combining provisions, bathroom zoning flowchart, default penetration values) — see src-nathers-technical-note-20241023.md.
- Q&A answers reflect Administrator guidance of the time, not regulation text; treat as background rationale, not current compliance authority.
