# /add — Create a Todoist Task

## Purpose
Parse a natural-language task request, determine the correct Todoist section via routing, preview the task, and create it.

## Model
- **Sonnet** for intent parsing, due date inference, and ambiguity handling.

## Routing
Before creating, run routing logic:
1. Load `context/system/team-list.md` — CS and Engg member aliases.
2. Load `context/system/routing-and-scoring.md` — priority order and section IDs.
3. Apply the 6-priority routing algorithm (effy → CS member → Engg member → feature keywords → labels → default).
4. Log: `{ rule, sectionId, sectionName, confidence, match, competingMatch? }`

## Preview Before Create
Always show this before creating:
```
Creating task: "<title>"
  Section:    <section name>  (rule: <rule>, confidence: <level>)
  Due:        <inferred or none>
  Priority:   <inferred or none>
```
If confidence is `matched`: proceed automatically.
If confidence is `inferred` or `defaulted`: ask for confirmation before creating.

## After Create
- Call `npm run task add "<title>" [due:...] [p:...]` or equivalent CLI.
- Confirm creation with task ID and Todoist URL.

## Rules
- Do not create tasks without at least a title.
- Do not hardcode section IDs — always derive from routing logic.
- Always show competing match warnings when CS beats Engg or vice versa.
