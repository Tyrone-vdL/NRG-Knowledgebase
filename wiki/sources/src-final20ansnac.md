---
title: Application of NatHERS Software in Northern Australian Climates — Research Appendices A–D
type: source
created: 2026-06-10
source: Z - TECHNICAL INFO/SPEC 44/Final20ANSNAC.pdf
---

# Application of NatHERS Software in Northern Australian Climates — Research Appendices A–D

## Summary

Appendices A–D of a research report ("The Application of NatHERS Software in Northern Australian Climates", filed as Attachment D) examining how the Chenath simulation engine behind NatHERS tools models thermal comfort, air movement, ceiling fans and space conditioning in tropical, sub-tropical and hot-arid climates — including the test houses, climates and methodology used. Despite living in the SPEC 44 folder, this is not an ABCB Specification 44 document; it is background evidence on NatHERS software behaviour in northern Australia, useful when arguing why a NatHERS rating misrepresents a ventilation-led tropical design (a classic trigger for a Spec 44 / performance solution pathway — see [[src-specification-44-vs-nathers-guide]]).

## Key claims

- Appendix A (tools): AccuBatch (developed by Tony Isaacs Consulting for the former DCCEE, now maintained by CSIRO) batch-runs NatHERS simulations across climates and occupant-behaviour assumptions, including free-running (no heating/cooling) mode. The Chenath engine is the benchmark in all three accredited NatHERS tools (AccuRate Sustainability, BERSPro, FirstRate5) and has passed the international BESTEST protocol (CSIRO, 2005). AccuRate Sustainability version 1.1.4.1 was used for compliance modelling.
- The study used a pre-release Chenath engine for air movement analysis because BERSPro then had a permanent-openings bug; findings "will not be able to be reproduced exactly with the current NatHERS tools that are now aligned".
- Appendix B (comfort modelling): Chenath combines air and radiant temperature into an "environmental temperature"; cooling is triggered at 2.5°C above the thermostat setting; humidity triggers cooling at roughly 50% RH at 30°C, relaxed to 90% RH when air movement (open windows/fans) is present.
- Ceiling fan assumptions in Chenath (directly below fan): 900 mm fan = 0.5 m/s air speed, 1.7°C comfort effect; 1200 mm = 0.66 m/s, 2.4°C; 1400 mm = 0.77 m/s, 2.9°C. Air speed is fully effective over twice the fan's swept area, reduced proportionally in larger rooms.
- Internal wind speed was about 20% of external wind speed in a simple test-box validation, consistent with measured Townsville houses. Comfort benefit of air movement: dT = 6 × (v − 0.2) − 1.6 × (v − 0.2)², with indoor air speed capped at 1.5 m/s; ventilation opens windows when zone temperature exceeds a trigger generally 0.5°C below the cooling thermostat, capped at 26°C.
- Chenath conditioning schedules: living-type zones heated/cooled 0700–2400; bedrooms 1600–0900, invoked only when needed.
- Appendix C: wind speed/direction analyses for Darwin (NatHERS climate file 1), Townsville (5), Brisbane (10), Alice Springs (6), Emerald (via Charleville, 19) and Toowoomba (via Oakey, 50); orientations with winds >3 m/s and 20–30°C give the best cross-ventilation.
- Appendix D (methodology): two market-led spec homes (Henley Luna 4, single-storey; Clarendon IV27, two-storey) plus traditional hot-climate designs (C19-style elevated tropical house, Redlynch house in Cairns — rated over 9 stars in its tropical zone, 7 stars in Darwin, 8 in Townsville — the Innovation House, and Shayne's House) were assessed across 6 northern reference locations on 4 orientations.
- Outdoor living area credit (then clause 3.12.0.1(a), climate zones 1–2): 1-star credit for an outdoor living area with an impervious roof of Total R-Value at least 1.5 (downward heat flow), a permanently installed ceiling fan, floor area not less than 12.0 m², minimum 2.5 m length/width, minimum 2.1 m opening height, and one permanently open side.
- Eight traditional tropical design strategies tested: highly openable (louvre) windows, cross-ventilation room placement, light colours (0.3 solar absorptance roofs/walls), deep shading (1.8 m verandahs), lightweight materials, elevated design, ceiling fans, and high thermal mass in hot inland areas.
- Market-led houses average roughly half the window area per m² of floor area of traditional designs, and traditional designs have about 40% more wall area per m² of floor area.
- NT market research (Isaacs, 2006 era): bedroom 1 is air-conditioned for 74% of occupied time vs 37% for living rooms; average household cooling thermostat about 23°C versus the 26.5°C NatHERS assumption — supporting concerns that blockwork housing "is generally rating better than it should compared to lightweight housing" (Kieboom, 2007) and that lower bedroom thermostat assumptions could rebalance ratings.

## Concepts touched

NatHERS, climate zones, NCC 2019, Chenath, AccuRate, thermal comfort, ventilation, ceiling fans, tropical design, thermal mass, insulation, glazing, solar absorptance, outdoor living areas, training

## Caveats

- Pre-NCC 2022 research: the report references the then-current 6-star minimum and clause 3.12.0.1 (BCA/NCC 2019-era numbering); the document is undated within the extract and predates the 7-star/NCC 2022 regime. Treat the regulatory specifics (e.g. outdoor living area star credit) as historical.
- This is Attachment D appendices only — the main report body, findings chapters and Appendices' figures (wind roses, psychrometric charts, floor plans) are not in this file or did not extract; several tables (e.g. Table 2, Table 7 layout) degraded in extraction — verify figures against the source PDF.
- Filed in the SPEC 44 folder but is not a Specification 44 document; it is relevant background for why NatHERS tools may under-credit ventilated tropical designs. See also: the wiki concept page `concepts/spec-44.md` ([[spec-44]]), [[src-ncc-2022-first-principles-performance-solution-using-spec-44]], and [[src-specification-44-vs-nathers-guide]].
