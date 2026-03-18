# PM Copilot — Implementation Plan

## What Already Exists (Do Not Duplicate)

### `.claude/Skills/` — Role definitions, reuse as-is
| File | Role | Used by |
|------|------|---------|
| `jtbd.md` | JTBD analyst, output template | `/jtbd` command |
| `product-manager.md` | Alex, PRD + opportunity templates | `/prd`, `/research` |
| `design-ux-researcher.md` | UX validation, usability research | `/wireframe` |
| `engineering-software-architect.md` | Tech trade-off analysis | `/prd` |
| `product-trend-researcher.md` | Market + competitive research (has WebSearch/WebFetch tools) | `/research` |

### `context/` — Static product + system knowledge
| File | Content | Used by |
|------|---------|---------|
| `business/business_profile.md` | CultureMonkey company context | All product workflows |
| `product/product_glossary.md` | Canonical platform terminology | `/prd`, `/wireframe` |
| `product/ux_patterns.md` | Wizard, table, modal, etc. patterns | `/wireframe` |
| `system/claude.md` | Repo-as-memory-layer declaration | System reference |
| `system/routing-and-scoring.md` | Todoist section IDs, routing priority rules, value-effort scoring | `/add`, `/update`, `/pulse` |
| `system/team-list.md` | CS + Engg team members with name aliases mapped to section IDs | `/add`, `task-routing.service.ts` |

---

## What Needs to Be Built

### Layer 1 — Repository Structure (scaffolding only, no code)

```
state/
  current_day.json       ← written by morning/evening sync
  last_sync.json         ← written by all 4 sync workflows
  transcript_index.json  ← written by daily-fireflies-sync

pulse/
  raw/                   ← YYYY-MM-DD-fireflies.json
  normalized/            ← YYYY-MM-DD-transcripts.json
  weekly/                ← YYYY-WW-customer-pulse.md
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
      prd.approved.json

schemas/
  current_day.schema.json
  pulse.schema.json
  transcript.schema.json
  prd-status.schema.json
  sync-status.schema.json
  todoist-task.schema.json
```

---

### Layer 2 — Node.js / TypeScript Foundation (`scripts/`)

**Build order: config → utils → types → integrations → services → CLI**

#### `scripts/config/`
- `env.ts` — loads and validates all env vars (API keys, timezone, etc.)
- `paths.ts` — canonical file path constants (all paths in one place)
- `thresholds.ts` — staleness windows (12h daily, 36h transcript, 8d pulse)

#### `scripts/utils/`
- `date.ts` — timezone-aware date math (previous day, Thu-Wed windows)
- `file.ts` — read/write JSON+MD helpers, atomic writes
- `logger.ts` — structured log output
- `retry.ts` — exponential backoff for API calls
- `validation.ts` — JSON schema validation against `schemas/`

#### `scripts/types/`
- `daily.ts` — `CurrentDay`, `TaskRecord`, `MeetingRecord`
- `transcript.ts` — `NormalizedTranscript`, `TranscriptIndex`
- `pulse.ts` — `PulseWeek`, `PulseEntry`, `RecurrenceMarker`
- `prd-status.ts` — `PRDWorkflowState`, `ApprovalGates`

#### `scripts/integrations/`

| Module | Files | What it does |
|--------|-------|--------------|
| `todoist/` | `client.ts`, `mapper.ts`, `routing.ts`, `types.ts` | REST API calls; maps tasks to internal type; section routing from `routing-and-scoring.md` rules |
| `gcal/` | `client.ts`, `mapper.ts`, `types.ts` | OAuth/service-account; fetches today's events |
| `fireflies/` | `client.ts`, `queries.ts`, `mapper.ts`, `types.ts` | GraphQL API; pagination; maps to `NormalizedTranscript` |

#### `scripts/services/sync/`

| Service | Triggered by | Writes |
|---------|-------------|--------|
| `morning-sync.service.ts` | `morning-sync.yml` | `daily/raw/YYYY-MM-DD-morning.json`, `state/current_day.json`, `state/last_sync.json` |
| `evening-sync.service.ts` | `evening-sync.yml` | `daily/raw/YYYY-MM-DD-evening.json`, updated state files |
| `daily-fireflies-sync.service.ts` | `daily-fireflies-sync.yml` | `pulse/raw/`, `pulse/normalized/`, `state/transcript_index.json` |

Note: There is no `weekly-customer-pulse.service.ts`. The Thursday pulse is handled entirely by the `/pulse` Claude command on a cron schedule. GitHub Actions do not call Claude.

#### `scripts/services/task-manager/`
- `task-manager.service.ts` — create, update, complete Todoist tasks
- `task-routing.service.ts` — config-driven section routing (reads from `routing-and-scoring.md` logic, not hardcoded)

#### `scripts/cli/`
- `index.ts` — entrypoint
- `router.ts` — dispatches to command handler
- `command-registry.ts` — maps CLI verbs to service functions

---

### Layer 3 — GitHub Actions (`.github/workflows/`)

All GitHub Actions are non-AI. No Anthropic API key required.

| Workflow | Schedule | Calls Claude? | Key constraint |
|----------|----------|---------------|----------------|
| `morning-sync.yml` | Daily ~6am IST | NO | Fetch + write only |
| `evening-sync.yml` | Daily ~7pm IST | NO | Fetch + write only |
| `daily-fireflies-sync.yml` | Daily ~1am IST | NO | Fetch + normalize only |

All workflows: fetch → normalize → validate → write state files → update sync metadata. No narrative generation, no LLM calls.

### Thursday Pulse — Claude Cron Task (not a GitHub Action)

The weekly customer pulse runs as a **Claude Code scheduled cron task** every Thursday. It reads from the local/git repo — no API key needed beyond what Claude Code already has.

```
Schedule: every Thursday (Claude cron)
Command: /pulse
Reads:  pulse/normalized/YYYY-MM-DD-transcripts.json (Thu–Wed window)
        pulse/master/customer-pulse-master.md
        pulse/weekly/ (prior weeks for recurrence detection)
Writes: pulse/weekly/YYYY-WW-customer-pulse.md
        pulse/master/customer-pulse-master.md (appended)
        state/last_sync.json (pulse key updated)
Models: Sonnet → analysis + recurrence detection
        Haiku  → final digest write-up
```

This eliminates the need for a `ANTHROPIC_API_KEY` secret in GitHub Actions entirely.

---

### Layer 4 — Claude Commands (`.claude/commands/`)

Each command is a Markdown instruction file. Commands are **not** skills — they orchestrate skills and read repo state.

#### Daily ops commands

| Command | Model | File reads | File writes | Skill used |
|---------|-------|-----------|------------|------------|
| `/morning` | Haiku (write), Sonnet optional | `state/current_day.json`, `state/last_sync.json` | `daily/digests/YYYY-MM-DD-morning.md` | None directly |
| `/eod` | Haiku (write), Sonnet optional | `state/current_day.json` | `daily/digests/YYYY-MM-DD-eod.md` | None directly |
| `/now` | Sonnet | `state/current_day.json` | None | None |

#### Task manager commands

| Command | Model | Behavior |
|---------|-------|----------|
| `/add` | Sonnet | Infer due/priority → preview → call task-manager CLI → write state |
| `/update` | Sonnet | Show before/after → confirm → call CLI |
| `/done` | Sonnet | Disambiguate match → confirm → call CLI |

#### Product intelligence commands

| Command | Model | File reads | File writes | Skills invoked |
|---------|-------|-----------|------------|----------------|
| `/pulse` | Sonnet (analysis), Haiku (write) | `pulse/normalized/`, `pulse/weekly/`, `pulse/master/customer-pulse-master.md` | `pulse/weekly/YYYY-WW.md`, updates master | None |
| `/research` | Sonnet + **WebSearch/WebFetch** | `pulse/normalized/`, `context/business/business_profile.md`, prior `PRDs/<feature>/` | `PRDs/<feature>/research.md` | `product-trend-researcher.md` |
| `/jtbd` | Sonnet | `PRDs/<feature>/research.md`, transcripts | `PRDs/<feature>/jtbd.md` | `jtbd.md` |
| `/prd` | Sonnet (plan), Haiku (write) | `discovery.md`, `jtbd.md`, `research.md`, `context/product/product_glossary.md` | `PRDs/<feature>/prd.md` | `product-manager.md`, `engineering-software-architect.md`, `jtbd.md` |
| `/wireframe` | Sonnet | `PRDs/<feature>/prd.md`, `context/product/ux_patterns.md`, `context/product/product_glossary.md` | `PRDs/<feature>/wireframes/index.html`, `notes.md` | `design-ux-researcher.md` |

---

## Todoist Section Routing — Implementation Detail

### Section Registry (hardcode IDs in `scripts/config/paths.ts` or a dedicated `sections.ts`)

```typescript
export const TODOIST_SECTIONS = {
  features:   { id: '6g8x4JxwH876pgGQ', name: 'Features' },
  csRequests: { id: '6g8x4HVHxpWVfVHQ', name: 'CS Requests' },
  enggAsks:   { id: '6g8x4MgXR2q68fgQ', name: 'Engg asks' },
  effy:       { id: '6g9QcvpjJw2cFmCx', name: 'effy' },
} as const;
```

### Routing Logic in `task-routing.service.ts`

```
Input: task title string (+ optional notes, labels)

Step 1 — Effy check
  if title.toLowerCase().includes('effy') → return effy

Step 2 — Load team list from context/system/team-list.md
  Parse CS members: [KN, Karthik Rao, Karthik, Gowtham]
  Parse Engg members: [Dhamo, Sam, Saran]

Step 3 — CS team member scan (case-insensitive)
  for each CS alias: if title includes alias → csMatch = true

Step 4 — Engg team member scan
  for each Engg alias: if title includes alias → enggMatch = true

Step 5 — Resolve
  if csMatch → return CS Requests  (log enggMatch if also true)
  if enggMatch → return Engg asks
  if feature keywords found → return Features (confidence: inferred)
  if label 'follow-up' → return CS Requests (confidence: label-inferred)
  if label 'engineering' → return Engg asks (confidence: label-inferred)
  default → return Features (confidence: defaulted)

Step 6 — Emit routing log
  { task, rule, sectionId, sectionName, confidence, competingMatch? }
```

### Claude `/add` behavior for routing

When Claude processes `/add "share mockup to KN"`:
1. Runs routing logic above → matches KN → CS Requests, confidence: `matched`
2. Since confidence is `matched`, proceed without asking
3. If confidence is `inferred` or `defaulted`, show routing decision and ask to confirm before creating

Example output:
```
Creating task: "share mockup to KN"
  Section: CS Requests  (KN = CS team member)
  Due: [inferred or none]
  Priority: [inferred or none]
Confirm? [y/n/edit]
```

---

## Trigger Map: What Causes What

```
User runs /morning
  → reads state/current_day.json (freshness check via last_sync.json)
  → if stale: banner warns, may still show cached data
  → Haiku drafts digest
  → writes daily/digests/YYYY-MM-DD-morning.md

User runs /add "share mockup to KN"
  → Sonnet parses task title
  → task-routing.service.ts reads context/system/team-list.md
  → "KN" matches CS member → section: CS Requests (6g8x4HVHxpWVfVHQ), confidence: matched
  → shows preview: task title, section, due, priority
  → on confirm: calls task-manager.service.ts → Todoist REST API (POST /tasks with section_id)
  → updates state/current_day.json

User runs /add "Q2 roadmap planning"
  → no team signal detected → feature keywords found → section: Features, confidence: inferred
  → shows routing decision, asks to confirm before creating

User runs /research <feature>
  → reads pulse/normalized/ for transcript evidence
  → reads context/business/business_profile.md for product context
  → loads product-trend-researcher.md skill (has WebSearch/WebFetch)
  → performs live web research (Reddit, competitor docs, forums)
  → Sonnet synthesizes into research.md

User runs /jtbd <feature>
  → reads PRDs/<feature>/research.md (must exist)
  → loads jtbd.md skill
  → Sonnet generates JTBD statements
  → writes PRDs/<feature>/jtbd.md

User runs /prd <feature>
  → checks: discovery.md, jtbd.md, research.md all exist and non-empty
  → loads product-manager.md, engineering-software-architect.md, jtbd.md skills
  → reads context/product/product_glossary.md
  → Sonnet plans structure + tradeoffs
  → Haiku drafts final PRD
  → writes PRDs/<feature>/prd.md

User runs /wireframe <feature>
  → checks: PRDs/<feature>/prd.md exists
  → loads design-ux-researcher.md skill
  → reads ux_patterns.md, product_glossary.md
  → Sonnet generates HTML/CSS
  → writes index.html + notes.md (single-file, embedded CSS)

GitHub Actions morning-sync.yml (cron)
  → scripts/services/sync/morning-sync.service.ts
  → Todoist API → open + overdue tasks
  → Google Calendar API → today's events
  → writes daily/raw/YYYY-MM-DD-morning.json
  → updates state/current_day.json, state/last_sync.json

Claude cron task — /pulse (every Thursday)
  → reads pulse/normalized/ for Thu-Wed window from local repo
  → reads pulse/master/customer-pulse-master.md (prior history)
  → Sonnet: classify into feature requests / problems / loves, recurrence detection, value-effort scoring
  → Haiku: writes pulse/weekly/YYYY-WW-customer-pulse.md
  → Haiku: appends week entry to pulse/master/customer-pulse-master.md
  → updates state/last_sync.json pulse key
  (No GitHub Action, no API key in CI)
```

---

## Model Routing Summary

| Work type | Model | Who enforces |
|-----------|-------|-------------|
| Final digest text (`/morning`, `/eod`) | Haiku | Command instruction file |
| Final PRD drafting | Haiku | `/prd` command, phase 2 |
| Final pulse write-up | Haiku | `/pulse` command (Claude cron, no GH Action) |
| Reasoning, prioritization, `/now` | Sonnet | Command instruction file |
| Research synthesis, `/research`, `/jtbd` | Sonnet | Command instruction file |
| PRD structure planning | Sonnet | `/prd` command, phase 1 |
| Wireframe generation | Sonnet | `/wireframe` command |
| Pulse analysis + recurrence detection | Sonnet | Command + workflow |

---

## Build Phases

### Phase 1 — Foundation
- `package.json`, `tsconfig.json`, `.env.example`
- `scripts/config/`, `scripts/utils/`, `scripts/types/`
- JSON schemas in `schemas/`
- Skeleton state files with correct shape

### Phase 2 — Integration clients
- `scripts/integrations/todoist/`
- `scripts/integrations/gcal/`
- `scripts/integrations/fireflies/`
- Unit tests with mocked API responses

### Phase 3 — Sync services + GitHub Actions
- 3 non-AI sync services (morning, evening, fireflies)
- 3 `.github/workflows/` files — no Claude API key required in any
- Integration test: run sync locally, verify output files match schemas

### Phase 4 — Task manager CLI
- `task-manager.service.ts` + `task-routing.service.ts`
- CLI router + registry
- Test: create, update, complete round-trip

### Phase 5 — Claude commands
- All `.claude/commands/*.md` files
- Verify skill references are correct file paths
- Test each command end-to-end with sample repo state

### Phase 6 — Discovery + PRD workflow
- `/research`, `/jtbd`, `/prd` commands
- Approval state handling in `PRDs/<feature>/approvals/`
- Precondition checks (fail-closed behavior)

### Phase 7 — Wireframe workflow
- `/wireframe` command
- Output validation (index.html must be real HTML, not prose)

### Phase 8 — QA hardening
- Stale-state behavior tests (Scenario E)
- API error fallback (Scenario A, B, C)
- Ambiguous task disambiguation (Scenario G)
- Model routing audit (Scenario H)

---

## Key Guardrails to Enforce in Code

1. **No Claude calls in any GitHub Action** — all 3 workflows are pure fetch/normalize/write. No API key in CI.
2. **Thursday pulse is a Claude cron task** — `/pulse` runs on schedule inside Claude Code, reads from local repo files.
3. **Fail-closed preconditions** — `/wireframe` and `/prd` must check for required artifacts before running.
4. **Staleness banners** — commands must read `state/last_sync.json` and show freshness status.
5. **Todoist is truth** — local state never overwrites Todoist; only reflects it.
6. **Section routing reads team-list.md at runtime** — `task-routing.service.ts` must not hardcode team names or section IDs inline; read from `context/system/team-list.md` and `config/sections.ts`.
7. **Show routing decision for low-confidence tasks** — `inferred` and `defaulted` confidence must surface to user before task creation.
8. **Evidence attribution** — `research.md` must distinguish transcript-backed vs. web-sourced vs. inferred.
