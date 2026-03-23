# Jobs To Be Done: Non-Desk Workforce Accessibility

**Date:** 2026-03-22
**Source:** `PRDs/non-desk-workforce-accessibility/research.md`
**Confidence:** High

---

### 👤 User Persona & Context

- **Who they are:** HR Administrators and People Ops leads managing large frontline, deskless, or field workforces — drivers (KAG), factory floor staff (VPG), hospitality/shift workers (Warner Hotels), ship crew (BSM), and healthcare aides (Cascade). Typically managing 500–8,000 employees across multiple locations or shifts, many of whom have no corporate email, shared devices, and varying digital literacy.
- **Primary Goal:** Run meaningful engagement surveys that actually reach their frontline workforce — not just the desk-based minority — and generate analytics that reflect the whole company, not just those with inboxes.

---

### 🎯 Core Jobs To Be Done (JTBD)

**Job 1: Reach Workers Who Have No Email**
- **Statement:** When *I launch an engagement survey for my driver or factory workforce*, I want to *distribute the survey using a phone number or physical touchpoint instead of a corporate email*, so I can *get a representative response rate from my entire workforce, not just office staff*.
- **Type:** Functional
- **Current Workaround:** Printed QR codes at workstations, or generic links sent via WhatsApp/SMS as reminders — but the survey itself still requires a web session and there's no clean phone-number-as-identity path.
- **Pain Points (The "Push"):** Drivers, field staff, and factory workers simply don't have corporate email accounts. QR codes require physical proximity and someone to manage the printouts. Response rates from this segment are near-zero via email-only distribution. The $40K/yr KAG account is structurally unable to survey their core driver population today.
- **Supporting Quote:** *"No email for drivers"* — KAG business profile; *"I predominantly wanted to test out SMS and WhatsApp first before we do the emails in terms of reminders"* — Troon (Jan 14 transcript)

---

**Job 2: Let Shared-Device Workers Submit Anonymously Without a Personal Login**
- **Statement:** When *a frontline worker steps up to a shared kiosk or tablet during a break*, I want to *let them enter a simple identifier, complete the survey, and return the device to a clean state*, so I can *collect their individual feedback without requiring a personal login or leaving any trace of their session on the device*.
- **Type:** Functional + Emotional
- **Current Workaround:** Generic link or browser kiosk mode — but session state can persist, OTP creates an anonymity perception problem, and there is no standardised "kiosk mode" in the survey launch UI. Admins use a combination of backend flags (`SKIP_PASSCODE_VERIFICATION`) not exposed in the UI.
- **Pain Points (The "Push"):** Workers are sceptical that OTP verification means they can be tracked — this perception alone suppresses honest feedback. *"If you use a verification code, I will send an OTP to their email. Then they might have the feeling, okay, it's not an anonymous survey, they can be tracked"* (Troon). Peakon's PIN-based kiosk is the known benchmark; Garrett explicitly expects this in CM. Shared tablets cannot be used with individual logins.
- **Supporting Quote:** *"They might have the feeling, okay, it's not an anonymous survey, they can be tracked"* — Troon (Jan 14 transcript); Garrett TAM signal: used Peakon kiosk mode, wants equivalent in CM.

---

**Job 3: Send Survey Reminders at the Right Time for Shift-Based Schedules**
- **Statement:** When *I'm running a survey across multiple shifts and time zones*, I want to *schedule reminders within specific time windows aligned to when workers are actually accessible*, so I can *maximise response rates without interrupting workers mid-shift or sending reminders to night-shift workers at 9am*.
- **Type:** Functional
- **Current Workaround:** Single launch window and generic reminder timing — admins cannot define send windows by shift. Manual workaround is to stagger separate survey launches per shift, which fragments analytics.
- **Pain Points (The "Push"):** Survey open/close windows do not match when workers are actually reachable. A 9am reminder is invisible to night-shift workers and actively annoying to factory floor staff mid-shift. No shift-aware controls exist today.
- **Supporting Quote:** Warner Hotels (business profile) — shift-based workforce explicitly flagged; *"Recurring" survey reminders* discussed in multiple TAM accounts as insufficient for non-standard schedules.

---

**Job 4: Configure Verification Differently Across Countries or Surveys Without Compromising the Entire Account**
- **Statement:** When *my workforce spans multiple countries with different telecom infrastructure and compliance requirements*, I want to *set authentication method per survey or per location*, so I can *meet compliance in one country while still reaching workers in another where SMS OTPs simply don't work*.
- **Type:** Functional
- **Current Workaround:** Platform-wide OTP setting forces a lowest-common-denominator choice — either disable OTP for everyone (loses identity assurance) or require it everywhere (breaks countries where SMS infrastructure is absent).
- **Pain Points (The "Push"):** Alumil needs email OTP for one country and no SMS OTP for another due to carrier infrastructure gaps. A single global toggle forces a bad compromise that either violates compliance or makes the survey unreachable for a segment of the workforce.
- **Supporting Quote:** *"Per-survey verification settings — email OTP for one country, no SMS OTP for another (SMS infra issues)"* — Alumil TAM signal.

---

### 💡 Feature Opportunities & Implications

- **Opportunity 1 — SMS as Primary Delivery (not just reminder):** Allow phone number (imported from HRIS) as a standalone survey distribution target. Worker receives an SMS with a one-tap link, completes the survey in a mobile browser with no login, and their response is attributed via their phone number. Directly unblocks KAG's driver segment and all no-email frontline accounts. This is the single highest-leverage unlock relative to effort.

- **Opportunity 2 — First-Class Kiosk Mode in Launch UI:** Surface the existing backend kiosk flags as a named "Kiosk Mode" option in the survey launch flow. Config options: identity field (employee ID / location code / anonymous), session auto-reset after submission, optional PIN. Positions CM on par with Peakon's known benchmark without new infrastructure.

- **Opportunity 3 — Per-Survey Auth Configuration:** Move OTP/verification settings from account-level to survey-level. Options: email OTP / SMS OTP / employee ID only / none. Preserves compliance flexibility for multi-country accounts (Alumil) and removes the need to compromise the entire account for one country's infrastructure gap.

- **Opportunity 4 — Shift-Aware Reminder Scheduler:** Add shift window fields to the reminder scheduling UI — allow admins to define time-of-day ranges for reminder delivery, separate from the survey open/close window. Medium effort, high perceived value for hospitality, logistics, and manufacturing accounts.

- **Opportunity 5 — Input Normalisation (Quick Win):** Strip whitespace and normalise formatting from employee ID and phone number fields before validation — not after. A near-zero-effort change that fixes WHML's 20-char employee ID errors and phone number delivery failures immediately.

---

### ❓ Missing Context (Follow-up Questions)

1. **Identity continuity on shared devices:** When a worker enters their employee ID at a kiosk and submits, is the goal to deduplicate (prevent re-submission) or purely anonymous (anyone can submit once per device session)? The answer determines whether kiosk mode needs any server-side identity tracking at all — which has significant implications for the "anonymity perception" problem.

2. **SMS attribution and two-way tracking:** If phone number becomes a standalone distribution identity (no email), does the platform currently have infrastructure to attribute an inbound SMS response to a specific employee record — or does attribution only work via a unique link token in the SMS message? This determines whether this is a channel enhancement or a new identity architecture.

---

### Confidence & Unresolved Assumptions

**Confidence:** High — all four primary JTBDs are grounded in named account evidence (KAG, Troon, Alumil, Garrett, WHML). No jobs were inferred without transcript or TAM backing.

**Unresolved Assumptions:**
- It is assumed that phone number is available (or can be imported) as an HRIS field for SMS-only workers — unconfirmed (OQ1 in research.md).
- It is assumed the kiosk backend flags (`SKIP_PASSCODE_VERIFICATION`, `ENABLE_EMPLOYEE_ID_IN_OTP_SURVEY_FORM`) are functional and stable enough to surface in UI — unconfirmed (OQ3 in research.md).
- Per-survey auth migration assumes no breaking change to existing account-level configurations — backward-compatibility path unknown (OQ8 in research.md).
