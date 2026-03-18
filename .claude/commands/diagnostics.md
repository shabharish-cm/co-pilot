# /diagnostics — System Health Check

## Purpose
Inspect the health of all sync jobs, state files, and schema compliance. Useful before running any workflow.

## Model
- **Sonnet**

## Checks to run

### 1. State file existence
- `state/current_day.json` — exists and valid JSON?
- `state/last_sync.json` — exists and valid JSON?
- `state/transcript_index.json` — exists and valid JSON?

### 2. Freshness
For each sync source, report last sync time and whether it is within threshold:
| Source | Last synced | Threshold | Status |
|--------|------------|-----------|--------|
| Morning sync | ... | 12h | fresh/stale/missing |
| Evening sync | ... | 12h | fresh/stale/missing |
| Fireflies sync | ... | 36h | fresh/stale/missing |
| Weekly pulse | ... | 8d | fresh/stale/missing |

### 3. Source status
Report `sourceStatus.todoist` and `sourceStatus.googleCalendar` from `current_day.json`.

### 4. Transcript index
Count entries in `state/transcript_index.json`. List the last 5 days with transcript counts.

### 5. Pulse master
Check `pulse/master/customer-pulse-master.md` exists and is non-empty.

### 6. Active PRDs
Scan `PRDs/` for any directories. For each, check if `prd.md` exists and report current stage.

## Output
Print a health summary table inline. Do not write any files.
