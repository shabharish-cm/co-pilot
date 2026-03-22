# PM Copilot — UI Plan
**Status: BUILT ✓ — running at localhost:3000**
**Date: 2026-03-22**

---

## Vision

A single-window PM workspace that replaces toggling between Todoist, transcripts, digests, and the terminal. Everything lives in one brutalist canvas: your day at a glance, tasks you can move, and Claude always one keystroke away.

---

## Design System — Light Neo Brutalism

Inspired by contemporary neo-brutalist SaaS dashboards (Dribbble, Bruddle, neobrutalism.dev). Light, warm base with 2–3 punchy accent colors, zero blur, maximum contrast.

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#FFFBF5` | App background (warm white) |
| `--surface` | `#FFFFFF` | Card / panel background |
| `--border` | `#000000` | All borders |
| `--shadow` | `4px 4px 0px #000000` | Hard offset, zero blur |
| `--yellow` | `#FFE500` | Primary accent — hover states, highlights, focus rings |
| `--pink` | `#FF90E8` | CS Requests column header |
| `--blue` | `#A8D8FF` | Engg Asks column header |
| `--green` | `#B9F0A0` | effy column header |
| `--orange` | `#FFB347` | CM column header |
| `--white-col` | `#FFFFFF` | Features column header |
| `--red` | `#FF3B00` | Overdue, destructive actions |
| `--text` | `#000000` | Primary text |
| `--muted` | `#666666` | Secondary text, timestamps |

### Typography

| Role | Font | Style |
|------|------|-------|
| App name / hero | `Space Grotesk` | 700, uppercase |
| Column headers | `Space Grotesk` | 700, uppercase, tracking-wide |
| Body / card title | `DM Sans` | 500 |
| Metadata / timestamps | `Space Mono` | 400, small |
| Claude sidebar output | `Space Mono` | 400 (terminal feel) |

### Component Rules

- **Border width:** `2.5px solid #000` on all cards/buttons/inputs
- **Shadow:** `4px 4px 0 #000` default; on hover → translate `(2px, 2px)`, shadow shrinks to `2px 2px 0 #000`
- **Radius:** `0px` everywhere — no exceptions
- **Buttons:** Uppercase, thick-bordered rectangles. Primary = `--yellow` fill + black border. Secondary = white fill + black border.
- **Column header bars:** Full-width, accent color fill, black bottom border, black uppercase text
- **Section badges on cards:** Accent-color fill, 2px black border, `Space Mono` 11px uppercase
- **Hover states:** Yellow `--yellow` background wash on interactive surfaces
- **Focus rings:** `3px solid #FFE500` offset by 2px — no default browser rings
- **Inputs:** White bg, 2.5px black border, no radius, `Space Mono` font. Focus = yellow border.

### Visual Personality

Think: a very organised, confident person's physical desk — cream paper, bold black ink, Post-it highlights in yellow and pink. Not a terminal. Not a dark hacker UI. Energetic but readable.

---

## Layout — Three-Panel Shell

```
┌──────────────────────────────────────────────────────────────────────┐
│  NAV BAR  [PM COPILOT]   [Digest] [Board] [Pulse] [Settings]    IST  │
├──────────────────┬───────────────────────────────┬───────────────────┤
│                  │                               │                   │
│  LEFT PANEL      │      MAIN CANVAS              │  CLAUDE SIDEBAR   │
│  Morning Digest  │      Task Board               │  CLI / Chat       │
│  ~280px fixed    │      flex-grow                │  ~320px, toggle   │
│                  │                               │                   │
└──────────────────┴───────────────────────────────┴───────────────────┘
```

The sidebar is togglable via `Cmd+K` or a fixed brutalist tab on the right edge.

---

## Panel 1 — Morning Digest (Left)

### Header
```
┌─────────────────────────┐
│  ▓▓ TODAY  MON 24 MAR   │
│  MORNING DIGEST         │
└─────────────────────────┘
```

### Sections (stacked, collapsible)

**1. Day Summary**
- 3–4 line prose summary from the morning digest file
- Auto-loaded from `daily/digests/YYYY-MM-DD-morning.md`
- "Regenerate" button triggers `/morning` command in Claude sidebar

**2. Focus Items** (top 3 tasks for the day)
- Each is a mini card with task title + section badge
- Click → jumps to that task on the board
- Badge colors: CS=blue, Engg=red, Features=yellow, CM=black, effy=green

**3. Customer Pulse Snapshot**
- Last 3 accounts with recent activity
- Each shows: Account name · Signal strength dot · Last touched date

**4. EOD Status**
- If after 5pm IST: shows `/eod` prompt button
- Else: shows hours remaining to EOD with a progress bar (brutalist striped)

---

## Panel 2 — Task Board (Main Canvas)

### Board Layout — 2D Matrix

The board is a **grid**: X-axis = task status (workflow stage), Y-axis = section (ownership/type).

```
                 BACKLOG    UP NEXT    IN PROGRESS    BLOCKED    DONE
               ┌──────────┬──────────┬──────────────┬──────────┬──────────┐
  CS REQUESTS  │  card    │  card    │   card        │          │  card    │
  [#FF90E8]    │          │          │   card        │          │          │
               ├──────────┼──────────┼──────────────┼──────────┼──────────┤
  ENGG ASKS    │  card    │          │   card        │  card    │          │
  [#A8D8FF]    │  card    │          │               │          │          │
               ├──────────┼──────────┼──────────────┼──────────┼──────────┤
  FEATURES     │  card    │  card    │               │          │  card    │
  [#FFFFFF]    │  card    │          │               │          │          │
               ├──────────┼──────────┼──────────────┼──────────┼──────────┤
  CM           │          │  card    │   card        │          │          │
  [#FFB347]    │          │          │               │          │          │
               ├──────────┼──────────┼──────────────┼──────────┼──────────┤
  EFFY         │  card    │          │   card        │          │          │
  [#B9F0A0]    │          │          │               │          │          │
               └──────────┴──────────┴──────────────┴──────────┴──────────┘
```

- **Column headers (X-axis):** Status stages — black bar, white text
- **Row headers (Y-axis):** Todoist sections — each row has its accent color as a left border stripe + small color swatch in the row label
- **Cells:** Scrollable vertically if a cell has many cards. Board itself scrolls horizontally if viewport is narrow.

### Status → Todoist Mapping

Status is stored as a **Todoist label** (`status:backlog`, `status:up-next`, `status:in-progress`, `status:blocked`). Completion = `DONE` column (marks task complete in Todoist).

| Column | Todoist label | Notes |
|--------|--------------|-------|
| BACKLOG | `status:backlog` | Default for new tasks |
| UP NEXT | `status:up-next` | Prioritised, not started |
| IN PROGRESS | `status:in-progress` | Actively being worked |
| BLOCKED | `status:blocked` | Waiting on someone/something |
| DONE | *(task completed)* | Marks complete in Todoist |

### Drag Behaviour

- **Drag left/right (status change):** Updates Todoist label instantly → real-time. No confirmation needed.
- **Drag up/down (section change):** Changes Todoist section. If the new section doesn't match the routing rules (inferred/defaulted confidence), shows a **confirmation modal** before committing.
- Moving to DONE column → confirmation modal: "Mark this task as complete in Todoist?"

### Routing Confirmation Modal

```
┌───────────────────────────────────────────────┐
│  ▓▓ CONFIRM SECTION CHANGE ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
├───────────────────────────────────────────────┤
│                                               │
│  Moving "Follow up with Karthik on heatmap"   │
│  → CS Requests                                │
│                                               │
│  ⚠  Routing confidence: INFERRED             │
│  No CS member name found in task title.       │
│  Matched on label: follow-up                  │
│                                               │
│  Suggested section: CS Requests               │
│  You dragged to:    Engg Asks                 │
│                                               │
│       [MOVE TO ENGG ASKS]   [KEEP IN CS]      │
│                                               │
└───────────────────────────────────────────────┘
```

### Task Cards

```
┌────────────────────────────┐
│ ▌  Follow up with Karthik  │  ← left border = P1 red stripe
│    on heatmap bug          │
│                            │
│  Value: H  Effort: M       │
│  ● QUICK WIN               │
│                            │
│  #follow-up  📅 Mar 24     │
│                            │
│  [OPEN]            [•••]   │
└────────────────────────────┘
```

- Left border stripe: P1=`--red`, P2=`--yellow`, P3=none
- Row tint: subtle 8% opacity of the section accent color as card background
- Overdue: rotated red `OVERDUE` stamp in top-right corner
- Hover: card lifts (translate -2px -2px, shadow grows)

### Card Expanded View (right drawer)

Click `[OPEN]` → full-height drawer slides in from right, pushing the Claude sidebar if open:

```
┌─────────────────────────────────────────┐
│  ← BACK                   [COMPLETE ✓] │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓      │
│  FOLLOW UP WITH KARTHIK                 │
│  ON HEATMAP BUG                         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓      │
│                                         │
│  Section  [CS REQUESTS ▾]               │
│  Status   [IN PROGRESS ▾]               │
│  Due      [Mar 24, 2026 ▾]              │
│  Labels   [#follow-up] [+ add]          │
│                                         │
│  Value: H  Effort: M  ● QUICK WIN       │
│                                         │
│  ── DESCRIPTION ──────────────────────  │
│  [editable textarea — autosaves]        │
│                                         │
│  ── COMMENTS (2) ─────────────────────  │
│  KN · 2h ago                            │
│  needs response by EOD                  │
│                                         │
│  You · 1h ago                           │
│  acknowledged, checking spec            │
│                                         │
│  [Add a comment...        ] [POST]      │
│                                         │
│  ── DANGER ────────────────────────── │
│  [DELETE TASK]                          │
└─────────────────────────────────────────┘
```

Section and Status dropdowns in the drawer also trigger the routing modal if applicable. All edits write to Todoist immediately on change (no explicit save button except for description textarea).

### Board Controls

```
[+ ADD TASK]  [FILTER ▾]  [GROUP ▾]  [↺ synced 3m ago]
```

- Filter by: section row, status, label, due date, value/effort
- Group: collapse/expand individual section rows
- `+ ADD TASK` → quick-add form appears at top of BACKLOG column in a chosen row, with routing preview

---

## Panel 3 — Claude Sidebar (Right, toggleable)

### Identity
This is not just a chatbox. It's a command terminal with Claude as the shell. Neo-brutalist aesthetic: black background, green monospace output (terminal mode), yellow prompts.

```
┌─────────────────────────────────┐
│  ▓▓ CLAUDE CLI ▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  Connected · claude-sonnet-4-6  │
├─────────────────────────────────┤
│                                 │
│  > /morning                     │
│  ┄ generating digest...         │
│  ✓ Digest ready. 4 focus        │
│    items, 2 CS pings.           │
│                                 │
│  > add task: follow up with     │
│    Karthik about heatmap bug    │
│  ✓ Created in CS Requests       │
│    [VIEW TASK →]                │
│                                 │
│  > /eod                         │
│  ┄ scanning today's activity... │
│                                 │
├─────────────────────────────────┤
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  [_________________________]   │
│                      [SEND ↵]  │
└─────────────────────────────────┘
```

### Capabilities via Natural Language

| Input | Action |
|-------|--------|
| `add task: <title>` | Smart-routes to Todoist with section preview |
| `move <task> to Engg asks` | Updates Todoist section |
| `complete <task>` | Marks done in Todoist |
| `summarize <account>` | Pulls customer context and pulse |
| `/morning` | Runs morning digest skill |
| `/eod` | Runs EOD digest skill |
| `/now` | Focused next actions |
| `/pulse` | Weekly customer pulse |
| `what's due today?` | Queries board state |
| `comment on <task>: <text>` | Adds Todoist comment |

### Context Awareness
The sidebar knows what card is currently open. If you're viewing a CS task, typing "add comment: will check with KN" knows which task to target without you specifying.

### Command History
- Up/down arrows cycle through previous commands (session-scoped)
- `Cmd+K` focuses the input from anywhere in the app

---

## Additional Views (Top Nav)

### Pulse View
- Table of customer accounts × driver scores
- Sourced from `pulse/master/customer-pulse-master.md`
- Filterable by account, segment, date range
- Inline "open transcript" link per row

### Settings View
- Todoist API token
- Claude API key
- Timezone confirmation (IST hardcoded, shown for info)
- Auto-refresh interval
- Theme toggle: Neo Brutalism (default) · High Contrast · Dark Brutalism (black bg, yellow text)

---

## Technical Architecture

### Stack
| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 15 (App Router) | File-based routing, RSC for digest loads |
| UI | Tailwind CSS + custom CSS vars | Token-based brutalist system |
| State | Zustand | Lightweight, no boilerplate |
| Sync | Local→Todoist real-time; Todoist→Local 15min pull + optimistic writes | Todoist has no push API |
| Claude | Anthropic SDK (streaming) | Stream output to sidebar in real-time |
| Storage | Local filesystem (existing repo structure) | Digests, pulse, context already on disk |
| Auth | `.env.local` for API keys | No auth needed, personal tool |

### Data Flows

```
Todoist API ←→ /api/todoist/[...] (Next.js route handlers)
                     ↕
               Zustand board store (optimistic)
                     ↕
              Task Board UI (drag/drop, card edits)

Filesystem (digests, pulse) → /api/digest/today
                                     ↕
                              Left Panel (Morning Digest)

Claude SDK (streaming) ← user input in sidebar
       ↓
  Skill execution (existing /morning, /eod, etc.)
       ↓
  Todoist writes + UI refresh
```

### File Structure (new)
```
/ui/
  app/
    layout.tsx          — shell, three-panel layout
    page.tsx            — board (default route)
    digest/page.tsx     — digest-only view
    pulse/page.tsx      — pulse table
    api/
      todoist/          — proxy + cache layer
      digest/           — reads daily/ files
      claude/           — streams Claude responses
  components/
    BoardMatrix.tsx       — 2D grid, section rows × status columns
    TaskCard.tsx          — card in a cell
    TaskDrawer.tsx        — full expanded card
    RoutingModal.tsx      — section-change confirmation
    DigestPanel.tsx
    ClaudeSidebar.tsx
  lib/
    todoist.ts          — typed Todoist client
    claude.ts           — streaming chat client
    routing.ts          — section routing logic (mirrors CLAUDE.md rules)
  styles/
    brutalism.css       — design tokens, shadows, borders
```

---

## Implementation Phases

### Phase 1 — Shell + Board (core value)
- Three-panel layout with brutalist design system
- 2D board matrix: status columns × section rows
- Status labels provisioned in Todoist (`status:backlog` etc.)
- Task cards with drag-to-move (X = status change, Y = section change)
- Routing modal on section drag
- Card expanded drawer with comments + edit
- Real-time local→Todoist writes + 15min pull

### Phase 2 — Digest Panel
- Morning digest auto-load from filesystem
- Focus items linked to board
- EOD prompt surfacing

### Phase 3 — Claude Sidebar
- Streaming CLI sidebar
- Natural language task actions
- Skill invocation (/morning, /eod, /now)
- Board context awareness

### Phase 4 — Pulse View + Polish
- Customer pulse table
- Dark Brutalism theme
- Keyboard shortcuts
- Offline-tolerant (stale-while-revalidate)

---

## Decisions Locked

| # | Question | Decision |
|---|----------|----------|
| 1 | Hosting | Local only — `localhost:3000` via `npm run dev` |
| 2 | Auth / team access | None — API keys in `.env.local`, personal use only |
| 3 | Todoist comments in digest | Yes — surface task comments in `/morning` output |
| 4 | Routing warning on drag | Modal confirmation (blocking) |
| 5 | Theme | Light Neo Brutalism — warm white, yellow/pink/blue/green accents |
| 6 | Board axis | X = Status (workflow), Y = Section (ownership) |
| 7 | Sync direction | Local → Todoist: real-time on every action; Todoist → Local: pull every 15 min |

## Sync Architecture

```
USER ACTION (drag, edit, comment, complete)
      │
      ▼
Optimistic update in Zustand store (instant UI)
      │
      ▼
POST /api/todoist/[action]  ──→  Todoist API  (real-time, <500ms)
      │
      ▼
On success: confirm store   On fail: revert + show error banner


BACKGROUND PULL (every 15 min)
      │
Todoist API → /api/todoist/tasks → merge into Zustand store
      │
Conflict rule: if a task was mutated locally in the last 15 min,
local version wins. Else, Todoist version wins.
```

Board top bar shows: `↺ synced 3m ago · next pull in 12m`

---

## Calendar Widget (Left Panel — Section 5)

### Data Source
Uses the existing `GCalClient` (service account + domain-wide delegation, already wired in `scripts/integrations/gcal/client.ts`). Reads from `GCAL_SERVICE_ACCOUNT_JSON`, `GCAL_CALENDAR_ID`, `GCAL_USER_EMAIL` env vars — same as existing scripts.

### Layout — 5-Day Strip

```
┌─────────────────────────────┐
│  ▓▓ NEXT 5 DAYS ▓▓▓▓▓▓▓▓  │
├─────────────────────────────┤
│  TODAY · SUN 22 MAR         │
│  ┄ 10:00  Sync with Sam     │
│  ┄ 14:00  Design Review     │
├─────────────────────────────┤
│  MON 23 MAR                 │
│  ┄ 09:30  Standup           │
│  ┄ 11:00  HM Survey Review  │
├─────────────────────────────┤
│  TUE 24 MAR                 │
│  (no events)                │
├─────────────────────────────┤
│  WED 25 MAR                 │
│  ┄ 15:00  CS Catchup — KN  │
├─────────────────────────────┤
│  THU 26 MAR                 │
│  ┄ 10:00  1:1 with Dhamo   │
└─────────────────────────────┘
```

- Shows event title + start time (IST)
- All-day events shown without time, in italic
- Events with Google Meet link get a `▶ JOIN` button
- Clicking an event expands to show attendees + description inline
- Max 4 events per day shown; `+N more` collapses the rest
- Stale-while-revalidate (refreshes on page load, not polling)
- If GCal creds not configured → shows placeholder "Connect Google Calendar"

## Open Questions

None — all decisions locked.

---

*Approve this plan to begin Phase 1 implementation.*
