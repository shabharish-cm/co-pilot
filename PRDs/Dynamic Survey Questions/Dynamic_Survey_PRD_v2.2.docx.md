**PRODUCT REQUIREMENTS DOCUMENT**

**Dynamic Survey Logic**

Branching, Visibility Rules & Exposure-Aware Reporting

Version 2.2  |  CultureMonkey Product

# **1\. TL;DR**

| Problem |
| :---- |
| Enterprise employees receive surveys filled with irrelevant questions — wasting their time and reducing response quality. |
| HR admins cannot capture nuanced sentiment because follow-up questions (e.g., 'why did you rate this low?') are not supported. |
| Reports treat every respondent as if they saw every question, distorting driver scores, heatmaps and participation rates. |
| Static surveys fail key enterprise use-cases: onboarding (role-specific), exit (reason capture), pulse (targeted follow-up), and manager reviews. |

| Solution & Expected Impact |
| :---- |
| Section-level and question-level visibility rules filter the survey at launch — each employee only sees relevant content. |
| Branch questions (Rating, Single Select, Multi Select) capture the 'why' in-session, directly after a score is given. They are diagnostic instruments — permanently excluded from driver score calculations regardless of child question type. |
| Driver scores remain comparable across all cohorts because they are computed exclusively from base (non-branch) rating questions, using the Shown base (S) for each question within the cohort. |
| Exposure-aware reporting (Eligible / Shown / Responded) ensures every analytics surface — heatmap, insights, questions tab, text responses — is correct. |
| Expected: \+8–12% participation, \+20% qualitative response density, zero misleading 'zero-score' cells in reports. |
| Roadmap clarity: static subdrivers (always-shown, equally weighted) are a separate Phase 3 feature — not the same as branch questions. |

# **2\. Context & Problem Statement**

## **2.1 Background**

CultureMonkey serves enterprise HR teams running annual engagement, pulse, onboarding, exit, and manager-effectiveness survey programs. Today all surveys are static — every eligible employee sees every question. Three compounding problems follow.

* **Survey fatigue:** A 45-question annual survey sent equally to a first-week joiner and a 10-year veteran feels irrelevant and drives abandonment.

* **Missing the 'why':** A manager rates Recognition 3/10. The survey ends. No mechanism exists to ask what specifically failed — the team spends hours in manual follow-up.

* **Analytics distortion:** When a section is only relevant to the Sales team but averaged across all respondents, driver scores mislead leadership. Zero scores appear for groups that were never even asked.

## **2.2 Real-World Enterprise Use Cases**

* **UC-1 Annual Engagement:** Show 'Work from Home' section only to Remote employees; show 'Client Interaction' section only to Sales & CS.

* **UC-2 Pulse — Manager Effectiveness:** Rating \< 6 → 'What specific area needs improvement?' (follow-up). Rating 9–10 → 'What is your manager doing well?' Neutrals 7–8 skip follow-up.

* **UC-3 Onboarding (30/60/90-day):** 'Was your onboarding buddy helpful?' shown only to employees with custom attribute Buddy Assigned \= Yes.

* **UC-4 Exit Survey:** If employee selects 'Manager relationship' as primary exit reason, show 3 specific follow-up questions. 'Career growth' triggers different follow-ups.

* **UC-5 Multi-region Pulse:** Show Mandarin wellness questions only to APAC; show DEI block only to regions where the DEI program is active.

* **UC-6 eNPS Branching:** Detractors (0–6) → 'What would make you more likely to recommend us as an employer?' Promoters (9–10) → 'What do you value most?'

## **2.3 Customer Feedback & Concerns**

* "We spend more time removing irrelevant responses from our analysis than actually analyzing." — HR Analytics Lead, 5,000-person org

* "Employees complain the survey has nothing to do with their role. Pulse completion has dropped to 42%." — CHRO, Manufacturing

* "I need to know WHY a driver score dropped, not just THAT it dropped." — People Analytics Manager

* "Our exit survey is useless — everyone gets the same 20 questions regardless of why they're leaving." — HRBP

* "After we run a dynamic survey, our heatmap shows zeros for groups that were never even asked those questions — it looks like they're disengaged, but they were never surveyed on that driver." — People Analytics, BFSI

# **3\. User Stories & Scope**

## **3.1 Target Audience**

* **Primary:** Super-Admin — designs surveys, configures rules and branches, reviews all reports.

* **Secondary:** Sub-Admin (HR BP / Regional HR) — launches surveys for their scope, reads scoped reports.

* **Tertiary:** Manager — views team-level reports with exposure-aware data.

* **End consumer:** Employee — responds to a dynamically filtered, relevant survey experience.

## 

## 

## 

## **3.2 User Stories (Survey Builder)**

| US\# | Title | Description | Priority |
| :---- | :---- | :---- | :---- |
| **US.1** | **Section Visibility Rules** | As a Super-Admin, I want to show or hide entire sections based on employee attributes (Location, Department, custom field), so employees only see relevant blocks of questions. | MVP — Must |
| **US.2** | **Question-Level Visibility Rules** | As a Super-Admin, I want to add a question-specific visibility rule that ANDs with its section rule, so I can control individual question exposure within a section. | MVP — Must |
| **US.3** | **Branch Questions — Rating** | As a Super-Admin, I want to add follow-up questions triggered by a rating range (e.g. 0–6 → detractor follow-up), so I capture the 'why' for low and high scorers. | MVP — Must |
| **US.4** | **Branch Questions — Single Select** | As a Super-Admin, I want follow-up questions triggered by a specific single-select option (e.g. exit reason → specific follow-ups), so the survey adapts to each choice. | MVP — Must |
| **US.5** | **Branch Questions — Multi-Select** | As a Super-Admin, I want to attach one follow-up question to one specific multi-select option, so I capture in-depth context for the most important option without overwhelming respondents. | MVP — Must |
| **US.6** | **Multiple Follow-ups per Parent** | As a Super-Admin, I want to add multiple follow-up questions to a single parent question (e.g. range 0–3 → Q1, range 4–6 → Q2, range 9–10 → Q3), so different respondent groups receive contextually appropriate follow-ups. | MVP — Must |
| **US.7** | **Rich Follow-up Question Types** | As a Super-Admin, I want follow-up questions to support Rating, Single-Select, Multi-Select and Free Text types — not just free text — so I can collect structured diagnostic data in follow-ups. Branch questions are diagnostic instruments and do not contribute to driver scores regardless of their type. | MVP — Must |
| **US.8** | **No Grand-Child Branching** | As a Super-Admin, I understand that follow-up questions cannot have their own follow-ups, so the survey tree remains manageable and respondent experience stays clean. | MVP — Must (Constraint) |
| **US.9** | **CSV Import with Branch Logic** | As a Super-Admin, I want to import survey structure via CSV including section rules, question rules, and branch definitions, so I can bulk-create complex surveys without manual UI setup. | MVP — Must |
| **US.10** | **Question Placeholders** | As a Super-Admin, I want to insert employee attribute tokens ({{manager\_name}}, {{department}}) into question text, so employees read personalized, contextual questions. | Should |

## **3.3 User Stories (Reports — Exposure-Aware)**

| US\# | Title | Description | Priority |
| :---- | :---- | :---- | :---- |
| **US.11** | **Participation Rate Accuracy** | As a Super-Admin, I want participation rate calculated as Responded / Eligible (not Responded / total headcount), so the metric accurately reflects program effectiveness. | MVP — Must |
| **US.12** | **Not Measured Heatmap Cells** | As a Super-Admin, I want the heatmap to show 'Not Measured' (grey cell, N/A) for driver × dimension combos where no employee was shown that driver, so I don't draw false conclusions from zero-score cells. | MVP — Must |
| **US.13** | **Not Measured Heatmap Drilldown** | As a Super-Admin, I want clicking a Not Measured cell to open an informational modal explaining why no data exists (shown to 0 employees), so I can distinguish 'not asked' from 'disengaged'. | MVP — Must |
| **US.14** | **Summary Tab Exposure Context** | As a Super-Admin, I want the Summary tab header to display Max Questions and Avg Questions Shown, so I understand how much of the survey the average respondent actually saw. | MVP — Must |
| **US.15** | **Insights Tab — Unmeasured Driver Exclusion** | As an Analyst, I want the Insights tab (driver rankings, radar chart) to exclude drivers with zero exposure in the current filter context, so top/bottom rankings are not distorted by unasked drivers. | MVP — Must |
| **US.16** | **Questions Tab — Branch Question Visibility** | As an Analyst, I want branch (child) questions to appear indented under their parent in the Questions tab with their trigger label, so I can trace which follow-up belonged to which parent and trigger. | MVP — Must |
| **US.17** | **Question Detail — Shown vs Answered** | As an Analyst, I want each question detail view to display Shown to (S) and Answered by (R) counts separately, so I understand response rates relative to actual exposure. | MVP — Must |
| **US.18** | **Text Responses — Branch Classification** | As an Analyst, I want branch question responses tagged with parent question and trigger context (e.g. 'Branch | Q4 | Rating: 0–6') in the Text Responses tab, so I can filter and analyse contextual open-ends separately. | MVP — Must |
| **US.19** | **Section Exposure in Questions Tab** | As an Analyst, I want to see Eligible / Shown / Responded counts per section in the Questions tab report, so I can understand which employee groups received which content blocks. | Should |
| **US.20** | **Export Includes Exposure Metadata** | As a Super-Admin, I want XLS/CSV exports to include is\_branch, parent\_question\_id, trigger details, excluded\_from\_driver\_score flag, measured\_flag and shown\_count per driver, so offline analysis correctly reflects survey routing and scoring rules. | Should |
| **US.21** | **Benchmark Tab — Not Measured Drivers** | As an Analyst, I want drivers never shown to the filtered cohort to appear as 'Not Measured' in the Benchmark tab, not as zero scores, so comparisons against industry benchmarks are not falsely negative. | Should |
| **US.22** | **Manager Dashboard Exposure Awareness** | As a Manager, I want my team-level driver scores computed only from employees who were actually shown those driver questions, so my dashboard reflects genuine team sentiment. | Should |
| **US.23** | **Branch Questions Excluded from Driver Scores** | As an Analyst, I want driver scores calculated exclusively from base (parent) rating questions — never from branch (child) questions — so scores are comparable across all cohorts regardless of which branch path each employee took. | MVP — Must |
| **US.24** | **Subdriver Scoring — Future Phase** | As a Super-Admin, I want to optionally add static subdriver rating questions to a driver (shown to all eligible respondents, equally weighted) in a future release, so I can enrich driver scores without introducing cohort bias. \[OUT OF SCOPE — Phase 3\] | Phase 3 — Future |

## **3.4 Out of Scope (This Release)**

* Grand-child branching — follow-up questions cannot themselves have follow-ups.

* OR logic in visibility rules — only AND is supported in MVP.

* Answer piping — injecting a previous answer's text into a subsequent question.

* Grid / Matrix row-level branching.

* Updating the question library and templates with dynamic questions.

* Static subdriver questions (always-shown, equally weighted additions to a driver) — a separate Phase 3 capability. Not the same as branch questions. See US.24.

* Branch question contribution to driver scores — CLOSED DECISION: branch questions are permanently excluded from driver score calculations regardless of child question type. This is not a deferral.

* External benchmark tab full exposure recalculation (post-MVP).

# **4\. User Experience & Design**

## **4.1 Survey Builder — Section Rules**

Entry: Admin navigates to Create Survey → Questions canvas → creates or selects a section.

* Section card has a new '+ Add Rule' button in both collapsed and expanded states.

* Rule builder UI: attribute dropdown (default \+ custom) → operator (equals / in list / not equals / not in list) → value multi-select.

* Collapsed section card shows compact rule summary badge: e.g., '● Rules Active · Dept: Engineering, Product'.

* Expanded section card shows full rule expression inline with an 'Edit Rules' link.

* Deleting a section rule shows a confirmation dialog if branch questions exist under it.

* 'Preview for employee type' simulator: admin selects attribute values and sees which sections/questions would be shown.

* System warns if a configured rule results in 0 employees being eligible for a section.

## **4.2 Survey Builder — Question Rules**

* Inside the question editor, section rule is shown as a read-only badge ('Inherited from Section').

* Admin can add one additional question-level rule. Effective rule \= section\_rule AND question\_rule.

* If section has no rule, admin can add a standalone question rule.

* Grid questions: each grid item can optionally have one item-level rule (ANDs with section \+ question rules).

## **4.3 Survey Builder — Branch Questions**

### **4.3.1 Supported Parent Question Types**

Rating, Single Select, and Multi-Select questions can have branch (child) questions. Text, Grid, and eNPS questions do not support branching in MVP.

### **4.3.2 Adding Branch Questions**

* In the question editor, a 'Branch Questions' section appears below the main question config for supported types.

* Admin clicks '+ Add Branch Question'. A trigger configuration panel opens.

* For Rating: admin defines one or more non-overlapping rating ranges (e.g. 0–3, 4–6, 9–10). Each range maps to one child question.

* For Single Select: admin selects one or more options; each option maps to one child question.

* For Multi-Select: admin may configure exactly ONE branch, tied to ONE specific option.

* After defining the trigger, admin configures the child question — type, text, and options if applicable.

* Child question types available: Free Text, Rating, Single Select, Multi-Select.

* Scoring notice shown inline in the branch question editor: 'Branch questions are diagnostic — they do not contribute to driver scores. Use them to capture qualitative context behind a score.'

* For Rating child questions: an optional 'Driver tag' field appears (grayed label: 'Saved for future subdriver analysis — not scored in this release').

* Multiple children per parent are allowed (no cap beyond non-overlapping trigger constraint).

* Children are displayed indented under the parent in the canvas, with a branch icon and trigger label (e.g. 'Branch — Rating: 0–6').

### **4.3.3 Grand-Child Constraint**

* Child questions do NOT expose a '+ Add Branch Question' button.

* System shows inline message if admin attempts: 'Branch questions cannot have further branches. Restructure at the parent level.'

## **4.4 UI States — Survey Builder**

| State / Scenario | Behavior |
| :---- | :---- |
| **Empty (no rules)** | Section card shows '+ Add Rule' ghost button. Question card shows 'Visible to all' label. |
| **Rule configured** | Section card shows colored rule badge. Question inherits section rule \+ own rule if set. |
| **Conflict: overlapping ranges** | Publish blocked. Inline error highlights overlapping ranges: 'Ranges 4–7 and 5–9 overlap. Adjust to proceed.' |
| **Rule results in 0 employees** | Yellow warning banner under section: 'Based on current employee data, 0 employees match this rule.' |
| **Loading (rule evaluation)** | Skeleton state on canvas while rule evaluation runs; no partial render. |
| **Branch question in-session** | Branch question appears immediately below parent after answer submission, without page reload. |
| **Rating change after branch shown** | Branch question hides immediately; answer clears. If new rating matches a different branch, that branch appears. |

## **4.5 Reports — Exposure-Aware Design**

When a survey uses visibility rules or branch questions, reports must reflect that different employees saw different content. The core principle is: a question or driver that was never shown to a cohort is Not Measured — never a zero score, never blank, never misleadingly red.

The following sub-sections describe how each report tab changes. Tabs with no dynamic-survey impact (e.g. Benchmark for non-dynamic surveys) are unchanged.

### **4.5.1 Summary Tab**

The Summary tab is the first screen an admin sees after a survey closes. It must communicate overall health while flagging that dynamic routing was active.

**Changes to Header Metadata**

* Existing: '27 Questions | 650 Participants'.

* Updated: 'Max Questions: 27 | Avg Questions Shown: 18 | Eligible Participants: 650'.

* 'Avg Questions Shown' \= mean of questions shown per respondent across all eligible employees.

**Changes to Key Stats Card**

* Existing: Emails Sent / Employees Responded / Employees Didn't Respond.

* Updated: Eligible Participants / Responded / Didn't Respond (Eligible − Responded) / Avg Questions Shown (X of Max N).

* 'Emails Sent' remains as a separate operational stat.

**Participation Rate Widget**

* Existing: framed as 'Emails Sent vs Employees Responded'.

* Updated: Responded / Eligible. Shared-link and non-email launches are correctly handled because Eligible is participation-base-aware.

* Tooltip on participation rate: 'Participation \= Responded / Eligible Participants. Eligible \= employees after survey-level pre-filtering.'

| State / Scenario | Behavior |
| :---- | :---- |
| **Dynamic survey — first load** | Header shows Max Questions \+ Avg Shown. A subtle info chip reads: 'This survey used visibility rules — different employees saw different questions.' |
| **Static survey (no rules)** | All existing behavior unchanged. was\_shown defaults to true for all questions; Avg Shown \= Max Questions. |
| **All eligible employees excluded by rules** | System shows warning: 'No employees matched the configured visibility rules. No data is available.' |

### **4.5.2 Report Tab — Heatmap**

The heatmap is the primary analytics canvas for admins. With dynamic surveys, some cells represent drivers that were never shown to a dimension (e.g. Work Environment was only shown to Remote employees, so On-site employees show Not Measured).

**Not Measured Cell Rendering**

* If S\_driver(dimension) \= 0: cell renders with grey fill and em-dash (—). No color on heat scale.

* Cell is not clickable for drilldown (or opens informational-only modal — see below).

* Tooltip on hover: 'Not Measured | Shown to: 0 employees | Reason: Dynamic routing rules.'

* Not Measured cells sort last when admin sorts by score, preventing misleading 'worst performers' appearance.

**Measured Cell Tooltip (updated)**

* Existing: score \+ basic participation.

* Updated: Driver Score | Shown to: N employees | Responded: M employees | Participation within shown: X%.

**Not Measured Drilldown Modal**

* Admin clicks a Not Measured cell → modal opens in informational state.

* Modal shows: Driver name \+ Dimension value \+ Status: Not Measured \+ Shown to: 0 \+ Explanation: 'This driver was not shown to any employees in this Dimension due to dynamic routing rules.'

* Demographics breakdown section: disabled with label 'Breakdown unavailable — driver not measured for this Dimension.'

* Questions section: empty/disabled with same explanation.

**Measured Cell Drilldown Modal (updated)**

* Driver score computed using Shown base for that driver within the Dimension (not full Dimension participation).

* Demographics breakdown: each row computed from employees shown the driver within that demographic value. Rows with zero shown render as Not Measured (—).

* Questions section: questions shown to at least one employee display scores normally. Questions never shown display as Not Measured (—).

* Sections subsection: each section shows rule summary \+ Shown / Responded counts for that Dimension.

| State / Scenario | Behavior |
| :---- | :---- |
| **Measured cell hover** | Tooltip: Driver Score | Shown to: N | Responded: M | Participation within shown: X% |
| **Not Measured cell hover** | Tooltip: Not Measured | Shown to: 0 | Reason: Dynamic routing rules |
| **Not Measured cell click** | Informational modal — no gauge, no breakdown, no question scores |
| **Measured cell — demographic row with Shown=0** | Row renders as Not Measured (—); excluded from heat color |
| **Switching dimension tab (e.g. Region → Band)** | System recomputes S\_driver per new dimension; Not Measured cells recalculated |
| **Applying filters (e.g. APAC only)** | S\_driver recomputed within filtered cohort; cells may flip between Measured and Not Measured |

### **4.5.3 Insights Tab**

The Insights tab surfaces top/bottom drivers and a radar chart. With dynamic surveys, drivers that were never shown in the current filter context must be excluded from all ranking and visualization.

**Driver Rankings — Top / Bottom Performing**

* Existing: ranks all drivers assuming universal measurement.

* Updated: ranks only drivers where S\_driver \> 0 for the current filter context.

* If too few drivers are measured (e.g. heavy routing leaves only 2 drivers), show informational state: 'Not enough measured drivers to rank for this cohort. Try adjusting your filters.'

**Radar Chart**

* Existing: always renders a complete loop across all drivers.

* Updated: only measured drivers are plotted. Unmeasured drivers are removed from the chart entirely (preferred) or shown as N/A labels with no plotted point.

* Tooltip / legend clarifies: 'Scores represent only employees shown each driver's questions.'

**Answer Distribution by Question**

* Questions shown to at least one employee display their distributions normally.

* Questions never shown in current filter: rendered as Not Measured (—) or hidden — must not show empty 0% bars.

**Compare & Filter interaction**

* Applying a demographic filter (Team, Location, BU, Manager) recalculates S\_driver per driver within the filtered cohort.

* Drivers with S \= 0 after filter application become Not Measured for that view and are excluded from rankings and radar.

| State / Scenario | Behavior |
| :---- | :---- |
| **All drivers measured** | Existing behavior unchanged. |
| **Some drivers Not Measured in filter context** | Excluded from radar and rankings; informational chip: 'N drivers hidden — not measured for this cohort.' |
| **Too few measured drivers to rank** | Empty state card: 'Not enough measured drivers to rank for this cohort.' |
| **Driver distribution bar for unmeasured driver** | Row hidden or shows Not Measured — never renders as 0% bar. |

### **4.5.4 Questions Tab**

The Questions tab lists every question in the survey and lets admins review distributions and text responses per question. With dynamic surveys, the tab must surface section exposure and clearly distinguish branch questions from base questions.

**Section Headers — Exposure Counts**

* Each section header now shows: 'Eligible: N | Shown: S | Responded: R' for that section in the current demographic filter.

* This tells admins which groups received which content blocks without needing a separate report tab.

**Question List — Branch Question Representation**

* Branch questions appear indented directly under their parent question (visually grouped).

* Each branch question row shows a trigger label: e.g. 'Branch — Rating: 0–6' or 'Branch — Option: Manager relationship'.

* A 'branch' icon differentiates child questions from base questions at a glance.

* Placeholder indicator: if a question contains {{tokens}}, a subtle 'Placeholder' badge appears on the question row.

**Question Detail View — Exposure-Aware Metrics**

* Header shows: Shown to: S | Answered by: R | Completion rate within shown: R/S%.

* If S \= 0 (question never shown in current filter): detail view loads in Not Measured state — no score gauge, charts hidden, response list empty with message 'Not measured due to routing rules.'

* If question is a branch, detail view clearly states: 'This is a branch question' | 'Triggered by: \[Parent Question\] \+ \[Condition\]'.

* If question contains placeholders: inline note — 'This question contained dynamic placeholders. Employees may have seen different rendered text based on their attributes.'

* Demographic breakdown within question detail: groups where question was never shown render as Not Measured (—) — never as '0 responses.'

**Parent Question Detail — Follow-ups Section**

* If a base question has branch children, detail view includes a lightweight 'Follow-ups' section listing: trigger condition \+ linked child question (with click-through).

* Follow-ups section is informational only — no workflow builder in the detail view.

| State / Scenario | Behavior |
| :---- | :---- |
| **Section header** | Shows Eligible / Shown / Responded for that section in current filter |
| **Base question with no branches** | Existing behavior unchanged. Shown to \= all eligible (was\_shown \= true by default). |
| **Branch question — shown to some** | Indented under parent with trigger label. Shown to \= employees who hit the trigger condition. |
| **Branch question — S \= 0** | Not Measured state: no score, no chart, message 'Not measured due to routing rules.' |
| **Demographic breakdown row — question never shown** | Row shows Not Measured (—). Never shows 0 responses. |
| **Filter applied** | Section headers and question Shown counts recalculate for filtered cohort. |

### **4.5.5 Text Responses Tab**

The Text Responses tab consolidates all open-ended feedback. With dynamic surveys, responses from branch questions must be classified and surfaced with full trigger context so analysts can filter and interpret them correctly.

**Response Categories (Left Panel)**

* Existing: Open Feedback / Free Text Responses / Question Comments.

* Updated — new category added: Branch Responses (free-text and rich-type responses from branch questions).

* 'Branch Responses' shows sub-filters: by parent question, by trigger type (Rating Range / Selected Option), by trigger value (e.g. Rating 0–6).

**Response Feed Cards — Branch Context**

* Branch response cards display: standard sentiment tag \+ driver tags \+ metadata (existing).

* Additional context label on branch cards: 'Branch response | Parent: \[Question Text\] | Trigger: \[e.g. Rating 0–6\]'.

* If originating question contains placeholders: optional tooltip — 'Respondent saw a personalized version of this question.'

**Export (Text Responses)**

* Export includes dynamic metadata per row: is\_branch (true/false), parent\_question\_id, trigger\_type, trigger\_value, question\_text\_template (with tokens, not resolved values).

| State / Scenario | Behavior |
| :---- | :---- |
| **Selecting 'Branch Responses' category** | Feed filters to branch-only responses. Sub-filters allow drill-down by parent or trigger. |
| **Branch card in feed** | Shows standard card \+ additional 'Branch response | Parent: Q4 | Trigger: Rating 0–6' label. |
| **No branch responses for selected filter** | Empty state: 'No branch responses for this filter combination.' |
| **Exporting branch responses** | Export file includes is\_branch \= true, parent\_question\_id, trigger\_type, trigger\_value columns. |

### **4.5.6 Benchmark Tab**

The Benchmark tab compares the organization's driver scores against an industry benchmark. With dynamic surveys, drivers not shown to the filtered cohort must be treated as Not Measured — not as zero scores — to avoid false comparisons.

**Driver × Benchmark Row Rendering**

* If driver was shown to at least one employee in cohort: 'Your Overall Score' is computed from the Shown base for that driver. Benchmark score is unchanged.

* If driver was never shown to cohort (S\_driver \= 0): driver row renders as Not Measured (—). In the chart, driver is rendered as a grey placeholder with no score bar (preferred) or excluded entirely.

* Tooltip on Not Measured benchmark row: 'Not measured due to dynamic routing rules (shown to 0 employees).'

**Region Filter Interaction**

* System recalculates S\_driver for the selected region. Drivers with S \= 0 for that region become Not Measured in both table and chart.

**Benchmark Export**

* Exported file includes: measured\_flag (Measured / Not Measured), shown\_count (optional), your\_score (blank/NA when not measured), benchmark\_score (always present).

| State / Scenario | Behavior |
| :---- | :---- |
| **Driver fully measured for cohort** | Existing behavior; score computed from Shown base. |
| **Driver Not Measured for cohort** | Grey placeholder row/bar; Not Measured label; no score. |
| **Region filter applied** | S\_driver recalculated per region; Not Measured cells updated. |
| **Benchmark export** | measured\_flag and shown\_count columns added to export file. |

## **4.6 Accessibility & Copy Guidelines**

* All rule dropdowns and branch trigger panels are fully keyboard navigable.

* Rule summary badges carry aria-label attributes describing the full rule expression.

* Branch question grouping conveyed via role='group' and aria-describedby linking to parent trigger label.

* Error and warning states use role='alert' so screen readers announce them immediately.

* Not Measured heatmap cells carry aria-label='Not Measured — shown to 0 employees' for screen readers.

* **Copy guideline:** prefer 'Visible to employees where \[Attribute\] is \[Value\]' over technical 'rule' terminology in admin-facing UI.

* **Metric labels:** use 'Shown to' (not 'applicable to'), 'Not Measured' (not 'N/A' or blank), 'Eligible' (not 'potential participants').

# **5\. Detailed Functional Requirements**

## **5.1 Section & Question Visibility Rules**

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR1** | System must support Section-level visibility rules using default and custom employee attributes.Supported operators: equals / in list / not equals / not in list.Multiple predicates combined with AND only. | Given admin configures rule 'Dept in \[Sales, CS\]',When survey launches for employee with Dept \= Engineering,Then that section and all its questions are hidden. |
| **FR2** | Rule evaluation must be server-side at survey instance generation (pre-start). Respondent never receives a question evaluating to false. | Given employee attributes evaluated at launch,When survey instance generated,Then only eligible sections/questions are in the employee's payload. |
| **FR3** | Question-level rule must AND with its section rule. Section rule is read-only in question editor. | Given section rule \= 'Location \= Remote' AND question rule \= 'Role \= IC',When evaluating,Then question shown only to Remote \+ IC employees. |
| **FR4** | Grid item-level rules must AND with section \+ question rules. | Given item rule \= 'Band \= Senior',When employee is not Senior,Then that grid item is hidden while rest of grid is shown. |
| **FR5** | Missing attribute values must evaluate as no match (false), hiding the section/question. | Given employee has no value for 'Custom\_Region',When rule uses Custom\_Region,Then section is hidden for that employee. |
| **FR6** | Rules must be validated on save and CSV import. Invalid rules block publish/import with row-level errors. | Given admin enters rule with unknown attribute,When saving,Then publish blocked and error message identifies invalid attribute. |

## **5.2 Branch Questions**

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR7** | Rating questions support multiple branch questions, each triggered by a non-overlapping rating range. Ranges are inclusive. | Given parent rating question with ranges 0–6 and 9–10,When respondent rates 5, child for 0–6 appears;When respondent rates 10, child for 9–10 appears;When respondent rates 7–8, no child appears. |
| **FR8** | Single Select questions support branch questions triggered by one or more selected options. | Given 'Primary exit reason' single-select,When option 'Manager relationship' selected,Then configured child question appears. |
| **FR9** | Multi-Select questions support exactly ONE branch question tagged to ONE specific option. Attempting to add more is blocked with validation. | Given multi-select parent,When admin attempts to add second branch,Then UI shows: 'Multi-select questions support one branch question only.' |
| **FR10** | Each parent question may have multiple child questions (one per non-overlapping trigger). No cap beyond trigger non-overlap. | Given parent with 4 non-overlapping range branches,When saved,Then all 4 are stored and presented based on respondent's answer. |
| **FR11** | Child question types: Free Text (default), Rating, Single Select, Multi-Select.CRITICAL SCORING RULE: Branch questions are diagnostic instruments. Regardless of child question type, branch questions are permanently excluded from driver score calculations. A child Rating question may optionally be tagged to a driver at creation time (for future subdriver analysis), but this tag has no effect on current driver score computation. Driver scores are computed exclusively from base (non-branch, non-child) questions using the Shown base (S) for that driver within the cohort. | Given admin adds a branch of type Rating tagged to 'Work Environment',When driver scores computed,Then 'Work Environment' score excludes that child Rating question.Given admin adds a Free Text branch,When driver scores computed,Then driver scores are unaffected.Given admin opens child question type dropdown,When configuring,Then all four types are available. |
| **FR12** | Grand-child branching is blocked. Child questions do not expose '+ Add Branch'. Blocked in UI and CSV import. | Given a child question exists,When admin inspects child editor,Then '+ Add Branch Question' is absent;Any CSV row attempting grand-child branching fails with error. |
| **FR13** | Branch question visibility is evaluated client-side without a page reload. Child appears within 200ms of parent submission. | Given respondent submits rating 4,When trigger evaluates to true,Then child appears within 200ms without page reload. |
| **FR14** | Branch question data model stores: parent\_question\_id, trigger\_type, trigger\_value(s), is\_branch flag (bool), branch\_depth (max 1), excluded\_from\_driver\_score (bool, always true for branch questions), optional driver\_tag (for future subdriver phase — stored but not used in score computation in this release). | Given branch created,When fetched from DB,Then all metadata fields are populated;excluded\_from\_driver\_score \= true for all branch questions;driver\_tag stored if provided but does not influence current driver score. |

## **5.3 Exposure-Aware Reporting — Core**

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR15** | System records per respondent × question: was\_shown (bool) and was\_answered (bool). Null answer must not proxy for 'not shown'. | Given section rule evaluated false for respondent,When survey instance generated,Then was\_shown \= false; no response record created. |
| **FR16** | Three exposure bases computable for any cohort: E (Eligible), S (Shown), R (Responded).Driver score computation uses S (Shown base) for base questions only. Branch questions are excluded from all driver score aggregations regardless of whether the child question type is Rating, Single Select, Multi-Select, or Free Text. | Given filter 'Region \= APAC',When computing driver 'Work Environment',Then E, S, R each computed correctly for that cohort;Driver score \= average of base rating questions shown to APAC employees;Any branch rating questions under Work Environment parent questions are excluded from this average. |
| **FR17** | Participation rate \= R / E (Responded / Eligible), not R / total headcount. | Given 800 eligible, 600 responses,When viewing participation,Then rate \= 75%, not 60% vs 1,000 total headcount. |
| **FR18** | Static / legacy surveys are backward compatible. was\_shown defaults to true for all base questions. | Given existing survey launched before this feature,When reports viewed,Then all metrics identical to pre-feature behavior. |

## **5.4 Exposure-Aware Reporting — Summary Tab**

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR19** | Summary tab header shows: Max Questions: N | Avg Questions Shown: X | Eligible Participants: E. | Given dynamic survey with 30 questions and visibility rules,When admin opens Summary,Then header shows 'Max Questions: 30 | Avg Shown: 18 | Eligible: 650'. |
| **FR20** | Key Stats card shows: Eligible / Responded / Didn't Respond / Avg Questions Shown (X of N). Emails Sent remains. | Given 650 eligible, 520 responded,When viewing Key Stats,Then Eligible: 650 | Responded: 520 | Didn't Respond: 130 | Avg Shown: 18 of 30\. |
| **FR21** | Participation Rate widget uses R / E framing, not Emails Sent vs Responded. | Given participation widget,When rate computed,Then tooltip reads: 'Participation \= Responded / Eligible Participants.' |

## **5.5 Exposure-Aware Reporting — Report Tab (Heatmap)**

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR22** | If S\_driver(dimension) \= 0: heatmap cell renders grey with em-dash (—). No color fill. Cell is not clickable. | Given driver 'Work Environment' shown to 0 employees in Region \= LATAM,When heatmap loads,Then LATAM × Work Environment is grey/— and unclickable. |
| **FR23** | Not Measured tooltip: 'Not Measured | Shown to: 0 employees | Reason: Dynamic routing rules.' | Given hover on Not Measured cell,When tooltip renders,Then text matches specified format. |
| **FR24** | Not Measured cells sort last when admin sorts by score. | Given sort by score applied,When sorted,Then Not Measured cells appear at bottom of sorted list. |
| **FR25** | Clicking Not Measured cell opens informational modal only (no gauge, no breakdown, explains shown=0). | Given click on Not Measured cell,When modal opens,Then score area shows 'Not Measured | Shown to: 0' and demographics section is disabled. |
| **FR26** | Measured cell drilldown: driver score computed using Shown base (S) for base questions mapped to that driver within the Dimension. Branch questions are excluded from this calculation even if tagged to the driver. | Given measured cell for Region \= EMEA, driver \= Leadership,When drilldown opens,Then score \= average of base Leadership rating questions shown to EMEA employees;Any branch children of Leadership questions are not included in this average. |
| **FR27** | Drilldown demographics breakdown: each row computed from employees shown that driver within the demographic value. Rows with S=0 render as Not Measured. | Given demographics breakdown in drilldown,When Team \= QA had 0 employees shown Leadership,Then QA row renders as Not Measured (—). |
| **FR28** | Drilldown sections subsection: each section shows rule summary \+ Shown / Responded for that dimension. | Given section with rule 'Location \= Remote',When drilldown opened for a non-remote dimension,Then section row shows Shown: 0 with explanation. |
| **FR29** | Changing dimension tab or applying filters recomputes S\_driver and updates Not Measured cells. | Given switching from Region to Band dimension,When band computed,Then cells are re-evaluated and some may change between Measured and Not Measured. |

## **5.6 Exposure-Aware Reporting — Insights Tab**

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR30** | Insights tab driver rankings and radar chart include only drivers where S\_driver \> 0 for current filter context. | Given 'Autonomy' driver shown to 0 employees in current filter,When Insights tab loads,Then 'Autonomy' absent from radar and Top/Bottom list. |
| **FR31** | If fewer than 3 drivers are measured in current filter: show informational state instead of empty rankings. | Given heavy routing leaves 2 measured drivers,When Insights tab loads,Then card shows: 'Not enough measured drivers to rank for this cohort.' |
| **FR32** | Answer distribution charts exclude unmeasured drivers. Unmeasured driver rows are hidden or shown as Not Measured — never as 0% bars. | Given unmeasured driver in distribution view,When chart renders,Then driver row shows Not Measured — not an empty 0% bar. |
| **FR33** | Applying Compare & Filter recalculates S\_driver per driver in the filtered cohort. | Given filter applied to Team \= Alpha,When recalculated,Then drivers not shown to Team Alpha become Not Measured for that view. |

## **5.7 Exposure-Aware Reporting — Questions Tab**

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR34** | Section headers in Questions tab show: Eligible / Shown / Responded for that section in current filter. | Given section with rule 'Dept \= Sales' and current filter is all employees,When Questions tab loads,Then section header shows 'Eligible: 650 | Shown: 180 | Responded: 162'. |
| **FR35** | Branch questions appear indented under parent with trigger label. Branch question rows display a 'Diagnostic — not scored' badge to signal exclusion from driver score. Parent question detail includes a 'Follow-ups' section listing children with trigger conditions. | Given parent Q5 with 2 branch children,When Questions tab loads,Then children appear indented under Q5 with trigger labels;Each child row shows 'Diagnostic — not scored' badge;Q5 detail view lists both children under 'Follow-ups' with their trigger conditions. |
| **FR36** | Placeholder indicator badge appears on question rows (base or branch) that contain attribute tokens. | Given question with {{manager\_name}} token,When displayed in list,Then 'Placeholder' badge is visible on that row. |
| **FR37** | Question detail view shows: Shown to (S), Answered by (R), Completion rate within shown (R/S%).For branch questions: detail view also shows 'Diagnostic question — excluded from driver scores'. If the branch is a Rating type with a driver tag, the tag is shown as 'Driver tag: \[Driver\] (informational only — not scored this release)'. | Given Q7 (base) shown to 200 employees, answered by 183,When detail view opens,Then shows 'Shown to: 200 | Answered by: 183 | Completion: 91.5%'.Given branch Rating question tagged to 'Work Environment',When detail view opens,Then shows 'Diagnostic question — excluded from driver scores' \+ 'Driver tag: Work Environment (informational only)'. |
| **FR38** | If S \= 0 for a question in current filter: detail loads in Not Measured state (no gauge, charts hidden, response list empty). | Given question not shown to any employee in current filter,When detail view opens,Then status shows 'Not Measured — not shown to any employee due to routing rules.' |
| **FR39** | Branch question detail view labels the question as branch and shows trigger context (parent \+ condition). | Given branch question detail view,When loaded,Then header shows 'Branch question | Triggered by: \[Parent Q\] | Condition: Rating 0–6'. |
| **FR40** | Demographic breakdown within question detail: groups with S=0 for that question render as Not Measured (—), never as 0 responses. | Given Region \= APAC was never shown Q7,When demographic breakdown in Q7 detail renders,Then APAC row shows Not Measured (—). |

## **5.8 Exposure-Aware Reporting — Text Responses Tab**

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR41** | A new response category 'Branch Responses' is added to the left panel. Sub-filters: by parent question, by trigger type, by trigger value. | Given survey has branch free-text responses,When Text Responses tab loads,Then 'Branch Responses' category appears in left panel. |
| **FR42** | Branch response cards display trigger context: 'Branch response | Parent: \[Q text\] | Trigger: \[e.g. Rating 0–6\]'. | Given branch response card rendered,When displayed,Then trigger context label is visible on the card. |
| **FR43** | Text response export includes: is\_branch, parent\_question\_id, trigger\_type, trigger\_value, question\_text\_template, excluded\_from\_driver\_score (always true for branch rows). | Given export of text responses,When downloaded,Then CSV columns include is\_branch, parent\_question\_id, trigger\_type, trigger\_value, excluded\_from\_driver\_score;excluded\_from\_driver\_score \= TRUE for all branch question rows. |

## **5.9 Exposure-Aware Reporting — Benchmark Tab**

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR44** | Driver row in Benchmark tab renders as Not Measured (—) if S\_driver \= 0 for current cohort. Chart renders grey placeholder or excludes driver. | Given driver 'Recognition' shown to 0 employees in cohort,When Benchmark tab loads,Then Recognition row shows Not Measured; chart has grey placeholder. |
| **FR45** | When region filter applied, S\_driver recomputed per driver for that region. Drivers with S=0 become Not Measured in table and chart. | Given filter Region \= North applied,When recomputed,Then drivers not shown to North region become Not Measured. |
| **FR46** | Benchmark export includes: measured\_flag, shown\_count, your\_score (blank when Not Measured), benchmark\_score. | Given benchmark export downloaded,When opened,Then measured\_flag column shows 'Measured' or 'Not Measured' per driver row. |

## **5.12 Driver Score Computation Rule (Canonical Definition)**

This section is the single source of truth for how driver scores are computed in the context of dynamic surveys. Engineering and analytics should reference this section when there is any ambiguity.

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR52** | Driver score \= average of base (non-branch) rating question scores mapped to that driver, computed only from respondents who were shown (S \> 0\) each respective question.Branch questions are permanently excluded from driver score calculations. This applies universally:• Rating parent → Rating child: child excluded.• Single Select parent → Rating child: child excluded.• Multi-Select parent → Rating child: child excluded.• Any parent type → any child type: child excluded.This rule does not change if a branch child has a driver tag. The driver tag is stored for future use (Phase 3 static subdrivers) but has zero effect on score computation in this release.Static subdrivers (Phase 3\) will be a separate architecture: always-shown, pre-defined, equally weighted — not conditional, not branched. | Given a survey with:• Parent Q1 (base Rating, tagged: Management, shown to 500)• Child Q1a (branch Rating, triggered by Q1 rating 0–6, tagged: Management, shown to 180)When Management driver score computed,Then score \= average of Q1 scores from its 500 Shown respondents;Q1a scores are excluded entirely.Given driver 'Work Environment' with 3 base questions and 2 branch children,When driver score computed,Then score \= average of 3 base question scores from their respective Shown bases;2 branch children contribute 0 weight. |

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR47** | CSV template supports row types: SECTION, QUESTION, BRANCH, GRID\_ITEM. BRANCH rows require parent\_question\_id, trigger\_type, trigger\_value(s), child question type. | Given valid CSV with BRANCH rows,When imported,Then branch questions created with correct parent linkage and trigger metadata. |
| **FR48** | CSV import validation enforces: no grand-child branching, no overlapping ranges, valid operators, valid parent\_question\_id references. | Given CSV row where parent\_question\_id references a BRANCH row,When imported,Then import fails: 'Row 42: Grand-child branching not allowed.' |

## **5.11 Question Placeholders (Should)**

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR49** | Admin can insert attribute tokens into question and branch question text. Tokens resolved at survey start per employee. | Given question text '{{manager\_name}} rated your performance…',When employee loads survey,Then they see their actual manager's name rendered. |
| **FR50** | Fallback for missing token: empty string with whitespace collapse. Raw tokens never visible to respondents. | Given employee has no manager attribute,When question contains {{manager\_name}},Then question renders cleanly with no raw token visible. |
| **FR51** | Reports show template text with tokens intact, not per-employee resolved values. | Given question with {{manager\_name}} in reports,When admin views Questions tab,Then template text shown with token, not a specific person's name. |

# **6\. Edge Cases & Error Handling**

| State / Scenario | Behavior |
| :---- | :---- |
| **All questions in a section are hidden by rules** | Section entirely hidden. No section header or empty card shown to respondent. |
| **Branch trigger range partially overlaps** | Publish blocked. Inline error highlights overlapping ranges. |
| **Multi-select: branched option AND other options selected simultaneously** | Branch question appears. No branch for non-branched options selected at the same time. |
| **Respondent changes rating after seeing child question** | Child hidden immediately; answer cleared. If new rating matches different child, that child appears. |
| **Employee attribute changes after survey launch** | Rules evaluated at instance generation; post-launch changes do not affect active instances. |
| **Branch question left blank** | Optional by default — same skip behavior as base questions. was\_answered \= false, was\_shown \= true. |
| **All employees excluded by visibility rules for a section** | Section shows as Not Measured across all report views. No false zero scores. |
| **Export — driver Not Measured for a dimension** | Row includes measured\_flag \= Not Measured, your\_score \= blank, shown\_count \= 0\. |
| **Anonymity threshold breach on branch question cohort** | Score suppressed per existing threshold rules. Not Measured is distinct from Suppressed. |
| **CSV import — BRANCH row references non-existent parent** | Import fails: 'Row N: parent\_question\_id \[X\] not found in this import.' |
| **Dynamic survey with zero eligible employees overall** | Summary tab shows warning: 'No employees matched the configured visibility rules.' |

# **7\. Competitive & UX Notes**

## **Competitive Intelligence — Branch Scoring Decision**

The following finding from competitive research directly informs the 'branch questions excluded from driver scores' decision and validates it against the market leader's methodology.

* **Workday Peakon — Subdrivers vs. Branch questions are architecturally distinct:** Peakon's subdrivers are static, always-shown rating questions with equal weighting into the driver score. Each driver has 1 core question and up to 4 subdriver questions, all equally weighted. Every respondent who sees the driver sees all subdriver questions. There is no conditional logic. This is fundamentally different from CultureMonkey's branch questions, which are conditionally shown to a biased subset. Peakon has not merged these two concepts — nor should CultureMonkey.

* **Qualtrics — Branching and scoring are explicitly decoupled:** Branch logic guides respondents through questions, but scoring categories are configured separately. Branched questions only contribute to a score if the admin manually adds them to a scoring category. This validates the CultureMonkey decision to treat driver contribution as an explicit, separate configuration — not an automatic consequence of question type.

* **The market gap CultureMonkey fills:** No competitor in the employee engagement space has solved conditional diagnostic follow-ups well. Peakon supports only free-text comments after a score. CultureMonkey's support for Rating, Single Select, and Multi-Select branch questions is a genuine differentiator — but only if the scoring boundary is clean and clearly communicated to admins.

## **Patterns to Adopt**

* **SurveyMonkey / Typeform — visual flow diagram:** A lightweight visual map of parent → children in the canvas helps admins understand routing without reading rule text.

* **Qualtrics — per-question exposure context:** Shows 'N asked this question' vs 'N responded' on every question card in reports. Adopt on all question detail views (FR37).

* **Culture Amp — section grouping with audience preview:** 'Who will see this section?' summary panel directly on the section card reduces admin guesswork.

* **Microsoft Forms — inline branch preview:** 'If respondent answers X, they'll see…' shown directly in the builder reduces errors.

## **Patterns to Avoid**

* **Showing N/A as a score (e.g. 0.0):** Zero scores for unmeasured drivers destroy trust. Always use 'Not Measured' with grey styling.

* **Complex boolean builders:** OR / nested groups create exponential admin complexity. AND-only for MVP.

* **Hiding branch structure in reports:** Analysts lose context. Always surface trigger metadata in Questions tab and Text Responses tab.

## **Differentiation Opportunity**

* Enterprise-grade multi-attribute AND rules combined with exposure-aware reporting is a meaningful gap in most mid-market survey tools.

* Extending branch question types beyond free-text (rating, single/multi-select) is a concrete differentiator vs competitors who only support open-ended follow-ups.

# **8\. Analytics & Success Metrics**

## **8.1 Success Metrics**

| Metric | Baseline | Target (90 days) |
| :---- | :---- | :---- |
| Survey participation rate (dynamic vs static) | \~58% avg | \>66% for dynamic surveys |
| Branch question response rate (shown → answered) | N/A | \>72% |
| Admins using visibility rules (% of surveys with ≥1 rule) | 0% | \>35% within 60 days |
| Not Measured cell analytics complaints | Needs verification | 0 post-launch |
| Avg questions shown / max questions (relevance ratio) | 100% | \<80% (more targeted) |

## **8.2 Instrumentation Events**

| Event Name | Trigger | Properties |
| :---- | :---- | :---- |
| survey\_rule\_added | Admin saves section/question rule | rule\_type, attribute\_name, operator, account\_id |
| branch\_question\_created | Admin saves branch question | parent\_q\_type, trigger\_type, child\_q\_type, account\_id |
| branch\_question\_shown | Branch appears to respondent | parent\_question\_id, trigger\_value, child\_question\_id, survey\_id |
| branch\_question\_answered | Respondent submits branch answer | parent\_question\_id, child\_question\_id, child\_q\_type, survey\_id, excluded\_from\_driver\_score: true |
| not\_measured\_cell\_hovered | Admin hovers Not Measured heatmap cell | driver\_id, dimension, survey\_id, account\_id |
| not\_measured\_modal\_opened | Admin clicks Not Measured cell | driver\_id, dimension, survey\_id |
| branch\_responses\_tab\_selected | Admin selects Branch Responses in Text tab | survey\_id, filter\_applied, account\_id |
| csv\_import\_with\_rules | CSV import contains SECTION/BRANCH rows | row\_count, rule\_count, branch\_count, validation\_result |

# **9\. Dependencies**

| Dependency | Notes |
| :---- | :---- |
| **culturemonkey (Rails core)** | Survey builder, rule storage, employee attribute evaluation, CSV import, all report controllers. |
| **ClickHouse schema** | New was\_shown / was\_answered columns required. Exposure base queries (E/S/R) added. |
| **report-service (Node)** | PDF/PPTX exports must render Not Measured cells and respect measured\_flag in exports. |
| **AccountSetting: ENABLE\_DYNAMIC\_SURVEY\_LOGIC** | New flag. Off by default. Enabled per-tenant during phased rollout. |
| **AccountSetting: ENABLE\_BRANCH\_QUESTION\_TYPES** | Controls non-free-text branch types. Phase 2 rollout gate. |
| **Employee attribute service** | Attribute resolution available synchronously at survey instance generation time. |
| **Anonymity threshold logic** | Not Measured must be clearly distinct from Suppressed in all UI and export surfaces. |

# **10\. Rollout Plan**

## **Phase 1 — MVP (\~6 weeks)**

* Section-level and question-level visibility rules (FR1–FR6).

* Branch questions: Rating, Single Select, Multi Select; multiple children per parent; all four child types (FR7–FR14).

* Exposure-aware reporting: E/S/R bases, Not Measured heatmap, participation fix, Summary tab header, Insights exclusions, Questions tab exposure, Text Responses branch classification (FR15–FR43).

* Rollout gate: AccountSetting::ENABLE\_DYNAMIC\_SURVEY\_LOGIC per tenant.

* Internal pilot: 3 enterprise customers (manufacturing, tech, BFSI) with active pulse programs.

## **Phase 2 — Enhancements (\~4 weeks post Phase 1\)**

* CSV import with branch and rule support (FR47–FR48).

* Question placeholders (FR49–FR51).

* AccountSetting::ENABLE\_BRANCH\_QUESTION\_TYPES enabled for pilot tenants.

* Benchmark tab Not Measured rendering (FR44–FR46).

* Section exposure counts in Questions tab (FR34).

## **Phase 3 — Future (Post v2)**

* OR logic in visibility rules.

* Answer piping (injecting previous answer text into later questions).

* Static subdrivers (US.24): pre-defined, always-shown rating questions added to a driver at survey creation, equally weighted into driver score, benchmarkable. Architecturally distinct from branch questions. No conditional logic involved.

* Manager dashboard exposure-aware driver score recalculation.

# **11\. Risks & Mitigations**

| Risk | Severity | Mitigation |
| :---- | :---- | :---- |
| ClickHouse schema changes for was\_shown / was\_answered may break existing analytics pipelines. | **High** | Additive columns only. Default was\_shown \= true for all existing surveys. Run shadow writes before cutover. |
| Admin complexity: many custom attributes may create rules resulting in 0 employees seeing a section. | **Medium** | Add 'Preview for employee type' simulator. Warn inline when rule results in 0 eligible employees. |
| Branch question performance: client-side reveal for surveys with 50+ questions on low-end devices. | **Medium** | Pre-fetch all branch questions in initial payload (lazy render, not lazy fetch). Benchmark on 3G. |
| Backward compatibility: metric shifts if was\_shown defaults not correctly applied to historical data. | **High** | Require DB migration dry-run with comparison report before releasing to production. |
| CSV import complexity: malformed branch rows hard to debug for non-technical HR admins. | **Low** | Downloadable row-level error report with human-readable messages. Annotated CSV template provided. |
| Not Measured UX misread: admins interpret grey cells as 'suppressed' rather than 'not asked'. | **Medium** | Distinct visual treatment for Not Measured vs Suppressed (different icon \+ tooltip copy). Onboarding tooltip on first encounter. |

# **12\. Open Questions**

| \# | Question | Who to Ask / Info Needed |
| :---- | :---- | :---- |
| **1** | When a respondent changes a parent rating after submitting (moving from 4 to 8), should the already-submitted child answer be cleared silently or should a confirmation prompt appear before hiding the child? | Product \+ UX. Silent clear is simpler; prompt is safer for data quality. Affects branch\_question\_answered event firing. |
| **2 ✓ CLOSED** | Branch questions contributing to driver scores — RESOLVED: Branch questions are permanently excluded from driver score calculations regardless of child question type. The Peakon competitive model (equal-weight static subdrivers) and Qualtrics (decoupled branching and scoring) both validate this decision. Engineering should implement excluded\_from\_driver\_score \= true as a hardcoded system rule, not an admin-configurable toggle. A separate Phase 3 story (US.24) covers static subdrivers. | Decision owner: Product. No further input needed. Close this item. |
| **3** | For Not Measured rows in the Benchmark export — should the row be included (with measured\_flag \= Not Measured and blank score) or excluded entirely? Leadership reporting workflows vary by customer. | CS team \+ 2–3 enterprise customers. Inclusion recommended for transparency; needs validation. |
| **4** | For branch Rating questions with a driver tag stored (future subdriver use): should the admin UI show a visible 'Driver tag saved for future use' indicator, or is the tag silently stored with no admin-facing feedback in this release? | Product \+ UX. Surfacing it reinforces the Phase 3 roadmap and manages admin expectations. Risk: may confuse admins who expect it to score now. |

# **Appendix: Data Model Sketch**

| Entity / Field | Description |
| :---- | :---- |
| **SectionRule** | Belongs to Section. Stores attribute, operator, values\[\]. Evaluated server-side at survey start. |
| **QuestionRule** | Belongs to Question. Same structure as SectionRule. ANDs with parent section rule. |
| **BranchQuestion** | parent\_question\_id, child\_question\_id, trigger\_type (RATING\_RANGE / SELECT\_OPTION), trigger\_values (JSON), excluded\_from\_driver\_score (bool, always true — system-set, not admin-configurable), driver\_tag (optional, stored for Phase 3 use only, has no effect on current scoring). |
| **SurveyResponseExposure** | survey\_id, participant\_id, question\_id, was\_shown (bool), was\_answered (bool). One row per participant × question. |
| **Question.is\_branch** | true if this question is a child. Prevents '+ Add Branch' UI appearing on children. |
| **Question.branch\_depth** | 0 for base questions, 1 for children. Enforces max depth \= 1\. |
| **Question.excluded\_from\_driver\_score** | true for all branch questions (system-set). false for all base questions. Used in score aggregation queries to filter the question set. |
| **AccountSetting: ENABLE\_DYNAMIC\_SURVEY\_LOGIC** | Master feature flag. Off by default. |
| **AccountSetting: ENABLE\_BRANCH\_QUESTION\_TYPES** | Enables non-free-text branch types. Phase 2 flag. |
| **Phase 3 future — SubdriverQuestion** | New model (not in this release): parent\_driver\_id, question\_id, weight (default: equal). Static, always-shown. Contributes to driver score. Architecturally separate from BranchQuestion. |

*— End of Document —*

CultureMonkey Product  |  Dynamic Survey Logic PRD v2.2  |  CONFIDENTIAL