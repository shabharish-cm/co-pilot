# CultureMonkey UX Patterns

This document defines **standard UX interaction patterns** used throughout the platform.

AI agents must follow these patterns when generating:

- UX flows
- UI mockups
- product features

---

# 1. Wizard Pattern

Used in:

- Survey creation
- Lifecycle setup
- Integration configuration

Structure:

Overview → Questions → Participants → Schedule → Review

Rules:

- Users can move forward or backward
- Final step shows summary before publish

---

# 2. Search + Filter Pattern

Common in list pages.

Layout:

Search bar on left  
Filter dropdowns on right  
Export button on far right

Selected filters appear as **dismissible tags**.

---

# 3. Bulk Action Pattern

Used in tables.

Steps:

1. User selects rows using checkboxes
2. Bulk action toolbar appears
3. Actions available: Export, Delete, Send Reminder

---

# 4. Drill-down Analytics Pattern

Used in reporting modules.

Flow:

Dashboard → Driver → Segment → Responses

Users can click charts or heatmap cells to drill deeper.

Breadcrumb updates reflect hierarchy.

---

# 5. Card Pattern

Primary information container.

Structure:

Card Header  
Card Body  
Optional Card Footer

Used in:

- dashboards
- analytics
- survey questions

---

# 6. KPI Card Pattern

Displays a single key metric.

Components:

Metric label  
Large numeric score  
Trend indicator

---

# 7. Empty State Pattern

Displayed when no data exists.

Structure:

Illustration  
Description text  
Primary action button

Example:

"No surveys found"

---

# 8. Confirmation Pattern

Used for destructive actions.

Always show confirmation modal.

Buttons:

Cancel (secondary)  
Delete / Confirm (danger)

---

# 9. Export Pattern

Export options appear as dropdown.

Options:

- PDF
- PPT
- Excel
- CSV

Files generate asynchronously.

---

# 10. Modal Form Pattern

Forms appear in centered modal overlay.

Structure:

Header  
Form body  
Footer actions

Primary button always appears on the right.

---

# 11. Status Indicator Pattern

Status shown with colored dot.

Examples:

Draft — Orange  
Published — Green  
Scheduled — Amber  
Ended — Dark

---

# 12. Loading Pattern

Centered spinner displayed during data loading.

Color: brand green.

---

# 13. Integration Card Pattern

Grid of cards showing integrations.

Each card contains:

Logo  
Name  
Connection status  
Configure button

# CultureMonkey — Refined Product UI Document

## Purpose

This document defines the **visual design system and UI component standards** for the CultureMonkey platform.

It is intended for:

- AI agents generating UI mockups
- designers building new screens
- engineers implementing front-end features

This document **does not define product terminology or UX logic**. Those belong in:

- product-glossary.md
- ux-patterns.md

---

# 1. Global Design Principles

The CultureMonkey UI follows a **modern enterprise SaaS design language** focused on:

- data clarity
- minimal visual noise
- fast form workflows
- structured analytics presentation

Key goals:

- Make analytics **legible and actionable**
- Ensure workflows are **predictable and structured**
- Maintain **consistent component patterns**

---

# 2. Visual Theme

## Brand Personality

| Property | Value |
|---|---|
Brand | CultureMonkey |
Tone | Professional, analytical, calm |
Domain | HR analytics / employee engagement |
Design Style | Minimal enterprise SaaS |

---

# 3. Color System

## Primary Brand Colors

| Name | Hex | Usage |
|---|---|---|
Brand Green | #55ce97 | Primary buttons, active nav |
Green Dark | #4cb485 | Hover states |
Green Alt | #50cf95 | Alternate CTA shade |

---

## Background Colors

| Name | Hex | Usage |
|---|---|---|
Main Background | #ffffff | Main content |
Sidebar Background | #F8FDFA | Sidebar |
Card Header | #f7f7f7 | Card headers |
Light Background | #f8f9fa | Application background |

---

## Text Colors

| Name | Hex | Usage |
|---|---|---|
Primary Text | #373A3C | Body text |
Muted Text | #6c757d | Labels |
Dark Text | #343a40 | Strong headings |

---

## Status Colors

| Status | Color |
|---|---|
Success | #28a745 |
Warning | #ffc107 |
Danger | #dc3545 |
Info | #3471db |
Neutral | #414248 |

---

# 4. Typography

## Font Family

Primary font:

IBM Plex Sans

Fallback:

-apple-system  
BlinkMacSystemFont  
Segoe UI  
Roboto  
Arial  

---

## Typography Scale

| Role | Size | Weight |
|---|---|---|
Page Title | 32px | 300 |
Section Title | 24px | 500 |
Card Title | 20px | 500 |
Body Text | 15.5px | 400 |
Caption | 13px | 400 |
Badge | 10–12px | 700 |

---

# 5. Spacing System

Spacing follows rem scale.

1rem = 16px

| Token | Size |
|---|---|
xs | 8px |
sm | 16px |
md | 24px |
lg | 32px |
xl | 40px |
xxl | 48px |

---

# 6. Layout Architecture

## Global Layout

Top Navigation  
↓  
Sidebar  
↓  
Main Content Area

---

## Sidebar

Width: 250px  
Background: #F8FDFA  

Sections:

- LISTEN
- ANALYSE
- INSIGHTS
- ACT
- GENERAL

Active item:

background: #55ce97  
text: white

Hover:

background: #e7e8ea

---

## Top Navigation

Contains:

- sidebar toggle
- global search
- language selector
- settings
- profile menu

Height: ~60px  
Background: #F8FDFA

---

# 7. Core UI Components

## Primary Button

class: .btn-primary

background: #50cf95  
color: white  
border-radius: 3px  
padding: 0.725rem 1.5rem  

Hover: #4cb485

Used for:

- Save
- Create
- Submit

---

## Secondary Button

class: .btn-secondary

background: #f7f7f7  
border: 1px solid #dee2e6  
text: #414248

Used for:

- Cancel
- Back

---

## Outline Button

class: .btn-outline-primary

border: 1px solid #55ce97  
text: #55ce97

Hover:

background: #55ce97  
color: white

---

## Danger Button

class: .btn-outline-danger

border: 1px solid #dc3545  
text: #dc3545

Used for delete actions.

---

# 8. Cards

Cards are the **primary UI container**.

background: white  
border-radius: 3px  
shadow: 0 6px 13px rgba(0,0,0,0.1)

Structure:

Card Header  
Card Body  
Optional Footer

---

# 9. Forms

## Text Input

Height: ~48px  
Border: 1px solid #CAD1D7

Focus:

border: #5dd29c

---

## Dropdown

Enhanced with Select2.

Supports:

- search
- multi-select

---

## Textarea

Used for:

- survey questions
- descriptions
- email templates

Resizable vertically.

---

## Toggle Switch

border-radius: 34px

Active: green  
Inactive: gray

---

# 10. Tables

Tables use alternating row colors.

white  
#f7f7f7  
white  
#f7f7f7

Features:

- pagination
- sorting
- bulk actions

---

# 11. Badges and Status Indicators

Status uses **colored circle + label**.

Examples:

● Draft  
● Published  
● Scheduled  
● Ended

---

# 12. Modals

Modal structure:

Header  
Body  
Footer

Body padding: 2rem

Overlay: semi-transparent backdrop

---

# 13. Data Visualizations

Supported chart types:

- Heatmap
- Driver score bars
- eNPS stacked bar
- Trend charts
- Word cloud
- Bubble charts
- KPI cards

Primary chart color: brand green.

---

# 14. Loading and Empty States

## Loading

Centered spinner  
Color: #55ce97

## Empty State

Illustration  
Message  
Primary CTA

Example:

No surveys found  
Create your first survey

---

# 15. Responsive Behavior

Framework: Bootstrap 4

Breakpoints:

xs <576px  
sm 576px  
md 768px  
lg 992px  
xl 1200px

Sidebar collapses on mobile.

Tables scroll horizontally.

---

# 16. Front-End Technology Stack

CSS Framework: Bootstrap 4.1.3  
Icons: Font Awesome  
Charts: D3.js  
Dropdowns: Select2  
Date Picker: DateRangePicker  
Autocomplete: Typeahead.js  
Tables: DataTables  
Rich Text: TinyMCE  
Font: IBM Plex Sans

---

This document defines **visual UI rules only**.

For terminology and interaction patterns see:

product-glossary.md  
ux-patterns.md
