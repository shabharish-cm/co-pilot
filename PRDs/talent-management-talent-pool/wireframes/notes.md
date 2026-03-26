# Wireframe Notes — Talent Pool

Version 1.0 | 2026-03-26

---

## Component Breakdown

| Component | Purpose | Key State |
|-----------|---------|-----------|
| `App` | Root router, cycle state owner | `view`, `cycles[]` |
| `TopNav` | Fixed 56px header | Static |
| `Sidebar` | Left nav with module sections | `currentView` |
| `TalentPoolLanding` | Cycle list table + New Survey CTA | Driven by `cycles[]` |
| `CycleRow` | Single cycle row with progress bar | Static |
| `SurveyBuilder` | 3-step wizard container | `step`, `nameData`, `questions[]`, `audienceData` |
| `WizardProgress` | Step indicator (3 steps) | `step` |
| `Step1NameDesc` | Survey name + description form | Lifted to SurveyBuilder |
| `Step2Questions` | Question card list + Add Question | `questions[]` |
| `QuestionCard` | Individual question editor w/ branching | `branchOpen` |
| `Step3Audience` | Audience selector + deadline + estimate | Lifted to SurveyBuilder |
| `SurveyPreviewModal` | Overlay simulating employee view | `answers{}` |
| `ActiveCycleWarningModal` | Warning before sending when cycle active | Shown from SurveyBuilder |
| `EmployeeSurvey` | Employee-facing survey experience | `started`, `answers{}`, `submitted` |
| `FilterPanel` | Left-rail checkbox filters | Lifted to TalentPoolDashboard |
| `TalentPoolDashboard` | Dashboard with KPIs, table, cycle switcher | `filters{}`, `selectedEmployee`, `selectedCycleId` |
| `EmployeeProfileDrawer` | Fixed right-rail profile drawer | `showPrior` |
| `KPICard` | Single metric tile | Static |
| `StatusBadge` | Colored dot + status label | Static |
| `EmptyState` | Illustration placeholder + CTA | Static |
| `Btn` | Multi-variant button atom | `variant`, `disabled` |

---

## UX Patterns Used

| Pattern | Applied In | Source |
|---------|-----------|--------|
| Wizard Pattern | Survey Builder (3 steps: Name → Questions → Audience) | `ux_patterns.md #1` |
| Search + Filter Pattern | Talent Pool Dashboard (left-rail filters, table body) | `ux_patterns.md #2` |
| Card Pattern | KPI Cards, QuestionCard | `ux_patterns.md #5` |
| KPI Card Pattern | Dashboard header metrics (respondents, rate, filtered count) | `ux_patterns.md #6` |
| Empty State Pattern | Landing (no cycles), Dashboard (no filter results) | `ux_patterns.md #7` |
| Confirmation Pattern | Active cycle warning modal before Send | `ux_patterns.md #8` |
| Export Pattern | Dashboard export dropdown (CSV / XLSX) | `ux_patterns.md #9` |
| Modal Form Pattern | Survey Preview modal | `ux_patterns.md #10` |
| Status Indicator Pattern | Cycle list (Active/Closed/Draft dot badges) | `ux_patterns.md #11` |
| Bulk Action Pattern | Not yet implemented — see open questions | `ux_patterns.md #3` |

---

## State Decisions

### Branching Logic
- Branching state lives inside each `QuestionCard` — `branch: { triggerOption, followUp }` or `null`.
- In both the builder and the employee survey, the follow-up question renders inline below the trigger only when the matching option is selected.
- If the trigger answer changes, the follow-up collapses (no persistent state carried). Per FR2.
- Nested branching is not supported in V1 — the branching panel is disabled for questions that are already conditional follow-ups (open question: add the disabled state explicitly in V2 of this wireframe).

### Cycle State
- Cycle list lives in `App` root. Survey Builder calls `onSend` which appends a new cycle and redirects to Landing.
- Active cycle detection is passed as `hasActiveCycle` prop to SurveyBuilder; triggers warning modal on Send.

### Filter State
- Filters live in `TalentPoolDashboard`. On filter change, `selectedEmployee` is cleared to avoid stale drawer.
- Filter state is preserved when clicking an employee row and returning (it's in the parent, not the table).

### Employee Profile Drawer
- Fixed-position right rail. Rendered inside `TalentPoolDashboard`, positioned at `top: 56px` to clear the nav.
- Prior cycle comparison uses `priorChanged` field on mock employee. Changed fields shown as amber `from → to` pill.
- Drawer does not push table content — it overlays. For V1 this is acceptable; V2 could push layout.

---

## Deviations from UX Patterns

| Deviation | Reason | Flagged? |
|-----------|--------|---------|
| Employee profile is a **side drawer**, not a modal | PRD section 4.3 specifies "drawer/sidebar" explicitly. Modal Form Pattern (ux_patterns.md #10) applies to forms; profile view is read-only. | Acceptable — PRD overrides pattern. |
| Dashboard filter panel is a **persistent left rail**, not a dropdown | Scale of filter dimensions (6 categories, up to 5 options each) makes dropdown filters inadequate. Left rail is more usable for multi-dimension filtering. | Acceptable — consistent with enterprise HR dashboard conventions. |
| No bulk action toolbar in current table | Bulk action pattern applies but shortlisting/exporting is done via the export button for the full filtered view. Per PRD there's no per-row action beyond view. | Defer to V2 if batch shortlisting is added. |

---

## Open UX Questions

1. **Search bar on dashboard** — PRD notes "free-text search across employee responses" as unconfirmed inference. Currently not in the wireframe. Should a search bar appear above the table? If confirmed, add search bar per ux_patterns.md #2 layout.

2. **Pagination on the talent pool table** — mock data shows 5 rows; at 200–300 respondents the table needs pagination or virtual scroll. Not yet wired.

3. **Reminder flow** — "Send Reminder" button appears on cycle row and dashboard banner but the confirmation/recipient scope modal is not yet designed.

4. **Cycle close confirmation** — "Close Cycle" button needs a confirmation modal (ux_patterns.md #8) to prevent accidental close. Not yet wired.

5. **Prior cycle comparison at population level** — US.27 requires toggling the dashboard between cycles at the population level. The cycle switcher dropdown is in place but the visual diff between cycles (e.g., how many employees changed relocation willingness) is not yet surfaced in the dashboard KPIs.

6. **Drag-and-drop question reorder** — US.4. Not wired in this prototype. Would use a drag handle on each QuestionCard. Low risk to add in next iteration.

7. **"Save progress and continue later" flow** — The button is visible in the employee survey but the resume-from-saved-state behaviour (pre-populated answers on return) is not implemented in the prototype since it would require server persistence simulation.

8. **Sub Admin access** — the wireframe shows a Super Admin persona only. Sub Admin should have the same dashboard view but no survey creation/send access. Role differentiation is not surfaced in this prototype.
