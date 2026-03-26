# CultureMonkey Product Glossary

This document defines the **canonical terminology** used in the CultureMonkey platform.

AI agents must use these terms consistently when generating:

- UX flows
- PRDs
- UI mockups
- documentation

Last enriched: 2026-03-24 (full platform crawl + Survey Builder walkthrough + Report tab deep-dive)

---

# Core Platform Concepts

## Survey
A structured questionnaire used to collect employee feedback.

Types:
- Engagement Survey
- Pulse Survey
- Lifecycle Survey
- eNPS Survey

Survey states: **Draft → Published → Running → Ended**

---

## Pulse Survey
A short recurring survey used to track engagement continuously. Sends a single question to employees at a configurable cadence (Every Day / Every Week / Every 2 Weeks / Every Month). Only one question is sent at a time to two randomly split groups.

---

## Lifecycle Survey
Automated surveys triggered by employee lifecycle events. Configured per stage under the **Lifecycle (Autopilot)** section.

Stages (with trigger windows):
- Onboarding (10d–20d post-join)
- Adaptation (10d–20d)
- Productivity (4–6 months)
- Comfort (6–8 months)
- Growth (8–10 months)
- Burnout & Wellness (18 months)
- Separation (T-1 month before exit)

Each stage can be set to Active or Inactive, with Anonymous or Confidential anonymity.

---

## Driver
An engagement dimension used to categorize survey questions.

Full driver list (as seen on platform):
- Meaningful Work
- Social Connection
- Autonomy
- Work Environment
- Leadership
- Management
- Work Life Balance
- Involvement
- Communication
- Rewards
- Recognition
- Growth & Development
- Purpose Alignment
- Innovation
- Wellness

Driver scores are aggregated from related survey questions.

---

## eNPS
Employee Net Promoter Score.

Scale: **0–10**

Categories:
- Promoters (9–10)
- Passives (7–8)
- Detractors (0–6)

Formula: eNPS = % Promoters − % Detractors (range: −100 to +100)

Reference: Any score above 0 is acceptable; 10–30 is good; 50 is excellent; −10 is a warning sign.

---

## Heatmap
A visual grid representing engagement scores across drivers and employee segments. Configurable via segment filters (Region, Band, Teams, Locations, Reporting Manager, Sub Team, Business Unit, Tenure, Gender, Employee Type, Business Group, Country, etc.).

---

## Segment
A filtered employee group used for analytics slicing.

Standard segments:
- Department / Team / Sub Team
- Location
- Tenure
- Reporting Manager
- Gender
- Employee Type
- Business Unit / Business Group
- Band
- Region
- Country

Custom segments can also be defined via Custom Attributes in Organisation Settings.

---

## Action
A corrective initiative created from survey insights.

States: **TO DO → IN PROGRESS → COMPLETED**

Sources: Direct, Survey, Answer, Question

---

## Survey Builder
The interface used to create and configure surveys.

Main stages:
1. Overview
2. Questions
3. Participants
4. Schedule
5. Review

---

## Comment Analytics
Module used to analyze open-text responses.

Features:
- Sentiment analysis (Negative / Neutral / Positive breakdown)
- Topic clustering
- Word clouds
- Driver Stats

---

## Topic Explorer
AI/GPT-backed clustering of employee feedback into topics. Presents topics as an interactive bubble chart. Clicking a bubble shows a topic deep-dive with associated comments and sentiment.

---

## Report Builder
One-stop solution for all pre-built, downloadable reports. Curated from industry requirements across multiple surveys.

Report types available:
- All Question Distribution
- Heatmap
- Distribution
- Text Response
- eNPS Advanced
- Rating Distribution – Standard Attributes
- Driver Scores – Managers
- Driver Scores – Teams
- NPS Rating Distribution (Location, Business Unit, Team)
- eNPS Rating Distribution – Managers
- eNPS Promoters & Detractors (Teams, Sub Teams, Locations, Business Units, Managers)

---

## Manager Dashboard
Analytics dashboard showing engagement data restricted to a manager's own team.

---

## Admin Dashboard
Global analytics dashboard for administrators. Main view is the **Overview** page.

---

## Channels
Distribution mechanisms for surveys. CultureMonkey supports an omni-channel approach to maximize participation.

Available channels:
- **Email** — Default. CultureMonkey manages end-to-end email domain delivery.
- **Slack** — Dedicated CultureMonkey Bot sends survey notifications and reminders.
- **Microsoft Teams** — Bot with customizable notification message body per survey.
- **WhatsApp** — Instant survey links + proactive anonymous feedback (employee messages the CultureMonkey contact; converted to anonymous feedback).
- **SMS** — For employees not on apps/email; especially useful for blue-collar workers.
- **QR Code** — Survey distributed via QR code; respondents scan to participate.
- **Kiosk** — Survey distributed via a shared kiosk device.

---

## Snapshot
Bite-sized, point-in-time capture of key organisational metrics. Located in the **Snapshots** section (beta).

Includes:
- Total Employees (Active vs Inactive breakdown)
- Employee Happiness Meter
- Dominant Generation breakdown
- Diversity breakdown (Gender)
- Flag Bearers (top eNPS promoters)
- Primary Locations
- Commanders-in-Chief (managers with most reports)
- Skipped Employees count
- Silent Employees count
- Notification Channels activated count
- Phone number coverage warning

---

## Org Hierarchy
Organizational reporting-structure visualization. Displays the manager–reportee tree with engagement data.

View modes:
- **Current Hierarchy** — Live org tree view
- **Survey Filters** — Tree filtered to a specific survey's participants

View options: Driver Scores Only, Direct Only, Full View

---

## Employee Attributes
Metadata fields describing employees.

Standard fields:
- Employee ID / External ID
- First Name / Last Name
- Email Address
- Phone Number
- Team / Sub Team
- Location
- Designation
- Department
- Reporting Manager (Manager Email)
- Date of Joining
- Date of Birth
- Date of Separation
- Gender
- Tenure
- Employee Type (Regular, Part-time, ShiftWorker, Probation, Outworker)
- Base (Local, Non-local, Expat)
- Job Status (Employed, On-Notice, Relieved)
- Band
- Region
- Business Unit / Business Group
- Country

Custom attributes can be added via Organisation Settings → Custom Attributes.

---

## Feedback Module
The section of the platform where managers and admins review open-text employee comments.

Sub-tabs:
- **Summary** — Aggregate metrics: total comments, average sentiment, comment-to-action ratio, proactive comments, top teams/locations/keywords/drivers.
- **Open Comments** — Full list of all text responses.
- **Question Comments** — Comments filtered by specific survey question.
- **Word Cloud** — Visual word-frequency cloud.
- **Driver Stats** — Feedback volume broken down by engagement driver.

Each comment card supports: reactions, starring, marking as viewed, creating an Action, initiating a Conversation.

---

## Initiate Conversation
A feature in the Feedback module that allows managers or admins to start an anonymous back-and-forth exchange with an employee about their specific feedback.

How it works:
- Manager/admin clicks "Initiate conversation" on a comment card.
- An anonymous chat window opens within the platform.
- The employee receives the message as an email from the platform (sender identity is the platform, not the manager).
- Employee replies via email; replies surface in the same chat window for the manager.
- All exchanges are anonymous — the employee's identity is never revealed to the manager, and the manager's identity is never revealed to the employee.
- The conversation can be resolved by the manager using the "Resolve" control.
- A "Show Feedback" toggle lets the manager reference the original comment within the chat window.

Anonymity model: end-to-end anonymous. The platform acts as the neutral relay. No identifying metadata is exposed on either side.

---

# Dashboard Metrics & Charts

## Overall Score
The aggregate engagement score for the organisation. Displayed prominently on the Dashboard Overview (e.g., 6.88/10). Weighted average across all active driver scores.

---

## Participation Rate
The percentage of invited participants who have responded to a survey. Tracked at survey, lifecycle stage, and org level.

---

## Engagement Score Over Time
Time-series line chart on the Dashboard showing how the Overall Score has trended. Filter options: Last 12M, Last 3M, Last 30D.

---

## eNPS Over Time
Time-series line chart on the Dashboard showing how the eNPS has trended. Filter options: Last 12M, Last 3M, Last 30D.

---

## Overall Driver Performance
Bar chart on the Dashboard showing all drivers plotted against their score and participation rate. Overlays an **Industry Benchmark** line for comparison.

---

## Driver Scores Over Time
Multi-line chart on the Dashboard comparing all driver score trends over time. Each driver has an individual toggle in the legend.

---

## Industry Benchmark
A reference overlay shown on the Overall Driver Performance chart indicating how the organisation's driver scores compare to industry standards.

---

## Compare Survey
Feature on the Dashboard heatmap. Allows selecting a past survey to compare its driver scores side-by-side with the current survey, visualised as differences on the heatmap grid.

---

## Export to XLS
Dashboard export feature that downloads the currently filtered heatmap/analytics data as an Excel file. Option to **Include Color Coding** (conditional formatting) in the export.

---

# Lifecycle Analytics

## Lifecycle Analytics
Dedicated analytics section for all lifecycle surveys. URL: `/lifecycle/reports`

Sub-tabs:
- **Summary** — High-level metrics per lifecycle type (Engagement Score, Participation, Silent Employees, High Score / Low Score segments, Feedback breakdown, Actions count).
- **Reports (Overall Analysis)** — Detailed analysis across all lifecycle stages.
- **Drivers (Driver Analysis)** — Driver-level breakdown for lifecycle surveys.
- **Disengaged (Disengaged Analysis)** — Focused view on disengaged employees identified through lifecycle data.

---

## Silent Employees
Employees who have been added to a survey but have not answered any survey. Tracked in Lifecycle Analytics and Snapshots.

---

## Skipped Employees
Employees who have not been added to any survey at all. Visible on the Snapshots page.

---

## Boost Participation
A feature in Lifecycle Analytics (and surveys) to remind managers with low participation rates to nudge their direct reports. Allows filtering managers by participation rate range: 0–25%, 25–50%, 50–75%, 75–99%.

---

## Prominent Answers
In Lifecycle Reports, a curated view surfacing the questions/answers with the highest or lowest scores. Separated into:
- **High Score** — "What Acme is good at?"
- **Low Score** — "Where Acme should improve?"

Linkable to detailed question or free-text views.

---

## Negative Feedback (Lifecycle)
Lifecycle Reports feature surfacing negative open-text comments so admins can take targeted action.

---

# Survey Management

## Survey Status
States a survey can be in:
- **Draft** — Created but not launched.
- **Published** — Launched and visible to participants.
- **Running** — Currently active and collecting responses.
- **Ended** — Closed; no more responses accepted.

---

## Clone Survey
Duplicates an existing survey (questions, settings) to create a new one. Available on each survey card in the Surveys list.

---

## Get Survey Link
Generates a shareable URL for a survey. Only participants already added to the survey can respond via this link.

---

## Export Participants
Downloads a list of all participants added to a survey.

---

## Export Unanswered Participants
Downloads a list of survey participants who have not yet responded. Used for targeted follow-up.

---

## Remind Unanswered
Sends a reminder notification to participants who have not yet completed the survey. Available on Running surveys.

---

## Remind Managers
Sends a reminder to managers whose teams have low participation rates, prompting them to encourage their direct reports. Configurable with a custom email template.

---

## Anonymity Setting
Each survey or lifecycle stage can be configured as:
- **Anonymous** — Respondents cannot be individually identified in reports.
- **Confidential** — Higher privacy standards; stricter data access controls.

---

## Anonymity Threshold
The minimum number of responses required before a survey's data is displayed in the Reports Panel or analytics views. Protects individual respondent identity.

---

## Survey Templates
Pre-built survey templates available under the **Templates** section.

Template categories:
- Base (Local, Non-local, Expat)
- Basic
- Exit (Notice Period, Post Separation)
- Gender (Female, Male, Other)
- Generation (Gen Z, Millennials, Gen X, Baby Boomers)
- Inclusivity (I, II, III)
- Job Satisfaction (I, II)
- Leadership (Relationship, Skills & Awareness)
- Lifecycle (Onboarding, Adaptation, Productivity, Comfort, Growth, Burnout & Wellness, Separation)
- Onboarding (Phase 1, Phase 2)
- Pay Band (L1, L2, L3)
- Remote Work
- Role (Operation level, Mid-level, Top-level)
- Tenure (0-1yr, 1-3yr, 3-5yr, 5+yr)
- Wellness (Generic, Wellness at Work)
- Covid-19

Templates can also be created from scratch as **Custom Templates**.

---

# Feedback & Comments

## Proactive Comment
Employee-initiated feedback submitted outside a formal survey. Captured by forwarding or sending an email to the organisation's dedicated CultureMonkey feedback inbox (e.g., `account@feedback.cmstaging.in`). Appears in the All Responses module under "Proactive Comment."

---

## Proactive Feedback Inbox
A unique email address assigned to each CultureMonkey account (format: `<account_slug>@feedback.cmstaging.in`). Emails sent or forwarded to this address are captured as anonymous feedback and visible in the Feedback module.

---

## Comment-to-Action Ratio
The ratio of total open-text feedback comments to the number of actions created. Indicates how actively feedback is being addressed. Displayed in both the Feedback Summary and Actions Summary.

Example: `0.0 (8095 comments / 5 actions)`

---

## Feedback-to-Action Ratio
Same concept as Comment-to-Action Ratio; used interchangeably in the Actions module.

---

# Reports & Downloads

## Reports Panel
A download center for bulk survey reports. Accessible at `/reports_panel`.

Filters by:
- Survey (only surveys meeting the anonymity threshold and >1% participation are shown)
- Identity Type (Anonymous / Confidential)

Report types available:
- Standard Heatmap
- Manager Scores (heatmap driver score distribution across managers)
- Location, BusinessUnit, Team (NPS Rating Distribution)

---

## Lifecycle Reports (Download)
In Lifecycle Analytics, each stage supports participant list download (EMPLOYEE ID, NAME, TEAM, LOCATION, REPORTING TO).

---

# Insights & Intelligence

## Manager Statistics
Dedicated insights section (beta) surfacing manager-level performance and demographic indicators.

Buckets:
- **Hi-pot Managers** — Managers with highly engaged employees.
- **Managers with Poor Team Engagement** — Managers with low engagement scores.
- **Completed Half a Decade** — Managers who have been with the org for 5+ years.
- **Women in Leadership** — % of managers who are women.
- **Millennial Managers** — % of managers from the Millennial generation.
- **Converted Long-Tenured Employees** — Employees with 5+ year tenure who are now managers.
- **Attrition of Managers** — % of managers who have left in the past year.
- **Managers with High Attrition** — Managers with high employee attrition in their teams.

---

## Hi-pot Managers
High-potential managers identified in Manager Statistics as having highly engaged direct reports.

---

## Nudge
A feature in Manager Statistics. Triggers a sample CultureMonkey notification (image nudge) for a sample engagement driver, sent to a selected admin across all enabled channels. Used to test or demonstrate the nudge communication flow.

---

## Employee Happiness Meter
A gauge chart on the Snapshots page showing overall employee sentiment based on analysis of open-text survey comments. Displays % Sad / % Neutral / % Happy, with an overall sentiment score.

---

## Flag Bearers
Top 10 employees who are the strongest promoters of the organisation (highest eNPS scores). Displayed in Snapshots with Employee Name, Team, Manager, and Location.

---

## Commanders-in-Chief
Managers with the highest number of direct reports. Listed in Snapshots with Manager Name and Team Size.

---

## Dominant Generation
A breakdown chart in Snapshots showing the workforce composition by generation: Gen Z, Millennials, Gen X, Baby Boomers.

---

# Channels & Integrations

## HRMS Integrations
CultureMonkey supports native integrations with HR systems for automated employee sync:
- GSuite (user import)
- Keka
- BambooHR (continuous sync)
- SuccessFactors
- Workday
- ADP (every 6 hours)
- Darwinbox
- Zoho People
- Workline
- Namely

Authentication integrations:
- Google SSO
- Okta (SCIM provisioning)
- OneLogin (SCIM provisioning)

Notification channel integrations:
- Slack
- Microsoft Teams

---

## SCIM
System for Cross-domain Identity Management. Protocol used by Okta and OneLogin integrations to provision and sync employee data into CultureMonkey.

---

## Employee Attribute Mappings
Configuration screen under Integrations that maps HR system (provider) field names to CultureMonkey field names. Supports both Standard (fixed system fields) and Custom (user-defined) field mappings. Also supports dynamic mapping (for hierarchical fields using index and separator).

---

# Admin & Organisation Settings

## Organisation Settings
Central admin configuration page (Settings → General and sub-tabs).

Sub-tabs:
- General (Org name, employee segment size, timezone, industry, country, logo)
- Drivers
- Languages
- Demographics → Teams, Sub Teams, Locations, Custom Attributes, Business Units, Business Groups
- Mails
- Integrations
- Heatmap Label
- Introduce
- Email Templates (lifecycle stage templates)
- Feedback
- Advanced
- Translation → Enps, Custom Enps, Enps Options
- Feedback Scale of Rating
- Survey Form Element
- Tooltip Texts
- Heatmap Settings
- Act Filter Settings

---

## Custom Attributes
Admin-defined employee demographic fields beyond the standard set. Used as additional segment filters in the heatmap, reports, and analytics. Configured in Organisation Settings → Custom Attributes.

---

## Heatmap Label
Configuration option in Organisation Settings to customise the display labels shown in the Heatmap grid.

---

## Feedback Scale of Rating
Organisation-wide setting to configure the scale used for rating questions (e.g., 5-point vs 10-point scale). Affects how scores are calculated and displayed.

---

## Custom eNPS
An organisation-configurable variant of the eNPS question, allowing customisation of the question text while maintaining the standard scoring model.

---

## Email Templates (Survey)
Pre-built and custom email templates for survey communication.

Standard lifecycle templates:
- Email 1: Introduction of CultureMonkey
- Email 2: Survey Release
- Email 3: Survey Reminder 1
- Email 4: Survey Reminder 2 (standard and fun variants)
- Email 5: Date Extension
- Email 6: Survey Closure
- Lifecycle stage templates: Onboarding, Adaptation, Productivity, Comfort, Growth, Burnout & Wellness, Separation
- Manager Reminder Email

---

## Band
An employee demographic attribute representing pay band or organisational seniority level. Used as a segment filter in the Heatmap and Org Hierarchy views.

---

## Region
An employee demographic attribute representing the geographic region. Available as a segment filter.

---

## Lens
A custom or configurable segment filter type visible in the Dashboard heatmap. Used for account-specific demographic groupings.

---

# User Roles

## Super Admin
The highest-privilege role in CultureMonkey. Has full access to all org settings, surveys, reports, employee data, and admin management.

---

## Sub Admin
A restricted admin role. Can create and manage surveys but has limited access to org-level settings and analytics.

---

## Manager
A user role with access to their own team's engagement data via the Manager Dashboard. Can view feedback and create Actions for their team.

---

## Candidate Mode
A view accessible via the "Switch to Candidate" button in the admin navigation. Allows admins to preview the survey experience from an employee or candidate's perspective. Used for QA and survey preview.

---

## Authorised Manager
A manager who has been granted explicit access to view engagement data within CultureMonkey. Shown in Snapshots as "Authorised Managers" count (vs Total Managers).

---

# Survey Builder — Step-by-Step Reference

The Survey Builder has **5 steps**: Basic → Questions → Audience → Settings → Preview.

---

## Step 1: Basic (Survey Settings)

The first step of the Survey Builder. Configures foundational survey properties.

Fields and options:

**Business Group** — Scopes the survey to a specific Business Group. Determines which employees are eligible and which Business Group logo is used.

**Survey Name** — Internal title. Cannot contain: `/ \ ? % * : | " < > =`

**Survey Label (Participant-Facing)** — Optional display name shown to employees instead of the Survey Name. Leave blank to use the Survey Name.

**Survey Description** — Free-text description visible to survey creators; not shown to participants.

**Survey Logo** — Options: Default (org logo, or Business Group logo if available) or Custom (uploaded JPG/PNG/JPEG, max 2MB, recommended 100×100px).

**Survey Background** — Theme for the survey-taking screen. Built-in options: Default (Beach), Blue, Latte Discussion, Spring Forest, Star Leaves, Tree Clouds, Wood Garlic. Plus "Create your own theme" (custom upload, recommended 1440×1050px, max 2MB).

**Survey Mode** — Toggle "Mark as test survey." Test surveys can be deleted after launch; non-test surveys cannot be deleted post-launch.

**Identity Settings** — Controls respondent privacy:
- **Anonymous** — No individual employee data is revealed in reports.
- **Non-anonymous** — Admins can view individual employee responses.

**QR-only Survey** — When enabled, no notifications or reminders are sent. Participants access the survey via direct link or QR code only.

**Question Settings:**
- **Add eNPS to this survey** — Appends the standard eNPS question.
- **Add custom NPS question** — Org-defined custom NPS questions can be toggled on/off individually.
- **Placement of NPS questions** — Top or Bottom of the survey.
- **Disable feedback** — Removes the open-text feedback field at the end of the survey.

**Question Language Settings:**
- **Multilingual** — Creates a multilingual survey. Employees choose their preferred language in the survey form. Note: showing the same question in English and a regional language increases form length.
- **Show Default Question (in English)** — When multilingual is on, also shows the English version of each question.

**Driver Settings** — Choose between CultureMonkey Default drivers or org-defined Custom drivers. Mixing default and custom drivers in one survey is not allowed.

---

## Step 2: Questions (Survey Questions)

Manages the question content of the survey.

**Sections** — Questions are grouped into collapsible sections (e.g., Engagement, Autonomy & Environment, Management). Each section maps to one or more drivers. Sections can be expanded/collapsed.

**Question Card** — Each question shows: question number, question text, driver tag, question type, and order number. Click to edit.

**Per-section actions:**
- **ADD QUESTION FROM OUR LIBRARY** — Opens the Question Library modal, filterable by driver. Shows questions available for each driver with their question type.
- **ADD CUSTOM QUESTION** — Opens the custom question editor modal.
- **Add Grid Question** — Adds a matrix/grid-style question to the section.

**ADD A NEW SECTION** — Adds a new driver section to the survey.

**Import Questions** — Bulk-import sections and questions via CSV file upload.

### Question Types

| Type | Description |
|------|-------------|
| Rating | Numeric scale (1–5 or 1–10). Core question type for driver scoring. |
| Single Select | One choice from a list of options. |
| Multiple Select | Multiple choices from a list of options. |
| Free Text | Open-ended text entry. Does not contribute to driver score. |
| File / Upload | Participant uploads a file as their response. |
| Grid | Matrix question — rows are sub-questions, columns are rating options. |

### Scale of Rating (for Rating questions)
Agreement, Satisfaction, Quality, Frequency, Performance, Importance, Focus, Happiness

### Scale Display Type (for Rating questions)
- **Default** — Numeric labels with anchor text (e.g., "Very dissatisfied" → "Very satisfied").
- **Smiley** — Emoji/smiley face icons instead of numbers (also called Smiley Likert scale).

### Question Settings (per question)
- **Driver** — Which engagement driver this question is mapped to.
- **Order** — Position of the question within its section.
- **Enable skip answer** — Allows respondents to skip this question. Configurable skip text.
- **Enable comments for this question** — Adds a free-text comment box below the rating question.
- **Mark this question as mandatory** — Prevents survey submission if left blank.
- **Comments Placeholder Text** — Custom hint text shown in the comment box.

---

## Step 3: Audience (Survey Participants)

Manages the list of employees who will receive the survey.

**Upload Participants** — Bulk import via CSV (email addresses of existing employees only).

**ADD PARTICIPANTS** — Opens a search modal:
- Search by Employee ID, Name, Email, or Phone.
- **Add Filters** — Filter employees by demographic segments (Team, Location, Business Unit, etc.) before selecting.
- Displays a paginated employee table with checkboxes.

**CLEAR ALL** — Removes all currently added participants.

Participant count is shown in the step header (e.g., "Step 3: Survey Participants (0)").

---

## Step 4: Settings (Schedule & Publish)

Controls when and how the survey is launched and communicated.

**Launch Settings:**
- **Send immediately** — Survey is queued and notifications begin rolling out within 5 minutes.
- **Send on** — Scheduled launch at a specific date and time (based on org timezone, e.g., Asia/Kolkata).

**End Date** — When the survey closes and stops accepting responses.

**Launch Channel** — Select which channels send the initial survey invitation:
- Email, SMS, WhatsApp, Slack

**Email Template — Launch Template** — The email template used for the survey launch notification. Selected from the org's Email Templates library.

**Email Template — Reminder Template** — The email template used for all subsequent reminder notifications.

**Send a test Email** — Sends a preview of the selected template to the admin's email.

**Communication Preferences** — Configures when reminders are sent. Click **ADD REMINDER** to add scheduled reminder dates (only available after launch and end dates are set).

---

## Step 5: Preview

A read-only rendering of the full survey form exactly as participants will see it. Shows:
- Survey title and description
- Estimated time to complete (e.g., "20.0 mins")
- Total question count
- All sections with questions in order
- Rating scales with anchor labels
- Open feedback box at the end

Used for final QA before publishing.

---

# Survey Report — Tab Reference

Each ended or running survey has a detailed report accessible from the Reports list. The report has **8 tabs**.

---

## Report Header (per survey)

Displayed above all tabs:

| Field | Description |
|-------|-------------|
| Status | Ended / Running |
| configure | Link to survey notification settings |
| Question count | Total questions in the survey |
| Participant count | Total employees added to the survey |
| Date range | Launch date → End date |
| Created by | Admin who launched the survey |

---

## Report Tab 1: Summary

High-level participation and engagement metrics for the survey.

Key stats:
- **Emails sent** — Total notification emails dispatched.
- **Employees responded** — Count who submitted responses.
- **Employees didn't respond** — Count who did not respond.
- **Participation rate** — % of participants who responded.
- **Bounce Rate** — % of emails that bounced (requires sufficient data).
- **Survey clicks vs Employees responded** — Click-through to submission conversion.
- **Average Response Time** — How long employees took to complete the survey (requires sufficient data).

Charts:
- **Emails Sent vs Employees Responded** — Bar/line chart showing delivery vs response trend.
- **Feedback Distribution** — Breakdown of total feedback by sentiment.
- **Average Feedback Sentiment** — Org-level sentiment gauge.

---

## Report Tab 2: Report (Heatmap View)

The core analytics view. Displays engagement scores broken down by driver and demographic segment.

**Top metrics:**
- Overall Score (e.g., 6.0/10)
- Participation rate (e.g., 94.9%)
- eNPS score with "VIEW BREAKDOWN" link

**PARTICIPATION OVER TIME** — Line chart showing response submissions per day over the survey window.

**ENGAGEMENT SCORE BY DRIVERS (Heatmap):**
Heatmap grid showing driver scores per demographic segment. The active segment is selected from the tab bar: Region, Band, Teams, Locations, Reporting Manager, Sub Team, Business Unit, Tenure, Gender, Employee Type, Business Group, Country, Food Preference, Lens, and any custom attributes.

**Heatmap Filters (inline):**
- Team (cascading to Location, custom fields)
- Overall Score range: All / Low (1–4) / Medium (5–7) / High (8–10)
- Rating Distribution: All / Low (1–2) / Medium (3) / High (4–5)
- Apply Filter / Clear Filters
- Search within heatmap

**CREATE ACTION** — Button to create an action directly from the heatmap view.

---

## Report Tab 3: Insights

Comparative driver analysis with segment filtering.

**Driver Insights** — Bar chart comparing how employees across different segments rate each engagement driver.

**Compare & Filter panel:**
- **Compare Survey** — Select a past survey to compare driver scores side-by-side.
- **Filter** — Filter by demographic segment (Team, Location, Business Unit, etc.).

**Insights Summary:**
- Top performing drivers (ranked 1–3 with scores)
- Bottom performing drivers (ranked 1–3 with scores)

**Sub-views:**
- **Answer Distribution by Questions** — Per-question score distribution filtered by segment.
- **Answer Distribution by Drivers** — Driver-level score distribution filtered by segment.

**Export Insights** — Download as PDF, XLS, or CSV. Options: "Select Report Insights" (choose which view to export).

---

## Report Tab 4: Questions

Question-by-question score breakdown with demographic filtering.

**Filter sidebar:**
- **DEMOGRAPHICS** — Teams, Locations, Sub Teams, Business Units, Managers, Business Groups (each shows count of available options).
- **TYPES** — Filter by question type: All, Rating, Single Select, Multiple Select, Free Text, Image, Upload.

**Question list** shows per question:
- Question number and text
- Driver tag
- Score (for rating questions)
- Response count
- **Create action** — Create an action directly linked to that question.

---

## Report Tab 5: Word Cloud

Visualisation of keyword frequency across all text responses for the survey.

**Metrics:**
- **Total Keywords** — All unique keywords across all text sources.
- **Open Feedback** — Keywords from the open feedback field.
- **Answer Keywords** — Keywords from question comment fields.

**Filter By:**
- All
- Feedback (open-text feedback only)
- Individual questions (filterable by question number)

The word cloud is interactive — clicking a keyword filters to comments containing that word.

---

## Report Tab 6: Text Responses

Full list of all open-text comments submitted in the survey, with filtering and action capabilities.

**Response Categories (counts):**
- **Open Feedback** — Responses from the survey-end feedback field.
- **Free Text Responses** — Answers to explicitly Free Text type questions.
- **Question Comments** — Comments attached to Rating questions with comments enabled.

**Advanced Filter panel (Match All / Match Any):**
- Starred Responses
- Team
- Business Unit
- Manager
- Location
- Sentiment (Sad / Neutral / Happy)
- Tenure

**Per-comment card shows:**
- Comment text
- Sentiment tag (Sad / Neutral / Happy)
- Source survey name
- Driver tags associated with the comment
- Employee segment (Team, Location)
- **"Translated from Original Language"** indicator — shown when the response was auto-translated.
- **Create Action** — Create an action from this comment.
- **View messages** — View any Initiate Conversation thread linked to this comment.
- **Initiate conversation** — Start an anonymous conversation with the respondent.

**Export** — Download all text responses.

---

## Report Tab 7: Benchmark

Compares the org's driver scores against industry benchmarks.

**Filter By Region** — Narrow the benchmark comparison to a specific global region (e.g., LATAM, APAC, All Regions).

**Download** — Export the benchmark comparison data.

**DRIVER SCORE VS INDUSTRY BENCHMARK chart** — Bar chart with two series per driver: Your Overall Score vs the industry benchmark for your industry and employee size tier.

---

## Report Tab 8: eNPS Benchmark

Compares the org's eNPS score against industry eNPS benchmarks segmented by region. (Mirrors the Benchmark tab structure but focuses on eNPS instead of driver scores.)

---

# Report Export Options

Available on every report tab from the export toolbar:

| Export | Format | Notes |
|--------|--------|-------|
| Export to XLS | .xlsx | Option: Include Color Coding (conditional formatting). Exports based on current filters. |
| Export to PDF | .pdf | Option: Include Insights. |
| Export Executive Summary | .pdf / .docx | Beta. High-level executive summary format. |
| Export to PPTX (Advanced) | .pptx | Beta. Option: Compare with Previous Survey (select a past survey for trend slides). |
| Export Comments | — | Beta. Downloads all comment text. |
| Export Free Text Responses | — | Beta. Downloads free-text question answers only. |
| Get shareable link | URL | Generates a public read-only link to the report. Anyone with the link can access it. |
| Generating your report | async | Triggers async pre-generation of the full report (for large surveys). |
