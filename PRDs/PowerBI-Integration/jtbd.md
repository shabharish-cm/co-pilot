# JTBD: Power BI Integration

*Generated: 2026-03-26 | Evidence basis: `research.md` (transcript-backed export pain + public interoperability patterns)*

---

### 👤 User Persona & Context

**Persona 1 — HR Analytics Owner (Primary)**
- **Who they are:** HRBP / People Analytics lead / Program owner running engagement and lifecycle surveys for enterprise accounts.
- **Primary Goal:** Get CultureMonkey data into leadership-ready analytics workflows without recurring manual report work.

**Persona 2 — BI / Reporting Analyst (Secondary)**
- **Who they are:** Analyst who maintains external dashboards (Power BI/Looker/internal BI) and supports monthly/quarterly review packs.
- **Primary Goal:** Receive reliable, refreshable, privacy-safe data feeds from CultureMonkey with minimal reconciliation effort.

---

### 🎯 Core Jobs To Be Done (JTBD)

**Job 1: Automate Leadership Reporting Feeds**
- **Statement:** When *I am preparing recurring leadership/business reviews*, I want to *get scheduled, reusable exports from CultureMonkey into my BI workflow*, so I can *stop rebuilding reports manually each cycle*.
- **Type:** Functional
- **Current Workaround:** Manual CSV exports, report-builder pulls, and one-off presentation prep.
- **Pain Points (The "Push"):**
  - Repetitive manual extraction and formatting effort.
  - Chart-level insights are not always export-ready by default.
  - Dependency on ad-hoc support for custom pulls.
- **Supporting Quote:** *"Part of the reason we did this was that we would not have to do a bunch of manual work, that we could just export these reports."* (`01KFNEGECQXGC40V2R96ZE5CQH`)

---

**Job 2: Trust Metric Freshness and Count Consistency**
- **Statement:** When *I consume incremental scheduled exports*, I want to *know exactly which timestamp defines freshness*, so I can *trust that counts and trends are consistent across runs*.
- **Type:** Functional + Emotional (confidence)
- **Current Workaround:** Manual reconciliations, caveat notes, and timing explanations in review meetings.
- **Pain Points (The "Push"):**
  - Count mismatches when employees are added in one period and submit in another.
  - No single agreed "freshness key" can create confusion in downstream BI.
- **Supporting Quote:** *"There will be a slight mismatch of count on the number of people added... and... who responded."* (`01KHXEKAEBEXHK0HQHW5HDX10E`)

---

**Job 3: Share Data Externally Without Breaking Privacy Rules**
- **Statement:** When *I export lifecycle/survey data to external analytics*, I want to *enforce role-based and anonymity-safe data access*, so I can *meet governance expectations without blocking legitimate reporting needs*.
- **Type:** Functional + Social (be seen as a responsible data steward)
- **Current Workaround:** Restrict extraction to higher-privilege users; others rely on aggregate dashboards or request assisted exports.
- **Pain Points (The "Push"):**
  - Role limits can block downstream analysis for some users.
  - Tension between anonymity controls and external data use.
  - Governance concerns increase with wider export access.
- **Supporting Quote:** *"Sub admins cannot export that confidential report... they can't extract any kind of confidential data."* (`01KFD9CZW1QGGXE3QF1BEFQXA6`)

---

**Job 4: Get Segment-Specific Data Without Report Sprawl**
- **Statement:** When *different stakeholders ask for location/team/manager cuts*, I want to *self-serve filtered datasets quickly*, so I can *avoid creating and managing a large number of one-off reports*.
- **Type:** Functional
- **Current Workaround:** Support-led raw data pulls per segment and repeated custom report generation.
- **Pain Points (The "Push"):**
  - High support dependency for filtered data requests.
  - Too many bespoke files for similar asks.
  - Slow scale as stakeholder count grows.
- **Supporting Quote:** *"I can give you raw data filtered out by any particular location... It's going to be a lot of reports."* (`01KMHWX4486AP6W2SR5RSYJR2T`)

---

### 💡 Feature Opportunities & Implications

- **Opportunity 1:** Build **CM Push API + scheduler** as the primary V1 delivery path (aligned to research answer), with configurable cadence and destination.
- **Opportunity 2:** Standardize incremental exports on **submission time** as canonical freshness key, and include explicit watermark metadata in every export run.
- **Opportunity 3:** Enforce multi-layer governance in data egress: **per-tenant controls + row policies + masked views** (all three, as captured in research answers).
- **Opportunity 4:** Provide **self-serve export setup** for admins (onboarding wizard + schema docs + health status) to reduce support-owned manual pulls.
- **Opportunity 5:** Ship opinionated BI-ready data contracts (stable keys, history handling, late-arrival behavior) so dashboard owners can maintain reliable models.

---

### ❓ Missing Context / Follow-up Questions

1. What is the minimum required V1 dataset for export (which entities/measures must be included on day one)?
2. What target SLA should be committed for export latency, retries, and backfill behavior? (Research currently marks this as pending dev decision.)

---

### Confidence Level

**Medium-High**

**Reasoning:**
- Multiple enterprise transcript signals consistently point to scheduled export demand, manual reporting pain, and external dashboard workflows.
- Research includes concrete implementation direction (CM Push API, submission-time freshness, self-serve setup intent).
- Confidence is below High because transcripts did not explicitly mention "Power BI" by name, and technical SLA details remain open.

### Unresolved Assumptions

- V1 integration mode is **CM Push API** (from research open-question answer), not direct live pull.
- Canonical freshness key is **submission time** (from research open-question answer).
- Tenant isolation model should include **all three**: per-tenant controls, row policies, and masking.
- Ownership is **self-serve customer setup** for ongoing use (from research open-question answer), with minimal support dependency by design.
- Export SLA and primary scale format decisions are still unresolved and require engineering sign-off.

---

*JTBD created: 2026-03-26 | Source: `PRDs/PowerBI-Integration/research.md`*
