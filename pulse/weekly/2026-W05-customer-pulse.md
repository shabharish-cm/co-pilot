# Customer Pulse — 2026-W05
**Window:** Thu Jan 29 – Wed Feb 4, 2026
**Transcripts:** 3 (KAG dashboard walkthrough; Sprinto audit call — skipped; Yahoo internal engineering — skipped)
**Customer-facing signals from:** KAG weekly sync only

---

## 1. New Feature Requests

### Pie chart data labels without hover
Philip Dean (KAG) explicitly asked: when sharing pie chart views in leadership deep-dives, he can't see which slice is which without hovering. Wants values visible directly on the chart or top-3 categories auto-highlighted for export.
```
Value: H  Effort: L (estimated)  Placement: Quick Win
Evidence basis: transcript-backed
```
*Philip: "Part of the reason we did this was that we would not have to do a bunch of manual work."*

### Export pie chart data with labeled values
Related to above: current export of the new hire survey shows only participation percentages, not driver scores or pie chart breakdowns with labels. Kylee needs to export these for leadership presentations.
```
Value: H  Effort: M (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed
```

### Word cloud filterable by demographic
Philip asked if the word cloud can be filtered by team or division (not just overall). Currently, word clouds show organization-wide data only — cannot drill down by demographic.
```
Value: M  Effort: M (estimated)  Placement: Reconsider
Evidence basis: transcript-backed
```

### New hire survey converted to rating scale format
Current new hire survey uses single-select and open-text questions → cannot generate driver scores → blocked from advanced report templates. Yugi suggested converting to rating-scale to unlock heat maps and driver exports. Requires internal KAG discussion with Jen.
```
Value: H  Effort: L (estimated)  Placement: Quick Win
Evidence basis: transcript-backed
```
*This is a configuration decision — not a platform build. But unlocks significant reporting value.*

---

## 2. Problems with Existing Features

### Lifecycle analytics tab not accessible to admins
KAG could not see lifecycle analytics on their account — backend enablement missing. Yugi had to check and enable it post-call.
```
Value: H  Effort: L (estimated)  Placement: Quick Win
Evidence basis: transcript-backed
```

### AI sentiment emoji showing incorrect/misleading emojis
Emoji assigned by AI to free-text responses was wrong in some cases. Yugi acknowledged a bug and committed to investigating. Philip noted the "neutral" smiley looked like a sad face to some readers.
```
Value: M  Effort: M (estimated)  Placement: Reconsider
Evidence basis: transcript-backed
```

### Custom free-text question response count not updating
KAG's mandatory open-text questions in the new hire survey were showing incorrect response counts (or not updating in the feedback section). Yugi confirmed a backend issue to investigate.
```
Value: M  Effort: M (estimated)  Placement: Reconsider
Evidence basis: transcript-backed
```

### Advanced report templates unavailable for non-rating surveys
New hire survey is excluded from dynamic report templates because it has no rating-scale questions. Philip discovered this live during the call — blocked his reporting workflow.
```
Value: H  Effort: M (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed
```
*Root cause: survey design (open-text only), but customer expectation was that exports would "just work."*

---

## 3. What Customers Love

- **Heat maps with driver drill-down:** Philip: "This, this works really well for the organizational engagement survey. We're going to be able to structure that thing where you can just filter this thing straight out and run reports. That's going to be fine."
- **Pre-set report export templates:** Multiple templates (rating distribution, driver scores by manager, eNPS, text responses) appreciated even though the new hire survey was excluded.
- **Recording support for dashboard walkthroughs:** Kylee requested recording — Yugi enabled it immediately. Appreciated for training and leadership demos.

---

## 5. Recurring Requests

| Request | This week | Also in |
|---|---|---|
| Lifecycle analytics access | 2026-W05 | — |
