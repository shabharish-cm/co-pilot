# PRD: Talent Management — Skill Gap Analysis
Standalone competency assessment module enabling manager-rated skill evaluations, org-wide gap heatmaps, and longitudinal talent development tracking

Version 1.0  |  CultureMonkey Product  |  Status: Draft  |  Date: 2026-03-25

---

# 1. TL;DR

| Problem |
| :---- |
| Enterprise HR teams manage competency assessments in Excel spreadsheets — managers manually score direct reports, compare against benchmarks by hand, and email files to HR for aggregation. There is no heatmap, no history, no audit trail, and no cross-team visibility. |
| Each assessment cycle produces a new standalone file. Talent development progress is invisible. Promotion and development decisions lack an auditable evidence base. |
| HR admins cannot see systemic competency gaps across teams without manually stitching together exports. L&D investments are made on anecdote, not data. |

| Solution & Expected Impact |
| :---- |
| A standalone Talent Management module (Skill Gap Analysis pillar) built natively into CultureMonkey. Admins upload skill frameworks via CSV; Super/Sub Admins trigger assessment cycles; managers rate direct reports against benchmarks inside a fast, focused input UI; results surface as a filterable Employee × Skill heatmap with longitudinal history and a full audit trail. Expected impact: eliminate Excel-based competency management entirely, enable org-wide gap visibility in one dashboard, and create a defensible longitudinal record of talent development decisions. |

---

# 2. Context & Problem Statement

## 2.1 Background
- CultureMonkey is an employee engagement platform with strong survey, heatmap, and feedback analytics capabilities. It does not yet have a talent/competency management capability.
- Alumil — a large enterprise manufacturing customer headquartered in Greece (EU) — has formally requested a Talent Management module as an expansion of their subscription. Skill Gap Analysis is the first pillar.
- The customer's current workflow: HR maintains a master Excel template defining skills, descriptions, importance ratings, and required proficiency levels per team. Templates are distributed manually to managers, who fill in scores for each direct report, then return them to HR for aggregation.
- The QR survey approach was explored as a short-term workaround but was deemed the wrong UX model for manager-assessed competency data. It is being abandoned in favour of a purpose-built module.
- **Critical architectural constraint:** Talent Management is a standalone module — it does not reuse the survey builder, Drivers architecture, engagement survey workflows, or existing survey reporting infrastructure. Purpose-built data model required.

## 2.2 Real-World Enterprise Use Cases
- **UC-1 — Manager 1:1 / Development Conversation Prep:** A team manager at Alumil has quarterly development reviews with each direct report. Today they open a shared Excel file, enter scores manually per skill, and try to eyeball where the gaps are. With this feature, the manager opens their assessment form, selects the active cycle, and rates each direct report in a focused UI that shows the benchmark inline — completing the task in minutes and walking into their 1:1 with a structured, data-backed view.
- **UC-2 — HR Org-Wide Talent Planning:** An HRBP at Alumil is preparing for a leadership pipeline review. Today they collect Excel files from 12 managers and manually build a summary spreadsheet. With this feature, they open the heatmap, apply filters by department and role, and instantly see which skills are systemically under-developed across teams — without touching a spreadsheet.
- **UC-3 — Competency Program Setup:** An HR Admin is launching a new competency framework for the Engineering org. Today they build a new Excel template, maintain version control manually, and re-distribute to 15 managers. With this feature, they upload a CSV, assign skills to teams, and trigger an assessment cycle — all inside the platform. Version control is the platform's problem.
- **UC-4 — Promotion/Transfer Decision Support:** An HRBP is justifying a promotion recommendation for a senior employee. Today they have no historical record of competency progression — only the most recent Excel file, if it was saved. With this feature, they view the employee's assessment history across Q1–Q4 cycles, with an audit trail showing who rated what and when.

## 2.3 Customer Feedback & Concerns
- *"Feedback will be displayed in raw data format as well as a heatmap (need to clarify how this will be shown for each individual employee)."* — Discovery notes, Alumil, 2026-03-17
- *"Should support periodic assessment with history"* — Research Q&A, 2026-03-24
- *"There should be an audit trail for the edits, even super admins and sub admins can edit but should have trail."* — Research Q&A, 2026-03-24
- *"Identifies talent & future leaders / Develops talent / Minimizes recruitment costs / Identifies & addresses competency gaps"* — Alumil strategic objectives, 2026-03-17
- *(Inference — needs validation)* Managers want to see the benchmark inline while entering scores — not only in post-submission reports. If the gap is only visible after submission, the input experience loses the real-time correction value.
- *(Inference — needs validation)* HRBPs want to filter the heatmap to surface only employees/skills below benchmark — not just see all scores equally.

---

# 3. User Stories & Scope

## 3.1 Target Audience
- **Primary — Manager:** Assesses each direct report's skill levels within an active cycle. Sees their team's heatmap. Edits their own prior submissions. Does not see indirect reports or other teams.
- **Secondary — Super Admin:** Creates and manages the global skills library. Triggers assessment cycles. Views heatmap across all teams and all managers in their account. Can edit any submission in scope (with audit trail). If also a manager, uses a separate toggle to switch into manager view for assessing their own direct reports.
- **Tertiary — Sub Admin / HRBP:** Scoped view and management following existing CultureMonkey account-level access configuration. Can trigger cycles, view heatmap, and edit submissions within their defined scope. Same toggle behavior as Super Admin if they also have direct reports.
- **End consumer — Employee:** Is assessed by their manager. Does not interact with the Skill Gap Analysis module directly in V1. Their data is visible to their manager, and to admins within scope.

## 3.2 User Stories — Skills Library

| US# | Title | Description | Priority |
| :---- | :---- | :---- | :---- |
| **US.1** | Upload skill framework via CSV | As a Super Admin, I want to upload a CSV file defining skills with their descriptions, importance ratings, and required levels, so that I can onboard a competency framework without manually re-entering data. | MVP — Must |
| **US.2** | Download CSV upload template | As a Super Admin, I want to download a pre-formatted CSV template, so that I know the exact structure required for a valid upload. | MVP — Must |
| **US.3** | Assign skills to teams | As a Super Admin, I want to assign one or more skills to specific teams, so that different teams can have different (or overlapping) skill frameworks. | MVP — Must |
| **US.4** | Manager creates team-scoped skill | As a Manager, I want to create a new skill that is automatically scoped to my team, so that I can add team-specific competencies not defined globally by HR. | MVP — Should |
| **US.5** | View skills library | As a Super Admin, I want to view all skills defined in the platform with their descriptions, importance ratings, required levels, and team assignments, so that I can audit and manage the competency framework. | MVP — Must |

## 3.3 User Stories — Assessment Cycles

| US# | Title | Description | Priority |
| :---- | :---- | :---- | :---- |
| **US.6** | Create assessment cycle | As a Super Admin or Sub Admin, I want to create a named assessment cycle (e.g., "Q1 2026") with a start date and end date, so that assessments are versioned and time-bounded. | MVP — Must |
| **US.7** | Assign teams to cycle | As a Super Admin, I want to specify which teams are included in a given assessment cycle, so that not all teams need to participate in every cycle. | MVP — Must |
| **US.8** | View cycle status | As a Super Admin, I want to see how many managers have submitted assessments for a given cycle vs. total managers assigned, so that I can track completion. | MVP — Should |
| **US.9** | Close/archive a cycle | As a Super Admin, I want to close an active assessment cycle so that no new submissions are accepted after the cycle end, and historical data is preserved. | MVP — Must |

## 3.4 User Stories — Manager Assessment Flow

| US# | Title | Description | Priority |
| :---- | :---- | :---- | :---- |
| **US.10** | Select active cycle and employee to assess | As a Manager, I want to select an active assessment cycle and then choose a direct report to assess, so that I can enter skill ratings in the right context. | MVP — Must |
| **US.11** | Rate employee per skill with benchmark visible | As a Manager, I want to see each skill's description, importance, and required level inline while I'm entering a rating, so that I can calibrate my rating against the benchmark without switching screens. | MVP — Must |
| **US.12** | Submit and edit own assessment | As a Manager, I want to submit my ratings for an employee and be able to return and edit them (before and after cycle close by Super Admin), with all edits logged, so that I can correct mistakes without losing history. | MVP — Must |
| **US.13** | Toggle to manager view (for admins who are also managers) | As a Super Admin or Sub Admin who also has direct reports, I want a toggle that switches my view from org-wide admin mode to my own team's manager assessment mode, so that I can conduct assessments for my direct reports without conflating my admin and manager roles. | MVP — Must |

## 3.5 User Stories — Heatmap Reporting

| US# | Title | Description | Priority |
| :---- | :---- | :---- | :---- |
| **US.14** | View Employee × Skill heatmap | As an HR Admin or Manager, I want to see a heatmap with employees as rows and skills as columns, showing each employee's actual rating per skill, with color coding indicating performance relative to the benchmark, so that I can quickly identify where gaps are concentrated. | MVP — Must |
| **US.15** | View Role and Overall Skill Level columns | As an HR Admin, I want to see the employee's role and their overall skill level (average across all skills) as dedicated columns in the heatmap, so that I can segment and compare employees by role at a glance. | MVP — Must |
| **US.16** | See benchmark score in heatmap | As an HR Admin or Manager, I want to see the benchmark (required level) for each skill — either as a tooltip on hover or as a reference row — so that I can immediately understand whether a score represents a gap. | MVP — Must |
| **US.17** | Filter heatmap by segment | As an HR Admin, I want to filter the heatmap by Department, Location, Manager, and other standard segments (aligned with the existing survey heatmap filters), so that I can isolate gaps within specific parts of the org. | MVP — Must |
| **US.18** | Filter by below-benchmark | As an HR Admin or Manager, I want to filter the heatmap to show only employees whose actual score is below the required level for one or more skills, so that I can focus on employees or skills requiring immediate attention. | MVP — Must |
| **US.19** | Switch cycle in heatmap | As an HR Admin, I want to switch between historical cycles in the heatmap, so that I can compare current vs. prior period competency profiles. | MVP — Must |
| **US.20** | Export heatmap data | As an HR Admin, I want to export the heatmap data as a CSV or XLSX file, so that I can perform additional analysis or share results with stakeholders. | MVP — Must |
| **US.21** | View individual employee competency profile | As a Manager or HR Admin, I want to click an employee in the heatmap to see their full competency profile — current scores vs. benchmarks per skill, across all cycles they've been assessed in — so that I have a longitudinal view of their development. | MVP — Should |

## 3.6 User Stories — Audit Trail

| US# | Title | Description | Priority |
| :---- | :---- | :---- | :---- |
| **US.22** | View edit history for a rating | As a Super Admin, I want to see a log of all edits made to any rating in the system — including who made the edit, what changed, and when — so that all assessment data is fully auditable. | MVP — Must |

## 3.7 Out of Scope (This Release)
- **Employee self-assessment** — Alumil model is manager-assessed only. Self-assessment involves a different input model, consent flows, and potential anonymity implications. Deferred to a future release.
- **In-product skill editing after upload** — V1 is upload-defined; benchmarks and skill definitions are locked once uploaded. In-product editing adds version control complexity. CLOSED DECISION for V1.
- **PDF / visual heatmap export** — Customer confirmed CSV/XLSX is sufficient for V1.
- **9-Box Grid / Performance Management** — Related but separate initiative; will be a distinct PRD and module built as an extension of Talent Management data.
- **Talent Mobility / Talent Pool** — Free-text and preference capture for internal mobility. Separate feature, separate PRD.
- **Development goal linking** — Linking skill gaps to action plans or L&D initiatives. Candidate for V2 after usage data validates the gap identification workflow.
- **Importance-weighted gap scoring** — The gap visual in V1 shows actual score vs. benchmark. Weighting by skill importance is a V2 enhancement once the base heatmap is validated.
- **In-app notifications for cycle completion or low submission rate** — Useful but not blocking V1 value delivery.

---

# 4. User Experience & Design

## 4.1 Skills Library (Admin)

**Entry point:** Top-level "Talent Management" section in the admin navigation (separate from Surveys). Sub-navigation: Skills Library | Assessment Cycles | Heatmap.

**Skills Library flow:**
- Landing shows a table of all skills in the account: Skill Name, Description, Skill Importance (1–5 with label), Skill Level Required (1–5 with label), Teams Assigned.
- Primary CTA: "Upload Skills" — opens a CSV upload drawer.
  - Upload drawer: Download Template button (downloads pre-formatted CSV matching the Alumil model: Skill Name, Skill Description, Skill Importance, Skill Level Required, Team Name).
  - File upload zone with drag-and-drop and file picker.
  - On upload: server-side validation runs inline; errors shown row-by-row with column reference (e.g., "Row 4: Skill Importance must be between 1 and 5").
  - On success: preview of parsed rows with row counts; confirm to commit.
- Secondary CTA: "Add Skill" — inline form for Super Admin to add a single skill manually.
- Manager-created skills appear in the library with a "Team Skill" badge and the creating manager's team name. Super Admins can promote a team skill to global.

| State / Scenario | Behavior |
| :---- | :---- |
| **Empty state (no skills uploaded)** | Illustration + "Your competency framework starts here" + "Upload Skills" CTA + "Download Template" link |
| **Skills uploaded, none assigned to teams** | Warning banner: "X skills are not assigned to any team. Assign skills to teams before creating an assessment cycle." |
| **CSV upload — validation error** | Row-level error list shown in the drawer; upload not committed until errors resolved or user dismisses and retries |
| **CSV upload — duplicate skill name** | Warning: "Skill 'Business Acumen' already exists. Uploading will update its description and ratings — existing assessment data will not be changed." Confirm or cancel. |
| **Loading** | Skeleton table rows during initial load |

## 4.2 Assessment Cycle Management (Admin)

**Entry:** Talent Management > Assessment Cycles.

**Cycle creation flow:**
- "New Cycle" button opens a modal: Cycle Name (e.g., "Q1 2026"), Start Date, End Date.
- After creation, admin lands on the Cycle Detail page: shows Cycle Name, Dates, Teams Included, Submission status (# managers submitted / total).
- Admin assigns teams to the cycle from a multi-select list of existing teams.
- Each team card shows the skills assigned to that team (from Skills Library).
- "Activate Cycle" button makes it visible to managers.

| State / Scenario | Behavior |
| :---- | :---- |
| **No cycles exist** | Empty state with "Create your first cycle" CTA |
| **Cycle active** | Status badge "Active"; managers can submit; admin can view live submission count |
| **Cycle past end date** | System auto-flags as "Closing Soon" 7 days before end date; admin must manually close |
| **Cycle closed** | Status badge "Closed"; no new submissions; historical data preserved; visible in heatmap cycle selector |
| **Cycle activated with no teams assigned** | Validation error: "Add at least one team before activating." |

## 4.3 Manager Assessment Form

**Entry:** Manager navigates to Talent Management > My Team Assessments. Sees a list of active cycles they are included in.

**Assessment flow:**
1. Manager selects an active cycle.
2. Sees a list of direct reports, each with a status badge: Not Started | In Progress | Submitted.
3. Manager clicks an employee name — opens the assessment form for that employee in that cycle.
4. Form displays a table: each row is a skill. Columns: Skill Name, Description, Skill Importance, Required Level (benchmark), My Rating (1–5 selector).
5. As the manager selects a rating, a visual indicator shows whether the rating is at/above/below the benchmark — in real time, before submission.
6. "Save as Draft" and "Submit" CTAs at the bottom.
7. After submission: manager can return and edit. All edits are logged (actor, field, old value, new value, timestamp).

**Admin "My Team" toggle flow (for Super/Sub Admins who also manage direct reports):**
- In the admin Heatmap view, a toggle in the top bar: "Switch to Manager View".
- Toggling switches the UI to the manager assessment form, scoped to the admin's own direct reports.
- The toggle is visually prominent and labeled clearly: "You are now in Manager View — assessing your own direct reports only."
- Toggling back: "Return to Admin View".

| State / Scenario | Behavior |
| :---- | :---- |
| **Manager has no direct reports** | Empty state: "No direct reports found in your org hierarchy. Contact your Super Admin." |
| **Cycle exists but manager's team not included** | Empty state: "This cycle doesn't include your team. Contact your HR Admin." |
| **Employee assessed in a prior cycle but not current cycle** | Current cycle shows Not Started; prior cycle data visible in Employee Profile view |
| **Rating left blank on submit** | Validation: "Please rate all skills before submitting." Rows with missing ratings highlighted. |
| **Draft saved** | "Draft saved" toast. Status remains "In Progress". |
| **Submitted** | "Assessment submitted" toast. Status changes to "Submitted". Edit still available. |

## 4.4 Heatmap Report View

**Entry:** Talent Management > Heatmap.

**Heatmap structure:**
- Rows: Employees
- First column: Employee Name
- Second column: Role
- Skill columns: one per skill assigned to the selected team/cycle scope
- Last column: Overall Skill Level (simple average of all rated skills for that employee, shown to 1 decimal place)
- Color coding: Each skill cell is colored based on how the actual rating compares to the benchmark — Red (below by 2+), Orange (below by 1), Yellow (at benchmark), Green (above benchmark). Color scale derived from Actual vs. Required Level.
- Hovering a cell shows a tooltip: Skill Name | Actual: X | Required: Y | Importance: Z.
- A benchmark reference row can be toggled on/off — shows the Required Level for each skill as a fixed header row.

**Filters (aligned with existing survey heatmap):**
- Cycle selector (dropdown — select from all historical and active cycles)
- Department, Location, Manager, Role, Tenure, and other standard employee attribute filters
- "Below Benchmark" toggle — when on, grays out all cells where Actual ≥ Required; highlights only at-risk cells

**Export:** "Export to CSV/XLSX" button in top right — exports visible heatmap data including all filters applied.

| State / Scenario | Behavior |
| :---- | :---- |
| **No cycle selected** | Prompt: "Select a cycle to view results." |
| **Cycle active, no submissions yet** | Empty heatmap rows with placeholder cells; "Waiting for manager submissions" note |
| **Employee not yet assessed in selected cycle** | Row shown with empty/gray cells and "Not assessed" label |
| **Single skill across all employees below benchmark** | "Below Benchmark" toggle highlights entire skill column |
| **Loading heatmap** | Skeleton grid with shimmer animation |
| **Filter applied, no results** | Empty state: "No employees match the selected filters." |

## 4.5 Employee Competency Profile (Detail View)

**Entry:** Click any employee row in the heatmap.

**Profile view:**
- Employee name, role, department, manager.
- Cycle selector at the top — shows all cycles the employee has been assessed in.
- Per-cycle: skill ratings table (Skill, Importance, Required, Actual, vs Benchmark indicator).
- Trend panel: if 2+ cycles exist, shows a trend chart per skill (simple line, score over cycles).
- Audit log tab: shows all rating edits for this employee across all cycles — actor, field, old value, new value, timestamp.

| State / Scenario | Behavior |
| :---- | :---- |
| **First cycle, no history** | Trend section hidden; note: "History will appear after the next assessment cycle." |
| **Employee assessed in some cycles but not all** | Cycle selector shows all cycles; cycles where employee was not assessed show "Not assessed for this cycle" |

## 4.6 Accessibility & Copy Guidelines
- All heatmap cells must have ARIA labels including skill name, employee name, actual rating, and required rating for screen readers.
- Color coding must not rely on color alone — cell tooltips and explicit Actual/Required values must be accessible to color-blind users.
- Import drawer: all error messages must reference specific row numbers and column names.
- **Copy guideline:** Use "Required Level" (not "benchmark score" or "target") consistently in all UI labels. Use "Actual Level" (not "given score" or "rating input"). Use "Assessment Cycle" (not "survey" or "form"). Talent Management is a distinct module — never use survey terminology here.

---

# 5. Detailed Functional Requirements

## 5.1 Skills Library Management

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR1** | System accepts CSV upload containing: Skill Name (required, string), Skill Description (required, string), Skill Importance (required, integer 1–5), Skill Level Required (required, integer 1–5), Team Name (optional, string) | Given a Super Admin uploads a valid CSV, When the upload completes, Then all parsed skills appear in the Skills Library with correct field values and team assignments. |
| **FR2** | System validates CSV on upload and returns row-level errors before committing any data | Given a CSV with invalid data (e.g., Skill Importance = 6), When the admin submits the upload, Then the system shows an error list identifying the exact row number and column name for each invalid field, and no records are committed. |
| **FR3** | System provides a downloadable CSV template with correct column headers and an example row | Given a Super Admin clicks "Download Template", When the download completes, Then the file contains the correct headers (Skill Name, Skill Description, Skill Importance, Skill Level Required, Team Name) and one example row. |
| **FR4** | Super Admin can assign any skill to one or more teams | Given a skill exists in the library, When a Super Admin edits the team assignments, Then the skill appears in the assessment form for all assigned teams and is removed from unassigned teams in future cycles. |
| **FR5** | Manager can create a skill scoped to their team only | Given a Manager creates a new skill, When the skill is saved, Then it is assigned exclusively to the manager's team and appears in the Skills Library with a "Team Skill" badge. Super Admins can see it but it is not available to other teams by default. |
| **FR6** | Duplicate skill names within the same account trigger a confirmation step, not a silent overwrite | Given a Super Admin uploads a CSV with a skill name that already exists, When the system detects the duplicate, Then it presents a confirmation dialog explaining the impact before allowing the overwrite. |

## 5.2 Assessment Cycle Management

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR7** | Super Admin and Sub Admin can create named assessment cycles with start and end dates | Given a Super Admin creates a cycle named "Q2 2026" with dates 2026-04-01 to 2026-06-30, When the cycle is saved, Then it appears in the Cycle List with "Draft" status and the specified dates. |
| **FR8** | Admin can activate a cycle, making it visible and submittable by managers in assigned teams | Given a cycle is in Draft status with at least one team assigned, When the Super Admin clicks "Activate", Then the cycle status changes to "Active" and assigned managers see it in their assessment dashboard. |
| **FR9** | System tracks submission completion per cycle per manager | Given an active cycle with 10 assigned managers, When 6 managers have submitted, Then the cycle detail page shows "6/10 managers submitted." |
| **FR10** | Admin can manually close a cycle | Given an active cycle, When a Super Admin clicks "Close Cycle", Then the cycle status changes to "Closed", no new submissions are accepted, and historical data is preserved and accessible in the heatmap. |

## 5.3 Manager Rating Flow

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR11** | Manager sees only direct reports in their assessment form — never indirect reports | Given a Manager navigates to their assessment form for any cycle, When the employee list renders, Then only employees where `manager_id = current_user.id` in the org hierarchy are shown. |
| **FR12** | Assessment form shows Skill Name, Description, Importance, Required Level, and a 1–5 rating input per skill, all in one view | Given a Manager opens an employee's assessment form, When the form loads, Then every skill assigned to that team in the cycle is shown in a table with all four fields and a rating selector visible simultaneously. |
| **FR13** | Real-time gap indicator shown as manager enters a rating | Given a Manager selects a rating of 2 for a skill with Required Level = 4, When the rating is entered, Then an inline visual indicator (e.g., colored badge: "Below Required") appears on the same row without a page reload. |
| **FR14** | Manager can save a draft and return; draft data persists | Given a Manager saves a draft with 3 of 5 skills rated, When they navigate away and return, Then the previously entered ratings are pre-populated in the form. |
| **FR15** | Manager can edit a submitted assessment at any time during an active cycle; all edits are logged | Given a Manager has submitted ratings and edits one value, When the edit is saved, Then the audit log for that employee records: edited_by (manager ID), skill_name, old_value, new_value, timestamp. The submitted assessment reflects the updated value. |
| **FR16** | Super/Sub Admin who also has direct reports can switch to manager view via a toggle | Given a Super Admin with direct reports is on any Talent Management admin screen, When they click "Switch to Manager View", Then the UI re-renders as the manager assessment interface showing only the admin's direct reports. The admin-level navigation persists so they can switch back. |

## 5.4 Heatmap & Reporting

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR17** | Heatmap renders as Employee × Skill grid with Role column and Overall Skill Level column | Given an admin views the heatmap for a closed cycle, When the data loads, Then: rows = employees, columns = assigned skills + Role + Overall Skill Level; all submitted rating values are displayed; no unsubmitted employees appear as blank rows with "Not assessed" label. |
| **FR18** | Cell color coding indicates relationship to benchmark | Given a skill with Required Level = 4: When Actual = 2, Then cell color is Red; Actual = 3, Then Orange; Actual = 4, Then Yellow; Actual = 5, Then Green. |
| **FR19** | Benchmark row is toggleable and shows Required Level per skill | Given the admin enables the benchmark row toggle, When it renders, Then a fixed header row below the column headers shows each skill's Required Level value. |
| **FR20** | Heatmap tooltip shows Actual, Required, and Importance on hover | Given a user hovers over any heatmap cell, When the tooltip appears, Then it displays: Skill Name, Actual Level (value + label), Required Level (value + label), Skill Importance (value + label). |
| **FR21** | "Below Benchmark" filter grays out at-benchmark and above-benchmark cells | Given the admin enables the "Below Benchmark" toggle, When the filter applies, Then cells where Actual ≥ Required are rendered in neutral gray; cells where Actual < Required retain their color coding. |
| **FR22** | Standard segment filters (Department, Location, Manager, Role, Tenure) apply to heatmap | Given the admin selects "Department = Engineering", When the filter applies, Then only employees in Engineering are shown as rows in the heatmap. |
| **FR23** | Cycle selector allows switching between any historical or active cycle | Given multiple cycles exist (Q4 2025, Q1 2026), When the admin selects Q4 2025, Then the heatmap re-renders with the Q4 2025 assessment data. |
| **FR24** | Export produces a CSV/XLSX with all currently visible heatmap data | Given the admin has applied filters (e.g., Department = Engineering) and clicks Export, When the file downloads, Then it contains only the filtered rows and columns visible in the current heatmap view, including the Role and Overall Skill Level columns. |
| **FR25** | Overall Skill Level is computed as a simple average of all actual ratings for an employee in the cycle | Given an employee has been rated 2, 4, 3 across three skills, When the Overall Skill Level column renders, Then it displays 3.0. |

## 5.5 Audit Trail

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR26** | Every write to a rating field (create or update) is logged with actor, timestamp, old value, new value | Given any user (Manager, Sub Admin, Super Admin) creates or edits a rating, When the action is committed, Then an audit log entry is created with: user_id, user_role, employee_id, cycle_id, skill_id, old_value (null for new entries), new_value, timestamp. |
| **FR27** | Audit log is viewable on the Employee Competency Profile page | Given a Super Admin opens an employee's profile and navigates to the Audit tab, When the tab loads, Then all audit entries for that employee across all cycles are shown in reverse-chronological order. |
| **FR28** | Audit log is not editable by any user — including Super Admins | Given any user attempts to delete or modify an audit log entry, Then the system returns a 403 Forbidden response. The audit log is append-only. |

## 5.6 Access Control

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR29** | Manager can only view and submit ratings for their direct reports | Given a Manager navigates to the assessment form, When they attempt to load an employee not in their direct reports list, Then the system returns a 403 and logs the attempt. |
| **FR30** | Sub Admin's heatmap and cycle views are scoped to their account-level configuration | Given a Sub Admin with scope = "APAC region", When they view the heatmap, Then only employees within the APAC region are shown. Attempting to view out-of-scope data returns 403. |
| **FR31** | Super Admin's admin view is not restricted by their manager role | Given a Super Admin who also has direct reports, When they view the org-wide heatmap in admin mode, Then they see all teams' data — including their own direct reports' data as submitted by themselves in manager mode — without any scoping applied. |

---

# 6. Edge Cases & Error Handling

| State / Scenario | Behavior |
| :---- | :---- |
| **CSV upload with 0 valid rows** | Error toast: "No valid skills found. Check your file against the template and try again." Upload is not committed. |
| **CSV upload with partial errors** | System shows row-level errors for invalid rows; does not commit partial uploads — all rows must be valid before committing. |
| **Super Admin is also a manager — accesses org-wide heatmap** | Admin view shows their own direct reports' data alongside all other teams. Data is not excluded. Admin can see their own manager submissions in the heatmap. |
| **Super Admin is also a manager — another admin tries to edit the Super Admin's manager submissions** | System restricts editing of any manager's submissions to: (a) the manager themselves, or (b) a Super/Sub Admin using the admin edit path (with audit trail). Not a silent restriction — admin who edits via admin path gets a confirmation: "You are editing another manager's submission. This will be logged." |
| **Manager has no assigned skills for the active cycle** | Assessment form shows empty state: "No skills assigned to your team for this cycle. Contact your HR Admin." |
| **Employee removed from org hierarchy mid-cycle** | Their prior ratings in the active cycle are preserved. They are hidden from the active manager assessment form but remain visible in historical heatmaps. |
| **Assessment cycle end date passes without admin closing it** | System auto-flags as "Overdue — Close Required." No new submissions accepted after end date + 7 days unless Super Admin extends it manually. Admins receive an in-app notification. |
| **Overall Skill Level where some skills were not rated** | Overall Skill Level is computed only over skills that have a rating. A "(partial)" label is appended to the value if fewer than all skills are rated. |
| **Export with no data (empty heatmap after filters)** | Export button is disabled with tooltip: "No data to export. Adjust your filters." |
| **Heatmap load failure** | Error state with retry CTA: "Could not load heatmap data. Try again." |
| **Duplicate employee in CSV upload (same Skill Name + Team Name)** | Row-level error flagged; duplicate rows not committed. |

---

# 7. Competitive & UX Notes

## Competitive Intelligence
- **Lattice:** Role-based competency targets; manager-fills ratings; delta (gap) shown visually per skill. Strong manager UX — fast, single-screen input per employee. Tightly coupled to performance review cycle.
- **15Five:** Skill heatmaps per team; benchmarking against role expectations. Good filter depth for HR admins. Less focused on standalone skill management — skills are sub-features within a broader review.
- **Skills Base:** Live heatmaps, role-based targets, gap scoring with color coding — architecturally the closest analog to what is being built. CSV-based skill import. Standalone module with its own navigation.
- **Culture Amp:** Competency reviews manager-driven; development goals linked to gaps. Strong longitudinal tracking and trend views. High complexity — configuring a competency framework in Culture Amp requires significant setup effort.

## Patterns to Adopt
- **Skills Base — Employee × Skill heatmap as primary view:** This is the canonical view for skill gap analysis. Employees as rows, skills as columns, color-coded by score level. Do not collapse to team aggregates as the primary view — employee-level granularity is the core value.
- **Lattice — Inline benchmark on manager input form:** Showing the Required Level in the same row as the rating input is critical UX. The gap insight must be available while the manager is rating, not only in reports.
- **Skills Base — CSV import with downloadable template as V1 onramp:** Reduces setup friction for accounts coming from Excel. Do not require in-product skill building as the only path.

## Patterns to Avoid
- **Self-assessment flows:** Not in scope; Alumil's model is manager-assessed only. Adding self-assessment in V1 splits the input model and creates averaging/conflict resolution complexity.
- **Building Talent Management inside the Survey Builder:** The survey wrapper is the wrong UX and data model for competency assessment. This was explicitly abandoned (QR workaround). Keep modules independent.
- **Complex skill taxonomy or browsing library:** V1 is upload-defined. Skill hierarchies, sub-categories, and library browsing UX should wait until there is evidence of user demand.

## Differentiation Opportunity
- CultureMonkey can lead on the **admin-triggered, cycle-based assessment model** — a structured, versioned workflow that makes competency tracking feel as organized and intentional as a survey launch cycle, not an ad hoc spreadsheet exercise.
- The **heatmap filter alignment with survey heatmap** is a meaningful unlock — HR admins already know how to use CM's segment filters; applying the same mental model to competency data reduces the learning curve and enables cross-module insight (engagement vs. competency by segment).

---

# 8. Analytics & Success Metrics

## 8.1 Success Metrics

| Metric | Baseline | Target (90 days post-launch) |
| :---- | :---- | :---- |
| Manager assessment completion rate per cycle | N/A (Excel — no tracking) | ≥ 80% of assigned managers submit within cycle window |
| Time to create and activate an assessment cycle (admin) | N/A | ≤ 10 minutes end-to-end for a returning admin |
| Heatmap adoption (% of admins viewing heatmap after a cycle closes) | N/A | ≥ 70% of accounts with a closed cycle view the heatmap |
| Export usage | N/A | ≥ 50% of heatmap sessions include at least one export |
| Alumil pilot CSAT | N/A | ≥ 4/5 on "Does this replace your current Excel workflow?" |
| Support tickets related to skill gap analysis workflow | N/A | < 5 tickets per month from pilot accounts in first quarter |

## 8.2 Instrumentation Events

| Event Name | Trigger | Properties |
| :---- | :---- | :---- |
| `talent_mgmt_skills_csv_uploaded` | Super Admin completes a CSV upload (success) | account_id, skill_count, team_assignments_count |
| `talent_mgmt_skills_csv_error` | CSV upload fails validation | account_id, error_count, error_types[] |
| `talent_mgmt_cycle_created` | Admin creates a new assessment cycle | account_id, cycle_id, team_count |
| `talent_mgmt_cycle_activated` | Admin activates a cycle | account_id, cycle_id |
| `talent_mgmt_cycle_closed` | Admin closes a cycle | account_id, cycle_id, submission_rate (submitted/total) |
| `talent_mgmt_assessment_started` | Manager opens an employee's assessment form | account_id, cycle_id, manager_id (hashed) |
| `talent_mgmt_assessment_submitted` | Manager submits an employee's assessment | account_id, cycle_id, manager_id (hashed), skill_count, skills_below_benchmark |
| `talent_mgmt_assessment_edited` | Any user edits a previously submitted rating | account_id, cycle_id, edited_by_role (manager/sub_admin/super_admin) |
| `talent_mgmt_heatmap_viewed` | Admin or Manager opens the heatmap view | account_id, cycle_id, user_role |
| `talent_mgmt_heatmap_filtered` | User applies a segment filter | account_id, filter_type, below_benchmark_toggle_on |
| `talent_mgmt_heatmap_exported` | User clicks Export | account_id, cycle_id, row_count, format (csv/xlsx) |
| `talent_mgmt_employee_profile_viewed` | User opens an individual employee competency profile | account_id, employee_id (hashed), cycle_count_available |
| `talent_mgmt_admin_manager_toggle` | Super/Sub Admin toggles between admin and manager views | account_id, direction (to_manager/to_admin) |

---

# 9. Dependencies

| Dependency | Notes |
| :---- | :---- |
| **Existing persona-based access control (Admin, Sub-Admin, Manager)** | Extend existing access model to scope Talent Management data. No rebuild required — new permission namespace `talent_management.*` added to existing role definitions. |
| **Org hierarchy (manager ↔ direct report relationships)** | Manager's direct reports list is derived from the existing employee directory / org hierarchy. Must be accurate before assessments can be scoped correctly. Stale hierarchy data is a data quality risk. |
| **Heatmap visualization component** | Adapt the existing engagement heatmap visual framework for the Employee × Skill axis. Color coding logic will differ (actual vs. required level, not engagement score bands). Confirm with engineering whether the existing component is parameterizable or requires a fork. |
| **CSV import/export infrastructure** | Existing CSV export capability in reports module may be reusable. CSV import with row-level validation is new. |
| **ClickHouse / analytics data store** | Confirm with engineering: does heatmap data live in the primary database or ClickHouse? Assessment data is not time-series-heavy (cycles are periodic snapshots) — primary DB is likely sufficient for V1 with pagination. |
| **AccountSetting: ENABLE_TALENT_MANAGEMENT** | New feature flag — off by default. Enabled per-tenant during phased rollout. Controls visibility of the Talent Management top-level navigation and all sub-pages. |
| **Audit log infrastructure** | Append-only audit log per entity (skill rating). Confirm whether existing audit log infrastructure (if any) can be reused or whether a new table is needed. Must be immutable — no soft deletes. |

---

# 10. Rollout Plan

## Phase 1 — MVP (~8 weeks)
- Skills Library: CSV upload with downloadable template, team assignment, Super Admin global skill view, Manager team-scoped skill creation.
- Assessment Cycles: Create, activate, close; team assignment; submission completion tracking.
- Manager Assessment Form: Per-employee rating with inline benchmark, save draft, submit, edit with audit trail.
- Admin/Manager toggle for admins with direct reports.
- Heatmap: Employee × Skill grid, Role column, Overall Skill Level column, benchmark toggle, standard segment filters, Below Benchmark filter, cycle selector, tooltip.
- Audit trail: full write log on all rating fields; viewable on employee profile.
- Export: CSV/XLSX.
- Multi-cycle history: cycle selector in heatmap; employee profile cross-cycle view.
- Rollout gate: `AccountSetting::ENABLE_TALENT_MANAGEMENT` per tenant.
- Pilot: Alumil account + 1–2 internal test accounts.

## Phase 2 — Enhancements (~4 weeks post Phase 1)
- In-product skill editing (edit name, description, importance, required level post-upload — currently out of scope).
- Heatmap trend view: sparkline per skill column showing score trajectory across cycles.
- Importance-weighted gap visualization: weight the heatmap color coding or an overlay score by skill importance rating.
- Cycle completion notifications: in-app alert to Super Admin when submission rate drops below threshold before cycle close date.
- Manager skill creation: more polished in-product skill creation flow (Phase 1 may be CSV-only for managers too).

## Phase 3 — Future (Post v1 launch)
- **9-Box Grid / Performance Management:** Separate PRD. Skill score from Talent Management feeds into the performance axis of the 9-Box model.
- **Development Goal Linking:** Allow admins and managers to create development actions directly from heatmap cells (e.g., "Add to L&D Plan" CTA on a below-benchmark cell).
- **Talent Mobility / Talent Pool:** Free-text and preference capture for internal mobility tracking — separate module, separate PRD.
- **Self-assessment mode:** Employee rates themselves; manager rates; side-by-side calibration view. Requires consent flow design.
- **PDF visual heatmap export:** For sharing with leadership or board-level audiences.
```
