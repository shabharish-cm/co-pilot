# Customer Pulse Master

This document is the running record of weekly customer pulse digests.
Each week is appended as a new section after the Thursday `/pulse` run.

---

<!-- Weekly entries are appended below by the /pulse command -->

---

## 2025-ENTERPRISE-LISTENING — Jan–Nov 2025 Historical Digest

**Source:** Project Autobots Enterprise Listening spreadsheet (186 rows ingested, 96 calls with substantive signals)
**Period:** January 2025 – November 2025
**Calls with insights:** 96 | **Months covered:** Jan · Feb · Mar · Apr · May · Jun · Jul · Aug · Sep · Oct · Nov
**Top company sizes:** 1,000–45,000 employees (enterprise & upper-mid-market)
**Geographies:** North America, Europe (UK, Germany, Belgium, Netherlands), APAC (India, Australia, Malaysia, Japan), Africa

---

### 1. New Feature Requests

#### Multilingual survey support — delivery + translation + localized UI 
- Exists (Needs improvement)
Requested in **every month** across 20+ calls. Languages explicitly named: Spanish, French, German, Zulu, Japanese, Chinese (Mandarin), Arabic, Dutch. Jan (Nexi Group, BMW Brilliance), Feb (ELIS, Kubota, Mahindra, HMH, Rewardsco, Allegro), Mar–Nov (constant). Apleona (Jun) specifically needs the **entire platform UI in German**, not just survey content, for manager adoption among non-English-speaking leaders.
```
Value: H  Effort: M (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed (20+ calls)
```

#### Manager dashboards with role-based access control
- In the roadmap
Mentioned in 15+ calls across all months. Managers need team-level analytics without compromising individual anonymity. Requests span access tiers: HR admin → HRBP → regional manager → frontline manager. Specific asks include heatmaps, driver breakdowns, and participation rates per team. Calls: G&J Pepsi, Splendid Hospitality, Allegro, Altium, ASCO, Quest Global, Yahoo, Troon, Formlabs, Camunda, and 8+ others.
```
Value: H  Effort: M (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed (15+ calls)
```

#### Non-desk / frontline worker delivery channels (QR, SMS, WhatsApp, kiosk)
- Exists (except Kiosk - but QR can be kiosk-ed by the customer)
12+ calls from manufacturing, logistics, retail, hospitality, and cargo/aviation sectors. Employees lack email access entirely. Calls: G&J Pepsi (Jan), Mahindra Logistics (Feb), Altium Packaging (Apr), Air General (May), Crown Worldwide (May), Apleona (Jun), and 6+ others across Jul–Oct.
```
Value: H  Effort: H (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed (12+ calls)
```

#### Lifecycle survey automation — event-triggered, HRIS-connected
- Does Not exist
12+ calls across all months. Customers want surveys to auto-fire from HRIS events: onboarding day 30/60/90, appraisal, exit, manager change. Mindsprint (May) wanted 8–10 driver mapping per pulse with composite EPS score. Formlabs (May) wanted event + role-based triggers. OneMain Financial (Oct) wanted MVP-to-scale lifecycle model.
```
Value: H  Effort: H (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed (12+ calls)
```

#### Custom/branded PowerPoint + Excel exports for leadership
- Does Not exist
8+ calls explicitly requesting executive-ready PPT/Excel exports in percent-favorable format. Splendid Hospitality (Jan), Allegro MicroSystems (Feb), Altium Packaging (Apr), Fender (Jul), KAG (Aug), and 3+ others. Leadership teams need board-ready decks without manual reformatting.
```
Value: H  Effort: M (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed (8+ calls)
```

#### AI-powered analytics and action planning (Ask Cooper)
- Does Not exist
Mentioned in 10+ calls as a key differentiator sought or explicitly demoed. Zee Entertainment (May), Mindsprint (May), Fender (Oct), Camunda (Jul), and others. Customers want AI to auto-surface insights, flag disengaged cohorts, and suggest actions — not just show charts.
```
Value: H  Effort: M (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed (10+ calls)
```

#### Industry benchmarking data
- Exists (Server on demand)
8+ calls across Jan–Sep. Customers want to compare scores against industry peers, geographic norms, or competitors. AutoNation (Jan), G&J Pepsi (Jan), Kubota (Feb), Mahindra (Feb), Rewardsco (Feb), RPG (Sep), KAG (Aug), El Cortez (Sep). Benchmarking is often a buying criterion, not just a nice-to-have.
```
Value: M  Effort: M (estimated)  Placement: Reconsider
Evidence basis: transcript-backed (8+ calls)
```

#### Disengaged employee / flight-risk detection view
- Does not exist
Formlabs (May) explicitly described wanting a **list of disengaged employees** with a journey view to identify attrition risk early — not just aggregate charts. Culture Amp's retention module showed only static charts; this was a primary switching reason.
```
Value: H  Effort: H (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed (1 call, high-signal)
```

#### Live survey editing without breaking historical trend lines
- Does not exist (Not in roadmap)
Formlabs (May) needed to edit active survey questions (e.g., change salary ranges to % brackets) without invalidating multi-year trend continuity. Culture Amp's inability to do this was the primary exit driver.
```
Value: M  Effort: H (estimated)  Placement: Reconsider
Evidence basis: transcript-backed (1 call)
```

#### Full platform UI localization (non-English)
- Does not exist
Apleona Group (Jun, 45,000 employees, Germany) requires the **entire manager-facing dashboard in German** — not just translated surveys. Manager adoption fails when the platform UI is English-only. Distinct from multilingual survey content.
```
Value: M  Effort: H (estimated)  Placement: Reconsider
Evidence basis: transcript-backed (1 call, large strategic account)
```

---

### 2. Problems with Existing Features

#### Survey anonymity trust gap — employees don't believe it's anonymous
5+ calls where employees (and buyers) distrust survey anonymity. Root causes: email-based invites expose identity, small-team thresholds make grouping transparent, and past vendor failures eroded trust. Calls: Performant Corp (Apr), Zee Entertainment (May), Tarento (May), Fender (Oct), Quisitive (Oct). This is a **perception problem as much as a product problem**.
```
Value: H  Effort: L (estimated)  Placement: Quick Win
Evidence basis: transcript-backed (5+ calls)
```

#### HRIS integration gaps — too many missing connectors
15+ calls explicitly requesting integrations not yet fully supported or easily configured: Workday (Splendid Hospitality, Altium, OneMain), Darwinbox (Mindsprint, Games24x7), SuccessFactors (L&T, Fender, Quisitive via July call), ADP (The Oncology Institute, Quisitive), Oracle (Nexi Group), SAP (Nateevo), BambooHR (Solace), Cornerstone (ASCO).
```
Value: H  Effort: H (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed (15+ calls)
```

#### No action planning / loop-closure mechanism post-survey
10+ calls mention surveys being run but with no systematic way for managers or HR to track actions, assign owners, or verify follow-through. Calls: Splendid Hospitality (Jan), HMH (Feb), ASCO (Apr), Altium (Apr), Mindsprint (May), Tarento (May), Paulig Group (Jun), Apleona (Jun), and 3+ others.
```
Value: H  Effort: M (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed (10+ calls)
```

#### Current vendor customer service failures — key switching trigger
Multiple Jan–Mar calls explicitly leaving due to poor vendor support: AutoNation (>72hr turnaround), Nexi Group (rigid setup), F-Secure (post-Qualtrics migration pain), Altium (Peakon rigidity), Formlabs (Culture Amp blocked changes). This is a **competitive acquisition opportunity**: CM's white-glove CS model is cited as a differentiator.
```
Value: H  Effort: L (estimated)  Placement: Quick Win
Evidence basis: transcript-backed (6+ calls)
```

#### Historical data migration not supported / high friction
8+ calls leaving Qualtrics, SurveyMonkey, Culture Amp, or Gallup need historical survey data imported to preserve trends. Fender (Oct), Crown Worldwide (May), ELIS (Feb), Kubota (Feb), and 4 others. Inability to migrate data is a **blocker** for deals with tenured customers who have multi-year benchmarks.
```
Value: M  Effort: H (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed (8+ calls)
```

#### EU/local data compliance and hosting requirements
3+ calls with hard compliance blockers: Nexi Group (Jan) — EU data hosting, Oracle integration for GDPR compliance; BMW Brilliance (Jan) — Great Firewall / Chinese data regulations; Paulig Group (Jun) — European data residency.
```
Value: H  Effort: H (estimated)  Placement: Strategic Bet
Evidence basis: transcript-backed (3 calls, all deal-blocking)
```

---

### 3. What Customers Love

- **Ask Cooper / AI chatbot** — Universally received as a strong differentiator in demos. No confusion or resistance observed. Buyers in resource-constrained HR teams see it as a force multiplier.
- **White-glove onboarding and dedicated CSM** — Explicitly cited as CM's advantage over Qualtrics, Culture Amp, and SurveyMonkey across 6+ calls. AutoNation, F-Secure, and Mahindra Logistics explicitly referenced poor incumbent vendor service as primary exit driver.
- **Lifecycle survey concept** — Customers light up when shown automated journey surveys. Most haven't seen it demoed before; it creates "aha" moments, especially for first-time survey buyers.
- **Pricing vs. incumbents** — Consistently viewed as fair or better vs. Qualtrics and Culture Amp. Solace (Jan) and Quisitive (Oct) noted pricing as a key decision factor alongside functionality.
- **People Science / benchmark reports** — Calls from KAG (Aug), Paulig (Jun), and RPG (Sep) specifically called out the analytics depth as differentiating vs. their current tools.

---

### 4. Recurring Signals (Cross-Month Frequency)

| Signal | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Total |
|--------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-------|
| Multilingual surveys | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **10/10** |
| Manager dashboards | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **10/10** |
| HRIS integration | ✓ | ✓ | · | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **9/10** |
| Lifecycle automation | ✓ | · | · | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | **8/10** |
| Frontline/non-desk access | ✓ | ✓ | · | ✓ | ✓ | ✓ | ✓ | · | · | ✓ | **7/10** |
| Action planning | ✓ | ✓ | · | ✓ | ✓ | ✓ | · | · | · | · | **5/10** |
| Custom exec reports | ✓ | ✓ | · | ✓ | · | · | ✓ | ✓ | · | · | **5/10** |
| Benchmarking | ✓ | ✓ | · | · | · | · | ✓ | ✓ | ✓ | · | **5/10** |
| Anonymity trust | · | · | ✓ | ✓ | ✓ | · | · | · | · | ✓ | **4/10** |
| Data migration | ✓ | ✓ | · | · | ✓ | · | · | · | · | ✓ | **4/10** |

---

### 5. Segment Breakdown

**First-time survey buyers (greenfield):** ~30% of calls — G&J Pepsi, Mahindra Logistics, HMH, Air General, New Gold, Tarento, Rewardsco, and 5+ others. Need heavy onboarding support and survey design guidance. CM's People Science model is a key differentiator for this cohort.

**Replacing SurveyMonkey / MS Forms:** ~25% — Kubota, Quest Global, Altium, Quisitive, Tarento. Pain: no analytics, no benchmarking, no lifecycle automation. Easy wins on feature differentiation.

**Replacing Qualtrics / Culture Amp / Gallup:** ~20% — F-Secure, Formlabs, Crown, Fender, Solace, Altium. Pain: cost, rigidity, poor support, or inability to customize. These are the highest-value deals but require historical data migration capability.

**Blue-collar / non-desk majority workforce:** ~35% of calls mention frontline workers as a key delivery challenge. This is the single most consistent segment-level blocker in enterprise deals.

---

→ [Source data: Enterprise Pulse Export Google Doc](https://docs.google.com/document/d/1lzrWxa_oVmxc1_yXqn4ru3vr5iD8TxH2AtyXrS4Sf_k)
→ [Raw data: Project Autobots spreadsheet, pulse/normalized tab](https://docs.google.com/spreadsheets/d/1Ui1ozxlsOns0zHAVfzt9kq3KLhsMDY2IU5wAdbnhG6o/edit?gid=913592201)

---

## 2026-W12 — March 13–19, 2026

**Transcripts:** 5 | **Calls:** Cascade Eye & Skin (demo), Yahoo (HM survey implementation), BrainLabs (exit survey config), RocRich (demo), Ummeed Housing Finance (scheduling only)

### Key Themes
- **Non-desk workforce accessibility** — Cascade Eye & Skin (clinical/QR); multi-channel delivery is primary differentiator for healthcare vertical.
- **HRIS sync reliability at implementation** — Yahoo (Workday manual audit before go-live), BrainLabs (SFTP daily feed setup). Runtime reliability concern emerging distinct from pre-sale integration gap signal.
- **Exit survey trigger precision** — BrainLabs: employees lose email access on last day, creating a delivery race condition. Conditional trigger logic (immediate if < 2 weeks from exit) requested.
- **Custom attributes scope gap** — BrainLabs: custom attributes not available across all sub-admin report filters. Fix reported as in-flight.
- **Pricing acceptance (SMB)** — RocRich: $4k/40 employees, 4-week onboarding, unlimited surveys — clean yes from first-time buyer.
- **Ask Cooper resonating** — Cascade: AI chatbot positioned as differentiator; no pushback.

### Deal Pipeline Update
- **Yahoo** — Active implementation (Glint replacement). HM surveys targeting live Mon March 23. 350 candidate records, Workday audit in progress.
- **BrainLabs** — Active CS. Exit survey + SFTP daily feed setup. Data mapping update due Tue Mar 24.
- **Cascade Eye & Skin** — Active eval (2 of ~4 vendors). Target go-live May–June 2026. Proposal sent; Ruby demo TBD.
- **RocRich** — Early discovery, positive sentiment. 40 employees, $4k ACV. Target Q2 (late July).

### Feature Gaps / Implementation Issues
- Exit survey email-loss race condition (BrainLabs) — Quick Win opportunity: configurable trigger buffer
- Custom attributes not universally available in sub-admin views (BrainLabs) — Fix reportedly in progress
- HRIS sync manual verification required pre-launch (Yahoo) — Strategic reliability concern

### Notable Quotes
> *"This is really helpful. Price seems pretty reasonable. Definitely would check all the boxes."* — Amber Gilroy, Cascade Eye & Skin

> *"The survey must reach employees before their last day due to email access loss after exit."* — Michelle Bacon, BrainLabs

→ [Full digest: pulse/weekly/2026-W12.md](../weekly/2026-W12.md)

---

## 2026-W13 — March 19–26, 2026

**Transcripts:** 18 | **Calls:** BrainLabs (lifecycle/exit), Yahoo (audit + candidate module live), RocRich (discovery), Ummeed Housing Finance (product tour), Bausch Health (pre-launch access), PopClub (demo), Tarento (eval), GBSS Australia (demo), Certis Belchim (reporting), Aloha (demo), Xebia (onboarding), URUS (reporting/UAT), Cerence (pre-launch), Inga Group (setup), Banpu Thailand (UAT), Reverie (churn/cancellation)

### Key Themes

- **Executive & custom reporting — active delivery pressure** — Certis Belchim (April 17 hard deadline; country + department-level data, comparative slides, thematic analysis) and URUS (April 10–15; 400 managers, 55% participation target) are both in delivery-execution mode. Report generation delays directly threaten leadership trust.
- **Sub-admin access & role governance — new emerging pattern** — Bausch Health (incorrect sub-admin assignments pre-launch), URUS (manager reports-only, no platform access), and Banpu Thailand (exact team/location/BU matching required for access; 24 Thailand locations) all surfaced sub-admin friction independently this week. Distinct from pre-sale HRIS gap — this is post-sale configuration friction.
- **BrainLabs lifecycle/exit — continuing from W12** — Daily SFTP feed agreed; data mapping update committed for March 24; custom attributes expansion coming. Exit email-loss race condition still the structural constraint; no permanent fix confirmed.
- **New demo pipeline — 4 accounts** — PopClub (200 employees, April target, urgent approval), Aloha (150 employees, INR 380k/year, 1-week launch target), GBSS Australia (336 employees, $7k/year, retention-focused), Tarento (evaluation-stage). All demos show positive pricing acceptance.
- **Implementation heavy week** — Yahoo audit passed (1 minor error only; candidate surveys live; HM training in 1–2 weeks), Cerence (test phase imminent, QR codes confirmed), Xebia (Zoho People sync confirmed, onboarding lifecycle live), Inga Group (May launch target, domain whitelist in progress), Banpu Thailand (UAT must close before April 1 committee meeting).
- **Ask Cooper / AI resonance** — Ummeed Housing Finance competitive comparison vs. Infido Amber: standardized questions cited as data reliability differentiator. Flight-risk detection feature communicated as mid-Q2 roadmap commitment. Aloha also responded positively to AI action plans.
- **Churn signal — Reverie (HIGH)** — Contract termination April 1 due to merger/downsizing (200 → 38 employees). INR 1.8 lakh contract. Structural/M&A churn; no product dissatisfaction. Goodwill preservation approach agreed; credit note for remainder under discussion.

### Feature Gaps / Implementation Issues

- Sub-admin role configuration — pre-launch validation gap (Bausch Health, URUS, Banpu Thailand) → consider automated access verification step
- Exit survey email-loss trigger timing — BrainLabs, no ETA on permanent fix
- Custom attributes not universally available in sub-admin views — fix reportedly in progress (BrainLabs)
- Flight-risk detection feature — communicated as mid-Q2 ETA to Ummeed Housing Finance; ensure product alignment

### Deal Pipeline Highlights

- **Closing this week:** PopClub (hot — early next-week contract target), Aloha (1-week launch window)
- **Active go-lives:** Yahoo, Cerence, Banpu Thailand (April 1 UAT deadline)
- **Active delivery commitments:** Certis Belchim (April 17), URUS (April 10–15)
- **Churn:** Reverie — settlement by March 31

→ [Full digest: pulse/weekly/2026-W13.md](../weekly/2026-W13.md)
