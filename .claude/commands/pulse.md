# /pulse — Weekly Customer Pulse Digest

## Purpose
Generate the weekly customer pulse from cached normalized transcripts. Read from local repo files only — do not fetch from Fireflies.

## Schedule
Run every Thursday (Claude cron task). Can also be run manually.

## Model
- **Sonnet** for analysis: transcript reading, classification, recurrence detection, value-effort scoring.
- **Haiku** for writing: final digest and pulse master narrative text.

## Inputs (all from repo)
1. `pulse/normalized/YYYY-MM-DD-transcripts.json` files covering the Thu–Wed window
2. `pulse/master/customer-pulse-master.md` — prior history for recurrence detection
3. `state/transcript_index.json` — to identify available files
4. `context/system/routing-and-scoring.md` — value-effort scoring dimensions

## Step 0 — Sync repo
Run `git pull` to ensure local transcript and pulse files are up to date before reading.

## Step 1 — Determine window
Compute the previous Thursday through Wednesday window (7 days ending last Wednesday).
Identify all normalized transcript files within that window from `state/transcript_index.json`.

## Step 2 — Check for transcripts
If no transcript files exist for the window:
- State clearly: "No transcript files found for [start] to [end]. Run the Fireflies sync first."
- Stop. Do not generate empty or fabricated content.

## Step 3 — Sonnet analysis phase
Read all transcripts in the window. Classify every customer signal into exactly one of:
- **New feature requests** — things customers want that don't exist
- **Problems with existing features** — complaints, confusion, bugs, friction
- **What customers love** — explicit praise or strong positive signal

For each request/problem item, apply value-effort scoring (read dimensions from `routing-and-scoring.md`):
```
Value: [H/M/L]  Effort: [H/M/L]  Placement: [Quick Win | Strategic Bet | Reconsider | Avoid / Defer]
Effort is always marked as estimated.
Evidence basis: [transcript-backed | inferred]
```

Compare each item against all prior `weekKey` sections in `pulse/master/customer-pulse-master.md`.
Mark recurrences explicitly: `↩ also raised in 2026-W11`

## Step 4 — Haiku write phase
Write the final weekly digest to `pulse/weekly/YYYY-WW-customer-pulse.md` with sections:
1. Week window and source transcript count
2. New Feature Requests (with value-effort placement)
3. Problems with Existing Features (with value-effort placement)
4. What Customers Love
5. Recurring Requests (cross-referenced to prior weeks)

## Step 5 — Update pulse master
Append the new week entry to `pulse/master/customer-pulse-master.md` following the existing section format.

## Step 6 — Update sync metadata
Update `state/last_sync.json` → `weeklyCustomerPulseDigest` with:
```json
{ "ranAt": "<iso>", "status": "success", "weekKey": "YYYY-WW", "windowStart": "...", "windowEnd": "..." }
```

## Step 7 — Commit and push
After writing the digest, updating the pulse master, and updating `state/last_sync.json`, run:
```
git add pulse/weekly/YYYY-WW-customer-pulse.md pulse/master/customer-pulse-master.md state/last_sync.json
git commit -m "digest: weekly pulse YYYY-WW"
git push
```

## Rules
- Never fabricate customer signals. Only surface what is in the transcripts.
- Always include all three tracker sections even if one is empty.
- Effort scores are always labeled "estimated" until validated by engineering.
- Do not fetch live Fireflies data. Use cached files only.
