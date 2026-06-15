---
title: Hebel R-value (CSR Hebel Technical Manual, Jan 2006)
type: source
created: 2026-05-05
updated: 2026-05-05
sources:
  - "Z - PRODUCT INFO/Hebel R value.pdf"
publication_date: 2006-01
caveat: "Source dated January 2006 — verify against current CSR Hebel data before quoting in client work. R-values listed are AAC fabric only; total wall R-value depends on cladding/lining and air gaps."
---

# Hebel R-value (CSR Hebel Technical Manual, Jan 2006)

## Summary

Single-page extract from CSR Hebel's Technical Manual (Section 3, Energy Efficiency). Provides **dry-state and moist (5% / 10% moisture content)** thermal resistance values for every Hebel product at standard thicknesses.

**Key principle:** R-value drops as moisture content rises. A wet AAC block is ~30% less effective insulator than a dry one. NCC compliance assumptions usually assume dry-state. Spec writing should verify which condition is being claimed.

## Thermal Resistance Table (Table 3.1)

### Block products

| Product | Density (kg/m³) | k (W/m·K) | Thickness (mm) | R dry | R 5% MC | R 10% MC |
|---|---|---|---|---|---|---|
| Thermoblok | 470 | 0.11 | 100 | 0.86 | 0.71 | 0.61 |
|  |  |  | 150 | 1.29 | 1.07 | 0.92 |
|  |  |  | 200 | 1.72 | 1.43 | 1.23 |
|  |  |  | 250 | 2.15 | 1.79 | 1.54 |
|  |  |  | 300 | 2.58 | 2.15 | 1.84 |
| Sonoblok | 650 | 0.16 | 100 | 0.60 | 0.50 | 0.43 |
|  |  |  | 150 | 0.91 | 0.76 | 0.65 |
|  |  |  | 200 | 1.21 | 1.01 | 0.86 |
|  |  |  | 250 | 1.52 | 1.26 | 1.08 |
|  |  |  | 300 | 1.82 | 1.52 | 1.30 |

### Panel products

| Product | Density | k | Thickness | R dry | R 5% MC | R 10% MC |
|---|---|---|---|---|---|---|
| PowerPanel | 510 | 0.12 | 75 | 0.59 | 0.49 | 0.42 |
| SoundFloor | 510 | 0.12 | 75 | 0.59 | 0.49 | 0.42 |
| Wall (Sound Barrier) | 550 | 0.13 | 100 | 0.72 | 0.60 | 0.51 |
|  |  |  | 150 | 1.09 | 0.90 | 0.77 |
|  |  |  | 200 | 1.45 | 1.21 | 1.03 |
|  |  |  | 250 | 1.81 | 1.51 | 1.29 |
|  |  |  | 300 | 2.18 | 1.81 | 1.55 |
| Floor | 580 | 0.14 | 100 | 0.68 | 0.57 | 0.49 |
|  |  |  | 150 | 1.03 | 0.85 | 0.73 |
|  |  |  | 200 | 1.37 | 1.14 | 0.98 |
|  |  |  | 250 | 1.71 | 1.43 | 1.22 |
|  |  |  | 300 | 2.06 | 1.71 | 1.47 |

### Lintels & Stair Treads

| Product | Density | k | Thickness | R dry | R 5% MC | R 10% MC |
|---|---|---|---|---|---|---|
| Lintels | 650 | 0.16 | 100 | 0.60 | 0.50 | 0.43 |
|  |  |  | 150 | 0.91 | 0.76 | 0.65 |
|  |  |  | 200 | 1.21 | 1.01 | 0.86 |
| Stair Treads | 650 | 0.16 | 175 | 1.05 | 0.88 | 0.75 |
|  |  |  | 200 | 1.21 | 1.01 | 0.86 |

R-values for intermediate thicknesses can be **linearly interpolated** between table entries. Same applies between 0% / 5% / 10% MC values. For MC > 10%, contact CSR Hebel.

## Other concepts on the page

- **R_as (Thermal Resistance of Air Spaces)** — must be added when calculating total wall R-value for cavities.
- **R_s (Thermal Resistance of Surface Air Film)** — must be added at internal and external surfaces.
- **U (Thermal Transmittance)** — `U = 1 / R_T`. Lower U = better insulation.

## Practical implications for 7-star spec

- A 200mm Thermoblok wall (R=1.72 dry, R=1.43 at 5% MC) is **insufficient on its own** for most 7-star wall targets — needs additional wrap/insulation layer.
- 300mm Thermoblok at R=2.58 dry approaches NCC DTS wall R-value targets in milder zones, still likely needs a wrap.
- Always add R_as (cavity) and R_s (surface films) for total wall R.

## Caveats

- **Document date: January 2006.** Nearly 20 years old. Confirm current CSR Hebel values before issuing reports.
- Values are for **AAC fabric only**, not the wall system. Total wall R = R_AAC + R_cavity + R_cladding + R_lining + 2× R_surface_film.
- Moisture content matters — a freshly laid wall can be at 10%+ MC for months.

## Cross-references

- [[../concepts/nathers]] — uses these R-values when modelling Hebel walls in NatHERS software
- [[../products/index]] — Hebel listed under Wall Systems & Cladding
- Related products that might pair with Hebel: Bradfords wall wraps, MasterWall systems, Greenboard cladding
