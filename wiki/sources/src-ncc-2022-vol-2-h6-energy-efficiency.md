---
title: "NCC 2022 Volume Two — Part H6 Energy Efficiency + Specification 42 + Specification 44 (surgical extract)"
type: source
created: 2026-05-14
updated: 2026-05-14
sources:
  - "Z - NCC/ncc2022-volume-two-20230501.pdf"
publication_date: 2023-05-01
caveat: "Source PDF is 12.7 MB / ~700+ pages — the entire residential NCC. This source page is a SURGICAL extract focused on the energy efficiency provisions (Part H6 + Specification 42 + Specification 44 + the cross-references into Section 13 of the ABCB Housing Provisions). It is NOT a full ingest. Other NCC parts (structure, fire safety, plumbing, etc.) and the supporting tables/figures are NOT captured here — refer to the source PDF directly for those, or request a targeted ingest. The cross-referenced ABCB Housing Provisions Part 13 (sections 13.2–13.7) is a SEPARATE document — not ingested. The NatHERS heating/cooling load limit tables (per S42C2(2)) are in the ABCB Standard for NatHERS Heating and Cooling Load Limits — also not ingested."
---

# NCC 2022 Volume Two — Part H6 Energy Efficiency (surgical extract)

## Why this source page exists

NCC 2022 Volume Two is the canonical regulation for Class 1 (and 10) buildings in Australia. Part H6 contains the energy efficiency performance requirements, verification methods, and Deemed-to-Satisfy (DtS) provisions. Specification 42 sets out the rules for using house energy rating software (NatHERS). Specification 44 contains the load limit calculations.

Without this source ingested, the bot was only able to answer outdoor living credit questions using the QDC overlay — it couldn't cite the underlying NCC clauses (S42C2(1)(b), S42C2(1)(c)) that the QDC references into. This page closes that gap.

## Part H6 — Energy efficiency (overview)

### Objectives (H6 Introduction)

The NCC 2022 Part H6 energy efficiency objectives are to:
(a) Reduce energy consumption of buildings (specifically heating, cooling, hot water, lighting)
(b) Reduce greenhouse gas emissions from energy consumption and energy source
(c) Improve occupant health and amenity by mitigating extreme weather + blackouts

### Performance Requirements

#### H6P1 — Thermal performance

(NCC 2022 ref: H6P1; was P2.6.1 in NCC 2019)

(1) The total **heating load** of habitable rooms and conditioned spaces must not exceed the heating load limit in **Specification 44**.
(2) The total **cooling load** must not exceed the cooling load limit in Specification 44.
(3) The total **thermal energy load** must not exceed the thermal energy load limit in Specification 44.

#### H6P2 — Energy usage

(NCC 2022 ref: H6P2; was P2.6.2 in NCC 2019)

(1) The energy value of a building's domestic services must not exceed **70%** of the energy value with:
   (a) a 3-star ducted heat pump heating all heated spaces (2019 GEMS); **and**
   (b) a 3-star ducted heat pump cooling all cooled spaces (2019 GEMS); **and**
   (c) a 5-star instantaneous gas water heater providing all hot water (2017 GEMS); **and**
   (d) a lighting power density of **4 W/m²** serving all internal artificially-lit spaces.

(2) Domestic services and their distribution systems must (to the degree necessary) have features that facilitate efficient energy use appropriate to:
   - the service and its usage
   - the geographic location of the building
   - the location of the domestic service
   - the energy source

### Verification Methods

#### H6V1 — Application of H6V2 and H6V3

The Verification Methods in Part H6 only apply to:
(a) A Class 1 building; and
(b) An enclosed Class 10a building attached to a Class 1 building.

**Note (Vic):** The H6V1 application clause has a state-specific Victorian variant — flagged in the source.

#### H6V2 — Verification using a reference building

(NCC 2022; was V2.6.2.2)

Compliance with H6P1 verified when the proposed building, compared to a reference building using a calculation method (other than house energy rating software):
- **CZ 1:** cooling load equal to or less than the reference
- **CZ 8:** heating load equal to or less than the reference
- **CZ 2–7:** both heating and cooling loads equal to or less than the reference

Plus compliance with specific Section 13 clauses for fabric insulation, thermal breaks, floor edge insulation, and building sealing.

**Reference building requirements (H6V2(3)):** the reference building must comply with the DtS provisions in Parts 13.2, 13.3, and 13.5 of the ABCB Housing Provisions.

**Calculation method requirements (H6V2(4)–(5)):** must comply with ANSI/ASHRAE Standard 140 and be capable of modelling fabric, glazing/shading, infiltration/ventilation, zoning, hours of operation, climatic features, and the sensible heat component. Climate data must be hourly recorded values representative of a typical year.

**Thermostat settings (H6V2(3)(p)–(q)):**
- Cooling: bedrooms 24°C; habitable rooms other than bedrooms — CZ 1–4: 27°C; CZ 5–8: 26°C
- Heating: 20°C all habitable rooms

**Heat gains (H6V2(3)(r)–(s)):**
- Occupant heat gain: 75 W/person in bedrooms; 105 W/person elsewhere
- Internal heat gains: appliances 450 W; lighting 4 W/m²
- Heating/cooling/occupancy/cooking schedules in Tables H6V2a, H6V2b, H6V2c, H6V2d (not captured here — see source PDF)

**Air infiltration rate (H6V2(3)(t)):** 0.75 ACH default; alternative formula if intended building air change rate at 50 Pa specified AND additional sealing provisions to Part 13.4 specified AND sealing verified via H6V3.

#### H6V3 — Verification of building envelope sealing

(NCC 2022; was V2.6.2.3)

(1) Compliance with H6P1 (sealing aspect) verified when the building envelope is sealed at an **air permeability of not more than 10 m³/hr.m² at 50 Pa** reference pressure when tested per **AS/NZS ISO 9972 Method 1**.

(2) Where **5 m³/hr.m²** is achieved instead, a mechanical ventilation system must be provided that:
   - Can be manually overridden
   - Provides outdoor air (continuous OR intermittent ≥ 25% of each 4-hour segment)
   - Provides minimum flow rate per the formula: `Q = 0.05·A + 3.5·N·p` where A = total floor area (m²), N = number of bedrooms, p = fraction of time operational
   - Plus solid-fuel appliances: permanent openings ≥ half the flue cross-section area
   - Plus gas-fuelled appliances: ventilation per AS/NZS 5601.1 clauses 6.4 and 6.4.5

**Note:** 10 m³/hr.m² at 50 Pa is broadly equivalent to 10 air changes per hour at 50 Pa for homes.

### Deemed-to-Satisfy Provisions

#### H6D1 — Deemed-to-Satisfy Provisions [New for 2022]

(1) Where a DtS Solution is proposed, H6P1 and H6P2 are satisfied by complying with **H6D2**.
(2) Where a Performance Solution is proposed, the relevant Performance Requirements must be determined per **A2G2(3)** and **A2G4(3)** as applicable.

#### H6D2 — Application of Part H6

(NCC 2022; was 3.12.0 in NCC 2019)

**(1) H6P1 (thermal performance) is satisfied by either:**
   (a) **Energy Rating pathway** — complying with **S42C2** (using house energy rating software) **and** **S42C4(1)**
   **— OR —**
   (b) **Elemental pathway** — complying with all of the following ABCB Housing Provisions:
      (i) Part 13.2 — building fabric
      (ii) Part 13.3 — external glazing and shading
      (iii) Part 13.4 — building sealing
      (iv) Part 13.5 — ceiling fans

**(2) H6P2 (energy usage) is satisfied by either:**
   (a) **Energy Rating pathway** — complying with **S42C3** (using house energy rating software) **and** **S42C4(2)**
   **— OR —**
   (b) **Elemental pathway** — complying with **Parts 13.6 and 13.7** of the ABCB Housing Provisions, for a building with a total floor area **not greater than 500 m²**

### Explanatory note: the two DtS pathways

> **Option 1 — Energy Rating:** Use Spec 42 to achieve heating/cooling load + net equivalent energy usage + other energy-saving features (thermal breaks, ceiling insulation loss compensation, floor edge insulation, building sealing).
>
> **Option 2 — Elemental Provisions:** Use Section 13 of the ABCB Housing Provisions to satisfy all the detailed provisions (fabric, glazing, sealing, ceiling fans, whole-of-home energy usage, services).

---

## Specification 42 — House energy rating software

### S42C1 — Scope

Specification 42 sets out the requirements for satisfying H6P1 and H6P2 using house energy rating software (NatHERS).

### S42C2 — Heating and cooling loads (THE KEY OUTDOOR LIVING CREDIT CLAUSE)

**(1) A building must achieve an energy rating, including the separate heating and cooling load limits, using house energy rating software, of greater than or equal to:**

| Pathway | Star rating | Conditions |
|---|---|---|
| **(a)** | **7 stars** | Default — no outdoor living credit applied |
| **(b)** | **6.5 stars** | **CZ 1 or 2 only.** Building has an outdoor living area as described in (3), fully covered with an impervious roof having a **Total R-Value ≥ 1.5** (downward heat flow) |
| **(c)** | **6 stars** | **CZ 1 or 2 only.** Building has an outdoor living area as described in (3) which: (i) is fully covered with an impervious roof having a **Total R-Value ≥ 1.5** (downward heat flow); **AND** (ii) **has at least one permanently installed ceiling fan** |

**This is why the ceiling fan matters:** without the fan, the credit caps at 0.5 stars (6.5★ instead of 7★). With the fan, the credit is the full 1 star (6★ instead of 7★).

**Climate zone scope at NCC level:** S42C2(1)(b) and (c) apply only in **CZ 1 or 2**. The QDC MP4.1 overlay in Queensland extends this to **CZ 1, 2, 3, or 5** — see [[src-qdc-mp4-1-sustainable-buildings]] A1(4). Outside Queensland, the outdoor living credit is only available in CZ 1 or 2 (tropical / sub-tropical northern Australia).

### S42C2(2) — Load limits

The heating and cooling load limits in (1) are specified in the **ABCB Standard for NatHERS Heating and Cooling Load Limits** (separate document, not ingested).

### S42C2(3) — Outdoor living area definition (Class 1 specifically)

For the purposes of (1)(b) and (1)(c), an outdoor living area is a space that:

**(a)** Is **directly adjoining, and directly accessible from**, a **general purpose living area** of a Class 1 building such as a lounge, kitchen, dining or family room. **NOT** a room for sleeping or specialist tasks such as a study or home theatre.
**(b)** Has a floor area **≥ 12.0 m²**
**(c)** Has **length and width dimensions ≥ 2.5 m each**
**(d)** Has an **opening height above floor level ≥ 2.1 m**

> **Explanatory note (important):** The 2.1 m opening height in (d) is a **breeze path height** — likely measured from the floor to the underside of a perimeter beam. **It is NOT a ceiling height measurement. It is NOT a fan mounting height or fan blade height.** These dimensions need to be determined considering activities in the space, occupant safety, and applicable safety standards.

**(e)** Has **one side permanently open with a second side either:**
   (i) permanently open; **or**
   (ii) **readily openable**.

### S42C2(4) — Side clearance

The sides referred to in (3)(e) must be **≥ 900 mm from an allotment boundary** or **≥ 900 mm from an obstruction to the breeze path** such as a building, fence, or other structure.

### S42C2(5) — Ceiling fan requirements (for the 1-star credit)

Where a ceiling fan is required as part of compliance with (1)(c), the fan must:
(a) Be **permanently installed**
(b) Have a **speed controller**
(c) Serve the **whole room**, with the floor area that a single fan serves not exceeding:
   (i) **15 m²** if it has a blade rotation diameter **< 1200 mm**
   (ii) **25 m²** if it has a blade rotation diameter **≥ 1200 mm**

### S42C2 Explanatory note — outdoor living areas

> There is some survey evidence that suggests the majority of home owners turn off their air-conditioners when using an outdoor living area. Another cost-effective option is to install a **reed switch or other micro switch on the door** leading to the outdoor living area in order to automatically deactivate an air-conditioning unit when the door is left open for a period which allows occupants to enter and leave the air-conditioned space but does not affect the operation of the air-conditioner.

> A side referred to in (3)(e) may contain some obstructions such as columns and barriers. Where an open side is required to have a 1 m barrier, consideration as to the type (wire, solid, or other) should be made with regard to the overall opening area of the two sides.

### S42C3 — Net equivalent energy usage [New for 2022]

A building must achieve a **whole-of-home rating of not less than 60** using house energy rating software.

### S42C4 — Additional DtS provisions when using house energy rating software

**(1) To comply with H6P1 (in addition to S42C2):** building must comply with **Section 13 of the ABCB Housing Provisions**, specifically:
(a) **13.2.2** — building fabric thermal insulation
(b) **13.2.3(7)** and **13.2.5(5)** — thermal breaks
(c) **13.2.3(5)** — compensating for a loss of ceiling insulation (except where the house energy rating software has already compensated for the loss)
(d) **13.2.6(4), 13.2.6(5), 13.2.6(6)** — floor edge insulation
(e) **Part 13.4** — building sealing

**(2) To comply with H6P2 (in addition to S42C3):** building must comply with **Part 13.7 of the ABCB Housing Provisions**.

---

## Specification 44 — Calculation of heating/cooling/thermal energy load limits

### S44C1 — Scope

Specification 44 contains the calculation methods for heating load limit (HLL), cooling load limit (CLL), and thermal energy load limit (TLL) for compliance with **H6P1** (and J1P2 in Vol 1 commercial).

### S44C2 — Heating load limit

`HLL = greater of: 4 OR ([formula involving HDH + FH])` MJ/m².annum

Where:
- HDH = total annual heating degree hours of the building location
- FH = area adjustment factor (Table S44C2)

**Area adjustment factors (Table S44C2):**

| Habitable room area (AH) | Factor FH |
|---|---|
| ≤ 50 m² | 1.37 |
| > 50 m² to ≤ 350 m² | (sliding scale formula, see PDF) |
| > 350 m² | 0.84 |

### S44C3 — Cooling load limit

`CLL = 4·(0.0617·CDH + 0.85·DGH)·FC` MJ/m².annum

Where:
- CDH = total annual cooling degree hours
- DGH = total annual dehumidification gram hours
- FC = area adjustment factor (Table S44C3)

**Area adjustment factors (Table S44C3):**

| Habitable room area (AH) | Factor FC |
|---|---|
| ≤ 50 m² | 1.34 |
| > 50 m² and ≤ 200 m² | (sliding scale formula) |
| > 200 m² and ≤ 1000 m² | (sliding scale formula) |
| > 1000 m² | 0.71 |

### S44C4 — Thermal energy load limit

`TLL = 1.93·HLL + 2.26·CLL + 84.15·(Tr − 7.4) / 10` MJ/m².annum

Where:
- HLL = heating load limit (from S44C2)
- CLL = cooling load limit (from S44C3)
- Tr = annual average daily outdoor temperature range

> **Note:** These formulae are transcribed from the PDF — the source has some OCR noise around the operators. Confirm against the PDF directly before applying. The published ABCB Standard for NatHERS Heating and Cooling Load Limits is the authoritative source for the underlying climate data inputs (HDH, CDH, DGH, Tr) for each NCC climate zone.

---

## Cross-references to the ABCB Housing Provisions (not yet ingested)

The DtS provisions in H6D2 and the additional requirements in S42C4 reference into **Section 13 of the ABCB Housing Provisions** — this is a SEPARATE document (not yet in the wiki). The relevant parts:

| Part | Subject |
|---|---|
| **13.2** | Building fabric (insulation, thermal breaks, floor edge) |
| **13.3** | External glazing and shading |
| **13.4** | Building sealing |
| **13.5** | Ceiling fans |
| **13.6** | Energy usage — services |
| **13.7** | Whole-of-home energy usage (regulated services + WoH calculation) |

Specific clauses repeatedly referenced:
- **13.2.2** — fabric thermal insulation
- **13.2.3(5)** — ceiling insulation loss compensation
- **13.2.3(7), 13.2.5(5)** — thermal breaks
- **13.2.6(4), 13.2.6(5), 13.2.6(6), 13.2.6(7)** — floor edge insulation
- **Part 13.4** — building sealing (referenced in H6V2, H6V3, S42C4)
- **Part 13.7** — whole-of-home (referenced in H6D2 and S42C4)

**Next ingest priority:** the ABCB Housing Provisions document (in the source catalog as `Z - NCC/ncc2022-housing-provisions-2022-20230501.pdf`) — this is what closes the loop on Section 13 references.

---

## Practical implications

### For an outdoor living credit query (Class 1)

**The bot can now answer this with NCC-level clause precision:**

1. **Climate zone check** — NCC limits S42C2(1)(b) and (c) to CZ 1 or 2 only. In QLD, the QDC overlay extends this to CZ 1, 2, 3, 5.
2. **Outdoor living area criteria** — S42C2(3): adjoining and accessible from a general living area; ≥12 m² floor area; ≥2.5 m each dimension; **≥2.1 m opening height (breeze path, not ceiling)**; one side permanently open + second side open or readily openable.
3. **Side clearance** — S42C2(4): ≥900 mm from boundary or obstruction.
4. **Roof requirement (for 0.5 star credit at 6.5★)** — fully covered by impervious roof with Total R-Value ≥ 1.5 (downward heat flow).
5. **Roof + ceiling fan (for 1 star credit at 6★)** — same impervious roof R≥1.5, plus at least one permanently installed ceiling fan.
6. **Fan requirements** — S42C2(5): permanent, speed-controlled, serves whole room, size limited to 15 m² (blade <1200 mm) or 25 m² (blade ≥1200 mm).
7. **AC interaction** — explanatory note recommends reed/micro switch on the external door to auto-deactivate the AC when the door is held open. This becomes mandatory in QLD Class 2 buildings per QDC A2(4) — see [[src-qdc-mp4-1-sustainable-buildings]].

### For a DtS pathway decision

Choosing between Energy Rating (S42 + software) and Elemental Provisions (Section 13 ABCB Housing Provisions) depends on building complexity, software availability, and the specific project's load profile. Energy Rating is more flexible; Elemental Provisions is faster for simple builds within the 500 m² floor area cap.

### For verification using non-NatHERS calc tools

H6V2 allows ANSI/ASHRAE 140-compliant tools to verify H6P1 via reference building comparison. This is a Performance Solution pathway — useful when software-rating doesn't capture the project's design accurately (e.g. unusual envelope configurations).

---

## Caveats

- **This is a surgical extract** — only Part H6, Specification 42, and Specification 44 of NCC 2022 Vol 2 are captured. The full PDF is ~700+ pages and covers all of Class 1 + Class 10 building requirements: structure, fire safety, plumbing, lighting, accessibility, ventilation, glazing, weatherproofing, ancillary provisions, alpine + bushfire areas, livable housing, energy efficiency. Other parts must be ingested separately as questions surface.
- **State variations exist** — H6V1 (Vic), H6V2 (NSW), and H6D2 (Vic) have state-specific variants noted in the source. Not all variants are captured here. Confirm against the state-specific NCC adoption before applying.
- **Cross-referenced documents not ingested:**
  - ABCB Housing Provisions (Section 13) — separate document
  - ABCB Standard for NatHERS Heating and Cooling Load Limits — separate standard
  - AS/NZS ISO 9972 (sealing test methods) — separate standard
  - AS/NZS 5601.1 (gas appliance ventilation) — separate standard
- **Specification 44 formulae** — transcribed from PDF with some OCR noise on the operators. Confirm against the source PDF before applying in client work.
- **Source date:** 1 May 2023. NCC 2022 Amendment 1 has been published since — check `Z - NCC/NCC 2022 Amdt 1 v1.1.pdf` for any superseding clauses.

## Cross-references

- [[../sources/src-qdc-mp4-1-sustainable-buildings]] — Queensland overlay (extends CZ scope, parallels credit structure, adds AC auto-shutdown rule for Class 2)
- [[../sources/src-outdoor-living-credit-ncc-2022]] — earlier ingest of the outdoor living area definition (PNG snippet) — now superseded by S42C2(3) above
- [[../sources/src-ee-04-alterations-ncc-2022]] — Victorian alterations PN, which references H6P1, H6P2, H6D2 throughout
- [[../sources/src-woh-guidance-note-2024]] — WoH guidance — H6P2 is the Whole-of-Home performance requirement
- [[../concepts/nathers]] — NatHERS scheme overview
- [[../concepts/7-star-rating]] — the 7-star NCC 2022 thermal minimum
- [[../concepts/ncc]] — NCC framework overview
- [[../concepts/spec-44]] — Specification 44 performance solutions
- [[../concepts/whole-of-home]] — WoH framework (H6P2)
- [[../concepts/alterations-existing-dwellings]] — alterations regime
