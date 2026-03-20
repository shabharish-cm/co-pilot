# Research: Non-Desk Workforce Accessibility

**Date:** 2026-03-19
**Scope:** How to improve survey reach for frontline, deskless, and field workers beyond QR codes.

---

## Problem Framing

CultureMonkey already supports QR codes, kiosk mode, WhatsApp, SMS, and email — a stronger multi-channel foundation than most competitors. However, the deskless workforce problem is not just about delivery channel. The deeper barriers are:

1. **No corporate email** — drivers, factory workers, retail staff, healthcare aides often have no work email address
2. **Shared devices** — workers share tablets, terminals, or kiosk screens; individual logins are impractical
3. **Shift patterns** — survey windows may not align with when workers are actually accessible
4. **Low digital literacy** — complex login flows, long surveys, or jargon-heavy questions reduce completion
5. **Language** — multilingual workforces are the norm in manufacturing, hospitality, logistics, and healthcare
6. **No downtime** — frontline workers can't step away from a production line or patient room to complete a survey

CultureMonkey's current QR/kiosk approach covers physical access. The gap is in **personalisation, completion rates, and identity verification** without requiring email or app login.

---

## TAM-Sourced Customer Signals (2026-03-19)

| Account | Signal | Feature Area |
|---|---|---|
| **Garrett** | Used kiosk mode in Peakon — wants equivalent in CM | Kiosk as first-class delivery channel |
| **Alumil** | Per-survey verification settings — email OTP for one country, no SMS OTP for another (SMS infra issues) | Survey-level auth config (not platform-wide) |
| **WHML** | Employee ID input errors (20-char IDs hitting validation); phone numbers with spaces (`91 9888435654`) failing | Input normalisation — trim/sanitise before validation |
| **BSM** | Ship workers — no email, no employee ID, no smartphone, scarce internet | Zero-identity group survey access (vessel as survey unit) |

---

## Evidence from Transcripts

### Troon — Jan 14, 2026 (`2026-01-14-transcripts.json`)
- Karthik Rao shared a generic link + QR code alongside the survey launch for club staff without direct email access
- SMS and WhatsApp tested as reminder channels before email: *"I predominantly wanted to test out SMS and WhatsApp first before we do the emails in terms of reminders"*
- OTP via email raised an anonymity concern: *"If you use a verification code, I will send an OTP to their email. Then they might have the feeling, okay, it's not an anonymous survey, they can be tracked"* — this is a trust barrier specific to non-desk workers who are often more sceptical of management surveillance

### KAG / Keenan Auto Group — Jan 29, 2026 (`2026-01-29-transcripts.json`)
- Multi-channel delivery tracking discussed: ability to see response counts per channel (email vs SMS vs Teams)
- Business profile notes: **"No email for drivers"** — KAG's driver workforce ($40K/yr account) cannot be reached via email at all, making QR/SMS the only viable channels

### Cascade Eye & Skin — Mar 18, 2026 (`2026-03-18-transcripts.json`)
- Sunil presented the full channel stack to a new prospect: *"We send these surveys via email, text messages, we're on Microsoft Teams, we're on QR code, we're on kiosk code. So truly, multiple ways that you can do this for your employees"*
- Multilingual survey raised as a follow-up question for their clinical workforce

### Business Profile — Supporting accounts
- **AWP Safety** (7,782 employees, field services, $55K/yr evaluating) — explicitly flagged as "frontline focus"
- **VPG Group** (2,200, manufacturing, $20K/yr) — first-ever survey, field workforce
- **Keenan Group** (8,000, transport/logistics, $40K/yr) — no email for drivers
- **Warner Hotels** (3,500, hospitality, £25K/yr) — shift-based workforce
- **Multi-Channel Delivery** listed as a top competitive differentiator: *"especially valued for frontline/blue-collar workforces (AWP, VPG, Keenan Group). Seen as a genuine capability competitors lack"*

---

## Evidence from Public Discussions

- **SMS dramatically outperforms email for deskless workers**: 40–50% response rate vs 5–30% for email; 98% SMS open rate within minutes. No app download or portal login required. Works on any phone including basic handsets. (Source: Yourco — https://www.yourco.io/blog/automated-survey-platforms)
- **Only 3 in 10 UK frontline workers** have a way to share feedback with their organisation — the engagement gap is a structural access problem, not a willingness problem. (Source: Perceptyx — https://blog.perceptyx.com/how-to-successfully-survey-your-deskless-workforce)
- **Web-first platforms fail frontline teams**: Culture Amp, Qualtrics, and Lattice are built for knowledge workers; adoption barriers in manufacturing, retail, and field ops are well-documented. (Source: G2 — https://learn.g2.com/frontline-employee-engagement)
- **Technology must be as easy as social media** — complex login flows are the single biggest drop-off point for deskless survey completion. (Source: CultureMonkey blog — https://www.culturemonkey.io/employee-engagement/worker-engagement-through-text-message-surveys/)

---

## Competitor Patterns

| Platform | Deskless Approach | Gap |
|---|---|---|
| **Culture Amp** | Web + mobile app | No QR/kiosk/SMS. App requires login. Weak for no-email workforces |
| **Qualtrics** | Email + SMS (enterprise tier) | Complex, expensive; no kiosk mode |
| **Lattice** | Web-first | Known adoption barrier for deskless; no frontline-specific mode |
| **Yourco** | SMS-only, no app required | Specialised — narrow channel; no analytics depth |
| **Connecteam** | Mobile app, direct messaging, shift-aware reminders | App install required; not survey-depth focused |
| **HubEngage** | Push + SMS + WhatsApp + Teams + Slack + digital signage | Comms-heavy; survey depth secondary |
| **Staffbase** | Voice messaging, multilingual, app | Enterprise; costly; not HR-analytics native |
| **Beekeeper** | Mobile-first, offline support, shared device mode | Comms platform; limited engagement analytics |

**CultureMonkey's current position is strong** relative to HR-native competitors (Culture Amp, Qualtrics). The gap is relative to specialist deskless platforms (Yourco, Connecteam, Beekeeper) which are simpler but lack CM's analytics depth.

---

## Recurring Complaints / Workarounds

| Problem | Workaround in use | Better solution |
|---|---|---|
| No corporate email | QR code printout at station | QR + SMS (phone number as identity) |
| Shared device | Generic link / kiosk | Session-less kiosk with employee ID entry |
| Survey too long | Admin manually shortens | Adaptive survey length (pulse = 3–5 Qs) |
| Low literacy / language | Manager reads questions aloud | Multilingual + audio playback per question |
| Shift mismatch | Single launch window | Time-zone + shift-aware reminder scheduling |
| OTP feels non-anonymous | Skip OTP (lower identity assurance) | Passcode-free, employee-ID-only verification |
| No smartphone | Paper form + manual entry | Missed entirely today |
| SMS OTP not available in some regions | Platform-wide OTP disabled (affects all locations) | Per-survey auth config (Alumil) |
| Employee ID / phone formatting errors | Manual correction by admin | Input normalisation — trim whitespace, strip spaces from phone numbers (WHML) |
| No email, no employee ID, no smartphone | Not reached at all | Vessel/location as survey unit + proxy submission (BSM) |

---

## Opportunities Beyond QR (Prioritised)

### 1. SMS as a First-Class Survey Channel *(High value, currently partial)*
SMS already exists but is primarily used as a reminder, not as the primary survey delivery mechanism. Workers with a phone number but no email should be able to receive the survey link directly via SMS, complete it in a mobile browser with no login, and have their response attributed without email. This directly addresses KAG's driver workforce problem.

**Improvement:** Allow phone number (from HRIS) as a standalone distribution target — no email required.

### 2. Shift-Aware Reminder Scheduling *(High value, medium effort)*
Surveys sent at 9am are invisible to night-shift workers and factory floor staff who are mid-shift. Reminder scheduling should allow admins to define send windows by shift or time-of-day — separate from the survey open/close window.

**Improvement:** Add shift/time-window configuration to the reminder scheduler.

### 3. Employee-ID Kiosk Mode (Session-less) *(High value, already partially built)*
The platform has OTP and passcode flags (`ENABLE_EMPLOYEE_ID_IN_OTP_SURVEY_FORM`, `SKIP_PASSCODE_VERIFICATION`). A true session-less kiosk mode would let a worker type their employee ID, complete the survey, and return the device to a neutral state — no login, no cookie, no session persistence.

**Garrett (TAM signal):** Explicitly used Peakon's kiosk mode — expects equivalent in CM. Peakon's kiosk is a well-known benchmark (PIN-based entry, shared device, auto-reset after submission).

**Improvement:** Surface this as a first-class "Kiosk Mode" in the survey launch UI, with configurable identity field (employee ID, location, or anonymous).

### 3b. Per-Survey Verification Settings *(High value, medium effort)*
Currently authentication (OTP via email/SMS) is configured platform-wide. Multi-country accounts need different auth per survey or per location — some countries require email verification for compliance; others cannot receive SMS OTPs due to carrier infrastructure gaps.

**Alumil (TAM signal):** One country requires email OTP; another cannot receive SMS OTPs at all — a single global setting forces a bad compromise.

**Improvement:** Move auth settings from account-level to survey-level (or at minimum, per-country toggle). Options: email OTP / SMS OTP / employee ID only / no verification. Respects regional compliance and infrastructure constraints without compromising the entire account.

### 3c. Input Normalisation for Employee ID and Phone Number *(Quick win, low effort)*
Employees entering their employee ID or phone number naturally include formatting — spaces, country code prefixes with spaces (e.g. `91 9888435654`), or trailing spaces on fixed-length IDs. The platform currently rejects these as invalid rather than normalising them.

**WHML (TAM signal):** 20-character employee IDs hitting validation errors; phone numbers with spaces failing delivery.

**Improvement:** Sanitise inputs before validation — strip leading/trailing whitespace from employee IDs, strip all spaces from phone number fields, then validate. A 2-line fix with high impact on import success rates.

### 3d. Zero-Identity Group Survey Access *(Medium value, high effort — new territory)*
The most extreme end of the non-desk spectrum: employees with no email, no employee ID, no smartphone, and scarce internet (e.g. ship workers, remote mining crews). Individual identification and delivery is impossible. The solution is to shift the survey unit from individual to group.

**BSM (TAM signal):** Ship workers with none of the standard identifiers. Currently unreachable.

**Improvement (two tiers):**
- **Proxy/batch submission** — A designated rep (captain, union officer, HR) collects responses verbally or on paper and enters them via an admin "batch entry" interface tagged to vessel/location. No individual ID required. Low engineering effort.
- **Offline kiosk + sync** — A PWA-based survey on a shared ship terminal, caches responses locally, syncs at next port call or satellite window. Higher effort but self-serve. Combines with Opportunity 6 (Offline Mode).

### 4. Multilingual Audio Playback *(Medium value, high effort)*
For workers with low literacy or those operating in their second language, reading survey questions is a barrier. Audio playback (text-to-speech per question) per the device language removes this barrier entirely. Staffbase already offers voice messaging.

**Improvement:** Per-question audio playback using browser TTS or pre-recorded clips, tied to the survey language setting.

### 5. WhatsApp as Native Survey Delivery *(High value, medium effort)*
WhatsApp is already used as a reminder channel but the survey itself opens in a browser. For markets where WhatsApp is the primary communication tool (India, Middle East, LATAM), delivering a short pulse survey natively within WhatsApp (using WhatsApp Business API interactive messages) would dramatically improve completion rates.

**Improvement:** WhatsApp Business API integration for 3–5 question pulse delivery within the chat thread.

### 6. Offline / Low-Connectivity Mode *(Medium value, high effort)*
Mining, construction, and remote field sites have limited connectivity. A PWA (Progressive Web App) survey that caches the form and syncs responses when connectivity is restored would open these segments.

**Improvement:** Survey form as a PWA with offline response queuing.

### 7. Digital Signage / TV QR Rotation *(Low effort, niche)*
In break rooms and cafeterias, rotating QR codes displayed on TV screens (refreshed per survey cycle) remove the need for printed materials. Already partially supported via the `preview_qr` and generic link features — this is a packaging/marketing gap more than a product gap.

---

## Confidence Rating

**High** — The transcript evidence (KAG, Troon, Cascade) directly confirms the problem is real and affecting active accounts. The business profile corroborates with 4+ frontier accounts ($155K+ in combined ARR evaluating or at risk). Four additional TAM-sourced signals (Garrett, Alumil, WHML, BSM) each validate a distinct sub-problem. Public research on SMS response rates is well-documented. Competitor gap analysis is consistent across multiple sources.

---

## Open Questions

| # | Question |
|---|---|
| OQ1 | Does the platform currently support phone number as a standalone HRIS field for SMS-only employees? |
| OQ2 | What is the current SMS delivery infrastructure — Twilio? Can it handle two-way attribution? |
| OQ3 | Is the kiosk mode (`SKIP_PASSCODE_VERIFICATION`) currently exposed in the admin UI, or is it a backend-only toggle? |
| OQ4 | For WhatsApp Business API — does CM have an existing API relationship, or is this greenfield? |
| OQ5 | What is the actual SMS response rate in existing accounts (Troon, KAG) vs email? Is this tracked per channel? |
| OQ6 | Are there any legal/compliance constraints around SMS survey delivery in specific markets (GDPR opt-in, TCPA in the US)? |
| OQ7 | What does Peakon's kiosk mode look like exactly — PIN-based, employee ID, or fully anonymous? (Garrett benchmark) |
| OQ8 | Can auth settings be moved to survey-level without breaking existing account-level configurations? (Alumil) |
| OQ9 | Is employee ID and phone number validation done client-side, server-side, or both — and where is the best place to add normalisation? (WHML) |
| OQ10 | For BSM-type accounts: is "vessel" or "location" an available HRIS attribute that could serve as the group identifier for proxy submissions? |
