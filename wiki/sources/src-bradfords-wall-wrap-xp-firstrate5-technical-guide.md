---
title: Thermoseal Wall Wrap XP in FirstRate5 — Modelling Technical Guide
type: source
created: 2026-06-10
source: Z - PRODUCT INFO/BRADFORDS wall-wrap-xp-firstrate5-technical-guide.pdf
---

# Thermoseal Wall Wrap XP in FirstRate5 — Modelling Technical Guide

## Summary

CSR Bradford "Building Knowledge Series" guide on how to correctly model Thermoseal Wall Wrap XP in the FirstRate5 NatHERS software so the wrap's reflective air-gap R-value is credited in the wall system. The method: in Wall Builder, enter a reflective air gap with emittances 0.1/0.9 at the cavity thickness (40 mm nominal) as its own layer. Includes worked layer stacks for brick veneer and lightweight clad walls and explains why XP (outward-facing antiglare) still contributes when the stud cavity is full of batts while conventional wraps do not.

## Key claims

- To simulate Wall Wrap XP in FirstRate5: use the Wall Builder and select a reflective air gap of 0.1/0.9 with the appropriate thickness for the wall cavity.
- Product surface properties: reflective surface faces outwards with an emittance of 0.09; non-reflective surface faces inwards with an emittance of 0.9.
- Brick veneer example layer stack: Layer 1 = 110 mm extruded brick; Layer 2 = insulation placeholder with 40 mm nominal 0.1/0.9 reflective air gap (the wrap); Layer 3 = insulation placeholder with the wall batt (R1.5/R2.0/R2.5/R2.7 as required); Layer 4 = 10 mm plasterboard.
- Lightweight clad example layer stack: Layer 1 = 9 mm Cemintel Expresswall panel on 35 mm top hat; Layer 2 = 40 mm nominal 0.1/0.9 reflective air gap; Layer 3 = wall batt placeholder; Layer 4 = 10 mm plasterboard.
- Conventional (single-sided, inward-facing) wall wrap with no wall batts generates a reflective air-gap R-value from the empty stud cavity — example summer R<sub>T</sub> 1.2 from the wrap alone.
- Conventional wall wrap with R1.5 wall batts contributes no reflective air-gap R-value (stud cavity filled) — example summer R<sub>T</sub> 2.0 from the insulation only.
- Wall Wrap XP with R1.5 wall batts still contributes its reflective air-gap R-value via the outward-facing antiglare surface and brick cavity — example summer R<sub>T</sub> 2.5 (wrap plus batt).

## Concepts touched

wraps, walls, NatHERS, FirstRate5, energy rating, reflective air gap, R-value, brick veneer, lightweight cladding, insulation

## Caveats

- No publication date in the extracted text (Doc Ref B0063); FirstRate5 workflows and NatHERS engine treatment of reflective air gaps may have changed since publication — verify against current FirstRate5 guidance.
- Vendor guidance from CSR Bradford promoting its own product; the R<sub>T</sub> comparison figures are illustrative summer values for specific constructions, not certified system ratings.
