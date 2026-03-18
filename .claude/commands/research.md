# /research — Product Research

## Purpose
Produce evidence-backed research for a feature. Complete without interruption — do not pause for confirmation at any point.

## Model
- **Sonnet** throughout. All steps sequential. No background agents.

## Inputs
1. `pulse/normalized/` — transcript files (most recent 4–8 weeks)
2. `context/business/business_profile.md` — product context
3. `PRDs/<feature-name>/discovery.md` — if it exists, read it first
4. Any user-provided notes or constraints passed inline

## Precondition
Feature name must be provided. If missing, ask once then stop.

## Steps — run fully in sequence

### 1. Read context (no web calls)
- Read `context/business/business_profile.md`
- Read `PRDs/<feature-name>/discovery.md` if it exists
- Note any user-provided inline constraints

### 2. Transcript scan (no web calls)
- Glob `pulse/normalized/*.json` and `pulse/normalized/*.md`
- If empty: note "No transcripts available" and continue — do not stop
- If present: extract pain points, workarounds, and customer quotes relevant to the feature

### 3. Web research — maximum 3 searches total
Do exactly 3 searches, each broad enough to cover multiple angles in one query. Do not loop or retry:

**Search 1:** Competitor help centers + how they handle this feature area
**Search 2:** User frustrations on Reddit/G2/Capterra about this problem space
**Search 3:** Industry solutions or workarounds for the core technical/UX constraint

Collect findings. Do not search more than 3 times.

### 4. Write output immediately
Do not run any Bash commands. Write directly to `PRDs/<feature-name>/research.md`.

## Output structure
```
# Research: <Feature Name>

## Problem Framing
## Evidence from Transcripts
(cite transcript IDs, or "No transcripts available")
## Evidence from Public Discussions
(source URLs for every finding)
## Competitor Patterns
## Recurring Complaints or Workarounds
## Confidence Rating
(High / Medium / Low — with reasoning)
## Open Questions
```

## Rules
- Max 3 web searches — no exceptions
- No Bash commands at any point
- No background agents
- No mid-run confirmations — complete and write the file
- Distinguish: transcript-backed / public-discussion / inferred
- No fabricated quotes
