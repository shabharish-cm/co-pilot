# Repo Structure Guide

## Top-Level Layout

- `state/`: canonical synced state (`current_day.json`, `last_sync.json`, transcript index)
- `daily/`: raw daily snapshots and generated morning/EOD digests
- `pulse/`: raw/normalized transcripts + weekly digest + master pulse
- `context/`: business, customer, system, and UX context artifacts
- `PRDs/`: feature-by-feature product docs (`discovery`, `research`, `jtbd`, `prd`, `wireframes`)
- `.claude/Skills/`: role prompts for Claude workflow stages
- `.claude/commands/`: slash command operating specs
- `scripts/`: sync integrations, CLI task tools, cron wrappers, utilities
- `memory/`: durable local workflow memory and decisions
- `docs/`: setup guides and audits

## Structure Conventions

1. Treat `state/`, `daily/raw/`, and `pulse/normalized/` as machine-generated and source-of-truth snapshots.
2. Treat `memory/` as human-readable durable context.
3. Keep slash command specs in `.claude/commands/`; implementation logic belongs in `scripts/`.
4. Keep active skills only in `.claude/Skills/`; avoid duplicate copies elsewhere.

## Naming Rules

- PRD folders: prefer kebab-case names for new initiatives (existing folders remain untouched).
- Digest files: `YYYY-MM-DD-morning.md`, `YYYY-MM-DD-eod.md`.
- Pulse weekly files: `YYYY-WW-customer-pulse.md`.

## Hygiene Rules

- Generated local artifacts should stay untracked (`.DS_Store`, `.next`, node modules, test outputs).
- Update command docs and implementation together when behavior changes.
