# /wireframe — Generate HTML/CSS Wireframes

## Purpose
Generate practical UI wireframes from an approved PRD as real HTML/CSS artifacts.

## Model
- **Sonnet**

## Skill
Load `.claude/Skills/design-ux-researcher.md`

## Context files to read
- `context/product/ux_patterns.md` — mandatory. Use the defined patterns (wizard, table, modal, etc.).
- `context/product/product_glossary.md` — mandatory. Use canonical product terminology.

## Precondition (fail closed)
Check that `PRDs/<feature-name>/prd.md` exists and is non-empty.
If not: stop. Say exactly which file is missing and how to generate it.

## Behavior
1. Read the PRD fully. Identify key user flows and states.
2. Read `ux_patterns.md` — use existing patterns rather than inventing new UI conventions.
3. Read `product_glossary.md` — use canonical terms in all UI labels.

## Output requirements
- Single-file HTML with embedded CSS (no external dependencies).
- Must include these states where applicable: default, empty, loading, error, success.
- Use realistic placeholder content, not "Lorem ipsum".
- Wireframe should be a realistic lo-fi mockup, not a polished design.
- Must be openable directly in a browser with no build step.

Write two files:
1. `PRDs/<feature-name>/wireframes/index.html` — the actual wireframe
2. `PRDs/<feature-name>/wireframes/notes.md` — design decisions, state descriptions, open UX questions

## Rules
- Do not invent product logic not described in the PRD.
- Do not use UI patterns not defined in `ux_patterns.md` without flagging the deviation in `notes.md`.
- Wireframes are deliverables, not prose descriptions of wireframes.
