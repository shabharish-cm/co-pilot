# Research: Post-Launch Survey Editing

## Problem Framing

Once a CultureMonkey survey is live, admins cannot make any changes without raising a support request with the CultureMonkey team. This applies to everything from fixing a typo to adding a participant. The team commits to fast turnaround, but the dependency creates friction during active survey windows.

The deeper technical constraint: CultureMonkey currently uses **question text as the unique identifier** for a question — not a system-generated numeric or UUID. This means editing question text after launch risks breaking the data linkage between pre-edit and post-edit responses, creating reporting inconsistencies and potentially corrupting historical data.

This document assesses whether this problem is worth solving, what competitors do, and how to approach the technical ID constraint.

---

## Evidence from Transcripts

No separate transcript files found in `pulse/normalized/`. All evidence below is sourced from the business profile (`context/business/business_profile.md`), which synthesises 28 recorded calls from March 2026.

### Direct Signal — P4 (business_profile.md, line 68)

> **P4 — Survey Editing Post-Launch is Vendor-Dependent**
> Raised by: **Brainlabs implementation kickoff (Karthik)**
>
> - Once a survey is live, clients cannot make any edits themselves.
> - Even minor fixes (spelling errors, adding participants) require raising a request with CultureMonkey's team.
> - While the team commits to rapid turnaround (a few hours), this is a trust and agility concern for clients.
>
> *Impact: Medium severity, but creates unnecessary friction during active survey windows. Competitors likely allow minor post-launch edits.*

**Assessment:** Raised on 1 call, classified as Medium in the feature priority table, and placed in the **P1 Near-Term (Q3 2026)** roadmap bucket with a clear scope already defined: "Allow admins to make non-structural edits (labels, typos, participant additions) to live surveys within a defined window (e.g., first 24 hrs) without vendor intervention."

### Broader Context from the Same Dataset

- **Brainlabs** is an active paying customer (transitioning from Culture Amp) with known friction around platform autonomy — P3 (Lifecycle Trigger self-service) and P4 (post-launch editing) both reflect the same pattern: clients want control without vendor hand-holding.
- **No other customers** raised post-launch editing unprompted, suggesting it is a real but not widespread acute blocker — it surfaces at implementation kickoff when clients are testing the platform's operational flexibility.

---

## Evidence from Public Discussions

Web searches returned no Reddit/G2/Capterra community threads specifically complaining about inability to edit live surveys in employee engagement platforms. This is a meaningful signal: it is a **table-stakes usability expectation**, not a loudly debated feature request. Users assume it works; frustration surfaces during onboarding and implementation calls rather than public forums.

The clearest public signal found was in survey platform help documentation (QuestionPro, Alchemer, Qualtrics), which reveals how the industry handles this technically.

---

## Competitor Patterns

### Qualtrics
- Has a dedicated community thread: ["What happens to my data when I edit an active survey"](https://community.qualtrics.com/survey-platform-before-march-2021-56/what-happens-to-my-data-when-i-edit-an-active-survey-13809)
- Qualtrics uses **internal question IDs (QIDs)** separate from question text. Editing the display text of a question does not create a new column in the data set.
- Minor edits (spelling, punctuation) are explicitly supported without data impact.
- Structural edits (adding/removing answer options, changing question type) are warned against — they affect how prior responses are recorded.
- Source: Qualtrics Experience Community

### QuestionPro
- Maintains a dedicated help article: ["Deleting / Editing Questions / Answers in a live Survey - Implications and Issues"](https://www.questionpro.com/help/editing-live-survey.html)
- Their architecture separates **Question ID (QID)** from question text — changing the QID on a live survey creates a new column in the database, and old data may be **unrecoverable**.
- Editing display text is safe as long as the QID is unchanged.
- Bottom line: their system is built to allow text edits safely, but warns strongly against structural ID changes.
- Source: QuestionPro Help

### Alchemer (formerly SurveyGizmo)
- Has a dedicated help article: ["Editing a Live Survey"](https://help.alchemer.com/help/make-survey-edits)
- Explicitly documents which edits are safe vs. unsafe when a survey is live.
- Uses **Custom Reporting Values** — these are the persistent identifiers for answer options, decoupled from the visible label. Admins can edit the visible text while leaving the reporting value intact.
- This is the most directly applicable pattern for CultureMonkey's ID constraint.
- Source: Alchemer Help

### SurveyMonkey / Typeform
- Both allow admins to edit live surveys (question text, add/remove respondents) with in-product warnings.
- Neither was found to use question text as a primary identifier — both use auto-generated internal IDs.

---

## Recurring Complaints or Workarounds

| Pattern | Evidence Type |
|---|---|
| Vendor-dependent edits create trust erosion and support overhead | Transcript-backed (Brainlabs, P4) |
| Clients expect minor post-launch edit capability as table stakes | Inferred from competitor documentation (Qualtrics, Alchemer, QuestionPro all built dedicated help pages for this) |
| Question text as unique ID is a structural risk for any editing feature | Public discussion (QuestionPro explicitly warns: changing QID on live survey can cause irretrievable data loss) |
| Decoupling display label from reporting identifier is the established industry fix | Public discussion (Alchemer's Custom Reporting Values; Qualtrics' internal QID system) |

**The workaround CultureMonkey currently deploys:** Admin submits request → CS/ops team makes the edit on behalf of the client within a few hours. This works at low scale but creates support debt as the customer base grows.

---

## Technical Constraint: Question Text as Unique ID

This is the central engineering risk for implementing this feature.

**Current state:** CultureMonkey identifies questions by their text content, not a system-generated ID. Allowing admins to edit question text post-launch would:
1. Break the data join between pre-edit and post-edit responses
2. Effectively create a "new" question in the analytics layer, splitting the response timeline
3. Corrupt trend analysis, benchmarking, and AI sentiment summaries that reference the question

**Industry-standard solution:** All major platforms (Qualtrics, QuestionPro, Alchemer) decouple the **internal question identifier** (immutable, system-generated) from the **display text** (editable). The identifier is what the data layer joins on; the text is purely a presentation layer concern.

**Required prerequisite:** Before enabling post-launch editing, CultureMonkey must migrate to a proper question UUID/integer ID system. Every question created from that point forward gets an immutable ID at creation time. Existing surveys would require a backfill migration.

**Scope split this implies:**
- `Safe edits (low risk)`: Adding participants, changing survey close date, editing reminder cadence — none of these touch question structure
- `Text edits (requires ID migration)`: Fixing typos in question labels, editing answer options — safe only after the ID layer is rebuilt
- `Structural edits (high risk, scope out)`: Adding/removing questions, changing question type — should remain restricted even post-migration, as they break data comparability

---

## Confidence Rating

**Medium**

- The customer pain is confirmed and transcript-backed, but raised by only one customer on one call (Brainlabs).
- The feature is classified as Medium priority in CultureMonkey's own analysis and slotted for Q3 2026 — this research is consistent with that positioning.
- The technical constraint (question text as ID) is not confirmed by engineering — it is inferred from the product manager's note in the arguments and consistent with how the platform behaves. Engineering validation is needed before scoping.
- Competitor evidence shows this is a solved problem with known patterns, which de-risks the implementation significantly.

---

## Open Questions

1. **Engineering confirmation needed:** Is question text truly the only unique identifier for questions in the data model? Or is there already an internal ID that simply isn't exposed? This changes the implementation cost significantly.

2. **Scope of "safe" edits:** What edits should be allowed without any ID migration? Adding participants and changing close dates are clearly safe. Are question label edits in scope for the first release, or deferred until after the ID migration?

3. **Edit window:** The roadmap note suggests a "first 24 hrs" window. Is this a product decision or an engineering constraint? Does a time-gated edit window actually protect data integrity, or does it just reduce the frequency of the problem?

4. **Audit trail:** If an admin edits question text post-launch, what is logged and who can see it? Enterprise clients (Yahoo, KAG) will ask about this.

5. **Breadth of demand:** Only Brainlabs raised this. Is this because other clients don't care, or because they haven't hit the friction point yet (most are pre-launch or early in their lifecycle)?

6. **Participant addition flow:** Adding participants post-launch seems like the most frequent and least risky edit. Could this be shipped independently as a quick win before the broader editing feature is built?
