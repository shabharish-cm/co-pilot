# Unified Repo Workflow (Shabharish)

This repo is the single operating workspace for daily PM execution, customer signal synthesis, and product documentation.

## Daily Workflow

1. Start day with `/morning`.
2. Assume GitHub Actions has already synced tasks + meetings into local state.
3. `/morning` prepares the digest from cached repo data (not live API fetches).
4. Continue task execution from Claude CLI inside the IDE and this repo.

## PRD Workflow

When starting a new PRD thread:

1. Paste raw user feedback notes into Claude CLI.
2. Pull supporting customer requests/complaints from `pulse/` artifacts.
3. Run `/jtbd` to derive the true job-to-be-done.
4. Continue through: research -> PRD -> mockups.

Recommended sequence:

- `/research <feature>`
- `/jtbd <feature>`
- `/prd <feature>`
- `/wireframe <feature>`

## Customer Pulse Workflow (Weekly)

1. Weekly scheduled task generates/refreshes pulse digest and master pulse.
2. Outputs feed roadmap decisions and prioritization for upcoming work.
3. Source documents:
- `pulse/weekly/`
- `pulse/master/customer-pulse-master.md`

## Operating Principle

Use this repo as the unified place to run planning, synthesis, documentation, and execution loops.
