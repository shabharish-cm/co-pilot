# PRD: Sub-drivers for Engagement Scoring

---

## 1. Document Information

| Field | Detail |
|---|---|
| **Feature Name** | Sub-drivers |
| **Status** | Draft |
| **Version** | 1.0 |
| **Date** | 2026-03-13 |
| **Author** | Product Team |
| **Stakeholders** | Product, Engineering, Design, QA, Data/Analytics Engineering |
| **Relevant Module** | Surveys · Reports · Settings · Lifecycle |

### Version History

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | 2026-03-13 | Product Team | Initial draft |

---

## 2. Vision — Working Backwards Press Release

**Product Name:** Sub-drivers — Granular Engagement Intelligence for CultureMonkey

**Target Customer:** HR Leaders, People Analytics teams, and Managers using CultureMonkey to run engagement surveys and act on results.

**The Problem:** Today, CultureMonkey surfaces engagement at the driver level — for example, a Leadership score of 6.2 or a Management score of 7.4. While this gives a directional signal, it tells HR teams *which* area is underperforming but not *why*. To diagnose the root cause, admins must manually scan individual question scores — a time-consuming, error-prone process that scales poorly across many cohorts. Large organisations with multiple business units find themselves unable to give managers specific, actionable guidance beyond "Leadership needs attention."

**The Solution & Benefits:** Sub-drivers introduce a structured, intermediate scoring layer between a Driver and its Questions. A driver such as Leadership is now decomposed into named facets — Strategic Vision, Transparency & Communication, and Values & Ethics — each with its own score. HR teams can immediately see that Leadership's Communication facet is at 4.8 while Vision is at 7.9, enabling targeted interventions rather than vague recommendations. The platform ships with a curated default sub-driver taxonomy (45 sub-drivers across 15 default drivers, built on established I/O psychology frameworks) and supports fully custom sub-drivers for custom drivers.

**Company Quote:** *"We built Sub-drivers because organisations don't just want to know a driver is underperforming — they want to know exactly which facet to fix. Sub-drivers turn a directional signal into a precise action plan."*

**Customer Call To Action:** Sub-drivers are available to all accounts from the Settings → Drivers page. Admins can assign sub-drivers to questions during survey creation, and scores appear automatically in reports, heatmaps, and exports.

---

## 3. Problem Statement

### Background

**The "Why":** CultureMonkey's engagement scoring currently operates on a two-level hierarchy: Overall Engagement Score → Driver Score → Question Score. While driver scores provide strategic direction, they are too broad to drive precise interventions. A single driver may contain questions about fundamentally different facets — for example, "Leadership" encompasses both how leaders communicate *direction* and whether they model *values*. Aggregating these into one score obscures the difference between them. Introducing Sub-drivers bridges this gap, moving CultureMonkey's analytics capability to match the depth offered by Workday Peakon, Microsoft Viva Glint, and Qualtrics EX.

**Current State:** Admins who want sub-driver-like insight today must manually review individual question scores within a driver drilldown, mentally group related questions, and calculate informal averages. This is entirely manual, not surfaced in exports, and not accessible to managers. Many customers resort to building custom Excel analyses on exported data.

**Proposed Solution:** Add a configurable Sub-driver layer within each Driver. Sub-drivers are account-level entities (within the tenant). Each survey question instance is optionally assigned to a Sub-driver at survey-creation time. Sub-driver scores are computed and surfaced across reports, heatmaps, exports, and lifecycle analytics.

### Customer Feedback & Concerns *(Inference — needs validation with specific customer quotes)*

- **Pain Point 1:** "We know Leadership is low, but we can't tell our managers *what* to fix." — HR Director persona
- **Pain Point 2:** Analytics teams export raw question data and manually group questions into themes because the platform doesn't provide that grouping natively.
- **Pain Point 3:** Managers receiving driver scores without sub-driver breakdown feel the data is not actionable enough for 1:1 conversations.

---

## 4. Jobs To Be Done

**Primary JTBD — HR Admin / People Analytics:**
When reviewing survey results, I want to see scores broken down by meaningful sub-dimensions within each driver, so I can identify the specific facet that needs intervention rather than treating the entire driver as one problem.

**Secondary JTBD — Manager:**
When my team's Management score drops, I want to know whether it's my *accessibility*, my *feedback quality*, or my *fairness* that employees are rating poorly, so I can address the right behaviour specifically.

**Functional outcome:** Drill from Driver → Sub-driver → Questions in a single reporting flow.
**Emotional outcome:** Confidence that action plans are targeting the right root cause, not just the broadest symptom.
**Social outcome:** Managers and HR leaders can present data-backed, specific insights to leadership rather than vague engagement scores.

---

## 5. Success Metrics

| Objective | Key Result | Measurement |
|---|---|---|
| Drive feature adoption | 40% of active accounts configure at least one sub-driver within 90 days of launch | AccountSetting flag on + at least one sub-driver created |
| Improve report engagement | 25% increase in driver drilldown interactions in reports | Click events on driver drilldown post-launch vs. pre-launch |
| Reduce manual exports | 15% reduction in raw question-level XLS exports among accounts using sub-drivers | Export type tracking in analytics |
| Manager enablement | 30% of manager dashboard users expand sub-driver view at least once per survey cycle | UI interaction tracking |

---

## 6. User Personas

### Persona 1 — HR Admin (Super Admin / Sub Admin)
- **Role:** Configures surveys, reviews reports, presents results to leadership.
- **Goals:** Understand what's driving low engagement scores; give managers actionable data.
- **Context:** Reviews reports after a survey closes; may manage 10–50 drivers across multiple surveys.
- **Pain Points:** Driver scores alone don't justify specific interventions. Manually scanning questions is tedious.

### Persona 2 — People Analytics Lead
- **Role:** Builds custom analyses, exports data, tracks trends over time.
- **Goals:** Slice engagement data at multiple levels; export clean structured data for dashboards.
- **Pain Points:** Current export structure has no grouping below driver level; custom grouping must be done in Excel.

### Persona 3 — Manager
- **Role:** Views team-specific engagement scores; plans team actions.
- **Goals:** Understand which specific behaviour or process to improve to move a driver score.
- **Pain Points:** "Leadership score is 5.9" is not enough to guide a conversation with a direct report.

---

## 7. Approved UX Flow

*(Approved in Phase 1 — updated with clarifications from product review)*

### Entry Points by Surface

| Surface | Entry Point |
|---|---|
| Sub-driver Configuration | Settings → Drivers → Expand driver → Manage Sub-drivers |
| Survey Creation | Create/Edit Survey → Questions tab → Add/Edit question → Driver + Sub-driver fields |
| Reports | Survey Report → Driver Drilldown → Sub-driver breakdown |
| Heatmap | Heatmap → Expand driver row → Sub-driver rows |
| Lifecycle Reports | Lifecycle → Reports → Driver Analysis → Expand driver |
| Exports | Reports → Export (PDF / PPTX / XLS / CSV) → Includes sub-driver scores |

---

### UX Flow 1 — Sub-driver Library Configuration (Settings)

1. Super Admin navigates to **Settings → Drivers**.
2. System loads the full driver list (default + custom drivers), each now showing an expandable sub-driver section.
3. Admin expands a driver (e.g., Leadership).
4. System loads sub-drivers for that driver. Default drivers show the pre-configured default sub-drivers (e.g., Strategic Vision, Transparency & Communication, Values & Ethics). Empty state shown for custom drivers that have no sub-drivers yet.
5. Admin clicks **+ Add Sub-driver**.
6. System displays an inline form: Name (required, unique within driver), Description (optional).
7. Admin saves. Sub-driver appears in the list and is immediately available for use in new surveys.
8. Admin can reorder sub-drivers via drag-and-drop. Order is reflected in reports.

**Alternative Flows:**
- **Edit sub-driver:** Admin edits name/description. If sub-driver is in use in a live or closed survey, a warning informs them the rename will reflect in reports.
- **Delete sub-driver (no questions):** Confirmation modal, then deletion proceeds.
- **Delete sub-driver (questions in draft survey):** Warning that affected questions will fall back to parent driver. Confirmation required.
- **Delete sub-driver (questions in live/closed survey):** Blocked. Error: *"This sub-driver is used in active or completed surveys and cannot be deleted."*

**UX States:**
- **Loading:** Skeleton rows while sub-drivers load.
- **Empty:** *"No sub-drivers added yet. Add sub-drivers to group related questions within this driver."*
- **Success:** Sub-driver appears inline with confirmation toast.
- **Error:** Validation error inline if name is duplicate or empty.

---

### UX Flow 2 — Assigning Sub-driver During Survey Creation

1. Admin creates or edits a survey and navigates to the **Questions** tab.
2. Admin clicks **+ Add Question** (custom question flow — primary path).
3. System displays the question creation form: Question text, Question type, Driver dropdown.
4. Admin selects a Driver. If the selected driver has sub-drivers configured, a **Sub-driver** dropdown appears dynamically below the Driver field.
5. Admin selects a Sub-driver. Question is saved with the sub-driver assignment on the survey-question record.
6. If the driver has no sub-drivers, the Sub-driver field remains hidden. Question is assigned directly to the driver (existing behaviour, unchanged).

*(For questions added from the question bank: same flow — question is copied into the survey as a new instance, and the driver/sub-driver fields are editable on that instance. The source question in the bank is unaffected.)*

**Alternative Flows:**
- Admin changes the Driver selection → Sub-driver dropdown resets and loads sub-drivers for the new driver.
- Admin selects a driver with no sub-drivers → Sub-driver field hidden, no action needed.
- Survey is live → Question assignments locked. Sub-driver field is read-only.

**UX States:**
- **Sub-driver dropdown loading:** Brief spinner on dropdown when driver is changed.
- **Empty (driver has no sub-drivers):** Sub-driver field hidden entirely.
- **Error:** If admin tries to save a question without selecting a sub-driver on a driver that requires it *(see FR5 for enforcement rule).*

---

### UX Flow 3 — Reports: Driver Drilldown with Sub-driver Breakdown

1. Admin navigates to a survey's **Report** page.
2. Admin views the driver score summary. Drivers with sub-drivers show a small expand icon (▸).
3. Admin clicks a driver to expand it.
4. System loads sub-driver scores for that driver (score, delta vs. previous survey, response count per sub-driver).
5. Admin can further click a sub-driver to drill into individual question scores beneath it (existing question-level drilldown, now nested under sub-driver).
6. Anonymity threshold is enforced: sub-driver scores for cohorts below the threshold are suppressed.

---

### UX Flow 4 — Heatmap with Sub-driver Rows

1. Admin views the **Heatmap** for a survey.
2. Each driver row now has an expand control (▸).
3. Admin expands a driver row → Sub-driver rows appear beneath it, spanning all demographic columns.
4. Sub-driver cells are colour-coded using the same red/amber/green thresholds as driver cells.
5. Admin can use "Expand all" / "Collapse all" toggle to manage view at once.

---

### UX Flow 5 — Lifecycle: Sub-driver Scores in Driver Analysis

1. Admin navigates to **Lifecycle → Reports → Driver Analysis**.
2. The driver analysis tab shows driver scores per lifecycle stage with an expand control.
3. Admin expands a driver → sub-driver scores appear per lifecycle stage.
4. Time-series lifecycle view (driver trends by stage) allows filtering to sub-driver level.

---

### UX Flow 6 — Exports Including Sub-driver Data

**PDF / PPTX:** Driver drilldown sections in PDF/PPTX reports list sub-driver scores beneath each driver (when sub-drivers are configured). Controlled by feature flag.

**XLS / CSV:** Raw score export includes a `sub_driver` column alongside the existing `driver` column. Sub-driver scores per demographic are included in the score sheets. If a question is not assigned to a sub-driver, the `sub_driver` column is blank for that row.

---

## 8. User Stories

| US# | Title | Description |
|---|---|---|
| **US.1** | Configure sub-drivers | As a Super Admin, I want to create, edit, reorder, and delete sub-drivers under each driver, so that I can organise questions into meaningful groups. |
| **US.2** | Use default sub-driver taxonomy | As a Super Admin, I want default sub-drivers pre-configured for CultureMonkey's 15 default drivers, so that I can start using sub-drivers without building the taxonomy from scratch. |
| **US.3** | Assign sub-driver to a survey question | As an HR Admin, I want to assign a sub-driver to each question when creating or editing a survey, so that scores are grouped into the right sub-categories. |
| **US.4** | View sub-driver scores in reports | As an HR Admin, I want to see sub-driver scores within the driver drilldown of a report, so that I can identify which specific facet of a driver is underperforming. |
| **US.5** | View sub-driver scores in heatmap | As an HR Admin, I want to expand driver rows in the heatmap to see sub-driver scores across demographics, so that I can spot which team or cohort is underperforming on a specific sub-driver. |
| **US.6** | View sub-driver scores in lifecycle reports | As an HR Admin, I want to see sub-driver scores in lifecycle driver analysis, so that I can track which sub-driver facets are weak at specific employee lifecycle stages. |
| **US.7** | Export sub-driver data | As a People Analytics Lead, I want sub-driver scores included in PDF, PPTX, and XLS/CSV exports, so that I can share granular engagement data with stakeholders without manual post-processing. |
| **US.8** | Manager views team sub-driver scores | As a Manager, I want to see sub-driver breakdowns in my team dashboard, so that I can have specific, evidence-backed conversations with my team about what to improve. |
| **US.9** | Backward compatibility | As an HR Admin with existing surveys, I want pre-sub-driver surveys to be completely unaffected, so that my historical data and reports remain accurate. |

---

## 9. Acceptance Criteria

| US# | Acceptance Criteria |
|---|---|
| **US.1** | Sub-driver can be created, saved, renamed, reordered, and deleted. Deletion is blocked if sub-driver is used in a live or closed survey. Deletion of a sub-driver used in a draft survey reassigns affected questions to the parent driver. |
| **US.2** | All 15 default drivers are pre-populated with 3 default sub-drivers each (45 total) on account provisioning when the feature flag is enabled. Default sub-drivers are visible in Settings → Drivers and can be renamed/hidden but not deleted. |
| **US.3** | When creating or editing a survey question, selecting a driver with sub-drivers shows a Sub-driver dropdown. Sub-driver assignment is stored on the survey-question record (not the question bank). Changing the driver resets the sub-driver selection. Questions added from the question bank behave identically. |
| **US.4** | Driver drilldown in reports shows sub-driver rows with: score (on the account-configured scale), delta vs. previous survey (if available), response count. Sub-driver scores are suppressed for cohorts below the anonymity threshold. Clicking a sub-driver drills into its questions. |
| **US.5** | Heatmap driver rows are expandable to reveal sub-driver rows. Sub-driver cells use the same colour thresholds as driver cells. "Expand all" / "Collapse all" toggle works correctly. Anonymity threshold suppression applies per sub-driver per cohort cell. |
| **US.6** | Lifecycle driver analysis shows sub-driver scores per lifecycle stage. Sub-driver time-series is filterable. |
| **US.7** | PDF/PPTX exports include sub-driver scores in driver sections when sub-drivers are configured. XLS/CSV exports include a `sub_driver` column. Export behaviour controlled by feature flag. |
| **US.8** | Manager dashboard driver breakdown is expandable to sub-driver level. Anonymity threshold enforced. |
| **US.9** | Surveys created before sub-driver feature launch show no sub-driver rows in any report. Driver scores for those surveys remain unaffected. No retroactive question reassignment occurs. |

---

## 10. Functional Requirements

### FR-Settings

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| **FR1** | System must store sub-drivers as tenant-scoped entities associated with a parent driver. | Sub-drivers are isolated per tenant (schema-based multi-tenancy). |
| **FR2** | Each sub-driver must have: Name (string, required, unique within driver), Description (string, optional), Display Order (integer), Parent Driver ID, Created/Updated timestamps. | All fields stored and editable. |
| **FR3** | Default drivers must be seeded with 3 default sub-drivers each when `ENABLE_SUB_DRIVERS` flag is activated for an account. | 45 sub-drivers seeded on activation; visible immediately in Settings → Drivers. |
| **FR4** | Default sub-drivers can be renamed and reordered but cannot be deleted. A "hide" toggle suppresses them from appearing in survey creation and reports without deleting them. | Rename + reorder work. Delete button absent for default sub-drivers. Hide toggle present. |
| **FR5** | Deletion of a sub-driver that has questions assigned in draft surveys must trigger a confirmation warning and reassign affected questions to the parent driver on confirmation. | Affected draft-survey questions have `sub_driver_id` set to null and retain their parent driver assignment. |
| **FR6** | Deletion of a sub-driver used in any live or closed survey must be blocked with an inline error message. | API returns 422 with error message; UI shows inline error. |

---

### FR-Survey Creation

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| **FR7** | Sub-driver assignment is stored on the survey-question record (the copied instance), not on the source question in the question bank. | `survey_questions` table has a nullable `sub_driver_id` FK. Source `questions` table is unchanged. |
| **FR8** | When a driver is selected during question creation/edit, if that driver has active sub-drivers, the Sub-driver dropdown renders dynamically. If the driver has no sub-drivers, the Sub-driver field is hidden. | Dropdown renders within 300ms of driver selection. |
| **FR9** | Changing the driver selection resets the Sub-driver dropdown to blank/unselected. | Sub-driver field clears on driver change. |
| **FR10** | Sub-driver assignment is optional. A question may be assigned to a driver without a sub-driver even when sub-drivers exist for that driver. | No validation error when sub-driver is left blank. Question is treated as directly-assigned to driver for scoring purposes. |
| **FR11** | Sub-driver fields are read-only on questions in live surveys. | Sub-driver field disabled in UI for live-survey questions; API rejects updates. |

---

### FR-Score Calculation

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| **FR12** | Sub-driver score = average of 10-pt question scores for all questions assigned to that sub-driver across submitted (non-skipped) responses. | Matches formula: `sum(question_scores) / count(non_skipped_responses)` per sub-driver. |
| **FR13** | **Option A (Industry Standard — Recommended):** Driver score, when the driver has at least one sub-driver with data, = simple average of sub-driver scores (equal weighting). Sub-drivers with no data (score = null) are excluded from the average. | `driver_score = sum(subdriver_scores_with_data) / count(subdrivers_with_data)`. Engineering may choose Option B (see FR14) based on implementation constraints. |
| **FR14** | **Option B (Alternative):** Driver score = average of all question scores across all sub-drivers under that driver (question-count weighted — consistent with current calculation). | `driver_score = sum(all_question_scores) / count(all_non_skipped_questions)`. This is CultureMonkey's existing calculation and requires no change to the driver score formula. |
| **FR15** | Drivers with no sub-drivers assigned calculate score exactly as today: average of all question scores directly assigned to the driver. Backward compatible. | Score for pre-sub-driver surveys and drivers-without-sub-drivers is unchanged. |
| **FR16** | Anonymity threshold applies at the sub-driver level per cohort. If a cohort has fewer responses than the threshold for a sub-driver, that sub-driver score is suppressed (shown as "–") for that cohort. | Same threshold logic applied at sub-driver granularity as currently applied at driver granularity. |
| **FR17** | Overall engagement score calculation is unchanged: average of all driver scores. | Overall score unaffected by sub-driver introduction. |

> **Engineering Note on FR13 vs FR14:** Option A (equal-weighted by sub-driver) is the industry standard used by Workday Peakon and aligns with psychometric best practice — it ensures each sub-driver facet has equal influence on the driver score regardless of how many questions it contains. Option B preserves the current question-count-weighted approach and requires no change to the existing driver score formula, making it lower-risk to implement. Engineering should assess the migration/calculation impact and choose accordingly. The choice must be documented and communicated to customers at launch.

---

### FR-Reports

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| **FR18** | Driver drilldown in the report view must show sub-driver rows below the driver header, each displaying: sub-driver name, score, delta vs. previous survey (if available), response count. | Sub-driver rows render within existing drilldown component. |
| **FR19** | Clicking a sub-driver row must drill into its individual question scores (extending the existing question-level drilldown, now nested under sub-driver). | Existing question-level drilldown works when triggered from sub-driver context. |
| **FR20** | Drivers without sub-drivers must display the existing question-level drilldown directly (unchanged). | No regression in current drilldown behaviour. |
| **FR21** | Demographic filter (cohort) applied in the report must also filter sub-driver scores. Anonymity threshold enforced per sub-driver per cohort. | Sub-driver scores recalculate on cohort filter change. Suppression applied where threshold is not met. |

---

### FR-Heatmap

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| **FR22** | Driver rows in the heatmap must have an expand/collapse control when the driver has sub-drivers. | Expand icon (▸) present on driver rows with sub-drivers. No icon on drivers without sub-drivers. |
| **FR23** | Expanding a driver row must render sub-driver rows spanning all demographic columns. Each cell shows the sub-driver score for that demographic. | Sub-driver rows render in correct column positions. |
| **FR24** | Sub-driver cells must use the same colour thresholds (red/amber/green) as driver cells. | Colour logic applied to sub-driver score values identically to driver score values. |
| **FR25** | "Expand all sub-drivers" and "Collapse all sub-drivers" toggle controls must be available in the heatmap toolbar. | Toggle correctly expands/collapses all expandable driver rows. |
| **FR26** | Anonymity threshold suppression applies per sub-driver per demographic cell. Suppressed cells show "–". | Same suppression logic as current driver/demographic cell suppression. |

---

### FR-Lifecycle Reports

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| **FR27** | The Lifecycle Driver Analysis tab must support expanding a driver to show sub-driver scores per lifecycle stage. | Sub-driver rows visible per stage when driver is expanded. |
| **FR28** | Sub-driver time-series in lifecycle must be filterable (by lifecycle stage, driver, sub-driver). | Filter controls for sub-driver dimension present in lifecycle time-series view. |

---

### FR-Exports

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| **FR29** | PDF and PPTX exports must include sub-driver scores in driver sections when sub-drivers are present. Controlled by `ENABLE_SUB_DRIVER_IN_EXPORT` feature flag. | Sub-driver rows appear in driver sections of PDF/PPTX output when flag is enabled. |
| **FR30** | XLS/CSV raw exports must include a `sub_driver_name` column and `sub_driver_score` column alongside existing `driver_name` and `driver_score` columns. | Export files contain the new columns. Rows for questions not assigned to a sub-driver have blank `sub_driver_name` and `sub_driver_score`. |

---

### FR-Manager Dashboard

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| **FR31** | Manager dashboard driver breakdown must support expanding a driver to show sub-driver scores for the manager's team. | Same expand/collapse pattern as heatmap. Anonymity threshold enforced at team level. |

---

### FR-Feature Flag

| ID | Requirement | Acceptance Criteria |
|---|---|---|
| **FR32** | All sub-driver functionality must be gated behind `AccountSetting::ENABLE_SUB_DRIVERS`. Accounts without the flag see zero UI changes. | Feature entirely invisible when flag is off. No regression for existing accounts. |

---

## 11. Non-Functional Requirements

### Performance

- Sub-driver score computation must not increase report load time by more than **500ms** for surveys with up to 50 drivers and 3 sub-drivers each, across up to 10,000 respondents.
- Heatmap with sub-driver rows expanded must load within the existing heatmap SLA. ClickHouse aggregations for sub-driver scores must be materialized/pre-computed, not computed on read.
- Sub-driver dropdown in survey creation must render within **300ms** of driver selection.

### Data Integrity

- Sub-driver score calculation must exclude skipped questions (consistent with existing question score calculation).
- Sub-driver assignment on a survey-question is immutable once the survey is live.
- Deletion of a driver is blocked if it has sub-drivers assigned in any live or closed survey.

### Security & Access Control

- Sub-driver configuration (create, edit, delete) is restricted to **Super Admin** role only.
- Sub-admin users can assign sub-drivers to questions in surveys within their scoped access but cannot manage the sub-driver library.
- Sub-driver scores in reports, heatmaps, and exports respect all existing role-based access control and cohort-scoping rules.

### Backward Compatibility

- All surveys created before sub-driver feature activation must be completely unaffected in scoring, reporting, and export behaviour.
- Accounts with the feature flag off see no UI or data changes.

### Scalability

- Sub-driver data model must support up to **50 sub-drivers per driver** and **unlimited sub-drivers per account** (within reasonable DB constraints).
- ClickHouse schema for sub-driver aggregations must support multi-tenant isolation via the existing `tenant_id` partitioning strategy.

---

## 12. Dependencies

| Dependency | Type | Notes |
|---|---|---|
| `sub_drivers` table in PostgreSQL | New DB table | Tenant-scoped. FK to `drivers` table. Indexed on `driver_id`, `account_id`. |
| `survey_questions.sub_driver_id` column | DB schema change | Nullable FK to `sub_drivers`. Applied via migration. No backfill required. |
| ClickHouse sub-driver aggregation tables | New analytics schema | New materialized views/tables for `sub_driver_scores` per survey, cohort, lifecycle stage. Analytics engineering dependency. |
| `AccountSetting::ENABLE_SUB_DRIVERS` flag | New feature flag | Must be added to AccountSetting and admin flag management UI. |
| `AccountSetting::ENABLE_SUB_DRIVER_IN_EXPORT` flag | New feature flag | Controls sub-driver inclusion in PDF/PPTX/XLS exports. Can be same flag or separate. |
| `report-service` (Node, PDF/PPTX) | Existing service update | Needs sub-driver score data in report payload and updated template rendering. |
| XLS/CSV export pipeline | Existing pipeline update | New `sub_driver_name` and `sub_driver_score` columns. |
| Manager dashboard frontend | Existing component update | Expand/collapse sub-driver rows in driver breakdown. |
| Lifecycle analytics engine | Existing engine update | Sub-driver dimension in lifecycle driver analysis. |
| Settings → Drivers UI | Existing page update | Add sub-driver management UI (expand, add, edit, reorder, delete). |
| Survey creation — Questions tab | Existing component update | Dynamic Sub-driver dropdown on question form. |

---

## 13. Implementation Strategy

### Prioritisation (Value vs. Effort)

| Phase | Scope | Value | Effort |
|---|---|---|---|
| **Phase 1 — Foundation** | Data model, feature flag, Settings UI, Survey Creation sub-driver assignment | High | Medium |
| **Phase 2 — Core Reporting** | Score calculation, Reports drilldown, Heatmap sub-driver rows | High | High |
| **Phase 3 — Exports & Lifecycle** | PDF/PPTX/XLS exports, Lifecycle driver analysis sub-driver view, Manager dashboard | Medium-High | Medium |

### Default Sub-driver Taxonomy (Seeded on Flag Activation)

The following 45 sub-drivers are seeded for the 15 default drivers:

| Driver | Sub-driver 1 | Sub-driver 2 | Sub-driver 3 |
|---|---|---|---|
| **Autonomy** | Decision-Making Freedom | Work Method Flexibility | Schedule Flexibility |
| **Work Environment** | Physical Workspace | Tools & Equipment | Psychological Safety |
| **Leadership** | Strategic Vision | Transparency & Communication | Values & Ethics |
| **Management** | Support & Accessibility | Feedback & Coaching | Fairness & Respect |
| **Work Life Balance** | Workload Manageability | Boundary Respect | Recovery & Rest |
| **Involvement** | Decision Participation | Voice & Input | Change Involvement |
| **Communication** | Information Flow | Transparency | Two-way Dialogue |
| **Rewards** | Compensation Fairness | Benefits Satisfaction | Pay Transparency |
| **Recognition** | Frequency of Recognition | Quality of Recognition | Peer Recognition |
| **Growth & Development** | Career Pathing | Learning Opportunities | Mentorship & Coaching |
| **Purpose Alignment** | Mission Connection | Role Impact | Values Alignment |
| **Innovation** | Idea Generation | Risk-Taking Culture | Innovation Support |
| **Wellness** | Mental Health Support | Physical Well-being | Stress Management |
| **Meaningful Work** | Sense of Accomplishment | Task Significance | Job Fit |
| **Social Connection** | Team Relationships | Cross-team Collaboration | Sense of Belonging |

---

## 14. Rollout Strategy

### Phase 1 — Internal / Beta (Weeks 1–6)
- Activate `ENABLE_SUB_DRIVERS` flag for internal CultureMonkey accounts and 2–3 design partner customers.
- Deliver: Settings management UI + survey creation sub-driver assignment.
- Goal: Validate taxonomy, UX flows, and data model correctness before report surfaces.

### Phase 2 — Limited GA — Reporting Surfaces (Weeks 7–12)
- Activate for 20–30% of accounts (existing customers, tiered by size).
- Deliver: Score calculation + reports drilldown + heatmap sub-driver rows.
- Goal: Validate score accuracy, ClickHouse performance, and adoption patterns.

### Phase 3 — Full GA (Weeks 13–18)
- Activate for 100% of accounts.
- Deliver: Exports + lifecycle reports + manager dashboard sub-driver view.
- Monitor adoption metric (40% account activation target within 90 days of full GA).

### Flag-based Safety
All sub-driver functionality remains behind `ENABLE_SUB_DRIVERS`. Rollback is a flag flip — no data migration required to disable.

---

## 15. Out of Scope (Non-Goals — MVP)

- Cooper / AI assistant (MCP) sub-driver queries — post-MVP
- Feedback module sub-driver tagging — post-MVP
- Actions (Acts) created at sub-driver level — post-MVP
- Pulse report sub-driver breakdown — post-MVP
- Cross-account sub-driver benchmarking — future roadmap
- Weighted sub-driver contribution settings (custom weights per sub-driver) — future roadmap
- Sub-driver level focus area / key driver recommendations in AI insights — post-MVP

---

## 16. Appendix — Competitive Research Summary

| Platform | Sub-driver Approach | Score Roll-up |
|---|---|---|
| **Workday Peakon** | 14 drivers × up to 4 sub-drivers; fixed taxonomy; psychometrically validated | Equal-weighted average of sub-driver scores per driver |
| **Microsoft Viva Glint** | 6 People Success Elements (construct-level grouping); not labelled as "sub-drivers" | Mean score per construct (average of questions within construct) |
| **Culture Amp** | No structural sub-driver layer; statistical Impact Analysis identifies highest-impact questions per driver | Statistical correlation (Kendall's tau-c) not averaging |
| **Qualtrics EX25** | Flat 25-driver structure; no sub-drivers | Average of questions per driver |
| **CultureMonkey (current)** | No sub-driver layer | Average of all question scores per driver |
| **CultureMonkey (proposed)** | Optional 3-level hierarchy; curated defaults + custom; hybrid approach | Option A (equal-weighted, recommended) or Option B (question-count weighted, lower-effort) |

**Sources:**
- [Workday Peakon: Driver and Question Scores](https://doc.workday.com/peakon/en-us/workday-peakon-employee-voice/insights/reporting/jhr1652699600891.html)
- [Workday Peakon: Measure Employee Engagement](https://blog.workday.com/en-us/measure-employee-engagement.html)
- [Microsoft Viva Glint: People Science](https://learn.microsoft.com/en-us/viva/glint/start/people-science-viva-glint)
- [Microsoft Viva Glint: Driver Impact Report](https://learn.microsoft.com/en-us/viva/glint/reports/driver-impact-report)
- [Culture Amp: Driver Analysis](https://www.cultureamp.com/blog/driver-analysis-employee-survey)
- [Workleap: 15 Key Drivers of Employee Engagement](https://workleap.com/blog/drivers-employee-engagement)
