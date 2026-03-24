# Skill: fetch-todoist

Fetch all active tasks from the PM Copilot Todoist project and return normalized JSON.

## Tool
Use `mcp__todoist__get_tasks_list` with `project_id: 6g8q49QQxHrFxRFx`, `limit: 50`.

## Section ID → name map
| section_id | sectionName |
|-----------|-------------|
| 6g9QcvpjJw2cFmCx | effy |
| 6g8x4HVHxpWVfVHQ | CS Requests |
| 6g8x4MgXR2q68fgQ | Engg asks |
| 6g9wjjpVgppgxJwQ | CM |
| 6g8x4JxwH876pgGQ | Features |

## Priority map
| Todoist value | label |
|---------------|-------|
| 4 | urgent |
| 3 | high |
| 2 | medium |
| 1 | normal |

## Normalization rules (use today's date in IST, YYYY-MM-DD)
- `isOverdue`: `due < today`
- `dueSoon`: `due >= today AND due <= today + 3 days` (i.e. NOT overdue but within 3 days)
- `sectionName`: resolve from section_id using the map above; use `"Unknown"` if not found

## Output format

Return ONLY a single JSON object — no prose, no explanation:

```json
{
  "source": "todoist",
  "status": "fresh | failed",
  "error": null,
  "fetchedAt": "<ISO timestamp>",
  "openTasks": [
    {
      "id": "...",
      "content": "...",
      "due": "YYYY-MM-DD or null",
      "priority": 1,
      "priorityLabel": "normal",
      "labels": [],
      "sectionId": "...",
      "sectionName": "...",
      "isOverdue": false,
      "dueSoon": false,
      "url": "https://todoist.com/showTask?id=..."
    }
  ]
}
```

If the tool call fails, return:
```json
{ "source": "todoist", "status": "failed", "error": "<error message>", "fetchedAt": "<ISO>", "openTasks": [] }
```
