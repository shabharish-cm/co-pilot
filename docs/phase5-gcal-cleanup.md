# Phase 5 — GCal Service Account Cleanup

**Target date:** ~2026-04-24 (30 days after Phase 4 deprecation on 2026-03-24)
**Prerequisite:** /morning has been running reliably via MCP for 30 days with no calendar regressions.

---

## Pre-flight checks (do these before deleting anything)

- [ ] Confirm /morning has produced correct calendar data every day since 2026-03-24
- [ ] Confirm no TypeScript build errors after removing the files (run `npm run build` from project root and `npm run build` from `ui/`)
- [ ] Confirm no unit or E2E test failures after removing the files (run `npm test` and `npx playwright test` from `ui/`)
- [ ] Confirm `/api/calendar` route is not called by any active UI component (already confirmed removed from display as of 2026-03-24, but verify)

---

## Files to delete

```
scripts/integrations/gcal/client.ts
scripts/integrations/gcal/mapper.ts
scripts/integrations/gcal/types.ts
scripts/test-gcal.ts
ui/app/lib/gcal.ts
ui/app/api/calendar/route.ts
```

### Commands

```bash
rm scripts/integrations/gcal/client.ts
rm scripts/integrations/gcal/mapper.ts
rm scripts/integrations/gcal/types.ts
rm scripts/test-gcal.ts
rm ui/app/lib/gcal.ts
rm ui/app/api/calendar/route.ts
```

If the `scripts/integrations/gcal/` directory is now empty:
```bash
rmdir scripts/integrations/gcal/
```

---

## Files to edit

### 1. `scripts/services/sync/morning-sync.service.ts`

Remove:
- Import lines for `GCalClient` and `mapGCalEvent`
- The entire `// ── Google Calendar ──` try/catch block (lines ~71–88 as of 2026-03-24)
- `GCalClient` and `mapGCalEvent` are no longer referenced anywhere

After deletion the `sourceStatus.googleCalendar` field will no longer be set by this service. Either:
- Remove `googleCalendar` from `sourceStatus` in the type and state, or
- Leave it absent (it will be `undefined`) — `/morning` sets it directly anyway

### 2. `scripts/config/env.ts`

Remove the `gcal` block:
```typescript
gcal: {
  serviceAccountJson: optional('GCAL_SERVICE_ACCOUNT_JSON', ''),
  calendarId:         optional('GCAL_CALENDAR_ID', 'primary'),
  userEmail:          optional('GCAL_USER_EMAIL', ''),
},
```

### 3. `ui/app/lib/types.ts`

Remove the `GCalEvent` and `GCalDayGroup` interface definitions (lines ~119–134 as of 2026-03-24). Verify nothing else imports them after `ui/app/api/calendar/route.ts` and `ui/app/lib/gcal.ts` are deleted.

### 4. `.env` (project root)

Remove the entire Google Calendar section comment block (already cleaned of values in Phase 4):
```
# Google Calendar — service account
# DEPRECATED (Phase 4 — 2026-03-24): Vars removed. Calendar now via MCP.
# Remove GCAL_* secrets from GitHub Actions in Phase 5 (~2026-04-24).
```

### 5. `.github/workflows/morning-sync.yml`

Remove the GCAL secret references from the env block:
```yaml
# Remove these two lines:
GCAL_SERVICE_ACCOUNT_JSON: ${{ secrets.GCAL_SERVICE_ACCOUNT_JSON }}
GCAL_CALENDAR_ID:         ${{ secrets.GCAL_CALENDAR_ID }}
```

---

## Tests to delete

### 6. `tests/unit/integrations/mapper.test.ts`

Delete — tests `mapGCalEvent` which is being removed:
```bash
rm tests/unit/integrations/mapper.test.ts
```

### 7. `ui/tests/calendar.spec.ts`

Delete — tests `/api/calendar` endpoint being removed:
```bash
rm ui/tests/calendar.spec.ts
```

---

## GitHub Actions secrets to revoke

In the GitHub repo settings (Settings → Secrets and variables → Actions):

- [ ] Delete `GCAL_SERVICE_ACCOUNT_JSON`
- [ ] Delete `GCAL_CALENDAR_ID`
- [ ] (Leave `GCAL_USER_EMAIL` if present — was already empty/unused)

---

## Google Cloud — optional but recommended

The service account `claude-task@carbide-skyline-490121-e9.iam.gserviceaccount.com` was used only for calendar access. Once Phase 5 is complete:

- [ ] In Google Cloud Console → IAM & Admin → Service Accounts: delete or disable the service account key (key ID: `c5eb0ea4b4731a2ffb4636c3c4cfe8a49a8aff24`)
- [ ] Optionally delete the service account entirely if it has no other uses in the project `carbide-skyline-490121-e9`

---

## Documentation to update

- [ ] Delete `memory/project_gcal_setup.md` — service account setup notes no longer relevant
- [ ] Update `CLAUDE.md` — remove any references to `GCAL_SERVICE_ACCOUNT_JSON`, `GCAL_CALENDAR_ID`, `GCAL_USER_EMAIL` from the canonical files table if present

---

## Commit message template

```
chore: phase 5 — delete deprecated gcal service account integration

Calendar data now flows exclusively via the claude.ai GCal MCP server.
Removes: gcal/ client, mapper, types, test-gcal, ui/lib/gcal, /api/calendar route,
         related unit + E2E tests, GCAL_* env vars and GitHub Actions secrets.
```
