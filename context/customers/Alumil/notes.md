# Alumil

**Source:** TAM-shared request (2026-03-19)

## Feature Requests / Signals

### Survey-Level Verification Settings (not platform-wide)
- Need to configure authentication method **per survey**, not as a global platform setting
- Use case: one country/location requires email address authentication; another location cannot receive SMS OTPs (SMS infrastructure issues)
- Current platform applies verification settings globally — not granular enough for multi-country operations
- **Requested:** Per-survey (or per-location/country) toggle for: email OTP / SMS OTP / no verification

**Why this matters:** A single platform-wide OTP setting forces a lowest-common-denominator approach that either locks out employees where SMS doesn't work, or removes verification entirely for locations that require it for compliance.

---

### Talent Management Module (2026-03-24)

**Context:** Alumil has requested a full Talent Management module — being built specifically for them. Three sub-modules confirmed:

#### 1. Skill Gap Analysis
- Add skills in Settings with benchmark scores
- Persona-based views: Super Admins, Sub Admins, and Managers each see different levels of access/detail
- HRBP persona access included

#### 2. 9-Box Grid
- Performance vs. potential matrix (9-box)
- Global formula for performance analysis (admin-configurable)
- Persona-based access: Super Admins, Managers, HRBPs

#### 3. Talent Pool Management
- HR sends a separate survey to assess willingness for promotions and relocation
- Survey must support **dynamic/branching questions**
- Separate dashboard to filter employees by skills and willingness to relocate
- Export support likely needed for filtered views

**PRD folders:** `PRDs/talent-management-skill-gap-analysis/`, `PRDs/talent-management-9-box-grid/`, `PRDs/talent-management-talent-pool/`
