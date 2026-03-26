# JTBD: Talent Management — Skill Gap Analysis

*Generated: 2026-03-25 | Evidence basis: customer-confirmed (TAM notes + discovery doc + customer template + research.md Q&A)*

---

### 👤 User Persona & Context

**Persona 1 — The Manager**

- **Who they are:** A team manager at an enterprise org (e.g., Alumil) responsible for a group of direct reports. Currently uses Excel to manually score employees on competencies defined by HR.
- **Primary Goal:** Understand where each team member stands against role expectations and use that information to plan development conversations and coaching.

**Persona 2 — The HR Admin / HRBP**

- **Who they are:** A Super Admin or HRBP responsible for org-wide talent planning, competency program design, and leadership pipeline visibility.
- **Primary Goal:** See competency health across the org, identify systemic gaps, prioritize L&D investments, and build a defensible record of talent decisions.

---

### 🎯 Core Jobs To Be Done

---

**Job 1: See Where My Team Stands, Right Now**

- **Statement:** When *I'm preparing for a development cycle or 1:1s*, I want to *quickly see each direct report's current skill level against the role benchmark*, so I can *have informed, evidence-backed conversations about what to develop next — rather than relying on gut feel*.
- **Type:** Functional + Emotional (confidence in assessment decisions)
- **Current Workaround:** Excel spreadsheet shared by Alumil — manager manually fills in skill scores per employee, then manually compares to benchmark columns. No aggregation, no visual summary.
- **Pain Points (The "Push"):**
  - No heatmap — gaps are invisible until manually computed
  - No role-based access control — spreadsheet is shared flat across the team
  - No tracking over time — each cycle is a new file
  - Manual aggregation is error-prone and time-consuming
- **Supporting Quote:** *"Feedback will be displayed in raw data format as well as a heatmap (need to clarify how this will be shown for each individual employee)."* — Discovery notes, Mar 17

---

**Job 2: Identify Where Competency Gaps Are Concentrated Across the Org**

- **Statement:** When *conducting org-wide talent planning or preparing for leadership reviews*, I want to *see where competency gaps are clustered — by team, role, or skill — across all managers*, so I can *prioritize L&D investments, flag at-risk teams, and build a talent development strategy grounded in data, not anecdote*.
- **Type:** Functional + Social (being seen as a data-driven HR leader)
- **Current Workaround:** HR collects and manually aggregates Excel files from multiple managers. No unified view, no cross-team heatmap.
- **Pain Points (The "Push"):**
  - No single source of truth — data lives in disparate files
  - No cross-team comparison
  - No way to identify systemic gaps without manually stitching data
  - Strategic objectives (identify leaders, reduce recruitment cost) cannot be tracked
- **Supporting Quote:** *"Identifies talent & future leaders / Develops talent / Minimizes recruitment costs / Identifies & addresses competency gaps"* — Alumil objectives, Mar 17 discussion

---

**Job 3: Set Up and Maintain a Sth kill Framework Without Spreadsheet Management**

- **Statement:** When *launching or refreshing a competency program*, I want to *define role-relevant skills, assign them to teams, and distribute the assessment to managers* — all inside the platform — so I can *eliminate the operational overhead of managing spreadsheets, version control, and manual distribution*.
- **Type:** Functional
- **Current Workaround:** Admin maintains a master Excel template defining skills, descriptions, importance ratings, and required levels. Template is shared externally and filled in ad hoc.
- **Pain Points (The "Push"):**
  - Version drift — different managers may be using different versions of the template
  - No validation — bad data silently enters the spreadsheet
  - No access controls — anyone with the file can see or edit everything
  - Time-intensive to set up each new cycle
- **Supporting Quote:** *"Super Admins can be allowed to create skills and assign them to teams. One skill can be assigned to multiple teams. Team manager can create a new skill, but by default is assigned to their team only."* — research.md Q&A, Q2

---

**Job 4: Build a Longitudinal, Auditable Record of Employee Development**

- **Statement:** When *making or justifying promotion, transfer, or development decisions*, I want to *see how an employee's competency profile has evolved across multiple assessment cycles, with a clear audit trail of who rated what and when*, so I can *make defensible decisions and demonstrate that development is being actively tracked — not just assessed once and forgotten*.
- **Type:** Functional + Social (accountability and credibility in talent decisions)
- **Current Workaround:** None. Each assessment cycle is a standalone file. History is not retained in a structured way.
- **Pain Points (The "Push"):**
  - No longitudinal view — growth over time is invisible
  - No audit trail — edits to ratings are untracked
  - No accountability — unclear who entered data or changed it
- **Supporting Quote:** *"Should support periodic assessment with history"* and *"There should be audit trail for the edits, even super admins and sub admins can edit but should have trail."* — research.md Q&A, Q3 and Q6

---

### 💡 Feature Opportunities & Implications

- **Opportunity 1 — Manager Assessment Flow (per employee):** A fast, focused input UI where a manager selects a direct report and rates them on each assigned skill (1–5). The form should show the benchmark (required level) inline so the gap is immediately visible while rating — not just in a post-submission report. Lattice-style simplicity is the target.
- **Opportunity 2 — Skill × Employee Heatmap with Gap Overlay:** The primary reporting view should be a heatmap with employees as rows and skills as columns, with a Role column and an Overall Average column. Color coding should reflect gap severity (Actual vs. Required Level). Filters should mirror existing survey heatmap filters (Dept, Location, Manager, etc.). This addresses both the Manager job (team view) and the HR job (cross-team aggregation with role/segment filters).
- **Opportunity 3 — Skills Library with Team Assignment:** A skill registry inside the platform — not the survey builder. Super Admins create and manage skills globally; managers can create skills scoped to their team. One skill can be reused across multiple teams. CSV upload with a downloadable template is the V1 onramp. This eliminates the spreadsheet-management job entirely.
- **Opportunity 4 — Assessment Cycles with History + Audit Trail:** Each assessment run is versioned as a cycle (e.g., Q1 2026). The platform retains all prior cycles and allows trend views per employee. All edits (by manager, Sub Admin, or Super Admin) are logged with actor + timestamp. This transforms a point-in-time Excel exercise into a living talent development record.
- **Opportunity 5 — Role + Overall Score Column in Heatmap:** Adding the employee's role as a visible column and computing an Overall Skill Level (average across skills) provides immediate context for HR to segment and rank by role — a direct gap from the Excel model where this was manual.

---

### ❓ Missing Context / Follow-up Questions

1. **Gap display & weighting (Q5 — unanswered):** Should the heatmap cells show the raw Actual score, the Gap (Required − Actual), or both? And should Skill Importance weight the gap visually — e.g., a gap on a Critically Important skill is shown more prominently than a gap on a Not Important one? This directly affects heatmap design and the "Overall Skill Level" column calculation.  
Answer: heatmap should show the actual a tool can show the benchmark score. Gap is not needed. But filters like less than benchmark are a good thing to have. The overall skill level is the average of all skills for an employee.
2. **Assessment cycle initiation:** Who triggers a new assessment cycle — does the Admin set a start/end date, or is it always open for managers to submit at any time? This affects how "periodic with history" works in practice and whether participation/completion tracking is needed (similar to the survey module's completion rate concept, but scoped to manager submissions rather than employee responses).  
Answer: Super and sub-admins can trigger the assessment cycle. 
3. Important note: The super and sub admins can view, trigger assessments, and edit submissions for data in their scope; however, they should have a separate toggle to view only their reportees' data for conducting assessments. 

---

### Confidence Level

**Medium-High**

**Reasoning:**

- Functional jobs are strongly evidence-backed: customer-confirmed template, discovery notes, and direct Q&A answers in research.md
- Emotional and social jobs (confidence, defensibility, credibility) are inferred from stated objectives ("identifies talent & future leaders," "minimize recruitment costs") — directionally correct but not verbatim from customer
- Gap display and cycle initiation remain unanswered — these affect how Jobs 1 and 4 are fully satisfied

### Unresolved Assumptions

- Gap calculation method (raw vs. delta vs. importance-weighted) assumed to be Required − Actual with visual color coding; not yet confirmed
- "Overall Skill Level" column assumed to be a simple average across all skills; weighting by Skill Importance is a plausible V1+ enhancement
- Assessment cycle model assumed to be Admin-initiated with defined periods; open-always model is an alternative not yet ruled out
- Sub Admin / HRBP scope assumed to follow existing CultureMonkey access configuration (account-level defined); exact UI for scoped vs. global views TBD

