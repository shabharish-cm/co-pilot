# Repo Audit — 2026-03-23

## Scope

- Claude skills organization
- Slash command efficiency and redundancy
- Folder structure hygiene

## Findings

### 1. Skills

- Canonical skill set is in `.claude/Skills/`.
- Duplicate detected: `scripts/engineering-backend-architect.md` is a byte-for-byte copy of `.claude/Skills/engineering-backend-architect.md`.
- Skill usage is strong for product flow (`/jtbd`, `/prd`, `/wireframe`) but lacked a central index.

### 2. Commands

- Specs and implementation drift existed in task disambiguation:
  - `/done` behavior text expected explicit disambiguation.
  - CLI previously defaulted to first match when multiple tasks matched.
- `/update` spec expected ID-or-query targeting, but CLI effectively worked best with explicit ID.
- Repeated `git pull` instructions in digest commands could cause redundant pulls when wrapper scripts already pulled.

### 3. Folder Structure

- Missing ignore rules for Finder artifacts and nested local build outputs caused avoidable repo noise.
- No single markdown reference for command catalog, skill catalog, or operating workflow.

## Changes Applied

### Skills

- Added `.claude/Skills/README.md` as a canonical catalog with organization rules.

### Commands and CLI

- Updated CLI task flows in `scripts/cli/index.ts`:
  - Explicit multi-match selection for `/done` (number or exact ID).
  - ID-or-query target resolution for `/update`.
  - Before/after preview retained before applying updates.
- Added `findTaskById` in `scripts/services/task-manager/task-manager.service.ts` for safer ID-based confirmations.
- Updated command specs:
  - `.claude/commands/add.md` (routing numbering fix + `label-inferred` handling)
  - `.claude/commands/done.md` (explicit disambiguation behavior)
  - `.claude/commands/update.md` (explicit disambiguation behavior)
  - `.claude/commands/morning.md`, `.claude/commands/eod.md`, `.claude/commands/pulse.md` (skip duplicate pull if wrapper already pulled)
- Added `.claude/commands/README.md` as command catalog + efficiency guidance.

### Structure and Hygiene

- Updated `.gitignore` to include:
  - `.DS_Store`, `**/.DS_Store`
  - `ui/.next/`, `ui/node_modules/`, `ui/playwright-report/`, `ui/test-results/`
  - `*.tsbuildinfo`

## Follow-up (Recommended)

1. Remove or archive `scripts/engineering-backend-architect.md` once no local draft dependency exists.
2. Add a pre-commit check to block `.DS_Store` and generated test artifacts.
3. Keep command specs and CLI behavior updated together in one change set.
