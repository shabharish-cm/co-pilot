# PM Copilot — Final Implementation Document

## 1. Purpose

This document defines the final implementation plan for a **personal PM Copilot** built with:

- **Node.js**
- **TypeScript**
- **Markdown-first storage**
- **GitHub Actions** for scheduled sync and weekly pulse orchestration
- **Claude Code / Claude Cowork** for AI-assisted reasoning and artifact generation

This revamp removes **Jira** and **Trello** from scope entirely and consolidates the design around the systems that actually matter for the stated objectives:

- **Todoist**
- **Google Calendar**
- **Fireflies**
- **Claude Code / Claude Cowork**
- **Git-backed repository state**

The document is designed to be implementation-ready for Codex or an engineering agent.

---

## 2. Scope Summary

### In scope

1. Morning GitHub Action to fetch:
   - open Todoist tasks
   - current day Google Calendar events
2. Evening GitHub Action to fetch:
   - tasks completed that day
   - tasks due in the upcoming days
3. Daily GitHub Action to fetch:
   - Fireflies transcripts for the previous day
4. Thursday scheduled Claude pulse digest action to:
   - read normalized transcripts from previous Thursday through Wednesday
   - update weekly pulse digest and pulse master document
   - detect recurring requests using prior pulse history
5. A Node.js task manager that can create and update Todoist tasks
6. Claude command instructions for daily execution workflows such as `/morning`
7. Claude-driven research workflow to:
   - review Fireflies transcripts
   - research competition and public discussions
   - determine Job To Be Done
8. Claude-driven PRD generation workflow
9. Claude-driven HTML/CSS wireframe generation workflow
10. Repository-backed memory and context persistence

### Explicitly out of scope

The following are **removed from scope** and must not appear in architecture, foldering, modules, or implementation assumptions:

- Jira
- Trello
- Any cross-system feature request reconciliation involving Jira/Trello
- Any GitHub Action other than the weekly pulse digest workflow that calls Claude, Anthropic APIs, or other LLM services

---

## 3. Non-Negotiable Architecture Constraint

## 3.1 Claude usage boundary

**Default rule: GitHub Actions are non-AI.**

One explicit exception is allowed: a Thursday `weekly-customer-pulse.yml` workflow may invoke Claude to generate the weekly customer pulse digest and update the pulse master document.

### Therefore:

- **Morning, evening, and daily Fireflies transcript sync actions may not call Claude**
- **Only `weekly-customer-pulse.yml` may call Claude/Anthropic APIs**
- **No GitHub Action may generate JTBDs, PRDs, broad research, or wireframes using AI**
- **All non-pulse sync actions are limited to fetch, normalize, validate, cache, and persist operations**

### GitHub Actions are allowed to:

- call Todoist APIs
- call Google Calendar APIs
- call Fireflies APIs
- transform API responses into normalized JSON/Markdown-ready state
- write repository state files
- update freshness metadata
- open PRs or commit updated state if desired
- run Thursday pulse digest orchestration that reads cached normalized transcripts and updates pulse artifacts via Claude

### Claude Code / Cowork are allowed to:

- interpret synced data
- produce daily digests
- prioritize tasks
- analyze transcripts
- perform JTBD reasoning
- do competition and public discussion research
- write PRDs
- generate HTML/CSS wireframes

If this boundary gets blurred, the system will quietly become a mess with a nicer README. Don’t do that.

## 3.2 Claude model routing policy

Use explicit model routing for predictability and cost control:

- **Claude Haiku** for writing outputs:
  - daily digests (`/morning`, `/eod`)
  - weekly customer pulse digest write-up
  - PRD drafting (`/prd`)
- **Claude Sonnet** for reasoning-heavy work:
  - prioritization and decision support
  - transcript interpretation and pattern analysis
  - customer pulse classification and recurrence detection
  - research synthesis and JTBD reasoning

When a workflow contains both reasoning and writing, run it as two phases:
1. Sonnet performs analysis and produces structured intermediate notes.
2. Haiku turns approved notes into the final written artifact.

---

## 4. Business Objectives to Solution Mapping

| Objective | Solution | Status in final design |
|---|---|---|
| Morning scheduled list of open tasks and scheduled calls | `morning-sync.yml` fetches Todoist + Google Calendar and writes canonical daily state | Covered |
| Evening scheduled list of completed tasks and upcoming tasks | `evening-sync.yml` fetches completed tasks + due-soon tasks and updates state | Covered |
| Daily Fireflies transcript sync | `daily-fireflies-sync.yml` fetches previous day transcripts and normalizes them | Covered |
| Thursday scheduled customer pulse digest | `weekly-customer-pulse.yml` invokes Claude on cached normalized transcripts from Thu-Wed and updates pulse outputs | Covered |
| Task manager from Claude Code/Cowork | Node.js CLI + Claude command wrappers for create/update/complete flows | Covered |
| Daily digest slash command like `/morning` | Claude command reads cached state and generates human digest | Covered |
| Model routing consistency | Haiku writes PRDs/digests; Sonnet handles reasoning/research/analysis | Covered |
| Research competition + transcripts + public discussions + JTBD | Claude research workflow using synced files + public web research within Claude environment only | Covered |
| Write PRD | Claude PRD workflow with approvals and artifact writing | Covered |
| Design HTML/CSS wireframes | Claude design workflow outputs wireframe artifacts from approved PRD | Covered |
| AI usage in GitHub Actions is tightly constrained | Only `weekly-customer-pulse.yml` may invoke Claude; all other workflows remain non-AI | Covered |

---

## 5. Design Principles

### 5.1 Repository is the memory layer
All durable context must live as files in the repository.

### 5.2 Markdown-first, JSON-where-needed
- Markdown for human-readable outputs
- JSON for machine state, snapshots, and validation

### 5.3 Cache first, live fetch second
Claude workflows should prefer repository data first. Live calls are for the sync jobs, not for every user interaction.

### 5.4 One source of truth per entity
- Todoist is the source of truth for task records
- Google Calendar is the source of truth for meetings
- Fireflies is the source of truth for transcripts
- Repository files are the source of truth for derived outputs, memory, and workflow artifacts

### 5.5 Human approval at product checkpoints
JTBD, research framing, PRD direction, and wireframe direction must stop for human approval when the workflow requires it.

### 5.6 Explainability over magic
Every major recommendation should be traceable to:
- synced task state
- meeting schedule
- transcript evidence
- previous product context
- public discussion research

### 5.7 Explicit model assignment
- Haiku is the default writer for PRDs and digest artifacts.
- Sonnet is the default model for reasoning, research, and analysis tasks.
- Command and workflow instructions must declare the intended model role to avoid silent drift.

---

## 6. Existing Claude Assets to Reuse

The repository already contains a valid Claude structure that should be reused instead of duplicated.

### Existing skill files

Under `.claude/Skills/`:

- `design-ux-researcher.md`
- `engineering-software-architect.md`
- `jtbd.md`
- `product-manager.md`
- `product-trend-researcher.md`

### Existing context files

Under `context/`:

- `business/business_profile.md`
- `product/product_glossary.md`
- `product/ux_patterns.md`
- `system/claude.md`
- `system/routing-and-scoring.md`

### Implementation rule

Do **not** create duplicate versions of these skills unless a true gap is found.

Instead:
- reference them from command instructions
- strengthen them only if required
- keep command orchestration separate from skill definitions

---

## 7. Recommended Repository Structure

```text
.claude/
  commands/
    morning.md
    eod.md
    now.md
    add.md
    update.md
    done.md
    pulse.md
    research.md
    jtbd.md
    prd.md
    wireframe.md
    diagnostics.md
  Skills/
    design-ux-researcher.md
    engineering-software-architect.md
    jtbd.md
    product-manager.md
    product-trend-researcher.md
  settings.json
  settings.local.json

context/
  business/
    business_profile.md
  product/
    product_glossary.md
    ux_patterns.md
  system/
    claude.md
    routing-and-scoring.md

daily/
  raw/
  digests/
  README.md

pulse/
  raw/
  normalized/
  weekly/
  master/
    customer-pulse-master.md

PRDs/
  <feature-name>/
    discovery.md
    jtbd.md
    research.md
    validation.md
    prd.md
    wireframes/
      index.html
      notes.md
    approvals/
      jtbd.approved.json
      research.approved.json
      validation.approved.json
      prd.approved.json

state/
  current_day.json
  last_sync.json
  transcript_index.json

schemas/
  current_day.schema.json
  pulse.schema.json
  transcript.schema.json
  prd-status.schema.json
  sync-status.schema.json
  todoist-task.schema.json

scripts/
  cli/
    index.ts
    router.ts
    command-registry.ts
  integrations/
    todoist/
      client.ts
      mapper.ts
      routing.ts
      types.ts
    gcal/
      client.ts
      mapper.ts
      types.ts
    fireflies/
      client.ts
      queries.ts
      mapper.ts
      types.ts
  services/
    sync/
      morning-sync.service.ts
      evening-sync.service.ts
      daily-fireflies-sync.service.ts
      weekly-customer-pulse.service.ts
    task-manager/
      task-manager.service.ts
      task-routing.service.ts
    digest/
      morning-digest.service.ts
      eod-digest.service.ts
    pulse/
      transcript-loader.service.ts
      pulse-reader.service.ts
    prd/
      workflow-state.service.ts
      artifact-writer.service.ts
    memory/
      context-loader.ts
      git-sync.service.ts
  utils/
    date.ts
    file.ts
    logger.ts
    retry.ts
    validation.ts
  config/
    env.ts
    paths.ts
    thresholds.ts
  types/
    daily.ts
    transcript.ts
    pulse.ts
    prd-status.ts
```

---

## 8. Functional Architecture

## 8.1 Scheduled Sync Layer

### Purpose
Collect external data on a schedule and persist it locally for Claude workflows.

### Important constraint
This layer is **non-AI by default**.
The only allowed AI exception is the Thursday customer pulse digest workflow.

### Responsibilities
- fetch data
- normalize payloads
- write raw snapshots
- update canonical state files
- record freshness and sync status
- fail gracefully with logs and prior-cache fallback markers

### Not allowed
- writing narrative summaries
- prioritizing tasks using LLM reasoning
- deriving JTBD
- generating PRDs
- generating HTML/CSS wireframes
- invoking Claude from any workflow except `weekly-customer-pulse.yml`

---

## 8.2 Daily Task and Calendar Module

### Morning sync
Every morning, the system fetches:
- open Todoist tasks
- overdue Todoist tasks
- today’s Google Calendar events

### Output files
- `daily/raw/YYYY-MM-DD-morning.json`
- `state/current_day.json`
- `state/last_sync.json`

### Evening sync
Every evening, the system fetches:
- tasks completed today
- tasks still open
- tasks due in the next **3 days**

Using a fixed 3-day window removes ambiguity. “Upcoming days” without a number is just future confusion in a trench coat.

### Output files
- `daily/raw/YYYY-MM-DD-evening.json`
- updated `state/current_day.json`
- updated `state/last_sync.json`

---

## 8.3 Task Manager Module

### Purpose
Allow Todoist task operations from Node.js and Claude-driven command workflows.

### Commands supported
- `/now`
- `/add`
- `/update`
- `/done`

### Rules
- Todoist remains the source of truth for tasks
- local state stores execution context, not competing task truth
- destructive or ambiguous actions require preview or confirmation

### Minimum create/update capability
The task manager must support:
- create task
- update content
- update due date
- update priority
- update labels
- complete task
- optional comment/notes support later

### Section routing
If Todoist inbox sections are used, routing logic should remain in `task-routing.service.ts` and be config-driven, not hardcoded into command text.

---

## 8.4 Fireflies Transcript Sync Module

### Purpose
Sync meetings from the previous day so customer pulse analysis always has fresh inputs.

### Daily behavior
Run every day and fetch transcripts for the previous calendar day.

### The sync job must:
- compute previous-day start and end timestamps in the configured timezone
- fetch transcript metadata and transcript content where available
- handle pagination
- store raw payloads
- store normalized transcript records
- update transcript index metadata

### Output files
- `pulse/raw/YYYY-MM-DD-fireflies.json`
- `pulse/normalized/YYYY-MM-DD-transcripts.json`
- `state/transcript_index.json`

### Normalized transcript fields
Each transcript record should include:
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

## 8.5 Customer Pulse Weekly Digest Module

### Purpose
Generate a weekly customer pulse digest and maintain a running pulse master document.

### Schedule
Every Thursday, trigger a scheduled Claude workflow that uses cached normalized transcripts.

### Model usage
- Sonnet for transcript analysis, clustering, recurrence detection, and value-effort placement
- Haiku for writing the final weekly digest text and pulse master updates

### Weekly window
Use normalized transcripts from the previous Thursday through the current Wednesday.

### The weekly digest job must:
- collect normalized transcript files for the Thu-Wed window
- load the existing `pulse/master/customer-pulse-master.md`
- classify findings into the three required trackers:
  - new feature requests
  - problems with existing features
  - what customers love about the platform
- score each request/problem item in a value-effort matrix
- detect recurring requests by comparing with prior weeks in the pulse master
- write the new weekly digest and append/update the pulse master

---

## 8.6 Claude Daily Digest Module

### Purpose
Generate the human-readable work digest from cached state.

### `/morning`
Reads repository state and produces:
- overdue tasks
- tasks due today
- meetings scheduled today
- suggested task order
- possible scheduling conflicts
- freshness banner showing when source data was last synced

### `/eod`
Reads repository state and produces:
- completed tasks today
- carry-forward tasks
- tasks due soon
- missed commitments or likely blockers
- suggested next-day focus

### Key rule
These digests are **generated only in Claude Code/Cowork**.
The sync job must never pre-generate them using AI.

### Model usage
- Use Haiku to draft digest output text.
- Use Sonnet only if intermediate reasoning is needed before digest drafting.

### Output paths
- `daily/digests/YYYY-MM-DD-morning.md`
- `daily/digests/YYYY-MM-DD-eod.md`

---

## 8.7 Product Discovery and Research Module

### Purpose
Turn transcripts, notes, and public signals into a structured product discovery flow.

### Required inputs
At least one of the following:
- user-provided notes or scribbles
- a feature request summary
- synced Fireflies transcripts
- prior product context documents

### Optional but important inputs
- competitor observations
- public discussions from sources such as Reddit, product forums, release notes, docs, help centers, or community threads

### Important execution rule
Public discussion research must happen **inside Claude Code/Cowork only**.
It must not be executed in GitHub Actions.

### Model usage
- Use Sonnet for research synthesis, evidence interpretation, and analytical reasoning.

### Recommended command split
- `/research` → collects and writes evidence-backed market and discussion research
- `/jtbd` → converts approved research/problem inputs into JTBD statements

### `/research` outputs
`PRDs/<feature-name>/research.md` should contain:
- problem framing
- evidence from transcripts
- evidence from public discussions
- competitor patterns
- recurring complaints
- notable workarounds
- confidence rating
- citations or source references where available

### `/jtbd` outputs
`PRDs/<feature-name>/jtbd.md` should contain:
- primary job statement
- related jobs
- pains
- desired outcomes
- assumptions
- unresolved questions
- confidence level

---

## 8.8 PRD Generation Module

### Purpose
Generate structured product requirements only after discovery inputs exist.

### Command
`/prd`

### Model usage
- Use Sonnet for requirement reasoning, tradeoff analysis, and structure planning.
- Use Haiku to draft and format the final PRD artifact.

### Preconditions
The command should fail closed unless these artifacts exist and are non-empty:
- `discovery.md` or equivalent problem input
- `jtbd.md`
- `research.md`
- `validation.md` if a validation gate is required

### Skills used
- `product-manager.md`
- `engineering-software-architect.md`
- `product-trend-researcher.md`
- `jtbd.md`

### Output
`PRDs/<feature-name>/prd.md`

### PRD minimum sections
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
- open questions

---

## 8.9 HTML/CSS Wireframe Module

### Purpose
Generate practical UI wireframes from the approved PRD.

### Command
`/wireframe`

### Inputs
- approved `prd.md`
- `context/product/ux_patterns.md`
- `context/product/product_glossary.md`
- `design-ux-researcher.md`

### Output artifacts
- `PRDs/<feature-name>/wireframes/index.html`
- `PRDs/<feature-name>/wireframes/notes.md`

### Requirements
- HTML and CSS output must be real artifacts, not just a text brief
- default output should be a **single-file HTML mockup with embedded CSS** unless multi-file output is explicitly needed
- the wireframe should include key states where applicable:
  - default
  - empty
  - loading
  - error
  - success

### Guardrail
Wireframes should be based on the PRD and UX patterns, not invented product logic.

---

## 9. Claude Command Design

## 9.1 `/morning`
Purpose: generate the daily morning digest from cached daily state.

Model:
- Haiku for final digest drafting.
- Sonnet only for optional intermediate reasoning.

Reads:
- `state/current_day.json`
- latest daily raw snapshot if needed
- context files only if helpful

Writes:
- `daily/digests/YYYY-MM-DD-morning.md`

## 9.2 `/eod`
Purpose: generate end-of-day summary and carry-forward recommendations.

Model:
- Haiku for final digest drafting.
- Sonnet only for optional intermediate reasoning.

Writes:
- `daily/digests/YYYY-MM-DD-eod.md`

## 9.3 `/now`
Purpose: show focused next actions, not a giant guilt dump.

Model:
- Sonnet.

Behavior:
- surface 5 to 7 tasks max
- prioritize overdue and today items
- optionally suppress low-signal undated tasks

## 9.4 `/add`
Purpose: create a new Todoist task.

Model:
- Sonnet for inference/disambiguation when needed.

Behavior:
- validate task title
- infer due date/priority if provided
- preview before create when confidence is low

## 9.5 `/update`
Purpose: update Todoist task metadata.

Model:
- Sonnet for ambiguity handling and change reasoning.

Behavior:
- show before/after when important fields change
- require confirmation for ambiguous changes

## 9.6 `/done`
Purpose: complete a Todoist task.

Model:
- Sonnet for ambiguity handling.

Behavior:
- confirm when task match is ambiguous
- persist local state update after remote success

## 9.7 `/pulse`
Purpose: generate or review weekly customer pulse output from cached transcript data.

Model:
- Sonnet for transcript analysis, recurrence detection, and value-effort reasoning.
- Haiku for final weekly pulse write-up text.

Behavior:
- read from `pulse/normalized/`, `pulse/weekly/`, and `pulse/master/customer-pulse-master.md`
- for weekly runs, use normalized transcripts from previous Thursday through Wednesday
- classify findings into:
  - new feature requests
  - problems with existing features
  - what customers love about the platform
- apply value-effort scoring for request/problem items
- compare with prior pulse master entries to flag recurring requests
- do not fetch Fireflies live unless explicitly requested and supported manually

## 9.8 `/research`
Purpose: produce evidence-backed research from transcripts, prior context, competitors, and public discussion.

Model:
- Sonnet.

Writes:
- `PRDs/<feature-name>/research.md`

## 9.9 `/jtbd`
Purpose: generate candidate Jobs To Be Done from approved problem inputs and research.

Model:
- Sonnet.

Writes:
- `PRDs/<feature-name>/jtbd.md`

## 9.10 `/prd`
Purpose: generate the feature PRD after discovery approval.

Model:
- Sonnet for planning/analysis.
- Haiku for final PRD drafting.

Writes:
- `PRDs/<feature-name>/prd.md`

## 9.11 `/wireframe`
Purpose: generate HTML/CSS wireframes from an approved PRD.

Model:
- Sonnet.

Writes:
- `PRDs/<feature-name>/wireframes/index.html`
- `PRDs/<feature-name>/wireframes/notes.md`

---

## 10. Data Contracts

## 10.1 `state/current_day.json`

```json
{
  "date": "2026-03-18",
  "timezone": "Asia/Kolkata",
  "lastMorningSyncAt": "2026-03-18T05:30:00Z",
  "lastEveningSyncAt": null,
  "sourceStatus": {
    "todoist": "fresh",
    "googleCalendar": "fresh"
  },
  "openTasks": [],
  "completedToday": [],
  "dueSoon": [],
  "todayMeetings": [],
  "digestPaths": {
    "morning": null,
    "eod": null
  }
}
```

## 10.2 `state/last_sync.json`

```json
{
  "morningSync": {
    "ranAt": "2026-03-18T05:30:00Z",
    "status": "success"
  },
  "eveningSync": {
    "ranAt": "2026-03-17T13:00:00Z",
    "status": "success"
  },
  "dailyFirefliesSync": {
    "ranAt": "2026-03-18T01:00:00Z",
    "status": "success",
    "dayKey": "2026-03-17"
  },
  "weeklyCustomerPulseDigest": {
    "ranAt": "2026-03-19T02:30:00Z",
    "status": "success",
    "weekKey": "2026-W12",
    "windowStart": "2026-03-12",
    "windowEnd": "2026-03-18"
  }
}
```

## 10.3 `pulse/normalized/YYYY-MM-DD-transcripts.json`

```json
{
  "dayKey": "2026-03-17",
  "generatedAt": "2026-03-18T01:15:00Z",
  "transcripts": [
    {
      "transcriptId": "ff_123",
      "meetingTitle": "Customer feedback sync",
      "meetingDate": "2026-03-17T09:00:00Z",
      "participants": ["A", "B"],
      "summary": "Customer asked for more flexible workflow rules",
      "transcriptText": "...",
      "sourceUrl": "https://...",
      "fetchedAt": "2026-03-18T01:10:00Z",
      "sourceDay": "2026-03-17"
    }
  ]
}
```

## 10.4 `pulse/master/customer-pulse-master.md`

Expected structure (Markdown):
- one section per `weekKey`
- three mandatory tracker subsections:
  - new feature requests
  - problems with existing features
  - what customers love
- value-effort matrix placement for request/problem items
- recurring-request markers with references to prior `weekKey` entries

## 10.5 PRD workflow state

```json
{
  "feature": "dynamic-workflow-rules",
  "currentStage": "research",
  "approvals": {
    "jtbd": false,
    "research": false,
    "validation": false,
    "prd": false
  },
  "lastUpdated": "2026-03-18T08:30:00Z"
}
```

---

## 11. GitHub Actions Design

## 11.1 `morning-sync.yml`

### Responsibilities
- run every morning
- fetch open Todoist tasks
- fetch current day Google Calendar events
- write raw snapshot
- update `state/current_day.json`
- update `state/last_sync.json`

### Must not do
- generate a natural-language digest
- call Claude
- score priorities with LLM logic

## 11.2 `evening-sync.yml`

### Responsibilities
- fetch tasks completed today
- fetch still-open tasks
- fetch tasks due in the next 3 days
- update raw snapshot and canonical state
- update sync status

### Must not do
- generate EOD narrative summary
- perform AI carry-forward reasoning

## 11.3 `daily-fireflies-sync.yml`

### Responsibilities
- run every day
- fetch previous-day Fireflies transcripts
- handle pagination
- write raw and normalized transcript files
- update transcript index and sync metadata

### Must not do
- summarize meetings with AI
- cluster pain points with Claude
- generate JTBD or product recommendations

## 11.4 `weekly-customer-pulse.yml`

### Responsibilities
- run every Thursday
- read normalized transcripts covering previous Thursday through Wednesday
- invoke Claude to generate `pulse/weekly/YYYY-WW-customer-pulse.md`
- update `pulse/master/customer-pulse-master.md` with this week’s findings
- classify points into:
  - new feature requests
  - problems with existing features
  - what customers love about the platform
- apply value-effort matrix scoring to request/problem items
- compare against pulse master history to flag recurring requests
- update weekly pulse sync metadata in `state/last_sync.json`

### Model execution contract
- Sonnet performs analysis and produces structured findings.
- Haiku writes the final digest and pulse master narrative text from those findings.

### Must not do
- fetch live Fireflies data directly (use cached normalized transcript files only)
- generate JTBD, PRD, or wireframe artifacts

---

## 12. Guardrails

## 12.1 AI boundary guardrail
AI execution in CI is allowed only in `weekly-customer-pulse.yml`.

## 12.2 File ownership guardrail
Each generated artifact must have a single canonical path.

## 12.3 Staleness guardrail
Suggested thresholds:
- morning/evening daily state stale after 12 hours
- calendar/task digest warning after 24 hours
- daily transcript sync stale after 36 hours
- weekly customer pulse digest stale after 8 days
- PRD review warning after 30 days without update

## 12.4 Command safety guardrail
Potentially destructive task operations require preview or confirmation when ambiguity exists.

## 12.5 Evidence guardrail
Research, JTBD, and PRD outputs must distinguish between:
- transcript-backed evidence
- public-discussion evidence
- inferred recommendations

Weekly customer pulse outputs must always include:
- new feature requests
- problems with existing features
- what customers love about the platform
- value-effort matrix placement for request/problem items
- explicit recurring-request markers where recurrence is detected

## 12.6 Approval guardrail
The workflow must not silently move from JTBD to PRD without required approvals where approvals are part of the chosen flow.

## 12.7 Scope guardrail
No hidden reintroduction of Jira or Trello in code, docs, workflows, or future placeholders in v1.

## 12.8 Model routing guardrail
- Digests and PRDs must be written by Haiku.
- Reasoning, research, and analysis tasks must run on Sonnet.
- Mixed workflows must preserve Sonnet-first analysis and Haiku-final-writing sequencing.

---

## 13. Acceptance Criteria

## 13.1 Morning sync acceptance
A successful morning run must:
- write one raw snapshot file
- update `state/current_day.json`
- include open tasks and today meetings
- write sync timestamps
- complete without AI dependencies

## 13.2 Evening sync acceptance
A successful evening run must:
- record completed tasks for the day
- record still-open tasks
- record tasks due in next 3 days
- update sync timestamps

## 13.3 Daily transcript sync acceptance
A successful daily run must:
- fetch previous-day transcripts
- handle pagination
- write raw payload
- write normalized transcript file
- update transcript index

## 13.4 Weekly customer pulse digest acceptance
A successful Thursday run must:
- use normalized transcript files from previous Thursday through Wednesday
- create `pulse/weekly/YYYY-WW-customer-pulse.md`
- update `pulse/master/customer-pulse-master.md`
- include sections for:
  - new feature requests
  - problems with existing features
  - what customers love about the platform
- include value-effort matrix placement for request/problem items
- mark recurring requests based on prior pulse master history

## 13.5 Task manager acceptance
The Node.js task manager must:
- create a Todoist task
- update an existing task
- complete a task
- handle API errors gracefully
- avoid corrupting local state when remote actions fail

## 13.6 Claude command acceptance
- `/morning` produces digest from cached state
- `/eod` produces summary from cached state
- `/pulse` can generate the weekly pulse output from cached normalized transcripts and existing pulse history
- `/research` writes research artifact
- `/jtbd` writes JTBD artifact
- `/prd` writes PRD artifact
- `/wireframe` writes HTML/CSS artifact

## 13.7 Architecture compliance acceptance
Repository logs, workflows, and code must show that only `weekly-customer-pulse.yml` may invoke Claude or Anthropic services.

## 13.8 Model routing acceptance
- `/morning` and `/eod` use Haiku for final digest writing.
- `/prd` uses Haiku for final PRD drafting.
- `/research` and `/jtbd` use Sonnet for reasoning and analysis.
- `/pulse` uses Sonnet for analysis and Haiku for final digest-style write-up.
- `weekly-customer-pulse.yml` shows Sonnet analysis followed by Haiku final digest/master writing.

---

## 14. QA Test Scenarios

### Scenario A — Todoist unavailable during morning sync
Expected result:
- workflow logs an error
- marks Todoist source as failed/stale
- preserves prior valid state where appropriate
- does not generate fake success data

### Scenario B — Google Calendar returns no meetings
Expected result:
- sync completes successfully
- state shows empty meetings array
- no failure unless API itself failed

### Scenario C — Fireflies pagination spans multiple pages
Expected result:
- all pages are fetched
- transcript count matches expected total if available
- normalized output contains deduplicated records

### Scenario D — Weekly pulse digest detects recurrence
Expected result:
- weekly pulse digest compares the current Thu-Wed window against pulse master history
- recurring requests are explicitly marked with prior-week references
- value-effort matrix placement is present for request/problem items

### Scenario E — `/morning` run before morning sync
Expected result:
- Claude clearly states stale or missing sync state
- it may still operate from last available cached state if present
- it must not pretend data is fresh

### Scenario F — `/wireframe` run before PRD exists
Expected result:
- command fails closed
- tells user which prerequisite artifact is missing

### Scenario G — ambiguous `/done` task selection
Expected result:
- command asks user to disambiguate or confirm
- no accidental completion occurs

### Scenario H — Model routing enforcement
Expected result:
- digest and PRD artifacts are written by Haiku
- reasoning/research/analysis steps run on Sonnet
- weekly pulse workflow logs show Sonnet analysis phase before Haiku writing phase

---

## 15. Build Phases

## Phase 1 — Foundation
Build:
- repo structure
- config loading
- file utilities
- schema validation
- API clients
- sync metadata handling

## Phase 2 — Scheduled sync workflows
Build:
- `morning-sync.yml`
- `evening-sync.yml`
- `daily-fireflies-sync.yml`
- `weekly-customer-pulse.yml`
- raw snapshot writing
- canonical state writing

## Phase 3 — Task manager CLI
Build:
- create/update/complete Todoist flows
- task retrieval utilities
- CLI router and registry

## Phase 4 — Claude command layer
Build:
- `.claude/commands/*.md` files
- command-to-skill references
- artifact path conventions
- model routing metadata for Haiku vs Sonnet execution

## Phase 5 — Discovery and PRD workflow
Build:
- research artifact generation flow
- JTBD generation flow
- PRD generation flow
- approval state handling

## Phase 6 — Wireframe workflow
Build:
- HTML/CSS artifact generation conventions
- design guidance integration from `ux_patterns.md`
- output validation for `index.html`

## Phase 7 — QA hardening
Build:
- test coverage for sync flows
- mock API error handling
- stale-state behavior tests
- command prerequisite tests

---

## 16. Final Implementation Directives for Codex

1. Remove every Jira and Trello reference from code, docs, config, schemas, and workflows.
2. Reuse the existing Claude skills already present in `.claude/Skills/`.
3. Add or update command instruction files under `.claude/commands/` rather than duplicating role files.
4. Keep GitHub Actions non-AI except for `weekly-customer-pulse.yml`.
5. Store all synced state in repository files.
6. Make Claude workflows consume repository state and write durable artifacts back into the repo.
7. Route model usage explicitly:
   - Haiku for writing PRDs and digests
   - Sonnet for reasoning, research, and analysis
8. Treat HTML/CSS wireframes as real deliverables, not optional prose.
9. Fail closed when prerequisites are missing.
10. Prefer explicitness over cleverness in task operations and workflow state.

---

## 17. Final Conclusion

This final design is intentionally narrower and stronger than the previous version.

It removes unnecessary systems, keeps a strict AI boundary with one explicit weekly exception, reuses the Claude skill assets that already exist, and cleanly separates:

- **daily non-AI sync work** from
- **scheduled weekly customer pulse AI synthesis** from
- **interactive Claude reasoning and artifact generation**

That separation is what makes this implementable, testable, and maintainable.

Anything else would be architecture cosplay.
