# /morning — Daily Morning Digest

## Purpose
Fetch live data from Todoist, Google Calendar, and Gmail via MCP using parallel subagents, correlate the results, then generate a human-readable morning digest.

## Architecture
- **Step 0**: Launch 3 subagents in parallel — one per connector — each returning structured JSON.
- **Step 1**: Correlate the three JSON payloads in the main agent.
- **Step 2**: Write state files.
- **Step 3**: Generate and write the digest.
- **Step 4**: Commit and push.

---

## Step 0 — Launch connector subagents in parallel

Send a **single message** with **three Agent tool calls** at the same time (do not call them sequentially). Each subagent reads its skill file and returns a JSON blob.

### Subagent 1 — Todoist
```
subagent_type: general-purpose
description: "Fetch Todoist tasks"
prompt: |
  Today's date in IST is YYYY-MM-DD.
  Follow the skill spec in .claude/Skills/fetch-todoist.md exactly.
  Return only the JSON object described in that file. No other text.
```

### Subagent 2 — Google Calendar
```
subagent_type: general-purpose
description: "Fetch GCal events"
prompt: |
  Today's date in IST is YYYY-MM-DD.
  Follow the skill spec in .claude/Skills/fetch-gcal.md exactly.
  Return only the JSON object described in that file. No other text.
```

### Subagent 3 — Gmail
```
subagent_type: general-purpose
description: "Fetch Gmail signals"
prompt: |
  Today's date in IST is YYYY-MM-DD.
  Follow the skill spec in .claude/Skills/fetch-gmail.md exactly.
  Return only the JSON object described in that file. No other text.
```

Wait for all three to complete before proceeding.

---

## Step 1 — Correlate

Parse the three JSON payloads. Each has a `status` field (`fresh | failed | partial`).

Build the consolidated data model:

```
openTasks      ← todoist.openTasks         ([] if todoist.status === "failed")
dueSoon        ← openTasks filtered: dueSoon === true
overdue        ← openTasks filtered: isOverdue === true
dueToday       ← openTasks filtered: due === today AND NOT isOverdue
meetings       ← gcal.meetings             ([] if gcal.status === "failed")
emailSignals   ← gmail.signals             ([] if gmail.status === "failed")
sourceStatus   ← { todoist, gcal, gmail }  each: status value from payload
```

### Cross-source correlations to detect (used in Watch-outs)
- **Meeting overlap**: meetings with start/end times that overlap or have < 5 min buffer
- **Team signal + task**: a Gmail TEAM signal whose sender matches an open CS/Engg task requestor
- **Due-today + meeting conflict**: a task due today whose owner is also in a long meeting block
- **Security alerts**: emails from `accounts.google.com` or Todoist security notices

---

## Step 2 — Write state

Write `state/current_day.json`:
```json
{
  "date": "YYYY-MM-DD",
  "timezone": "Asia/Kolkata",
  "lastMorningSyncAt": "<ISO now>",
  "lastEveningSyncAt": "<preserve existing value from current file>",
  "sourceStatus": {
    "todoist": "fresh | failed",
    "googleCalendar": "fresh | failed"
  },
  "openTasks": [ ...from todoist subagent... ],
  "completedToday": [],
  "dueSoon": [ ...tasks where dueSoon is true... ],
  "todayMeetings": [ ...from gcal subagent, mapped to MeetingRecord shape... ],
  "digestPaths": {
    "morning": "daily/digests/YYYY-MM-DD-morning.md",
    "eod": null
  }
}
```

`todayMeetings` shape per entry:
```json
{ "id": "...", "title": "...", "startTime": "ISO", "endTime": "ISO", "attendees": ["email"], "attendeeCount": N }
```

Also write `daily/raw/YYYY-MM-DD-morning.json`:
```json
{
  "date": "YYYY-MM-DD",
  "fetchedAt": "<ISO now>",
  "sourceStatus": { "todoist": "...", "googleCalendar": "..." },
  "openTasks": [...],
  "todayMeetings": [...]
}
```
This file is required by the evening sync — do not skip it even if sources failed.

---

## Step 3 — Generate digest

Produce the digest in this exact structure:

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

- Flag cross-source correlations from Step 1, scheduling conflicts, overdue items, back-to-back pressure.
- ⚠️ Use warning emoji for anything that needs attention before the day starts.

## Focus Tip

One concrete, actionable tip for the day based on the task/meeting/email mix.

---

## 📆 Today's Meetings
- **HH:MM AM/PM–HH:MM AM/PM** — Meeting title  (N attendees)
_or: No meetings scheduled today._

## ✅ Due Today
- [ ] **Task name**  `priority-label`  #section

## 🔴 Overdue
- [ ] **Task name**  `priority-label`
_or: No overdue tasks_

## 📅 Upcoming (next 7 days)
- [ ] **Task name** — due YYYY-MM-DD  `priority-label`
_or: Nothing scheduled in the next 7 days_

## 📬 Email Signals
- **Sender Name** — Subject line  [STARRED] [TEAM]
  > one-line snippet
_or: No unread signals in the last 24h_

---
_Generated at HH:MM IST · Todoist: fresh/cached/failed · Calendar: fresh/failed · Gmail: fresh/partial/failed_
```

### Priority labels
- 4 → `urgent`
- 3 → `high`
- 2 → `medium`
- 1 → `normal`

### Urgency prefix
Use `[URGENT]`, `[HIGH]`, `[MEDIUM]`, or omit for normal.

### Source failure banners
If any source failed, prepend to the AI Prioritization section:
> ⚠ [Source name] data unavailable — digest based on partial data.

### Fallback for failed Todoist
If Todoist subagent failed but `state/current_day.json` exists from an earlier sync today, read it and use its `openTasks` as cached fallback. Note the fallback in the banner: `⚠ Todoist live fetch failed — using cached state from HH:MM IST`.

---

## Step 4 — Write digest file

Write to: `daily/digests/YYYY-MM-DD-morning.md`
Update `state/current_day.json` → `digestPaths.morning`.

---

## Step 5 — Commit and push

```
git add daily/digests/YYYY-MM-DD-morning.md state/current_day.json daily/raw/YYYY-MM-DD-morning.json
git commit -m "digest: morning YYYY-MM-DD"
git push
```

---

## Rules
- Launch all three subagents in a **single parallel message** — not sequentially.
- Wait for all three results before correlating. Never generate the digest from partial subagent data.
- AI Prioritization (Top 3, Meeting Prep, Watch-outs, Focus Tip) must always appear before the raw data sections.
- Do not invent task or meeting data not returned by subagents.
- Always write `daily/raw/YYYY-MM-DD-morning.json` — the evening sync depends on it.
- If a source fails, show partial data with a banner. Do not abort.
- Gmail failure: omit the 📬 section silently. Do not show a banner for Gmail failure.
