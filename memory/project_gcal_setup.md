---
name: GCal integration setup notes
description: How the Google Calendar integration is configured and what was fixed
type: project
---

**Calendar ID:** `shabharish.v@culturemonkey.io` (set in `GCAL_CALENDAR_ID`)

**Auth method:** Service account with direct calendar sharing (NOT domain-wide delegation)
- Service account: `claude-task@carbide-skyline-490121-e9.iam.gserviceaccount.com`
- Calendar shared with service account via Google Calendar → Settings → Share with specific people → "See all event details"
- `GCAL_USER_EMAIL` must be blank (impersonation not used; direct share is sufficient)

**Known past issue:** `.env` had multi-line JSON for `GCAL_SERVICE_ACCOUNT_JSON`. `dotenv` only parsed the first line `{`, causing silent JSON parse failure. Fixed by minifying the JSON to a single line.

**How to apply:** If GCal stops working, first check that `GCAL_SERVICE_ACCOUNT_JSON` is single-line in `.env`. If GitHub Actions fails, ensure the `GCAL_SERVICE_ACCOUNT_JSON` and `GCAL_CALENDAR_ID` secrets in the repo match the local `.env`.
