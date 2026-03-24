# PM Copilot — Unified PM Operating System

## Purpose

This repository is the single operating workspace for daily PM execution, customer signal synthesis, and product documentation.

Operating principle: use this repo as the unified place to run planning, synthesis, documentation, and execution loops.

---

## Workflow Backbone

### Daily Workflow

1. Start the day with `/morning`.
2. Assume GitHub Actions has already synced tasks and meetings into local state.
3. `/morning` generates digest output from cached repo data, not live API fetches.
4. Continue execution from Claude CLI inside this repo.

### PRD Workflow

When starting a PRD thread:
1. Paste raw customer/user notes.
2. Pull supporting request/complaint evidence from `pulse/`.
3. Run `/jtbd` to derive the true job to be done.
4. Continue through research -> PRD -> wireframes.

Recommended sequence:
- `/research <feature>`
- `/jtbd <feature>`
- `/prd <feature>`
- `/wireframe <feature>`

### Weekly Customer Pulse Workflow

1. Weekly task refreshes pulse digest and pulse master.
2. Outputs feed roadmap and prioritization.
3. Primary sources:
- `pulse/weekly/`
- `pulse/master/customer-pulse-master.md`

---

## Repository Map

Tracked footprint (2026-03-23): ~291 tracked files.

| Path | Purpose |
|------|---------|
| `.claude/commands/` | Slash command specs (`/morning`, `/eod`, `/pulse`, `/add`, `/update`, `/done`, `/research`, `/jtbd`, `/prd`, `/wireframe`, `/freq`, `/feedback`) |
| `.claude/Skills/` | Canonical role prompts used by command workflows |
| `.github/workflows/` | Scheduled sync automation (morning, evening, daily Fireflies) |
| `memory/` | Durable local memory: user profile, active initiatives, routing reminders, operating workflow |
| `context/system/` | Routing, team list, and system context |
| `context/business/` | CultureMonkey business and customer-voice context |
| `context/product/` | Product glossary and UX patterns |
| `context/customers/` | Per-account context and pulse signal histories |
| `PRDs/` | Feature artifacts (research, JTBD, PRDs, mockups, related docs) |
| `daily/raw/` | Daily sync snapshots (machine-generated) |
| `daily/digests/` | Human-readable morning/EOD digests |
| `pulse/raw/` | Raw Fireflies sync payloads |
| `pulse/normalized/` | Normalized transcript files |
| `pulse/weekly/` | Weekly pulse digest outputs |
| `pulse/master/` | Long-running pulse master history |
| `state/` | Canonical current operating state and sync metadata |
| `scripts/` | Sync services, CLI task operations, integrations, config, utilities, backfill tools |
| `schemas/` | JSON schemas for state/transcript/task validation |
| `tests/` | Unit tests for routing, services, utilities, and config |
| `ui/` | Next.js dashboard for board, digest, pulse, PRD browser, and Claude terminal sidebar |
| `docs/` | Repo structure/audit docs, integration setup docs |

Generated/runtime directories (not source of truth): `node_modules/`, `ui/node_modules/`, `ui/.next/`, `logs/`, `ui/test-results/`, `ui/playwright-report/`.

### Structure Detail

- `scripts/backfill/`: transcript backfills and probes.
- `scripts/cli/`: command registry/router and `/add` `/update` `/done` handlers.
- `scripts/config/`: env, paths, section IDs, staleness thresholds.
- `scripts/integrations/`: Todoist, Google Calendar, Fireflies, Slack clients/mappers/types.
- `scripts/services/sync/`: morning, evening, and daily Fireflies sync services.
- `scripts/services/task-manager/`: task mutation/state-refresh and routing re-export.
- `scripts/types/`: daily state, transcript, pulse, PRD status contracts.
- `scripts/utils/`: date, file IO, retry, logger, schema validation.
- `state/`: `current_day.json`, `last_sync.json`, `transcript_index.json`, `claude_completed_today.json`.
- `daily/raw/`: dated morning/evening snapshots.
- `daily/digests/`: dated digest markdown and supporting visual/html artifacts.
- `pulse/raw/` and `pulse/normalized/`: raw and normalized transcript layers.
- `pulse/weekly/` and `pulse/master/`: weekly outputs and cumulative pulse history.
- `context/customers/<Account>/`: account notes and appended pulse signals.
- `PRDs/`: initiative folders, including nested mockup assets.
- `ui/app/api/`: Todoist, digest, pulse, PRD, calendar, Claude, shell, and state-refresh endpoints.
- `ui/app/components/`: board, drawer, digest, pulse, PRD, and terminal/sidebar UI modules.
- `ui/tests/`: Playwright E2E coverage for board/calendar/home/tabs/task-drawer/terminal/API.

Repository note: both `PRDs/Post-Launch Survey Editing/` and `PRDs/post-launch-survey-editing/` currently exist; treat as legacy naming drift unless explicitly consolidated.

---

## Automation And Runtime

### GitHub Actions (scheduled sync)
- `morning-sync.yml` at 06:00 IST -> writes `state/current_day.json`, `state/last_sync.json`, `daily/raw/*-morning.json`
- `evening-sync.yml` at 19:00 IST -> writes `state/current_day.json`, `state/last_sync.json`, `daily/raw/*-evening.json`
- `daily-fireflies-sync.yml` at 01:00 IST -> writes `pulse/raw/`, `pulse/normalized/`, `state/transcript_index.json`, `state/last_sync.json`

### Local cron wrappers
- `scripts/cron/morning-digest.sh` -> `claude -p "/morning"`
- `scripts/cron/eod-digest.sh` -> `claude -p "/eod"`
- `scripts/cron/pulse-digest.sh` -> `claude -p "/pulse"`

### Core CLI mutation path
- `npm run task add|update|done`
- Implementation: `scripts/cli/index.ts` + `scripts/services/task-manager/`
- Routing engine: `scripts/integrations/todoist/routing.ts`

### UI runtime
- Next.js app in `ui/`
- Key APIs: `/api/todoist/*`, `/api/digest`, `/api/pulse`, `/api/prd/*`, `/api/calendar`, `/api/claude`, `/api/shell`, `/api/state/refresh`

---

## Team Membership

Canonical source: `context/system/team-list.md`

### Customer Success (CS)
Routing target: **CS Requests** (`section_id: 6g8x4HVHxpWVfVHQ`)

| Name | Aliases |
|------|---------|
| KN | KN |
| Karthik Rao | Karthik |
| Gowtham | Gowtham |
| Yugi | Yugi |

### Engineering (Engg)
Routing target: **Engg asks** (`section_id: 6g8x4MgXR2q68fgQ`)

| Name | Aliases |
|------|---------|
| Dhamo | Dhamo, Dhamodharan |
| Sam | Sam (Director of Engineering and AI) |
| Saran | Saran |
| Nandha | Nandha |
| Krishna | Krishna |

Matching is case-insensitive. Partial matches count. If both CS and Engg signals are present, CS wins.

---

## Todoist Section Routing

Todoist project ID: `6g8q49QQxHrFxRFx`
Timezone: `Asia/Kolkata` (IST, UTC+5:30)

Evaluate in strict priority order. Stop at first match.

| Priority | Signal | Section | Confidence |
|----------|--------|---------|------------|
| 1 | `effy` anywhere in title/notes | effy `6g9QcvpjJw2cFmCx` | matched |
| 2 | CS member name/alias in title/notes/requestor | CS Requests `6g8x4HVHxpWVfVHQ` | matched |
| 3 | Engg member name/alias in title/notes/requestor | Engg asks `6g8x4MgXR2q68fgQ` | matched |
| 4 | CM keywords: initiative, pulse initiative, quick wins, org, platform strategy, customer pulse, feedback analysis, product strategy, blog/blog post, landing page, content strategy, marketing content, AEO/GEO/SEO content, align or brief marketing, backfill/transcript/fireflies/copilot/sync/digest terms | CM `6g9wjjpVgppgxJwQ` | inferred |
| 5 | Feature keywords: build, design, feature, mockup, flow, PRD, spec, roadmap, wireframe, prototype, UX, UI (product build intent) | Features `6g8x4JxwH876pgGQ` | inferred |
| 6 | Label fallback: `follow-up` -> CS, `engineering` -> Engg, `cm` -> CM | varies | label-inferred |
| 7 | Default | Features `6g8x4JxwH876pgGQ` | defaulted |

If confidence is `inferred` or `defaulted`, show routing decision and allow explicit confirmation/override before creating.

---

## Value-Effort Scoring

Value dimensions:
- Revenue influence
- Account importance
- Frequency across calls
- Retention impact
- Strategic alignment

Effort dimensions:
- Implementation complexity
- Cross-team dependency
- Architecture impact
- Data/model dependency
- UI/UX complexity

Effort is always estimated until validated by engineering.

```
Value: [H/M/L]  Effort: [H/M/L]  Placement: [Quick Win | Strategic Bet | Reconsider | Avoid / Defer]
Evidence basis: [transcript-backed | inferred | labeled by requestor | email-backed]
```

Quadrant mapping:
- High Value + Low Effort -> Quick Win
- High Value + High Effort -> Strategic Bet
- Low Value + Low Effort -> Reconsider
- Low Value + High Effort -> Avoid / Defer

---

## Product Glossary

Use these canonical terms in PRDs, UX flows, digests, wireframes, and documentation.

| Term | Definition |
|------|-----------|
| Survey | Structured questionnaire for employee feedback. Types: Engagement, Pulse, Lifecycle, eNPS |
| Pulse Survey | Short recurring survey for continuous engagement tracking |
| Lifecycle Survey | Automated surveys triggered by employee lifecycle events (onboarding, 30/60/90-day, exit) |
| Driver | Engagement dimension categorizing survey questions (Wellbeing, Growth, Leadership, Recognition, Work Environment) |
| eNPS | Employee Net Promoter Score (0-10). Promoters 9-10, Passives 7-8, Detractors 0-6 |
| Heatmap | Visual grid of engagement scores across drivers and segments |
| Segment | Filtered employee group (Department, Location, Tenure, Manager, Gender) |
| Action | Corrective initiative from survey insights; assigned, tracked, completed |
| Survey Builder | Survey creation interface. Stages: Overview -> Questions -> Participants -> Schedule -> Review |
| Comment Analytics | Open-text analysis module: sentiment, topic clustering, word clouds |
| Topic Explorer | AI-based clustering of employee feedback themes |
| Report Builder | Tool for customized report dashboards |
| Manager Dashboard | Engagement analytics restricted to a manager's team |
| Admin Dashboard | Global analytics for administrators |
| Channels | Survey distribution channels: Email, Slack, Microsoft Teams, WhatsApp, SMS, QR, Kiosk |
| Snapshot | Point-in-time capture of engagement metrics |
| Org Hierarchy | Organizational reporting structure visualization |
| Employee Attributes | Metadata fields: Department, Location, Role, Tenure |
| Ask Cooper | AI chatbot inside the platform for on-demand engagement insights |
| Feedback Module | Section for reviewing open-text employee comments; sub-tabs: Summary, Open Comments, Question Comments, Word Cloud |
| Initiate Conversation | Feature in Feedback module; manager/admin opens anonymous chat with a feedback-giver; employee receives messages as platform emails; fully anonymous both ways; manager can Resolve |

---

## Canonical Files

| Resource | Path |
|----------|------|
| Workflow purpose (source of truth) | `memory/workflow_unified_pm_os.md` |
| Agent learnings log | `memory/claude_agent_notes.md` |
| User profile | `memory/user_profile.md` |
| Active initiatives | `memory/project_active_initiatives.md` |
| Routing and scoring detail | `context/system/routing-and-scoring.md` |
| Team list | `context/system/team-list.md` |
| Current day state | `state/current_day.json` |
| Sync metadata | `state/last_sync.json` |
| Claude-completed log | `state/claude_completed_today.json` |
| Transcript index | `state/transcript_index.json` |
| Pulse master | `pulse/master/customer-pulse-master.md` |
| Normalized transcripts | `pulse/normalized/YYYY-MM-DD-transcripts.json` |
| Daily digests | `daily/digests/YYYY-MM-DD-{morning,eod}.md` |
| Customer context | `context/customers/<Account>/` |
| Business profile | `context/business/business_profile.md` |
| UX patterns | `context/product/ux_patterns.md` |
| Product glossary (duplicate source) | `context/product/product_glossary.md` |
| Command catalog | `.claude/commands/README.md` |
| Skill catalog | `.claude/Skills/README.md` |

---

## Working Rules

1. Prefer local repo artifacts over live API calls for planning and synthesis commands.
2. Keep command specs and implementation aligned in the same change:
   - Specs: `.claude/commands/*`
   - Implementation: `scripts/cli/index.ts`, `scripts/services/task-manager/*`
3. Treat `state/`, `daily/raw/`, and `pulse/normalized/` as machine-generated sources of truth.
4. Treat `memory/` as durable human-curated context.
5. Append historical logs (pulse signals, weekly pulse, digests) rather than rewriting prior history unless explicitly fixing data errors.
6. Capture agent learnings whenever applicable: if a new preference, repeated mistake, correction pattern, or workflow lesson is discovered, append a short note to `memory/claude_agent_notes.md` with date, context, and action guidance.

## Naming And Hygiene Conventions

- PRD folders: prefer kebab-case names for new initiatives; do not rename existing legacy folders unless explicitly requested.
- Digest files: `YYYY-MM-DD-morning.md` and `YYYY-MM-DD-eod.md`.
- Weekly pulse files: `YYYY-WW-customer-pulse.md`.
- Keep generated local artifacts untracked (`.DS_Store`, `.next`, node modules, test reports/results).
- Keep skills canonical in `.claude/Skills/` and avoid duplicate copies in other paths.
