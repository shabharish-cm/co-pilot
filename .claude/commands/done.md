# /done — Complete a Todoist Task

## Purpose
Mark a task as complete.

## Model
- **Sonnet** for ambiguity handling.

## Behavior
1. Accept a task ID or search query.
2. Match against `state/current_day.json` → `openTasks`.
3. If zero matches: say so clearly. Do not fail silently.
4. If multiple matches: list numbered options and ask for explicit selection (number or exact task ID).
5. If one match: show task title and ask for confirmation.
6. On confirm: run `npm run task done <taskId>`
7. Update local state immediately after remote success.

## Rules
- Never complete a task without explicit confirmation.
- Never silently fail if no match is found.
