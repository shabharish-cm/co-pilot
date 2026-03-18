# Business Profile – CultureMonkey

## Company Overview

CultureMonkey is an employee engagement platform that helps organizations measure,
understand, and improve workplace culture through continuous feedback and surveys.

# CultureMonkey — Voice of Customer Analysis

> Derived from **28 sales, implementation & customer success calls** | March 2026 | CONFIDENTIAL

---

## At a Glance

| Calls Analysed | Distinct Feature Gaps | Recurring Pain Points | High-Priority Roadmap Items |
|:-:|:-:|:-:|:-:|
| 28 | 20 | 15 | 7 |

This document synthesizes insights from 28 Fireflies-recorded calls — spanning active prospects, new customers, and implementation kickoffs — to identify critical product gaps, recurring customer pain points, and prioritized feature investments for CultureMonkey's next roadmap cycle.

The dataset includes 5 prospect sales calls from new verticals (Nordic manufacturing, real estate, government/defense, Canadian mining, professional services), plus deep implementation and CS sync recordings from three active enterprise customers: **Yahoo** (weekly implementation series, April 2026 Pulse launch), **KAG/Keenan Auto Group** (post-onboarding weekly syncs), and **Troon** (golf/hospitality, first survey launch).

---

## 1. Recurring Customer Pain Points

> Issues raised across multiple calls — systemic gaps, not one-off requests.

---

### P1 — Data Residency: No Canadian Hosting
**Raised by:** High Tide (Sandy Sharma) | Cannabis Retail | 1,500–1,700 employees

- CultureMonkey stores data in the US (New York) and EU (Amsterdam) — no Canadian data centre exists.
- Canadian provincial privacy laws restrict sending employee PII outside of Canada or the EU without legal clearance.
- Sandy's legal team flagged this as a blocker before finalising the contract.
- Competitive risk: any vendor offering Canadian hosting wins this deal by default.

> **Impact:** Potential deal-blocker for any Canadian-headquartered organisation. High Tide has 1,500+ employees and was otherwise highly aligned with CultureMonkey. Now confirmed as a blocker for a second account: Canadian Mining Co. (BC + Northern Ontario, 1,700 employees).

---

### P2 — Lifecycle Survey Repeat Participation
**Raised by:** Brainlabs (Alice Browne, Michelle Bacon) | Digital Marketing | ~1,050 employees

- When an employee needs to take the same lifecycle survey multiple times (e.g., annual anniversary, repeated promotion milestones), the current system requires creating a duplicate survey.
- This leads to proliferating surveys with fragmented, non-consolidated reporting.
- CultureMonkey team acknowledged the gap and committed to exploring backend solutions — but no ETA given.
- Consolidated reporting that merges multi-wave data for the same lifecycle stage is also missing.

> **Impact:** Affects every client with recurring lifecycle events. Creates operational debt for the customer success team managing duplicate surveys on behalf of clients.

---

### P3 — Lifecycle Trigger Configuration is Not Self-Service
**Raised by:** Brainlabs (multiple calls), multiple prospects

- Lifecycle survey triggers (beyond basic onboarding/exit) cannot be configured by clients directly.
- Any custom trigger (e.g., promotions, manager changes, 6-month tenure) requires CultureMonkey's team to set up backend flows.
- Alice explicitly wanted to self-configure promotion surveys and other non-standard lifecycle events.
- Clients also cannot view their own lifecycle trigger configuration — only account managers have visibility.

> **Impact:** Creates support dependency and slows down clients who want to iterate on their listening strategy autonomously. Also a churn risk as clients become frustrated by hand-holding requirements.

---

### P4 — Survey Editing Post-Launch is Vendor-Dependent
**Raised by:** Brainlabs implementation kickoff (Karthik)

- Once a survey is live, clients cannot make any edits themselves.
- Even minor fixes (spelling errors, adding participants) require raising a request with CultureMonkey's team.
- While the team commits to rapid turnaround (a few hours), this is a trust and agility concern for clients.

> **Impact:** Medium severity, but creates unnecessary friction during active survey windows. Competitors likely allow minor post-launch edits.

---

### P5 — Google Chat Integration Missing
**Raised by:** Himanshu Daswani (Manufacturing, India) | ~4,000 employees

- Client's primary corporate communication tool is Google Chat, not Slack or Microsoft Teams.
- CultureMonkey confirmed this integration is 'under evaluation' but gave no confirmed roadmap timeline.
- The India market, especially manufacturing and tech sectors, has significant Google Workspace penetration.

> **Impact:** Potential blocker for Google Workspace-centric organisations in India and globally. At-risk deals increase as Google Chat usage grows.

---

### P6 — Power BI Integration Not Yet Live
**Raised by:** Vantage Data Centers (Julie Durillon, Amy Boehl) | Data Centres | ~3,000 employees

- Multiple enterprise clients rely on Power BI for centralised BI and reporting.
- CultureMonkey confirmed Power BI integration is launching in April 2026.
- Until then, clients must rely on raw data exports (CSV/Excel) and manual visualisation.

> **Impact:** Low urgency given April 2026 ETA, but high visibility for enterprise IT/data teams during evaluation.

---

### P7 — Custom Branding at 500+ Entity Scale
**Raised by:** Hakim Group (Sally Litchfield) | Optician Retail | ~3,500 employees / 500 entities

- Hakim Group requires individual optician practice logos displayed on surveys — not the parent brand.
- Sunil confirmed sub-account branding is technically feasible, but could not guarantee it at 500 entities.
- Committed to providing Plan A/B/C options — showing this is an edge case requiring significant work.
- Fallback: generic branding, which the client explicitly said would reduce employee trust.

> **Impact:** High complexity, niche use case. However, multi-brand franchise structures (retail, healthcare, hospitality) are a growing vertical. Solving this elegantly could unlock franchise chains as a new ICP.

---

### P8 — Mass Communication Capabilities (Non-Survey Notifications)
**Raised by:** El Cortez Hotel (Destiny Erazo) | Hospitality | 650 employees

- El Cortez wanted to use the platform for employee event notifications and general announcements — not just surveys.
- CultureMonkey supports email-based comms but SMS/text requires Twilio compliance approval.
- Current positioning is survey-only; mass comms would require significant product scope expansion.

> **Impact:** Niche use case for the current product. However, it surfaces a broader desire for CultureMonkey to become a continuous employee communication tool — not just a survey platform.

---

### P9 — Manager Dashboard Localisation (Non-English Analytics)
**Raised by:** Andrea Alegre / Pollig (Nordic Manufacturing) | ~3,000 employees

- Pollig operates across multiple European countries (France, Germany, Sweden, Poland, Lithuania, India post-acquisition). Managers want to consume analytics dashboards in their own language.
- Currently, platform analytics and heat maps are delivered in English only, even if surveys are multilingual.
- Andrea asked: *"Can a manager see all results — including comments from their team — in Spanish or German?"* Sunil confirmed a full-UI localisation feature is coming in Q4 2026.
- Already committed to a German client. Delay could affect other multilingual enterprise deals.

> **Impact:** High relevance for multinational and European enterprise clients. If Q4 delivery slips, it could stall Nordic and Continental European pipeline.

---

### P10 — Employee Self-Service View (Individual Contributor Access)
**Raised by:** Karla Langhus / DCS (Government/Defense) | ~2,200 employees

- Karla wanted individual employees to log in and view their own historical engagement scores and responses — including non-HR surveys (event attendance, activity participation).
- CultureMonkey does not have an employee-facing interface. The platform is admin- and manager-facing only.
- Sunil noted this was intentional: giving employees access to prior submissions "psychologically breaks the anonymity barrier."
- For non-anonymous, non-engagement use cases (points tracking, acknowledgement surveys), the lack of employee access is a genuine product gap.

> **Impact:** Moderate severity. Primarily affects clients wanting to expand beyond engagement surveys into employee activity or rewards tracking. Risk of being displaced by broader EX platforms.

---

### P11 — Gamification / Points Tracking & Peer-to-Peer Recognition
**Raised by:** Karla Langhus / DCS (Government/Defense) | ~2,200 employees

- DCS runs a monthly employee engagement programme where employees earn points for attending webinars, completing learning challenges, and community activities — redeemed for branded merchandise.
- Karla wanted a single platform to run these activity surveys AND track/accumulate points per employee. CultureMonkey can run the survey; it cannot manage or report on the points.
- DCS also requested peer-to-peer recognition — CultureMonkey explicitly does not offer this.
- Both features are adjacent to engagement but fall outside CultureMonkey's current product scope.

> **Impact:** Positioning risk if clients view CM as a narrow survey tool. Partnerships or integrations (e.g., Bonusly, Reward Gateway) may be the pragmatic path.

---

### P12 — GCC High (Microsoft Government Cloud) Compatibility
**Raised by:** Karla Langhus / DCS (US Government/Defense) | ~2,200 employees

- DCS is on Microsoft GCC High — a highly restricted US Government cloud environment.
- Glint (Microsoft) is sunsetting GCC High support in August 2026, directly driving DCS into the market. This creates a high-urgency inbound opportunity.
- CultureMonkey's compatibility with GCC High is unknown and requires technical evaluation.
- AI features within GCC High are especially restricted — Karla asked if Ask Cooper can be toggled off. Sunil confirmed yes.

> **Impact:** High strategic value — Glint's GCC High sunset creates an unexpected pipeline of US Government/Defense prospects. Proactive GCC High certification could unlock a materially underserved segment.

---

## Active Customer Implementation Signals (Post-Sale)

> The following pain points emerged from **active customer implementation and CS sync calls** — not sales calls. These represent confirmed product gaps that are blocking or frustrating paying customers right now. They carry higher urgency than prospect-stage signals.

---

### P13 — No Survey Branching / Conditional Logic `[YAHOO — CRITICAL]`
**Raised by:** Yahoo (Charlie Trinco, Scott Domes, Sanya Lamba) | Active customer, April 2026 Pulse launch

- CultureMonkey does not support conditional branching in surveys — all surveys are fully static.
- Confirmed by Yugi P in the March 2026 implementation call: *"Current platform lacks branching question logic; survey is static."*
- Yahoo's exit survey design relies on branching (e.g., "If reason = Manager, show these follow-up questions"). They cannot lift-and-shift their existing exit survey into CultureMonkey.
- Workaround offered: matrix questions with rating scales to approximate stack ranking. Imperfect — changes the data structure and UX significantly.
- Also blocking multi-select limiting: the platform cannot cap the number of selections in a multi-select question.

> **Impact:** CRITICAL for enterprise customers with structured survey logic. Limits use of CultureMonkey for exit surveys, onboarding assessments, and any research-grade survey design. Likely to become a churn signal if unresolved within 1–2 contract cycles.

---

### P14 — Sub-Admin Access Control Inflexibility `[YAHOO — HIGH]`
**Raised by:** Yahoo (Feb–Mar 2026 implementation calls) | Active customer

- Yahoo has a complex HR structure: separate admin roles for employee engagement surveys, lifecycle surveys, and a candidate survey module. Each requires different data access boundaries.
- Sub-admins (HR Business Partners) need granular L2 score access but are blocked by dynamic team change limitations.
- Separation of access by survey type (engagement vs lifecycle vs candidate) was a recurring discussion across 3 consecutive implementation calls — indicating it's actively unresolved.
- Yugi acknowledged feasibility concerns and said it requires engineering consultation before committing.

> **Impact:** High for enterprise clients with distributed HR structures. Particularly acute for organizations using CultureMonkey for multiple survey types simultaneously (engagement + lifecycle + candidate). Risk of admin workarounds creating data leakage.

---

### P15 — Scheduled / Automated Data Exports `[YAHOO + ENTERPRISE — HIGH]`
**Raised by:** Yahoo (Feb 2026 FR discussion — Karthik N and Yugi) | Active customer

- Enterprise customers want survey data to automatically flow to their BI tools on a schedule — not just be downloadable on demand.
- Yahoo specifically requested scheduled exports for lifecycle and continuous survey data, with configurable frequency and email delivery.
- Current state: manual CSV/Excel downloads only. No push-based or scheduled export capability exists.
- In development but not yet delivered — Karthik N assigned to build this with frequency options and confidential data compliance.

> **Impact:** High for enterprise BI-forward clients (Yahoo, Vantage Data Centers, KAG). Without scheduled exports, clients must manually pull data before each leadership review — eroding the perception of CultureMonkey as a real-time intelligence platform.

---

### P16 — AI Sentiment Accuracy & Emoji Sentiment Bugs `[KAG — MEDIUM]`
**Raised by:** KAG / Keenan Auto Group (Jan 2026 weekly sync — Phillip Dean, Kylee Bauman) | Active customer

- KAG flagged AI sentiment analysis accuracy as a concern during their first live dashboard review — specifically citing incorrect emoji sentiment interpretations and inaccurate scoring on free-text responses.
- Yugi committed to fix emoji sentiment display bugs and provide screenshots of correct interpretation post-call. Confirmed as a bug.
- Custom free-text question response counts and sentiment scoring were also showing incorrect data.
- KAG was evaluating whether to reformat their new hire survey from open-text to rating scale format partly because the current format doesn't export cleanly.

> **Impact:** Medium-high. AI sentiment is a marquee differentiator and prominently featured in sales demos. If early customers experience inaccurate AI analysis, it undermines the Ask Cooper value proposition and trust in the platform's intelligence layer.

---

## 2. Missing & Requested Features by Frequency

| Feature | Description | Customer / Source | Frequency | Impact |
|---|---|---|---|---|
| 🇨🇦 Canadian Data Hosting | Dedicated data centre in Canada (PIPEDA compliance) | High Tide + Canadian Mining Co. | 2 accounts | 🔴 Critical |
| 🔁 Lifecycle Repeat Participation | Allow same employee to complete recurring lifecycle survey without duplicate surveys | Brainlabs (Alice, Michelle) | 2+ calls | 🔴 Critical |
| 🌿 Survey Conditional Branching | If/then question logic — critical for exit surveys, onboarding, research-grade design | Yahoo (3+ impl. calls) | 3+ calls | 🔴 Critical |
| ⚙️ Self-Service Lifecycle Config | Admin UI for clients to configure lifecycle triggers without vendor intervention | Brainlabs, multiple prospects | 3+ calls | 🔴 High |
| 📅 Scheduled / Automated Export | Push survey/lifecycle data to BI tools on a configurable schedule | Yahoo, Vantage | 3+ calls | 🔴 High |
| 🤖 AI Sentiment Accuracy (Bug Fix) | Fix emoji sentiment bugs and free-text scoring inaccuracies | KAG / Keenan Group | 2 CS calls | 🔴 High (bug) |
| 🎛️ Granular Sub-Admin Access | Separate access rules per survey type; fluid L2 team scoping for HRBPs | Yahoo (3 impl. calls) | 3 calls | 🟠 High |
| 💬 Google Chat Integration | Native survey delivery and reminders via Google Chat | Himanshu Daswani (Mfg India) | 1 call | 🟠 High |
| 🌐 Manager Dashboard Localisation | Full analytics UI in manager's preferred language (not just survey translations) | Pollig / Andrea Alegre | 1 call / Q4 committed | 🟠 High |
| 📊 Power BI Integration | Push anonymised survey results to Power BI | Vantage Data Centers | 1 call / April 2026 | 🟡 Medium |
| 🏷️ Multi-Brand Survey Customisation | Per-entity custom logos/branding for franchise clients at scale (200+ entities) | Hakim Group (Sally) | 1 call | 🟡 Medium |
| 📝 Post-Launch Survey Editing | Minor self-service edits to live surveys within guardrails | Brainlabs kickoff | 1 call | 🟡 Medium |
| 📋 Client-Visible Lifecycle Config | Read-only view of lifecycle trigger rules and timing for clients | Brainlabs (Alice) | 1 call | 🟡 Medium |
| 📈 Consolidated Lifecycle Reporting | Unified view across multiple lifecycle survey waves and tenure segments | Brainlabs, TOI | 2 calls | 🟡 Medium |
| 📅 Lifecycle Analytics Date Filter | Date range filter on lifecycle analytics dashboard | KAG, Yahoo | 2 calls | 🟡 Medium |
| 🔖 Custom Driver Benchmarking | Benchmarking for client-defined custom drivers (beyond CM's 15 standard themes) | Vantage Data Centers | 1 call | 🟡 Medium |
| 🔬 Vertical Benchmarking (Sub-sector) | Sub-sector benchmarks (e.g., multifamily real estate vs. general property mgmt) | Trinity Real Estate | 1 call | 🟡 Medium |
| 👤 Employee Self-Service View | Employee-facing interface for own submission history (non-anonymous use cases) | DCS / Karla Langhus | 1 call | 🟡 Medium |
| 🏆 Gamification & Points Tracking | Track/accumulate engagement activity points; peer-to-peer recognition module | DCS / Karla Langhus | 1 call | 🟢 Low-Medium |
| 🛡️ GCC High Cloud Compatibility | Technical certification for Microsoft GCC High — unlocks US Gov/Defense post-Glint sunset | DCS / Karla Langhus | 1 call / strategic | 🔴 High (strategic) |
| 📣 Mass Communication (Non-Survey) | Platform-native announcements/event notifications | El Cortez (Destiny) | 1 call | 🟢 Low |

---

## 3. Customer Sentiment Analysis

### 3.1 Positive Sentiments & Differentiators

The following capabilities were explicitly praised or cited as competitive advantages across multiple calls:

| Theme | Evidence |
|---|---|
| 🚀 Fastest Implementation | 5-week go-live accepted as a genuine differentiator across multiple calls. "Fastest implementer in the market" cited as a G2 recognition. VPG prospect: *"most professional product presentation I have seen."* |
| 🤖 Ask Cooper AI Chatbot | Consistently highlighted as a key differentiator. Praised by TOI's Elizabeth, Brainlabs' Alice, and Vantage's team. Manager-level tailored responses specifically appreciated. |
| 👩‍🔬 People Science Team | Embedded expert team for survey design and custom reports perceived as a major value-add. High Tide, AWP, and Arrowhead specifically cited this as a reason to choose CM over pure-SaaS competitors. |
| 💰 Pricing (40–60% below competitors) | Confirmed by KAG's Phillip Dean and multiple others vs. Culture Amp, Qualtrics, Pekon. The 3-year price lock resonates strongly in budget-constrained environments. |
| 💬 Anonymous 2-Way Chat | Described as "innovative" and "not found elsewhere" by multiple clients. TOI's Elizabeth, Brainlabs' Alice praised the ability to follow up on sensitive feedback while maintaining anonymity. |
| 🌍 Multi-Channel Delivery | WhatsApp, SMS, QR codes, and kiosk modes — especially valued for frontline/blue-collar workforces (AWP, VPG, Keenan Group). Seen as a genuine capability competitors lack. |
| 📊 Heat Maps & Drill-Downs | Universally praised. The ability to slice by team, manager, tenure, location in real-time is the core analytics differentiator. Multiple clients referenced competitor platforms as lacking this granularity. |
| 🔗 HRIS Integration Quality | ADP, Workday, Darwin Box, Hibob, Dayforce, iTrent, SuccessFactors — broad HRIS coverage with vendor-managed integration reduces client IT burden significantly. |

---

### 3.2 Negative Sentiments & Concerns

| Concern | Details |
|---|---|
| 🔒 Data Residency Gaps | Canadian hosting absent — High Tide and Canadian Mining Co. are at risk. EU-only / US-only hosting may be a blocker in other jurisdictions too (Australia, Middle East). |
| ⚙️ Vendor Dependency for Lifecycle | Brainlabs specifically noted frustration: non-standard lifecycle triggers must go through CultureMonkey's team, limiting client autonomy and increasing service overhead. |
| 🔄 Lifecycle Repeat Survey Problem | Creating duplicate surveys for recurring events is operationally messy and produces fragmented reporting — confirmed as a known gap. |
| 📝 No Post-Launch Editing | Even minor errors require vendor intervention. Clients on tight timelines found this a friction point during the Brainlabs kickoff. |
| 💬 Google Chat Integration | Not available, and India's Google Workspace ecosystem means this is a pipeline risk for the India market. |
| 🎯 Custom Driver Benchmarking | CultureMonkey's 15 standard drivers are benchmarkable; custom drivers are not. Enterprise clients with unique engagement frameworks will notice this ceiling. |
| 📣 Communication Limitations | El Cortez wanted mass comms capabilities. Platform is survey-only; this creates a positioning challenge against broader EX platforms. |
| 🏷️ Multi-Brand at Scale | Hakim Group's 500-entity branding requirement exposed a scalability limitation. The team was unable to commit outright. |
| 🌐 Analytics Not Localised | Pollig/Andrea (Nordic manufacturing) needs analytics dashboards in 7+ European languages, not just translated surveys. |
| 🛡️ GCC High Compatibility Unknown | DCS/Karla is on Microsoft GCC High. CultureMonkey's compatibility is unverified — a risk and a time-sensitive opportunity. |
| 👤 No Employee-Facing Interface | DCS raised the lack of a portal for individual contributors to view their own engagement history. |
| 🌿 No Survey Branching Logic | Yahoo's exit survey cannot be deployed as-is. Surveys are fully static — a structural gap, not a configuration limitation. |
| 📅 No Scheduled Data Export | Yahoo and Vantage both need automated data pushes to BI tools. Current state is manual download only. |
| 🤖 AI Sentiment Bugs in Production | KAG experienced incorrect emoji sentiment interpretations and inaccurate free-text scoring during their first live dashboard session. |
| ⚠️ Translation Quality (Historical) | Keenan Group's Jennifer noted translation quality issues were a past complaint — now resolved per Sunil. Still surfaces in older evaluation criteria. |

---

## 4. Prioritised Product Roadmap Recommendations

> Based on deal-risk, customer frequency, and strategic alignment.

---

### 🔴 P0 — Immediate (Q2 2026)

- **Self-Service Lifecycle Trigger Configuration** — Build a no-code trigger builder for admins. Allow clients to configure trigger conditions (field = value, date offsets) without vendor involvement. Directly reduces CS overhead and improves client autonomy.
- **Lifecycle Repeat Participation Fix** — Enable a single lifecycle survey template to accept multiple responses from the same participant over time. Consolidate all responses into a unified journey view and aggregate report.
- **Survey Conditional Branching / Logic** — Implement basic if/then branching so questions can be shown or hidden based on prior answers. CRITICAL gap confirmed by Yahoo during implementation: exit surveys, onboarding assessments, and research-grade survey flows cannot be replicated without it.
- **AI Sentiment Accuracy Bug Fix** — Resolve emoji sentiment display bugs and free-text sentiment scoring inaccuracies flagged by KAG. Trust-damaging bug in a marquee differentiator.
- **Google Chat Integration** — Develop native Google Chat survey delivery. Priority for India market; positions CultureMonkey for Google Workspace-dominant enterprise sales.

---

### 🟠 P1 — Near-Term (Q3 2026)

- **Canadian Data Residency** — Partner with a Canadian cloud provider (e.g., AWS ca-central-1 or Azure Canada Central). Now confirmed as a blocker for at least two accounts (High Tide, Canadian Mining Co.).
- **Post-Launch Survey Editing (Guardrailed)** — Allow admins to make non-structural edits (labels, typos, participant additions) to live surveys within a defined window (e.g., first 24 hrs) without vendor intervention.
- **Client-Visible Lifecycle Config (Read-Only)** — Expose lifecycle trigger rules, timing settings, and participant inclusion logic in a read-only admin view. Export/shareable as PDF.
- **Consolidated Lifecycle Reporting** — Unified dashboard showing engagement trend across multiple lifecycle survey waves. Filterable by tenure cohort, department, and manager.
- **Manager Dashboard Localisation** — Accelerate already-committed Q4 delivery: full analytics UI (heat maps, AI insights, comments) in manager's preferred language. Critical for European enterprise pipeline.
- **Scheduled / Automated Data Export** — Allow enterprise clients to configure push-based data exports (lifecycle, continuous, pulse) on a schedule, delivered via email or API. Confirmed as a required feature by Yahoo and Vantage Data Centers.
- **Granular Sub-Admin Access by Survey Type** — Build separate access permission rules for engagement, lifecycle, and candidate survey modules. Support fluid L2 team scoping for HR Business Partners. Surfaced across 3 consecutive Yahoo implementation calls as unresolved.
- **Heatmap Multi-Select Filters** — Allow filtering heatmaps by multiple values simultaneously across all filter dimensions. Confirmed requirement from Yahoo's April 2026 Pulse launch build.

---

### 🔵 P2 — Medium-Term (Q4 2026 / Q1 2027)

- **Power BI Integration** — Already on roadmap for April 2026. Accelerate and ensure a smooth GA release with documentation.
- **Custom Driver Benchmarking** — Allow clients to define custom engagement drivers and enable CultureMonkey to collect and expose anonymised benchmark data for those drivers over time.
- **Multi-Brand Survey Theming at Scale** — Build a brand configuration system that supports 50–500 distinct entity brands via template inheritance and bulk configuration imports.
- **Gamification Module** — Optional participation incentives: completion badges, anonymous participation leaderboards per team. Configurable on/off per survey.
- **GCC High Cloud Compatibility Assessment** — Conduct a formal technical evaluation of CultureMonkey's compatibility with Microsoft GCC High government cloud. Glint's August 2026 sunset is creating an inbound pipeline of US government/defense clients — time-sensitive strategic opportunity.

---

### 🟣 P3 — Exploratory / Strategic (2027+)

- **Mass Communication Module** — Explore a non-survey announcement/notification channel tied to the same employee distribution lists. Positions CultureMonkey as a broader Employee Experience platform.
- **Additional Data Residency Options** — Australia (APAC), Middle East (GCC). Expand beyond US + EU + Canada.
- **Manager Self-Service Survey Builder** — Allow managers to create and send team-level micro-surveys autonomously within guardrails, reducing dependency on central HR.

---

## 5. Competitive Intelligence & Win/Loss Signals

| Competitor / Platform | Context | CultureMonkey Position |
|---|---|---|
| **Culture Amp** | Brainlabs, AppsFlyer, and Vantage transitioning away. Commonly mentioned in evaluations. | ✅ Win: Better pricing, faster implementation, AI chatbot. ⚠️ Risk: Culture Amp's ecosystem integrations and brand recognition are stronger. |
| **Glint (Microsoft)** | DCS/Karla is being force-migrated off Glint — Microsoft sunsetting GCC High support. Glint likely migrating into Viva Engage. | ✅ Strategic Win: Glint's GCC High sunset creates an inbound pipeline of government/defense prospects. CultureMonkey should position explicitly as a Glint alternative. ⚠️ Risk: If Viva Engage fills the GCC High gap, this window closes. |
| **Swift Bunny** | Trinity Real Estate used Swift Bunny before building an internal survey. Now evaluating CultureMonkey as the structured replacement. | ✅ Likely Win: Trinity outgrew Swift Bunny. CultureMonkey's analytics depth, lifecycle support, and AI chatbot are strong differentiators. |
| **Gartner (Lifecycle Surveys)** | TOI (Nolan Mariano) specifically dropped Gartner due to poor lifecycle analytics and no actionable follow-up on anonymous feedback. | ✅ Strong win: Anonymous 2-way chat and lifecycle analytics directly address the exact gaps that drove Gartner churn. |
| **Qualtrics / Pekon** | KAG/Keenan Group evaluated these — CultureMonkey was 40–60% cheaper. | ✅ Price win. ⚠️ Risk: Qualtrics has stronger enterprise compliance and research credibility. |
| **Workday Peopletics** | Not named explicitly, but large enterprise clients (Vantage, JPMorgan-scale orgs) will compare. | ⚠️ Risk: Deeply embedded in Workday-centric enterprises. CultureMonkey needs to reinforce that the Workday integration is deep, not just SFTP. |
| **Internal Solutions** | KAG considered building internally. El Cortez used internal mail + flyers. Trinity built their own last survey. | ✅ Win: 5-week implementation, dedicated PS team, and $20/employee/year pricing make buy >> build obvious. |

---

## 6. Customer & Prospect Overview

| Account | Employees | Vertical | Status | Key Notes |
|---|---|---|---|---|
| AppsFlyer (Irina P.) | 1,200 | Tech / SaaS | 🟢 Advanced | Migrating from Culture Amp. Oracle HRIS, Slack. $17K/yr. Security questionnaire in progress. |
| High Tide (Sandy S.) | 1,500–1,700 | Cannabis Retail | 🔴 At Risk | Canadian data hosting is a legal blocker. Otherwise strong fit. Legal team review required. |
| Warner Hotels (Meera V.) | 3,500 | Hospitality | 🟢 Advanced | Element Suite HRIS. Decision by end of Jan 2026. £25K/yr. |
| VPG Group (Shlomy N.) | 2,200 | Manufacturing | 🟡 Evaluating | First-ever survey. SuccessFactors HRIS. High security requirements. $20K/yr. |
| Lincolnshire Council (Natasha F.) | 6,000 | Public Sector | 🟡 Evaluating | First vendor call. 4–5 competitors. English only. £30K/yr. |
| Vantage Data Centers (David L.) | 2,000–3,000 | Data Centres | 🟢 Advanced | Transitioning from Pecon. Workday. Power BI interest. $25K/yr. |
| Hakim Group (Sally L.) | 3,500 | Optician Retail | 🟡 Evaluating | 500-entity branding challenge. iTrent HRIS. £20K/yr. |
| Mfg Client (Himanshu D.) | 3,000–4,000 | Manufacturing | 🟡 Evaluating | Darwin Box HRIS. Google Chat gap. 3 CHRO sign-off needed. |
| Brainlabs (Alice B.) | 1,050 | Digital Marketing | 🟢 Customer (active) | Transitioning from Culture Amp. Hibob HRIS. Lifecycle config gaps. $11K/yr. |
| Q (Kaytlin) | ~350–400 | Tech | 🟡 Evaluating | First pulse survey ever. Rippling HRIS. $9.5K/yr. |
| Asta (Sarah P.) | ~2,000 | Social Housing | 🟡 Evaluating | Dayforce HRIS. Budget evaluation. £10.6K/yr. |
| AWP Safety (Melody L.) | 7,782 | Safety / Field Services | 🟡 Evaluating | First-ever pulse survey. UKG HRIS. Frontline focus. $55K/yr. |
| Total Care (Michelle M.) | ~500 | Healthcare | 🟡 Evaluating | First engagement initiative. US + Lebanon. $10.5K/yr. |
| Quizitive (Emily F.) | ~430–7,500 | IT Services | 🟡 Evaluating | Rapid growth plan. ADP HRIS. $12.5K/yr. |
| TOI (Nolan M.) | ~650 | Media | 🟢 Advanced | Replacing Gartner lifecycle surveys. ADP. $15K/yr. |
| TOI (Elizabeth C.) | ~650 | Media | 🟢 Customer (active) | Detailed platform walkthrough. Strong positive intent. |
| UNUM (Katie G.) | ~9,500 | Insurance / Finance | 🟡 Evaluating | Pilot with 200–5,000 employees. Workday. $38K/yr for full 5K. |
| Arrowhead (Megan L.) | ~1,000 | Insurance | 🟡 Evaluating | 2026 implementation target. ADP Workforce Now. $16K/yr. |
| El Cortez (Destiny E.) | 650 | Hospitality / Gaming | 🟢 Advanced | First engagement initiative. PayPal HRIS. $13K/yr. |
| Alpine F1 Team (Shelley H.) | 900 | Motorsport | 🟡 Evaluating | Workday + Resource Link. $15K/yr. 3 supplier quotes needed. |
| Keenan Group (Phillip D.) | 8,000 | Transport / Logistics | 🟡 Evaluating | Paycom HRIS. No email for drivers. $40K/yr. |
| Pollig (Andrea A.) | ~3,000 | Nordic Mfg / Retail | 🟡 RFI Stage | Workday + MS Teams. RFI mid-Aug, RFP Sept, decision end-2026. 7+ languages needed. |
| Trinity Real Estate (Rick) | 1,400 | Real Estate | 🟡 Evaluating | ADP HRIS. Previously used Swift Bunny. $25K/yr. No multifamily benchmarking. |
| DCS (Karla L.) | 2,200 | Gov / Defense | 🟡 Complex Eval | GCC High Microsoft cloud. Migrating from Glint (sunset Aug 2026). UKG HRIS (SFTP). $25K/yr. |
| Canadian Mining Co. | 1,700 | Mining | 🟡 Evaluating | 2 sites: BC + Northern Ontario. SuccessFactors HRIS. English only. ~$20K/yr. Survey target Aug–Sept 2026. |
| Aston (Barbara W.) | Unknown | Professional Services | 🟢 Advanced | Transitioning from another vendor (quoted $36K). Last vendor being evaluated. Maternity handover to Laura. |
| Yahoo (Charlie T., Scott D.) | 14,000+ | Tech / Media | 🟢 Customer (active) | Enterprise implementation in progress. April 2026 Pulse launch. Candidate module in build. Key gaps: branching logic, sub-admin access, scheduled export, heatmap multi-select. |
| KAG / Keenan Auto Group | 8,000 | Transport / Automotive | 🟢 Customer (active) | Post-onboarding weekly syncs. Historical data import in progress. AI sentiment accuracy bugs flagged. |
| Troon (Elaina S., Christine B.) | 5,000+ | Golf / Hospitality | 🟢 Customer (active) | First survey launched (test). eNPS: 68.42. Multilingual: French, Spanish, Haitian Creole. IP whitelisting for club network. |

---

*CultureMonkey — Internal Product Intelligence | Compiled by Shab | March 2026 | CONFIDENTIAL*


## My Role

Technical Product Manager

## Key Product Areas

- Employee engagement surveys
- Pulse checks
- Culture analytics & dashboards
- Manager insights
- Action planning workflows

## Stakeholders

Update this section with your key stakeholders, team leads, and cross-functional partners.

## Key Metrics to Track

Update with your north-star metrics and OKRs.

---
## Executive Summary

CultureMonkey is an employee experience and engagement platform centered on running surveys, collecting feedback, and turning those signals into actionable insights for HR and leadership. The core product is a multi-tenant Rails monolith (`culturemonkey`) with surrounding services for analytics, reporting, observability, AI assistants, and vertical solutions (e.g., hiring analytics, customer insights). Across the ecosystem, CultureMonkey provides survey delivery, lifecycle and pulse programs, feedback analysis (including advanced thematic analysis), manager dashboards, cost and notification analysis, and AI-powered assistants (Cooper, Hummer, Winsight) that sit on top of the same data foundations. The primary value proposition is to help organizations systematically measure and improve engagement, retention, and manager effectiveness through configurable surveys, rich analytics, and guided actions.

---

## Platform essentials

This section captures the **core “how the platform behaves” rules** that shape survey trust, reporting correctness, and day‑to‑day admin operations (pulled from the CultureMonkey Essentials deck).

### 1) Survey identity: Anonymous vs Confidential

- **Anonymous surveys (default)**: responses are collected such that individual identities are protected, and insights are shown at **group/cohort level** (team, location, manager, demographics, custom attributes). This is designed to maximize candor while still enabling pattern-finding across cohorts.
- **Confidential surveys**: super-admins can view individual responses (and identifying details). In-app visual reports look similar to anonymous mode, but confidential surveys enable **individual response data download** (XLS/CSV). Typical use cases: **Onboarding** and **Exit** surveys.
- **Operational constraints**
  - Identity type is chosen **during survey creation** and **cannot be changed after launch**.
  - Employee-facing disclaimers are shown in emails + the survey form for **anonymous** surveys; the same anonymity disclaimers are **not shown** for confidential surveys.

### 2) Privacy enforcement: Minimum response threshold (anonymity threshold)

- Each survey has a configurable **minimum responses required to report data** (configured at creation under **Reporting Rules**). The minimum allowed value is **3**.
- The threshold applies across reporting experiences:
  - **Cohort listing**: a cohort (e.g., a manager/team/location/custom attribute value) appears in reports only if its response count meets or exceeds the threshold.
  - **Drilldowns & combinations** (e.g., heatmap drilldowns, NPS wizard, dynamic reports): threshold is evaluated **on the combined cohort** when you add levels or merge cohorts.
  - **Reports listing guardrail**: if participation rate is below **1%** or responses are fewer than **3**, the survey won’t be listed on the reports page.
- Related behavior:
  - **Feedback module thresholding**: identity metadata (manager/team/location) can be hidden when the cohort under that attribute falls below the threshold.
  - **Dashboard heatmap** uses a fixed minimum threshold of **5**, regardless of the survey-level threshold.

### 3) Rating design: Likert collection + standardized scoring

- CultureMonkey encourages a **5-point Likert** response format (Strongly Disagree → Strongly Agree), mainly to reduce respondent cognitive load, improve mobile usability, and preserve a “Neutral” option for validity.
- For analysis, CultureMonkey converts rating responses to a standardized scoring range:
  - **Question score**: rating questions are converted to a **10-point scale** and averaged across submitted responses. Skipped questions are excluded from the score calculation.
  - **Driver score**: each question is mapped to a driver; driver score is the average of scores for all questions in that driver.
  - **Overall engagement score**: average of all rating-question scores across drivers.
- **Account-level scoring range**: admins can configure the score range (e.g., **5** or **100** points) at the account level, but this must be finalized **before launching the first survey** and cannot be reverted.

### 4) eNPS and custom NPS: measurement + personalization

- **eNPS** uses an 11-point (0–10) scale.  
  - Promoters: 9–10  
  - Detractors: 0–6  
  - **eNPS = %Promoters − %Detractors**, reported on **−100 to +100**.  
  - Only **submitted** responses are counted (auto-saved drafts are excluded).
- **Custom NPS** extends the standard eNPS by letting orgs define additional NPS-style questions (e.g., *Manager NPS*, *Culture NPS*).
  - Creation flow is support-assisted: you share **NPS name + question**, and the team enables it in the backend as a one-time setup.
  - Once enabled, the custom NPS can be added to surveys during survey creation.
  - Results are accessible from the **survey report heatmap**, and advanced users can generate combinations via the **NPS Wizard** (advanced feature set).

### 5) Email sending model: CultureMonkey domain vs your domain (SMTP)

- Default: survey emails are sent from **surveys@culturemonkey.io**. You can customize the **sender name** in Email Templates (e.g., “Acme”), while the underlying sending domain remains CultureMonkey’s.
- Benefits of using the standard CultureMonkey sending domain:
  - faster delivery, tracked delivery/bounce rates, and easier troubleshooting with support.
- Custom domain sending (SMTP) is supported but comes with tradeoffs:
  - potential delivery latency, failed deliveries/timeouts at scale, and risk of org-wide blocking if credentials aren’t kept up to date.
  - SMTP setup supports (a) username/password and (b) OAuth-based SMTP for Office365 (support-assisted).
  - When SMTP is configured, it **overrides** template-level “From” settings (all emails use the configured address).

### 6) Employee data extensions: Custom attributes

- CultureMonkey enforces mandatory employee attributes (team, location, etc.) for base cuts, and also supports **custom attributes** to tailor analytics to your org.
- Recommended best practice: limit custom attributes to **~3 fields** to avoid report and dashboard performance degradation.
- Custom attribute setup:
  - Data types: **Textbox** (free-form) or **Dropdown** (controlled vocabulary; comma-separated unique values).
  - Values can be assigned in the UI (add/edit employee) and are supported in employee CSV import.
  - For CSV import, custom attribute keys should be prefixed with **`cf_`** (example: `cf_grade`).

### 7) Roles & access boundaries

- **Super-admin**: full access to all modules.
- **Sub-admin**: scoped access—can create/launch surveys and analyze reports for employees belonging to specific **teams/locations/business units** (scope adjustable by super-admins).
- **Manager**: dedicated dashboard experience; access is limited to their reporting hierarchy (direct + indirect reports). Manager permissions are fixed and not customizable, and include access to items like Dashboard, Templates, Surveys, Reports, Feedback, Actions, and Email Templates relevant to their team.

### 8) Multilingual surveys

- Multilingual surveys increase participation by letting employees respond in their preferred language via a dropdown in the survey form.
- Translation coverage and constraints:
  - Translatable: questions, rating options, select options, eNPS, and custom NPS questions.
  - Not translated in the form: survey name, section name, and the end feedback prompt (“Do you have a feedback/suggestion?”) remain in the default language.
- Translation workflow is support-assisted: the team shares a sample translation file, you fill translations, and it is loaded into the system; customers are responsible for validating translation accuracy before launch.

---


## Product Overview

### Personas and JTBD

- **HR / People Leaders**
  - **JTBD**: Run engagement and lifecycle surveys, understand drivers of engagement, identify at-risk segments, and plan interventions.
  - **Key needs**: Survey creation and scheduling, driver benchmarks, participation and eNPS tracking, heatmaps, lifecycle views, and action tracking.
- **People Analytics / Data Teams**
  - **JTBD**: Slice and dice survey and feedback data, build thematic views, run demographic and time-series analysis, and ensure methodological rigor.
  - **Key needs**: Robust data model (tenants, surveys, questions, responses, demographics), ClickHouse analytics, theming/coding workflows, exportable artifacts.
- **Managers / People Leaders at the edge**
  - **JTBD**: View team-specific scores and feedback, compare vs benchmarks, and plan actions.
  - **Key needs**: Manager dashboards, snapshots, manager buckets, feedback tools, and targeted nudges.
- **Executives / CXOs**
  - **JTBD**: Track overall engagement/eNPS, segment risk, and progress of initiatives over time.
  - **Key needs**: Executive summaries, trends, benchmarking, lifecycle and cost analysis views.
- **Customer Success / CS Ops**
  - **JTBD**: For Winsight, understand renewal risk, sentiment, and TAM performance across enterprise customers.
- **Recruiters / Talent Acquisition**
  - **JTBD**: For Hummer, structure hiring projects, run interviews, and generate AI-powered interview insights.
- **Support / Success Engineers**
  - **JTBD**: Configure integrations, debug sync/notification issues, and operate the system reliably.

### User Journeys (High-Level)

- **Survey lifecycle (core CultureMonkey)**
  1. Admin signs up and configures account, languages, locations, drivers, and teams (`settings/*` routes).
  2. Admin creates a survey (or uses templates) with questions and sections (`surveys`, `survey_templates`, `question*` models/controllers).
  3. Participants are imported / mapped from employee data or integrations (`employees`, `employee_imports`, `employee_attribute_mappings`, `cm-sync-service`).
  4. Survey is scheduled/autopiloted (pulse, lifecycle, or one-off) with reminders and channels (`autopilots`, `pulse_surveys`, `automate_reminders`, `manual_reminders`).
  5. Employees respond via unique response keys/short URLs (`survey_responses`, `/CMSRVY/:id`, `/responses/:key` and pulse variants).
  6. Data flows into reports: dashboards, heatmaps, driver drilldowns, lifecycle, manager views, and feedback text tools (`reports`, `lifecycle`, `employee_reports`, `feedback`, `reports/*`, `engines/reports/*`).
  7. Managers and admins export reports (PDF, PPT(X), CSV) and create or track actions (`acts`, `company_trivia`, `report_toolkit`, cost analysis, etc.).
  8. Optional: advanced thematic analysis and AI assistants (Thematic Analysis Dashboard, Cooper, Hummer, Winsight) deepen insights or provide conversational access.

- **Feedback and text analysis**
  1. Free-text feedback is collected via surveys or feedback modules (`feedback`, `feedback/text_responses`).
  2. Text is processed via classification, keywords, and themes (Elasticsearch, Google Cloud Language/AutoML, custom classifiers, Thematic Analysis Dashboard).
  3. Results appear in topic, word cloud, and text response modules, often with sentiment and drivers attached.

- **Lifecycle / pulse programs**
  1. Lifecycle templates and pulse surveys are configured (`lifecycle_*` models/controllers, `pulse_surveys`, candidate/employee lifecycle).
  2. Autopilots manage recurring sends and cohorts (`autopilots` standard and candidate engines).
  3. Lifecycle analytics provide stage-wise and demographic breakdowns over time (`lifecycle` and `engines/lifecycle_analytics`).

- **AI assistants and specialized apps**
  - **Cooper**: Users ask natural language questions about engagement metrics; Cooper translates into MCP tool calls against CultureMonkey’s analytical schema.
  - **Thematic Analysis Dashboard**: Analysts and PMs run thematic analysis flows over feedback responses with OpenAI, enforcing anonymity thresholds.
  - **Hummer**: Recruiters run AI-supported interview workflows including transcripts, scoring, and project-level dashboards.
  - **Winsight**: CS teams view AI-generated renewal and risk insights across customers based on emails, usage, and Totango.

### Core Capabilities

- **Survey & Audience Management**
  - Survey templates (including custom templates), question banks, and import/export of questions.
  - Participant import/validation, mapping, and segmentation; employee attributes and filters.
  - Multi-language surveys and translation management (survey, questions, sections, form text, email templates).

- **Engagement & eNPS Analytics**
  - Overall and driver-level engagement and eNPS scores (`reports`, `click_house/survey_analytics` models).
  - Heatmaps by demographics, dynamic filters, dashboards, and manager dashboards.
  - Lifecycle and time-series analysis across multiple surveys and stages.

- **Text Feedback & Thematic Analysis**
  - Feedback modules for star, read, sentiment, driver tagging, and exports.
  - Word clouds, text responses, topic breakdown, and specialized IHCL views.
  - Thematic Analysis Dashboard for codebook → themebook pipeline with OpenAI and PostgreSQL.

- **Lifecycle, Pulse & Autopilot Programs**
  - Pulse surveys, pulse reporting, autopiloted cohort-based sends for employees and candidates.
  - Lifecycle reporting (time-series, stage summaries, disengaged analysis, demographic participation).

- **Integrations & Channels**
  - Slack & Microsoft Teams connections for surveys and notifications (`integrations` routes).
  - Google Contacts import, SSO/SAML, email delivery configuration (including SMTP).
  - Sync services (e.g., employee sync), Totango-Slack integration, third-party data sources via Winsight and Cooper.

- **Cost & Notification Analysis**
  - Cost analysis module for channel/provider breakdown and trends.
  - Notification metrics and exports per survey.

- **AI & Assistant Layer**
  - Cooper (MCP-based analytics assistant).
  - Hummer (interview intelligence and hiring analytics).
  - Winsight (customer renewal insights).
  - Thematic Analysis Dashboard (feedback theming).

### Non-Goals (Inferred)

- Full HRIS or ATS replacement (focus is on engagement, feedback, and analytics rather than core HR record-keeping).
- General-purpose text analytics or BI platform; the tooling is specialized for employee engagement, feedback, and survey data.
- On-prem custom infra management for arbitrary stacks (core model is cloud-hosted app with well-defined services and pipelines; on-prem not explicitly documented).

### Packaging / Editions and Billing Touchpoints

- **Lite module**: There is a `lite` namespace (controllers and routes) that appears to represent a lighter-weight or PLG-style version of survey setup, reports, and feedback (`lite/*` controllers and `/lite/*` routes).
- **Engines / Engine Types**: `engine_type`-scoped routes (e.g., candidate engine) suggest multiple "engines" (employee vs candidate, possibly others) share underlying capabilities.
- **Billing/licensing**: No explicit billing or pricing model could be confirmed from reviewed sources.  
  - **Status**: **Unknown (not found in reviewed sources)**.

---

## System Architecture (High-Level)

### Component Diagram (Textual)

- **Core Monolith**
  - `culturemonkey` (Rails 6.1, Ruby 3.1, PostgreSQL, Redis, Sidekiq/Delayed Job, Elasticsearch, ClickHouse).
  - Handles tenant management, accounts, surveys, responses, reports, feedback, lifecycle, integrations, and admin UI.

- **Data & Analytics Layer**
  - **PostgreSQL**: Primary OLTP store for accounts, employees, surveys, responses, feedback, and configuration.
  - **ClickHouse** (`click_house/*` models): Optimized analytical tables for survey scores, participation, and demographic analytics.
  - **Elasticsearch**: Search and possibly text aggregation (via `elasticsearch-*` gems and `config/elasticsearch.yml` in multiple Rails services).
  - **Redis**: Caching and background job queues.

- **Surrounding Services**
  - **`report-service` / `report-service-eu`**: Node services for generating survey reports (PDF, PPTX, D3 visualizations) powered by Redis/Bull queues.
  - **`notification_service`**: Rails service (Gemfile + config) focused on delivering notifications and tracking metrics.
  - **`cm-sync-service`**: Node (or similar) employee sync service to mirror HRIS data into CultureMonkey.
  - **`data-reporting` (Thematic Analysis Dashboard)**: Python + Streamlit app using PostgreSQL + OpenAI for thematic analysis workflows.
  - **`cm-askcooper`**: Node/TypeScript MCP server (`culturemonkey-mcp-server`) + Express backend (`cooper-backend`) + chat UI (`cooper-chat-ui`) for the Cooper assistant.
  - **`Hummer` / `Hummer-UI`**: Next.js + Node backend for HR analytics and interview intelligence.
  - **`winsight`**: Node backend + Next.js frontend for customer insights and renewal prediction.
  - **`totango-service`**: Node AWS Lambda integration for Totango → Slack.
  - **`cm-observability`**: Grafana, Prometheus, Zipkin/Tempo and SSL configuration for monitoring Rails and ancillary services.

- **Infra & Operations**
  - Rails apps deploy with Capistrano and Puma (`capistrano*`, `puma` gems).
  - Observability via Prometheus exporter (`prometheus_exporter` gem), Zipkin tracer (`zipkin-tracer`), New Relic (`newrelic_rpm`), and `cm-observability` Grafana setups.
  - Background jobs via Sidekiq and Delayed Job (`sidekiq`, `delayed_job_active_record`, `better_delayed_job_web`).

### Major Modules / Services and Responsibilities

- **`culturemonkey` (Rails)**  
  - Tenants, accounts, admins.
  - Employees and attributes; imports and complex filters.
  - Surveys, templates, translations, channels, notifications, and reminders.
  - Responses and feedback (including NPS, eNPS, custom NPS).
  - Reports (summary, detailed, lifecycle, IHCL-specific, manager buckets, cost analysis).
  - Lifecycle analytics and employee journey reports.
  - Integrations (Slack, Teams, Google Contacts, SSO, SAML).
  - Org hierarchy and complex filters.
  - Cost analysis and provider analysis.

- **`culturemonkey-xhale`, `culturemonkey-master`**
  - Rails apps sharing similar stack and ignore patterns; likely environment-specific or forked variants (e.g., EU instance, legacy vs current).
  - **Status of exact roles**: **Unknown (not found in reviewed sources beyond standard Rails scaffolding and shared ignore list).**

- **`Hummer` & `Hummer-UI`**
  - AI-powered HR analytics and interview intelligence.
  - Hummer-UI: Next.js frontend for project, interview, and candidate flows.
  - Hummer backend (`Hummer` repo): Node app using Sequelize for persistence, integrating with Thar AI, OpenAI, Apollo API, S3, etc.

- **`winsight`**
  - AI-powered customer insights platform for CS teams.
  - Gathers signals from Gmail, Slack, Totango, Redash/CM, and product usage.
  - Provides renewal prediction, risk assessment, TAM performance, and recommendations.

- **`cm-askcooper / Cooper`**
  - Conversational analytics assistant for CultureMonkey data via MCP.
  - Connects directly to CultureMonkey analytical schema in PostgreSQL with anonymity enforcement and read-only DB access.

- **`data-reporting` (Thematic Analysis Dashboard)**
  - Thematic analysis of employee feedback using codebook + themebook methodology.
  - Multi-tenancy across tenant schemas with anonymity thresholds.

- **`cm-sync-service`**
  - Synchronizes employees between external systems and CultureMonkey core.

- **`notification_service`, `report-service`, `report-service-eu`, `cost_analysis_service`**
  - Notification delivery and tracking.
  - Report generation (PDF, PPTX, D3).
  - Cost and provider analysis.

- **`cm-observability`**
  - Centralized observability infrastructure: Grafana, dashboards, SSL migration guides, and remote monitoring configs.

### Deployment Model, Environments, Tenancy

- **Deployment model**
  - Rails monoliths likely deployed on Linux hosts with Puma and Capistrano (`capistrano*`, `puma` gems, PM2 guides for some Node services).
  - Node-based services sometimes deployed as Lambdas (`totango-service`) or containerized services (Winsight, Hummer, Cooper).
  - Some services have explicit Heroku/AWS/Vercel/S3 deployment guidance (`winsight` README).

- **Environments**
  - Explicit docs for dev and local environments across repos (Node & Python quickstarts).
  - Production behavior inferred from Capistrano and New Relic configurations.
  - EU vs non-EU separation implied by `report-service-eu`, `cm-observability` SSL EU guide, and possibly `culturemonkey-xhale`/`culturemonkey-master`.

- **Tenancy model**
  - Rails uses `ros-apartment` for schema-based multi-tenancy on PostgreSQL.
  - Thematic Analysis Dashboard uses multiple tenant schemas.
  - Cooper’s MCP server expects `tenant_{id}`-style schemas and enforces per-tenant isolation.
  - Winsight and Hummer have their own tenant/customer/candidate constructs.

---

## Deep Dive by Domain / Module

Below, "Unknown" means the specific detail could not be confirmed from reviewed (non-ignored) sources.

### 1. Surveys & Audience Management

**What it does**

- Enables admins to create and manage surveys, templates, and questions (`surveys`, `survey_templates`, `question*` models/controllers).
- Manages participants and audiences, including imports and segmentation (`employees`, `participants`, `employee_imports`, `audience` routes).
- Supports multiple languages and translation layers for questions, sections, and emails (`survey_translations/*`, `survey_form_element_translations`, `translations`).

**Key Entities**

- `Survey`, `SurveyTemplate`, `Question`, `QuestionSet`, `Section`.
- `Participant`, `Employee`, `EmployeeAttributeMapping`, `Attributes`, `Locations`, `Teams`, `BusinessUnits`.
- `SurveyLanguage`, `SurveyTranslation`, `QuestionTranslation`, `ScaleOfRating`, `ScaleOfRatingTranslation`.
- `EmailTemplate`, `EmailTemplateTranslation`, `SurveyNotification`.

**Important Flows**

1. **Survey Creation**
   - Admin creates or clones a survey (`surveys#new/create`, `survey_templates#copy_survey`).
   - Questions and sections are added, optionally via import (`import_questions`) and templates.
   - Translations are managed via `survey_translations/*` controllers and translation previews.

2. **Audience Setup**
   - Employees imported or synced (`employees`, `employee_imports`, `remove_participants`).
   - Complex filters (`complex_filters`, `heatmap_complex_filters`) define report and targeting segments.
   - Participants associated with surveys via `participants` controllers.

3. **Scheduling & Reminders**
   - Reminders configured via `manual_reminders` and `automate_reminders` routes and engine equivalents.
   - Autopilot for lifecycle and segments (`autopilots` standard and candidate engines).

**Config / Feature Flags**

- Many account-level settings under `/settings` scope:
  - Languages, locations, drivers, act filters, heatmap settings, translations, mail settings.
- Engine-specific flags via `engine_type` parameter and `engines/*` controllers.
- Deeper flags (e.g., Kafka, S3 creds, app config) are in ignored configs, so:
  - **Detailed config map**: **Unknown (not found in reviewed sources; sensitive files ignored).**

**Failure Modes & Edge Cases**

- Participant import validation errors requiring error-file download (`download_error_file` routes).
- Survey translations missing or misconfigured leading to fallback or preview errors.
- Reminder misconfigurations (one-time vs recurring) possibly leaving surveys under- or over-notified.

**Where to Look**

- `culturemonkey/app/controllers/surveys_controller.rb`, `survey_templates_controller.rb`, `participants_controller.rb`.
- `culturemonkey/app/models/survey.rb`, `survey_template.rb`, `question.rb`, `participant.rb`, `employee.rb`.
- Routes around `/surveys/*`, `/settings/*`, `/employees-import*`, engine-type scopes.

---

### 2. Reporting & Analytics (Engagement, eNPS, Drivers, Lifecycle)

**What it does**

- Provides dashboards and reports for engagement scores, eNPS, participation, driver-level breakdowns, and time-series.
- Offers lifecycle analytics (hire-to-retire journey) and segment/lifecycle reports.
- Produces manager dashboards, snapshots, NPS reports, and dynamic reports.

**Key Entities**

- `ReportToolkit`, `ReportDownloadDetail`, `ManagerBucket`, `ManagerDriverTarget`, `Snapshots`.
- ClickHouse models for survey analytics:
  - `ClickHouse::SurveyAnalytics::Score::*`, `ClickHouse::SurveyAnalytics::Report`, `ClickHouse::SurveyAnalytics::Participation`.
- Lifecycle domain models: `LifecycleSurvey`, `LifecycleTemplate`, `LifecycleSchedule`, `LifecycleAnalytics` controllers.
- NPS/eNPS: `EnpsBenchmark`, `EnpsAnswer`, `CustomEnps`, `CustomEnpsAnswer`.

**Important Flows**

1. **Core Reports**
   - `/reports` and `/dashboard` routes for overview, detail, questions, feedback, and exports.
   - Heatmaps and driver drilldowns via `reports#heatmap*` and `reports/heatmap_controller`.
   - IHCL-specific dashboards via `ihcl/reports`.

2. **Lifecycle Reports**
   - `/lifecycle/reports` for summary, driver analysis, disengaged analysis, and time series (`lifecycle` controller).
   - Engine-specific lifecycle analytics under `engines/lifecycle_analytics`.

3. **Employee, Manager & NPS Reports**
   - Employee journey and driver performance via `employee_reports/*`.
   - Manager buckets and manager dashboards for comparing managers and segments.
   - NPS reports via `nps_reports` and `enps_benchmark` controllers.

4. **Optimized Reports**
   - Engine-type-scoped `reports` under `/employee/reports` and `engines/reports` for newer or more optimized views.

**Config / Feature Flags**

- Complex filters, dynamic filtering options, and heatmap settings under `complex_filters` and `/settings/heatmap`.
- Benchmarks (industry, custom) through `industry_benchmarks`, `enps_benchmark`, and translations.

**Failure Modes & Edge Cases**

- Large surveys or dense demographics leading to slow or heavy ClickHouse and report queries.
- Export limits: long-running PDF/PPT(X) exports via `report-service` might time out or require retry.
- Lifecycles with missing or inconsistent stage definitions leading to incomplete lifecycle analytics.

**Where to Look**

- `culturemonkey/app/controllers/reports*`, `reports/*`, `lifecycle_controller.rb`, `employee_reports_controller.rb`.
- `culturemonkey/app/models/click_house/*` for data modeling and query patterns.
- `report-service` and `report-service-eu` READMEs and code for export behavior.

---

### 3. Feedback & Text Responses

**What it does**

- Captures feedback via surveys and dedicated feedback endpoints.
- Provides structured feedback summaries, topics, word clouds, sentiment, and driver mapping.
- Features text response module with star, sentiment, driver assignments, and exports.

**Key Entities**

- `Feedback`, `FeedbackAspect`, `FeedbackDriver`, `FeedbackKeyword`, `FeedbackSynopsis`.
- `SmallFeedback` and `FakeFeedback` (likely archiving/sample models).
- `Feedback::TextResponses` controllers for modular text response views.

**Important Flows**

1. **Collection**
   - Feedback routes at `/feedback*` and `feedback` controllers.
   - Employee-facing feedback view at `/e/feedback/:key`.

2. **Analysis & Display**
   - Wordcloud endpoints (`feedback#word_cloud`, `reports#word_cloud`).
   - Topic and sentiment breakdowns via `feedback#topic` and `feedback#driverstats`.
   - Text responses module (`feedback/text_responses#index` and optimized equivalents under `/employee/reports/:survey_id/text-responses`).

3. **Export**
   - CSV exports of feedback, free-text answers, and question comments.

**Config / Feature Flags**

- Feedback translation flags and translations under `/settings/translations/*` controllers.
- Text response module design documented in routes comments, but internal config in ignored init files:
  - **Exact feature switches**: **Unknown (not found in reviewed sources).**

**Failure Modes & Edge Cases**

- Large free-text volumes impacting Elasticsearch and text response pages.
- Translation or language mismatch causing incomplete or mixed-language feedback views.

**Where to Look**

- `culturemonkey/app/controllers/feedback_controller.rb`, `feedback/text_responses_controller.rb`, `reports/feedback_controller.rb` (paths present but content not opened if ignored; non-ignored variant under `reports/feedback` is used).
- `culturemonkey/app/models/feedback*`.

---

### 4. Lifecycle & Pulse Programs

**What it does**

- Automates lifecycle-based survey programs (e.g., onboarding, exit, periodic pulses).
- Supports pulse surveys and specialized pulse reporting.

**Key Entities**

- `PulseSurvey`, `PulseSchedule`, `PulseReminder`, `PulseParticipant`, `PulseQuestion`, `PulseAnswer`, `PulseQuestionBank`.
- `LifecycleSurvey`, `LifecycleTemplate`, `LifecycleSchedule`.
- `Autopilot` models and controllers (both core and candidate engine versions).

**Important Flows**

1. **Pulse Surveys**
   - Created and managed via `pulse_surveys` controllers.
   - Pulse responses on dedicated routes (`/pulse_responses/:key`).
   - Reporting under `/pulse_surveys/reports*`.

2. **Lifecycle Programs**
   - Lifecycle templates define stages and cohorts.
   - Autopilot lifecycle settings manage targeting and scheduling (`autopilots#lifecycle*`).
   - Lifecycle reports and analytics via `lifecycle` and `engines/lifecycle_analytics`.

**Config / Feature Flags**

- Autopilot settings, lifecycle activation/disablement, and thresholds configured via `autopilots` controllers and routes.
- Certain lifecycle-specific configs likely in ignored YAML/initializer files:
  - **Exact schedule/threshold config**: **Unknown (not found in reviewed sources).**

**Failure Modes & Edge Cases**

- Overlapping lifecycle definitions causing participant duplication or gaps.
- Pulse reminders misconfigured (e.g., sending to outdated cohorts).

**Where to Look**

- `culturemonkey/app/controllers/pulse_surveys_controller.rb`, `lifecycle_controller.rb`, `autopilots_controller.rb`, `engines/candidates/autopilots_controller.rb`.
- `culturemonkey/app/models/pulse_*`, `lifecycle_*`.

---

### 5. Org Hierarchy, Employee Analytics & Manager Buckets

**What it does**

- Provides org hierarchy visualization and filters for reporting.
- Offers "manager buckets" and employee journey analytics.

**Key Entities**

- `OrgHierarchy` controllers and Org tree models (`employee_org_tree`, `manager_bucket`, `manager_mapping`).
- `ManagerBucket` and supporting models for bucketed manager analytics.
- Employee reports models & controllers.

**Important Flows**

1. **Org Hierarchy**
   - Org tree built and navigated via `org_hierarchy` routes, with filters and drilldowns.
   - Exports for manager-level breakdowns and performance.

2. **Manager Buckets**
   - Buckets categorize managers by performance, gender, generation, etc.
   - API routes provide top feedbacks, questions, hi-pot managers, and demographic breakdowns.

3. **Employee Journey**
   - Employee-specific reports show journey, driver performance, and demographic filters.

**Config / Feature Flags**

- Org hierarchy filter and export behavior controlled in `org_hierarchy` controllers and related settings.

**Failure Modes & Edge Cases**

- Incorrect or incomplete employee attribute mappings resulting in missing nodes or wrong bucket assignments.
- Large organizations leading to slow or heavy tree computations.

**Where to Look**

- `culturemonkey/app/controllers/org_hierarchy_controller.rb`, `manager_buckets_controller.rb`, `employee_reports_controller.rb`.
- `culturemonkey/app/models/manager_bucket.rb`, `employee_org_tree.rb`, `employee_attribute_mapping.rb`.

---

### 6. Integrations & Channels

**What it does**

- Integrates with Slack, Microsoft Teams, Google Contacts, SSO/SAML, mail providers, and external HR/CS systems.

**Key Entities & Integrations**

- **Slack & Teams**: `integrations` routes for onboarding/deactivating Slack/Teams; Slack event revocation handling.
- **Google Contacts**: Google OAuth-based import and clear flows (`google_contacts` scope).
- **Totango-Slack** (`totango-service`):
  - AWS Lambda + EventBridge job that fetches Totango touchpoints and posts to Slack channels on an hourly schedule.
- **SSO & SAML**:
  - SSO flow via `sso` controller and SAML login/logout/metadata/ACS endpoints (`saml` and internal SAML controllers).
- **Email & SMTP**:
  - Account-level mail configuration, SMTP send-from setup under `/settings/mail_config`, `accounts/smtp_settings`, and candidate engine `mail_config`/`smtp_config`.
- **Cooper MCP**:
  - `cm-askcooper/culturemonkey-mcp-server` exposing analytic tools (metrics, participation, eNPS, sentiment, drivers, trends, demographics, comparisons, predictive tools).
- **Winsight**:
  - Gmail, Slack, Totango, Redash/CM, and product usage for customer insights.

**Important Flows**

1. **Slack & Teams**
   - Admins onboard Slack/Teams, configure channels, and send surveys or notifications.
   - Events from Slack are processed for revocation and notifications (e.g., `slack/revoked`).

2. **Google Contacts**
   - OAuth-based contact import that feeds into employee and audience definitions.

3. **Totango-Slack Lambda**
   - EventBridge schedules Lambda hourly.
   - Lambda calls Totango API, stores touchpoints in DynamoDB, and posts messages to Slack via webhook.

4. **Cooper Analytics Flow**
   - User → `cooper-chat-ui` → `cooper-backend` → `culturemonkey-mcp-server` → PostgreSQL.
   - Cooper selects appropriate MCP tools (engagement, participation, drivers, sentiment, etc.) based on natural language queries.

**Config / Feature Flags**

- Integration settings for Slack/Teams, API tokens, and webhooks are stored in ignored config/secret files:
  - **Specific environment variables and credentials**: **Unknown (not found in reviewed sources; intentionally ignored).**

**Failure Modes & Edge Cases**

- OAuth and token expiration issues (Slack, Google).
- Webhook misconfigurations for Slack/Totango.
- SSO/SAML misconfig leading to login loops or metadata mismatches.

**Where to Look**

- `culturemonkey/app/controllers/integrations_controller.rb`, `google_contacts_controller.rb`, `sso_controller.rb`, `saml_controller.rb` (paths known; content in some is ignored).
- `totango-service/README.md`.
- `cm-askcooper/README.md` and MCP server docs.

---

### 7. Advanced Analytics & AI Apps

#### Thematic Analysis Dashboard (`data-reporting`)

**What it does**

- Streamlit app for thematic analysis of employee feedback using OpenAI.
- Provides interactive coding (semantic codes) and theming (themes from codes) with anonymized demographic groupings.

**Key Concepts & Entities**

- Codebook (codes + definitions).
- Coded responses (response_id, codes, sentiment, driver, demographics).
- Themebook (themes name + codes + description).
- Tenants, surveys, and response types.

**Important Flows**

1. **Load Data**
   - Select customer (tenant), survey, and response type.
   - Data loaded via SQL queries from PostgreSQL, cached to CSV.

2. **Step 1 – Generate Codes**
   - Filters by sentiment and (optionally) test-mode record limits.
   - Processes responses in batches, updating codebook and coded CSV.

3. **Step 2 – Thematic Analysis**
   - Groups coded responses by overall, driver, question, or demographic.
   - When grouping by demographic, uses anonymity threshold (min distinct employees).
   - Generates themes for each group × sentiment slice using OpenAI with JSON schemas.

4. **Representative Quotes**
   - Selected via embeddings (OpenAI embeddings model) for each theme.

**Config / Feature Flags**

- Database and OpenAI API key via `.env` (ignored by policy).
- Configurable OpenAI model, batch size, and test mode via sidebar and `settings.json`.

**Failure Modes & Edge Cases**

- DB connection or query failures due to `.env` misconfiguration.
- Hitting OpenAI rate limits or timeouts (mitigated via batch size and test mode).
- Missing required columns like `employee_id`, `driver`, `question`.

**Where to Look**

- `data-reporting/README.md`, `docs/END_USER.md`, `docs/DEVELOPER.md`, `docs/ANALYST.md`.

#### Hummer (HR Analytics & Interview Intelligence)

**What it does**

- AI-powered interview and candidate evaluation platform integrated with internal Thar AI and OpenAI.
- Manages projects, candidates, interview plans, scorecards, transcripts, and AI insights.

**Key Entities**

- Projects, candidates, interview plans, interview templates, scorecards.
- Transcripts and AI insights stored in S3 and PostgreSQL.

**Important Flows (Milestones)**

1. **Interview Lifecycle & Insights**
   - Interviews created per candidate with meeting URLs.
   - Meeting bots record and upload transcripts to S3.
   - Insights: summaries, scores, CTC data, tools, sentiment, keywords.

2. **Projects & Candidate Management**
   - Projects include role, experience, location; Thar AI generates JD via OpenAI.
   - Candidates added to projects with static interview plans and scorecards.
   - Insights enhanced with question-driven answers from Thar AI.

3. **Dynamic Plans & PLG**
   - Template-based and AI-suggested interview plans and scorecards.
   - Prompt management console and responsibilities/skills wizard.
   - Bulk candidate addition with Apollo API enrichment.
   - Multi-tenant support, roles, WebSockets, and dashboards.

**Where to Look**

- `Hummer-UI/README.md`, `Hummer-UI/docs/hummer_about.md`, `Hummer/README.md`.

#### Winsight (Customer Insights)

**What it does**

- AI-powered internal tool for renewal and retention insights for enterprise customers.
- Uses Gmail, Slack, Totango, Redash/CM, and usage metrics to score risk and generate recommendations.

**Key Entities**

- `Customer` (with sentiment, lifecycle, contract metadata).
- Insights: renewal prediction, TAM performance, NPS recommendations, risk assessments.

**Important Flows**

- Email analysis via Gmail API.
- Insight generation via OpenAI based on multi-source inputs.
- Customer management via Node + Express backend and Next.js frontend.

**Where to Look**

- `winsight/README.md`.

#### Cooper (AI Engagement Assistant)

**What it does**

- AI assistant that exposes CultureMonkey survey analytics via a chat UI.
- Uses MCP tools to enforce structured access and anonymity.

**Key Entities**

- MCP tools such as `get_metrics`, `get_participation`, `get_enps`, `get_sentiment`, `get_trends`, `get_demographics`, `get_manager_effectiveness`, predictive tools.

**Important Flows**

- User chat → `cooper-backend` (LLM prompt) → MCP tool selection → PostgreSQL queries via `culturemonkey-mcp-server`.
- Anonymity enforcement and logging at MCP layer.

**Where to Look**

- `cm-askcooper/README.md`, `cm-askcooper/culturemonkey-mcp-server/*`.

---

## APIs & Integrations

### Public / Internal APIs

- **Rails API Layer**
  - Grape-based API with Swagger docs (`grape`, `grape-swagger`, `grape-active_model_serializers`, `grape_on_rails_routes`).
  - `Api::Base` is mounted at root (`mount Api::Base, at: "/"` in `routes.rb`), exposing internal API endpoints (exact endpoints not enumerated from ignored file `app/controllers/api/v1/private.rb`).
  - **Detailed public API list**: **Unknown (not found in reviewed sources; some controllers ignored).**

- **Cooper MCP**
  - Tools-based API for engagement metrics, drivers, sentiment, demographics, trends, comparisons, and predictive analytics.
  - Auth model: backend uses OpenAI API keys; DB uses read-only credentials and SSL (documented in `.env.example`).

- **Winsight API**
  - Authentication endpoints (`/api/auth/login`, `/api/auth/verify`, etc.).
  - Customer, Gmail, and AI insights endpoints with JWT-based auth.
  - Rate limiting not explicitly documented; likely to be added via Express middleware.

### Auth Methods

- **Core Web App**
  - Session-based auth with bcrypt and `sessions`/`admins` controllers.
  - SAML SSO endpoints providing SAML-based SSO.
  - `cancancan` for role/permissions enforcement in controllers.

- **APIs & Microservices**
  - JWT-based auth in Winsight backend.
  - Read-only DB users and anonymity enforcement for MCP server.

- **Rate Limits**
  - `rack-attack` gem present in core Rails app for rate limiting, but exact rules in ignored initializers:
    - **Specific rate limit policies**: **Unknown (not found in reviewed sources).**

### Third-Party Integrations

- **Totango**
  - Totango-Slack integration via AWS Lambda (`totango-service`).
  - Totango data also a source in Winsight.

- **Slack & Microsoft Teams**
  - Survey sending, notifications, and possibly feedback collection via Slack/Teams.
  - Onboarding and deactivation flows via `integrations` controllers.

- **Gmail & Google APIs**
  - Email analysis via Gmail API for Winsight.
  - Google Contacts import for employee data.

- **OpenAI & AI**
  - Thematic Analysis Dashboard, Hummer, Winsight, and Cooper use OpenAI for structured outputs and embeddings.

- **Other**
  - Mixpanel, Twilio, AWS S3, AWS Lambda, Google Cloud Language/AutoML, MaxMind, New Relic, Prometheus, Zipkin.

### Example Patterns

- HTTP JSON APIs (Node/Express & Rails) for metrics, customers, insights, etc.
- Structured MCP tools using JSON schemas for request/response (Cooper and Thematic Analysis).

---

## Data & Storage

### Datastores

- **PostgreSQL**
  - Primary OLTP store in Rails app and MCP server.
  - Multi-tenant via `ros-apartment` (schema-based).
  - Thematic Analysis Dashboard uses PostgreSQL as analytic source with tenant schemas.

- **ClickHouse**
  - For survey analytics (scores, participation, dimensioned slices) as seen in `click_house/*` models.
  - Ownership: core analytics team; used primarily by reports and dashboards.

- **Elasticsearch**
  - Search and analytics for survey and feedback data, with `elasticsearch-rails`, `elasticsearch-model`, `elasticsearch-persistence` gems.
  - Config in ignored `config/elasticsearch.yml`.

- **Redis**
  - Caching and job queuing (Rails ActionCable, Sidekiq, Delayed Job, Node bull).

- **DynamoDB**
  - For Totango touchpoints in the Lambda integration.

- **File Storage**
  - AWS S3 for transcripts (Hummer) and other binary artifacts.
  - Local filesystem for codebooks, themebooks, settings (`data-reporting/storage/*`).

### Events / Queues / Streams

- **Background Jobs**
  - `sidekiq` and `delayed_job_active_record` in core Rails.
  - `better_delayed_job_web` UI.

- **Streaming / Kafka**
  - `config/initializers/kafka.rb` is explicitly ignored, but Kafka is referenced in docs and observability:
    - **Exact topics and schemas**: **Unknown (not found in reviewed sources; initializer ignored).**

- **Node Queues**
  - Bull (Redis-backed) in `report-service` for dashboard and report processing.

### Data Retention & Privacy

- Thematic Analysis Dashboard enforces minimum employee counts (default 3) for demographic slices and excludes smaller groups.
- Cooper’s MCP server uses anonymity settings (default min responses, enforcement flags) and logs anonymity checks.
- Data retention policies for production DB, ClickHouse, and logs:
  - **Explicit policies**: **Unknown (not found in reviewed sources).**

---

## Security, Compliance, and Privacy

### AuthN / AuthZ

- **Core Rails**
  - Session-based auth (admins, managers, employees).
  - Roles and permissions enforced via `cancancan`.
  - Two-factor or OTP features inferred from email verification & OTP routes for responses.

- **SSO & SAML**
  - Dedicated SAML endpoints for login, logout, metadata, and internal SAML flows.
  - SAML certificates and keys present but ignored (`saml_certificate.crt`, `saml_private_key.key`).

- **AI & External Apps**
  - JWT-based auth for Winsight.
  - Cooper backends rely on server-side keys (OpenAI, DB).

### Secrets Handling

- Sensitive configs and credentials are stored in:
  - `config/credentials.yml.enc`, `config/master.key`.
  - `service-credentials.json`, `translation-api-credentials.json`, `config/app_config.yml`, and other YAML/JSON configs.
- All of these files are explicitly ignored and were not opened or processed.

### Compliance Posture

- PCI/SOC2/GDPR-specific docs are not visible in reviewed sources:
  - **Formal compliance certifications**: **Unknown (not found in reviewed sources).**

### Privacy

- Strong emphasis on anonymity in:
  - Thematic Analysis Dashboard (anonymity thresholds, `employee_id`-based uniqueness).
  - Cooper MCP server (min responses, anonymization, log of anonymity checks).
- Configuration for PII masking and privacy appears in winsight backend PII masking docs and internal guides, but not fully enumerated here.

---

## Operations & Reliability

### Observability

- **Metrics & Tracing**
  - `prometheus_exporter` and `zipkin-tracer` in Rails monolith.
  - Grafana dashboards in `cm-observability/grafana/*`.
  - SSL migration guides for `.io` and `.eu` domains in `cm-observability/SSL_config_docs`.

- **Error Tracking**
  - `sentry-raven` gem for Rails error reporting.
  - New Relic via `newrelic_rpm`.

- **Logging**
  - Standard Rails logging.
  - Winston logger in Winsight backend.

### SLOs / SLAs

- No explicit SLO/SLA docs found:
  - **SLO/SLA definitions**: **Unknown (not found in reviewed sources).**

### Backup / Restore / DR

- DB backup and DR strategy not documented in accessible files:
  - **Exact procedures**: **Unknown (not found in reviewed sources).**

### Known Runbooks

- Winsight README includes deployment guides for Heroku, AWS EC2, Docker, Vercel, Netlify, and S3/CloudFront.
- Thematic Analysis Dashboard docs contain extensive troubleshooting (“If something goes wrong”).
- Cooper README includes troubleshooting for DB connection issues, MCP server, backend errors, and CORS/chat connectivity.

---

## Release Engineering

### CI/CD Pipelines

- GitHub Actions and Docker are mentioned for Hummer.
- Some services guide toward Heroku or AWS deployments (Winsight), but explicit CI pipelines are not detailed:
  - **Exact CI configs**: **Unknown (not found in reviewed sources).**

### Branching & Versioning

- Conventional commit messages and standard Git workflows recommended in Winsight docs.
- No enforced branching model (e.g., GitFlow) specified:
  - **Branching policy**: **Unknown (not found in reviewed sources).**

### Deployment & Rollback

- Rails:
  - Capistrano + Puma with deploy scripts (Capistrano gems).
  - Delayed Job and Sidekiq likely managed by systemd/upstart/PM2-equivalent tools.
- Node services:
  - Deployed via Docker, PM2, or platform-specific methods (Heroku, AWS EC2, Vercel, etc.).
- Rollback often implicit via deploy tooling (Capistrano releases, PM2 `delete`/rollback) but not fully documented:
  - **Formal rollback procedure**: **Unknown (not found in reviewed sources).**

---

## Repo Map & Ownership

| Repo | Purpose | Tech Stack | Key Directories | Owner/Team (if visible) |
|------|---------|-----------|-----------------|--------------------------|
| `culturemonkey` | Core multi-tenant employee engagement platform: surveys, responses, reports, lifecycle, feedback, integrations | Ruby 3.1, Rails 6.1, PostgreSQL, Redis, Sidekiq, DelayedJob, Elasticsearch, ClickHouse | `app/models`, `app/controllers`, `config/routes.rb`, `app/views`, `click_house/*` | **Unknown** |
| `culturemonkey-xhale` | Rails app sharing same stack; likely environment-specific or tenant-specific variant | Same as above | Standard Rails layout | **Unknown** |
| `culturemonkey-master` | Another Rails instance mirroring main CultureMonkey app (possibly primary production or reference) | Same as above | Standard Rails layout | **Unknown** |
| `Hummer` | Backend for Hummer HR analytics/interview platform | Node.js, Sequelize, PostgreSQL, S3, Thar AI/OpenAI | `src/` (not fully enumerated), migrations | **Unknown** |
| `Hummer-UI` | Next.js frontend for Hummer HR analytics | Next.js (App Router), TypeScript, Tailwind, Redux Toolkit | `app/components`, `app/services`, `app/store`, `app/hooks`, `app/context`, feature modules | **Unknown** |
| `cm-askcooper` | Cooper AI assistant for CultureMonkey analytics | Node/TypeScript, MCP, Express, PostgreSQL, OpenAI | `culturemonkey-mcp-server`, `cooper-backend`, `cooper-chat-ui` | **Unknown** |
| `data-reporting` | Thematic Analysis Dashboard for feedback | Python 3.11, Streamlit, PostgreSQL, OpenAI | `thematic_analysis_dash/*` | **Unknown** |
| `cm-sync-service` | Employee synchronization service for CultureMonkey | Node (per README and `.env.example`) | `src/` (not fully enumerated) | **Unknown** |
| `notification_service` | Rails service for notifications and possibly metrics | Ruby on Rails, PostgreSQL, Elasticsearch | `app/*`, `config/*` | **Unknown** |
| `report-service` | Node service generating survey reports | Node 14, Redis, Bull, PDFKit, D3.js, pptxgenjs | Root `index.js` (not shown), `queue` configs | **Unknown** |
| `report-service-eu` | EU variant of report-service | Same as `report-service` | Similar structure | **Unknown** |
| `totango-service` | Totango → Slack integration Lambda | Node.js 20.x, AWS EventBridge/Lambda/DynamoDB, Slack, Totango | Root Lambda source | **Unknown** |
| `cm-observability` | Observability module for CultureMonkey | Grafana, Prometheus, SSL | `grafana/*`, `SSL_config_docs/*` | **Unknown** |
| `winsight` | AI-powered customer insights platform (retention, renewal, TAM performance) | Node.js (Express), PostgreSQL (Sequelize), Next.js, OpenAI, Gmail, Slack, Totango | `backend/src`, `frontend/src` | **Unknown** |
| `cm-ghost-themes` | Blog/themes for marketing/content | Ghost themes, JS/CSS | `guides/*`, `blog/*` | **Unknown** |
| `cm-md-generator` | Markdown generation/cleanup tooling | Python (from docs) | Root | **Unknown** |
| `cm_cdn-files` | CDN-accessible static files | Static assets | Root | **Unknown** |
| `cm_benchmark`, `cost_analysis_service`, `aggregators_jobs`, etc. | Internal tools and services (benchmarks, cost analysis, aggregations) | Rails, Node, Java, etc. | `config/*`, `app/*`, `src/*` | **Unknown** |

> Ownership fields are left **Unknown** because explicit team mapping was not present in reviewed sources.

---

## How to Run Locally (Developer Quickstart)

### Core CultureMonkey Rails App

- **Prereqs**
  - Ruby 3.1, Rails 6.1, PostgreSQL, Redis, Node/Yarn for assets.
- **Setup**
  1. Install Ruby and bundler.
  2. Install Postgres and Redis.
  3. From `culturemonkey/`:
     - `bundle install`
     - Configure DB in `config/database.yml` (**ignored and not opened**) and run migrations.
  4. Start background workers (Sidekiq/DelayedJob) and WebSocket server (ActionCable).
- **Run**
  - `rails server` with appropriate environment variables and DB configuration.
- **Tests**
  - Use `rspec` or Rails tests (gems present imply system tests with Capybara, chromedriver).

### Hummer

- **Backend**
  - Node 20.3.0; `npm install`; configure `.env` (DB credentials, S3, Thar AI, OpenAI); run `npm run dev`.
- **Frontend (Hummer-UI)**
  - `pnpm install`, `pnpm dev`.

### Winsight

- Node 18+, PostgreSQL 12+.
- `npm run install:all` in `winsight/`.
- Configure `backend/.env` and DB.
- `npm run setup:db`, then `npm run dev` or `npm run dev:backend` + `npm run dev:frontend`.

### Cooper

- MCP server: `cd culturemonkey-mcp-server && npm install && npm run build`.
- Backend: `cd cooper-backend && npm install && npm run build && npm start`.
- Chat UI: `cd cooper-chat-ui` and serve `index.html` via `http-server` or similar.

### Thematic Analysis Dashboard

- Python 3.11+.
- From `thematic_analysis_dash/`:
  - Create virtualenv, `pip install -r requirements.txt`.
  - Configure `.env` (DB & OpenAI keys).
  - Run `streamlit run main.py`.

### Common Troubleshooting (Top 10)

1. **DB connection errors** (Rails, Cooper, Thematic Dashboard, Winsight):
   - Check Postgres running and `.env`/config values.
2. **Missing migrations / schema mismatch**:
   - Run migrations and schema updates; ensure ClickHouse schema up to date.
3. **OpenAI failures**:
   - Check `OPENAI_API_KEY` and model names; reduce batch size or enable test mode (Thematic Dashboard).
4. **Redis/queue outages**:
   - Ensure Redis is running; check Sidekiq/DelayedJob/Bull dashboards.
5. **Port conflicts**:
   - Confirm default ports (3000/3001/8501) free; adjust env configs if needed.
6. **CORS or chat UI errors (Cooper/Winsight)**:
   - Update backend URL in frontends; check browser console.
7. **Integration OAuth failures (Google/Slack)**:
   - Confirm client IDs/secrets and redirect URIs; re-authorize apps.
8. **SSL or domain issues**:
   - Follow `cm-observability` SSL migration guides; verify certs.
9. **Report export failures**:
   - Validate `report-service` running and Redis queue; check logs for queue/backpressure.
10. **Anonymity errors (Thematic Dashboard)**:
    - Ensure `employee_id` column present and anonymity thresholds configured correctly.

---

## Known Gaps & Recommended Next Docs

- **Public API Catalog**
  - Create an OpenAPI/Swagger spec for all public and internal APIs (Rails + Node services).
- **Architecture & Data Flow Diagrams**
  - System-level diagrams covering core Rails, ClickHouse, Elasticsearch, Cooper, Hummer, Winsight, and Thematic Dashboard.
- **Tenancy & Environment Matrix**
  - Explicit mapping of which repos run in which environment (US/EU, staging/production) and how `culturemonkey-xhale`/`culturemonkey-master` differ.
- **Security & Compliance Overview**
  - One document describing auth flows, encryption, data retention, access control, and compliance posture (GDPR/SOC2).
- **Operational Runbooks**
  - Standard runbooks for:
    - DB incident handling.
    - Queue backlogs and job failures.
    - Integration outages (Slack, Teams, Gmail, Totango).
    - DR and restore procedures.
- **Release & CI/CD Overview**
  - Document CI pipelines, deploy triggers, rollback strategies, and environment promotion flows.

---

## Appendix

### Glossary

- **Tenant**: A customer organization hosted in a dedicated schema (e.g., `tenant_{id}`) in PostgreSQL.
- **Survey**: A collection of questions and participants deployed at a specific time for a tenant.
- **Pulse Survey**: Short, frequent check-in survey.
- **Lifecycle Survey**: Surveys tied to employee lifecycle events (onboarding, milestones, exit).
- **Participant**: An individual invited/responding to a survey (employee or candidate).
- **Engagement Score**: Composite measure of employee engagement across drivers/questions.
- **eNPS (Employee Net Promoter Score)**: Net promoter score applied to employee promoters, passives, detractors.
- **Driver**: A factor (e.g., recognition, workload, management) contributing to engagement.
- **Heatmap**: Visualization of engagement metrics across demographic slices.
- **Autopilot**: Feature that automates sending surveys/reminders based on rules.
- **Lifecycle Analytics**: Analysis of engagement across employment stages.
- **Codebook**: List of semantic codes and definitions used for coding responses.
- **Themebook**: List of themes derived from codes, including description and code mapping.
- **MCP (Model Context Protocol)**: Protocol for exposing structured tools to LLMs, used by Cooper.
- **Hummer**: HR analytics and interview intelligence product built on modern frontends and AI.
- **Winsight**: Internal customer insights product for renewal and retention analytics.

### Evidence Index

(Each bullet maps a key claim to the primary repo/file.)

- **Core Rails product & stack**
  - `culturemonkey/Gemfile`
  - `culturemonkey/config/routes.rb`
- **Multi-tenancy via apartment**
  - `culturemonkey/Gemfile` (`ros-apartment`, `ros-apartment-activejob`)
- **ClickHouse analytics**
  - `culturemonkey/app/models/click_house/*`
- **Surveys & participants**
  - `culturemonkey/app/models/survey.rb`, `question.rb`, `participant.rb`, `employee.rb` (filenames from `app/models` listing)
  - `culturemonkey/config/routes.rb` (`/surveys/*`, `/employees*`, `/participants*`)
- **Lifecycle & pulse flows**
  - `culturemonkey/config/routes.rb` (`/lifecycle/reports*`, `/pulse_surveys/*`, `/pulse_responses/*`)
  - `culturemonkey/app/models/pulse_*`, `lifecycle_*` (from models listing)
- **Reports & dashboards**
  - `culturemonkey/config/routes.rb` (`/reports*`, `/dashboard*`, `/manager-dashboard*`, `/nps_reports*`)
  - `culturemonkey/app/controllers/reports/*` (controller list)
- **Feedback & text responses**
  - `culturemonkey/config/routes.rb` (`/feedback*`, `/reports/:survey_id/text-responses*`, `/employee/reports/:survey_id/text-responses*`)
  - `culturemonkey/app/controllers/feedback/text_responses_controller.rb`
- **Integrations (Slack, Teams, Google Contacts)**
  - `culturemonkey/config/routes.rb` (`/slack-integration`, `/teams-integration`, `/integrations/*`, `/google_contacts/*`)
  - `totango-service/README.md`
- **SSO & SAML**
  - `culturemonkey/config/routes.rb` (`sso_authorise`, `sso/saml2/*`, `cm_internal_saml/*`)
- **Cooper architecture & tools**
  - `cm-askcooper/README.md`
  - `cm-askcooper/culturemonkey-mcp-server/TOOLS_DOCUMENTATION.md` (path noted from README)
- **Hummer product & milestones**
  - `Hummer-UI/README.md`
  - `Hummer-UI/docs/hummer_about.md`
- **Winsight product & APIs**
  - `winsight/README.md`
- **Thematic Analysis Dashboard**
  - `data-reporting/README.md`
  - `data-reporting/docs/END_USER.md`, `DEVELOPER.md`, `ANALYST.md`
- **Observability**
  - `cm-observability/README.md`
  - `cm-observability/grafana/*`
  - `culturemonkey/Gemfile` (`prometheus_exporter`, `zipkin-tracer`, `newrelic_rpm`, `sentry-raven`)
- **Totango-Slack Lambda**
  - `totango-service/README.md`

### Privacy Rule Compliance Summary

- **Where `.cursorindexingignore` was found**
  - `Hummer-UI/.cursorindexingignore`
  - `culturemonkey-xhale/.cursorindexingignore`
  - `culturemonkey/.cursorindexingignore`
  - `culturemonkey-master/.cursorindexingignore`

- **How file-name matching was applied**
  - Built a deny-list of filenames and patterns from all `.cursorindexingignore` files:
    - Explicit filenames such as `.env`, `.env.local`, `.env.production`, `.DS_Store`, `config/app_config.yml`, `config/credentials.yml.enc`, `config/database.yml`, `config/elasticsearch.yml`, `config/environment.rb`, `config/master.key`, `service-credentials.json`, `translation-api-credentials.json`, `feedback-translation-api-credentials.json`, `ms_teams_bot_app.zip`, `security.csv`, `saml_certificate.crt`, `saml_private_key.key`, etc.
    - Directory names such as `.git`, `.vscode`, `.cursor`, `node_modules`, `public`, `assets`, `static`, `mocks`, `config/locales`, `.specstory/**`.
    - Globs treated conservatively:
      - `.env*` → any filename starting with `.env`.
      - `*.log` → any filename ending with `.log`.
      - `data/*.json` → `.json` files under any `data` directory.
  - For path-like entries (e.g., `config/app_config.yml`), enforced at least filename-level exclusion (`app_config.yml`) and avoided reading the exact paths returned by glob searches for those patterns.

- **Ignored vs Processed Counts (Approximate)**  
  *(Counts are based on glob searches and explicit file reads during this analysis; they are approximate by design.)*

  - **ignored_files_matched**
    - `.env*`: 10 files (all `.env.example` variants; still treated as ignored).
    - `*.log`: 1 file (`cm_benchmark/log/development.log`).
    - `config/app_config.yml`: 6 files (`cm_benchmark`, `notification_service`, `cost_analysis_service`, `culturemonkey-xhale`, `culturemonkey`, `culturemonkey-master`).
    - `config/credentials.yml.enc`: 6 files (same set).
    - `config/database.yml`: 6 files.
    - `config/elasticsearch.yml`: 5 files.
    - `config/environment.rb`: 6 files.
    - `config/master.key`: 1 file.
    - `service-credentials.json`: 4 files.
    - `translation-api-credentials.json`: 4 files.
    - Additional uncounted but ignored paths include `config/locales`, `config/newrelic.yml`, `config/gcp_custom_classifier_config.json`, `config/paralleldots_config.json`, `feedback-translation-api-credentials.json`, `ms_teams_bot_app.zip`, `public/privacy-policy.html`, `security.csv`, SAML keys, and `.specstory/**`.
    - **Total (minimum)**: ~49 ignored files explicitly matched by glob, plus additional ignored paths not counted (so actual ignored_files_matched is **≥50**).

  - **processed_files_count**
    - Counted only files explicitly opened via the `Read` tool for this document:
      - 4 `.cursorindexingignore` files.
      - ~20–25 documentation files (READMEs, docs) across `culturemonkey*`, `Hummer`, `Hummer-UI`, `cm-askcooper`, `data-reporting`, `winsight`, `totango-service`, `cm-observability`, `cm-sync-service`, `report-service`, `report-service-eu`, `notification_service`, etc.
      - 1 `Gemfile` (core Rails).
      - 1 `config/routes.rb` (core Rails).
    - **Approximate total**: **~30–35 processed files**.

No ignored file’s content was opened, parsed, quoted, or used for inference in this document; all sensitive configuration and credential files identified by `.cursorindexingignore` were treated as off-limits.

---

## Feature Catalogue & Logic (Across Repos)

This section summarizes **feature-level behaviour and the main toggles/flags** that control them, focusing on the `culturemonkey` Rails app and then highlighting patterns in surrounding services. Where feature switches are clearly implemented as `AccountSetting` entries or account-level booleans, they are called out explicitly; deeper per-tenant configuration stored only in ignored files is treated as **Unknown**.

### Core Web App (`culturemonkey`) – Feature Logic

#### 1. Report Views & Navigation

- **Legacy vs Optimized Single-View Reports**
  - `ReportsController` includes `ReportRedirects` and has a `before_action :redirect_if_optimized_enabled`, which routes users to the newer, optimized report experience when a corresponding flag is set.
  - In the text responses module, `Feedback::TextResponsesController#get_share_url` builds the share URL based on `AccountSetting.use_optimised_report_view?`:
    - When `true`, employees are directed to `/employee/reports/summary/:access_key` (optimized view).
    - When `false`, they are directed to `/reports/summary/:access_key` (legacy view).
  - **Flags / toggles:**
    - `AccountSetting.use_optimised_report_view?` (exact underlying setting name is defined in `AccountSetting`, but the boolean predicate is exposed via this helper).
    - `AccountSetting.enable_new_feedback_ui_for_cm_users_only` (gates access to the new feedback UI for CM users only; see below).

- **Dashboard vs Manager Dashboard vs IHCL Dashboard**
  - `ReportsController#dashboard` decides whether to:
    - Show the generic dashboard,
    - Redirect to `manager-dashboard`, or
    - Redirect to `ihcl-dashboard`,
    depending on:
    - User permissions (`can? :view, :dashboard` / `:manager_dashboard` / `:sub_admin_dashboard`),
    - `current_account.ihcl?` account flag.
  - **Flags / toggles:**
    - `current_account.ihcl?` (IHCL-specific dashboards and flows).
    - Internal permission flags controlled via `cancancan` ability definitions (not enumerated here).
 
- **Overtime Analysis on Reports Index**
  - `ReportsController#index` uses:
    - `AccountSetting.enable_overtime_analysis?` and
    - `current_user.super_admin?`
    to decide if reports should be paginated.
  - When overtime analysis is enabled for super admins, the index can load all report-ready surveys without pagination (to support heavy analytics views).
  - **Flag / toggle:**
    - `AccountSetting::ENABLE_OVERTIME_ANALYSIS` (name in `AccountSetting`) with helper `enable_overtime_analysis?`.

- **Overall Score Rounding**
  - The dashboard uses `AccountSetting.overall_score_round_off_limit` to round engagement scores (e.g., 1 decimal vs 2).
  - **Flag / setting:**
    - `AccountSetting.overall_score_round_off_limit` – numeric setting controlling rounding precision.

#### 2. Text Responses & Feedback UI

- **New Feedback UI Gating**
  - `Feedback::TextResponsesController#verify_access` checks:
    - `current_user.cm_user?` and
    - `AccountSetting.enable_new_feedback_ui_for_cm_users_only`
    before allowing access to the new text-responses UI. Otherwise users are redirected back to `/reports` with an unauthorized message.
  - **Flag / toggle:**
    - `AccountSetting.enable_new_feedback_ui_for_cm_users_only` – controls rollout of the new feedback UI, initially to CM users only.

- **Demographic Visibility in Text Responses**
  - `Feedback::TextResponsesController#set_demographics_visibility` uses `demographics_visibility_settings(current_user)` to determine what to show:
    - Manager name,
    - Team,
    - Location,
    - Timestamp.
  - Fallback defaults (when no setting found) hide names and teams/locations but show timestamps.
  - The underlying settings map to multiple `AccountSetting` keys:
    - For managers, sub-admins, and super admins:
      - `MANAGER_IN_FEEDBACK_FOR_MANAGER`, `TEAMS_IN_FEEDBACK_FOR_MANAGER`, `LOCATION_IN_FEEDBACK_FOR_MANAGER`, `HIDE_TIMESTAMP_IN_FEEDBACK_FOR_MANAGERS`.
      - `MANAGER_IN_FEEDBACK_FOR_SUB_ADMIN`, `TEAMS_IN_FEEDBACK_FOR_SUB_ADMIN`, etc.
      - `MANAGER_IN_FEEDBACK_FOR_SUPER_ADMIN`, `TEAMS_IN_FEEDBACK_FOR_SUPER_ADMIN`, etc.
  - **Flags / toggles (per role):**
    - `AccountSetting::MANAGER_IN_FEEDBACK_FOR_MANAGER`, `TEAMS_IN_FEEDBACK_FOR_MANAGER`, `LOCATION_IN_FEEDBACK_FOR_MANAGER`, `HIDE_TIMESTAMP_IN_FEEDBACK_FOR_MANAGERS`.
    - `AccountSetting::MANAGER_IN_FEEDBACK_FOR_SUB_ADMIN`, `TEAMS_IN_FEEDBACK_FOR_SUB_ADMIN`, `LOCATION_IN_FEEDBACK_FOR_SUB_ADMIN`, `HIDE_TIMESTAMP_IN_FEEDBACK_FOR_SUB_ADMIN`, `DISABLE_FEEDBACK_FOR_SUB_ADMIN`.
    - `AccountSetting::MANAGER_IN_FEEDBACK_FOR_SUPER_ADMIN`, `TEAMS_IN_FEEDBACK_FOR_SUPER_ADMIN`, `LOCATION_IN_FEEDBACK_FOR_SUPER_ADMIN`, `HIDE_TIMESTAMP_IN_FEEDBACK_FOR_SUPER_ADMIN`.

- **Anonymity for Feedback Demographics**
  - `Feedback::TextResponsesController#set_demographics_anonymity_except_teams` calls:
    - `Feedback::ExportOpenFeedback.new(@report, current_user).fetch_exclusions_for_demographics_from_es_by_combinational_anonymity`,
    which returns lists of manager/location/business_unit/sub_team IDs that should be excluded to preserve anonymity.
  - These exclusions reflect account-level anonymity thresholds; the global default for dashboards is controlled by:
    - `AccountSetting::DASHBOARD_ANONYMITY_THRESHOLD` (validated to be ≥ 3) and `DEFAULT_ANONYMITY_THRESHOLD = 5`.
  - **Flags / settings:**
    - `AccountSetting::DASHBOARD_ANONYMITY_THRESHOLD` (per-account threshold).
    - Internal anonymization logic in `Feedback::ExportOpenFeedback` and ES query helpers (details beyond scope of reviewed code).

- **Feedback Translation & Topics**
  - `AccountSetting` contains flags like:
    - `ENABLE_TRANSLATION_IN_FEEDBACK_CARD` – toggles translation UI for feedback cards.
    - `ENABLE_FEEDBACK_GPT_TOPICS` – toggles AI-generated topic clustering of feedback.
  - Exact view conditionals referencing these flags are not fully enumerated in reviewed controllers but the intent follows the naming.
  - **Flags / toggles:**
    - `AccountSetting::ENABLE_TRANSLATION_IN_FEEDBACK_CARD`.
    - `AccountSetting::ENABLE_FEEDBACK_GPT_TOPICS`.

#### 3. Survey Creation, Templates & Audience Logic

- **Driver Library Choice**
  - `SurveysController#questions` chooses which driver set to show based on:
    - `@survey.has_custom_drivers`
    - When `true`: uses `Driver.by_engine.custom.names`.
    - When `false`: uses `Driver.by_engine.default.names`.
  - This allows per-survey control of whether to use system default drivers or tenant-specific custom drivers.
  - **Implicit flag / toggle:**
    - `Survey#has_custom_drivers` (survey-level boolean field).

- **Audience Filtering by Business Group**
  - In `SurveysController#audience`, after computing the potential audience, a conditional applies:
    - If `current_account.enable_business_group_access?` is true, available employees are filtered by `@survey.survey_business_groups`.
    - This restricts audience selection to employees belonging to specific business groups when that feature is enabled.
  - **Flag / toggle:**
    - `AccountSetting::ENABLE_BUSINESS_GROUP_ACCESS` (underlying setting) surfaced through `current_account.enable_business_group_access?`.

- **Survey Status & Step Progression**
  - `SurveysController` uses:
    - `SURVEY_STATUS = %w[draft published running ended]` to classify states.
    - `CONTINUE` map to define step progression: `'basic' → 'questions' → 'audience' → 'settings' → 'show'`.
  - Feature-wise, this ensures:
    - Only draft surveys can be edited (enforced by `redirect_unless_draft`).
    - Publishing triggers scheduling logic (`publish_and_schedule_survey`) and moves survey into `published`/`running` states.
  - **Flags / toggles:**
    - No account-level flag here; this is core workflow logic based on survey status fields and before-actions.

- **Notification Metrics Export**
  - `SurveysController#export_notification_metrics` exports launch/reminder metrics based on `NotificationMetric::NotificationType` and `survey_reminder_id`.
  - AccountSetting has several notification-related flags:
    - `ENABLE_SUBMITTED_AT_IN_REPORT_EXPORT` (include submission timestamps).
    - `ENABLE_REPORT_COMMENTS_DOWNLOAD` and `ENABLE_REPORT_FREE_TEXT_DOWNLOAD`.
  - While not all conditionals are visible in this controller, they govern export content and the availability of download options.
  - **Flags / toggles:**
    - `AccountSetting::ENABLE_REPORT_COMMENTS_DOWNLOAD`.
    - `AccountSetting::ENABLE_REPORT_FREE_TEXT_DOWNLOAD`.
    - `AccountSetting::ENABLE_SUBMITTED_AT_IN_REPORT_EXPORT`.

#### 4. Heatmap, Demographics & Action Filters

- **Heatmap Demographics Configuration**
  - `Accounts::HeatmapSettingsController#index` uses:
    - `AccountSetting::REPORT_DEMOGRAPHICS`,
    - `AccountSetting::SUB_ADMIN_REPORT_DEMOGRAPHICS`,
    - `AccountSetting::MANAGER_REPORT_DEMOGRAPHICS`,
    to fetch value lists describing which demographics (standard + custom attributes) appear in heatmaps for each role.
  - `#update`:
    - Forces `current_account.custom_report_demographics` to `true` when saving.
    - Validates that **at least one standard attribute** is enabled for each of the three roles.
    - Persists value lists via `AccountSetting.find_or_create_by(name: setting_name)` and `setting.value_list = value_list`.
  - **Flags / toggles:**
    - `current_account.custom_report_demographics` (per-account boolean enabling custom heatmap demographics).
    - `AccountSetting::REPORT_DEMOGRAPHICS`, `SUB_ADMIN_REPORT_DEMOGRAPHICS`, `MANAGER_REPORT_DEMOGRAPHICS`.
    - `AccountSetting::SHOW_HEATMAP_FILTERS`, `SHOW_CUSTOM_HEATMAP_FILTERS`, `HEATMAP_DRILLDOWN_DEMOGRAPHIC_LIST` control additional heatmap filter behaviour.

- **Action Filter (Acts) Demographics**
  - `Accounts::ActFilterSettingsController` manages:
    - `AccountSetting::ACT_FILTER_DEMOGRAPHICS`,
    - `AccountSetting::ACT_FILTER_CUSTOM_DEMOGRAPHICS`,
    by serialising attribute names and enabled flags into value lists.
  - This directly controls which demographics are available when filtering and aggregating actions (Acts).
  - **Flags / toggles:**
    - `AccountSetting::ACT_FILTER_DEMOGRAPHICS`.
    - `AccountSetting::ACT_FILTER_CUSTOM_DEMOGRAPHICS`.
    - `AccountSetting::ENABLE_ACT_DRIVER_WISE_REPORT` (enables driver-wise Acts report, used in reporting layer).

**How are driver scores calculated**
- Each question will be assigned with a drvier. 
- Each survey can have multiple drivers (default and custom drivers)
- Each driver can have one or many questions
- The average rating of all employees for all questions in a Survey is the diver score.
- The Driver score will be calculated for different demographics like Role, Location, Business Unit, Region and other default and custom demographics.

- Default drivers:
    Autonomy
    Work Environment
    Leadership
    Management
    Work Life Balance
    Involvement
    Communication
    Rewards
    Recognition
    Growth & Development
    Purpose Alignment
    Innovation
    Wellness
    Meaningful Work
    Social Connection


#### 5. Lifecycle, Autopilot & Pulse

- **Lifecycle Autopilot Visibility**
  - `AccountSetting` defines several lifecycle-related feature flags:
    - `ENABLE_LIFECYCLE_ACTIVATE_BUTTON`.
    - `SHOW_LIFECYCLE_ENABLE_BUTTON`.
    - `ENABLE_COMMON_GENERIC_LINK_FOR_LIFECYCLE_SURVEYS`.
  - In `AutopilotsController#lifecycle_settings`:
    - The controller builds lifecycle views and uses `confidential_survey_present?` to set `@show_all_silent_participants_btn`, but the display of lifecycle controls is further gated in views by the above flags.
  - **Flags / toggles:**
    - `AccountSetting::ENABLE_LIFECYCLE_ACTIVATE_BUTTON` – shows/hides lifecycle activation controls.
    - `AccountSetting::SHOW_LIFECYCLE_ENABLE_BUTTON` – toggles UI for enabling lifecycle.
    - `AccountSetting::ENABLE_COMMON_GENERIC_LINK_FOR_LIFECYCLE_SURVEYS` – determines whether a generic lifecycle link is exposed.

- **Exporting Unanswered Participants**
  - `AutopilotsController#download_unanswered_participants` and `#download_unanswered_participants_for_all_lifecycles` export lists of employees who have not answered lifecycle surveys yet.
  - At an account level, `AccountSetting::ENABLE_EXPORT_OF_UNANSWERED_PARTICIPANTS_FOR_SUPER_ADMIN` controls whether super admins see/export these lists.
  - **Flag / toggle:**
    - `AccountSetting::ENABLE_EXPORT_OF_UNANSWERED_PARTICIPANTS_FOR_SUPER_ADMIN`.

- **Pulse Surveys**
  - `PulseSurveysController` implements:
    - Single active pulse per tenant (`@active_pulse`).
    - Frequency changes that clone existing pulse and deactivate the previous one.
    - Manual reminders with guardrails to avoid duplicates per day (using `PulseReminder` and a presence check).
  - Access to pulse features is gated by `before_action :verify_pulse_access` (permission-based rather than a generic feature flag).
  - **Flags / toggles:**
    - No explicit `AccountSetting` flag surfaced in the controller; access is controlled by permissions and active pulse state.

#### 6. Exports (PDF, PPTX, XLS, Comments, Free Text)

`AccountSetting` defines a rich set of flags controlling export features:

- **PDF Exports**
  - `ENABLE_PDF_REPORT` – turns PDF report generation on/off globally.
  - `PDF_ADDITIONAL_DEMOGRAPHICS`, `PDF_ADDITIONAL_DEMOGRAPHICS_FOR_SUB_ADMINS`, `PDF_ADDITIONAL_DEMOGRAPHICS_FOR_MANAGERS` – control extra demographic fields included per role in PDFs.
  - `ENABLE_PDF_INSIGHT_IN_REPORT` – toggles inclusion of AI/insight sections in PDFs.
  - `APPLY_DRIVER_THRESHOLD_IN_FOCUS_AREAS_PDF` – applies score thresholds to filter focus areas in PDF.

- **PPTX Exports**
  - `ENABLE_PPTX_REPORT` – global toggle for PPTX report export.
  - `ENABLE_PPTX_REPORT_FOR_SUB_ADMINS`, `ENABLE_PPTX_REPORT_FOR_MANAGERS` – role-based PPTX availability.
  - `USE_ADVANCED_PPTX_REPORT` – switch from legacy PPTX templating to advanced version.
  - `USE_CUSTOM_LABELS_IN_ADVANED_PPTX_REPORT` – toggles use of custom labels in advanced PPTX.
  - `HIDE_ENGAGEMENT_SCORE_DISTRIBUTION_IN_PPTX_REPORT` – hides score distribution chart from PPTX deck.
  - `ENABLE_INSIGHT_IN_PPTX_REPORT` – adds insights slide(s).

- **XLS(X) Exports**
  - `ENABLE_OLD_XLS_REPORT_EXPORT` – enables legacy XLS export pipeline.
  - `SHOW_RATING_PERCENTAGE_TABS_IN_XLS_REPORT` – adds extra tabs with rating percentage breakdowns.

- **Comments & Free Text Downloads**
  - `ENABLE_REPORT_COMMENTS_DOWNLOAD` – toggles downloadable comments for reports.
  - `ENABLE_REPORT_FREE_TEXT_DOWNLOAD` – toggles free text response download.

Controllers such as `ReportsController`, `ReportToolkitController`, and export modules (`ExportReport`, `SingleSurveyReport` helpers, and Node-based `report-service`) read these flags to:

- Show/hide export buttons in the UI per role.
- Decide which export job (legacy vs advanced) to trigger.
- Include or exclude additional demographic and insight sections.

#### 7. Integrations & Channels

- **Slack Integration**
  - Slack OAuth flow in `IntegrationsController#onboard_slack` uses:
    - `AppConfig.slack['client_id']` and `'client_secret'` (from ignored config) and stores results on `account`:
      - `slack_app_id`, `slack_user_access_token`, `slack_bot_access_token`.
  - Several `AccountSetting` keys hold Slack-related presentation and behaviour:
    - `SLACK_RESPONSE`, `SLACK_DEACTIVATE`, `SLACK_FIRST_NOTIFICATION_MESSAGE`, `SLACK_REMINDER_MESSAGE`, `SLACK_INSTALLATION_MESSAGE` – used to customise channel copy and toggles.
  - **Flags / toggles:**
    - Slack presence is primarily determined by whether tokens are stored on `account`.
    - Copy and UI prompts are controlled by Slack-related `AccountSetting` entries above.

- **Microsoft Teams Integration**
  - `IntegrationsController#onboard_teams` handles OAuth and app upload to Teams app catalog.
  - Post-onboarding, `TeamsInstallBotAppToUsers` job installs the app to users with `get_tenant_id`.
  - Relevant `AccountSetting` keys:
    - `MS_TEAMS_PUBLIC_APP_ENABLED` – indicates if public app for Teams is enabled.
    - `ENABLE_MS_TEAMS_V2_INTEGRATION` – toggles V2 integration logic (e.g., new auth flows or endpoints).
    - `TEAMS_TENANT_ID` – stores tenant ID for targeted installation.

- **Integrations Page Visibility**
  - `AccountSetting::SHOW_INTEGRATIONS` controls whether the integrations page is visible (and is “hidden by default” per code comment).
  - **Flag / toggle:**
    - `AccountSetting::SHOW_INTEGRATIONS`.

- **Email Infrastructure**
  - `ENABLE_DEDICATED_IP_FOR_MAILS` – toggles use of dedicated IPs for Mailgun sends.
  - `HIDE_FOOTER_IN_EMAIL` – controls whether email footer content is hidden.

#### 8. Chatbots, Assistants & Advanced Reporting

- **Report Assistant (AI)**
  - `AccountSetting::REPORT_ASSISTANT` – feature flag for an AI report assistant (likely used in report insights, though relevant controllers are partially in ignored set).
  - When enabled, the application can surface AI-generated insights for reports.

- **Chatbot Assistant**
  - `AccountSetting` defines:
    - `CHATBOT_ASSISTANT_ID`.
    - `ENABLE_CHATBOT_ASSISTANT`.
    - `ENABLE_CHATBOT_ONLY_FOR_CAESAR`.
    - `CHATBOT_INDUSTRY_NAME`.
  - These control:
    - Which OpenAI assistant or external AI agent is used.
    - Whether the chatbot is globally enabled.
    - Whether it is restricted to an internal superuser (“Caesar”).

- **NPS Wizard & Live Metrics**
  - `NPS_WIZARD` – toggles a wizard flow around NPS configuration.
  - `LIVE_METRICS` – enables a live metrics experience (e.g., `live_metrics#index` routes).

#### 9. Navigation & Page Visibility

- **Hiding Admin/Employee Pages**
  - `AccountSetting` includes:
    - `HIDE_EMPLOYEES_PAGE`.
    - `HIDE_MANAGERS_PAGE`.
    - `HIDE_ADMINS_PAGE`.
  - These flags are checked in navigation/layout helpers and controllers to:
    - Hide or show the Employees, Managers, and Admins pages per tenant.

- **Acts in Manager Dashboard**
  - `HIDE_ACTS_IN_MANAGER_DASHBOARD` / `SHOW_ACTS_IN_MANAGER_DASHBOARD` – dual flags that:
    - Control whether the Acts section appears in manager dashboards.
  - UI and query logic refer to these to avoid exposing action items where not appropriate.

#### 10. OTP, Grid Questions & Survey Form Options

- **OTP and Verification**
  - `ENABLE_PHONE_NUMBER_OTP_IN_SURVEY_FORM`.
  - `OTP_PHONE_NUMBER_NOTE_IN_SURVEY_FORM`.
  - `ENABLE_EMPLOYEE_ID_IN_OTP_SURVEY_FORM`.
  - `ENABLE_LOCATION_IN_OTP_SURVEY_FORM`.
  - `SKIP_PASSCODE_VERIFICATION`.
  - These flags determine:
    - Whether OTP fields are shown in survey forms.
    - Whether passcode verification is enforced or skipped.
    - Which identity fields (phone, employee ID, location) are collected as part of OTP flows.

- **Grid Questions**
  - `ENABLE_GRID_QUESTIONS` – enables a question type that displays answers in a grid format.
  - Controllers and views check this flag before rendering or allowing creation of grid-type questions.

- **Other Survey Form Controls**
  - `ENABLE_CUSTOM_BG_SURVEY` – allows custom backgrounds beyond default set.
  - `ENABLE_SKIP_ANSWER_TEXT_IN_QUESTIONS_FORM` – toggles presence of “Skip answer” text in survey forms.
  - `SHOW_DEFAULT_QUESTION_IN_MULTILINGUAL` – decides whether default language question text is shown in multi-lingual mode.

#### 11. IHCL- and Region-Specific Features

- `AccountSetting` contains IHCL-specific and region-specific flags:
  - `EXECUTIVE_SURVEY_IDS`, `NON_EXECUTIVE_SURVEY_IDS`, `SENIOR_MANAGEMENT_SURVEY_IDS` – govern which surveys are used in IHCL dashboards.
  - `ENABLE_REGION_WISE_INDUSTRY_BENCHMARK` – toggles region-wise industry benchmarks in reports.
  - `HIDE_SUGGESTED_ACTION_IN_REPORT` – hides or shows suggested actions in reports, especially for certain customers or contexts.

#### 12. Lite & PLG Features

- CM Lite and PLG flows are controlled via:
  - `LITE_STEP` – indicates the onboarding/progression step a Lite tenant is in.
  - `LITE_MAX_SURVEY_PARTICIPANTS_COUNT` – caps participants for Lite tenants.
  - `SHOW_TRIAL_DATA_LOAD_BANNER` – shows trial data onboarding banners.
  - `SURVEY_CATEGORY_POPUP_SHOWN` – track or suppress “What are you looking for?” modals.
  - `CEO_WELCOME_MESSAGE_SHOWN` – suppresses repeated CEO welcome modals.
  - `LITE_VERIFICATION_MAIL_SENT` – ensures one-time verification mail logic per Lite admin.

### Surrounding Services – Feature Highlights

Beyond the Rails monolith, feature toggles are more environment/config driven (via `.env` and config files, which are ignored), so below is a feature-level description rather than concrete flag enumeration.

#### Hummer / Hummer-UI

- **Core Features**
  - Project-based hiring flows, candidate management, interview plans and templates, scorecards, Hummer bot interview recording and transcription, AI-generated insights (summary, scores, tools, sentiment, keywords), PLG-style onboarding, roles (Admin, Recruiter, Panelist), multi-tenant support, and WebSockets-powered live interview timeline.
- **Configuration & Flags (High-Level)**
  - OpenAI and Thar AI integration keys and endpoints via `.env` (ignored).
  - Feature rollout (e.g., automated scheduling, Slack/CRM integrations, mobile experiences) follows roadmap; gating is primarily:
    - Environment-based (dev vs prod),
    - Tenant-based (PLG vs enterprise),
    - Code-branch/feature-flag tools not visible in the front-end README.
  - **Concrete flags in code** were not enumerated because most configuration appears to be `.env`-driven and not implemented as in-app feature-flag constants.

#### Winsight

- **Core Features**
  - Customer management, renewal prediction, risk scoring, TAM performance tracking, issue detection, missed follow-up tracking, AI recommendations for NPS and renewal, Gmail sentiment analytics, Slack/Totango/product-usage integration.
- **Configuration & Flags**
  - Uses `.env` for:
    - `OPENAI_API_KEY`.
    - DB credentials.
    - Optional Gmail/Slack/Totango API credentials.
  - No explicit in-app feature-flag registry is documented; features are typically active when corresponding credentials are present (e.g., Gmail analysis requires Gmail API config).

#### Cooper (cm-askcooper)

- **Core Features**
  - MCP-based analytics tools for engagement metrics, participation, eNPS, sentiment, demographics, trends, comparisons, manager effectiveness, driver impact, and predictive metrics.
  - Cooper backend orchestrates tool selection based on user prompts and uses OpenAI for interpretation.
- **Configuration & Flags**
  - Uses `.env` for:
    - DB connection (`DB_HOST`, `DB_NAME`, etc.) – read-only user with SSL.
    - Redis URL for caching (optional).
    - Anonymity settings: `DEFAULT_MIN_RESPONSES`, `ENFORCE_ANONYMITY`, `LOG_ANONYMITY_CHECKS`.
  - These env vars behave as global feature toggles:
    - If `ENFORCE_ANONYMITY` is false, tools may return finer-grain data; when true, groups below thresholds are masked.

#### Thematic Analysis Dashboard (data-reporting)

- **Core Features**
  - Tenants/surveys selection, coding (batch OpenAI code generation), theming (OpenAI theme mapping based on codes & counts), representative responses (embeddings), anonymity thresholds, and test mode limiting.
- **Configuration & Flags**
  - `.env` keys:
    - `OPENAI_API_KEY`.
    - `DB_*` credentials.
  - App-level settings in `config/settings.json`:
    - `test_mode` – toggles whether record limits are enforced for coding and theming.
    - `batch_size` – controls API batch sizes.
    - `demographic_anonymity_threshold` – minimum distinct employees in demographic groups.
    - Prompt text and JSON schemas for codebook and theme mapping.
  - These behave as operational feature toggles—for example:
    - Setting `demographic_anonymity_threshold` to 0 disables anonymity-based exclusion for theming (in non-sensitive contexts).

#### Totango-Service, Report-Service, Notification Service, cm-sync-service

- **Totango-Service**
  - Features: scheduled EventBridge-triggered Lambda, hourly sync, DynamoDB storage, Slack notifications with filtering by touchpoint type and sync interval.
  - Configuration via env:
    - `SYNC_INTERVAL` (hours of lookback).
    - `TOUCHPOINTS_TABLE_NAME`, `TOUCHPOINT_TYPES_TABLE_NAME`.
    - `TOTANGO_API_TOKEN`, `SLACK_WEBHOOK_URL`.

- **Report-Service / Report-Service-EU**
  - Features: Node-based workers generating PDF/PPTX reports and charts.
  - Configuration: Node version, Redis URL, queue concurrency, etc., via env; per-tenant feature toggles are controlled upstream by `AccountSetting` (e.g., `ENABLE_PDF_REPORT`, `ENABLE_PPTX_REPORT`).

- **Notification Service**
  - Features: sending survey email/SMS, tracking `NotificationMetric` entries, possibly channel-specific behaviours.
  - Configuration: SMTP/sender settings, queue behaviour, SMS provider configuration in ignored configs and env.

- **cm-sync-service**
  - Features: scheduled employee sync, per-tenant mapping to external HRIS.
  - Configuration: external API endpoints and credentials via `.env`, plus tenant-specific mapping settings in DB/config.

---

### Caveats on Completeness of Feature Flags

- The `AccountSetting` model contains **hundreds of setting names**, many of which are used as:
  - Feature flags (on/off).
  - Behaviour configurators (thresholds, labels, messages).
  - Integration credentials metadata.
- This document has focused on **major feature flags** that clearly map to user-facing features and have at least one visible controller or helper usage in reviewed code.
- Additional fine-grained flags exist (e.g., for specific customers, campaigns, or internal experiments), but:
  - Some are only referenced in views or helpers not covered here.
  - Others are consumed in initializers or config files that are explicitly ignored by `.cursorindexingignore`.
- Where such flags could not be traced to behaviour without reading ignored or highly customer-specific files, they are implicitly treated as:
  - **Unknown (not fully documented from reviewed sources)**.

---

## Module-by-Module UI Feature Descriptions

This section mirrors the **left navigation** in the primary CultureMonkey web app and explains, in product language, what each module does and how the underlying code and flags shape its behaviour.

### Module: Dashboard

**Purpose**  
Single landing page for senior HR and admins to see **overall engagement health**, key KPIs, and a summary of recent feedback and benchmarks.

**Key Behaviours**

- The main dashboard (`ReportsController#dashboard`) computes:
  - **Engagement Score card**: current engagement score and delta vs last dashboard-included survey (`overall_dashboard_scores`, `Survey.dashboard_included.last_active_survey`).
  - **Participation card**: overall participation rate and delta vs previous survey (`calc_overall_participation_rate`).
  - **eNPS card**: overall eNPS and breakdown metadata from `enps_distribution(nil)`.
  - **Recent feedback list**: 10 latest feedback items to give qualitative context.
  - **Benchmarks**: available industries and locations from `BenchmarkIndustry` and `BenchmarkLocation`.
  - **Delta comparison surveys**: helper `set_delta_comparison_surveys` identifies which reference surveys can be compared over time.
- If there are **no report-ready surveys and insufficient pulse data** (`PulseAnswer.count < 5`), the user sees an **empty dashboard** state with guidance instead of partial metrics.

**Routing Logic**

- Users are redirected away from the main dashboard when:
  - They lack dashboard permissions (`can? :view, :dashboard`) or when `show_dashboard` says the account should not see it.
  - They should instead see the **manager dashboard** or an **IHCL-specific dashboard**, based on role and `current_account.ihcl?`.

**Feature Flags & Settings**

- `AccountSetting.overall_score_round_off_limit` – controls how many decimals are shown for engagement scores.
- `AccountSetting::DASHBOARD_EXCLUDED_SURVEY_IDS` – configured via `Accounts::SettingsController#advanced` and `#exclude_from_dashboard`; excludes certain surveys from dashboard metrics for a cleaner view.
- `AccountSetting::LIVE_METRICS` – determines whether live/time-series metrics are surfaced prominently (referenced by helpers; behaviour is layered over this controller).

**Business Interpretation**

- **PM/CS lens**: Dashboard is the quick answer to “How are we doing overall?” and “Is it getting better or worse?”. The system intentionally avoids showing partial or misleading views (e.g., empty states) and allows tenants to tune which surveys contribute to the top-line scores.

---

### Module: Org Hierarchy

**Purpose**  
Provide **hierarchical, manager-centric analytics** so HR and leaders can navigate from the top of the organization down to individual teams, comparing participation and engagement across managers.

**Key Behaviours**

- **Org tree entry point** (`OrgHierarchyController#index`):
  - Lists **eligible surveys** that have org tree data: running/ended employee surveys with `EmployeeOrgTree` entries.
  - Prepares an empty manager data structure and filter options (`filter_options`) for the initial load.
  - Supports both HTML and JSON; JSON returns the pre-built org tree for client-side rendering.
- **Tree drill-down & filters**:
  - `#tree_drill_down` and `#apply_filters` call `EmployeeOrgTree.fetch_org_tree_drill_down` / `fetch_org_tree_nodes`, then `build_org_tree` to convert flat ES/SQL results into a nested manager → reportee tree.
  - `#filters` computes **dependent filter options** (e.g., when location is selected, automatically update available teams and business units) by querying Elasticsearch aggregations only for **non-selected** filters.
- **Manager performance & participation detail**:
  - `#manager_breakup_data` and `#export_results` use `ManagerParticipationInsight.grouped_participation_summary_for_v1` to generate per-manager metrics:
    - Total participants, respondents, participation rate.
    - Driver-wise scores (driver columns added dynamically to headers when present).
  - Exports generated via `OrgHierarchyResultsExport` produce **Excel files** that match what the UI shows, including manager-specific permission flags (`direct_permitted` / `indirect_permitted`).

**Feature Flags & Permissions**

- Access is guarded by `before_action :check_access` (permission-based).
- Manager data respects:
  - **Anonymity thresholds**: `anonymity_threshold` and `current_account.anonymity_by_submission?` are passed into `ManagerParticipationInsight` to avoid exposing low-count demographics.
  - **Sub-admin filters**: sub-admins only see managers and teams they have rights to (`accessible_filter_records`, `sub_admin_filter_condition`).

**Business Interpretation**

- **PM lens**: Org Hierarchy is the **"manager effectiveness explorer"**: it surfaces which managers and segments are thriving or struggling and lets HR export curated manager data for offline deep-dive or calibration. It’s designed to respect anonymity and fine-grained permissions while enabling cross-org comparison.

---

### Module: Lifecycle Analytics

There are **two lifecycle analytics modules**:
- **Employee Lifecycle Analytics** (`LifecycleController`).
- **Candidate Lifecycle Analytics** (`Engines::LifecycleAnalyticsController`) in the candidate engine.

#### Employee Lifecycle Analytics (Sidebar: “Lifecycle Analytics”)

**Purpose**  
Visualize engagement across **employee lifecycle stages** (e.g., onboarding, tenure milestones, exit) and compare performance, participation, and text feedback by stage and demographic.

**Key Behaviours**

- **Overall lifecycle summary** (`#summary`, `#overall_analysis`):
  - Identifies **report-ready lifecycle surveys** and picks the first as default stage.
  - Computes lifecycle-wide metrics:
    - Engagement across stages (`engagement_score`).
    - Lifecycle participation rate (`overall_lifecycle_participation_rate`).
    - Per-stage scores and participation via `surveys_scores()`.
- **Stage-specific views** (`#stage_summary`):
  - For a selected stage/survey:
    - Locates corresponding `LifecycleSurvey` and `AutopilotLifecycle`.
    - Computes stats (`lifecycle_stats`) and surfaces manager reminders via `set_remind_managers`.
  - For `"Overall"`, aggregates metrics across all lifecycle stages (`overall_lifecycle_stats`).
- **Driver analysis & demographics**:
  - `#driver_analysis` sets up filters for location, team, manager, and business unit; underlying ES queries provide driver scores by demographic.
  - `#time_series_driver_scores` and `#time_series_demographics` return time-series or demographic-based breakdowns using ClickHouse/ES queries.
- **Text responses & disengagement**:
  - `#prominent` highlights **top-performing and low-performing questions or feedback** per lifecycle stage, with contextual titles and descriptions from `prominent_title_description`.
  - `#lifecycle_text_responses` consolidates unread lifecycle feedback and text answers from the past 30 days, ordered by recency.
  - `#disengaged_analysis` and `#overall_disenganged_scores` expose views focusing on **disengaged populations** (low scores, low sentiment).
- **Exporting lifecycle heatmaps**:
  - `#export_heatmap_xls` queues asynchronous XLS heatmap exports via `ReportDownloadDetail` and `SendReportEmailJob`.
  - `build_custom_complex_filters_options` supports both legacy and ClickHouse heatmap flows via `AccountSetting.enable_click_house_heatmap?`.

**Feature Flags & Settings**

- `AccountSetting::ENABLE_LIFECYCLE_ACTIVATE_BUTTON`, `SHOW_LIFECYCLE_ENABLE_BUTTON` – whether lifecycle programs are even exposed in UI.
- `AccountSetting.enable_click_house_heatmap?` – switches lifecycle heatmap exports between legacy PG-based and ClickHouse-based implementations.
- `current_account.hide_feedback_teams_by_count?` – controls hiding teams in lifecycle text responses when team size falls below anonymity thresholds.

**Business Interpretation**

- Lifecycle Analytics is the **“journey view”**: it shows where in the employee lifecycle engagement is at risk (e.g., after 6 months vs. during onboarding) and makes it easy to drill into drivers and text responses without compromising anonymity.

#### Candidate Lifecycle Analytics (Candidate Engine)

**Purpose**  
Mirror lifecycle analytics for **candidates**, allowing talent leaders to monitor candidate experience over hiring stages (e.g., application, interview, offer).

**Key Behaviours**

- `Engines::LifecycleAnalyticsController#index`:
  - Uses `CandidateAutopilotLifecycle` and `LifecycleSurvey` to identify candidate lifecycle stages tied to report-ready surveys.
  - Delegates actual analytics to a dedicated `LifecycleAnalytics` service (`@analytics`).
- `#stage_summary`, `#overall_analysis`, `#time_series`, `#time_series_demographics`, `#demographic_participation`, `#composite_chart`:
  - Provide the same forms of lifecycle, demographic, and time-series breakdowns as the employee module, but scoped to the **candidate engine**.

**Feature Flags**

- Uses the same lifecycle-related flags as employee lifecycle, but scoped by `@engine_type` when calling analytics services.

**Business Interpretation**

- For recruiting and talent leaders, this is the **“candidate experience barometer”**, allowing them to see how candidate sentiment and engagement vary across hiring stages and cohorts.

---

### Module: Snapshots (Beta)

**Purpose**  
Give admins a **people-analytics overview** of the workforce composition and engagement coverage—essentially, a “data readiness and health” snapshot.

**Key Behaviours**

- `SnapshotsController#index` aggregates:
  - **License utilization**: total active employees vs contract/licensed employees; unused licenses.
  - **Contactability**: employees without phone numbers and their percentage.
  - **Sentiment distribution**: via `calculate_employee_sentiment`.
  - **Silent employees**: overall count of employees with low/no response activity.
  - **Text coverage**: total feedback comments and free-text answers.
  - **Demographic completeness**: employees with missing demographic data.
  - **Program coverage**: number of active lifecycle programs, invited managers, and currently configured notification channels.
  - **HRMS integration**: active HRMS integration per tenant (`IntegrationApi.active_integrations`).
- Dedicated JSON endpoints:
  - `#generation_wise_employee_distribution` – workforce split by generation.
  - `#gender_wise_employee_distribution` – split by gender, including unspecified.
  - `#active_and_contract_employees`, `#active_and_inactive_employees` – used to drive license and headcount visualizations.

**Feature Flags**

- `AccountSetting.enable_snapshots?` – **hard gate** for the entire module; `check_admin_authorization` denies access when this is false.

**Business Interpretation**

- Snapshots answer **“Do we have enough and the right data to act?”** by quantifying how complete and up-to-date the workforce and engagement datasets are before deeper analytics and interventions.

---

### Modules: Templates & Surveys (Listen > Templates, Surveys)

These two modules work together: **Templates** define reusable survey structures, while **Surveys** are specific survey instances sent to employees.

#### Templates (SurveyTemplatesController)

**Purpose**  
Enable HR to **standardize survey design** via template libraries, support custom templates, and reuse best-practice questionnaires across tenants and programs.

**Key Behaviours**

- **Template library browsing**:
  - `#index` filters:
    - Standard employee templates (`is_custom: false`).
    - By category (`TemplateCategory`) when a type filter is provided.
  - `#custom_templates` surfaces only custom templates and shows an “empty custom” state when none exist.
- **Template-driven survey creation**:
  - `#create_survey` takes a selected `SurveyTemplate` and instantiates a full `Survey`, then routes the user to the **basic tab** of survey creation.
  - `#copy_survey` inverts the direction: it **creates a template from an existing survey**, including sections and questions; useful when codifying a successful one-off survey.
- **Template design experience**:
  - `#edit` and `#questions` mirror survey editing but at the template layer:
    - Support for **default vs custom drivers** (`has_custom_drivers`).
    - Question library browsing by driver.
    - Section creation and ordering.
  - `#show` renders a **live preview** of a template by instantiating a fake survey and serving the standard survey response UI, but with an access key of `"preview-template"` and autosave disabled.
- **Exporting template questions**:
  - `#export_questions` generates an XLS of questions from a template, letting admins review or translate offline.

**Business Interpretation**

- Templates reduce **time-to-launch** and enforce **methodological consistency**, especially for repeated engagement or pulse cycles across multiple cohorts or tenants. Converting high-performing surveys into templates empowers a “design once, reuse many times” pattern.

#### Surveys (SurveysController)

**Purpose**  
Own the full **survey lifecycle**: from creation and configuration through audience targeting, notifications, launch, and administration.

**Key Behaviours**

- **List & filter surveys** (`#index`):
  - Shows surveys based on role:
    - Super admins: all employee surveys (including lifecycle) with schedules.
    - Managers and sub-admins: only surveys where they have access, respecting anonymity by submission (`current_account.anonymity_by_submission`) and manager-accessible participants.
  - Provides status filters (`draft`, `published`, `running`, `ended`) and handles an empty-state when no surveys exist.
- **Builder tabs**:
  - Tabs follow `CONTINUE = { 'basic' => 'questions', 'questions' => 'audience', 'audience' => 'settings', 'settings' => 'show' }`:
    - **Basic**: metadata such as title, description, and survey schedule.
    - **Questions**: configure question types, drivers, scale-of-rating options, and sections.
    - **Audience**: select and manage participants, filter by teams/locations/business units, and search employees.
    - **Settings**: choose email templates, reminders, and final launch options.
  - `redirect_unless_draft` enforces that only **draft surveys** can be edited; once published, configuration becomes read-only.
- **Audience logic** (`#audience`, `#show_participants`):
  - Computes **current audience** (participants already attached to the survey).
  - Computes **eligible employees** (active, non-deleted, excluding Caesar user) which can be further scoped:
    - By business group, when `current_account.enable_business_group_access?` is true.
    - By manager access, when the logged-in user is a manager.
  - Provides ransack-based search over employees and paginated lists for efficient admin UX.
- **Launch & notifications**:
  - `#publish` delegates to `publish_and_schedule_survey`, which handles:
    - Setting survey status to `published`/`running`.
    - Creating reminders and channels based on configuration.
  - `#show_share_options` and `#preview_qr` generate a **generic QR code** and links for surveys when the tenant has generic link enabled, supporting Kiosk/TV use cases.
  - `#export_notification_metrics` allows admins to **audit notification delivery**, filtering by notification type and reminder ID and exporting a CSV with channel, status, error messages, timestamps, and reference IDs.

**Business Interpretation**

- Surveys provide the **operational backbone** of CultureMonkey: they ensure that what HR designs (via templates) can be precisely targeted, scheduled, and audited in production, while robust access control, anonymity, and configuration guardrails ensure safe execution.

---

### Modules: Pulse & Lifecycle (Listen > Pulse, Lifecycle)

#### Pulse (PulseSurveysController)

**Purpose**  
Offer a **lightweight, always-on listening channel** that runs independently of large engagement surveys, with its own questions and reporting.

**Key Behaviours**

- **Single active pulse pattern**:
  - Only one pulse survey can be active at any time:
    - Creating a new pulse automatically deactivates (`is_active: false`) the existing one.
    - Updating pulse frequency creates a new active pulse and deactivates the old one to preserve history.
- **Access and activation rules**:
  - `verify_pulse_access` ensures only permitted admins see pulse options.
  - `#new` requires **at least 5 active employees**; otherwise, the system shows a failure message and redirects.
- **Pulse reports** (`#reports`):
  - Combines data sources to show:
    - Overall pulse **engagement score** and delta vs previous pulse.
    - Quick filters for team, manager, location.
    - Question bank by driver (via `PulseQuestionBank`).
    - Latest pulse feedback (all, negative, positive).
    - Overall **pulse eNPS**.
    - Top questions and drivers (score, response count, positive/negative distribution).
- **Manual reminders**:
  - `#send_manual_pulse_reminder` enforces **one reminder per day** by checking `@pulse_survey.reminder_present?(Date.today)` before creating a new `PulseReminder`.
  - Uses a background job (`SendPulseReminderJob`) scheduled with a minimal delay to avoid race conditions.

**Business Interpretation**

- Pulse surveys let HR maintain a **continuous pulse** on employee sentiment and experience between larger survey events. The product deliberately maintains simple rules (one active pulse, one reminder per day) to avoid confusion and survey fatigue.

#### Lifecycle (Autopilots & LifecycleController)

In the sidebar, **Lifecycle** refers to managing **lifecycle programs and surveys** (Autopilot), whereas **Lifecycle Analytics** covers their reporting (see above).

**Key Behaviours (Program Setup)**

- **Autopilot Segments & Lifecycle** (`AutopilotsController`):
  - `#segments` and `#lifecycle` detect whether any autopilot definitions exist; if they do, users are redirected to settings pages; otherwise, they see empty-state guidance.
  - `#segment_settings` lists defined segments; `#lifecycle_settings` lists lifecycle programs and sets **next participants** and unanswered participants lists for the share modal.
- **Enabling & disabling programs**:
  - `#send_segments` and `#send_lifecycles` mass-enable all segments/lifecycles using `@autopilot_module` helpers.
  - `#enable_segment` / `#disable_segment` and `#enable_lifecycle` / `#disable_lifecycle` toggle single segments or lifecycles, showing success/error messages when preconditions (like `run_at` start date) aren’t met.
- **Lifecycle downloads**:
  - `#download_week_participants`, `#download_unanswered_participants`, `#download_unanswered_participants_for_all_lifecycles` provide CSV exports that support nudging participants and understanding response gaps, with additional checks to only include active & confidential lifecycles where appropriate.

**Feature Flags**

- Lifecycle program visibility and generic links controlled by:
  - `AccountSetting::ENABLE_LIFECYCLE_ACTIVATE_BUTTON`.
  - `AccountSetting::SHOW_LIFECYCLE_ENABLE_BUTTON`.
  - `AccountSetting::ENABLE_COMMON_GENERIC_LINK_FOR_LIFECYCLE_SURVEYS`.
- Export rights for unanswered participants via:
  - `AccountSetting::ENABLE_EXPORT_OF_UNANSWERED_PARTICIPANTS_FOR_SUPER_ADMIN`.

**Business Interpretation**

- These flows turn lifecycle surveys into **always-on programs** rather than manual campaigns, while giving HR precise control over when programs start, who gets included, and how non-responders are followed up.

---

### Module: Channels

**Purpose**  
Central hub to **configure communication channels** (Slack, Microsoft Teams, email) for sending surveys and notifications.

**Key Behaviours**

- **UI & session setup**:
  - In `IntegrationsController#channels`, the system:
    - Populates `@channels` using `channels_text` (copy describing Slack, Teams, email).
    - Sets a `session[:state]` with the account’s subdomain, used as an anti-CSRF and routing token in OAuth flows.
- **Slack onboarding** (`#onboard_slack`):
  - Receives an OAuth `code` and `state` from Slack.
  - Uses `Signup` to resolve which tenant the state belongs to.
  - Exchanges the code for tokens with Slack’s OAuth endpoint using `AppConfig.slack` credentials (ignored config).
  - Stores tokens in `account` (`slack_app_id`, `slack_user_access_token`, `slack_bot_access_token`) and updates the `Signup` record, then redirects back to `/channels` with success or error messages.
- **Teams onboarding** (`#onboard_teams`):
  - Similar pattern using Microsoft Graph OAuth:
    - Exchanges code for access and refresh tokens.
    - Uploads the Teams bot app (zip) to app catalog and stores `teams_app_id` and `teams_manifest_app_id`.
    - Schedules `TeamsInstallBotAppToUsers` job to roll out the bot to users.
- **Slack event handling** (`#handle_slack_event`, `#slack_callback_eu`):
  - Validates event signatures.
  - Routes Slack events either to US or EU environment depending on `signup.slack_team_id` and the host.

**Feature Flags**

- `AccountSetting::MS_TEAMS_PUBLIC_APP_ENABLED` – indicates whether the tenant uses the public Teams app path.
- `AccountSetting::ENABLE_MS_TEAMS_V2_INTEGRATION` – toggles the use of revised integration flows.
- `AccountSetting::SHOW_INTEGRATIONS` – controls whether the integrations/channels page is exposed.

**Business Interpretation**

- Channels turn CultureMonkey into a **multi-channel engagement platform**, meeting employees where they already work (Slack, Teams, email). The product normalizes complex OAuth exchanges into simple “Connect” buttons while ensuring tenant isolation and route-to-region (US/EU) correctness.

---

### Module: Reports

This is already covered extensively in earlier sections (Reporting & Analytics), but from a **module** perspective:

- **Reports index**: Filterable list of report-ready surveys, with overtime analysis option for super admins (`AccountSetting::ENABLE_OVERTIME_ANALYSIS`).
- **Report detail**: Tabs for summary, questions, feedback, word clouds, textual responses, and exports. Uses helpers like `SingleSurveyReport::QuestionsTab`/`FeedbackTab` to drive analytics.
- **Dashboard vs report-level view**: `ReportsController#dashboard` and `#show` share many helpers but differ in scope (all surveys vs single survey).

**Business Interpretation**

- Reports is the **core analysis workspace**, while Report Builder, Comment Analytics, and Reports Panel extend this with specialised workflows.

---

### Module: Report Builder (Dynamic Reports)

**Purpose**  
Allow power users to build **custom, multi-dimensional reports** without engineering support, by selecting metrics, dimensions, and add-on columns.

**Key Behaviours**

- `DynamicReportsController#index` sets up:
  - `@report_metrics` – predefined metrics (e.g., engagement score, eNPS, participation).
  - `@dimensions_data` – available segmentation dimensions (e.g., team, location, manager).
  - `@add_ons_columns` – supplemental columns that can be appended (e.g., attributes, demographics).
  - `@all_surveys` – accessible report-ready surveys for the toolkit.
- `#generate_report`:
  - Validates that a metric is selected.
  - Composes a **configuration hash** (`options`) from metric, dimensions, and add-ons.
  - Uses `ExternalJobTracker` to deduplicate and track background jobs for dynamic reports:
    - If an identical in-progress job exists, it reuses it.
    - Otherwise, it enqueues `DynamicReportJob` with the same options.
  - Notifies the user via standard report-download flash messaging that the report will be emailed when ready.

**Feature Flags**

- Hard gated by `AccountSetting.enable_report_assistant?`:
  - If disabled, `check_dynamic_report_access` redirects users away from the module.

**Business Interpretation**

- Report Builder is the **self-service BI layer** on top of CultureMonkey’s survey data. By reusing the same report assistant and job tracking mechanisms, it ensures complex custom cuts are safely processed asynchronously and correlated with the right user and survey.

---

### Module: Comment Analytics

**Purpose**  
Provide a **deep-dive workspace specifically for text responses**, allowing analysts to segment, filter, and take actions on verbatim feedback.

**Key Behaviours**

- Entrypoints:
  - Legacy comment analytics inside single-survey reports (feedback/word cloud tabs).
  - Optimised Comment Analytics under `/employee/reports/:survey_id/text-responses`, which is what the sidebar module points to in newer UIs.
- `Feedback::TextResponsesController#index`:
  - Reads JSON body parameters to configure:
    - Content type (`feedback`, `free_text`, etc.).
    - Pagination settings.
    - Whether sentiment/driver editing is enabled (`edit_sentiment_and_drivers`).
  - Executes `@report.text_responses_data(...)` with filters parsed by `FeedbackServices::FilterParser` and match type (`all` vs `any`).
  - Sets up anonymity and demographic visibility guards via:
    - `set_demographics_anonymity_except_teams`.
    - `set_low_count_teams`.
    - `set_demographics_visibility`.
  - Renders a dedicated layout that integrates into the single-view report nav.
- Update endpoints:
  - `#update` handles:
    - **Sentiment correction** via `FeedbackServices::SentimentUpdater`.
    - **Star/unstar** behaviour via `FeedbackServices::StarToggle`.
  - `#add_driver` associates a driver to a response (`FeedbackServices::AddDriver`).

**Feature Flags**

- `AccountSetting.enable_new_feedback_ui_for_cm_users_only` – gates access to the optimised comment analytics UI.
- Demographic visibility & anonymity flags as described earlier.

**Business Interpretation**

- Comment Analytics is the **“qualitative lab”** where analysts and HR can go from masses of comments to actionable clusters and interventions, while still respecting employee anonymity constraints.

---

### Module: Reports Panel

**Purpose**  
Offer **specialised export formats** for stakeholders (legal, HRBP partners, leadership) who need offline reports with specific identity or demographic treatments.

**Key Behaviours**

- `ReportsPanelController#index`:
  - Presents identity modes (`Anonymous`, `Confidential`) and a list of **report types**:
    - Always includes:
      - `Standard` (anonymous).
      - `Heatmap manager scores` (heatmap data + manager attributes).
    - Conditionally includes:
      - `4 & 5 percentage scores` when `current_account.enable_4_and_5_percentage_report?`.
      - `Location, BusinessUnit, Team` & `NPS Rating Distribution - Location, Business Unit, Team` when `current_account.enable_location_bu_team_report?`.
  - Uses `get_surveys_for_logged_in_user` to only show surveys that meet anonymity thresholds (e.g., at least 1% participation and enough responses).
- `#change_identity_type`:
  - Switches between anonymous and confidential modes, adjusting:
    - Available report types.
    - Survey list.
    - Identity messaging (showing the anonymity warning for anonymous mode).
  - For confidential mode, it ensures:
    - The correct template (`Team,Designation,DoJ` vs `Team Report`) based on `current_account.hide_doj_and_designation?`.
    - Optional `Employee Details (with name)` format only when `current_account.show_employee_name?`.
- `#export_single_report`:
  - Branches on `report_type` and uses dedicated export helpers (CSV or XLSX) or background jobs to:
    - Generate team-based reports.
    - Generate 4&5 percentage score reports.
    - Generate heatmap manager score reports.
    - Generate three-level demographic and NPS reports.

**Feature Flags**

- `current_account.enable_4_and_5_percentage_report?`.
- `current_account.enable_location_bu_team_report?`.
- `current_account.hide_doj_and_designation?`.
- `current_account.show_employee_name?`.
- Permissions via `can? :view, :reports_panel`.

**Business Interpretation**

- Reports Panel is the **“export workbench”** for compliance and stakeholder reporting, making it easy to get the exact CSV or XLS format needed for board decks, legal review, or HR analytics tooling.

---

### Module: Manager Statistics (Insights > Manager Statistics beta)

**Purpose**  
Provide **manager-level benchmarking and segmentation**, showing where managers stand relative to peers on engagement, eNPS, and driver scores.

**Key Behaviours**

- Manager statistics are powered by:
  - `ManagerBucketsController` and `ManagerParticipationInsight` (not fully shown here) and the Org Hierarchy components described earlier.
  - Endpoints for:
    - Top questions for high-potential managers.
    - Buckets for low-performing managers.
    - Gender and generation-specific breakdowns (e.g., “women managers’ recognition scores”).
  - Exports for reportees, action status, and report counts via `ManagersController` helpers (`download_reportees`, `export_action_status`, `export_reports_count`).

**Feature Flags**

- Manager dashboard access via `can? :view, :manager_dashboard`.
- Acts visibility for managers via `AccountSetting::HIDE_ACTS_IN_MANAGER_DASHBOARD` / `SHOW_ACTS_IN_MANAGER_DASHBOARD`.

**Business Interpretation**

- Manager Statistics is the **“people leader league table”**, providing granular, fair comparisons that help HR identify coaching opportunities, high performers, and structural issues in specific leader cohorts.

---

### Module: Actions (Act)

**Purpose**  
Turn insights into **trackable actions**, closing the loop from feedback to interventions.

**Key Behaviours**

- **Action creation flows** (`ActsController#new`, `#create`):
  - Actions can be initiated:
    - Directly from suggested actions or action plans.
    - From a feedback item or specific question (via `actable_type`/`actable_id`).
  - Each action has:
    - Title, description, owner, driver, deadline, and status.
    - Optional linked feedbacks (`feedback_id`) which trigger notifications to employees when status changes.
- **Action management**:
  - `#update` handles owner changes and notifies new owners.
  - `#update_status` supports status transitions (e.g., open → in-progress → completed), with optional reply comments broadcast back to linked feedback participants.
  - `#summary` yields time-filtered statistics for action counts (created, completed, overdue) globally or per sub-admin scope.
- **Filtering & exports**:
  - `#filter_names` supports dynamic filter dropdowns for admin, driver, survey, or business groups (with a check for `enable_business_group_access?`).
  - `#download` lets super admins, sub-admins, and (optionally) managers export all actions as a CSV.
  - `#download_driver_wise_report` exports driver-wise action summaries when enabled.

**Feature Flags**

- `AccountSetting.enable_business_group_access?` – enables business-group-based action filters.
- `AccountSetting.enable_download_actions_for_manager?` – extends export access to admin-managers.
- `AccountSetting.enable_act_driver_wise_report?` – enables driver-wise action export.
- Permissions: `cannot? :access, :actions` denies access to the entire module.

**Business Interpretation**

- Actions transform the platform from an **insight system to an execution system**, ensuring that survey outcomes lead to documented, owned, and communicated change efforts.

---

### Modules: Email Templates, Integrations, Employees, Managers, Administrators (General)

#### Email Templates

**Purpose**  
Let admins design and manage **all survey- and feedback-related email communications**, including multi-lingual templates.

**Key Behaviours**

- **Template management**:
  - `#index` segments templates into default vs custom vs all, with simple filter UI.
  - CRUD actions (`#new`, `#create`, `#edit`, `#update`, `#destroy`) manage lifecycle of templates.
- **Preview & multi-lingual support** (`#show`):
  - Instantiates a dummy survey and sample participant to render a realistic email preview.
  - Supports multi-lingual templates when `AccountSetting::ENABLE_MULTILINGUAL_EMAIL_TEMPLATES` is enabled:
    - Shows available translations per language.
    - Supports language-specific test emails.
- **Tying templates to surveys and feedback**:
  - `#update_survey_email_template`, `#update_survey_reminder_email_template`, `#remind_manager_email_template` update **per-survey** email template associations.
  - `#update_feedback_email_template` sets **global feedback-related template IDs** in `AccountSetting` (reaction and conversation templates).
- **Test emails**:
  - `#send_test_email` sends preview emails to a given address, optionally in a specific language.

**Feature Flags**

- `AccountSetting::ENABLE_MULTILINGUAL_EMAIL_TEMPLATES` – governs all multi-lingual email behaviours.

**Business Interpretation**

- Email Templates ensure tenants can **fully brand and localize** their communications, while global settings let CultureMonkey ship default best-practice copy that can be selectively overridden.

#### Integrations

- Covered under **Channels** and integration sections earlier; in the sidebar this typically links to `/integrations` and `/channels`.
- `AccountSetting::SHOW_INTEGRATIONS` toggles visibility of this page.

#### Employees

**Purpose**  
Serve as the **employee master data** view: list, import/validate, and manage employees and their custom attributes.

**Key Behaviours**

- `EmployeesController#index`:
  - Lists active or inactive employees based on `status` filters.
  - Excludes internal “Caesar” user.
  - Offers search, sorting, and pagination with joined team/location/manager data.
  - Shows **GSuite sync status** via a humanized `GSUITE_MESSAGES` map.
- **CRUD & custom attributes**:
  - New and edit flows support both core fields and custom attributes (grouped via `group_custom_attributes`).
  - Updates propagate to `AttributeValue` entries for dynamic fields.
- **Imports and exports**:
  - **Validation-first import**: `#validate` runs an `EmployeeImport` to return a JSON payload with status, messages, and optional error file path; import is a separate step and, in V2, moved to a dedicated employee-import module.
  - Sample and exported CSV helpers (`#download_sample`, `#export_csv`) support error-free HRIS uploads.
- **Announcements**:
  - `#announce` and `#confirm_announce` manage **“introduce” emails** to all employees, including default content from an HTML snippet and a configurable `from_email`.

**Feature Flags**

- `AccountSetting::HIDE_EMPLOYEES_PAGE` – hides the module for non-Caesar users.

#### Managers

**Purpose**  
Manage the **manager roster** (and their invites) and give HR tools to impersonate managers for debugging and enablement.

**Key Behaviours**

- `ManagersController#index`:
  - For super admins: lists all managers.
  - For sub-admins: lists managers accessible per `enable_view_as_manager_for_sub_admin` setting.
  - Always filters to active managers and sorts alphabetically, with search and pagination.
- **Invite & import**:
  - `#invite_managers` supports both:
    - Inviting **all managers** (with job-tracked background process).
    - Inviting only managers in an uploaded CSV file.
  - `#validate_import` validates the upload via `ImportInviteManagers`.
- **View-as-manager**:
  - `#view_as` and `#revert_to_admin` implement a fully audited flow where:
    - An admin can temporarily assume a manager’s identity and access manager dashboards, while storing original IDs in session for revert.
- **Reports & exports**:
  - `#download_reportees`, `#export_action_status`, `#export_reports_count` provide CSV reports on manager reportees, action completion, and report count.

**Feature Flags**

- `AccountSetting::HIDE_MANAGERS_PAGE` – hides the module for non-Caesar users.
- `account_setting_enabled?("enable_view_as_manager_for_sub_admin")` – controls whether sub-admins can use view-as-manager.

#### Administrators

**Purpose**  
Manage **admin users**, their roles (super admin, sub-admin), and authentication flows (invites, password reset).

**Key Behaviours**

- `AdminsController#index`:
  - Lists active admins (excluding Caesar) and sub-admins, with search and pagination.
- **Admin lifecycle**:
  - Creation links employees with admin records and issues invitations.
  - Update keeps employee and admin attributes in sync.
  - Destroy removes both admin and employee associations.
- **Password reset & invites**:
  - `#forget_password` and `#reset_password` implement full password-reset flows with token expiry logic.
  - `#invites` and `#add_invites` orchestrate **bulk admin invitations**.
  - `#resend_invite` respects a resend interval (`AccountSetting.admin_invite_resend_interval`) and surfaces remaining time in user-friendly language.

**Feature Flags**

- Page-level visibility and access is governed primarily by permission checks (`verify_user_permission`, `check_page_access`) and, for IHCL tenants, by `current_account.ihcl?` (redirects to IHCL dashboard).

**Business Interpretation**

- The General section ensures every tenant has **tight control over who can operate the system**, how employees and managers are modeled, and how integrations and email templates behave, aligning day-to-day operations with governance and security requirements.

