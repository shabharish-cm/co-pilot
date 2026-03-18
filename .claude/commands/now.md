# /now — Focused Next Actions

## Purpose
Surface 5–7 high-signal tasks to focus on right now. Not a full task dump.

## Model
- **Sonnet**

## Inputs
1. `state/current_day.json`

## Behavior
1. Read `openTasks`.
2. Sort by: overdue first → priority (4 highest) → due date ascending.
3. Suppress undated tasks with priority 1 (normal) if there are 5+ higher-signal items.
4. Show maximum 7 tasks.

## Output (inline only — do not write a file)
Numbered list. Each entry shows:
- Task title
- Due date (or "no due date")
- Priority level
- Section/area
