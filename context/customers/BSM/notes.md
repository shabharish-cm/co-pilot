# BSM

**Source:** TAM-shared request (2026-03-19)

## Context
Ship workers. No unique identifier per employee — no email address, no employee ID. Most likely no smartphone. Surveys need to reach them.

## Feature Requests / Signals

### Zero-Identity Survey Access for Ship Workers
- Employees have no email, no employee ID, no reliable internet, no smartphone
- Standard delivery channels (email, SMS, QR, WhatsApp) all fail
- **Requested:** A mechanism to survey employees with no individual identifier

**Recommended approach (discussed 2026-03-19):**
- Treat the **vessel / location as the survey unit**, not the individual employee
- Shared kiosk on ship's common terminal, offline-capable (PWA), syncs at port
- Or: proxy/batch submission by ship captain or HR officer — admin enters responses on behalf of the group, tagged to vessel/department, no individual ID
- IVR (voice call via satellite phone) as a stretch option — no smartphone or internet needed

**Connects to:** Non-desk workforce accessibility research (`PRDs/non-desk-workforce-accessibility/research.md`)
