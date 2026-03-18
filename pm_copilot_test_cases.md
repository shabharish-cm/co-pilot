# PM Copilot — QA Test Cases

**Source reviewed:** Final implementation document for the PM Copilot solution. fileciteturn0file0L1-L593

## 1. Test Strategy

This test suite validates the implementation across these areas:

- Scheduled sync workflows
- Repository state and file contracts
- Todoist task manager CLI operations
- Claude command workflows
- Workflow prerequisites and approval gates
- Data freshness and staleness handling
- Error handling, retries, and graceful degradation
- Architecture guardrails and scope compliance
- Security and configuration validation

## 2. Test Assumptions

- Runtime: Node.js + TypeScript
- Storage model: repository-backed Markdown + JSON artifacts
- External systems:
  - Todoist
  - Google Calendar
  - Fireflies
- Claude is used inside Claude Code / Claude Cowork and in the Thursday `weekly-customer-pulse.yml` workflow only. fileciteturn0file0L35-L64
- Jira and Trello are fully out of scope and must not appear in code paths, workflows, docs, configs, or schemas. fileciteturn0file0L23-L33

## 3. Test Environment Recommendations

Use the following environments:

- **Local dev** for CLI, schema validation, and artifact generation tests
- **Mock integration environment** for Todoist, Google Calendar, and Fireflies API behavior
- **CI validation environment** for GitHub Actions behavior, path validation, and guardrail checks
- **Fixture-based repository sandbox** for stale state, approval gating, and command prerequisite tests

## 4. Severity / Priority Model

- **P0** — Core flow broken, data corruption risk, architecture violation, destructive error
- **P1** — Major business flow impaired, incorrect artifact output, broken prerequisite handling
- **P2** — Partial degradation, non-blocking output issues, edge case failures
- **P3** — Cosmetic or low-risk issues

---

## 5. Detailed Test Cases

---

### TC-001 — Morning sync creates raw snapshot
**Priority:** P0  
**Area:** GitHub Action / Morning Sync

**Preconditions**
- Valid Todoist credentials configured
- Valid Google Calendar credentials configured
- Morning sync workflow is enabled
- Repository paths exist or can be created

**Steps**
1. Trigger `morning-sync.yml`.
2. Allow Todoist open task fetch to complete.
3. Allow Google Calendar current-day fetch to complete.
4. Inspect generated files.

**Expected Result**
- A raw snapshot file is created at `daily/raw/YYYY-MM-DD-morning.json`.
- `state/current_day.json` is updated.
- `state/last_sync.json` is updated.
- No AI or Claude invocation occurs during the workflow. fileciteturn0file0L405-L421

---

### TC-002 — Morning sync stores open tasks in canonical state
**Priority:** P0  
**Area:** Data Contracts / Morning Sync

**Preconditions**
- Todoist returns at least one open task

**Steps**
1. Run `morning-sync.yml`.
2. Open `state/current_day.json`.

**Expected Result**
- `openTasks` contains the fetched Todoist tasks.
- JSON structure remains valid against `current_day.schema.json`.
- `sourceStatus.todoist` is marked fresh on success. fileciteturn0file0L355-L371

---

### TC-003 — Morning sync stores today meetings in canonical state
**Priority:** P0  
**Area:** Data Contracts / Morning Sync

**Preconditions**
- Google Calendar has at least one event for the current day

**Steps**
1. Run `morning-sync.yml`.
2. Open `state/current_day.json`.

**Expected Result**
- `todayMeetings` contains current-day calendar events.
- Meeting data is written without corrupting other sections of the state file.

---

### TC-004 — Morning sync updates sync timestamps correctly
**Priority:** P1  
**Area:** Sync Metadata

**Preconditions**
- Successful morning sync run

**Steps**
1. Run `morning-sync.yml`.
2. Inspect `state/current_day.json`.
3. Inspect `state/last_sync.json`.

**Expected Result**
- `lastMorningSyncAt` is populated in `state/current_day.json`.
- `morningSync.ranAt` and `morningSync.status` are correctly updated in `state/last_sync.json`. fileciteturn0file0L373-L385

---

### TC-005 — Morning sync handles empty meetings successfully
**Priority:** P1  
**Area:** Google Calendar Integration

**Preconditions**
- Google Calendar returns zero events for the day

**Steps**
1. Run `morning-sync.yml`.
2. Inspect logs and `state/current_day.json`.

**Expected Result**
- Workflow succeeds.
- `todayMeetings` is an empty array.
- No false failure is logged. fileciteturn0file0L524-L529

---

### TC-006 — Morning sync handles Todoist API outage gracefully
**Priority:** P0  
**Area:** Error Handling / Resilience

**Preconditions**
- Simulate Todoist API timeout or 5xx error
- Existing prior valid `state/current_day.json` available

**Steps**
1. Trigger `morning-sync.yml`.
2. Force Todoist fetch failure.
3. Observe logs and output files.

**Expected Result**
- Workflow logs the Todoist failure clearly.
- `sourceStatus.todoist` is marked failed or stale.
- Prior valid state is preserved where appropriate.
- No fake success or empty overwrite occurs for Todoist data. fileciteturn0file0L518-L523

---

### TC-007 — Morning sync handles Google Calendar API outage gracefully
**Priority:** P0  
**Area:** Error Handling / Resilience

**Preconditions**
- Simulate Google Calendar API failure
- Prior valid state exists

**Steps**
1. Trigger `morning-sync.yml`.
2. Force Google Calendar failure.
3. Inspect logs and state.

**Expected Result**
- Failure is logged with actionable detail.
- Calendar source is marked failed/stale.
- Other successful source data is preserved.
- State file is not corrupted.

---

### TC-008 — Morning sync never generates narrative digest
**Priority:** P0  
**Area:** Architecture Guardrail

**Preconditions**
- Morning sync workflow exists

**Steps**
1. Review workflow steps for `morning-sync.yml`.
2. Execute workflow.
3. Inspect outputs created by the action.

**Expected Result**
- Workflow does not create human-written digest text.
- No LLM prompt, Anthropic API call, Claude command, or AI summarization step exists. fileciteturn0file0L38-L49

---

### TC-009 — Evening sync creates raw snapshot
**Priority:** P0  
**Area:** GitHub Action / Evening Sync

**Preconditions**
- Evening sync workflow configured
- Todoist credentials valid

**Steps**
1. Trigger `evening-sync.yml`.
2. Inspect generated files.

**Expected Result**
- A file is created at `daily/raw/YYYY-MM-DD-evening.json`.
- `state/current_day.json` is updated.
- `state/last_sync.json` is updated. fileciteturn0file0L168-L178

---

### TC-010 — Evening sync records completed tasks for the day
**Priority:** P0  
**Area:** Todoist Integration / Evening Sync

**Preconditions**
- At least one task was completed today in Todoist

**Steps**
1. Trigger `evening-sync.yml`.
2. Inspect `state/current_day.json`.

**Expected Result**
- `completedToday` contains all tasks completed on the day.
- Data is not duplicated across reruns unless explicitly intended by design.

---

### TC-011 — Evening sync records still-open tasks
**Priority:** P0  
**Area:** Todoist Integration / Evening Sync

**Preconditions**
- At least one task remains open

**Steps**
1. Run `evening-sync.yml`.
2. Inspect `state/current_day.json`.

**Expected Result**
- Open tasks remain represented correctly.
- Completed tasks do not appear in the open task list.

---

### TC-012 — Evening sync uses fixed 3-day due window
**Priority:** P0  
**Area:** Business Rule Validation

**Preconditions**
- Todoist has tasks due today, in 2 days, in 3 days, and in 4 days

**Steps**
1. Run `evening-sync.yml`.
2. Inspect `dueSoon`.

**Expected Result**
- Tasks due within the next 3 days are included.
- Tasks due beyond 3 days are excluded.
- Rule behavior is deterministic and not ambiguous. fileciteturn0file0L171-L177

---

### TC-013 — Evening sync never performs AI carry-forward reasoning
**Priority:** P0  
**Area:** Architecture Guardrail

**Preconditions**
- Evening sync workflow exists

**Steps**
1. Inspect `evening-sync.yml`.
2. Execute the workflow.
3. Review created outputs.

**Expected Result**
- No EOD narrative summary is produced by the GitHub Action.
- No AI reasoning is triggered for carry-forward tasks. fileciteturn0file0L423-L432

---

### TC-014 — Daily Fireflies sync creates raw payload
**Priority:** P0  
**Area:** GitHub Action / Fireflies Sync

**Preconditions**
- Valid Fireflies credentials configured
- Transcript data exists for the previous day

**Steps**
1. Trigger `daily-fireflies-sync.yml`.
2. Inspect `pulse/raw/`.

**Expected Result**
- A raw file is created at `pulse/raw/YYYY-MM-DD-fireflies.json`.
- `state/last_sync.json` is updated with `dailyFirefliesSync` details, including `dayKey`.
- Workflow remains non-AI and performs only fetch/normalize/store behavior.

---

### TC-015 — Daily Fireflies sync creates normalized transcript file
**Priority:** P0  
**Area:** Transcript Normalization

**Preconditions**
- Fireflies returns transcript records successfully

**Steps**
1. Run `daily-fireflies-sync.yml`.
2. Inspect `pulse/normalized/YYYY-MM-DD-transcripts.json`.

**Expected Result**
- Normalized transcript file is created.
- `dayKey`, `generatedAt`, and `transcripts` are populated.
- File is valid against transcript schema.

---

### TC-016 — Daily Fireflies sync fetches previous day only
**Priority:** P1  
**Area:** Date Logic

**Preconditions**
- Fireflies contains transcripts across multiple days

**Steps**
1. Trigger daily sync on the scheduled day.
2. Inspect fetched transcript dates.

**Expected Result**
- Only transcripts belonging to the previous day are fetched.
- Current-day or older non-target-day data is excluded unless explicitly required by retry/recovery logic.

---

### TC-017 — Daily Fireflies sync handles pagination across multiple pages
**Priority:** P0  
**Area:** Fireflies Integration / Pagination

**Preconditions**
- Fireflies returns paginated transcript results

**Steps**
1. Mock or configure transcript dataset large enough for multiple pages.
2. Run daily sync.
3. Count raw and normalized transcript records.

**Expected Result**
- All pages are fetched.
- Normalized record count matches total expected results.
- No page is skipped.
- Duplicate transcript records are not introduced.

---

### TC-018 — Daily Fireflies sync updates transcript index
**Priority:** P1  
**Area:** State Management

**Preconditions**
- Successful daily sync run

**Steps**
1. Run `daily-fireflies-sync.yml`.
2. Inspect `state/transcript_index.json`.

**Expected Result**
- Transcript index metadata is updated.
- Latest synced day is represented.
- File remains valid JSON.

---

### TC-019 — Normalized transcript includes required fields
**Priority:** P1  
**Area:** Data Contract Validation

**Preconditions**
- At least one transcript is normalized

**Steps**
1. Open normalized transcript JSON.
2. Validate an individual transcript record.

**Expected Result**
Each record contains:
- `transcriptId`
- `meetingTitle`
- `meetingDate`
- `participants`
- `summary`
- `transcriptText`
- `sourceUrl`
- `fetchedAt`
- `sourceDay`

---

### TC-020 — Weekly customer pulse workflow creates digest and updates pulse master
**Priority:** P0  
**Area:** GitHub Action / Customer Pulse

**Preconditions**
- Thursday weekly pulse workflow exists
- Normalized transcript files exist for the previous Thursday through Wednesday
- `pulse/master/customer-pulse-master.md` exists (or initialization behavior is defined)

**Steps**
1. Inspect `weekly-customer-pulse.yml`.
2. Run workflow.
3. Review outputs and logs.

**Expected Result**
- Weekly digest is created at `pulse/weekly/YYYY-WW-customer-pulse.md`.
- `pulse/master/customer-pulse-master.md` is updated with the current week section.
- Workflow consumes cached normalized transcripts and does not live-fetch Fireflies.
- Output includes:
  - new feature requests
  - problems with existing features
  - what customers love about the platform
- Request/problem items include value-effort matrix placement.
- Recurring requests are explicitly flagged by comparing with prior pulse master entries.
- `state/last_sync.json` is updated with `weeklyCustomerPulseDigest` metadata, including `windowStart`, `windowEnd`, and `weekKey`.

---

### TC-021 — `/add` creates Todoist task successfully
**Priority:** P0  
**Area:** CLI / Task Manager

**Preconditions**
- Todoist credentials valid
- CLI is available

**Steps**
1. Invoke `/add` with valid task title and optional metadata.
2. Allow task create API call to complete.
3. Inspect Todoist and local state if applicable.

**Expected Result**
- Task is created remotely in Todoist.
- Local execution context updates only after remote success.
- Success message references the created task accurately. fileciteturn0file0L281-L285

---

### TC-022 — `/add` rejects empty or invalid task title
**Priority:** P1  
**Area:** CLI Validation

**Preconditions**
- CLI active

**Steps**
1. Invoke `/add` with blank content or invalid title input.

**Expected Result**
- Command fails validation.
- No remote task is created.
- User receives a clear validation error.

---

### TC-023 — `/add` previews ambiguous inferred metadata
**Priority:** P1  
**Area:** Command Safety

**Preconditions**
- CLI supports metadata inference
- Low-confidence due date or priority inference scenario exists

**Steps**
1. Invoke `/add` with ambiguous natural-language metadata.
2. Observe command behavior.

**Expected Result**
- Preview/confirmation is shown before creation when confidence is low.
- No task is created until user confirms. fileciteturn0file0L282-L285

---

### TC-024 — `/update` updates content for an existing task
**Priority:** P0  
**Area:** CLI / Task Manager

**Preconditions**
- Existing Todoist task available

**Steps**
1. Invoke `/update` for a valid task.
2. Change task content.
3. Inspect remote task and local state.

**Expected Result**
- Task content is updated in Todoist.
- Local state is updated only after remote success. fileciteturn0file0L183-L189

---

### TC-025 — `/update` updates due date, priority, and labels
**Priority:** P1  
**Area:** CLI / Task Manager

**Preconditions**
- Existing Todoist task available

**Steps**
1. Invoke `/update`.
2. Modify due date, priority, and labels.
3. Inspect remote result.

**Expected Result**
- Requested fields are updated successfully.
- Unchanged fields remain untouched.
- Before/after view is shown for important changes. fileciteturn0file0L288-L292

---

### TC-026 — `/update` requests confirmation for ambiguous task match
**Priority:** P0  
**Area:** Command Safety

**Preconditions**
- Multiple similar Todoist tasks exist

**Steps**
1. Invoke `/update` using ambiguous task description.
2. Observe behavior.

**Expected Result**
- Command asks user to disambiguate or confirm.
- No wrong task is updated.

---

### TC-027 — `/done` completes a task successfully
**Priority:** P0  
**Area:** CLI / Task Completion

**Preconditions**
- Existing incomplete Todoist task

**Steps**
1. Invoke `/done` for a uniquely identifiable task.
2. Inspect remote task state.

**Expected Result**
- Task is marked complete in Todoist.
- Local state reflects completion only after remote success. fileciteturn0file0L183-L189

---

### TC-028 — `/done` blocks accidental completion on ambiguous task match
**Priority:** P0  
**Area:** Command Safety

**Preconditions**
- Two or more similar open tasks exist

**Steps**
1. Invoke `/done` with ambiguous task selector.
2. Observe response.

**Expected Result**
- User is asked to disambiguate or confirm.
- No accidental completion occurs. fileciteturn0file0L542-L547

---

### TC-029 — Task manager preserves local state when remote create fails
**Priority:** P0  
**Area:** Data Integrity

**Preconditions**
- Simulate Todoist create failure

**Steps**
1. Invoke `/add`.
2. Force Todoist API failure.
3. Inspect local state/context files.

**Expected Result**
- No false local success is written.
- Error is surfaced cleanly.
- Local state is not corrupted. fileciteturn0file0L466-L471

---

### TC-030 — Task manager preserves local state when remote update fails
**Priority:** P0  
**Area:** Data Integrity

**Preconditions**
- Simulate Todoist update failure

**Steps**
1. Invoke `/update`.
2. Force API error.
3. Inspect local state.

**Expected Result**
- Original local state is preserved.
- Command reports failure clearly.
- No partial local mutation exists.

---

### TC-031 — Task routing remains config-driven, not hardcoded
**Priority:** P1  
**Area:** Architecture Quality

**Preconditions**
- `task-routing.service.ts` present
- Routing configuration exists

**Steps**
1. Inspect routing configuration and source.
2. Create tasks targeting different sections/rules.

**Expected Result**
- Routing behavior is driven by config/service logic.
- Command text does not hardcode section-routing behavior. fileciteturn0file0L185-L189

---

### TC-032 — `/morning` generates digest from cached state
**Priority:** P0  
**Area:** Claude Command

**Preconditions**
- Valid `state/current_day.json` present
- Morning digest path writable

**Steps**
1. Invoke `/morning`.
2. Inspect generated Markdown file.

**Expected Result**
- File created at `daily/digests/YYYY-MM-DD-morning.md`.
- Digest is derived from cached repository state.
- Output includes overdue tasks, tasks due today, today meetings, suggested order, conflicts, and freshness indicator. fileciteturn0file0L207-L221

---

### TC-033 — `/morning` warns when state is stale
**Priority:** P0  
**Area:** Staleness Handling

**Preconditions**
- `state/current_day.json` exists
- `lastMorningSyncAt` is older than staleness threshold

**Steps**
1. Invoke `/morning`.
2. Inspect digest or command response.

**Expected Result**
- Command clearly indicates stale data.
- It does not pretend data is fresh.
- Cached state may still be used with explicit warning. fileciteturn0file0L536-L541

---

### TC-034 — `/morning` handles missing current-day state gracefully
**Priority:** P1  
**Area:** Prerequisite Handling

**Preconditions**
- `state/current_day.json` missing

**Steps**
1. Invoke `/morning`.

**Expected Result**
- Command fails gracefully or provides a clear missing-data message.
- It does not fabricate a digest from nothing.

---

### TC-035 — `/eod` generates end-of-day digest from cached state
**Priority:** P0  
**Area:** Claude Command

**Preconditions**
- Valid evening-updated current-day state exists

**Steps**
1. Invoke `/eod`.
2. Inspect digest file.

**Expected Result**
- File created at `daily/digests/YYYY-MM-DD-eod.md`.
- Output includes completed tasks, carry-forward tasks, due-soon tasks, blockers/missed commitments, and next-day focus. fileciteturn0file0L222-L233

---

### TC-036 — `/now` limits output to focused task subset
**Priority:** P1  
**Area:** Claude Command / Usability

**Preconditions**
- More than 10 open tasks exist

**Steps**
1. Invoke `/now`.

**Expected Result**
- Output surfaces 5–7 tasks max.
- Overdue and today items are prioritized.
- Low-signal undated tasks may be suppressed. fileciteturn0file0L274-L280

---

### TC-037 — `/pulse` reads cached transcript and pulse history inputs without live fetch
**Priority:** P1  
**Area:** Claude Command / Transcript Review

**Preconditions**
- Normalized transcript files exist

**Steps**
1. Invoke `/pulse`.
2. Observe data source usage.

**Expected Result**
- Command reads from `pulse/normalized/`, `pulse/weekly/`, and `pulse/master/customer-pulse-master.md`.
- For weekly generation, it uses the previous Thursday through Wednesday transcript window.
- Output tracks:
  - new feature requests
  - problems with existing features
  - what customers love about the platform
- Output flags recurring requests using pulse master history and applies value-effort placement for request/problem items.
- It does not live-fetch Fireflies unless explicitly requested and supported.

---

### TC-038 — `/research` creates research artifact in correct path
**Priority:** P0  
**Area:** Product Discovery Workflow

**Preconditions**
- Feature slug available
- Required inputs exist

**Steps**
1. Invoke `/research`.
2. Inspect output path.

**Expected Result**
- File created at `PRDs/<feature-name>/research.md`.
- Artifact includes problem framing, transcript evidence, public discussion evidence, competitor patterns, recurring complaints, workarounds, confidence rating, and references where available. fileciteturn0file0L236-L256

---

### TC-039 — `/research` distinguishes evidence from inference
**Priority:** P0  
**Area:** Evidence Guardrail

**Preconditions**
- Research command implemented

**Steps**
1. Invoke `/research`.
2. Review output content structure.

**Expected Result**
- Transcript-backed evidence is distinct from public-discussion evidence.
- Inferred recommendations are clearly labeled as inference.
- Output does not blur facts and assumptions. fileciteturn0file0L452-L455

---

### TC-040 — `/jtbd` creates JTBD artifact in correct path
**Priority:** P0  
**Area:** Product Discovery Workflow

**Preconditions**
- Research/problem inputs exist
- Feature slug available

**Steps**
1. Invoke `/jtbd`.
2. Inspect output.

**Expected Result**
- File created at `PRDs/<feature-name>/jtbd.md`.
- Artifact contains primary job, related jobs, pains, desired outcomes, assumptions, unresolved questions, and confidence level. fileciteturn0file0L248-L256

---

### TC-041 — `/prd` fails closed when prerequisites are missing
**Priority:** P0  
**Area:** PRD Workflow / Guardrail

**Preconditions**
- One or more prerequisite files missing or empty

**Steps**
1. Invoke `/prd`.

**Expected Result**
- Command fails closed.
- Missing prerequisite artifact(s) are explicitly identified.
- No partial PRD is silently generated. fileciteturn0file0L261-L265

---

### TC-042 — `/prd` succeeds when all prerequisites exist
**Priority:** P0  
**Area:** PRD Workflow

**Preconditions**
- `discovery.md` or equivalent exists and non-empty
- `jtbd.md` exists and non-empty
- `research.md` exists and non-empty
- `validation.md` exists if required by the flow

**Steps**
1. Invoke `/prd`.
2. Inspect output.

**Expected Result**
- PRD created at `PRDs/<feature-name>/prd.md`.
- PRD contains minimum required sections:
  - problem statement
  - background/context
  - goals
  - non-goals
  - target users/personas
  - JTBD alignment
  - user journeys
  - functional requirements
  - non-functional requirements
  - edge cases
  - dependencies
  - analytics/success metrics
  - rollout notes
  - open questions. fileciteturn0file0L259-L277

---

### TC-043 — PRD workflow respects required approval gates
**Priority:** P0  
**Area:** Workflow State / Approval Guardrail

**Preconditions**
- Approval-gated workflow enabled
- Some approval flags are false in workflow state

**Steps**
1. Attempt to progress workflow from JTBD/research to PRD stage.
2. Inspect system behavior.

**Expected Result**
- Workflow does not silently bypass approvals.
- Missing approvals block stage progression where required. fileciteturn0file0L456-L458

---

### TC-044 — PRD workflow state JSON updates safely
**Priority:** P1  
**Area:** Workflow State Management

**Preconditions**
- Existing PRD workflow state JSON

**Steps**
1. Progress one stage in the flow.
2. Inspect workflow state file.

**Expected Result**
- `currentStage`, `approvals`, and `lastUpdated` are updated accurately.
- No unrelated state keys are lost. fileciteturn0file0L404-L414

---

### TC-045 — `/wireframe` fails closed when PRD is missing
**Priority:** P0  
**Area:** Wireframe Workflow / Prerequisites

**Preconditions**
- No approved PRD exists

**Steps**
1. Invoke `/wireframe`.

**Expected Result**
- Command fails closed.
- Missing prerequisite is explicitly identified.
- No wireframe artifact is produced. fileciteturn0file0L538-L541

---

### TC-046 — `/wireframe` generates required artifacts from approved PRD
**Priority:** P0  
**Area:** Wireframe Workflow

**Preconditions**
- Approved `prd.md` exists
- Context files are present

**Steps**
1. Invoke `/wireframe`.
2. Inspect generated files.

**Expected Result**
- `PRDs/<feature-name>/wireframes/index.html` is created.
- `PRDs/<feature-name>/wireframes/notes.md` is created.
- HTML/CSS is a real artifact, not a prose brief. fileciteturn0file0L278-L296

---

### TC-047 — `/wireframe` default output is single-file HTML with embedded CSS
**Priority:** P1  
**Area:** Wireframe Output Convention

**Preconditions**
- Standard wireframe generation path used

**Steps**
1. Invoke `/wireframe`.
2. Inspect `index.html`.

**Expected Result**
- Default output is a single HTML file with embedded CSS unless explicitly justified otherwise. fileciteturn0file0L287-L291

---

### TC-048 — `/wireframe` includes key UI states where applicable
**Priority:** P1  
**Area:** Wireframe Coverage

**Preconditions**
- PRD contains relevant UI flow

**Steps**
1. Generate wireframe.
2. Review for state handling.

**Expected Result**
Where applicable, wireframe includes:
- default
- empty
- loading
- error
- success states. fileciteturn0file0L291-L296

---

### TC-049 — Wireframe does not invent unsupported product logic
**Priority:** P0  
**Area:** Design Guardrail

**Preconditions**
- Approved PRD and UX pattern context exist

**Steps**
1. Generate wireframe.
2. Compare output against PRD and UX patterns.

**Expected Result**
- UI is based on approved PRD and UX patterns only.
- No invented product logic or extra workflows appear. fileciteturn0file0L296-L296

---

### TC-050 — `state/current_day.json` validates against schema
**Priority:** P0  
**Area:** Schema Validation

**Preconditions**
- Current day state generated

**Steps**
1. Validate `state/current_day.json` against `current_day.schema.json`.

**Expected Result**
- Validation passes with correct structure and types.
- Required keys are present. fileciteturn0file0L355-L371

---

### TC-051 — `state/last_sync.json` validates and retains all sync statuses
**Priority:** P1  
**Area:** Schema Validation

**Preconditions**
- Morning, evening, daily transcript sync, and weekly customer pulse jobs have run at least once

**Steps**
1. Validate `state/last_sync.json`.
2. Inspect per-job status objects.

**Expected Result**
- File contains valid sync objects for:
  - `morningSync`
  - `eveningSync`
  - `dailyFirefliesSync`
  - `weeklyCustomerPulseDigest`
- Status and timestamps are accurate. fileciteturn0file0L373-L385

---

### TC-052 — Repeated sync run does not duplicate transcript records
**Priority:** P1  
**Area:** Idempotency

**Preconditions**
- Same daily Fireflies sync executed twice without new upstream data for the target day

**Steps**
1. Run daily transcript sync.
2. Run it again with unchanged upstream data.
3. Compare normalized outputs.

**Expected Result**
- Duplicate transcript entries are not introduced.
- Output remains stable or is safely overwritten in canonical form.

---

### TC-053 — Repeated morning sync safely refreshes same-day state
**Priority:** P1  
**Area:** Idempotency

**Preconditions**
- Morning sync can be rerun manually

**Steps**
1. Run morning sync twice the same day.
2. Compare state before and after second run.

**Expected Result**
- State is refreshed safely.
- Arrays do not duplicate existing entries.
- Last sync timestamps update correctly.

---

### TC-054 — Daily state stale threshold warning after 12 hours
**Priority:** P1  
**Area:** Staleness Guardrail

**Preconditions**
- `lastMorningSyncAt` or `lastEveningSyncAt` older than 12 hours

**Steps**
1. Invoke digest or command consuming the state.
2. Review warning behavior.

**Expected Result**
- Staleness warning is raised according to threshold policy. fileciteturn0file0L446-L450

---

### TC-055 — Calendar/task digest warning after 24 hours
**Priority:** P2  
**Area:** Staleness Guardrail

**Preconditions**
- Relevant digest source state older than 24 hours

**Steps**
1. Invoke `/morning` or `/eod`.

**Expected Result**
- System warns that digest inputs are no longer reliably fresh. fileciteturn0file0L446-L450

---

### TC-056 — Transcript and pulse freshness warnings follow thresholds
**Priority:** P2  
**Area:** Staleness Guardrail

**Preconditions**
- No successful `dailyFirefliesSync` for more than 36 hours
- No successful `weeklyCustomerPulseDigest` for more than 8 days

**Steps**
1. Invoke transcript-related flow such as `/pulse` or research consuming transcript data.

**Expected Result**
- Transcript freshness warning is shown for stale daily transcript sync.
- Weekly customer pulse freshness warning is shown when weekly digest is stale. fileciteturn0file0L446-L450

---

### TC-057 — PRD review warning after 30 days without update
**Priority:** P3  
**Area:** Workflow Freshness

**Preconditions**
- Existing PRD workflow state older than 30 days

**Steps**
1. Open or advance PRD workflow.
2. Review system warnings.

**Expected Result**
- Review/update warning is surfaced. fileciteturn0file0L446-L450

---

### TC-058 — Each generated artifact has a single canonical path
**Priority:** P1  
**Area:** File Ownership Guardrail

**Preconditions**
- Artifacts generated across flows

**Steps**
1. Generate digests, research, JTBD, PRD, and wireframe.
2. Inspect file placement.

**Expected Result**
- Each artifact exists at the defined canonical path only.
- No duplicate or conflicting copies are created. fileciteturn0file0L444-L445

---

### TC-059 — Scope compliance blocks Jira/Trello reintroduction
**Priority:** P0  
**Area:** Scope Guardrail

**Preconditions**
- Full repository available

**Steps**
1. Search code, docs, configs, schemas, and workflows for `Jira`, `JIRA`, `Trello`.
2. Review placeholders and comments.

**Expected Result**
- No active implementation, placeholder, or hidden dependency reintroduces Jira/Trello in v1. fileciteturn0file0L459-L460

---

### TC-060 — CI workflow permits Claude only in weekly customer pulse action
**Priority:** P0  
**Area:** Architecture Compliance

**Preconditions**
- All GitHub Actions available

**Steps**
1. Review all workflow YAMLs.
2. Search for Claude, Anthropic, LLM prompts, or AI service calls.

**Expected Result**
- Only `weekly-customer-pulse.yml` may invoke Claude/Anthropic services.
- `morning-sync.yml`, `evening-sync.yml`, and `daily-fireflies-sync.yml` contain no Claude/Anthropic invocation.
- Architecture boundary is intact. fileciteturn0file0L38-L49

---

### TC-061 — Missing environment variables fail clearly
**Priority:** P0  
**Area:** Configuration / Security

**Preconditions**
- One or more required credentials unset

**Steps**
1. Trigger relevant workflow or CLI command.
2. Observe startup and logs.

**Expected Result**
- Process fails fast with clear configuration error.
- Sensitive secrets are not printed in logs.

---

### TC-062 — Sensitive credentials are never written to repo artifacts
**Priority:** P0  
**Area:** Security

**Preconditions**
- Valid credentials in use
- Workflow and CLI operations executed

**Steps**
1. Execute sync and task flows.
2. Inspect generated JSON/Markdown/log files.

**Expected Result**
- Tokens, secrets, refresh tokens, auth headers, and private credentials are not persisted to repository artifacts.

---

### TC-063 — Retry logic does not create duplicate side effects
**Priority:** P1  
**Area:** Reliability / Retry

**Preconditions**
- Retry utility active
- Simulate transient network failure mid-operation

**Steps**
1. Trigger create/update/sync operation.
2. Inject transient failure causing retry.
3. Inspect resulting state and remote side effects.

**Expected Result**
- Retried operation completes safely.
- Duplicate tasks or duplicate transcript records are not created unless upstream API semantics force it and code handles dedupe.

---

### TC-064 — Raw snapshot write failure does not leave partial corrupted file
**Priority:** P1  
**Area:** File Integrity

**Preconditions**
- Simulate disk write interruption or permission error

**Steps**
1. Trigger sync.
2. Force file write failure during raw snapshot creation.
3. Inspect file state.

**Expected Result**
- Partial/corrupt file is not left as the accepted canonical output.
- Error is surfaced.
- Prior valid state remains intact where possible.

---

### TC-065 — Invalid normalized JSON is rejected by validation layer
**Priority:** P1  
**Area:** Validation

**Preconditions**
- Ability to inject malformed normalized output

**Steps**
1. Feed invalid transcript or current-day JSON to validation flow.
2. Observe behavior.

**Expected Result**
- Validation fails.
- Invalid artifact is rejected or flagged.
- Downstream Claude commands do not consume silently corrupted state.

---

### TC-066 — Research flow works with transcript input only
**Priority:** P2  
**Area:** Discovery Flexibility

**Preconditions**
- Synced Fireflies transcripts available
- No extra user note provided

**Steps**
1. Invoke `/research`.

**Expected Result**
- Research flow can proceed using transcript evidence alone when acceptable by design.
- Gaps and lower confidence are clearly stated. fileciteturn0file0L236-L243

---

### TC-067 — Research flow works with user notes only
**Priority:** P2  
**Area:** Discovery Flexibility

**Preconditions**
- User-provided feature/problem notes available
- No transcript evidence available

**Steps**
1. Invoke `/research`.

**Expected Result**
- Flow proceeds when a valid required input source exists.
- Missing transcript support is not falsely implied. fileciteturn0file0L236-L243

---

### TC-068 — `/prd` uses existing approved artifacts rather than inventing missing discovery
**Priority:** P1  
**Area:** Workflow Discipline

**Preconditions**
- Research and JTBD artifacts exist
- Discovery file minimal but valid

**Steps**
1. Invoke `/prd`.
2. Compare generated content against inputs.

**Expected Result**
- PRD is grounded in provided artifacts.
- It does not silently fabricate unapproved discovery evidence.

---

### TC-069 — Digest paths in current-day state update after successful digest generation
**Priority:** P2  
**Area:** State Completeness

**Preconditions**
- Morning or EOD digest generation succeeds

**Steps**
1. Generate a digest.
2. Inspect `state/current_day.json`.

**Expected Result**
- Relevant `digestPaths.morning` or `digestPaths.eod` field updates to the created file path if the implementation supports this contract. fileciteturn0file0L355-L371

---

### TC-070 — Build phases are implementation-testable end to end
**Priority:** P2  
**Area:** Delivery Readiness

**Preconditions**
- Foundation, sync, CLI, command, workflow, and QA modules implemented

**Steps**
1. Validate Phase 1 outputs.
2. Validate Phase 2 syncs.
3. Validate Phase 3 task CLI.
4. Validate Phase 4 Claude commands.
5. Validate Phase 5 discovery + PRD.
6. Validate Phase 6 wireframe generation.
7. Validate Phase 7 QA hardening evidence.

**Expected Result**
- Each phase produces the intended testable outputs and dependencies for the next phase. fileciteturn0file0L549-L577

---

## 6. Recommended Automation Coverage

These test cases should be automated first:

### Must automate
- TC-001 to TC-020
- TC-021 to TC-031
- TC-032 to TC-049
- TC-050 to TC-065

### Good candidates for integration test suites
- Sync workflow success/failure/stale-state tests
- Todoist create/update/complete with mock APIs
- Fireflies pagination and dedupe
- PRD and wireframe prerequisite gate tests
- Guardrail checks for Claude-only-in-weekly-customer-pulse and no-Jira/Trello-in-scope

### Good candidates for static checks
- Search-based guardrail scan for banned terms and banned integrations
- Workflow lint for forbidden AI service references outside `weekly-customer-pulse.yml`
- Schema validation in CI
- Canonical-path enforcement

---

## 7. Exit Criteria

QA sign-off should require:

1. All P0 tests passed
2. No open P0/P1 defects related to:
   - data corruption
   - architecture violations
   - destructive task actions
   - broken prerequisites
   - stale-state misrepresentation
3. CI proves Claude/Anthropic invocation is limited to `weekly-customer-pulse.yml` only
4. Scope scan proves Jira/Trello are absent
5. Core artifacts generate at canonical paths with valid schemas
6. Failure paths preserve prior valid state and report errors honestly

---

## 8. Key Risks to Watch

- Silent overwrite of valid state with empty API response
- Duplicate transcript ingestion during retry/pagination
- Ambiguous task completion or update against wrong Todoist item
- Claude commands presenting stale cached state as fresh
- PRD/wireframe generation bypassing prerequisite or approval gates
- Architecture drift where AI spreads beyond the allowed weekly customer pulse workflow

---

## 9. Suggested Next QA Deliverables

After these Markdown test cases, the next best artifacts would be:

- a traceability matrix mapping requirements → test cases
- Postman / mock API collections for Todoist, Google Calendar, Fireflies
- Jest/Vitest integration test skeletons
- CI guardrail checks for banned dependencies and forbidden workflow steps
