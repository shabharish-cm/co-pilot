# PRD: Talent Management — Talent Pool

Standalone internal mobility intent module: HR-initiated branching survey + filterable talent pool dashboard

Version 1.0  |  CultureMonkey Product  |  Status: Draft  |  Date: 2026-03-26

---

# 1. TL;DR


| Problem                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HR Managers and HRBPs cannot identify internal talent for open roles, succession planning, or HIPO programs without a multi-day manual effort — because career intent data (relocation willingness, promotion readiness, career aspirations) is captured only as free text in annual performance reviews, visible only to the direct manager, and never aggregated or queryable at org level. |
| Internal talent pools exist as Excel spreadsheets that decay within 18 months because there is no structured mechanism to refresh them. Decisions default to manager nomination, which is documented to be biased and frequently inaccurate (40%+ of HIPO designations are below-average for leadership effectiveness).                                                                       |
| When a role opens, HR has no answer to "Who in Operations is promotion-ready and willing to relocate?" without manually cross-referencing HRIS records, manager conversations, and guesswork — by which time external hiring has already started.                                                                                                                                             |



| Solution & Expected Impact                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A standalone Talent Pool sub-module within CultureMonkey's Talent Management suite. Admins send a purpose-built branching survey (with conditional logic) to employees to capture structured career intent signals. Responses populate a filterable, exportable Talent Pool dashboard accessible only to Super and Sub Admins — queryable by relocation willingness, promotion readiness, career track interest, department, tenure, and location. HR can trigger new survey cycles on demand; prior-cycle data is retained, enabling intent-change tracking over time. Expected impact: replace manual talent research with a live, filterable internal candidate shortlist, reduce time-to-identify internal candidates from days to minutes, and introduce a bias-reducing self-declaration layer alongside manager nomination in succession decisions. |


---

# 2. Context & Problem Statement

## 2.1 Background

- CultureMonkey's Talent Management suite is being built as a series of purpose-built standalone modules: Skill Gap Analysis (launched), 9-Box Grid (in scope), and Talent Pool (this PRD). These three sub-modules share the same employee directory but have separate data stores, separate UX surfaces, and separate HR output views.
- Alumil — a large enterprise manufacturing customer headquartered in Greece — confirmed Talent Pool as the third Talent Management sub-module in their March 17, 2026 discovery discussion. The confirmed shape: an HR-initiated survey that captures employee mobility intent signals, with a dashboard output that allows HR to filter and identify internal candidates.
- The critical architectural decision (confirmed in research): Talent Pool is **not** a standard CultureMonkey survey. The survey engine must support branching/conditional question logic — a capability not available in the current CM survey builder. The output is a talent profile view, not an engagement report.
- CultureMonkey's existing survey infrastructure routes responses to engagement reporting. Talent Pool responses must route to a separate talent profile data store with a separate access control model (admin-only, not manager-visible).
- The standard CM survey builder was used by customers as a makeshift workaround prior to this module. It produced engagement report outputs, had no branching logic, and produced no filterable employee pool — confirming the workaround failure and the need for this purpose-built module.

## 2.2 Real-World Enterprise Use Cases

- **UC-1 — Internal Hiring Before External Posting:** An HRBP at Alumil needs to fill a Regional Operations Lead role in Athens. Before posting externally, they open the Talent Pool dashboard, filter by "Willing to relocate: Yes" + "Interested in promotion: Yes" + "Department: Operations" and get a shortlist of 4 employees within 30 seconds. They initiate conversations with 3. One is hired internally. External recruitment cost avoided.
- **UC-2 — Succession Planning for Critical Roles:** An HR Admin is preparing a succession plan for a senior Engineering Director leaving in Q3. They open the Talent Pool dashboard, filter by "Career track interest: Engineering Leadership" + "Tenure: 3+ years" + "Promotion readiness: Ready now or in 12 months" and produce a ranked shortlist for discussion at the talent review. The shortlist surfaces two employees the manager had not nominated — both of whom expressed leadership interest via the survey.
- **UC-3 — HIPO Program Entry Without Bias:** An organization wants to seed its new HIPO program without relying entirely on manager nominations. They cross-reference the Talent Pool dashboard (employees who declared interest in a leadership track) with manager nominations to identify employees who are high-potential self-declared but below the manager's visibility radar — specifically targeting undercounted groups.
- **UC-4 — Annual Talent Pool Refresh Cycle:** HR triggered the Talent Pool survey 14 months ago. An admin initiates a new cycle to capture updated intent signals. Employees who were previously unwilling to relocate and are now open are flagged automatically (prior vs. current cycle comparison available in the dashboard). HR's view of the talent pool reflects current reality, not year-old data.

## 2.3 Customer Feedback & Concerns

- *"Survey sent by HR to employees — not managers — to collect mobility intent signals."* — Alumil discovery discussion, 2026-03-17 (direct)
- *"Should support conditional/branching follow-up: if No to relocation, employee can provide reasons."* — Alumil discovery discussion, 2026-03-17 (direct)
- *"Dashboard: HR can filter and search employees by skills, relocation willingness, promotion readiness, and other dimensions. Export is needed."* — Alumil discovery discussion, 2026-03-17 (direct)
- *"Survey should be triggered by admins on demand."* — Open question answer confirmed post-discovery, 2026-03-26 (direct)
- *"Strictly Sub and Super Admins only [for dashboard access]."* — Open question answer confirmed post-discovery, 2026-03-26 (direct)
- *"Talent pool survey responses are non-anonymous."* — Open question answer confirmed post-discovery, 2026-03-26 (direct)
- *"Only 24.8% of organizations have implemented a formal career development process; 56.4% rely on informal or casual approaches."* — SHRM (corroborating industry evidence)
- *"HR professionals resort to LinkedIn to assess their own employees' skills."* — Gloat (corroborating workaround evidence)
- *(Inference — needs validation)* HR will want to compare current-cycle vs. prior-cycle responses per employee to see if intent has changed (e.g., now willing to relocate when previously not). This is implied by the admin-triggered cycle model but not explicitly confirmed as a dashboard feature requirement.
- *(Inference — needs validation)* Whether the dashboard should support free-text search across employee responses (in addition to structured dimension filters) is not yet confirmed — would be a secondary capability.

---

# 3. User Stories & Scope

## 3.1 Target Audience

- **Primary — Super Admin / Sub Admin (HR Manager, HRBP):** Designs and sends the Talent Pool survey; accesses the Talent Pool dashboard to filter, query, and export the talent pool; triggers new survey cycles. This is the sole consumer of Talent Pool output in V1.
- **Secondary — Employee:** Receives and completes the Talent Pool survey. Provides structured responses about their career intent, relocation willingness, promotion readiness, and future aspirations. Does not see the dashboard or any other employee's data.
- **Tertiary — Super Admin as platform configurator:** Manages the question set (if templates are reused across cycles), views cycle completion rates, and closes cycles after the target response window.
- **End consumer — Internal candidates:** Employees whose Talent Pool profiles are used by HR to shortlist them for roles. They do not interact with the module directly in V1 — their involvement ends at survey submission.

## 3.2 User Stories — Survey Design & Configuration


| US#      | Title                                         | Description                                                                                                                                                                                                                                                                   | Priority     |
| -------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| **US.1** | Create a Talent Pool survey                   | As a Super Admin, I want to create a new Talent Pool survey with a name, description, and target audience, so that I can initiate a structured intent-capture exercise for my organization.                                                                                   | MVP — Must   |
| **US.2** | Add questions with multiple response types    | As a Super Admin, I want to add questions to the survey using free-text, single-select, multi-select, or rating response types, so that I can capture both structured intent signals and qualitative career aspirations.                                                      | MVP — Must   |
| **US.3** | Add conditional/branching follow-up questions | As a Super Admin, I want to configure a follow-up question that only appears when the employee selects a specific answer (e.g., "Why not?" appears only if "No" is selected for relocation), so that I can capture qualitative context for negative or conditional responses. | MVP — Must   |
| **US.4** | Reorder questions in the survey               | As a Super Admin, I want to drag-and-drop questions into the desired order, so that the survey flows logically from general to specific intent questions.                                                                                                                     | MVP — Should |
| **US.5** | Preview the survey before sending             | As a Super Admin, I want to preview the survey as an employee would experience it — including conditional branches — so that I can validate the logic and wording before distribution.                                                                                        | MVP — Must   |
| **US.6** | Save a survey as draft before sending         | As a Super Admin, I want to save the survey in draft state, so that I can return and edit it across sessions before initiating distribution.                                                                                                                                  | MVP — Must   |
| **US.7** | Edit a draft survey                           | As a Super Admin, I want to edit question text, response options, and branching logic on a draft survey, so that I can refine the survey before sending.                                                                                                                      | MVP — Must   |


## 3.3 User Stories — Survey Distribution & Cycle Management


| US#       | Title                                             | Description                                                                                                                                                                                                     | Priority     |
| --------- | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| **US.8**  | Send survey to all employees or a defined segment | As a Super Admin, I want to send the survey to all employees or to a filtered subset (by department, location, or employee group), so that I can target specific populations when relevant.                     | MVP — Must   |
| **US.9**  | Set a response deadline                           | As a Super Admin, I want to set a deadline for survey responses, so that employees and admins have a clear close date for the current cycle.                                                                    | MVP — Should |
| **US.10** | View cycle completion rate                        | As a Super Admin, I want to see how many employees have responded out of the total invited for the active cycle, so that I can assess data coverage before using the dashboard for decisions.                   | MVP — Must   |
| **US.11** | Send a reminder to non-respondents                | As a Super Admin, I want to send a reminder notification to employees who have not yet completed the survey, so that I can improve response rates without manually tracking who has or hasn't responded.        | MVP — Should |
| **US.12** | Close a survey cycle                              | As a Super Admin, I want to manually close a survey cycle (before or after the deadline), so that no new responses are accepted and the snapshot is locked for archival.                                        | MVP — Must   |
| **US.13** | View prior survey cycles                          | As a Super Admin, I want to see a list of all prior Talent Pool cycles with their name, send date, close date, and response rate, so that I have an auditable history of when talent intent data was collected. | MVP — Must   |
| **US.14** | Initiate a new cycle from a prior survey template | As a Super Admin, I want to re-use a prior survey's question set when initiating a new cycle, so that I don't need to rebuild the survey from scratch for recurring talent pool refreshes.                      | MVP — Should |


## 3.4 User Stories — Employee Survey Experience


| US#       | Title                                 | Description                                                                                                                                                                                                                            | Priority     |
| --------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| **US.15** | Receive and complete the survey       | As an Employee, I want to receive a clear notification with a direct link to the Talent Pool survey, so that I can respond to it without friction.                                                                                     | MVP — Must   |
| **US.16** | Experience conditional question logic | As an Employee, I want follow-up questions to appear contextually based on my answers (e.g., a "Why?" field appears when I select "No" to relocation), so that I can provide relevant detail without being shown irrelevant questions. | MVP — Must   |
| **US.17** | Save progress and resume              | As an Employee, I want to save my partial responses and return to the survey later, so that I can complete it at my own pace without losing progress.                                                                                  | MVP — Should |
| **US.18** | Submit the survey                     | As an Employee, I want to submit my completed survey with a clear confirmation state, so that I know my responses were received.                                                                                                       | MVP — Must   |


## 3.5 User Stories — Talent Pool Dashboard


| US#       | Title                                                  | Description                                                                                                                                                                                                                                                       | Priority     |
| --------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| **US.19** | View Talent Pool dashboard                             | As a Super Admin or Sub Admin, I want to see a list of all employees who have completed the most recent Talent Pool cycle, so that I have a baseline view of my internal talent pool.                                                                             | MVP — Must   |
| **US.20** | Filter talent pool by relocation willingness           | As a Super Admin, I want to filter the talent pool by relocation willingness (Yes / No / Conditionally / Not specified), so that I can quickly identify employees open to geographic moves.                                                                       | MVP — Must   |
| **US.21** | Filter talent pool by promotion readiness              | As a Super Admin, I want to filter the talent pool by self-declared promotion readiness (Ready now / Ready in 6–12 months / Not ready / Not interested), so that I can identify employees ready for step-up roles.                                                | MVP — Must   |
| **US.22** | Filter talent pool by career track interest            | As a Super Admin, I want to filter the talent pool by self-declared career track preference (e.g., Individual Contributor, People Management, Technical Specialist, Cross-functional), so that I can identify employees who align to a specific future direction. | MVP — Must   |
| **US.23** | Filter talent pool by department, location, and tenure | As a Super Admin, I want to filter the talent pool by employee attributes — department, office location, and tenure band — so that I can narrow shortlists to relevant candidate groups.                                                                          | MVP — Must   |
| **US.24** | View individual employee talent profile                | As a Super Admin, I want to click on an employee in the talent pool list and view all of their survey responses for the current cycle in a structured profile view, so that I can evaluate their intent in full before shortlisting.                              | MVP — Must   |
| **US.25** | Compare current cycle to prior cycle responses         | As a Super Admin, I want to see, on an individual employee's profile, how their responses in the current cycle differ from their prior cycle responses (where applicable), so that I can identify employees whose intent has changed.                             | MVP — Could  |
| **US.26** | Export filtered talent pool view                       | As a Super Admin, I want to export the current filtered talent pool view as a CSV or XLSX file, so that I can share shortlists offline, use them in presentations, or feed them into other HR tools.                                                              | MVP — Must   |
| **US.27** | Switch between survey cycles on the dashboard          | As a Super Admin, I want to toggle the dashboard view between active and prior cycles, so that I can see historical snapshots of talent intent and compare across cycles at the population level.                                                                 | MVP — Should |


## 3.6 Out of Scope (This Release)

- **Cross-reference with Skill Gap Analysis data in dashboard filters** — combining "above benchmark on People Management" (Skill Gap) + "willing to relocate" (Talent Pool) in a single query is a V2 unified talent profile capability. V1 keeps both dashboards separate. *(Deferred — separate data model integration required)*
- **Employee-facing browsing interface or opportunity matching** — employees in V1 only fill the survey; they do not browse open roles, view their own pool status, or receive match notifications. Full marketplace model (Workday/Gloat pattern) is architecturally and culturally out of scope for V1. *(CLOSED DECISION — explicitly rejected for V1 per research)*
- **Manager access to direct reports' Talent Pool responses** — managers cannot see any Talent Pool data; access is strictly Super and Sub Admin only. Surfacing this to managers would enable the talent hoarding dynamic that Talent Pool is partly designed to counter. *(CLOSED DECISION — confirmed post-discovery)*
- **AI-generated talent profiles or inferred readiness scores** — V1 only surfaces self-declared intent from survey responses; no AI inference, composite scores, or predicted potential ratings. *(CLOSED DECISION — avoid SAP SuccessFactors AI pattern for V1; targeted for Phase 2 — see Section 3.7)*
- **Employee notification when their profile is accessed by HR** — a trust-building feedback loop where employees are notified when their pool data contributed to a shortlist. V2 mechanism to close the circular update-engagement failure. *(Deferred — V2)*
- **Manager nomination into Talent Pool** — manager input in V1 is handled by the 9-Box Grid sub-module; Talent Pool is employee self-report only. *(CLOSED DECISION — per JTBD)*
- **Integration with ATS (applicant tracking system)** — matching Talent Pool profiles to open requisitions in an ATS is a V3 integration pattern. *(Deferred — separate initiative)*

## 3.7 Phase 2 — Could Have (Future Scope)

| Item | Description |
|------|-------------|
| **AI-generated talent profiles or inferred readiness scores** | Could have. Layer AI inference on top of V1 self-declared survey data — generate composite readiness scores, infer potential ratings, or auto-populate structured talent profiles using response patterns across cycles. Phase 2 only; V1 deliberately avoids this to establish trust with employees and avoid the SAP SuccessFactors AI pattern. |

---

# 4. User Experience & Design

## 4.1 Survey Builder — Admin Flow

**Entry point:** Talent Management → Talent Pool → "Create New Survey" CTA

- Admin lands on the Talent Pool landing page showing all prior cycles (if any) and a "New Survey" button.
- Clicking "New Survey" opens the survey creation flow: Step 1 — Name & Description, Step 2 — Questions, Step 3 — Audience & Distribution.
- In Step 2, admin uses an "Add Question" button to add questions sequentially. Each question card has:
  - Question text (rich text input)
  - Response type selector: Free Text / Single Select / Multi Select / Rating (1–5)
  - For Single Select and Multi Select: option list editor (add/remove/reorder options)
  - Branching rule toggle: "Show follow-up question if respondent selects [option]" — opens a nested sub-question editor
  - Required/optional toggle
- Admin can drag-and-drop question cards to reorder.
- "Preview Survey" button opens a simulated employee-view modal showing the survey with branching logic active.
- "Save as Draft" persists the current state without sending.
- Step 3 — Audience: admin selects "All employees" or applies filters (department, location, employee group). Shows estimated recipient count.
- "Send" triggers distribution and transitions the cycle to "Active" state.


| State / Scenario                         | Behavior                                                                                                                                                                                                               |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Draft — no questions added**           | "Add Question" is the only CTA; "Send" button is disabled with tooltip "Add at least one question to send."                                                                                                            |
| **Draft — questions present**            | Full editing available; "Preview" and "Save as Draft" and "Send" all enabled.                                                                                                                                          |
| **Active cycle already exists**          | Admin is shown a warning banner: "An active Talent Pool cycle is already running. Sending a new cycle will not close the active one — employees may receive two surveys." Requires explicit confirmation.              |
| **Survey sent — now Active**             | Survey becomes read-only in the builder. Admin can view cycle status (response rate) and manage distribution (send reminder, close cycle).                                                                             |
| **Branching rule: conditional question** | In preview, the follow-up question renders inline below the trigger answer when selected. In the builder, the conditional question is indented under the parent question card with a "Conditional on: [option]" label. |


## 4.2 Employee Survey Experience

**Entry point:** Email notification or in-platform notification with direct survey link

- Employee lands on a survey intro screen showing survey name, estimated completion time (auto-calculated), and a "Start Survey" CTA.
- Questions render one at a time (paginated) or in a scrolling single-page view — configurable in admin settings. Conditional questions appear inline immediately below the trigger answer when selected, without page reload.
- Progress indicator shows X of N questions completed (counting only non-conditional questions in the base count; conditional questions increment the counter if they appear).
- "Save and continue later" link persists progress to server; employee can resume from the same link.
- On final question, "Submit" CTA with a confirmation screen: "Your responses have been submitted. Thank you." No detail about how data will be used (no mention of HR access, shortlisting, etc.) in V1.
- Employees cannot view or edit submitted responses after submission.


| State / Scenario                                         | Behavior                                                                                                                                                                                                                       |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Survey not yet started**                               | Full intro screen with survey context and "Start" CTA.                                                                                                                                                                         |
| **In-progress (saved)**                                  | Survey resumes at the last unanswered question; previously answered questions are pre-populated.                                                                                                                               |
| **Conditional branch triggered**                         | Follow-up question appears inline below the trigger answer; if the trigger answer is deselected, the conditional question collapses and its value is discarded.                                                                |
| **Required question skipped**                            | Inline validation error on submit attempt: "This question requires an answer." Does not block navigation between questions.                                                                                                    |
| **Survey already submitted**                             | If employee revisits the link after submission, they see: "You've already submitted your responses for this cycle. Contact your HR team if you need to make a change." (Employees cannot self-edit submitted responses in V1.) |
| **Cycle closed**                                         | If employee clicks the link after cycle close: "This survey has closed. Responses are no longer being accepted."                                                                                                               |
| **Survey deadline passed but cycle not manually closed** | Survey remains accessible until admin manually closes the cycle. Deadline is a soft reminder, not a system gate in V1.                                                                                                         |


## 4.3 Talent Pool Dashboard — Admin View

**Entry point:** Talent Management → Talent Pool → Dashboard tab

- Dashboard defaults to the most recently closed or active cycle.
- Cycle selector (dropdown) allows admin to switch between all prior cycles.
- Primary view: employee list table with columns: Employee Name, Department, Location, Tenure Band, Relocation Willingness, Promotion Readiness, Career Track Interest, Survey Completed (date).
- Left-side filter panel: Relocation Willingness (checkboxes), Promotion Readiness (checkboxes), Career Track Interest (multi-select), Department (multi-select), Location (multi-select), Tenure Band (multi-select).
- "Export" button (top right): exports current filtered view as CSV or XLSX; includes all visible columns plus all survey responses in additional columns.
- Clicking an employee row opens an Employee Talent Profile drawer/sidebar:
  - Employee name, department, location, tenure
  - All survey responses for the current cycle, displayed question-by-question
  - If prior cycle data exists for this employee: "Prior cycle: [cycle name]" toggle that expands to show prior responses with changed fields highlighted in amber
- Filter state is preserved when navigating between employee profiles and back to the list.
- Dashboard is empty-state-safe: if no completed responses exist yet for the active cycle, an empty state is shown with cycle completion progress.


| State / Scenario                     | Behavior                                                                                                                                     |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **No cycles exist (first access)**   | Empty state: "No Talent Pool surveys have been sent yet. Create your first survey to build your talent pool." with "Create Survey" CTA.      |
| **Active cycle, no responses yet**   | Dashboard shows empty state with cycle name, send date, and "0 of [N] employees have responded."                                             |
| **Active cycle, partial responses**  | Table shows only completed respondents. Incomplete/pending employees are not listed in the dashboard. Response rate banner shows progress.   |
| **Filters applied, no results**      | "No employees match the selected filters." with "Clear filters" link.                                                                        |
| **Employee has no prior cycle data** | Prior cycle comparison section is hidden from the profile drawer.                                                                            |
| **Export with filters applied**      | Exported file reflects the filtered view — only employees matching active filters are included. Column headers include all survey questions. |
| **Dashboard loading**                | Skeleton loader on table rows; filter panel renders immediately.                                                                             |


## 4.4 Accessibility & Copy Guidelines

- All filter controls must be keyboard-navigable with visible focus states.
- Conditional survey questions must use ARIA `aria-expanded` and `aria-controls` to announce dynamic appearance to screen readers.
- Employee Talent Profile drawer must trap focus when open and release on close.
- Export buttons must have accessible labels: "Export talent pool as CSV" / "Export talent pool as XLSX" (not just "Export").
- **Copy guideline:** Use "career intent" not "employee preferences" in UI copy — intent is structured and purposeful; preferences implies optional/casual. Use "Talent Pool cycle" not "survey wave" for admin-facing labels.
- **Copy guideline:** In employee-facing survey UI, use "Your responses help us match you to the right opportunities and development paths" — do not mention "HR access" or "shortlisting" in employee copy in V1.

---

# 5. Detailed Functional Requirements

## 5.1 Survey Engine — Branching Logic


| ID      | Requirement Description                                                                                                                               | Acceptance Criteria                                                                                                                                                                                                                                          |
| ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **FR1** | The survey engine must support conditional follow-up questions triggered by a specific response selection on single-select or multi-select questions. | Given a question with a branching rule configured on option "No," When an employee selects "No," Then the follow-up question renders immediately below the trigger question before the next base question.                                                   |
| **FR2** | A conditional follow-up question must be hidden and its value discarded if the trigger condition is no longer met.                                    | Given an employee has selected "No" (triggering a follow-up) and entered a response, When the employee changes their selection to "Yes," Then the follow-up question collapses and the entered value is cleared from the submission payload.                 |
| **FR3** | Conditional questions must support the same response type options as base questions (free text, single select, multi select, rating).                 | Given a branching rule is configured on a single-select question, When the admin configures the conditional follow-up, Then all four response types are available to choose for the follow-up question.                                                      |
| **FR4** | Branching logic must support a maximum of one level of nesting (a conditional follow-up cannot itself have a conditional follow-up in V1).            | Given an admin attempts to add a branching rule to a question that is already a conditional follow-up, Then the "Add branching rule" option is disabled with tooltip: "Nested branching is not supported. This question is already a conditional follow-up." |
| **FR5** | A question can have at most one conditional follow-up configured per trigger option.                                                                  | Given an admin has already configured a follow-up for option "No," When the admin attempts to add a second follow-up for the same option "No," Then the system shows an error: "A follow-up question already exists for this option."                        |


## 5.2 Survey Engine — Response Types & Validation


| ID      | Requirement Description                                                                                           | Acceptance Criteria                                                                                                                                                                                                |
| ------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **FR6** | Free-text responses must enforce a character limit (default: 500 characters) with a live counter.                 | Given an employee is typing into a free-text question, When the character count reaches 500, Then no additional characters can be entered and the counter displays "500/500" in red.                               |
| **FR7** | Required questions must block survey submission if unanswered, with inline validation.                            | Given a required question has not been answered, When the employee clicks "Submit," Then inline validation "This question requires an answer" appears on each unanswered required question; submission is blocked. |
| **FR8** | Survey progress must be server-persisted on each question answer (auto-save), not only on explicit "Save" action. | Given an employee has answered 3 of 10 questions and closes the browser, When the employee reopens the survey link, Then the survey resumes at question 4 with questions 1–3 pre-populated.                        |


## 5.3 Survey Distribution & Cycle Management


| ID       | Requirement Description                                                                                                           | Acceptance Criteria                                                                                                                                                                                                                                  |
| -------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FR9**  | Each survey send creates a new named cycle with a unique cycle ID, start timestamp, and status (Active / Closed).                 | Given an admin sends a survey, When the distribution is confirmed, Then a new cycle record is created with status "Active" and a start timestamp equal to the send time.                                                                             |
| **FR10** | Admin can filter the survey audience by one or more dimensions: department, location, employee group.                             | Given an admin selects "Department: Engineering" and "Location: Chennai" as audience filters, When the survey is sent, Then only employees matching both filters receive the survey notification.                                                    |
| **FR11** | Closing a cycle is irreversible in V1 — no further responses are accepted after close.                                            | Given an admin clicks "Close Cycle" and confirms the confirmation dialog, When the cycle is closed, Then the cycle status changes to "Closed," the employee-facing survey link displays the closed-cycle message, and no new responses are accepted. |
| **FR12** | Prior cycle data is retained indefinitely — closing or initiating a new cycle does not overwrite or delete prior cycle responses. | Given a new cycle is initiated, When the dashboard is opened, Then prior cycle data remains accessible via the cycle selector and is unchanged.                                                                                                      |
| **FR13** | Reminder notifications can only be sent to employees in the active cycle who have not yet submitted a response.                   | Given the admin sends a reminder, When the notification is dispatched, Then only employees with status "Pending" for the active cycle receive the reminder; employees who have already submitted do not receive it.                                  |


## 5.4 Talent Pool Dashboard — Filtering & Access Control


| ID       | Requirement Description                                                                                                                                            | Acceptance Criteria                                                                                                                                                                                                       |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FR14** | The Talent Pool dashboard is accessible only to Super Admins and Sub Admins. Managers and employees have no access.                                                | Given a user with Manager role navigates to the Talent Pool module, When they attempt to access the Dashboard tab, Then they receive an "Access denied" screen; no talent pool data is displayed.                         |
| **FR15** | Dashboard filters must operate as AND conditions (all selected criteria must match for an employee to appear).                                                     | Given an admin applies filter "Relocation: Yes" AND "Department: Engineering," When results are rendered, Then only employees who selected "Yes" to relocation AND belong to Engineering are shown.                       |
| **FR16** | Filter selections must be applied in real time without a page reload, updating the employee count and list instantly.                                              | Given an admin selects a filter option, When the checkbox is checked, Then the employee list and count update within 2 seconds without a page reload.                                                                     |
| **FR17** | The dashboard must display only employees who have submitted a completed response for the selected cycle — not pending or partial respondents.                     | Given an employee submitted partial responses and navigated away without submitting, When the dashboard is opened, Then that employee is not listed in the talent pool view.                                              |
| **FR18** | Sub Admin dashboard scope must follow the existing CultureMonkey account-level access configuration — Sub Admins only see employees within their configured scope. | Given a Sub Admin with scope limited to "Department: Marketing," When they open the Talent Pool dashboard, Then only employees in Marketing who completed the survey are visible; no other department data is accessible. |


## 5.5 Individual Employee Talent Profile


| ID       | Requirement Description                                                                                                                                  | Acceptance Criteria                                                                                                                                                                                                                                                         |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FR19** | The employee talent profile must display all survey responses for the selected cycle, structured by question, including conditional follow-up responses. | Given an admin opens an employee's profile, When the profile drawer loads, Then all questions are listed in survey order with the employee's responses; conditional follow-up responses are shown indented below their parent question.                                     |
| **FR20** | If prior cycle data exists for the employee, the profile must display prior responses alongside current responses with changed values highlighted.       | Given an employee responded in Cycle 1 and Cycle 2, When the admin views the employee's Cycle 2 profile, Then a "Prior cycle comparison" section shows prior responses; any question where the response changed displays the prior value with an amber "Changed" indicator. |


## 5.6 Export


| ID       | Requirement Description                                                                                                                                                                           | Acceptance Criteria                                                                                                                                                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FR21** | The export must reflect the current filtered view — not the full dataset.                                                                                                                         | Given an admin has applied filters reducing the visible list from 150 to 23 employees, When the admin clicks "Export," Then the downloaded file contains exactly 23 rows (plus a header row).                                                                  |
| **FR22** | The export file must include all base employee attributes (Name, Department, Location, Tenure, Employee ID) plus one column per survey question with the employee's response as the column value. | Given a survey has 8 questions, When an admin exports the filtered view, Then the export file has columns: Employee Name, Employee ID, Department, Location, Tenure Band, Cycle Name, Response Date, [Question 1 text], [Question 2 text] … [Question 8 text]. |
| **FR23** | Export must support both CSV and XLSX formats, selectable at the time of export.                                                                                                                  | Given an admin clicks "Export," When a format selector is shown, Then the admin can choose CSV or XLSX; the download initiates in the selected format.                                                                                                         |


---

# 6. Edge Cases & Error Handling


| State / Scenario                                                                                            | Behavior                                                                                                                                                                                                                                               |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Employee is removed from the org during an active cycle**                                                 | Their in-progress or submitted response is retained in the cycle data but their row in the dashboard is marked as "[Deactivated]" with a visual indicator. HR can still view their profile data for audit purposes.                                    |
| **Survey is sent to an employee segment, then employee is transferred to a different department mid-cycle** | The employee remains in scope for the cycle to which they were originally invited; their updated department attribute is shown on their profile but does not affect cycle membership.                                                                  |
| **Admin closes a cycle before the deadline while employees have the survey open**                           | Employees currently mid-survey can complete and submit their responses if they submit before the session expires (within same browser session). After session expiry or page reload, the closed-cycle message is shown.                                |
| **No employees in the selected audience filter**                                                            | System shows: "No employees match the selected audience. Adjust your filters before sending." CTA disabled.                                                                                                                                            |
| **Admin tries to send a survey with no questions**                                                          | "Send" button is disabled; tooltip: "Add at least one question to send."                                                                                                                                                                               |
| **Export requested on an empty filtered view (0 employees)**                                                | Export is disabled; tooltip: "No employees to export. Adjust filters to include at least one employee."                                                                                                                                                |
| **Employee attempts to submit after cycle close**                                                           | Submission fails silently on server; employee sees: "This survey has closed. Your responses were not submitted. Contact your HR team for assistance."                                                                                                  |
| **Network failure mid-survey for employee**                                                                 | Auto-save on each question answer ensures responses up to the last answered question are server-persisted. On reconnection, employee resumes from the last saved point.                                                                                |
| **Duplicate question text in the same survey**                                                              | System allows duplicate question text (admin may legitimately ask similar questions in different contexts) but displays a non-blocking warning in the builder: "This question text appears more than once in your survey. Ensure this is intentional." |
| **Admin deletes a question from an active cycle**                                                           | Deleting questions from a sent/active survey is not permitted. The edit option is disabled on all questions once the cycle status is Active.                                                                                                           |


---

# 7. Competitive & UX Notes

## Competitive Intelligence

- **SAP SuccessFactors:** AI-driven talent discovery with dynamic pools continuously updated by skills, roles, and engagement history. Uses inferred profiles — not direct employee survey input. Does not have an explicit "survey-triggered intent capture" mechanism. Closest to enterprise complete but requires SAP ecosystem investment.
- **Workday Talent Marketplace:** Matches employees to internal projects and roles; surfaces internal candidates before external posting. Relies on employee-initiated browsing and structured HRIS profiles — not HR-initiated intent surveys. Requires significant culture change investment to generate employee engagement with the marketplace.
- **Gloat:** Dedicated internal talent marketplace with AI matching employees to gigs, mentorships, and full roles based on declared skills and interests. Most closely aligned to Alumil's ask in concept, but uses a marketplace metaphor (employee-browsing) rather than the survey-to-dashboard model being built here. Enterprise-tier pricing.
- **SuccessionHR:** Succession-focused with talent pool readiness indicators and role-based filtering. Not survey-based; relies on HR-manually-maintained profiles. Closer to the output (filterable pool with readiness scoring) but lacks the survey input mechanism.
- **Lattice:** Performance + career development path tracking. Surfaces top performers and development paths but does not capture relocation willingness or self-declared promotion readiness as structured, filterable fields.

## Patterns to Adopt

- **Gloat — declared intent as pool inputs:** The most important differentiator for CultureMonkey's approach vs. all enterprise competitors: build the pool from employee survey responses, not from HR-manually-entered profiles or AI inference. This reduces both the HR setup burden and the bias in pool composition.
- **SuccessionHR — filterable readiness view:** Primary HR output is a filtered employee list with readiness/intent dimensions as filter axes. Segment-filtered list view (not a marketplace feed, not an AI recommendation list) is the right V1 pattern for this audience.
- **SAP SuccessFactors — historical snapshots:** Retaining prior-cycle data and enabling cycle-over-cycle comparison of employee intent is table-stakes for an admin-initiated survey model where data can be 12–18 months old between cycles. Surfacing "changed" intent signals in the profile view is a direct adoption of the SAP pool freshness pattern.

## Patterns to Avoid

- **Workday/Gloat — marketplace opportunity matching in V1:** The employee-browsing-and-applying model requires deep cultural investment (employees must trust the system will act on their signal) and significantly more product surface area (job posting integration, applicant tracking, etc.). Alumil's ask is simpler: capture signals, show them in a dashboard. Opportunity matching is explicitly out of scope.
- **SAP SuccessFactors — AI-inferred talent scores:** V1 must not generate AI-based readiness or potential scores from survey responses. The integrity of the self-declared intent model depends on HR seeing what employees actually said — not an AI interpretation of it. Any inference layer would undermine the bias-reduction value proposition.
- **HRIS-style static profile model (Workday HRIS):** A profile that is filled once at onboarding and never refreshed is the exact failure mode this module is designed to solve. Do not build a profile editor that employees passively maintain; instead, preserve the admin-triggered, periodic survey-cycle model.

## Differentiation Opportunity

- CultureMonkey occupies a unique position in the HR tool stack: it already has an established survey trust relationship with employees (they use it for engagement surveys). Talent Pool leverages that trust to capture career intent via a familiar survey mechanism — without requiring employees to navigate a new "marketplace" product that feels untrustworthy or unrelated to their work. No enterprise competitor currently combines the survey-first input model with a filterable talent dashboard in a standalone module at this price tier.

---

# 8. Analytics & Success Metrics

## 8.1 Success Metrics


| Metric                                                              | Baseline          | Target (90 days post-launch)                                   |
| ------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------- |
| Talent Pool survey completion rate (submitted / invited)            | N/A (new feature) | ≥ 60% completion rate for Alumil pilot cycle                   |
| Time for HR admin to build and send first Talent Pool survey        | N/A               | ≤ 20 minutes (end-to-end: survey creation → distribution)      |
| Dashboard filter queries per active cycle (per account)             | N/A               | ≥ 3 distinct filter queries per HR admin per cycle             |
| Export rate (cycles with at least one export / total closed cycles) | N/A               | ≥ 70% of closed cycles result in at least one export           |
| Admin-reported confidence in Talent Pool data for talent decisions  | N/A               | ≥ 4/5 satisfaction in post-launch CSAT (Alumil pilot feedback) |
| Accounts with ≥ 2 Talent Pool cycles initiated within 12 months     | N/A               | ≥ 50% of accounts using Talent Pool initiate a second cycle    |


## 8.2 Instrumentation Events


| Event Name                     | Trigger                                                     | Properties                                                                                                             |
| ------------------------------ | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `talent_pool_survey_created`   | Admin saves a new survey for the first time (draft or sent) | `survey_id`, `question_count`, `has_branching_logic` (bool), `admin_id`, `account_id`                                  |
| `talent_pool_survey_sent`      | Admin sends a survey / creates a new active cycle           | `cycle_id`, `survey_id`, `audience_size`, `has_segment_filter` (bool), `admin_id`, `account_id`                        |
| `talent_pool_survey_started`   | Employee opens survey and begins first question             | `cycle_id`, `survey_id`, `employee_id` (hashed), `account_id`                                                          |
| `talent_pool_survey_submitted` | Employee submits completed survey                           | `cycle_id`, `survey_id`, `employee_id` (hashed), `completion_time_seconds`, `account_id`                               |
| `talent_pool_dashboard_viewed` | Admin loads the Talent Pool dashboard                       | `cycle_id`, `admin_id`, `account_id`, `respondent_count`                                                               |
| `talent_pool_filter_applied`   | Admin checks or unchecks a filter option                    | `cycle_id`, `filter_dimension`, `filter_value`, `resulting_count`, `admin_id`, `account_id`                            |
| `talent_pool_profile_viewed`   | Admin opens an individual employee talent profile           | `cycle_id`, `admin_id`, `account_id` (employee_id NOT captured in event to limit PII in analytics)                     |
| `talent_pool_export_triggered` | Admin clicks Export and download initiates                  | `cycle_id`, `export_format` (csv / xlsx), `filtered_employee_count`, `filters_active` (bool), `admin_id`, `account_id` |
| `talent_pool_cycle_closed`     | Admin manually closes a cycle                               | `cycle_id`, `final_response_rate`, `admin_id`, `account_id`                                                            |
| `talent_pool_reminder_sent`    | Admin sends reminder to non-respondents                     | `cycle_id`, `reminder_recipient_count`, `admin_id`, `account_id`                                                       |


---

# 9. Dependencies


| Dependency                             | Notes                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Branching Survey Engine**            | New capability — not available in the current CultureMonkey survey builder. Must be built as a purpose-built engine for the Talent Pool module. Conditional question rendering on the employee side and conditional response storage/retrieval on the data model side are both required. Highest-effort engineering dependency in V1. |
| **Talent Pool Data Store**             | Separate data model from engagement survey responses. Must store: cycle metadata, question/response schema per cycle, per-employee attributed responses (non-anonymous), historical cycle snapshots. Must not co-mingle with the engagement survey reporting data pipeline.                                                           |
| **Access Control Layer**               | Dashboard access must be gated at the role level: Super Admin and Sub Admin only, with Sub Admin scoped to their configured audience subset. Uses existing CultureMonkey account-level RBAC — requires Talent Pool module to be registered as a permission-gated resource.                                                            |
| **Employee Directory Integration**     | Talent Pool dashboard must join on the employee directory for department, location, and tenure attributes (used as filter dimensions). These attributes come from the HRIS sync / employee directory, not from survey responses — dependency on data freshness of the employee directory.                                             |
| **Notification System**                | Survey distribution and reminder emails use the existing CultureMonkey notification infrastructure. Survey link must be deep-link-capable (direct link to the specific cycle's survey).                                                                                                                                               |
| **Export Service**                     | CSV and XLSX generation for filtered talent pool data. If a shared export service exists from Skill Gap Analysis, this should reuse it; otherwise a new export utility is required.                                                                                                                                                   |
| **AccountSetting: ENABLE_TALENT_POOL** | New feature flag — off by default. Enabled per-tenant during phased rollout. Controls visibility of the Talent Pool sub-module in the Talent Management nav.                                                                                                                                                                          |


---

# 10. Rollout Plan

## Phase 1 — MVP (~8 weeks)

- Branching survey engine (conditional question logic, all four response types, server-side auto-save)
- Admin survey creation, preview, draft save, and send (all employees or segment-filtered)
- Employee survey experience (conditional rendering, progress save, submission)
- Cycle management: create, active, close, history list
- Talent Pool dashboard: employee list, structured filter panel (relocation, promotion, career track, department, location, tenure), employee talent profile drawer
- Export: CSV and XLSX for filtered view
- Reminder notification for non-respondents
- Rollout gate: `AccountSetting::ENABLE_TALENT_POOL` per tenant
- Pilot: Alumil (confirmed customer) — internal rollout to CultureMonkey team for validation before Alumil send

## Phase 2 — Enhancements (~4 weeks post Phase 1)

- Prior-cycle comparison on employee talent profile drawer (changed field highlighting)
- Cycle-selector on dashboard for navigating historical snapshots
- Dashboard summary stats banner: total respondents, % willing to relocate, % promotion-ready (top-line intent numbers before filtering)
- Template reuse: re-initiate a new cycle from a prior survey's question set
- Free-text search within the talent pool dashboard (search by employee name or free-text response content)

## Phase 3 — Future (Post V1)

- **Unified Talent Profile (V2):** Cross-reference Talent Pool intent with Skill Gap Analysis competency data in a single combined filter query. Combined view: "willing to relocate AND above benchmark on People Management." Requires shared data model or cross-module join layer.
- **Visibility closing the loop (V2):** Lightweight opt-in notification to employee when their Talent Pool profile contributed to a shortlist or was accessed by HR. Addresses the circular update-engagement failure documented in research.
- **Internal opportunity matching (V3):** Admin can post an internal role with required attributes; system surfaces Talent Pool respondents who match. Requires ATS or internal job posting integration.
- **Manager talent mobility KPIs (V3):** Surfaces to admins which managers' teams have high internal mobility intent but low actual internal transfers — a data signal for talent hoarding detection. Requires integration with HR outcome data (actual transfers/promotions).

