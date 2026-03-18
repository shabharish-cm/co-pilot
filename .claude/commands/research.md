# /research — Product Research

## Purpose
Produce evidence-backed research for a feature by combining transcript evidence, prior product context, competitor patterns, and public discussion.

## Model
- **Sonnet** + WebSearch + WebFetch (via `product-trend-researcher.md` skill)

## Inputs
1. `pulse/normalized/` — transcript files (read the most recent 4–8 weeks)
2. `context/business/business_profile.md` — product and company context
3. `PRDs/<feature-name>/discovery.md` — if it exists, read it first
4. Any user-provided notes or scribbles passed inline

## Precondition
Feature name must be provided: `/research <feature-name>`
If not provided, ask for it before proceeding.

## Steps

### 1. Transcript scan (Sonnet)
Search all available normalized transcripts for:
- Direct mentions of the feature area
- Related pain points or workarounds
- Customer quotes about the problem

### 2. Public discussion research (Sonnet + WebSearch/WebFetch)
Search public sources for signals about this problem space:
- Reddit communities relevant to the product category
- G2, Capterra, Trustpilot reviews mentioning similar pain points
- Competitor release notes, help centers, changelog entries
- Product forums and community threads
Cite sources with URL where available.

### 3. Competitor analysis (Sonnet + WebSearch)
Identify how 2–3 competitors address (or fail to address) this problem space.

### 4. Synthesis (Sonnet)
Combine all signals into a structured research document.

## Output
Write to `PRDs/<feature-name>/research.md` with these sections:
1. Problem Framing
2. Evidence from Transcripts (transcript-backed — cite transcript IDs)
3. Evidence from Public Discussions (source URLs)
4. Competitor Patterns
5. Recurring Complaints or Workarounds
6. Confidence Rating (High/Medium/Low) with reasoning
7. Open Questions

## Rules
- Always distinguish: **transcript-backed** vs **public-discussion evidence** vs **inferred**.
- Do not fabricate quotes. Cite real transcript IDs or URLs.
- If transcript coverage is thin, say so explicitly in the confidence section.
