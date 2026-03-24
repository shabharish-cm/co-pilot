# /eod — End of Day Summary

## Purpose
Generate an end-of-day summary and carry-forward recommendations.

## Model
- **Haiku** for final digest drafting.
- **Sonnet** only if reasoning is needed to detect missed commitments or blockers.

## Step 0 — Pull latest state
Run `git pull` once at the start to pick up any updates committed by the evening sync (GitHub Actions runs at 19:00 IST and writes `completedToday` to `state/current_day.json`).

## Inputs
1. `state/current_day.json` — completed tasks, open tasks, due-soon tasks

## Freshness Check
Read `state/last_sync.json`. Check `morningSync.ranAt`.
- If `ranAt` is null or the date is not today: show banner:
  > ⚠ Morning digest was not run today — completed task data may be incomplete.
- If `eveningSync.ranAt` is null or older than 12 hours: show banner:
  > ⚠ Evening sync has not run yet — `completedToday` may not reflect all completions.

## Output Structure

### 1. Completed Today
List all entries in `completedToday`. Count and congratulate if meaningful.
If empty: note that the evening sync may not have run yet.

### 2. Carry-Forward Tasks
List all open tasks that were due today or earlier and are still incomplete.

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
```
git add daily/digests/YYYY-MM-DD-eod.md state/current_day.json
git commit -m "digest: eod YYYY-MM-DD"
git push
```
