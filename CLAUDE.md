# PM Copilot — Project Context

This repository is the durable memory and automation layer for Shabharish's PM workflow at CultureMonkey.

**Todoist project ID:** `6g8q49QQxHrFxRFx`
**Timezone:** Asia/Kolkata (IST, UTC+5:30)

---

## Team Membership

### Customer Success (CS)
Routing target: **CS Requests** (`section_id: 6g8x4HVHxpWVfVHQ`)

| Name | Aliases |
|------|---------|
| KN | KN |
| Karthik Rao | Karthik |
| Gowtham | GK, Gowtham |
| Yugi | Yugi |

### Engineering (Engg)
Routing target: **Engg asks** (`section_id: 6g8x4MgXR2q68fgQ`)

| Name | Aliases |
|------|---------|
| Dhamo | Dhamodharan |
| Sam | Sam (Director of Engineering and AI) |
| Saran | Saran |
| Nandha | Nandha |
| Krishna | Krishna |

Matching is case-insensitive. Partial matches count. If both CS and Engg signals are present, CS wins.

---

## Todoist Section Routing

Evaluate in strict priority order. Stop at first match.

| Priority | Signal | Section | Confidence |
|----------|--------|---------|------------|
| 1 | `effy` anywhere in title/notes | effy `6g9QcvpjJw2cFmCx` | matched |
| 2 | CS member name/alias in title or notes | CS Requests `6g8x4HVHxpWVfVHQ` | matched |
| 3 | Engg member name/alias in title or notes | Engg asks `6g8x4MgXR2q68fgQ` | matched |
| 4 | CM keywords: "initiative", "pulse initiative", "quick wins", "org", "platform strategy", "customer pulse", "feedback analysis", "product strategy", "blog", "blog post", "landing page", "content strategy", "marketing content", "AEO", "GEO", "SEO content", "align with marketing", "brief marketing" | CM `6g9wjjpVgppgxJwQ` | inferred |
| 5 | Feature keywords: "build", "design", "feature", "PRD", "spec", "roadmap" (not content/blog builds) | Features `6g8x4JxwH876pgGQ` | inferred |
| 6 | Label `follow-up` → CS Requests; label `engineering` → Engg asks; label `cm` → CM | varies | label-inferred |
| 7 | Default | Features `6g8x4JxwH876pgGQ` | defaulted |

When confidence is `inferred` or `defaulted`, show routing decision and allow override before creating.

---

## Value-Effort Scoring

**Value dimensions:** Revenue influence · Account importance · Frequency across calls · Retention impact · Strategic alignment

**Effort dimensions:** Implementation complexity · Cross-team dependency · Architecture impact · Data/model dependency · UI/UX complexity

Effort is always **estimated** until validated by engineering.

```
Value: [H/M/L]  Effort: [H/M/L]  Placement: [Quick Win | Strategic Bet | Reconsider | Avoid / Defer]
Evidence basis: [transcript-backed | inferred | labeled by requestor]
```

Quadrant: High Value + Low Effort → Quick Win · High Value + High Effort → Strategic Bet · Low Value + Low Effort → Reconsider · Low Value + High Effort → Avoid / Defer

---

## Product Glossary

Use these canonical terms in all PRDs, UX flows, digests, and documentation.

| Term | Definition |
|------|-----------|
| Survey | Structured questionnaire for employee feedback. Types: Engagement, Pulse, Lifecycle, eNPS |
| Pulse Survey | Short recurring survey for continuous engagement tracking |
| Lifecycle Survey | Automated surveys triggered by employee lifecycle events (onboarding, 30/60/90-day, exit) |
| Driver | Engagement dimension categorising survey questions (Wellbeing, Growth, Leadership, Recognition, Work Environment) |
| eNPS | Employee Net Promoter Score (0–10). Promoters 9–10, Passives 7–8, Detractors 0–6 |
| Heatmap | Visual grid of engagement scores across drivers and segments |
| Segment | Filtered employee group (Department, Location, Tenure, Manager, Gender) |
| Action | Corrective initiative from survey insights — assigned, tracked, completed |
| Survey Builder | Interface for creating surveys. Stages: Overview → Questions → Participants → Schedule → Review |
| Comment Analytics | Module for open-text analysis: sentiment, topic clustering, word clouds |
| Topic Explorer | AI-based clustering of employee feedback themes |
| Report Builder | Tool for customised report dashboards |
| Manager Dashboard | Engagement analytics restricted to a manager's team |
| Admin Dashboard | Global analytics for administrators |
| Channels | Survey distribution: Email, Slack, Microsoft Teams, WhatsApp, SMS, QR, Kiosk |
| Snapshot | Point-in-time capture of engagement metrics |
| Org Hierarchy | Organisational reporting structure visualisation |
| Employee Attributes | Metadata fields: Department, Location, Role, Tenure |
| Ask Cooper | AI chatbot inside the platform for on-demand engagement insights |

---

## Key Paths

| Resource | Path |
|----------|------|
| State — current day | `state/current_day.json` |
| State — last sync | `state/last_sync.json` |
| State — completed today | `state/claude_completed_today.json` |
| Transcript index | `state/transcript_index.json` |
| Pulse master | `pulse/master/customer-pulse-master.md` |
| Normalized transcripts | `pulse/normalized/YYYY-MM-DD-transcripts.json` |
| Daily digests | `daily/digests/YYYY-MM-DD-{morning,eod}.md` |
| Customer context | `context/customers/<Account>/` |
| Business profile | `context/business/business_profile.md` |
| UX patterns | `context/product/ux_patterns.md` |
