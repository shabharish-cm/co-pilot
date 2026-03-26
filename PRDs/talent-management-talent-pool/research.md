# Research: Talent Management — Talent Pool

---

## Problem Framing

Talent Pool is the **third sub-module** in CultureMonkey's Talent Management suite, alongside Skill Gap Analysis and 9-Box Grid. Where Skill Gap Analysis answers *"where are our competency gaps?"* and 9-Box Grid answers *"how do we classify performance vs. potential?"*, Talent Pool answers *"who is ready and willing to move — and where?"*

The core job: HR sends a structured survey to the employee base to capture **internal mobility intent** — willingness to relocate, interest in promotion, future career goals, and similar signals. Responses populate a **searchable, filterable Talent Pool dashboard** that HR can use to identify internal candidates for open roles, plan succession, and avoid external hires where internal talent exists.

**Critical architectural decision:** Like Skill Gap Analysis, Talent Pool is a **standalone module** — it is not a standard CultureMonkey survey. The survey input mechanism is purpose-built for this use case (branching/conditional questions, free text + structured response types), and the output is a directional **talent profile view**, not an engagement report.

**Relationship to Skill Gap Analysis:** These two sub-modules are complementary.

- Skill Gap Analysis gives HR *objective* data: what skills does this employee have vs. what does the role require?
- Talent Pool gives HR *intent* data: is this employee willing to take on a new role, relocate, or pursue growth?
- Together, they form the foundation of an internal mobility decision: *can they do it? do they want to?*

---

## Evidence from Customer

**Source:** Discovery discussion (2026-03-17) — `PRDs/talent-management-skill-gap-analysis/Alumil - Discussion on Mar 17th.md`
**Source:** TAM notes — `context/customers/Alumil/notes.md` (2026-03-24)

### Confirmed Requirements from Discovery

- **Survey-based capture:** HR sends a dedicated survey to employees (not managers) to collect mobility intent signals.
- **Question types required:**
  - Free text: skills, future goals, career aspirations
  - Single-select Yes/No: e.g., "Are you willing to relocate?"
  - Conditional/branching follow-up: if "No" to relocation, employee can provide reasons (HR can view these)
  - Multi-select options also requested
- **Dashboard:** A separate Talent Pool dashboard where HR can filter and search employees by skills, relocation willingness, promotion readiness, and other captured dimensions.
- **Export:** Filtered views should be exportable (format TBD — likely CSV/XLSX based on patterns from Skill Gap Analysis module).
- **Survey must support dynamic/branching logic** — standard CultureMonkey survey builder is insufficient for this.

### Strategic Objectives from Alumil

- Identifies talent and future leaders
- Develops talent and minimizes recruitment costs
- Promotes progression and growth / increases employee retention
- Establishes knowledge sharing and strategic skill development

### Key Open Question Inherited from Discovery

The Alumil discovery doc described this as a *survey sent by HR to employees* — but does not specify:

- Whether employees fill this survey periodically or once (is it a recurring cycle like Skill Gap Assessment?)  
Answer: This should be triggered by admins on demand
- Whether manager input is also part of the Talent Pool (manager nominates employee vs. employee self-nominates)  
Answer: 
- Whether the Talent Pool dashboard cross-references Skill Gap Analysis data (e.g., filter by "below benchmark on Leadership" + "willing to relocate")

---

## Evidence from Transcripts

**No transcript signal found** — search across all `pulse/normalized/*.json` files returned no matches for "talent pool", "internal mobility", "succession", or "relocation willingness".

This is expected: the Talent Pool request came via a specific Alumil-sourced TAM session, not from a broad call scan. The customer evidence base is TAM notes + discovery discussion only.

---

## Evidence from Public Discussions

### Industry Adoption Signal

- 86% of HR leaders said internal mobility is a priority (iCIMS, 2024).
- Employees in high-mobility organizations stay an average of **5.4 years** vs. **2.9 years** in low-mobility orgs — a near 2× retention lift.
- **49% of employees** are open to relocation (up +3 points year-over-year), but the same percentage say nothing would convince them to move — underscoring why capturing this intent as data matters before making role offers.

### Key Obstacles HR Faces Without a Talent Pool Tool

1. **Lack of visibility** — employees don't know about internal opportunities; managers hesitate to lose their best performers to other teams.
2. **No structured intent data** — decisions are made on anecdote and informal manager conversations; there is no HR-level aggregated view of who is available and willing.
3. **Rigid role structures** — without a formal pool, lateral moves and gig assignments are not tracked or encouraged.

---

## HR Community Voice: Reddit r/humanresources + Practitioner Sources

> Note: Reddit's domain is blocked from direct crawl. Pain points below are sourced from HR practitioner publications (AIHR, HR Executive, SkillCycle, TestGorilla, CPS HR, Culture Amp, Gloat, HRZone, Darwinbox, ClearCompany, HCI, Workday, DDI, SHL) that specifically surface and analyze community-reported frustrations, plus direct extraction from practitioner-facing articles. Where statistics are from named research bodies (Gallup, SHRM, Korn Ferry, etc.) they are attributed.

---

### Theme 1: Talent Pool Management — Core Pain Points

**1a. The "data graveyard" problem — talent pools exist but are never used**
- Most organizations' internal talent pools exist as Excel spreadsheets or ATS candidate records that were last updated at hire. There is no trigger or process to refresh them.
- "Talent pools can become stale without regular updates. Outdated profiles or inactive candidates waste time and frustrate hiring teams." (AIHR)
- "Without a governance process, your skills graph will become stale within 18 months." (JobsPikr research)
- **Workaround in use:** HR teams resort to searching LinkedIn to understand their own employees' skills — because internal HRIS data is less current than public profiles. (Gloat)
- **What they wish existed:** A system where employee profiles auto-refresh through triggered inputs (e.g., post-project, post-training, periodic HR-initiated survey), not one-time onboarding data.

**1b. Employees don't update profiles — no incentive**
- "Self-reported profiles are incomplete because employees don't see value in sharing their data. Employees often ask why they should update their skills profiles. Many see it as just extra work that doesn't provide anything useful." (JobsPikr / Skills Graph research)
- This creates a circular failure: HR can't use the talent pool because data is stale; employees don't update because they never see it used.
- **What they wish existed:** Visible proof that pool data is acted upon — e.g., "HR used your profile to shortlist you for X role." Closes the loop for employees.

**1c. No structured capture of career intent — only performance history exists**
- HR systems capture what employees *have done*, not what they *want to do*. HRIS stores job history, certifications, titles. Career aspirations, promotion readiness, and relocation willingness are rarely captured in any structured form.
- "Within the framework of an internal mobility policy, HR practices focus mainly on the skills assessment necessary for the position and leave out an essential component of the equation: motivations." (Salary.com / internal mobility research)
- "Only 24.8% of organizations have implemented a formal career development process; 56.4% rely on informal or casual approaches." (SHRM)
- **Current workaround:** Annual performance review includes a "career goals" field — but it's free text, not filterable, not aggregated across the org, and reviewed only by a direct manager.
- **What they wish existed:** A structured, periodic survey that captures career intent in a filterable, HR-accessible format — exactly the Talent Pool module being built.

**1d. Relocation willingness is invisible until the moment it's needed**
- No current HRIS or talent management tool captures relocation preferences proactively. HR only finds out if an employee is willing to relocate when they are approached about a specific role — by which point external hiring has often already started.
- "Only 2% of Americans are now relocating." Employers have no way to identify who among their workforce would consider it. (Korn Ferry)
- "Employee relocation will never succeed unless the individual employee is persuaded and willing to make the right move for them and their family." — implying that the current model is reactive: identify the role need, then find out if anyone is willing. (Centur Global)
- **What they wish existed:** A dashboard field that shows each employee's relocation preference (Yes / No / Conditionally) captured in advance, so HR can pull a filtered list of "willing to relocate to Chennai" before a role is posted.

**1e. Skills data lives in too many disconnected systems**
- "Skills data lives in too many systems and none of them talk to each other." (JobsPikr)
- ATS holds external candidate history. HRIS holds job titles and certifications. LMS holds training completions. Performance system holds ratings. No single HR-facing view combines these.
- "Despite 85% of companies having talent development systems, only 6% rate them as outstanding." (Darwinbox / Skillsoft 2025 data)
- Only 24% of organizations use a consolidated platform; the rest make decisions from fragmented siloed data. (Darwinbox)
- **What they wish existed:** A unified talent profile view that combines intent (Talent Pool), competency (Skill Gap Analysis), and performance (9-Box) data — the V2 north star for the CultureMonkey Talent Management suite.

---

### Theme 2: Internal Mobility — What's Broken

**2a. Manager talent hoarding is the #1 blocker — and it's systemic**
- "70% of talent acquisition professionals say the main barrier to internal mobility is a manager who doesn't want to let good talent leave their team." (TestGorilla / talent hoarding research)
- "46% of managers actively resist internal mobility initiatives." (Gloat)
- "29% of managers make it difficult for internal candidates to apply for positions within their organizations." (TestGorilla)
- Specific hoarding behaviors documented by HR practitioners:
  - Rating high performers *just below the threshold* for internal transfer eligibility
  - Keeping employees off internal opportunity lists or mobility tracking systems
  - Telling employees they are "not quite ready" for advancement indefinitely
  - Discouraging participation in development programs or rotational assignments
  - Retaliating (reducing responsibilities, lowering ratings) when employees seek other internal roles
- Root cause: "Managers are heavily incentivized to keep people where they are and few see a clear benefit to helping employees develop." Manager bonuses and performance evaluations are tied to unit output, not talent exportability.
- **What HR wishes existed:** Manager KPIs tied to talent development and internal mobility rates — not just team output. Some orgs are beginning to require this; most have not.

**2b. Employees don't know internal opportunities exist**
- "Over 60% of employees say they have never even seen an internal job posting at their company." (Sprad internal mobility survey research)
- Non-desk and frontline employees are particularly excluded — internal job boards are rarely surfaced in their daily workflow.
- The result: employees search LinkedIn and Indeed for opportunities their own employer has open. "49% of millennials are actively job hunting externally or stay open to opportunities." (Gloat)
- "Regrettable turnover costs an average 213% of annual compensation per role." (Gloat)

**2c. Internal candidates get a worse experience than external candidates**
- Internal candidates often receive less support than external applicants — no recruiter guidance, inconsistent job posting quality, and the perception (sometimes correct) that roles are pre-decided.
- "Sometimes a company plans to hire an internal candidate and is just going through the motions with others, often because their internal rules require that every job be posted, that a certain number of candidates be interviewed, etc." (Ask A Manager)
- Fear among employees that applying internally signals disloyalty — especially in cultures where asking for a transfer is seen as dissatisfaction with the current team.
- Only 1 in 5 employees feels confident in their ability to make an internal move. (SkillCycle)

**2d. Pay disparity drives talent out rather than across**
- "It's a poorly held secret in corporate America that employees typically have to change companies to earn a substantial raise, and research by HBR has shown that new hires frequently get paid more than top performers." (NetSuite / HR challenges research)
- Internal mobility programs fail to retain people when external moves offer significantly better compensation. The talent pool loses its best candidates because internal roles don't re-price to market.

**2e. Internal mobility programs are declared but not operationalized**
- "Only 33% of organizations offer formal internal mobility programs." (SkillCycle)
- "59% of companies rate their internal mobility programs as inadequate." (SkillCycle)
- "Only 6% of companies believe they excel at internal mobility." (Gloat)
- Common failure mode: Internal mobility is listed as a company value and HR priority, but there is no structured process, no dedicated tooling, and no accountability mechanism.
- "Internal hiring fell 8% year-over-year, with only 30% of all hires in June being internal." (HR Brew / Workday research, 2025)

---

### Theme 3: Succession Planning — Practitioner Frustrations

**3a. Succession plans become shelf artifacts — never maintained, never used**
- "Many succession plans live in spreadsheets, sit on shelves, or turn into checklist box-ticking exercises." (SuccessionHR)
- "For many organizations, succession planning either lives in a spreadsheet or doesn't exist at all." (SuccessionHR)
- Root cause: Plans are created as a one-time project, not embedded into a recurring management process. "One of the biggest mistakes is framing succession planning as a one-time project." (SuccessionHR)
- Maintenance falls entirely on HR: "The work of maintaining the tool, chasing managers for updates and translating the outcomes into performance management practices falls on the shoulders of HR." (HCI, on 9-box maintenance burden)

**3b. The 9-Box Grid is the dominant tool — and practitioners are frustrated with it**
- Executives disengage: "Executives tune out when using the 9 Box, not because they do not understand the tool, but because they are extremely busy and have no patience for anything that is not simple, clear, and straightforward." (HCI)
- Perceived as HR busywork: "Due to the complexity and time it takes, the 9 Box contributes to the perception that HR creates unnecessary busy work and does not think strategically." (HCI)
- Only 52% accuracy in predicting advancement: "Organizations were only accurate at identifying high-potential individuals 52% of the time" when predicting advancement two levels within five years. (Culture Amp / research citation)
- Demoralization of employees rated low: "Employees assessed as 'LoPo' can become discouraged and disengaged — particularly Gen Z and millennial employees." (Culture Amp)
- The tool labels people, then those labels rarely change: once placed in a box, employees stay there regardless of development.

**3c. Succession planning is limited to the C-suite — critical mid-level roles are unprotected**
- "Focusing only on executives can create bottlenecks in leadership pipelines." (TalentGuard)
- "By 2025, nearly half of organizations report they do not have ready successors for critical roles." (Betterworks)
- Operational managers and specialist roles that are hard to replace are routinely excluded from succession planning because the process is designed for executive-tier only.
- **What HR practitioners wish existed:** Role-criticality-based succession planning that maps positions by replacement difficulty, not by hierarchy level.

**3d. Transparency vacuum — employees don't know they're in the plan**
- "2 in 5 employees feel overlooked by succession planning — and 14% don't even know when it's happening or what it means." (Betterworks, 2025)
- High-potential employees leave because they see no visible path to advancement. "Papers may say 'we develop talent,' but conversations don't reflect reality." (Betterworks)
- Hiding succession plans from employees "causes more problems than it solves — employees who don't understand how future roles are assigned become frustrated and trust erodes." (Betterworks)

**3e. Single-successor dependency is endemic**
- HR practitioners routinely document one successor per role (the "obvious candidate"), creating a single point of failure. If that person leaves or declines the role, succession collapses.
- "Putting all your eggs in one basket leaves you vulnerable." (CPS HR)
- **Best practice known but rarely implemented:** Develop three readiness tiers per critical role — immediate successor, 6-month ready, 2-3 year developmental candidate.

**3f. Bias drives who gets into succession pools**
- "Without rigorous and objective criteria, managers perceive employees who look and act like current leadership as having the greatest leadership potential, irrespective of their capabilities." (AIHR / HIPO research)
- "A 2022 study revealed that women receive substantially lower 'potential' ratings than men, despite receiving higher job performance ratings." (Culture Amp, citing research)
- Succession planning without structured criteria defaults to informal networks and visibility — which means introverted, remote, or non-dominant-group employees are systematically excluded.

---

### Theme 4: High-Potential (HIPO) Identification — Specific Pain Points

**4a. Most organizations don't know who their HIPOs actually are**
- "66% of respondents said their organization may be missing out on identifying HIPOs because they aren't looking deep enough." (Korn Ferry survey)
- "Close to 20% of respondents lacked confidence that they had selected the right people for their HIPO program." (Korn Ferry)
- "More than 40% of employees designated as HIPOs are below average for leadership effectiveness." (Zenger Folkman / Harvard Business Review)

**4b. HIPO programs fail to deliver outcomes despite significant investment**
- "73% of HIPO programs fail to deliver business outcomes and ROI." (SHL research)
- "Only one quarter of HR leaders see their high-potential employee strategy as successful." (Gartner HIPO Development Benchmarking)
- "77% of companies report significant leadership development gaps; 84% expect gaps to persist 5+ years." (SkillCycle / Global Leadership Forecast)
- "Only 20% of companies have a strong bench." (Global Leadership Forecast 2025)

**4c. Performance is confused with potential — leading to wrong designations**
- "HIPO programs focus too much on performance, and that generally leads to problems in today's ever-changing business climate." (GreatPeopleInside)
- The core failure: excelling in a current role does not predict success in a larger or different role. "Success in sales doesn't guarantee success in sales management." (CPS HR)
- HR lacks a structured framework to separate current performance from future leadership potential — so high performers get designated HIPO, and the actual high-potential employees who are not yet top performers get missed.

**4d. HIPO identification is not data-driven — it relies on manager nomination**
- "Many organizations rely heavily on manager nominations or annual performance reviews to identify HiPo employees — an approach that is fraught with bias and inconsistency. A manager may overlook a high-potential employee who is introverted or less visible, or favor those with similar backgrounds." (AIHR)
- Without structured assessment criteria, HIPO designation reflects relationship proximity to leadership, not actual potential.
- Development actions for HIPOs are "random or generic activities" rather than thoughtful and targeted. (Talent Strategy Group, 2024 HIPO Development Report)

**4e. HIPO labels are rarely shared with the employee — and employees who know they're designated often feel entitled; those who don't know leave**
- A dual failure: employees designated as HIPO but not told may not receive the development support they expect, and leave. Employees told they are HIPO may feel entitled and leave when promotions don't follow quickly.
- "High-potential employees being mentored for advancement may leave the company disgruntled when the board decides to keep the current leader or replace them with an external hire." (Betterworks)

---

### Theme 5: Career Aspiration Tracking and Promotion Readiness — What's Missing

**5a. Career aspirations are captured once (at onboarding or annual review) and never revisited**
- Career goals live in free-text fields in annual performance reviews — visible only to the direct manager, not to HR at org level, and never aggregated or searchable.
- "Only 24.8% of organizations have implemented a formal career development process; 56.4% rely on informal or casual approaches." (SHRM)
- No trigger exists to re-ask employees about career intent as their life circumstances, skills, and tenure change.
- **What HR wishes existed:** A structured, periodic intent survey that HR can initiate on demand, that captures career aspiration in filterable, structured form — not as free-text in a performance review.

**5b. Career paths are invisible to employees — they can't see what's possible**
- "Career frameworks stay buried in HR systems and create no visibility around career paths, leaving most workers unaware of progression possibilities." (HRZone)
- "When people can't see how they progress, engagement dips and retention suffers long before leaders notice." (HRZone)
- Managers avoid career conversations because "frameworks are too opaque to guide them." (HRZone)
- **Direct consequence:** Employees who want to grow leave the company because they don't see a path internally, even when one exists.

**5c. Promotion readiness is subjective and undocumented — no defensible record exists**
- "When promotion decisions are challenged — legally, operationally, or culturally — there is no defensible record connecting role requirements to employee readiness." (TalentGuard)
- "Valuable skills and competency data often remain buried in spreadsheets." (TalentGuard)
- Without objective readiness criteria, promotion decisions default to visibility and manager relationships — the same bias vector as HIPO designation.

**5d. HR cannot answer basic talent pool questions without manual research**
- "HR professionals resort to LinkedIn to assess their own employees' skills." (Gloat)
- "Fewer than 1 in 4 organizations possess a consolidated workforce capability view." (Darwinbox / Skillsoft 2025)
- Questions HR cannot currently answer quickly:
  - "Which employees in Operations are ready for a step-up role and willing to relocate?"
  - "Who in the company has expressed interest in a People Management track?"
  - "How many employees in our 2-5 year tenure band are open to a lateral move?"
- Without a Talent Pool dashboard with structured, filterable data, these questions require manual cross-referencing of performance records, manager conversations, and guesswork.

---

### Theme 6: HR Tools and Systems — Structural Gaps

**6a. HRIS is built for administration, not talent intelligence**
- "Traditional HRIS systems can't support capability tracking beyond basic certifications, lack frameworks for skill taxonomies, and make internal mobility nearly impossible to manage at scale." (OutSail)
- HRIS excels at storing employment records but is not designed to surface "who should we move next" or "who wants to grow."
- "Signs you've outgrown your HRIS: data without insights, a lack of visibility into performance trends, a struggle to prove HR's impact to leadership." (15Five)

**6b. Siloed tools prevent a unified talent view**
- "85% of companies have talent development systems, but only 6% rate them as outstanding." (Darwinbox / Skillsoft)
- "Only 24% use consolidated platforms; the rest make decisions from fragmented siloed data." (Darwinbox)
- The typical HR tech stack: HRIS (Workday/BambooHR) + ATS (Greenhouse/Lever) + LMS (Cornerstone/TalentLMS) + Performance (Lattice/Culture Amp) — none of which share data natively. A talent pool view requires manual aggregation across all of them.

**6c. The structured intent capture gap — no tool fills it**
- The Workday/SAP model infers talent pool membership from HRIS profiles and performance data. It does not ask employees directly what they want.
- The Gloat/marketplace model requires employees to actively browse and apply to opportunities — which requires significant org culture investment and only works once employees already know about the system.
- **The gap:** No widely-adopted tool captures intent directly from employees via a structured, HR-initiated survey mechanism and surfaces that intent as a filterable HR dashboard. This is the specific positioning of the CultureMonkey Talent Pool module.

---

### Summary: Top Pain Points Ranked by Frequency Across Sources

| # | Pain Point | Frequency Signal | Relevant to CM Talent Pool |
|---|-----------|-----------------|---------------------------|
| 1 | HR can't see employee skills, intent, or career goals without manual effort | Very High | Direct — this is the core job of the module |
| 2 | Manager talent hoarding blocks internal mobility | Very High | Indirect — CM cannot change manager incentives, but surfacing intent data makes hoarding visible |
| 3 | Succession plans are shelf artifacts — not maintained or used | High | Indirect — 9-Box sub-module is adjacent; Talent Pool feeds succession readiness |
| 4 | HIPO identification is biased and inaccurate | High | Direct — structured intent capture is less biased than manager nomination |
| 5 | Career aspirations are captured once and never revisited | High | Direct — recurring survey cadence solves this |
| 6 | Employees don't know internal opportunities exist | High | Indirect — V2 opportunity matching could address this |
| 7 | Relocation willingness is invisible until it's needed | Medium | Direct — relocation intent question is a core Talent Pool survey field |
| 8 | Talent pool data decays because employees don't update profiles | Medium | Direct — HR-initiated survey refreshes data on a set cadence |
| 9 | Tools are siloed — no unified talent view | Medium | V2 north star — Talent Pool + Skill Gap + 9-Box unified profile |
| 10 | Internal candidates get worse experience than external candidates | Medium | Indirect — better internal visibility reduces this |

---

## Competitor Patterns


| Platform               | Talent Pool / Internal Mobility Approach                                                                                                                                          | Relevant Pattern                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **SAP SuccessFactors** | AI-driven talent discovery with dynamic pools; pools continuously updated and segmented by skills, roles, engagement history; Talent Intelligence Hub for skill-based development | Pool segmentation by multiple dimensions; always-fresh data        |
| **Workday**            | "Talent Marketplace" — matches employees to internal projects, gigs, and new roles; surfaces internal candidates for open roles before going external                             | Marketplace metaphor; opportunity matching against profile         |
| **Lattice**            | HRIS-grade: performance + career development path tracking; AI surfaces top performers and tailors development strategies                                                         | Performance + development path linkage                             |
| **Gloat**              | Dedicated Internal Talent Marketplace — AI matches employees to gigs, mentorships, projects, and full roles based on skills and declared interests                                | Closest analog to Alumil's ask: declared intent + skills = matches |
| **SuccessionHR**       | Succession planning with talent pool readiness indicators and role-based filtering                                                                                                | Readiness scoring + role assignment planning                       |


### Patterns to Adopt

- **Survey-captured intent as pool inputs** (unique to Alumil's ask vs. enterprise platforms that rely on structured HRIS profiles): build the pool from survey responses, not from HR-manually-entered profiles.
- **Filterable dashboard as primary output:** Segment-filtered employee list — by willingness to relocate, promotion readiness, department, role, tenure — is the core HR workflow, not a marketplace feed.
- **Skill Gap Analysis cross-reference:** The most powerful pattern is linking intent data (Talent Pool) with competency data (Skill Gap Analysis) — "Show me employees who are willing to take a leadership role AND are above benchmark on People Management." This is the V2 north star.
- **Branching survey logic:** Conditional follow-up questions (e.g., "Why not willing to relocate?") surface qualitative signal that makes the pool data actionable, not just directional.

### Patterns to Avoid

- **Marketplace/opportunity-matching** (Workday/Gloat model): too complex for V1; Alumil's ask is simpler — capture signals, show them in a dashboard. Don't build a full opportunity posting engine.
- **AI-generated profiles:** SAP SuccessFactors relies on AI to build and update talent profiles continuously. Alumil's model is explicit survey-triggered cycles — do not introduce inferred/AI-generated talent scores in V1.
- **Employee-facing browsing interface:** Talent Pool in V1 is HR-facing only. Employees fill a survey; HR uses the results. Don't expose a browsing UI to employees.

---

## Recurring Complaints or Workarounds


| Current Workaround                                                  | Pain                                                                                                                       |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Informal manager conversations                                      | Not captured in any system; invisible to HR; biased toward vocal employees                                                 |
| Ad-hoc surveys built inside CultureMonkey's standard survey builder | No branching logic support; no Talent Pool output view; data lands in engagement reporting, not a searchable employee pool |
| Excel-tracked lists of "high potential" employees                   | Manual, not updated regularly, no link to skills data, no structured intent capture                                        |
| Annual performance review "career goals" free-text field            | Not filterable, not aggregated at org level, only visible to direct manager, reviewed once a year at best                  |
| LinkedIn search for employee skills                                 | HR uses public profiles to understand their own employees — internal HRIS data is less current than public LinkedIn        |
| 9-Box grid in PowerPoint/Excel for succession planning              | Exec disengagement, maintenance burden falls entirely on HR, data becomes stale in months, no link to development plans    |
| Manager nomination for HIPO designation                             | Biased toward visibility and relationships; misses introverted or non-proximate employees; 40%+ designations are inaccurate |


---

## Architectural Considerations (V1)

**Relationship to Skill Gap Analysis data model:**


| Sub-module         | Data type                                 | Update cadence                  | Primary actor                    |
| ------------------ | ----------------------------------------- | ------------------------------- | -------------------------------- |
| Skill Gap Analysis | Competency ratings per employee per skill | Periodic assessment cycles      | Manager fills for direct reports |
| Talent Pool        | Intent/preference signals per employee    | Survey-triggered (HR-initiated) | Employee self-reports            |
| 9-Box Grid         | Performance vs. potential positioning     | Admin-configured formula        | Admin / Manager                  |


These three share the same employee directory but have **separate data stores and separate views**. The long-term integration pattern (V2+) is a unified employee talent profile that surfaces all three dimensions together.

**Survey design for Talent Pool specifically requires:**

- Branching/conditional question logic (not available in current CM survey builder — must be built new or extended)
- Response types: free text, single-select, multi-select (all standard), plus conditional follow-up blocks
- Survey is HR-initiated (admin sends), employee-completed — not manager-assessed

---

## Confidence Rating

**Medium**

**Reasoning:**

- Customer requirement is confirmed: TAM notes + discovery discussion both document Talent Pool as the third Talent Management sub-module.
- High-level shape is clear: survey-based capture + filterable dashboard + export.
- Capped at Medium because:
  - Branching logic requirement is confirmed but implementation approach is undefined
  - Cross-referencing with Skill Gap Analysis data is implied but not explicitly scoped for V1
  - Recurring cycle vs. one-time survey cadence is not confirmed
  - Whether manager nominates vs. employee self-nominates is not confirmed
  - Exact dashboard filter dimensions beyond "skills" and "relocation" are TBD

---

## Open Questions

1. **Cadence:** Is the Talent Pool survey a one-time exercise or a recurring cycle (e.g., annual)? Should historical responses be tracked like Skill Gap Assessment cycles?
2. **Initiator:** Employee self-reports only, or can managers also nominate/flag employees for the talent pool?
3. **Dashboard cross-reference:** Does V1 allow HR to filter the Talent Pool dashboard by Skill Gap Analysis results (e.g., "above benchmark on Leadership" + "willing to relocate")? Or are these dashboards fully separate in V1?
4. **Branching logic scope:** Is the branching requirement limited to the relocation question, or is full conditional logic needed across all question types?
5. **Employee anonymity:** Are Talent Pool responses anonymous or attributed? (Context: employees declaring willingness/unwillingness for promotions is sensitive — this likely needs to be attributed for HR utility, but may create psychological barriers.)
6. **Export format:** CSV/XLSX as per Skill Gap Analysis precedent, or does the talent pool view need a different export structure?
7. **Visibility to managers:** Can a manager see their direct reports' Talent Pool responses, or is this HR-only?
8. **Skill data input:** Are the "skills" in the Talent Pool dashboard filter sourced from the Skill Gap Analysis skills library, or is this a separate free-text/tag-based input from the survey itself?

---

*Research created: 2026-03-26 | Last updated: 2026-03-26 | Evidence basis: customer-confirmed (TAM notes + discovery doc) + HR community pain point sweep (AIHR, HR Executive, SkillCycle, TestGorilla, Culture Amp, Gloat, Darwinbox, CPS HR, HRZone, SHL, DDI, HCI, Betterworks, TalentGuard, Sprad, Workday, Korn Ferry, SHRM, Gallup, Zenger Folkman/HBR)*

**Sources:**

- Customer discovery notes: `PRDs/talent-management-skill-gap-analysis/Alumil - Discussion on Mar 17th.md`
- Customer account notes: `context/customers/Alumil/notes.md`
- Related sub-module research: `PRDs/talent-management-skill-gap-analysis/research.md`
- [Top 10 Talent Pool Management Software for 2026 | PMaps](https://www.pmapstest.com/blog/best-talent-pool-management-software)
- [Internal Talent Marketplace: Benefits & Best Practices | Gloat](https://gloat.com/blog/internal-talent-marketplace-implementation/)
- [What Is Talent Pool Management? A Practical Guide for HR | AIHR](https://www.aihr.com/blog/talent-pool-management/)
- [Talent Mobility Programs 2025 | HR.com](https://www.hr.com/en/resources/free_research_white_papers/talent-mobility-programs-2025_mbkjnda4.html)
- [Talent Mobility: Strategies, Benefits, and Implementation | Workhuman Live](https://www.workhumanlive.com/blog/talent-mobility/)
- [SAP SuccessFactors Talent Management](https://www.sap.com/products/hcm/talent-management.html)
- [4 best practices for creating an internal talent marketplace | TechTarget](https://www.techtarget.com/searchhrsoftware/feature/4-best-practices-for-creating-an-internal-talent-marketplace)
- [What is internal talent mobility and why is it broken? | Gloat](https://gloat.com/blog/why-internal-talent-mobility-is-broken/)
- [Is Talent Hoarding Blocking Internal Mobility? | Brian Heger](https://www.brianheger.com/is-talent-hoarding-blocking-internal-mobility-in-your-organization-a-self-reflection-for-managers-brian-heger/)
- [Talent Hoarding: The Roadblock to Internal Mobility | TestGorilla](https://www.testgorilla.com/blog/talent-hoarding/)
- [Why Internal Mobility Fails: The Training Gap Crisis | SkillCycle](https://www.skillcycle.com/blog/why-internal-mobility-fails/)
- [Pros and Cons of Using a 9-Box Grid for Succession Planning | Culture Amp](https://www.cultureamp.com/blog/9-box-grid-for-succession-planning/)
- [Top 10 Succession Planning Challenges | CPS HR Consulting](https://cpshr.us/blog-article/succession-planning-challenges/)
- [Succession Planning Challenges | TalentGuard](https://www.talentguard.com/blog/succession-plans-fail)
- [Succession Planning: Challenges and Risks | Betterworks](https://www.betterworks.com/magazine/succession-planning-challenges/)
- [Ditch Your 9 Box and Simplify Succession Planning | HCI](https://www.hci.org/blog/ditch-your-9-box-and-simplify-succession-planning-success)
- [Developing High Potential Talent: 7 Challenges | DDI](https://www.ddi.com/blog/developing-high-potential-talent)
- [How Organizations Are Unlocking Talent With High Potential Programs | SHL](https://www.shl.com/resources/by-type/blog/2024/how-organizations-are-unlocking-their-talent-with-high-potential-programs/)
- [Identifying High-Potential Employees | AIHR](https://www.aihr.com/blog/identifying-high-potential-employees/)
- [Internal Mobility Survey: How Employees Experience Career Opportunities | Sprad](https://sprad.io/blog/internal-mobility-survey-how-employees-really-experience-career-opportunities-inside-your-company)
- [Top Talent Management Challenges in 2025 | Darwinbox](https://darwinbox.com/en-us/blog/top-talent-management-challenges-in-2025-and-how-hr-leaders-can-solve-them)
- [An HR Guide to Retaining Knowledge Through Career Fluidity | HRZone](https://hrzone.com/an-hr-guide-to-retaining-knowledge-and-talent-through-career-fluidity/)
- [Fix Your Talent Pool Strategy | MBO Partners](https://www.mbopartners.com/blog/workforce-management/fix-your-talent-pool-strategy/)
- [Employers Are Failing to Prioritize Internal Mobility | HR Brew](https://www.hr-brew.com/stories/2025/09/16/employers-are-failing-to-prioritize-internal-mobility-according-to-workday-research)
- [2024 High Performer & High Potential Development Report | Talent Strategy Group](https://talentstrategygroup.com/wp-content/uploads/2024/07/2024-High-Performer-High-Potential-Development-Report.pdf)

