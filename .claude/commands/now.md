# /now — Focused Next Actions

## Purpose
Surface 5–7 high-signal tasks to focus on right now. Not a full task dump.

## Model
- **Sonnet**

## Inputs
1. Todoist MCP (always live)
2. `state/current_day.json` (for meetings context only)

## Behavior

### Fetch live tasks
Always fetch live from Todoist MCP — do not use cached state for tasks, as tasks are completed directly in Todoist throughout the day.
- Call `get_tasks_list` with `project_id: 6g8q49QQxHrFxRFx`
- Normalize results: mark `isOverdue` if due date is before today; map priority (4=urgent, 3=high, 2=medium, 1=normal)

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
