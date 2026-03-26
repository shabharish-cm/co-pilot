# Research: Talent Management — Talent Pool

---

## Problem Framing

Talent Pool is the **third sub-module** in CultureMonkey's Talent Management suite, alongside Skill Gap Analysis and 9-Box Grid. Where Skill Gap Analysis answers *"where are our competency gaps?"* and 9-Box Grid answers *"how do we classify performance vs. potential?"*, Talent Pool answers *"who is ready and willing to move — and where?"*

The core job: HR sends a structured survey to the employee base to capture **internal mobility intent** — willingness to relocate, interest in promotion, future career goals, and similar signals. Responses populate a **searchable, filterable Talent Pool dashboard** that HR can use to identify internal candidates for open roles, plan succession, and avoid external hires where internal talent exists.

**Critical architectural decision:** Like Skill Gap Analysis, Talent Pool is a **standalone module** — it is not a standard CultureMonkey survey. The survey input mechanism is purpose-built for this use case (branching/conditional questions, free text + structured response types), and the output is a directional **talent profile view**, not an engagement report.

**Relationship to Skill Gap Analysis:** These two sub-modules are complementary.
- Skill Gap Analysis gives HR *objective* data: what skills does this employee have vs. what does the role require?
- Talent Pool gives HR *intent* data: is this employee willing to take on a new role, relocate, or pursue growth?
- Together, they form the foundation of an internal mobility decision: *can they do it? do they want to?*

---

## Evidence from Customer

**Source:** Discovery discussion (2026-03-17) — `PRDs/talent-management-skill-gap-analysis/Alumil - Discussion on Mar 17th.md`
**Source:** TAM notes — `context/customers/Alumil/notes.md` (2026-03-24)

### Confirmed Requirements from Discovery

- **Survey-based capture:** HR sends a dedicated survey to employees (not managers) to collect mobility intent signals.
- **Question types required:**
  - Free text: skills, future goals, career aspirations
  - Single-select Yes/No: e.g., "Are you willing to relocate?"
  - Conditional/branching follow-up: if "No" to relocation, employee can provide reasons (HR can view these)
  - Multi-select options also requested
- **Dashboard:** A separate Talent Pool dashboard where HR can filter and search employees by skills, relocation willingness, promotion readiness, and other captured dimensions.
- **Export:** Filtered views should be exportable (format TBD — likely CSV/XLSX based on patterns from Skill Gap Analysis module).
- **Survey must support dynamic/branching logic** — standard CultureMonkey survey builder is insufficient for this.

### Strategic Objectives from Alumil

- Identifies talent and future leaders
- Develops talent and minimizes recruitment costs
- Promotes progression and growth / increases employee retention
- Establishes knowledge sharing and strategic skill development

### Key Open Question Inherited from Discovery

The Alumil discovery doc described this as a *survey sent by HR to employees* — but does not specify:
- Whether employees fill this survey periodically or once (is it a recurring cycle like Skill Gap Assessment?)
- Whether manager input is also part of the Talent Pool (manager nominates employee vs. employee self-nominates)
- Whether the Talent Pool dashboard cross-references Skill Gap Analysis data (e.g., filter by "below benchmark on Leadership" + "willing to relocate")

---

## Evidence from Transcripts

**No transcript signal found** — search across all `pulse/normalized/*.json` files returned no matches for "talent pool", "internal mobility", "succession", or "relocation willingness".

This is expected: the Talent Pool request came via a specific Alumil-sourced TAM session, not from a broad call scan. The customer evidence base is TAM notes + discovery discussion only.

---

## Evidence from Public Discussions

### Industry Adoption Signal

- 86% of HR leaders said internal mobility is a priority (iCIMS, 2024).
- Employees in high-mobility organizations stay an average of **5.4 years** vs. **2.9 years** in low-mobility orgs — a near 2× retention lift.
- **49% of employees** are open to relocation (up +3 points year-over-year), but the same percentage say nothing would convince them to move — underscoring why capturing this intent as data matters before making role offers.

### Key Obstacles HR Faces Without a Talent Pool Tool

1. **Lack of visibility** — employees don't know about internal opportunities; managers hesitate to lose their best performers to other teams.
2. **No structured intent data** — decisions are made on anecdote and informal manager conversations; there is no HR-level aggregated view of who is available and willing.
3. **Rigid role structures** — without a formal pool, lateral moves and gig assignments are not tracked or encouraged.

---

## Competitor Patterns

| Platform | Talent Pool / Internal Mobility Approach | Relevant Pattern |
|---|---|---|
| **SAP SuccessFactors** | AI-driven talent discovery with dynamic pools; pools continuously updated and segmented by skills, roles, engagement history; Talent Intelligence Hub for skill-based development | Pool segmentation by multiple dimensions; always-fresh data |
| **Workday** | "Talent Marketplace" — matches employees to internal projects, gigs, and new roles; surfaces internal candidates for open roles before going external | Marketplace metaphor; opportunity matching against profile |
| **Lattice** | HRIS-grade: performance + career development path tracking; AI surfaces top performers and tailors development strategies | Performance + development path linkage |
| **Gloat** | Dedicated Internal Talent Marketplace — AI matches employees to gigs, mentorships, projects, and full roles based on skills and declared interests | Closest analog to Alumil's ask: declared intent + skills = matches |
| **SuccessionHR** | Succession planning with talent pool readiness indicators and role-based filtering | Readiness scoring + role assignment planning |

### Patterns to Adopt

- **Survey-captured intent as pool inputs** (unique to Alumil's ask vs. enterprise platforms that rely on structured HRIS profiles): build the pool from survey responses, not from HR-manually-entered profiles.
- **Filterable dashboard as primary output:** Segment-filtered employee list — by willingness to relocate, promotion readiness, department, role, tenure — is the core HR workflow, not a marketplace feed.
- **Skill Gap Analysis cross-reference:** The most powerful pattern is linking intent data (Talent Pool) with competency data (Skill Gap Analysis) — "Show me employees who are willing to take a leadership role AND are above benchmark on People Management." This is the V2 north star.
- **Branching survey logic:** Conditional follow-up questions (e.g., "Why not willing to relocate?") surface qualitative signal that makes the pool data actionable, not just directional.

### Patterns to Avoid

- **Marketplace/opportunity-matching** (Workday/Gloat model): too complex for V1; Alumil's ask is simpler — capture signals, show them in a dashboard. Don't build a full opportunity posting engine.
- **AI-generated profiles:** SAP SuccessFactors relies on AI to build and update talent profiles continuously. Alumil's model is explicit survey-triggered cycles — do not introduce inferred/AI-generated talent scores in V1.
- **Employee-facing browsing interface:** Talent Pool in V1 is HR-facing only. Employees fill a survey; HR uses the results. Don't expose a browsing UI to employees.

---

## Recurring Complaints or Workarounds

| Current Workaround | Pain |
|---|---|
| Informal manager conversations | Not captured in any system; invisible to HR; biased toward vocal employees |
| Ad-hoc surveys built inside CultureMonkey's standard survey builder | No branching logic support; no Talent Pool output view; data lands in engagement reporting, not a searchable employee pool |
| Excel-tracked lists of "high potential" employees | Manual, not updated regularly, no link to skills data, no structured intent capture |

---

## Architectural Considerations (V1)

**Relationship to Skill Gap Analysis data model:**

| Sub-module | Data type | Update cadence | Primary actor |
|---|---|---|---|
| Skill Gap Analysis | Competency ratings per employee per skill | Periodic assessment cycles | Manager fills for direct reports |
| Talent Pool | Intent/preference signals per employee | Survey-triggered (HR-initiated) | Employee self-reports |
| 9-Box Grid | Performance vs. potential positioning | Admin-configured formula | Admin / Manager |

These three share the same employee directory but have **separate data stores and separate views**. The long-term integration pattern (V2+) is a unified employee talent profile that surfaces all three dimensions together.

**Survey design for Talent Pool specifically requires:**
- Branching/conditional question logic (not available in current CM survey builder — must be built new or extended)
- Response types: free text, single-select, multi-select (all standard), plus conditional follow-up blocks
- Survey is HR-initiated (admin sends), employee-completed — not manager-assessed

---

## Confidence Rating

**Medium**

**Reasoning:**
- Customer requirement is confirmed: TAM notes + discovery discussion both document Talent Pool as the third Talent Management sub-module.
- High-level shape is clear: survey-based capture + filterable dashboard + export.
- Capped at Medium because:
  - Branching logic requirement is confirmed but implementation approach is undefined
  - Cross-referencing with Skill Gap Analysis data is implied but not explicitly scoped for V1
  - Recurring cycle vs. one-time survey cadence is not confirmed
  - Whether manager nominates vs. employee self-nominates is not confirmed
  - Exact dashboard filter dimensions beyond "skills" and "relocation" are TBD

---

## Open Questions

1. **Cadence:** Is the Talent Pool survey a one-time exercise or a recurring cycle (e.g., annual)? Should historical responses be tracked like Skill Gap Assessment cycles?
2. **Initiator:** Employee self-reports only, or can managers also nominate/flag employees for the talent pool?
3. **Dashboard cross-reference:** Does V1 allow HR to filter the Talent Pool dashboard by Skill Gap Analysis results (e.g., "above benchmark on Leadership" + "willing to relocate")? Or are these dashboards fully separate in V1?
4. **Branching logic scope:** Is the branching requirement limited to the relocation question, or is full conditional logic needed across all question types?
5. **Employee anonymity:** Are Talent Pool responses anonymous or attributed? (Context: employees declaring willingness/unwillingness for promotions is sensitive — this likely needs to be attributed for HR utility, but may create psychological barriers.)
6. **Export format:** CSV/XLSX as per Skill Gap Analysis precedent, or does the talent pool view need a different export structure?
7. **Visibility to managers:** Can a manager see their direct reports' Talent Pool responses, or is this HR-only?
8. **Skill data input:** Are the "skills" in the Talent Pool dashboard filter sourced from the Skill Gap Analysis skills library, or is this a separate free-text/tag-based input from the survey itself?

---

*Research created: 2026-03-26 | Evidence basis: customer-confirmed (TAM notes + discovery doc) + public research*

**Sources:**

- Customer discovery notes: `PRDs/talent-management-skill-gap-analysis/Alumil - Discussion on Mar 17th.md`
- Customer account notes: `context/customers/Alumil/notes.md`
- Related sub-module research: `PRDs/talent-management-skill-gap-analysis/research.md`
- [Top 10 Talent Pool Management Software for 2026 | PMaps](https://www.pmapstest.com/blog/best-talent-pool-management-software)
- [Internal Talent Marketplace: Benefits & Best Practices | Gloat](https://gloat.com/blog/internal-talent-marketplace-implementation/)
- [What Is Talent Pool Management? A Practical Guide for HR | AIHR](https://www.aihr.com/blog/talent-pool-management/)
- [Talent Mobility Programs 2025 | HR.com](https://www.hr.com/en/resources/free_research_white_papers/talent-mobility-programs-2025_mbkjnda4.html)
- [Talent Mobility: Strategies, Benefits, and Implementation | Workhuman Live](https://www.workhumanlive.com/blog/talent-mobility/)
- [SAP SuccessFactors Talent Management](https://www.sap.com/products/hcm/talent-management.html)
- [4 best practices for creating an internal talent marketplace | TechTarget](https://www.techtarget.com/searchhrsoftware/feature/4-best-practices-for-creating-an-internal-talent-marketplace)
