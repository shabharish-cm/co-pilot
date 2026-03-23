# /update — Update a Todoist Task

## Purpose
Update task metadata: content, due date, priority, or labels.

## Model
- **Sonnet** for ambiguity resolution and change reasoning.

## Behavior
1. Identify the target task by ID or search query against `state/current_day.json`.
2. If query matches multiple tasks, present numbered options and require explicit selection (number or exact task ID).
3. Show a before/after diff of the proposed change.
4. Require confirmation before applying for any change to content, due, or priority.
5. Run: `npm run task update <taskId> [content:"<text>"] [due:"<date>"] [p:<1-4>]`

## Rules
- Never apply an update if the task cannot be unambiguously identified.
- Always show the before state and the proposed after state before confirming.
