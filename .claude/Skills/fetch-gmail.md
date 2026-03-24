# Skill: fetch-gmail

Fetch Gmail signals using three parallel queries and return deduplicated, normalized JSON.

## Queries (run all three)

1. `is:unread newer_than:1d` — max 10
2. `is:starred is:unread` — max 10
3. `is:unread from:(KN OR Karthik OR Gowtham OR Yugi OR Dhamo OR Sam OR Saran OR Nandha OR Krishna) newer_than:2d` — max 10

Use `mcp__claude_ai_Gmail__gmail_search_messages` for each.

## Normalization
- Deduplicate by `messageId` across all three queries
- For each message: extract `sender`, `subject`, `snippet`, `date`, `messageId`
- Tags:
  - `STARRED` if found in query 2
  - `TEAM` if found in query 3
  - A message can have both tags
- Skip messages from: `no-reply@`, `noreply@`, automated newsletter senders (Medium, Grammarly, BrowserStack promo), unless they are TEAM-tagged
- Limit output to 8 signals total, prioritizing TEAM > STARRED > recency

## Output format

Return ONLY a single JSON object — no prose, no explanation:

```json
{
  "source": "gmail",
  "status": "fresh | failed",
  "error": null,
  "fetchedAt": "<ISO timestamp>",
  "signals": [
    {
      "messageId": "...",
      "sender": "Display Name",
      "senderEmail": "email@domain.com",
      "subject": "...",
      "snippet": "...",
      "date": "...",
      "tags": ["TEAM"]
    }
  ]
}
```

If all three queries fail, return:
```json
{ "source": "gmail", "status": "failed", "error": "<error message>", "fetchedAt": "<ISO>", "signals": [] }
```

If only some queries fail, use results from the ones that succeeded and set `status: "partial"`.
