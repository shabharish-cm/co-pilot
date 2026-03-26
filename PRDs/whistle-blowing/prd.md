# PRD: Speak Up Module
Always-on anonymous employee reporting, case management, and conversations inbox

Version 1.1  |  CultureMonkey Product  |  Status: Draft  |  Date: 2026-03-24

---

# 1. TL;DR

| Problem |
| :---- |
| Employees have no permanent, trusted channel to surface concerns outside a scheduled survey window — the only options (survey free-text, direct email to HR, verbal escalation) either break anonymity or have no structured follow-through. |
| HR admins have no case inbox: anonymous feedback from surveys flows into Comment Analytics as aggregate themes, not as individual traceable cases with owners, status, and formal closure. |
| The resolution loop is broken: reporters never know if anything happened, eroding trust and depressing future participation. |
| Anonymous conversations initiated via "Initiate Conversation" exist but are invisible in aggregate — there is no module to view all open conversations, making it impossible to manage dialogue at scale. |

| Solution & Expected Impact |
| :---- |
| **Speak Up Module** — a permanently open, employee-initiated intake form (always-on, survey-decoupled) that accepts a concern description and optional file attachments, and generates structured cases in an HR admin inbox. Each case supports anonymous two-way dialogue (repurposing the existing Initiate Conversation mechanism), internal notes, owner assignment, and formal resolution with closure comments. A new **Conversations inbox** surfaces all active anonymous conversations — both from Speak Up cases and existing survey feedback threads — in one place. Expected outcome: measurably higher voluntary concern-reporting rate, structured audit-ready case records with evidentiary attachments, and a closed-loop response experience that builds sustained employee trust. |

---

# 2. Context & Problem Statement

## 2.1 Background

- CultureMonkey's current feedback architecture is HR-initiated and time-gated: Engagement surveys, Pulse surveys, Lifecycle surveys, and eNPS are all launched by admins on a schedule. Employees can only provide structured feedback when a survey is open.
- There is no always-on channel for employees to proactively surface individual concerns — harassment incidents, ethical violations, safety issues, or compensation concerns — independent of a survey cycle.
- The existing "Initiate Conversation" feature in the Feedback module provides anonymous two-way messaging between managers/admins and employees on survey comment cards, but it is anchored to a specific survey comment and is not accessible from a standalone case context. Critically, there is no consolidated view of all open conversations.
- HR teams currently manage individual complaints in email threads, spreadsheets, or external HRIS tools — creating no shared case log, no audit trail, and no pattern detection capability. Attachments submitted via email are untracked and outside the platform.
- The EU Whistleblowing Directive (2021/1937) mandates formal internal reporting channels for organizations with 50+ employees in EU jurisdictions. This creates a compliance-driven purchase vector for CM customers operating in Europe.

## 2.2 Real-World Enterprise Use Cases

- **UC-1 — Harassment with No Open Survey:** An employee at a mid-market retail chain (similar profile to El Cortez/Troon customers) experiences manager misconduct in week 3 of a 4-week survey cycle. No survey is open; the next pulse window is 10 days away. Without Speak Up, the only recourse is a direct email to HR — which fully exposes their identity and risks retaliation.
- **UC-2 — Compliance Audit Readiness:** An HR director at a European subsidiary needs to demonstrate to the works council that the organization operates a compliant internal reporting channel (per EU Directive 2021/1937). The platform needs to show case intake (including supporting documents), case tracking, and formal resolution with timestamps — none of which currently exist in CM.
- **UC-3 — Frontline Worker Safety Concern:** A deskless factory or hospitality worker (verticals CM is actively expanding into — manufacturing, golf/hospitality) witnesses a safety violation and wants to photograph the hazard and attach it to their submission immediately from a mobile browser, not at the next team stand-up.
- **UC-4 — HR Overwhelm at Scale:** An HR BP at a 2,000-person organization receives anonymous concerns across six active pulse surveys, three lifecycle cohorts, and direct email. They have no single inbox. Complaints — including any screenshots or documents attached — are lost, response times are inconsistent, and there is no audit trail of what was actioned.
- **UC-5 — Employer Response Trust Signal:** An employee submits a concern with an attached screenshot. Two weeks later, they don't know if it was read. Systemic silence erodes culture trust scores — the very metric CM is hired to improve.

## 2.3 Customer Feedback & Concerns

- *"We want CultureMonkey to extend beyond surveys into a continuous employee communication tool."* — P8, El Cortez Hotel (hospitality customer, inferred from CS transcript synthesis)
- *"1 in 3 employees say they would only report workplace harassment if they could do so anonymously."* — Traliant survey, via HR Dive (public evidence)
- *"43% of workers fear retaliation if they speak up about misconduct."* — NAVEX Global report (public evidence)
- *"38% of employees who reported harassment were unsatisfied with how it was handled."* — HR Acuity survey (public evidence; the dissatisfaction is a resolution loop problem, not an intake problem)
- *"Employees are 12x more likely to speak up when they know they can do so anonymously."* — v-comply research (public evidence)
- *(Inference — needs validation)* HR admins at enterprise accounts managing 1,000+ employees want a single case management interface inside the platform rather than a separate GRC tool — assumption pending customer validation.
- *(Inference — needs validation)* Customers with EU-based employees may have legal exposure under the EU Whistleblowing Directive and would treat this as a compliance purchase, not a features purchase.

---

# 3. User Stories & Scope

## 3.1 Target Audience

- **Primary:** Employee (individual contributor, frontline worker, or any non-admin user) — submits anonymous concerns with optional supporting attachments via the always-on intake form; receives and responds to HR dialogue via their unique anonymous case link.
- **Secondary:** HR Admin / HR Business Partner — receives cases in the admin case inbox; reviews concern text and any attachments; manages case status, assignment, notes, and formal closure; initiates and manages anonymous dialogue.
- **Tertiary:** Super Admin — configures Speak Up module visibility, manages complaint categories, assigns HR case owners, and controls access permissions.
- **End consumer:** The broader employee population — increased trust in the organization's responsiveness signals that concerns are taken seriously, which feeds back into future engagement and pulse survey scores.

## 3.2 User Stories — Employee (Intake & Dialogue)

| US# | Title | Description | Priority |
| :---- | :---- | :---- | :---- |
| **US.1** | Submit anonymous concern | As an employee, I want to submit a concern anonymously at any time — regardless of whether a survey is open — so that I can surface issues when they occur, not when the calendar allows. | MVP — Must |
| **US.2** | Receive a case reference | As an employee, after submitting a concern, I want to receive a unique case reference number and a private tracking link so that I can check status and receive HR responses without logging into my account. | MVP — Must |
| **US.3** | Categorize my concern | As an employee, I want to optionally select a concern category (Harassment, Ethics, Safety, Compensation, Other) so that HR can route or prioritize it appropriately — without this being required if I prefer not to. | MVP — Should |
| **US.4** | Attach supporting evidence | As an employee, I want to optionally attach files (screenshots, photos, documents) to my concern so that I can provide context and evidence without needing to describe everything in text — while remaining fully anonymous. | MVP — Must |
| **US.5** | Respond to HR anonymously | As an employee, I want to respond to HR's follow-up questions through my anonymous case link so that I can provide more context without ever revealing my identity. | MVP — Must |
| **US.6** | Receive a closure notification | As an employee, when my case is formally resolved, I want to receive an anonymous notification (via email to my anonymous address) confirming that action was taken, so that I know my concern was not ignored. | MVP — Must |
| **US.7** | Submit via mobile browser | As a frontline or deskless employee, I want to access and submit the Speak Up form — including attaching a photo taken on my phone — on a mobile browser without needing to install an app, so that I can report concerns from my phone while on-shift. | MVP — Should |

## 3.3 User Stories — HR Admin (Case Management)

| US# | Title | Description | Priority |
| :---- | :---- | :---- | :---- |
| **US.8** | View case inbox | As an HR admin, I want a dedicated Speak Up case inbox separate from Comment Analytics so that I can manage individual complaints as structured cases, not as aggregate themes. | MVP — Must |
| **US.9** | See case detail with attachments | As an HR admin, I want to open a case and see the full submission text, any attached files, the conversation thread, internal notes, assignment history, and current status in one view so that I have complete context before taking action. | MVP — Must |
| **US.10** | Download case attachments | As an HR admin, I want to download files attached by the reporter so that I can review evidence (screenshots, documents) as part of my investigation. | MVP — Must |
| **US.11** | Assign a case owner | As an HR admin, I want to assign a specific HR team member as the case owner so that accountability is clear and the case doesn't fall through the cracks. | MVP — Must |
| **US.12** | Initiate anonymous dialogue | As an HR admin, I want to initiate an anonymous two-way conversation from within a case so that I can ask follow-up questions without revealing my identity or the reporter's identity. | MVP — Must |
| **US.13** | Add internal notes | As an HR admin, I want to write internal case notes that are never visible to the reporter so that I can document investigation steps, decisions, and conversations with other team members. | MVP — Must |
| **US.14** | Update case status | As an HR admin, I want to update the status of a case (Open → Under Review → Resolved → Closed) so that the case lifecycle is tracked and auditable. | MVP — Must |
| **US.15** | Formally close a case | As an HR admin, I want to close a case with a resolution comment so that the closure is documented and the reporter receives an anonymous notification confirming action. | MVP — Must |
| **US.16** | Filter and search cases | As an HR admin, I want to filter cases by status, category, date submitted, and assigned owner so that I can prioritize and navigate a high-volume inbox efficiently. | MVP — Should |
| **US.17** | Export case audit log | As an HR admin or compliance officer, I want to export a full case audit log (submission, attachments list, dialogue thread, notes, status history, timestamps) so that I can produce records for legal review or regulatory audit. | Phase 2 — Must |
| **US.18** | View all conversations | As an HR admin, I want a single Conversations inbox that surfaces all active anonymous conversations — both from Speak Up cases and from survey feedback comment threads — so that I have a unified view of open dialogue across the platform. | MVP — Must |

## 3.4 User Stories — Super Admin (Configuration)

| US# | Title | Description | Priority |
| :---- | :---- | :---- | :---- |
| **US.19** | Enable / disable Speak Up | As a super admin, I want to enable or disable the Speak Up module for my organization via account settings so that deployment can be controlled and phased. | MVP — Must |
| **US.20** | Manage complaint categories | As a super admin, I want to configure the complaint category list so that it reflects my organization's taxonomy and legal/compliance needs. | Phase 2 — Should |
| **US.21** | Set case access permissions | As a super admin, I want to control which admin roles can view and manage Speak Up cases so that sensitive complaints are only visible to authorized HR staff. | MVP — Should |
| **US.22** | Configure attachment policy | As a super admin, I want to enable or disable attachment uploads and set the permitted file types for my organization so that I can align with internal data handling and legal requirements. | MVP — Should |

## 3.5 Out of Scope (This Release)

- **Identified reporting option (employee chooses to self-identify):** Architecturally complex and creates legal exposure in some jurisdictions — deferred to Phase 3 pending legal input.
- **SLA enforcement and auto-escalation:** Auto-escalation workflows (e.g., HR doesn't respond in 5 days → escalate to super admin) require configurable workflow rules — deferred to Phase 2.
- **Multi-language intake form:** Required for EU compliance mode but out of scope for MVP; deferred to Phase 2.
- **AI-assisted intake structuring:** Pattern detection across cases, AI triage recommendations — deferred to Phase 3; requires a case volume baseline first.
- **Phone/SMS intake hotline:** Out-of-product channel; CLOSED DECISION — not aligned with CM's software delivery model.
- **Third-party GRC system integration (export to Workday, ServiceNow):** Enterprise integration layer; deferred to Phase 3, pending demand signal.
- **Speak Up analytics dashboard (submission trends, resolution SLA, category breakdown):** Deferred to Phase 2 once there is sufficient case volume to make analytics meaningful.
- **Attachments sent by HR back to reporter in conversation thread:** Conversation relay is email-based; supporting file attachments in the HR→reporter direction is deferred to Phase 2 pending relay extension work.

---

# 4. User Experience & Design

## 4.1 Employee Surface — Speak Up Intake Form

Entry point: A persistent "Speak Up" link in the employee navigation sidebar (not inside any survey flow). Accessible via direct URL on mobile browser for frontline workers who do not use a desktop.

- Employee clicks "Speak Up" from navigation or direct URL.
- The form loads with a brief trust statement: what anonymity means, how the system works, and what to expect next (e.g., "Your identity is never shared with anyone at your organization. You'll receive a private link to track your case.").
- **Step 1 — Category (optional):** Employee selects a concern category from a configurable list (default: Harassment, Ethics, Safety, Compensation, Other). Category is optional; employee may skip.
- **Step 2 — Concern description (required):** Free-text area (min 10 characters; max 4,000 characters). Placeholder copy: "Describe what happened, when, and any relevant context. You don't need to include names — focus on the situation."
- **Step 3 — Attachments (optional):** File upload field with drag-and-drop area and "Browse files" button. Permitted types (default): JPG, PNG, PDF, DOCX. Max file size: 10 MB per file. Max files: 5 per submission. Each uploaded file shows a filename chip with a remove (×) button. Copy beneath the upload area: "Files are stored securely and are only visible to your HR team. Uploading files does not affect your anonymity."
- **Step 4 — Submission:** Employee clicks "Submit Concern." System:
  - Uploads attached files to secure storage; associates them with the submission token.
  - Generates a unique anonymous token for this submission.
  - Creates a case record in the HR admin inbox (with attachment references).
  - Sends a platform email to the employee's work email address containing: (a) their unique case reference number, (b) a private anonymous tracking link (token-based, no login required), and (c) instructions for checking status and responding to HR.
- Employee lands on a confirmation screen: case reference number displayed prominently, link to save the tracking URL.

| State / Scenario | Behavior |
| :---- | :---- |
| **Form empty on load** | All fields blank. Category pre-selected to "Select category (optional)." Attachment area shows drag-and-drop target. Submit button disabled until description field has at least 10 characters. |
| **File upload in progress** | Progress bar shown per file. Submit button disabled until all uploads complete or fail. |
| **File upload success** | Filename chip with green checkmark shown. File is ready for submission. |
| **File upload error — invalid type** | Inline error under the file input: "File type not supported. Upload JPG, PNG, PDF, or DOCX only." File is not added to the queue. |
| **File upload error — size exceeded** | Inline error: "File exceeds the 10 MB limit. Please compress or remove it before submitting." File is not added. |
| **Maximum files reached (5)** | Upload button and drag-and-drop area become disabled. Copy: "Maximum 5 files reached." Existing files can still be removed to free a slot. |
| **Mobile browser** | Single-column responsive layout. "Browse files" button uses the native OS file picker, which includes the camera option for direct photo capture. Drag-and-drop degrades gracefully (not available on mobile — browse-only). |
| **Submission in progress** | Submit button disabled; spinner shown. Network timeout after 10 seconds: show error state with retry option. Already-uploaded files are not re-uploaded on retry. |
| **Successful submission** | Confirmation screen: case reference, anonymous tracking link, and "What happens next?" explanation. |
| **Speak Up module disabled for org** | Employee navigating to the URL sees: "Speak Up is not currently available for your organization. Contact your HR team for guidance." — does not expose module existence. |
| **Employee not authenticated** | Form is accessible only to authenticated employees (login required to obtain anonymous token). Login prompt shown if session expired. Note: anonymity is preserved server-side; authentication is the mechanism to generate the token, not to expose identity. |

## 4.2 Employee Surface — Case Tracking (Anonymous Link)

Entry point: Private URL received in confirmation email. Accessible without login (token-based). Works on mobile browser.

- Employee visits their tracking link.
- Page shows: case reference, submission date, current status (Open / Under Review / Resolved), and any messages HR has sent through the anonymous dialogue.
- If HR has initiated a conversation, a reply thread is shown. Employee can type a response and submit — sends an email reply through the anonymous relay, same as the existing Initiate Conversation mechanism.
- If the case is Resolved, employee sees: "This concern has been reviewed and closed. Action has been taken." (Resolution detail is not shared unless HR explicitly includes it in the closure notification.)
- Attachments submitted with the original concern are not re-displayed on the tracking page (to avoid exposing them if the tracking link is shared by accident). A note reads: "Your submitted files have been received by your HR team."

| State / Scenario | Behavior |
| :---- | :---- |
| **Case Open — no HR response yet** | Status: "Open — Your concern has been received and will be reviewed." No messages displayed. |
| **Case Under Review — HR initiated dialogue** | Status: "Under Review." Conversation thread visible. Reply input shown. |
| **Case Resolved** | Status: "Resolved." Resolution notification visible. Reply input hidden. |
| **Invalid or expired token** | "This link is not valid or has expired. If you submitted a concern, check your confirmation email for the correct link." |

## 4.3 HR Admin Surface — Speak Up Case Inbox

Entry point: "Speak Up" navigation item in the HR Admin Dashboard (new top-level module, separate from Feedback/Comment Analytics).

- Inbox displays all cases as a list/card view sorted by date submitted (newest first) by default.
- Each case card shows: case reference number, category (or "Uncategorized"), submission date, current status badge, assigned owner name (or "Unassigned"), a paperclip icon if attachments are present, and a flag if there is an unread message in the conversation thread.
- Filters: Status (All / Open / Under Review / Resolved / Closed), Category, Assigned Owner, Date Range, Has Attachments (toggle).
- Search: by case reference number or keyword in submission text.

| State / Scenario | Behavior |
| :---- | :---- |
| **Empty inbox (no submissions yet)** | Illustration + copy: "No concerns have been submitted yet. When employees use Speak Up, cases will appear here." |
| **Loading cases** | Skeleton card placeholders shown while fetching. |
| **Unread conversation message** | Blue dot indicator on case card. Inbox count badge on navigation item. |
| **Case has attachments** | Paperclip icon shown on case card with file count (e.g., "📎 2"). |
| **Filter applied with no results** | "No cases match your current filters." with clear-filters option. |

## 4.4 HR Admin Surface — Case Detail View

Entry point: Clicking any case card from the inbox.

- **Header:** Case reference, category, submission date, status badge with dropdown to update status.
- **Submission panel:** Full text of the employee's concern. "Show/Hide Submission" toggle (mirrors existing "Show Feedback" pattern from Initiate Conversation).
- **Attachments panel (conditional — shown only when attachments exist):** List of attached files showing filename, file type icon, and file size. Each file has a "Download" button. A banner reads: "These files were submitted by the reporter. Handle in accordance with your organization's data handling policy." No inline preview — download only.
- **Conversation panel:** Thread of all messages exchanged via anonymous dialogue. "Initiate Conversation" button if no conversation started yet; if conversation is active, reply input shown.
- **Assignment panel:** Assigned owner dropdown (lists all HR admin users). Optional due date field (manual; no SLA enforcement in Phase 1).
- **Internal Notes panel:** Private notes field. Notes are time-stamped and attributed to the admin who wrote them. Never visible to the reporter. Append-only log (new note creates new entry; notes cannot be edited or deleted — for audit integrity).
- **Resolution panel:** Visible only when status is set to "Resolved." Resolution comment field (required). Checkbox: "Notify reporter that their concern has been reviewed." (checked by default — sends anonymous closure email via the existing relay mechanism).
- **Audit log panel (collapsed by default):** Full timestamped history: case created, attachments received (count only — no filenames in audit log for privacy), status changes, owner changes, conversation messages sent/received, notes added.

| State / Scenario | Behavior |
| :---- | :---- |
| **Case just submitted — no action taken** | Status: Open. Conversation panel shows "No messages yet — initiate a conversation to follow up." Assignment: Unassigned. Attachments panel shown if files present. |
| **Case with attachments** | Attachments panel rendered below the Submission panel. Each file shows download button. Files are accessible only to admins with case access. |
| **Attachment file unavailable (storage error)** | File row shows "File unavailable — contact support" in place of the Download button. Does not block case management. |
| **Conversation active** | Conversation thread shown. Reply input enabled for HR. Employee's messages show as "Reporter." |
| **Closing a case** | Status dropdown shows "Closed." Resolution comment is required before saving. If "Notify reporter" is checked, system sends anonymous email via relay. |
| **Admin without case access permission** | Case detail view is inaccessible; redirect to inbox with permission error. Attachment files are not accessible either. |
| **Attempting to edit an internal note** | Notes are read-only after saving. New note must be added as a separate entry. |

## 4.5 HR Admin Surface — Conversations Inbox

Entry point: "Conversations" tab within the Speak Up module (or as a top-level navigation item in the HR admin sidebar).

This module surfaces **all active anonymous conversations** across the platform — including:

1. Conversations initiated from Speak Up cases (this feature).
2. Conversations initiated via "Initiate Conversation" from survey Comment Analytics (existing feature).

This closes the current gap where conversations initiated on survey comment cards have no aggregate view.

- List of all open conversation threads, sorted by last message date (newest first).
- Each row shows: case/comment reference, source (Speak Up / Survey name), conversation status (Active / Awaiting Reporter Reply / Awaiting HR Reply / Resolved), last message snippet, assigned admin.
- Filter by: Source (Speak Up / Survey), Status, Assigned Admin.
- Click any row to open the conversation thread view (embedded within the Case Detail for Speak Up; embedded within Comment Analytics for survey-sourced conversations).

| State / Scenario | Behavior |
| :---- | :---- |
| **No conversations yet** | Empty state: "No conversations yet. Initiate a conversation from a case or a comment card to start an anonymous dialogue." |
| **Awaiting HR reply** | Row highlighted. Badge: "Your turn to respond." |
| **Awaiting reporter reply** | Standard row. Badge: "Waiting for reporter." |
| **Resolved conversation** | Shown in resolved filter only; hidden from default active view. |

## 4.6 Accessibility & Copy Guidelines

- All form fields must have associated `<label>` elements. Error messages must be programmatically associated with the relevant input.
- Category dropdown and status dropdowns must be keyboard-navigable (arrow keys + Enter).
- ARIA label required on "Submit Concern" button: `aria-label="Submit your anonymous concern"`.
- File upload area must be keyboard-accessible: `role="button"` with `aria-label="Upload supporting files"`. Keyboard trigger (Enter/Space) opens the native file picker.
- Each uploaded file chip must have an accessible remove button: `aria-label="Remove [filename]"`.
- Conversation thread items must use `role="log"` with `aria-live="polite"` for new message notifications.
- **Copy guideline:** Use "Speak Up" as the module name throughout the platform. Do not use "Whistle-Blowing" or "Whistleblower" in any employee-facing copy — these terms carry fear associations and legal weight. Preferred employee-facing copy: "Speak Up," "Raise a concern," "Submit a concern," "Attach supporting files." Preferred admin-facing copy: "Case," "Concern," "Reporter," "Attachments." Avoid: "Complaint," "Incident report," "Tip," "Evidence."

---

# 5. Detailed Functional Requirements

## 5.1 Anonymous Intake

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR1** | System must generate a unique anonymous token per submission that cannot be reverse-mapped to the employee's identity. | Given an employee submits a concern, when the case is created, then the HR admin inbox shows the case with no identifying employee information (name, email, employee ID, device fingerprint). |
| **FR2** | Submission must be possible only by authenticated employees (login required to obtain token). Token is generated server-side; employee identity is stripped from the case record before storage. | Given an employee is authenticated and submits a concern, when the case record is stored, then no PII linking the case to the employee exists in the case data model. |
| **FR3** | Employee receives a confirmation email to their work email with their case reference number and a unique anonymous tracking link. | Given a successful submission, when the confirmation email is sent, then the email originates from the platform (not from any admin), contains the case reference and a unique token-based URL, and no admin action is required to trigger it. |
| **FR4** | The intake form must be responsive and fully functional on mobile browsers (iOS Safari, Android Chrome). | Given an employee accesses the Speak Up URL on a mobile device, when they complete and submit the form (including file attachments via the native file picker), then the submission is processed identically to a desktop submission. |
| **FR5** | Category field is optional. Submission is valid without a category selection. | Given an employee does not select a category, when they submit the form, then the case is created with category = "Uncategorized" and no error is shown. |
| **FR6** | Employees may optionally attach up to 5 files per submission. Permitted formats: JPG, PNG, PDF, DOCX. Maximum file size: 10 MB per file. Attachment is optional; submission is valid without attachments. | Given an employee attaches 3 files (JPG, PDF, DOCX) each under 10 MB, when they submit, then all 3 files are stored and associated with the case. Given an employee submits with no files, when the form is submitted, then the case is created without error. |
| **FR7** | Files are uploaded to platform-managed secure storage (server-side). The employee's browser receives a per-file upload status; files are only associated with a case upon final form submission. If submission is abandoned, orphaned uploaded files are purged after 24 hours. | Given an employee uploads a file but closes the browser without submitting, when 24 hours pass, then the file is not associated with any case and is purged from storage. |
| **FR8** | Uploaded files must pass a server-side malware/virus scan before being accessible to HR admins. Files that fail the scan are quarantined and flagged in the case with an admin-visible warning. | Given a file submission triggers a positive malware scan, when an HR admin opens the case, then the attachment row shows "File quarantined — could not be verified. Contact security team." The case remains open and manageable. |

## 5.2 Case Management

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR9** | Each submission creates one case record in the HR admin Speak Up inbox. Case record includes: case reference, submission text, category, attachment references (count and storage keys), submitted-at timestamp, status, assigned owner, internal notes log, conversation thread, audit log. | Given a submission is received with attachments, when an HR admin opens the inbox, then a case card appears with all fields populated and a paperclip icon indicating the attachment count. |
| **FR10** | Case status must transition through a defined lifecycle: Open → Under Review → Resolved → Closed. Status can be updated by any HR admin with case access. | Given an HR admin opens a case, when they update the status via the dropdown, then the new status is immediately reflected in the inbox card and audit log with timestamp and admin name. |
| **FR11** | Assigned owner field accepts any HR admin user within the organization. Assignment is optional; unassigned cases remain visible in the shared inbox. | Given an HR admin assigns a case to a team member, when the assignment is saved, then the assignee's name appears on the case card, and the assignee receives an in-platform notification. |
| **FR12** | Internal notes are append-only. Each note is time-stamped and attributed to the admin who wrote it. Notes cannot be edited or deleted. | Given an HR admin adds a note, when it is saved, then it appears in the notes log with the admin's name, timestamp, and full note text, and no edit or delete control is present. |
| **FR13** | Formal case closure requires a resolution comment. The resolution comment is saved to the audit log. | Given an HR admin sets status to "Closed" without entering a resolution comment, when they attempt to save, then an inline validation error is shown: "A resolution comment is required to close this case." |
| **FR14** | When a case is closed with "Notify reporter" checked, the system sends an anonymous closure email to the reporter via the anonymous relay. | Given an HR admin closes a case with the notification checkbox checked, when the case is saved, then an email is sent to the reporter's anonymous relay address within 5 minutes, containing a plain-language confirmation that the concern was reviewed. |
| **FR15** | HR admins with case access can download any attachment associated with a case. Downloads are logged in the case audit log (admin name, filename, timestamp). Admins without case access cannot access attachment storage URLs. | Given an HR admin downloads a case attachment, when the download completes, then the audit log records: admin name, file downloaded, and timestamp. Given a manager-role user attempts to access the attachment URL directly, then a 403 is returned. |

## 5.3 Anonymous Two-Way Dialogue

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR16** | HR admin can initiate an anonymous conversation from within the case detail view using the same email relay mechanism as the existing Initiate Conversation feature. | Given an HR admin clicks "Initiate Conversation" on a Speak Up case, when they compose and send a message, then the reporter receives the message as an email from the platform (not from the admin's personal address), with a reply link that routes back to the case thread. |
| **FR17** | Reporter's email replies surface in the case conversation thread within 60 seconds of receipt. | Given a reporter replies to an HR message via email, when the reply is received by the platform relay, then it appears in the case conversation thread attributed to "Reporter" with timestamp. |
| **FR18** | Neither party's identity is exposed in the conversation thread at any point. HR sees "Reporter" labels; reporter sees "CultureMonkey Support" or equivalent platform alias as the sender. | Given an HR admin and a reporter exchange messages, when either party views the conversation, then no name, email address, or identifying metadata of the other party is visible. |
| **FR19** | HR can send multiple messages in a conversation. Reporter can reply multiple times. The thread is a flat chronological log. | Given an existing conversation thread on a case, when an HR admin sends a follow-up message, then the message is appended to the thread and the reporter's reply link remains valid. |

## 5.4 Conversations Inbox

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR20** | The Conversations inbox aggregates all active anonymous conversation threads from two sources: (a) Speak Up cases, (b) survey comment threads initiated via "Initiate Conversation" in Comment Analytics. | Given an HR admin opens the Conversations inbox, when conversations exist from both sources, then both appear in the same list, each labeled with their source (Speak Up / Survey name). |
| **FR21** | Conversations inbox shows a "response needed" indicator for threads where the last message was from the reporter and HR has not replied. | Given a reporter has replied to a conversation and HR has not responded, when the HR admin views the Conversations inbox, then the thread row shows a "Your turn" badge. |
| **FR22** | Clicking a conversation row navigates the admin to the appropriate context — Case detail view (for Speak Up) or Comment Analytics comment card (for survey-sourced threads). | Given an admin clicks a survey-sourced conversation in the Conversations inbox, when navigation completes, then the admin is in the Comment Analytics view with the relevant comment card and thread in focus. |

## 5.5 Access Control & Permissions

| ID | Requirement Description | Acceptance Criteria |
| :---- | :---- | :---- |
| **FR23** | Speak Up case inbox and case detail views are accessible only to users with the HR Admin role or higher. Survey viewers, managers, and report viewers cannot access the Speak Up module or any attachment files. | Given a manager-role user navigates to the Speak Up URL, when the page loads, then a permission-denied state is shown and no case data is returned by the API. |
| **FR24** | Super Admin can configure which admin roles have access to Speak Up cases. Default: HR Admin and Super Admin only. | Given a super admin opens Account Settings, when they toggle Speak Up access for a role, then the change applies immediately to all users in that role. |
| **FR25** | The Speak Up module can be enabled or disabled globally for the organization via `AccountSetting::ENABLE_SPEAK_UP`. When disabled, the employee intake URL shows a module-unavailable message; the admin inbox is hidden from navigation. | Given an admin disables Speak Up, when an employee visits the intake URL, then the module-unavailable screen is shown and no case data is accessible. |
| **FR26** | Super Admin can configure the attachment policy: enable/disable attachment uploads, and set permitted file types per organization. When attachments are disabled, the upload field is hidden from the employee intake form. | Given a super admin disables attachments for their org, when an employee loads the intake form, then the attachment step is not shown and the form accepts text-only submissions. |

---

# 6. Edge Cases & Error Handling

| State / Scenario | Behavior |
| :---- | :---- |
| **Employee submits multiple concerns** | Each submission generates a separate case with its own token and case reference. The system cannot detect they came from the same employee — by design (anonymity guarantee). HR sees two separate cases. |
| **Employee attaches the same file twice** | Duplicate file detection by filename + size: second upload is rejected with inline copy: "You've already added this file." |
| **Attachment upload fails mid-submission (network error)** | Per-file error shown in the upload area with retry option. If the employee retries and succeeds, the form submission proceeds normally. Partially uploaded files are not associated with the case. |
| **All attachments fail to upload** | Employee can still submit the concern text without attachments. An inline warning is shown: "File upload failed. You can submit your concern without attachments, or try again." |
| **Reporter's anonymous tracking link is lost** | Reporter cannot recover the link without the confirmation email. Platform cannot resend it without breaking anonymity (no employee-to-case mapping stored). Confirmation email instructs reporter to save the link. If truly lost, reporter must submit a new concern. |
| **HR admin attempts to identify reporter** | The case data model contains no PII. No API endpoint returns identifying information. Internal notes and audit log exclude employee identity. Attachment metadata (filename, size) is stored; filenames that could contain PII are the reporter's responsibility. |
| **Speak Up submission with email delivery failure (reporter's email bounces)** | Case is still created and visible in HR admin inbox. Attachment files are still stored. Reporter simply does not receive a confirmation email. |
| **Conversation relay email bounces (reporter's reply fails)** | HR sees a delivery failure notice in the case thread. Case remains open. HR can add an internal note and await further contact. |
| **Case assigned to an admin who is then deactivated** | Case shows previous owner name with "(Inactive)" label. Case is not automatically reassigned; appears in the unassigned/all-cases view for any admin to claim. |
| **Super admin disables Speak Up while cases are open** | Existing cases and their attachments remain visible to HR admins in the admin dashboard. Employee tracking links show module-unavailable message — employee cannot reply. HR can still resolve cases. New submissions are blocked. |
| **Reporter submits via mobile with a slow/intermittent connection** | Submit button disabled during submission to prevent double-submission. Timeout after 10 seconds with retry prompt. If duplicate submission occurs server-side (network retry), the system deduplicates by token within a 30-second window. Already-uploaded attachment files are not re-uploaded on retry. |
| **Malware detected in an attachment** | File quarantined; HR admin sees warning on the attachment row. Case is not blocked. Admin can proceed with the concern text and note the quarantined file in an internal note. |
| **Empty case inbox on first enable** | Empty state shown with onboarding prompt explaining how to share the Speak Up link with employees. |

---

# 7. Competitive & UX Notes

## Competitive Intelligence

- **HR Acuity:** Purpose-built whistleblowing platform. 24/7 anonymous intake (web, phone, email) with file upload, two-way anonymous messaging, integrated case management, compliance analytics. Strong in the GRC/compliance market. Not an engagement platform. CultureMonkey's advantage: employees are already in CM daily; Speak Up is in context, not a separate tool requiring adoption.
- **Whispli:** Anonymous two-way chat, configurable case workflows, file upload support, AI-assisted intake structuring, 70+ languages. Strong for global, multi-language enterprises. Language support is a Phase 2 gap for CM's MVP.
- **FaceUp:** Anonymous two-way messaging, case management, file attachment support, EU Whistleblowing Directive compliant. Strong compliance positioning. CM must reach this standard for EU customers in Phase 2.
- **SpeakUp:** Multi-channel intake (web, mobile, QR code), file uploads, case assignment. QR code access is a useful frontline-worker pattern to consider for Phase 2.
- **Culture Amp / Lattice / Glint:** None offer a standalone speak-up/whistleblowing module natively. This space belongs to standalone GRC tools — CM can close this gap and own it within the engagement platform category.

## Patterns to Adopt

- **Whispli — Trust statement on intake form:** A clear, plain-language explanation of how anonymity works before the form fields appear — including a note that file uploads do not compromise anonymity. Reduces abandonment from skeptical employees.
- **HR Acuity — Case reference number as first-class object:** Every concern gets a human-readable reference number (e.g., SPK-2026-0041) that employees can cite in follow-up communications.
- **FaceUp — EU compliance framing in product UI:** For accounts with EU employees enabled, show a compliance badge ("Compliant with EU Whistleblowing Directive 2021/1937") on the intake form.
- **FaceUp / Whispli — Download-only attachment access for admins:** No inline preview; admins download files to their local environment. This limits platform liability for content rendered inside the app and aligns with enterprise security policies.
- **SpeakUp — QR code intake:** For frontline workers who don't have easy browser access on personal devices, a printable QR code on a physical notice board routes to the Speak Up URL. Deferred to Phase 2.

## Patterns to Avoid

- **Mandatory category selection:** Forces employees to categorize before they can submit, adding friction at the most psychologically difficult moment. Keep category optional.
- **Rich text editor in intake form:** Formatting tools in the concern textarea signal formality and legal weight, increasing anxiety. Plain text textarea only.
- **Inline file preview in admin case view:** Rendering images or PDFs inline creates content liability for the platform and is a security surface. Download-only for attachments.
- **Showing case volume or statistics to employees:** Displaying submission counts on the intake landing page may either intimidate or signal futility. No aggregate stats on the employee-facing surface.

## Differentiation Opportunity

- CultureMonkey can be the first engagement survey platform to natively close the full feedback loop: **structured pulse → always-on speak-up (with evidentiary attachments) → case resolution** — without the employee leaving a single product.
- For EU-regulated customers, Phase 2 EU compliance mode (with attachment support and audit export) positions CM as a **compliance platform**, not just an engagement tool. This changes the buyer profile (legal/compliance decision-makers, not just HR) and the sales motion.

---

# 8. Analytics & Success Metrics

## 8.1 Success Metrics

| Metric | Baseline | Target (90 days post-launch) |
| :---- | :---- | :---- |
| Speak Up submissions per enabled org / month | 0 (new feature) | ≥ 3 submissions per organization (early adopter signal; volume will vary by org size) |
| Attachment usage rate (% of submissions with at least one attachment) | 0 | ≥ 25% of submissions include an attachment (indicates employees are leveraging the feature) |
| Case response rate (HR initiates dialogue within 5 business days) | N/A | ≥ 70% of cases have at least one HR action within 5 business days |
| Case resolution rate (cases formally closed vs. opened) | N/A | ≥ 60% of cases closed within 30 days |
| Reporter anonymous reply rate (reporter responds to HR follow-up) | N/A | ≥ 40% of conversations have at least one reporter reply |
| Conversations inbox adoption (HR admins who open Conversations inbox at least once per week) | 0 | ≥ 50% of HR admins at enabled orgs weekly |
| Feature flag enablement rate (% of eligible accounts that enable Speak Up) | 0 | ≥ 20% of accounts in Phase 1 pilot cohort |

## 8.2 Instrumentation Events

| Event Name | Trigger | Properties |
| :---- | :---- | :---- |
| `speak_up_form_opened` | Employee navigates to the intake form URL | `org_id`, `device_type` (mobile/desktop), `source` (direct_url / nav_link) |
| `speak_up_attachment_added` | Employee adds a file to the upload queue | `org_id`, `file_type`, `file_size_kb`, `device_type` |
| `speak_up_attachment_removed` | Employee removes a file from the upload queue | `org_id`, `file_type` |
| `speak_up_form_submitted` | Employee submits a concern | `org_id`, `category_selected` (boolean), `character_count`, `attachment_count`, `device_type` |
| `speak_up_case_created` | Case record created server-side | `org_id`, `case_id`, `category`, `has_attachments` (boolean), `attachment_count` |
| `speak_up_case_viewed` | HR admin opens a case detail | `org_id`, `case_id`, `admin_role` |
| `speak_up_attachment_downloaded` | HR admin downloads a case attachment | `org_id`, `case_id`, `file_type` |
| `speak_up_case_status_updated` | HR admin changes case status | `org_id`, `case_id`, `from_status`, `to_status` |
| `speak_up_case_assigned` | HR admin assigns a case owner | `org_id`, `case_id` |
| `speak_up_conversation_initiated` | HR admin sends first message in a case thread | `org_id`, `case_id` |
| `speak_up_reporter_replied` | Reporter reply received via email relay | `org_id`, `case_id` |
| `speak_up_case_closed` | HR admin closes a case | `org_id`, `case_id`, `notify_reporter` (boolean), `days_open`, `has_attachments` (boolean) |
| `speak_up_tracking_link_opened` | Reporter visits their anonymous tracking URL | `org_id`, `case_id` (anonymized — no PII attached) |
| `conversations_inbox_opened` | HR admin opens the Conversations inbox | `org_id`, `admin_role`, `open_conversation_count` |

---

# 9. Dependencies

| Dependency | Notes |
| :---- | :---- |
| **Initiate Conversation / Anonymous Email Relay** | The existing anonymous email relay (used by "Initiate Conversation" in the Feedback module) must be extended to support cases originating from Speak Up, not just survey comment cards. Engineering must confirm: (a) no PII metadata is exposed in email headers; (b) the relay scales to case volumes independent of survey cycles; (c) the two-way threading mechanism works without an active survey context. |
| **Anonymous Token Generation Service** | New service required to: generate a unique case token per submission; map token to case ID (not employee ID); serve the anonymous tracking link without session authentication. Must be reviewed by engineering for anonymity guarantee before spec is locked. |
| **Case Data Model** | New database schema required for cases: `case_id`, `org_id`, `anonymous_token`, `category`, `submission_text`, `attachment_keys` (array of storage references), `status`, `assigned_owner_id`, `created_at`, `updated_at`. No `employee_id` or PII fields in this model. |
| **File Storage Service** | New integration required for secure file upload and retrieval (e.g., S3-compatible object storage). Access to attachment objects must be controlled by signed URLs scoped to authorized admin sessions. Orphaned files (from abandoned submissions) purged after 24 hours. Storage lifecycle policy: case attachments retained for the duration of the org's data retention configuration (default: 3 years). |
| **Malware / Virus Scanning** | File scan must run server-side on upload, before files are accessible to HR admins. Positive scan results quarantine the file and flag the case. Engineering to confirm scan provider and acceptable scan latency (target: <30 seconds per file). |
| **Conversations Inbox Aggregation Layer** | New API endpoint required to aggregate conversation threads from two sources: Speak Up cases (new) and survey comment threads (existing Initiate Conversation). Must handle pagination for high-volume orgs. |
| **AccountSetting: ENABLE_SPEAK_UP** | New feature flag — off by default. Enabled per-tenant during phased rollout. Controls: (a) employee intake form visibility, (b) admin inbox visibility, (c) conversations inbox visibility. |
| **AccountSetting: SPEAK_UP_ATTACHMENTS_ENABLED** | Sub-flag (requires `ENABLE_SPEAK_UP`). Defaults to on when Speak Up is enabled. Can be toggled off per-tenant. Controls attachment upload field visibility on the employee intake form. |
| **Notification Service** | Extend existing platform email notification service to: (a) send case confirmation email to reporter on submission; (b) send closure notification to reporter on case close. Both must originate from platform sender address, not any admin's address. |
| **Mobile Responsive Frontend** | Intake form (including the file upload step), anonymous tracking page, and case detail attachments panel must be built responsive-first. Mobile file picker (iOS/Android) used for attachment upload. No React Native or native app work required for Phase 1. |
| **Sub-admin Access Model** | Existing sub-admin access control model (noted as a gap in P14 — Yahoo) may create visibility leakage risks if not scoped correctly for Speak Up. Engineering to validate that case access permissions and attachment URL authorization are both enforced at the API layer, not only the UI layer. |

---

# 10. Rollout Plan

## Phase 1 — MVP (~6 weeks)

- Anonymous intake form for employees (web + mobile browser) including optional file attachment (up to 5 files, JPG/PNG/PDF/DOCX, 10 MB each).
- Server-side malware scan on all uploaded files before HR access.
- HR admin Speak Up case inbox: case list (with attachment indicator), case detail (with attachment download panel), status management, assignment, internal notes, formal closure with reporter notification.
- Anonymous two-way dialogue from case detail (reusing existing email relay mechanism).
- Conversations inbox: unified view of all active anonymous conversations (Speak Up + survey comment threads).
- Rollout gate: `AccountSetting::ENABLE_SPEAK_UP` per tenant — off by default. `AccountSetting::SPEAK_UP_ATTACHMENTS_ENABLED` sub-flag, on by default when Speak Up is enabled.
- Pilot: 3–5 existing enterprise accounts (prefer accounts with active CS relationships; exclude accounts with active EU compliance exposure until Phase 2 validation is complete).
- Pre-pilot: internal dogfood with CultureMonkey HR team.

## Phase 2 — Compliance & Scale (~4 weeks post Phase 1)

- Case audit log export (PDF / CSV) including attachments manifest for compliance and legal review.
- SLA configuration: super admin sets a target response time (e.g., 5 business days); system surfaces overdue cases with visual indicators in the inbox.
- Auto-escalation: unresponded cases auto-assign to a backup owner after SLA breach (configurable).
- Configurable complaint categories: super admin manages the taxonomy.
- EU Whistleblowing Directive compliance mode: multi-language intake form, compliance badge on employee-facing form, required data retention policy confirmation.
- Speak Up analytics tab (admin): submission volume, resolution SLA, category breakdown, response rate, attachment usage rate.
- QR code for intake form: printable QR code for frontline/deskless worker notice boards.
- Attachments in HR→reporter conversation direction (relay extension required).

## Phase 3 — Future (Post v2)

- AI-assisted case triage: category suggestion, duplicate detection, pattern alerting across cases.
- Optional identified reporting: employee may voluntarily self-identify when submitting (gated on legal input per jurisdiction).
- Third-party GRC integration: export case data and attachments to Workday, ServiceNow, or similar HRIS/compliance platforms.
- Speak Up API: allow customers to embed the intake form in their intranet or HRIS portal.
