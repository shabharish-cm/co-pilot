# Wireframe Design Notes — Talent Management: Skill Gap Analysis

Generated: 2026-03-25
PRD: `PRDs/talent-management-skill-gap-analysis/prd.md`
Wireframe: `wireframes/index.html` (open directly in browser, no build step)

---

## Screens Covered

| Screen | View ID | Key States |
|--------|---------|------------|
| Skills Library | `skills-library` | Default (populated), bulk action toolbar |
| Skills Library — Empty | `skills-empty` | Empty state with primary CTA |
| Skills Library — Upload Drawer | (open via button) | Validation error state, error rows |
| Assessment Cycles | `cycles` | List of 3 cycles, closing-soon banner |
| Cycle Detail | `cycle-detail` | Active cycle, per-team submission tracking |
| Manager — Employee List | `manager-list` | All 4 direct report statuses, admin toggle banner |
| Manager — Rating Form | `manager-form` | Partial completion, real-time gap indicators |
| Heatmap (default) | `heatmap` | Benchmark row on, KPI cards, tooltip demo |
| Heatmap — Below Benchmark | `heatmap-filtered` | Gray-out filter applied, at-risk cells highlighted |
| Employee Competency Profile | `employee-profile` | Ratings tab, trend chart (2 cycles), audit log tab |

---

## Design Decisions

### 1. Navigation: standalone Talent Management section
- Added as a distinct sidebar section ("Talent"), separate from LISTEN/ANALYSE/INSIGHTS/ACT.
- Sub-navigation: Skills Library | Assessment Cycles | Heatmap.
- Rationale: PRD explicitly says Talent Management is a standalone module — does not share survey nav or reporting infrastructure.

### 2. Heatmap tooltip — dynamic hover
- Each skill cell (`hm-cell`) carries `data-skill`, `data-actual`, `data-required`, `data-importance`.
- A single fixed-position `#hm-tooltip` div follows the cursor via `mousemove`.
- Tooltip content: skill name, employee name (read from the row's first `<td>`), Actual Level, Required Level, Skill Importance, gap verdict (color-coded: green=above, yellow=at, orange=below by 1, red=below by 2+).
- Tooltip flips to left/above the cursor when it would overflow the viewport edge.
- Cells not in `hm-cell` class (col-left, overall column, benchmark row) do not trigger the tooltip.

### 2b. Heatmap color scale
- **Green**: Actual > Required (above benchmark)
- **Yellow**: Actual = Required (at benchmark)
- **Orange**: Actual = Required − 1 (below by 1)
- **Red**: Actual ≤ Required − 2 (below by 2 or more)
- Color-blind fallback: each cell shows the numeric actual value; tooltip includes full Actual/Required/Importance context (not color-only).
- Rationale: PRD §4.4 (FR18) specifies this 4-tier color model.

### 3. Benchmark reference row
- Shown as a fixed row below column headers (not a separate sticky element, due to lo-fi wireframe constraint).
- Toggle on/off via filter bar.
- Rationale: PRD §4.4 — "A benchmark reference row can be toggled on/off."

### 4. Overall Skill Level column
- Last column in heatmap, shaded gray to distinguish from skill columns.
- Computed as simple average of all actual ratings (1 decimal place).
- Rationale: PRD §4.4 + FR25 — "simple average of all actual ratings."

### 5. Admin → Manager view toggle
- Shown as a yellow banner in Manager List view with a clear label: "You are in Manager View."
- Rationale: PRD §4.3 — toggle must be visually prominent; admin navigation persists so they can switch back.

### 6. Skills Library — "Team Skill" badge
- Skills created by a manager (team-scoped) show a teal badge.
- Super Admins can "Promote" a team skill to global — this action appears in the actions column.
- Rationale: PRD §4.1 + US.4 + US.5.

### 7. Upload drawer validation errors
- Row-level errors shown inline in the drawer before committing any data.
- Duplicate skill name shown as a warning (orange), not a hard error — requires explicit confirmation.
- Rationale: PRD §4.1 (FR2, FR6).

### 8. Assessment form — real-time gap indicator
- Per-skill gap shown as colored badge (Below Required / At Required / Above Required) while the manager is rating, without page reload.
- Rationale: PRD §4.3 (FR13) — "a visual indicator shows whether the rating is at/above/below the benchmark — in real time, before submission."

### 9. Audit log tab
- Displayed as a tab on the Employee Competency Profile, not a separate page.
- Entries are reverse-chronological.
- Audit log footer note: "append-only, cannot be modified or deleted."
- Rationale: PRD §4.5 + FR27 + FR28.

### 10. "Not Assessed" state in heatmap
- Employees whose manager has not yet submitted appear as rows with gray "Not assessed" cells spanning all skill columns.
- Rationale: PRD §4.4 — "Employee not yet assessed in selected cycle → Row shown with empty/gray cells and 'Not assessed' label."

---

## UX Pattern Compliance

| Pattern | Used In | Source |
|---------|---------|--------|
| Search + Filter Pattern | Skills Library, Heatmap | `ux_patterns.md` §2 |
| Bulk Action Pattern | Skills Library (row selection → action toolbar) | `ux_patterns.md` §3 |
| Drill-down Analytics Pattern | Heatmap → Employee Profile | `ux_patterns.md` §4 |
| Card Pattern | KPI cards, Cycle cards, Skills Library card | `ux_patterns.md` §5 |
| KPI Card Pattern | Heatmap top KPIs, Cycle Detail stats | `ux_patterns.md` §6 |
| Empty State Pattern | Skills Library empty, Cycle list empty | `ux_patterns.md` §7 |
| Confirmation Pattern | Close Cycle modal (destructive) | `ux_patterns.md` §8 |
| Export Pattern | Heatmap export (CSV/XLSX) | `ux_patterns.md` §9 |
| Modal Form Pattern | New Cycle, Add Skill, Close Cycle confirm | `ux_patterns.md` §10 |
| Status Indicator Pattern | Cycle status (Active/Closed/Draft), Employee status (Submitted/In Progress/Not Started) | `ux_patterns.md` §11 |
| Loading Pattern | (not mocked as interactive state — described below) | `ux_patterns.md` §12 |

### Deviations from defined patterns (flagged)
- **Drawer pattern**: CSV upload uses a right-side drawer (not a modal). This is not explicitly defined in `ux_patterns.md`. Chosen because the upload interaction involves multi-step content (instructions → upload zone → validation errors) that fits a drawer better than a centered modal. Flag for design review.
- **Trend chart (simplified SVG)**: SVG line chart used inline; `ux_patterns.md` lists D3.js as the chart library. The wireframe uses a static SVG placeholder — implementation should use D3 trend charts. Flag for engineering.

---

## States Not Interactively Mocked (described here)

### Loading state
- Applies to: Skills Library table load, Heatmap grid load, Employee Profile load.
- Pattern: centered brand-green spinner (`#55ce97`), full content area replaced.
- After load: content fades in. Use skeleton shimmer on heatmap rows if load > 1 second.

### Error state (API failure)
- Pattern: alert banner at top of content area: "Failed to load data. Please try again." + retry button.
- Does not show partial data.

### Draft saved toast
- After "Save as Draft" in Manager Assessment Form: green toast bottom-right: "Draft saved" — auto-dismisses after 3 seconds.

### Submitted toast
- After "Submit Assessment": green toast: "Assessment submitted for [Employee Name]." Status badge updates to "Submitted" without page reload.

### Cycle activation validation
- Attempting to activate a cycle with no teams assigned: inline validation error on "Activate" button click — does not open a modal, shows error inline on the cycle detail page.

---

## Open UX Questions

1. **Rating selector style**: The wireframe uses individual buttons (1–5) per row. An alternative is a single dropdown selector, which would compress the form vertically for employees with many skills. Buttons are preferred for real-time gap feedback (color updates per selection) but may not scale if skill count exceeds 10. Decision needed before build.

2. **Heatmap scroll behavior on large orgs**: For orgs with 50+ employees × 10+ skills, the heatmap table will require both horizontal and vertical scrolling simultaneously. The Employee Name and Role columns should be sticky (CSS `position: sticky`). Not mocked in wireframe — flag for frontend implementation.

3. **Cycle selector placement in heatmap**: Currently in the filter bar (left-aligned). Given how central cycle selection is to the whole view, a more prominent placement (e.g., page-level dropdown in the header, not within the filter row) may better signal its hierarchy. Needs design review.

4. **"Below Benchmark" filter interaction**: The wireframe grays out at/above-benchmark cells. An alternative is filtering out entire rows (only showing employees with at least one gap). The PRD describes cell-level graying (FR21), not row-level filtering. Confirm with product.

5. **Skill level label system**: The wireframe uses 1=Novice, 2=Beginner, 3=Developing, 4=Proficient, 5=Expert as display labels. These are not defined in the PRD — they were inferred from common competency frameworks. Confirm with Alumil what label system they use in their current Excel model.

6. **Manager assessment form — skills count UX**: If a team has 15+ skills, the table-per-employee form becomes very long. A paginated or collapsed form (show 5 skills at a time) may be needed. PRD does not specify. Raise with engineering for V1 scope.

7. **Trend chart y-axis**: Wireframe SVG shows a 1–5 scale on y-axis with the Required Level as a dashed green line. Confirm this is the intended representation — alternative is showing Gap (Required − Actual) over time instead of raw score.
