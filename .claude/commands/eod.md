# /eod — End of Day Summary

## Purpose
Generate an end-of-day summary and carry-forward recommendations.

## Model
- **Haiku** for final digest drafting.
- **Sonnet** only if reasoning is needed to detect missed commitments or blockers.

## Step 0 — Fetch live state
Always fetch live from Todoist MCP — do not rely on cached state for tasks, as tasks are completed directly in Todoist throughout the day.
- Call `get_tasks_list` with `project_id: 6g8q49QQxHrFxRFx` → open tasks
- Call `get_completed_tasks` with `project_id: 6g8q49QQxHrFxRFx` → filter to tasks completed today (IST)
- Read `state/current_day.json` for meetings context only (`todayMeetings`)

## Inputs
1. Todoist MCP (always live) — open tasks + completed today
2. `state/current_day.json` — meetings context only

## Output Structure

### 1. Completed Today
List tasks completed today from the live `get_completed_tasks` fetch. Count and congratulate if meaningful.
If empty: note it (no fallback to stale state).

### 2. Carry-Forward Tasks
List open tasks from the live `get_tasks_list` fetch that were due today or earlier and are still open.

### 3. Due Soon (Next 3 Days)
From the live open tasks, list tasks due within the next 3 days. Highlight any that look at risk given today's carry-forward.

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
