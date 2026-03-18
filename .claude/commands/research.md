# /research — Product Research

## Purpose
Produce evidence-backed research for a feature by combining transcript evidence, prior product context, competitor patterns, and public discussion.

## Model
- **Sonnet** throughout. No background agents — all steps run sequentially.

## Inputs
1. `pulse/normalized/` — transcript files (read the most recent 4–8 weeks)
2. `context/business/business_profile.md` — product and company context
3. `PRDs/<feature-name>/discovery.md` — if it exists, read it first
4. Any user-provided notes or constraints passed inline

## Precondition
Feature name must be provided: `/research <feature-name>`
If not provided, ask for it before proceeding.

Create `PRDs/<feature-name>/` directory if it does not exist. Do not run Bash to check — just write the output file and the directory will be created.

## Steps — run fully in sequence, do not parallelize

### 1. Read context
- Read `context/business/business_profile.md`
- Read `PRDs/<feature-name>/discovery.md` if it exists
- Incorporate any inline user-provided constraints or notes

### 2. Transcript scan
- Glob `pulse/normalized/*.json` or `pulse/normalized/*.md`
- If empty or missing: note "No transcripts available" in the output and continue — do not stop
- If present: scan for mentions of the feature area, pain points, workarounds, and customer quotes

### 3. Web research (WebSearch + WebFetch)
Search sequentially — do not use background agents:
- Reddit (r/humanresources, r/ProductManagement, r/sysadmin) for user frustrations
- G2, Capterra, Trustpilot reviews of competitors in this space
- Competitor help centers, changelogs, or release notes
Cite source URLs for every finding.

### 4. Competitor analysis (WebSearch)
Pick 2–3 direct competitors. Find how they handle (or fail to handle) the problem space.

### 5. Write output
Write to `PRDs/<feature-name>/research.md` — do not run any Bash commands before or after writing.

## Output structure
```
# Research: <Feature Name>

## Problem Framing
## Evidence from Transcripts
(transcript-backed | cite IDs, or "No transcripts available")
## Evidence from Public Discussions
(source URLs required)
## Competitor Patterns
## Recurring Complaints or Workarounds
## Confidence Rating
(High / Medium / Low — with reasoning)
## Open Questions
```

## Rules
- All steps sequential — no background agents, no parallel tool calls
- Do not run Bash at any point
- Distinguish: transcript-backed / public-discussion / inferred
- Do not fabricate quotes — cite real IDs or URLs
- Do not ask for confirmation mid-run — complete all steps and write the file
