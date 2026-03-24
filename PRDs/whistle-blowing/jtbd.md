# Jobs To Be Done: Speak Up Module

**Feature:** Speak Up Module (formerly: Whistle-Blowing)
**Date:** 2026-03-24
**Confidence:** Medium (strong public evidence; no direct CM customer transcript signal)

---

### 👤 User Persona & Context

**Persona 1 — The Silenced Employee**
- **Who they are:** An individual contributor or frontline employee who has witnessed or experienced misconduct, unethical behavior, harassment, or safety concerns — but has no trusted, private channel to surface it outside a scheduled survey window.
- **Primary Goal:** Report a concern honestly and safely, without risking identification or retaliation.

**Persona 2 — The Accountable HR Admin**
- **Who they are:** An HR Business Partner or Compliance Officer responsible for maintaining a safe work environment, investigating complaints, and demonstrating that the organization acts on feedback.
- **Primary Goal:** Receive, investigate, and close cases in a structured, auditable, and legally defensible way — while preserving reporter anonymity throughout.

---

### 🎯 Core Jobs To Be Done (JTBD)

**Job 1: Speak Without Fear**
- **Statement:** When *I witness or experience misconduct, harassment, or an ethical violation*, I want to *report it through a channel that guarantees my anonymity*, so I can *raise the issue without risking my job, relationships, or standing in the organization*.
- **Type:** Emotional + Functional
- **Current Workaround:** Employees raise concerns through free-text survey comments (which are tied to a survey cycle and may feel traceable), direct emails to HR (which fully expose identity), verbal complaints to managers (informal, no record), or say nothing at all.
- **Pain Points (The "Push"):** Fear of retaliation is the dominant blocker — 43% of employees don't report because of this. Existing survey channels feel time-gated and not built for individual case reporting. Verbal/email routes destroy anonymity entirely. Most employees default to silence.
- **Supporting Quote:** *"1 in 3 employees say they would only report workplace harassment if they could do so anonymously."* — Traliant survey via HR Dive

---

**Job 2: Know My Voice Mattered**
- **Statement:** When *I've submitted a concern anonymously*, I want to *receive updates on what's happening with my report — without giving up my identity*, so I can *trust that the organization is actually doing something and feel confident speaking up again in the future*.
- **Type:** Emotional + Social
- **Current Workaround:** No mechanism exists. Once an employee submits a survey comment or sends an email, they have no visibility into whether it was read, assigned, investigated, or resolved. The loop is entirely broken.
- **Pain Points (The "Push"):** The resolution loop being broken erodes trust. Employees who reported harassment and were dissatisfied with the handling (38% per HR Acuity) simply disengage. Without closed-loop feedback, future participation drops and culture of silence deepens.
- **Supporting Quote:** *"38% of employees who reported harassment were unsatisfied with how it was handled."* — HR Acuity survey

---

**Job 3: Raise It Now, Not When the Survey Opens**
- **Statement:** When *an issue occurs between survey cycles*, I want to *submit a concern immediately through a permanently available channel*, so I can *address it while it's fresh and relevant — not weeks later during the next pulse window*.
- **Type:** Functional
- **Current Workaround:** Employees wait for the next survey cycle or use out-of-platform channels (Slack to a trusted colleague, email to HR, verbal to a skip-level manager). All of these either break anonymity or have no structured follow-through.
- **Pain Points (The "Push"):** Survey cadence doesn't match the urgency of real workplace incidents. A two-week-old concern submitted in a monthly pulse survey has lost context, emotional immediacy, and actionability. The absence of an always-on channel actively suppresses timely reporting.
- **Supporting Quote:** Indirect — P8 (El Cortez Hotel) wanted CM to extend *"beyond surveys into a continuous employee communication tool."*

---

**Job 4: Manage Cases, Not Just Comments**
- **Statement:** When *I receive an anonymous concern from an employee*, I want to *track it as a structured case with a status, owner, communication log, and formal resolution*, so I can *demonstrate accountability, maintain a compliance audit trail, and respond to cases consistently at scale*.
- **Type:** Functional + Social (HR Admin)
- **Current Workaround:** Survey comment analytics surface themes in aggregate, but not individual traceable cases. HR admins currently manage individual complaints in email threads, spreadsheets, or external HRIS tools — none of which have a shared case log or audit trail.
- **Pain Points (The "Push"):** No structured case ownership means complaints fall through the cracks. No audit trail means compliance risk (EU Whistleblowing Directive requires formal reporting channels for orgs with 50+ EU employees). No case history makes it impossible to detect patterns across complaints.
- **Supporting Quote:** Indirect — P13 (Yahoo) showed enterprise buyers care deeply about *"feedback routing and closed-loop response"* — both are core to this module.

---

### 💡 Feature Opportunities & Implications

- **Opportunity 1 — Always-On Anonymous Intake:** A permanent "Speak Up" entry point (web + mobile browser, QR code for frontline workers) that is decoupled from any survey cycle. The form should offer an optional complaint taxonomy (Harassment, Ethics, Safety, Compensation, Other) to enable routing and analytics without requiring it. Anonymity must be architecturally guaranteed — not just a UI promise.

- **Opportunity 2 — Anonymous Two-Way Case Dialogue:** Repurpose the existing inline email-to-employee mechanism to enable HR to ask follow-up questions and the reporter to respond — without either party learning the other's identity. The employee receives an anonymous reply link; HR sees only the case thread. This closes the "did anything happen?" loop for reporters.

- **Opportunity 3 — Structured Case Management for HR:** A dedicated case inbox (separate from Comment Analytics) where each submission is a case object with: status (Open / Under Review / Resolved / Closed), assigned HR owner, internal notes, and a formal resolution comment. Case history is searchable and exportable for compliance audits.

- **Opportunity 4 — Closed-Loop Resolution Notification:** When HR closes a case, the system sends an anonymous notification to the reporter confirming action was taken (even if the resolution detail is private). This is the single highest-leverage trust signal — employees who know outcomes are reported speak up again.

- **Opportunity 5 — Differentiated Platform Story:** No engagement platform (Culture Amp, Lattice, Glint) natively bundles a speak-up module. CultureMonkey can be the first engagement platform to close the full loop: structured pulse → always-on speak-up → case resolution — without the employee ever leaving a single tool.

---

### ❓ Missing Context (Follow-up Questions)

1. **Anonymity architecture:** How does CM guarantee anonymity end-to-end if the existing inline email mechanism is reused? Does the current implementation expose any identifying metadata (IP, email headers, device fingerprint)? Engineering input required before this is specified as a design assumption.

2. **EU Whistleblowing Directive exposure:** Do any current customers or active pipeline accounts operate with 50+ employees in EU jurisdictions? If yes, this becomes a compliance-driven purchase decision — not a features one — and changes both the sales motion and the minimum viable spec required at launch.

---

### Confidence & Unresolved Assumptions

**Confidence: Medium**

| Dimension | Assessment |
|---|---|
| Problem evidence | High — public data on fear of reporting, underreporting rates, and demand for anonymous channels is extensive and consistent |
| Customer pull | Low — no direct CM transcript signal; this is a proactive product initiative |
| Technical feasibility | Medium — core primitives (anonymous email, action items) exist; gap is case management UI and anonymity architecture |
| Market differentiation | High — no engagement platform competitor offers this natively |
| Regulatory tailwind | Medium — EU Directive is real, but CM's current customer base's EU exposure is unconfirmed |

**Unresolved assumptions:**
- Anonymity is technically guaranteeable using existing CM email infrastructure (needs Engg validation)
- The "Speak Up" naming will be adopted; "Whistle-Blowing" is explicitly avoided in UX copy
- HR admins want case management inside CM — not as a standalone tool (assumption pending customer validation)
- The two-way anonymous chat via existing inline email is sufficient for async dialogue at launch (vs. a purpose-built threaded chat UI)
