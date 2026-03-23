# /add — Create a Todoist Task

## Purpose
Parse a natural-language task request, determine the correct Todoist section via routing, preview the task, and create it.

## Model
- **Sonnet** for intent parsing, due date inference, and ambiguity handling.

## Routing
Before creating, run routing logic (team membership and section IDs are in CLAUDE.md):
1. Apply the routing algorithm (effy → CS member → Engg member → CM keywords → feature keywords → labels → default).
2. Log: `{ rule, sectionId, sectionName, confidence, match, competingMatch? }`

## Preview Before Create
Always show this before creating:
```
Creating task: "<title>"
  Section:    <section name>  (rule: <rule>, confidence: <level>)
  Due:        <inferred or none>
  Priority:   <inferred or none>
```
If confidence is `matched` or `label-inferred`: proceed automatically.
If confidence is `inferred` or `defaulted`: ask for confirmation before creating.

## After Create
Run exactly:
```
npm run task add "<title>" [due:"<date>"] [p:<1-4>]
```
Example: `npm run task add "Review KN mockup" due:"tomorrow" p:3`
- Confirm creation with task ID and section name.

## Rules
- Do not create tasks without at least a title.
- Do not hardcode section IDs — always derive from routing logic.
- Always show competing match warnings when CS beats Engg or vice versa.
