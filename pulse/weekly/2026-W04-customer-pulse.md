# Customer Pulse — 2026-W04
**Window:** Thu Jan 22 – Wed Jan 28, 2026
**Transcripts:** 1 (Yahoo — lifecycle survey implementation, weekly sync)

---

## 1. New Feature Requests

### Scheduled exports for lifecycle survey data
First explicit mention: Yahoo wants to move lifecycle data (confidential reports) out of CM automatically — weekly, biweekly, or monthly — to avoid manual CSV pulls. No current mechanism exists.
```
Value: H  Effort: M (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed
```
*Will recur heavily in subsequent weeks. High-priority enterprise need.*

### Personalized thank you page per survey
Currently, the thank you page after survey completion is generic and cannot be customized (only the landing page/description can). Yahoo (Dana, Kate) wanted to add "Welcome to Yahoo — as you settle in…" intro language and a personalized close.
```
Value: L  Effort: M (estimated)  Placement: Reconsider
Evidence basis: transcript-backed
```

### Multilingual email templates for lifecycle surveys
↩ also raised in 2026-W02
Yahoo needs launch/reminder emails in the employee's preferred language. Dependency: Rob's team needs to supply language preference data. Workaround: manual property-level upload (1-week lead time).
```
Value: H  Effort: M (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed
```

### Conditional logic — survey branching (repeated)
↩ also raised in 2026-W03
Raised again: hiring buddy question required branching. Yugi confirmed: conditional attribute-based routing (send different surveys based on attributes like interview round) exists, but within-survey question branching does not.
```
Value: H  Effort: H (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed
```

### Recruiter attribution in candidate lifecycle surveys
Yahoo has contract recruiters who need to be associated with candidate survey scores. The employee lifecycle module doesn't have a "primary recruiter" role — only reporting managers. Candidate lifecycle needs separate documentation and integration.
```
Value: M  Effort: H (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed
```

---

## 2. Problems with Existing Features

### Platform access lost for sub-admin (Dayna, KAG → Yahoo)
Dayna Matusek lost access mid-implementation and couldn't view survey configuration during the call. Login refreshing without success. Resolved offline.
```
Value: M  Effort: L (estimated)  Placement: Quick Win
Evidence basis: transcript-backed
```

---

## 3. What Customers Love

- **Lifecycle survey configuration workflow:** Kate and Dana moved through 5/30/90-day configuration efficiently. The document-based config process (Yugi sending template links) worked well.
- **Email placeholders (employee name, survey end date, unique URL):** Yahoo appreciated being able to customize email body with dynamic tokens.
- **Friday reminder cadence:** Team aligned quickly on Friday reminders for all lifecycle survey waves to mirror existing Glint behavior.
- **Strong CS responsiveness:** Yugi sent email template previews within 2 hours post-call as committed.

---

## 5. Recurring Requests

| Request | This week | Also in |
|---|---|---|
| Conditional logic / branching | 2026-W04 | 2026-W03 |
| Multilingual email templates | 2026-W04 | 2026-W02 |
