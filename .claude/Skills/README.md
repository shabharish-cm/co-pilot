# Claude Skills Index

This folder is the canonical source for reusable Claude role prompts in this repo.

## Skill Catalog

| Skill | Primary use | Where it fits in workflow |
|---|---|---|
| `product-manager.md` | PRD structure, prioritization, tradeoffs | `/prd` |
| `jtbd.md` | Jobs-to-be-done extraction from evidence | `/jtbd` |
| `design-ux-researcher.md` | UX framing and wireframe guidance | `/wireframe` |
| `engineering-software-architect.md` | System-level constraints and architecture tradeoffs | `/prd` technical checks |
| `engineering-backend-architect.md` | Backend/data architecture decisions | complex backend planning |
| `engineering-ai-engineer.md` | AI/ML system and model integration | AI feature design |
| `engineering-code-reviewer.md` | Code review rigor and risk checks | implementation reviews |
| `engineering-git-workflow-master.md` | Git process, branching, and release hygiene | delivery workflow |
| `product-trend-researcher.md` | Market/competitor trend intelligence | discovery/research |
| `fetch-todoist.md` | Fetch + normalize Todoist tasks via MCP → returns JSON | `/morning` subagent |
| `fetch-gcal.md` | Fetch today's GCal events via MCP → returns JSON | `/morning` subagent |
| `fetch-gmail.md` | Fetch + deduplicate Gmail signals via MCP → returns JSON | `/morning` subagent |

## Organization Rules

1. Keep all active skills in `.claude/Skills/`.
2. Use naming format: `<domain>-<role>.md`.
3. If a skill is referenced by a command, do not rename it without updating the command.
4. Keep one canonical copy per skill.

## Current Redundancy Note

- Duplicate copy found: `scripts/engineering-backend-architect.md`
- Canonical file is: `.claude/Skills/engineering-backend-architect.md`
- Recommendation: treat `scripts/engineering-backend-architect.md` as temporary drift and avoid editing it.
