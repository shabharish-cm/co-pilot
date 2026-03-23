# Claude Commands Index

This folder contains slash-command operating instructions for the PM copilot workflow.

## Command Groups

| Group | Commands | Purpose |
|---|---|---|
| Daily execution | `/morning`, `/now`, `/eod`, `/diagnostics` | Run day planning, focus, and end-of-day review from cached state |
| Task operations | `/add`, `/update`, `/done` | Create, modify, and complete Todoist tasks with routing + confirmation |
| Discovery and strategy | `/research`, `/jtbd`, `/prd`, `/wireframe`, `/freq`, `/pulse` | Turn customer signal into product artifacts |
| Customer feedback | `/feedback` | Extract structured feedback from customer emails into account context files |

## Data Source Policy

1. Prefer local repo state (`state/`, `daily/`, `pulse/`, `context/`).
2. Use live web research only where explicitly allowed (`/research`).
3. Pull repo updates once per session; skip duplicate pulls when automation already pulled.

## Efficiency/Redundancy Notes (2026-03-23)

- Updated: `/add` confidence handling docs now include `label-inferred`.
- Updated: `/done` and `/update` docs now require explicit disambiguation for multiple matches.
- Updated: `/morning`, `/eod`, `/pulse` docs now avoid duplicate `git pull` when already done by wrapper automation.

## Implementation Alignment

- These specs are consumed by Claude slash commands.
- CLI task mutations are implemented in `scripts/cli/index.ts` and `scripts/services/task-manager/`.
- If you change task behavior in one place, update the other in the same commit.
