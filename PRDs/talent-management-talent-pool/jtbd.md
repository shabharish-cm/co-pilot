# JTBD: Talent Management — Talent Pool

*Generated: 2026-03-26 | Evidence basis: customer-confirmed (TAM notes + Alumil discovery doc) + HR community pain point sweep (research.md)*

---

### 👤 User Persona & Context

- **Who they are:** An HR Manager or HRBP at a mid-to-large enterprise (primary signal: Alumil). Responsible for talent planning, internal mobility, and succession readiness. Operates with limited tooling — a standard HRIS for employment records and CultureMonkey for engagement surveys — and has no structured system to capture or query employee career intent. Makes talent decisions manually through manager conversations, ad-hoc spreadsheets, and annual performance review data.
- **Primary Goal:** Know who in the organization is willing and ready to move — so internal talent can be matched to open roles, succession gaps, and leadership pipelines before external hiring starts.

---

### 🎯 Core Jobs To Be Done (JTBD)

**Job 1: Capture Structured Career Intent From Employees**

- **Statement:** When *I need to fill a role internally or plan for a future leadership gap*, I want to *collect structured, filterable data on each employee's willingness to relocate, interest in promotion, and career aspirations*, so I can *build an accurate picture of who is available and willing — before a role becomes urgent*.
- **Type:** Functional
- **Current Workaround:** Annual performance review "career goals" free-text field. Informal manager conversations. Ad-hoc CultureMonkey surveys that dump data into engagement reporting with no talent pool output view.
- **Pain Points (The "Push"):**
  - Career goals are captured once a year as free text — not filterable, not aggregated at org level, only visible to the direct manager.
  - Standard CM survey builder has no branching logic — can't ask "Why not willing to relocate?" as a follow-up to "No."
  - Data collected via engagement surveys doesn't produce a searchable employee pool.
- **Supporting Quote:** *"Only 24.8% of organizations have implemented a formal career development process; 56.4% rely on informal or casual approaches." (SHRM) — confirmed by Alumil's specific ask for a purpose-built survey mechanism.*

---

**Job 2: Find Internal Candidates Instantly Without Manual Research**

- **Statement:** When *a role opens or a succession gap needs to be filled*, I want to *query the employee base by mobility signals — relocation willingness, promotion readiness, department, tenure — and get a filtered shortlist immediately*, so I can *identify internal candidates before defaulting to an external hire*.
- **Type:** Functional
- **Current Workaround:** Manual cross-referencing of HRIS records, performance reviews, and manager conversations. HR teams resort to searching LinkedIn to understand their own employees' current skills because internal HRIS data is less current than public profiles.
- **Pain Points (The "Push"):**
  - HR cannot answer basic questions like "Which employees in Operations are ready for a step-up role and willing to relocate?" without a multi-day manual effort.
  - Excel-based talent lists are not updated regularly and have no link to skills data.
  - No system consolidates intent, competency, and performance in a single queryable view.
- **Supporting Quote:** *"HR professionals resort to LinkedIn to assess their own employees' skills." (Gloat) — "Fewer than 1 in 4 organizations possess a consolidated workforce capability view." (Darwinbox/Skillsoft 2025)*

---

**Job 3: Keep Talent Signals Fresh So Decisions Reflect Current Reality**

- **Statement:** When *employee circumstances change — new skills acquired, family situation shifts, career ambitions evolve — I want to re-survey the talent pool on demand*, so I can *make mobility and succession decisions based on current intent, not year-old or onboarding-era data*.
- **Type:** Functional
- **Current Workaround:** No mechanism exists to refresh talent data. Profiles are last updated at hire or annual review. Data decays within 18 months. HR has no trigger or process to re-ask employees about career intent.
- **Pain Points (The "Push"):**
  - "Talent pools can become stale without regular updates. Outdated profiles or inactive candidates waste time and frustrate hiring teams." (AIHR)
  - Employees don't self-update because they see no proof the data is ever used.
  - The circular failure: HR can't use the pool because data is stale; employees don't update because they never see it acted upon.
- **Supporting Quote:** *"Without a governance process, your skills graph will become stale within 18 months." (JobsPikr) — Alumil confirmed this survey should be admin-triggered on demand, not self-refreshed.*

---

**Job 4: Surface Talent Without Relying on Manager Nomination**

- **Statement:** When *identifying candidates for succession or HIPO programs*, I want to *use self-declared employee intent data as a signal alongside manager assessments*, so I can *reduce the bias introduced by manager nomination and avoid overlooking employees who are less visible but genuinely ready and willing*.
- **Type:** Emotional + Social
- **Current Workaround:** Manager nomination drives HIPO and succession decisions. High performers get labeled HIPO regardless of future potential; introverted or non-proximate employees are systematically missed. No HR-level aggregated view of who has declared interest in advancement.
- **Pain Points (The "Push"):**
  - "70% of talent acquisition professionals say the main barrier to internal mobility is a manager who doesn't want to let good talent leave their team." (TestGorilla)
  - "More than 40% of employees designated as HIPOs are below average for leadership effectiveness." (Zenger Folkman/HBR) — because designation reflects relationship proximity, not actual potential.
  - "A 2022 study revealed that women receive substantially lower 'potential' ratings than men, despite receiving higher job performance ratings." (Culture Amp) — bias is documented and structural.
- **Supporting Quote:** *"Without rigorous and objective criteria, managers perceive employees who look and act like current leadership as having the greatest leadership potential." (AIHR)*

---

### 💡 Feature Opportunities & Implications

- **Opportunity 1 — Branching Survey Engine:** Build a purpose-built survey experience for Talent Pool that supports conditional/branching logic (e.g., if "No" to relocation → surface a follow-up "Why?" block). This is architecturally separate from the standard CM survey builder and is required even for V1 — without it, the relocation intent data is directional but not actionable. The branch responses (qualitative reasons) are what make HR decisions defensible.
- **Opportunity 2 — Filterable Talent Pool Dashboard:** The primary HR output is not a report — it's a live, filterable employee list. Key filter dimensions from research: relocation willingness (Yes/No/Conditionally), promotion readiness, career track interest, department, tenure, and location. Export (CSV/XLSX) is a table-stakes companion to the dashboard for presentation and offline use.
- **Opportunity 3 — Admin-Triggered Refresh Cycles:** HR initiates survey campaigns on demand, not on a fixed schedule (confirmed by Alumil). Each campaign creates a new snapshot of intent data. The system should retain prior-cycle data so HR can see if employee intent has changed (e.g., previously unwilling to relocate, now open). This directly solves the "data graveyard" failure mode.
- **Opportunity 4 — Visibility Closing the Loop (V2):** To break the circular failure where employees don't update profiles because they never see data used — consider a lightweight notification to employees when their pool profile was accessed or contributed to a shortlist. This is a V2 trust-building mechanism, not a V1 requirement.
- **Opportunity 5 — Cross-Reference with Skill Gap Analysis (V2):** The highest-value query HR can run is the intersection: "willing to take a leadership role" (Talent Pool intent) + "above benchmark on People Management" (Skill Gap Analysis competency). V1 keeps dashboards separate; V2 should enable combined filtering as a unified talent profile view.

---

### ❓ Missing Context (Follow-up Questions)

1. **Anonymity vs. Attribution:** Are Talent Pool responses attributed (HR sees which employee said what) or anonymous? Employees declaring promotion readiness or relocation willingness is sensitive; anonymous responses reduce psychological barriers but make the dashboard non-actionable for HR. This is the highest-stakes design decision not yet resolved from the discovery.  
Answer: Talent pool survey responses are non-anonymous
2. **Manager Visibility:** Can a manager see their direct reports' Talent Pool survey responses, or is this strictly HR-only? This directly affects whether talent hoarding (documented as the #1 internal mobility blocker) is a risk the product inadvertently enables — and shapes what access controls need to be built into V1.  
Answer: Strictly Sub and Super Admins only.

---

### Confidence Level

**Medium**

**Reasoning:** All four primary jobs are grounded in confirmed customer evidence (Alumil TAM notes + discovery discussion) and extensively corroborated by HR practitioner research. Functional jobs (1, 2, 3) have strong evidence. Job 4 (bias reduction via self-declaration) is directionally supported but was not explicitly articulated by Alumil — it is inferred from industry evidence and consistent with the product's structural positioning.

### Assumptions

- Survey responses are **attributed**, not anonymous — assumed because an anonymous talent pool is not filterable or actionable at the individual level, which is the core HR use case. Needs explicit customer confirmation.
- V1 scope is **HR-facing only** — employees fill the survey; HR uses the dashboard. No employee-facing browsing interface or opportunity matching in V1.
- **Skill data in dashboard filters** comes from the Talent Pool survey itself (free text / multi-select), not from the Skill Gap Analysis skills library — assumed for V1 simplicity. Cross-reference is V2.
- **Manager nomination** is not part of V1 Talent Pool — this is an employee self-report module. Manager input is handled by the 9-Box Grid sub-module.

---

*JTBD created: 2026-03-26 | Evidence basis: research.md (customer-confirmed + HR community sweep) | No discovery.md present for this sub-module*