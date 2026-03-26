# /wireframe — Generate React JSX Prototype

## Purpose
Generate a functional React JSX prototype from an approved PRD as a real, runnable artifact.

## Model
- **Sonnet**

## Skills
Load `.claude/Skills/design-ux-researcher.md` — for UX decisions, flow coverage, and pattern adherence.
Load `.claude/Skills/engineering-software-architect.md` — for component structure, props, and state design.

## Context files to read
- `context/product/ux_patterns.md` — mandatory. Use the defined patterns (wizard, table, modal, etc.).
- Product glossary is in CLAUDE.md — no separate file load needed.

## Precondition (fail closed)
Check that `PRDs/<feature-name>/prd.md` exists and is non-empty.
If not: stop. Say exactly which file is missing and how to generate it.

## Behavior
1. Read the PRD fully. Identify key user flows and states.
2. Read `ux_patterns.md` — use existing patterns rather than inventing new UI conventions.
3. Use canonical product terms from CLAUDE.md glossary in all UI labels.
4. Decompose the UI into logical React components. Keep each component focused and self-contained.
5. Use `useState` / `useReducer` for local interaction state (tab selection, form steps, modal open/close, etc.).

## Output requirements
- React functional components using JSX.
- Delivered as a standalone `index.html` that loads React + ReactDOM + Babel from CDN — no build step required, openable directly in a browser.
- All components defined in `<script type="text/babel">` blocks within the single file.
- Use inline styles or a minimal CSS block in `<style>` — no external CSS frameworks.
- Must include these states where applicable: default, empty, loading, error, success.
- Use realistic placeholder content, not "Lorem ipsum".
- Prototype should be lo-fi (grey palette, simple borders) — not a polished design.

Write two files:
1. `PRDs/<feature-name>/wireframes/index.html` — the React JSX prototype (standalone, browser-runnable)
2. `PRDs/<feature-name>/wireframes/notes.md` — component breakdown, state decisions, open UX questions

## Rules
- Do not invent product logic not described in the PRD.
- Do not use UI patterns not defined in `ux_patterns.md` without flagging the deviation in `notes.md`.
- Prototypes are deliverables, not prose descriptions of prototypes.
- Keep components small — if a component exceeds ~80 lines, split it.
