# /diagnostics — System Health Check

## Purpose
Inspect the health of all sync sources, MCP servers, state files, and schema compliance. Useful before running any workflow.

## Model
- **Sonnet**

## Checks to run

### 1. MCP Server status
- **Todoist MCP**: Can the `get_tasks_list` tool be called? Attempt a call with `project_id: 6g8x4JxwH876pgGQ` (a known project). Report: `available | unavailable`.
- **Google Calendar MCP**: Can `gcal_list_events` be called? Report: `available | unavailable`.
- **Gmail MCP**: Can `gmail_get_profile` be called? Report: `available | unavailable`.

### 2. State file existence
- `state/current_day.json` — exists and valid JSON?
- `state/last_sync.json` — exists and valid JSON?
- `state/transcript_index.json` — exists and valid JSON?

### 3. Freshness
For each sync source, report last sync time and whether it is within threshold:
| Source | Last synced | Threshold | Status |
|--------|------------|-----------|--------|
| Morning digest (`/morning`) | `morningSync.ranAt` | 12h | fresh/stale/missing |
| Evening sync (GitHub Actions) | `eveningSync.ranAt` | 12h | fresh/stale/missing |
| Fireflies sync | `dailyFirefliesSync.ranAt` | 36h | fresh/stale/missing |
| Weekly pulse | `weeklyCustomerPulseDigest.ranAt` | 8d | fresh/stale/missing |

### 4. Source status
Report `sourceStatus.todoist` and `sourceStatus.googleCalendar` from `current_day.json`.

### 5. Transcript index
Count entries in `state/transcript_index.json`. List the last 5 days with transcript counts.

### 6. Pulse master
Check `pulse/master/customer-pulse-master.md` exists and is non-empty.

### 7. Active PRDs
Scan `PRDs/` for any directories. For each, check if `prd.md` exists and report current stage.

## Output
Print a health summary table inline. Do not write any files.
