# /now — Focused Next Actions

## Purpose
Surface 5–7 high-signal tasks to focus on right now. Not a full task dump.

## Model
- **Sonnet**

## Inputs
1. `state/current_day.json`

## Behavior

### Check state freshness
Read `lastMorningSyncAt` from `state/current_day.json`.
- If the date of `lastMorningSyncAt` is today: use `openTasks` from the state file.
- If the date is prior to today (stale): fetch live from Todoist MCP instead:
  - Call `get_tasks_list` with `project_id: 6g8q49QQxHrFxRFx`
  - Normalize results (isOverdue, priority mapping) as defined in `/morning`
  - Show a note: `(live data — run /morning to persist)`

### Rank and filter
1. Sort by: overdue first → priority (4 highest) → due date ascending.
2. Suppress undated tasks with priority 1 (normal) if there are 5+ higher-signal items.
3. Show maximum 7 tasks.

## Output (inline only — do not write a file)
Numbered list. Each entry shows:
- Task title
- Due date (or "no due date")
- Priority level
- Section/area
