# MVP Scope: Section Visibility Rules + Reporting Changes

**Feature:** Section Rules
**Scope:** MVP
**Last updated:** 2026-03-19
**Status:** Scoping

---

## Problem

CultureMonkey surveys are fully static today — every employee sees every section. Customers need the ability to target specific sections at specific employee groups (e.g., show "Management Effectiveness" only to people managers). Without this, surveys either over-ask irrelevant questions or require separate surveys per segment — both create operational friction.

---

## What's In MVP

### 1. Section Rules — Survey Builder

**One rule per section.** A rule controls which employees see that section based on an HRIS attribute.

**Rule structure:**
```
IF [Attribute] [Operator] [Value(s)] → show section
```

**Supported attributes (MVP):** Department, Work Mode, Designation, Location
**Supported operators:** `is in`, `is not in`
**Multi-value:** Yes — comma-separated list (OR logic within the values)
**Rules per section:** 1 (MVP limit)

**Behaviour:**
- Sections without a rule → shown to all respondents (no change)
- Sections with a rule → shown only to employees matching the rule
- Questions within a ruled section are not individually configurable — the rule applies to the whole section

**Builder UX:**
- Each section card gets a "Add Rule" toggle
- Active rules display inline on the section card (e.g., `IF Department is in Sales, Product`)
- **Zero-match warning** — if the configured rule matches 0 employees in the current distribution list, show a warning before launch
- **Segment preview** — admin can select an attribute value to preview which sections that employee type would see

---

### 2. Report Changes

When a section has a rule, its questions are answered by a **subset** of total respondents. Reports must reflect this correctly.

#### 2a. Driver Score Heatmap

- Drivers sourced from ruled sections display a **subset indicator** — e.g., `n=12` (respondents who saw that section) instead of total survey respondents
- Anonymity threshold is evaluated against the **subset N**, not total respondents
- If subset N < threshold → driver score cell is suppressed (shown as `–`) for that demographic combination
- Column/row totals that include ruled-section drivers must use subset N for those drivers

#### 2b. Driver Score Drill-Down

- When Sam drills into a ruled-section driver, the respondent count shown is the subset N
- Demographic filter chips apply within the subset — not the full respondent pool
- If applying a demographic filter brings subset below threshold → suppress that cell
- Breadcrumb or label clearly indicates: *"Responses from: Department = Sales, Product (12 respondents)"*

#### 2c. Individual Question Reports

- Questions inside a ruled section show subset N as their response base
- Percentage calculations use subset N as denominator
- UI label: *"Shown to: [rule description]"* below the question title

---

### 3. Anonymity

No special handling required. The platform's existing query-level anonymity check (suppress results when query returns fewer than the threshold) applies uniformly to all report queries — including ruled sections. If a drill-down on a ruled section's driver returns fewer than the threshold, it is suppressed automatically. No additional section-level anonymity logic is needed.

---

## What's Out of MVP

| Excluded | Reason |
|---|---|
| Multiple rules per section (AND / OR) | Adds significant builder complexity; 1 rule covers primary use cases |
| Question-level rules | Requires question-level respondent tracking — scope creep |
| Answer-based branching (e.g., "If Q1 = X, show Q2") | Different problem — dynamic branching is a separate feature (P13) |
| Export changes (CSV / XLSX) | Subset N handling in exports deferred |
| Historical trend comparison for ruled sections | Ruled sections may not have prior data — deferred |
| Manager dashboard ruled-section drivers | Manager dashboard scoped separately |

---

## Open Questions

| # | Question | Owner |
|---|---|---|
| OQ1 | What HRIS attributes are available at rule-definition time? Are they guaranteed to be populated for all employees? | Engg |
| OQ2 | What happens if an employee's attribute changes after the survey launches — do they lose access to a section mid-survey? | Engg / PM |
| OQ3 | Should admins be warned if a rule results in fewer than the anonymity threshold of employees (not just 0)? | PM |
| OQ4 | Should ruled-section drivers be visually distinguished from global drivers in the heatmap column headers? | Design |
| OQ5 | How does subset N interact with the lifecycle/trend report — is a ruled section's score comparable across surveys? | PM |

---

## Rollout Notes

- Existing surveys are unaffected — no rules are applied retroactively
- Section rules are opt-in per section at survey creation / edit time
- The anonymity limitation should be documented in the admin help text when rules are configured
