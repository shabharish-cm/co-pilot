# /feedback — Extract Feedback from Customer Emails

## Purpose
Parse a customer email (or email thread) and extract structured product feedback: account, feature area, verbatim customer quote, signal classification, urgency, and value-effort scoring. Save to the customer's context file and optionally create a Todoist task.

## Model
- **Sonnet** throughout. Sequential steps. No background agents.

## Inputs (provide one)
1. **Gmail message ID or URL** — fetched via Gmail MCP
2. **Pasted email content** — passed inline after the command

## Step 1 — Fetch or read the email

**If a Gmail message ID or search query is provided:**
Use `gmail_read_message` or `gmail_search_messages` + `gmail_read_thread` to retrieve the full thread.
Prefer the thread view — context from prior messages often clarifies the request.

**If content is pasted inline:**
Use it directly. Strip quoted reply chains; focus on the most recent message unless prior context is relevant.

## Step 2 — Identify the account

Extract the account name from:
1. Email domain (e.g. `kag.com` → Keenan Auto Group)
2. Sender name or company field
3. Any explicit mention in the email body

Check if `context/customers/<Account>/` exists. If it does, read all files there for prior signal history before proceeding.
If the account cannot be determined, ask once then stop.

## Step 3 — Extract signals

For each distinct product signal in the email, extract:

```
Signal N
─────────────────────────────────────────────────────
Account:        <Account Name>
Date:           <YYYY-MM-DD from email header>
Feature area:   <Canonical feature name from product glossary>
                  (Raw customer term: "<what they said">)
Type:           [Bug / Complaint | Feature Request | Enhancement | Positive Signal]
Urgency:        [Blocking | High | Medium | Low]
  Indicators:   <words/phrases that signal urgency — e.g. "can't launch", "urgently need">
Verbatim quote: "<exact sentence(s) from the email, unchanged>"
JTBD reframe:   "When I [situation], I want to [motivation], so I can [outcome]."
Recurrence:     <↩ also in pulse YYYY-WW | First seen>
```

**Feature area normalization rules:**
- Map customer language to the canonical product glossary in CLAUDE.md (Survey Builder, Heatmap, Comment Analytics, etc.)
- If no canonical term fits, use the customer's language and flag: `[Unclassified — add to glossary?]`
- Never paraphrase the verbatim quote. Preserve grammar, capitalization, and punctuation exactly.

**Urgency detection heuristics:**
- Blocking: "can't", "broken", "not working", "urgent", "escalation", "affects launch"
- High: "need this soon", "waiting on this", "customers are asking"
- Medium: "would be helpful", "is it possible", "noticed that"
- Low: "eventually", "nice to have", "whenever you get a chance"

## Step 4 — Value-effort score each signal

Apply only to Bug / Complaint and Feature Request / Enhancement signals:

```
Value: [H/M/L]  Effort: [H/M/L]  Placement: [Quick Win | Strategic Bet | Reconsider | Avoid / Defer]
Effort is always marked as estimated.
Evidence basis: [email-backed]
```

Value dimensions: Revenue influence · Account importance · Frequency across calls · Retention impact · Strategic alignment
Effort dimensions: Implementation complexity · Cross-team dependency · Architecture impact · Data/model dependency · UI/UX complexity

## Step 5 — Check recurrence

Scan `pulse/master/customer-pulse-master.md` for the same feature area + signal type.
Mark each signal: `↩ also raised in YYYY-WW` or `First seen`.

## Step 6 — Show structured preview

Display all extracted signals (Step 3 format + Step 4 scores) for review before writing anything.
Ask: "Save to customer context and create task(s)? [Y/n]"
If the user confirms or does not respond within the turn, proceed.

## Step 7 — Write to customer context

Append to `context/customers/<Account>/pulse-signals.md`:

```markdown
## YYYY-MM-DD (Email)
**Subject:** <email subject>
**From:** <sender name>

- **<Feature area>** — [<Type>] [<Urgency>]
  > "<verbatim quote>"
  JTBD: When I [situation], I want to [motivation], so I can [outcome].
  Score: Value: H/M/L · Effort: H/M/L (estimated) · Placement: <quadrant>
  <↩ recurrence note or "First seen">
```

If the file does not exist, create it. Never overwrite existing entries — append only.

## Step 8 — Todoist task (optional)

If urgency is Blocking or High, offer to create a Todoist task automatically.
For Medium/Low, ask before creating.

Task title format: `[<Account>] <Feature area>: <one-line summary>`
Apply routing from CLAUDE.md:
- CS team mentioned → CS Requests
- Engineering work implied → Engg asks
- Default → Features

Run `/add` with the composed title and let routing logic determine section and priority.

## Step 9 — Confirm and report

After writing, output:

```
Feedback logged
─────────────────────────────────────────────
Account:    <Account>
Signals:    <N> extracted
File:       context/customers/<Account>/pulse-signals.md
Task:       <created / skipped>
```

Do not commit. The user or the nightly sync will handle git.

---

## Rules
- Never paraphrase verbatim quotes. Exact words only, in quotation marks.
- Never fabricate account names. If uncertain, ask.
- Feature area must be a canonical glossary term or flagged as unclassified.
- Urgency must be supported by specific language in the email — note the indicators.
- JTBD reframe is always present, even for bugs (frame it as what the customer was trying to do).
- Effort scores are always labeled "estimated".
- Do not create tasks for Positive Signal type without explicit user request.
- If multiple signals exist in one email, number them and score each separately.
- Preserve the sender's emotional tone in the urgency assessment — an account threatening to churn is Blocking regardless of technical severity.
