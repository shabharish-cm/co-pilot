# /freq — Feature Frequency Check

## Purpose
Check how frequently a feature or problem has been raised across customer calls. Returns signal strength, customer list, representative quotes, and recurrence across weeks. Complete without interruption.

## Model
- **Sonnet** throughout.

## Inputs
1. Feature name or description — passed as argument (required)
2. `pulse/normalized/*.json` — all available transcripts
3. `pulse/master/customer-pulse-master.md` — prior weekly pulse history
4. `state/transcript_index.json` — to enumerate available files

## Precondition
Feature name must be provided. If missing, ask once then stop.

## Steps

### 1. Read pulse master
- Read `pulse/master/customer-pulse-master.md`
- Scan all week entries for any mention of the feature (exact match + synonyms + related terms)
- Note which weeks it appeared in, and the signal/placement at the time

### 2. Scan transcripts
- Read `state/transcript_index.json` to get all available normalized transcript files
- Read each `pulse/normalized/*.json`
- For each transcript, check if the feature, its synonyms, or the underlying problem is mentioned
- Extract: customer/account name, date, speaker, quote (verbatim if available), context

### 3. Compute signal
Count unique calls and unique accounts that mentioned it. Assign signal strength:
- **Strong** — 3+ accounts or 5+ calls
- **Moderate** — 2 accounts or 3–4 calls
- **Weak** — 1 account, 1–2 calls
- **Not found** — no mentions

### 4. Output

```
## Feature Frequency: <Feature Name>

**Signal:** [Strong | Moderate | Weak | Not found]
**Mentions:** X calls across Y accounts

### Accounts
- <Account> — <date> — "<verbatim quote or paraphrase>"
- ...

### Recurrence in Weekly Pulse
- 2026-W11: [how it was described / scored]
- ...
(or "Not previously surfaced in weekly pulse")

### Related signals
(Any adjacent asks or problems that appeared alongside this feature)
```

## Rules
- No web searches
- No fabricated quotes — use verbatim from transcripts or clearly mark as paraphrase
- If not found, say so explicitly — do not infer or guess
- Synonyms and related terms count — use judgement (e.g. "branching" = "conditional questions" = "skip logic")
- Do not write any files — output inline only
