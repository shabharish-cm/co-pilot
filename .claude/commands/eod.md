# /eod — End of Day Summary

## Purpose
Generate an end-of-day summary and carry-forward recommendations from cached state.

## Model
- **Haiku** for final digest drafting.
- **Sonnet** only if reasoning is needed to detect missed commitments or blockers.

## Step 0 — Sync repo
Run `git pull` once at the start of the session to ensure local state reflects the latest Action-committed data before reading files.
If this command is invoked from an automation script that already pulled, skip the extra pull.

## Inputs (read from repo — do not fetch live)
1. `state/current_day.json` — completed tasks, open tasks, due-soon tasks

## Freshness Check
Read `state/last_sync.json`. Check `eveningSync.ranAt`.
- If `ranAt` is null or older than 12 hours: show staleness banner.

## Output Structure

### 1. Completed Today
List all entries in `completedToday`. Count and congratulate if meaningful.

### 2. Carry-Forward Tasks
List all open tasks that were due today or earlier that are still incomplete.

### 3. Due Soon (Next 3 Days)
List tasks in `dueSoon`. Highlight any that look at risk given today's carry-forward.

### 4. Missed Commitments or Likely Blockers
Flag tasks that were overdue and remain open, or any pattern suggesting a blocker.

### 5. Suggested Next-Day Focus
Top 3–5 tasks to prioritize tomorrow, based on due date, priority, and carry-forward context.

## Output File
Write to: `daily/digests/YYYY-MM-DD-eod.md`
Update `state/current_day.json` → `digestPaths.eod`.

## Step — Commit and push
After writing the digest and updating `state/current_day.json`, run:
```
git add daily/digests/YYYY-MM-DD-eod.md state/current_day.json
git commit -m "digest: eod YYYY-MM-DD"
git push
```
