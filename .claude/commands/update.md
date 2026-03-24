# /update — Update a Todoist Task

## Purpose
Update task metadata: content, due date, priority, or labels.

## Model
- **Sonnet** for ambiguity resolution and change reasoning.

## Behavior

### 1. Resolve task list
Check `lastMorningSyncAt` in `state/current_day.json`:
- If date is today: use `openTasks` from the state file for lookup.
- If date is prior to today (stale): fetch live from Todoist MCP (`get_tasks_list`, project `6g8q49QQxHrFxRFx`) and note `(live lookup — run /morning to persist state)`.

### 2. Match and confirm
- If query matches multiple tasks: present numbered options and require explicit selection (number or exact task ID).
- Show a before/after diff of the proposed change.
- Require confirmation before applying for any change to content, due, or priority.

### 3. Apply
Run: `npm run task update <taskId> [content:"<text>"] [due:"<date>"] [p:<1-4>]`

## Rules
- Never apply an update if the task cannot be unambiguously identified.
- Always show the before state and the proposed after state before confirming.
