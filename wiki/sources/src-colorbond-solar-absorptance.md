---
title: COLORBOND Solar Absorptance Chart (BlueScope)
type: source
created: 2026-05-14
updated: 2026-05-14
sources:
  - "Z - PRODUCT INFO/COLORBOND SOLAR ABSORPTANCE CHART.pdf"
publication_date: undated
caveat: "Source PDF carries no visible publication date. BlueScope occasionally republishes this chart with revised figures and new/retired colours — verify against the current BlueScope technical bulletin before quoting in client work. ZINCALUME steel is intentionally excluded from these tables (see Note 1 on the chart)."
---

# COLORBOND Solar Absorptance Chart (BlueScope)

## Summary

Two-page reference chart published by BlueScope giving the **solar absorptance value** and the corresponding **BCA classification** and **BASIX classification** for every colour in the COLORBOND product family. The chart covers three product ranges across three tables: COLORBOND steel Standard 22 Colours (Table 1), COLORBOND Metallic steel (Table 2), and COLORBOND Coolmax steel (Table 3).

In NatHERS and BASIX assessments the roof colour's solar absorptance is a direct input — it drives how much solar gain the roof transfers into the conditioned space. This chart is the canonical source for that input when the specified roof material is COLORBOND. BCA classifies colours as **L (Light)**, **M (Medium)**, or **D (Dark)**; BASIX uses the same L/M/D buckets but can place a colour in a different bucket to the BCA (e.g. Mangrove is BCA D but BASIX M).

## Solar Absorptance Table

### Table 1 — COLORBOND steel Standard 22 Colours

| Colour | Solar Absorptance | BCA Classification | BASIX Classification |
|---|---|---|---|
| Classic Cream | 0.32 | L | L |
| Surfmist | 0.32 | L | L |
| Paperbark | 0.42 | M | L |
| Evening Haze | 0.43 | M | L |
| Shale Grey | 0.43 | M | L |
| Dune | 0.47 | M | L |
| Cove | 0.54 | M | M |
| Windspray | 0.58 | M | M |
| Pale Eucalypt | 0.60 | M | M |
| Gully | 0.63 | D | M |
| Mangrove | 0.64 | D | M |
| Wallaby | 0.64 | D | M |
| Jasper | 0.68 | D | M |
| Terrain | 0.69 | D | M |
| Basalt | 0.69 | D | M |
| Manor Red | 0.69 | D | M |
| Woodland Grey | 0.71 | D | D |
| Monument | 0.73 | D | D |
| Ironstone | 0.74 | D | D |
| Cottage Green | 0.75 | D | D |
| Deep Ocean | 0.75 | D | D |
| Nightsky | 0.96 | D | D |

### Table 2 — COLORBOND Metallic steel

| Colour | Solar Absorptance | BCA Classification | BASIX Classification |
|---|---|---|---|
| Galactic | 0.34 | L | L |
| Cosmic | 0.39 | L | L |
| Rhea | 0.49 | M | M |
| Astro | 0.62 | D | M |
| Aries | 0.70 | D | M |
| Celestian | 0.93 | D | D |

### Table 3 — COLORBOND Coolmax steel

| Colour | Solar Absorptance | BCA Classification | BASIX Classification |
|---|---|---|---|
| Whitehaven | 0.23 | L | L |

Coolmax is BlueScope's high solar-reflectance roof product — only one colour offered (Whitehaven, 0.23). Lowest absorptance figure in the whole chart.

## Practical implications for 7-star spec

- **Cooling-dominated climates (CZ 1–5, e.g. Cairns through Sydney/Perth coastal):** Roof solar absorptance is one of the highest-leverage inputs in the NatHERS model. Dropping from a dark colour (e.g. Monument 0.73) to Surfmist (0.32) can swing a marginal project by 0.3–0.7 stars on the cooling load alone. **Coolmax Whitehaven (0.23)** is the strongest lever available in the COLORBOND range for hot climates.
- **Heating-dominated climates (CZ 6–8, e.g. Canberra, Melbourne hills, Tasmania, Alpine):** A dark roof absorbs free winter solar gain through the ceiling assembly (modest effect — most of the gain is re-radiated overnight), so the cooling penalty of dark colours is much smaller. Light roofs can still help summer comfort but the trade-off is closer to break-even. Don't reflexively spec Surfmist in CZ 7–8.
- **Common spec rescue:** When a marginal-rating project fails by a fraction of a star and the original roof colour is dark (≥ 0.68), swap to **Surfmist (0.32)** or **Shale Grey (0.43)** before adding insulation or upgrading glazing — it's almost always the cheapest path to compliance.
- **Classification mismatch warning:** Several colours sit in different BCA vs BASIX buckets (e.g. Paperbark, Evening Haze, Shale Grey, Dune are BCA Medium but BASIX Light; Mangrove, Gully, Wallaby, Jasper, Terrain, Basalt, Manor Red are BCA Dark but BASIX Medium). Use the correct column for the assessment scheme you're working under — NSW BASIX jobs follow the BASIX column.
- **ZINCALUME exception:** Per Note 1, ZINCALUME (unpainted metal-coated) is **not** in these tables because its low thermal emittance behaves differently to painted finishes. For BCA and NSW BASIX, treat ZINCALUME as a **Medium** colour per ASTM E1980.

## Caveats

- **Publication date not visible on the PDF.** BlueScope reissues this chart periodically with revised figures and new/retired colours — confirm against the current BlueScope technical bulletin before locking values into a client report.
- The chart provides solar absorptance only. **Thermal emittance** (the other half of the cool-roof story) is not tabulated here — for COLORBOND painted finishes assume high emittance (~0.85+) per the chart's Note 1 implication; for ZINCALUME emittance is low and the chart explicitly excludes it.
- Values are for the roof sheet **as supplied**. Dirt, weathering and oxidation will drift absorptance upward over the life of the roof — NatHERS modelling uses the as-supplied figure.

## Cross-references

- [[../concepts/nathers]] — solar absorptance is a direct NatHERS input for roof elements; this chart is the source of truth when COLORBOND is specified
- [[../concepts/climate-zones]] — drives whether a dark→light roof swap is high-leverage (CZ 1–5) or marginal (CZ 6–8)
