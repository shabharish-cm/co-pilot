# Research: Talent Management — Skill Gap Analysis

---

## Problem Framing

Alumil — an enterprise manufacturing customer — has requested a **Talent Management module** as a formal product expansion. The **Skill Gap Analysis** sub-module is the first pillar of this module.

The core job: managers assess where each of their **direct reports** stands on a defined set of competencies, compare that against role-based benchmarks, and surface gaps for development planning. Today this is done in spreadsheets (Alumil shared an Excel template as their current workaround). The ask is to bring this natively into CultureMonkey.

**Critical architectural decision:** Talent Management is a **standalone module** — it does not reuse CultureMonkey's existing survey infrastructure, Drivers architecture, or engagement survey workflows. This is a purpose-built competency management tool with its own data model, input flows, and reporting layer.

---

## Evidence from Customer

**Source:** TAM-sourced notes (2026-03-19), discovery discussion (2026-03-17), and customer-shared template (`Skills-Gap-Analysis_example.xlsx`).

### Customer-Shared Data Model (Canonical Reference)

From the Alumil template — this is the V1 data model:


| Field                    | Description                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| **Skill / Competency**   | Name of the skill (e.g., Business Acumen, EQ, People Management) |
| **Skill Description**    | Text description of what the skill covers                        |
| **Skill Importance**     | 1–5 rating — how critical this skill is for the role             |
| **Skill Level Required** | 1–5 rating — the benchmark/target proficiency for the role       |


**Importance scale:** 1 = Not Important → 5 = Critically Important
**Level scale:** 1 = Novice → 5 = Expert

This data is **uploaded by the admin** and locked in V1 — no in-product editing of skills or benchmarks in this release.

### Confirmed Requirements from Discovery (2026-03-17)

- Manager fills in skill ratings for each employee — not self-assessed by employees
- Managers can only assess their **direct reports** — no access to indirect reportees
- Output needed: **heatmap** view and **raw data** view
- Benchmarks are per-skill (importance + required level) — not per-individual
- Strategic objectives: identify leaders, address competency gaps, develop employees, reduce recruitment cost

---

## Decided Constraints (V1 Scope)


| Decision                          | Detail                                                                             |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| **Input method**                  | Uploaded data (CSV/Excel from admin) — no in-product skill/benchmark editing in V1 |
| **Who rates**                     | Manager only — assesses direct reports only                                        |
| **Indirect reportees**            | Not accessible — manager sees only their direct team                               |
| **Edit skill/benchmark config**   | Out of scope for V1. Stick to uploaded data as-is                                  |
| **Module independence**           | Standalone — no reuse of Drivers, survey builder, or engagement survey modules     |
| **Benchmark editing post-upload** | Not in V1                                                                          |


---

## Persona Access Model


| Persona              | Access                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------ |
| **Super Admin**      | Full view across all teams, all managers, all employees. Can view any manager's submitted assessments. |
| **Sub Admin / HRBP** | Scoped view based on hierarchy/assignment. Exact scope TBD.                                            |
| **Manager**          | View and fill ratings for direct reports only. Can edit their own previously submitted responses.      |


**Edge case flagged:** A Super Admin may also be a manager (i.e., has direct reports). In this case, their Super Admin view must not expose their own manager-role editing to other admins inappropriately. Only the manager who submitted an assessment should be able to edit it — not other Super Admins editing on their behalf.

---

## What Exists in CM Today (Applicable)


| Capability                                                     | Relevance                                                  |
| -------------------------------------------------------------- | ---------------------------------------------------------- |
| Persona-based access control (Admin, Sub-Admin, Manager, HRBP) | Access model can be extended — not rebuilt                 |
| Heatmap visualization                                          | Core CM strength; can be adapted for skill × employee grid |
| Multi-segment analytics                                        | Dept, location, manager filtering applicable               |
| Employee directory / org hierarchy                             | Manager ↔ direct report relationships already tracked      |


**What does NOT exist and must be built new:**

- Standalone skill registry (outside of survey Drivers)
- Manager-fills-ratings-for-employee input flow
- Benchmark/target score configuration from uploaded file
- Individual employee competency view with gap overlay
- Skill × employee heatmap (distinct from engagement heatmap)

---

## Competitor Patterns (Relevant to V1 Scope)


| Platform        | Relevant Pattern                                                                      |
| --------------- | ------------------------------------------------------------------------------------- |
| **Lattice**     | Role-based competency targets; manager fills ratings; delta (gap) shown visually      |
| **15Five**      | Skill heatmaps per team; benchmarking against role expectations                       |
| **Skills Base** | Live heatmaps, role-based targets, gap scoring — closest analog to what's being built |
| **Culture Amp** | Competency reviews manager-driven; development goals linked to gaps                   |


**Patterns to adopt:**

- Skills Base — **team (employees) × skill heatmap** as the primary reporting view
- Lattice — **manager input form** per employee, simple and fast
- Skills Base — **gap = Required Level − Actual Level**, weighted optionally by Importance

**Patterns to avoid:**

- Self-assessment flows (not in scope — Alumil model is manager-assessed only)
- Complex taxonomy / skills library browsing (V1 is upload-defined)
- Building skill management inside the Survey Builder (module must be independent)

---

## Workarounds Being Replaced


| Current Workaround                          | Pain                                                                                      |
| ------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Excel template (customer-shared)            | No heatmap, manual aggregation, no role-based access control, no tracking over time       |
| QR survey approach (explored as workaround) | Clunky — survey wrapper is wrong UX for manager-assessed competency data; being abandoned |


---

## Open Questions

1. **Upload format:** Is CSV the accepted upload format, or does the admin paste/type into a structured form? What happens if the upload has validation errors?

Answer: CSV is good. A sample/template can be created and downloaded for the user.   
2. **Skill set scope:** Is one skill set applied platform-wide, or can different skill sets be defined per team/department? The Alumil template is per-team — is multi-set needed in V1?  
Answer: Super Admins can be allowed to create skills and assign them to teams. One skill can be assigned to multiple teams. Team manager can create a new skill, but by default is assigned to their team only.   
3. **Manager edit:** Once a manager submits ratings for a direct report, can they edit? If yes, is there a version history or audit trail? *(Super Admin / manager role overlap edge case applies here.)*  
Answer: There should be audit trail for the edits, even super admins and sub admins can edit but should have trail.  
4. **Heatmap design:** Primary heatmap axis — is it **employee × skill** (one row per person) or **team aggregate × skill**? Both views may be needed at different personas.  
Answer: it is employee x skill, also include column for employee's role and Overall Skill Level(Average). Heatmap filters are necessary and in alignment with survey heatmap filters. If you don't know the existing filters, ask.  
5. **Gap calculation display:** Show raw score only, or show gap (Required − Actual) with color coding? Is Skill Importance used to weight the gap visual?  
Answer:   
6. **Historical snapshots:** Is V1 a single point-in-time assessment, or should the system support quarterly re-assessments with trend tracking?  
Answer: Should support periodic assessment with history  
7. **Sub Admin / HRBP scope:** Exactly which part of the org hierarchy can an HRBP see? Is this configured at account level or tied to their assigned segments?  
Answer: HRBPs can be super admins or subadmins and their data scope will be defined in the product (account level), so the same should follow.  
8. **Export:** CSV raw data export is assumed. Is a visual heatmap export (PDF) needed in V1?  
Answer: CSV/xlsx raw data for now.  
9. **GDPR / data handling:** Skill assessments contain individually identifiable performance data. Does Alumil (Greece/EU) require any consent or data retention policy distinct from engagement surveys?  
Answer: This is already compliant in the product, as we store employee data already. Remember, CultureMonkey is SoC2 and ISO 27001 compliant  
10. **9-Box integration:** Does skill score data feed into the 9-Box performance axis, or are the two sub-modules fully independent in V1?  
Answer: As an extension of this feature 9 box grid **Performance Management** will be built in the platform itself, a separate PRD.

**Important note** 
- This Talentmanagement is a separate module in the platform and should not use exsitng survey features.

## Confidence Rating

**Medium-High**

**Reasoning:**

- Customer requirement is directly confirmed: TAM notes + customer-shared template + discovery discussion
- V1 scope constraints are clearly defined (upload-only, manager-direct-reports-only, no edit)
- Capped at Medium-High because: exact UX for the input form is not yet designed, persona access rules for HRBP/Sub Admin need final confirmation, heatmap axis design needs validation

---

*Research updated: 2026-03-24 | Evidence basis: customer-confirmed (TAM notes + template + discovery doc)*

**Sources:**

- Customer template: `Skills-Gap-Analysis_example.xlsx - Key Skills & Competencies.csv`
- Discovery notes: `PRDs/talent-management-skill-gap-analysis/Alumil - Discussion on Mar 17th.md`
- Customer account notes: `context/customers/Alumil/notes.md`
- [Skills Gap Analysis Tool | Skills Base](https://www.skills-base.com/skills-gap-analysis-tool)
- [10 Best Skills Intelligence Platforms in 2026 | CloudAssess](https://cloudassess.com/blog/best-skills-intelligence-platforms/)
- [A Better Way To Do a Skills Gap Analysis | Capterra](https://www.capterra.com/resources/skills-gap-analysis/)

