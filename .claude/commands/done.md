# /done — Complete a Todoist Task

## Purpose
Mark a task as complete.

## Model
- **Sonnet** for ambiguity handling.

## Behavior

### 1. Resolve task list
Check `lastMorningSyncAt` in `state/current_day.json`:
- If date is today: use `openTasks` from the state file for lookup.
- If date is prior to today (stale): fetch live from Todoist MCP (`get_tasks_list`, project `6g8q49QQxHrFxRFx`) and note `(live lookup — run /morning to persist state)`.

### 2. Match
Accept a task ID or search query.
- If zero matches: say so clearly. Do not fail silently.
- If multiple matches: list numbered options and ask for explicit selection (number or exact task ID).
- If one match: show task title and ask for confirmation.

### 3. Complete
On confirm: run `npm run task done <taskId>`

### 4. Update local state
After remote success, remove the task from `openTasks` in `state/current_day.json` and add it to `completedToday`.

## Rules
- Never complete a task without explicit confirmation.
- Never silently fail if no match is found.
