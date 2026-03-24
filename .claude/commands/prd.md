# /prd — Generate Product Requirements Document

## Purpose
Generate a full-fidelity PRD as a markdown file after all discovery inputs exist and have been reviewed. Output must match the canonical CultureMonkey PRD template (based on Dynamic Survey PRD v2.2).

## Skills
Load and operate with:
- `.claude/Skills/product-manager.md` (Alex — PM voice)
- `.claude/Skills/engineering-software-architect.md` (tech constraints and tradeoffs)
- `.claude/Skills/jtbd.md` (JTBD alignment check)

## Context files to read
- `context/business/business_profile.md` — business context and strategic fit
- Product glossary and routing rules are in CLAUDE.md — no separate file load needed

## Preconditions (fail closed)
Check that all of these exist and are non-empty before proceeding:
- `PRDs/<feature-name>/jtbd.md`
- `PRDs/<feature-name>/research.md`

If any are missing, stop and state exactly which file is absent:
> "Cannot generate PRD: `PRDs/<feature-name>/research.md` not found. Run `/research <feature-name>` first."

A `discovery.md` or user-provided problem statement may substitute if jtbd/research are unavailable — accept and note the gap.

---

## Reasoning pass (internal — do not output)
Before writing, reason through:
- Core problem statement and customer evidence from research + jtbd inputs
- JTBD alignment — primary and secondary jobs
- Recommended solution direction and key alternatives considered
- MVP scope vs. explicit out-of-scope items
- Surface-by-surface UX flows (builder, reports, settings — as applicable)
- Functional requirements grouped by feature area
- Edge cases and error states
- Dependencies (Rails core, ClickHouse, report-service, feature flags)
- Phased rollout gates
- Success metrics and instrumentation events

---

## Output format
Write the final document as markdown to: `PRDs/<feature-name>/prd.md`

Use the canonical section structure below. Adapt section titles and sub-section groupings to the feature — do not add or remove top-level numbered sections. Every section must be present; mark `N/A — not applicable` only when genuinely irrelevant (e.g. no competitive analogs exist).

---

## Canonical PRD Template

```markdown
# PRD: [Feature Name]
[One-line subtitle describing the scope]

Version 1.0  |  CultureMonkey Product  |  Status: Draft  |  Date: YYYY-MM-DD

---

# 1. TL;DR

| Problem |
| :---- |
| [Concise problem statement — one row per distinct problem, max 4 rows] |

| Solution & Expected Impact |
| :---- |
| [What the solution does and measurable expected outcomes] |

---

# 2. Context & Problem Statement

## 2.1 Background
[3–5 bullets on current platform state and why this gap exists now]

## 2.2 Real-World Enterprise Use Cases
- **UC-1 [Name]:** [Specific scenario — who, what, why it matters]
- **UC-2 [Name]:** [Specific scenario]
- [Add UC-3 onwards as needed]

## 2.3 Customer Feedback & Concerns
- "[Direct quote or paraphrased pain]" — [Persona, org size/type if known]
- "[Quote]" — [Persona]
- [Mark inferred pain points clearly: *(Inference — needs validation)*]

---

# 3. User Stories & Scope

## 3.1 Target Audience
- **Primary:** [Role] — [what they do with this feature]
- **Secondary:** [Role] — [how they interact]
- **Tertiary:** [Role] — [peripheral interaction]
- **End consumer:** [Role] — [how the feature affects their experience]

## 3.2 User Stories — [Area 1, e.g. Survey Builder]

| US# | Title | Description | Priority |
| :---- | :---- | :---- | :---- |
| **US.1** | [Title] | As a [role], I want [action] so that [outcome]. | MVP — Must / Should / Could |

## 3.3 User Stories — [Area 2, e.g. Reports]

| US# | Title | Description | Priority |
| :---- | :---- | :---- | :---- |
| **US.N** | [Title] | As a [role], I want [action] so that [outcome]. | Priority |

## 3.4 Out of Scope (This Release)
- [Excluded item] — [reason for exclusion]
- [Excluded item] — [mark CLOSED DECISION if permanently excluded, not just deferred]

---

# 4. User Experience & Design

## 4.1 [Surface Name, e.g. Survey Builder — Section Rules]
[Entry point description]

- [Step-by-step UX flow as bullet list]

| State / Scenario | Behavior |
| :---- | :---- |
| **[State]** | [Expected behavior] |

## 4.2 [Next Surface]
[Repeat pattern for each distinct UX surface]

## 4.N Accessibility & Copy Guidelines
- [Keyboard navigation requirements]
- [ARIA label requirements for non-obvious UI elements]
- **Copy guideline:** [preferred terminology vs. what to avoid]

---

# 5. Detailed Functional Requirements

## 5.1 [Feature Area, e.g. Visibility Rules]

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR1** | [What the system must do] | Given [context], When [action], Then [result]. |

## 5.2 [Next Feature Area]
[Repeat for each grouping]

---

# 6. Edge Cases & Error Handling

| State / Scenario | Behavior |
| :---- | :---- |
| **[Edge case]** | [System response] |

---

# 7. Competitive & UX Notes

## Competitive Intelligence
- **[Competitor]:** [How they solve this problem — note scoring/architecture differences if relevant]

## Patterns to Adopt
- **[Product/competitor] — [pattern name]:** [Why and what to take from it]

## Patterns to Avoid
- [Anti-pattern]: [Why it creates problems]

## Differentiation Opportunity
- [Where CultureMonkey can lead vs. the market]

---

# 8. Analytics & Success Metrics

## 8.1 Success Metrics

| Metric | Baseline | Target (90 days post-launch) |
| :---- | :---- | :---- |
| [Metric name] | [Current value or N/A] | [Target] |

## 8.2 Instrumentation Events

| Event Name | Trigger | Properties |
| :---- | :---- | :---- |
| [event_name] | [When it fires] | [Key properties to capture] |

---

# 9. Dependencies

| Dependency | Notes |
| :---- | :---- |
| **[System/service]** | [What changes are needed and why] |
| **AccountSetting: ENABLE_[FLAG]** | New feature flag — off by default. Enabled per-tenant during phased rollout. |

---

# 10. Rollout Plan

## Phase 1 — MVP (~N weeks)
- [What ships in Phase 1]
- Rollout gate: `AccountSetting::[FLAG]` per tenant
- Pilot: [target customer types / internal]

## Phase 2 — Enhancements (~N weeks post Phase 1)
- [What ships in Phase 2]

## Phase 3 — Future (Post vX)
- [Items explicitly deferred to future releases]
```

---

## Writing rules
1. **Every functional requirement must have a Given/When/Then acceptance criterion.** No requirement is complete without one.
2. **UI state tables are required for every UX surface.** Cover: empty state, loaded state, error state, loading state.
3. **Out-of-scope items must state the reason** (complexity, separate initiative, closed decision, etc.).
4. **Feature flags must be named explicitly** in both the Dependencies table and Rollout Plan.
5. **Customer quotes in section 2.3** must be sourced from research.md or jtbd.md. If inferred, mark clearly.
6. **Do not use the PM skill's simplified PRD template.** The canonical template above is the only valid output format.
