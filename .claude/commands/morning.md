# /morning — Daily Morning Digest

## Purpose
Generate a human-readable morning digest from cached repository state. Do not fetch live data.

## Model
- **Sonnet** for reasoning: prioritization, conflict detection, meeting prep analysis.
- **Haiku** for writing: final digest output.

## Step 0 — Sync repo
Run `git pull` once at the start of the session to ensure local state reflects the latest Action-committed data before reading files.
If this command is invoked from an automation script that already pulled, skip the extra pull.

## Inputs (read from repo — do not fetch live)
1. `state/current_day.json` — tasks, meetings, sync timestamps
2. `state/last_sync.json` — freshness metadata

## Freshness Check (mandatory)
Read `state/last_sync.json`. Check `morningSync.ranAt`.
- If `ranAt` is null or older than 12 hours, prepend a staleness banner to the digest:
  > ⚠ Data last synced: [X hours ago / never] — this digest may not reflect today.
- If `sourceStatus.todoist` or `sourceStatus.googleCalendar` is `failed` or `missing`: call it out explicitly.
- Do NOT present stale data as current without the banner.

## Output Format

Produce the digest exactly in this structure:

```
# Daily Digest — [Weekday], [Month DD, YYYY]

## 🤖 AI Prioritization

# Your [Weekday] Game Plan — [Month DD, YYYY]

## Top 3 Priorities

1. **[URGENCY] Task name** — One sentence on why this is first and when to do it.
2. **[URGENCY] Task name** — One sentence on sequencing relative to meetings.
3. **[URGENCY] Task name** — One sentence on when to slot it.

## Meeting Prep

- **Meeting name (HH:MM AM/PM)** — What to prepare, what to know, how long to prep. Skip if no meetings.

## Watch-outs

- Flag scheduling conflicts, overdue items, ambiguous due dates, or back-to-back pressure.
- ⚠️ Use warning emoji for anything that needs attention before the day starts.

## Focus Tip

One concrete, actionable tip for the day based on the task/meeting mix.

---

## 📆 Today's Meetings
- **HH:MM AM/PM–HH:MM AM/PM** — Meeting title  (N attendees)

## ✅ Due Today
- [ ] **Task name**  `priority-label`  #label

## 🔴 Overdue
- [ ] **Task name**  `priority-label`
_or: No overdue tasks_

## 📅 Upcoming (next 7 days)
- [ ] **Task name** — due YYYY-MM-DD  `priority-label`
_or: Nothing scheduled in the next 7 days_

---
_Generated at HH:MM IST_
```

### Priority labels
Map `priority` field → label:
- 4 → `urgent`
- 3 → `high`
- 2 → `medium`
- 1 → `normal`

### Urgency prefix in Top 3
Use `[URGENT]`, `[HIGH]`, `[MEDIUM]`, or omit for normal priority.

### Meeting attendee count
Use `attendees` array length from `todayMeetings`. Show `(N attendees)`.

### Time format
Convert UTC times to IST (UTC+5:30). Use 12-hour format with AM/PM for meetings.

## Output File
Write the digest to: `daily/digests/YYYY-MM-DD-morning.md`
Update `state/current_day.json` → `digestPaths.morning` with the written path.

## Step — Commit and push
After writing the digest and updating `state/current_day.json`, run:
```
git add daily/digests/YYYY-MM-DD-morning.md state/current_day.json
git commit -m "digest: morning YYYY-MM-DD"
git push
```

## Rules
- Do not invent task data not present in the state file.
- Do not call Todoist or Google Calendar APIs.
- The staleness check is non-optional.
- AI Prioritization section (Top 3, Meeting Prep, Watch-outs, Focus Tip) must always appear before the raw data sections.
