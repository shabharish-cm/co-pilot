# /morning — Daily Morning Digest

## Purpose
Generate a human-readable morning digest from cached repository state. Do not fetch live data.

## Model
- **Haiku** for final digest drafting.
- **Sonnet** only if intermediate reasoning is needed (e.g. conflict detection across tasks and meetings).

## Inputs (read from repo — do not fetch live)
1. `state/current_day.json` — tasks, meetings, sync timestamps
2. `state/last_sync.json` — freshness metadata

## Freshness Check (mandatory first step)
Read `state/last_sync.json`. Check `morningSync.ranAt`.
- If `ranAt` is null or older than 12 hours: show a staleness banner:
  > ⚠ Data last synced: [X hours ago / never] — this digest may not reflect today.
- If `sourceStatus.todoist` or `sourceStatus.googleCalendar` is `failed` or `missing`: call it out explicitly.
- Do NOT present stale data as current without the banner.

## Output Structure
Produce the digest in this order:

### 1. Sync Status
One line showing when data was last synced and whether sources are fresh or stale.

### 2. Overdue Tasks
List all tasks where `isOverdue: true`. If none, say so.

### 3. Tasks Due Today
List tasks where `due === today's date`. If none, say so.

### 4. Meetings Today
List all entries in `todayMeetings`. Show time, title, and attendees. If none, say so.

### 5. Suggested Task Order
Based on priority (4=urgent first), due date, and meeting schedule, suggest the top 5–7 tasks to focus on. Avoid scheduling focus tasks immediately before or during a meeting window.

### 6. Possible Conflicts
Flag any scheduling pressure: e.g. back-to-back meetings that compress task time, or overdue items competing with high-priority tasks.

## Output File
Write the digest to: `daily/digests/YYYY-MM-DD-morning.md`
Update `state/current_day.json` → `digestPaths.morning` with the written path.

## Rules
- Do not invent task data not present in the state file.
- Do not call Todoist or Google Calendar APIs.
- The staleness check is non-optional.
