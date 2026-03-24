# Skill: fetch-gcal

Fetch today's Google Calendar events and return normalized JSON.

## Tool
Use `mcp__claude_ai_Google_Calendar__gcal_list_events` with:
- `timeMin`: today 00:00:00 (IST, YYYY-MM-DDT00:00:00)
- `timeMax`: today 23:59:59 (IST, YYYY-MM-DDT23:59:59)
- `timeZone`: Asia/Kolkata
- `condenseEventDetails`: false (need full attendee list)

Today's date is provided in the prompt. If not provided, derive it from IST (UTC+5:30).

## Filtering
- Drop events where `status === "cancelled"`
- Keep confirmed and tentative events

## Output format

Return ONLY a single JSON object — no prose, no explanation:

```json
{
  "source": "gcal",
  "status": "fresh | failed",
  "error": null,
  "fetchedAt": "<ISO timestamp>",
  "meetings": [
    {
      "id": "...",
      "summary": "...",
      "start": "ISO datetime with +05:30 offset",
      "end": "ISO datetime with +05:30 offset",
      "startFormatted": "3:00 PM",
      "endFormatted": "3:45 PM",
      "status": "confirmed",
      "myResponseStatus": "accepted",
      "organizer": "email@domain.com",
      "attendeeCount": 10,
      "attendees": ["email1@...", "email2@..."],
      "description": "optional agenda text or null"
    }
  ]
}
```

If the tool call fails, return:
```json
{ "source": "gcal", "status": "failed", "error": "<error message>", "fetchedAt": "<ISO>", "meetings": [] }
```
