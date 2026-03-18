# /prd — Generate Product Requirements Document

## Purpose
Generate a structured PRD after all required discovery inputs exist and have been reviewed.

## Model
- **Sonnet** for Phase 1: requirement reasoning, tradeoff analysis, structure planning.
- **Haiku** for Phase 2: drafting and formatting the final PRD artifact.

## Skills
Load and operate with:
- `.claude/Skills/product-manager.md` (Alex — PM voice and PRD template)
- `.claude/Skills/engineering-software-architect.md` (tech constraints and tradeoffs)
- `.claude/Skills/jtbd.md` (JTBD alignment check)

## Context files to read
- `context/product/product_glossary.md` — use canonical terminology throughout
- `context/business/business_profile.md` — business context and strategic fit

## Preconditions (fail closed)
Check that all of these exist and are non-empty:
- `PRDs/<feature-name>/discovery.md` OR user-provided problem statement
- `PRDs/<feature-name>/jtbd.md`
- `PRDs/<feature-name>/research.md`

If any are missing, stop and name the missing file:
> "Cannot generate PRD: PRDs/<feature-name>/jtbd.md not found. Run /jtbd <feature-name> first."

## Phase 1 — Sonnet reasoning
Analyze the inputs and produce structured notes covering:
- Core problem statement (evidence-backed)
- JTBD alignment
- Solution approach options and recommended direction
- Key tradeoffs and non-goals
- Dependencies and risks
- Analytics / success metrics

## Phase 2 — Haiku drafting
Use the PM skill's PRD template to write the final document with these minimum sections:
1. Problem Statement
2. Background / Context
3. Goals
4. Non-Goals
5. Target Users / Personas
6. JTBD Alignment
7. User Journeys
8. Functional Requirements
9. Non-Functional Requirements
10. Edge Cases
11. Dependencies
12. Analytics / Success Metrics
13. Rollout Notes
14. Open Questions

## Output
Write to: `PRDs/<feature-name>/prd.md`
