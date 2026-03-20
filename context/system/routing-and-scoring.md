# Routing And Scoring Logic

---

## Todoist Section Routing

### Sections (project_id: `6g8q49QQxHrFxRFx`)

| Section Name | Section ID | Order | Purpose |
|-------------|------------|-------|---------|
| Features | `6g8x4JxwH876pgGQ` | 1 | Feature requests and product work |
| CS Requests | `6g8x4HVHxpWVfVHQ` | 2 | Requests from CS team members |
| Engg asks | `6g8x4MgXR2q68fgQ` | 3 | Asks from Engineering team members |
| effy | `6g9QcvpjJw2cFmCx` | 4 | effy-related tasks |
| CM | `6g9wjjpVgppgxJwQ` | 5 | Org-level CultureMonkey internal tasks — initiatives, pulse, strategy, cross-team work |

Team membership is defined in `context/system/team-list.md`.

---

### Routing Algorithm

Evaluate signals in strict priority order. Stop at the first match.

**Priority 1 — Effy keyword**
- If the word `effy` appears anywhere in the task title or notes (case-insensitive)
- → Route to **effy** (`6g9QcvpjJw2cFmCx`)

**Priority 2 — CS team member detected**
- If a CS team member name or alias appears in the task title, requestor field, or notes
- CS members: KN, Karthik Rao, Karthik, Gowtham, Yugi
- → Route to **CS Requests** (`6g8x4HVHxpWVfVHQ`)
- Confidence: `matched`

**Priority 3 — Engineering team member detected**
- If an Engg team member name or alias appears in the task title, requestor field, or notes
- Engg members: Dhamo, Sam, Saran, Nandha, Krishna
- → Route to **Engg asks** (`6g8x4MgXR2q68fgQ`)
- Confidence: `matched`

**Priority 4 — CM org keywords detected**
- If the task contains org-level initiative keywords: "initiative", "pulse initiative", "quick wins", "org", "platform strategy", "customer pulse", "feedback analysis", "product strategy"
- If the task involves content creation: "blog", "blog post", "landing page", "content strategy", "marketing content", "AEO", "GEO", "SEO content"
- If the task involves internal PM execution: "align with marketing", "brief marketing", "sync with marketing"
- These are internal CultureMonkey tasks — not customer requests, not engineering asks, not feature builds
- → Route to **CM** (`6g9wjjpVgppgxJwQ`)
- Confidence: `inferred`

**Priority 5 — Feature keywords detected**
- If the task contains product or feature intent keywords (e.g. "build", "design", "feature", "PRD", "spec", "roadmap")
- Note: "build" only routes to Features if it clearly refers to product development (not blog/content/landing page builds)
- → Route to **Features** (`6g8x4JxwH876pgGQ`)
- Confidence: `inferred`

**Priority 6 — Label fallback**
- If the task has label `follow-up` → **CS Requests**
- If the task has label `engineering` → **Engg asks**
- If the task has label `cm` → **CM**
- Confidence: `label-inferred`

**Priority 7 — Default**
- → Route to **Features** (`6g8x4JxwH876pgGQ`)
- Confidence: `defaulted`

---

### Conflict Resolution

If both CS and Engg signals are detected in the same task:
- CS wins (higher priority)
- Record the losing Engg match in diagnostics output
- Example: `"share mockup to KN and Saran"` → CS Requests wins; Engg match logged

---

### Routing Examples

| Task title | Detected signal | Section routed | Confidence |
|-----------|----------------|---------------|------------|
| `share mockup to KN` | KN = CS member | CS Requests | matched |
| `review API contract with Dhamo` | Dhamo = Engg member | Engg asks | matched |
| `effy onboarding flow` | "effy" keyword | effy | matched |
| `share mockup to KN and Saran` | KN = CS wins, Saran = Engg (logged) | CS Requests | matched |
| `customer pulse initiative kickoff` | CM keyword: "pulse initiative" | CM | inferred |
| `gather quick wins from feedback` | CM keyword: "quick wins" | CM | inferred |
| `Q2 roadmap planning` | feature keywords | Features | inferred |
| `follow up on demo` | label: follow-up | CS Requests | label-inferred |
| `org strategy review` | CM keyword: "org" | CM | inferred |
| `check analytics numbers` | no signal | Features | defaulted |

---

### Implementation Notes

- Team lookup must read from `context/system/team-list.md` at runtime — do not hardcode names in service code.
- Section IDs must be read from a config constant, not hardcoded inline.
- All routing decisions must be logged with: `{ task, matchedRule, sectionId, sectionName, confidence, competingMatch? }`
- When Claude runs `/add` and routing confidence is `inferred` or `defaulted`, show the routing decision to the user before creating the task and allow override.

---

## Value-Effort Scoring

### Value Dimensions

| Dimension | Description |
|-----------|-------------|
| Revenue influence | Does this help win, expand, or retain paying accounts? |
| Account importance | Is the requestor a strategic or high-value account? |
| Frequency across calls | How many calls/transcripts mention this pain or request? |
| Retention impact | Would solving this reduce churn or prevent escalation? |
| Strategic alignment | Does this map to a current OKR or roadmap theme? |

### Effort Dimensions

| Dimension | Description |
|-----------|-------------|
| Implementation complexity | Lines of logic, API surface, data model changes |
| Cross-team dependency | Requires design, data, infra, or external team input |
| Architecture impact | Touches core platform, auth, or data pipelines |
| Data or model dependency | Requires ML, analytics infra, or schema migration |
| UI or UX complexity | New patterns, multi-state flows, or accessibility work |

Effort is always marked as **estimated** until explicitly validated by engineering.

### Scoring Output Format

```
Value: [H/M/L]  Effort: [H/M/L]  Placement: [Quick Win | Invest | Reconsider | Strategic Bet]
Evidence basis: [transcript-backed | inferred | labeled by requestor]
```

Quadrant mapping:
- High Value + Low Effort → **Quick Win**
- High Value + High Effort → **Strategic Bet**
- Low Value + Low Effort → **Reconsider**
- Low Value + High Effort → **Avoid / Defer**
