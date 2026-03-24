# CultureMonkey Product Glossary

This document defines the **canonical terminology** used in the CultureMonkey platform.

AI agents must use these terms consistently when generating:

- UX flows
- PRDs
- UI mockups
- documentation

---

# Core Platform Concepts

## Survey
A structured questionnaire used to collect employee feedback.

Types:
- Engagement Survey
- Pulse Survey
- Lifecycle Survey
- eNPS Survey

---

## Pulse Survey
A short recurring survey used to track engagement continuously.

---

## Lifecycle Survey
Automated surveys triggered by employee lifecycle events.

Examples:
- Onboarding
- 30-day check-in
- 90-day review
- Exit survey

---

## Driver
An engagement dimension used to categorize survey questions.

Examples:
- Wellbeing
- Growth
- Leadership
- Recognition
- Work Environment

Driver scores are aggregated from related survey questions.

---

## eNPS
Employee Net Promoter Score.

Scale: **0–10**

Categories:

- Promoters (9–10)
- Passives (7–8)
- Detractors (0–6)

---

## Heatmap
A visual grid representing engagement scores across drivers and employee segments.

---

## Segment
A filtered employee group.

Examples:

- Department
- Location
- Tenure
- Manager
- Gender

---

## Action
A corrective initiative created from survey insights.

Actions are:

- assigned
- tracked
- completed

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

- sentiment analysis
- topic clustering
- word clouds

---

## Topic Explorer
AI-based clustering of employee feedback themes.

---

## Report Builder
Tool used to create customized report dashboards.

---

## Manager Dashboard
Analytics dashboard showing engagement data for a manager’s team.

---

## Admin Dashboard
Global analytics dashboard for administrators.

---

## Channels
Distribution mechanisms for surveys.

Examples:

- Email
- Slack
- Microsoft Teams
- WhatsApp
- SMS

---

## Snapshot
Point-in-time capture of engagement metrics.

---

## Org Hierarchy
Organizational reporting structure visualization.

---

## Employee Attributes
Metadata fields describing employees.

Examples:

- Department
- Location
- Role
- Tenure

---

## Feedback Module
The section of the platform where managers and admins review open-text employee comments.

Sub-tabs:
- Summary
- Open Comments
- Question Comments
- Word Cloud

Each comment card supports: reactions, starring, marking as viewed, creating an Action, and initiating a Conversation.

---

## Initiate Conversation
A feature in the Feedback module that allows managers or admins to start an anonymous back-and-forth exchange with an employee about their specific feedback.

How it works:
- Manager/admin clicks "Initiate conversation" on a comment card.
- An anonymous chat window opens within the platform.
- The employee receives the message as an email from the product (sender identity is the platform, not the manager).
- Employee replies via email; replies surface in the same chat window for the manager.
- All exchanges are anonymous — the employee's identity is never revealed to the manager, and the manager's identity is never revealed to the employee.
- The conversation can be resolved by the manager using the "Resolve" control.
- A "Show Feedback" toggle lets the manager reference the original comment within the chat window.

Anonymity model: end-to-end anonymous. The platform acts as the neutral relay. No identifying metadata is exposed on either side.