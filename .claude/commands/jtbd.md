# /jtbd — Generate Jobs To Be Done

## Purpose
Convert approved research and problem inputs into structured JTBD statements.

## Model
- **Sonnet** (reasoning-heavy)

## Skill
Load `.claude/Skills/jtbd.md` and operate as that role.

## Inputs (required)
1. `PRDs/<feature-name>/research.md` — must exist and be non-empty
2. `PRDs/<feature-name>/discovery.md` — if present

## Precondition
If `PRDs/<feature-name>/research.md` does not exist:
- Stop. Say: "research.md not found for <feature-name>. Run /research <feature-name> first."

## Steps
Following the JTBD skill instructions:
1. Parse transcript and research evidence for user struggles.
2. Identify functional, emotional, and social jobs.
3. Extract current workarounds (the "push") and desired outcomes (the "pull").
4. Formulate JTBD statements: "When [context], I want to [motivation], so I can [outcome]."

## Output
Write to `PRDs/<feature-name>/jtbd.md` using the skill's output template:
- User Persona & Context
- Core Jobs To Be Done (2–4 primary jobs)
- Feature Opportunities & Implications
- Missing Context / Follow-up Questions
- Confidence level
- Unresolved assumptions

## Rules
- Do not invent data not present in research.md or transcripts.
- State "Not enough data" rather than guessing emotional/social jobs.
- Do not confuse feature requests with jobs.
