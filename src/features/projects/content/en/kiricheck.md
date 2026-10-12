---
title: "Kiricheck"
year: 2025
deck: "A digital time clock run over WhatsApp, with the bonuses, pre-payroll and incident monitoring that sit on top of attendance data."
role: "Back-end developer"
stack: ["Python", "FastAPI", "AWS Lambda", "DynamoDB", "Playwright"]
status: live
featured: false
cover: ../images/kiricheck-card.en.svg
coverFit: contain
coverAlt: "Employees check in over WhatsApp to a Lambda service that writes to DynamoDB. A FastAPI admin API on Lambda reads it and feeds bonuses, pre-payroll and Excel, CSV and PDF reports."
caption: "A check-in on WhatsApp ends up as a number on the payroll report."
figures:
  - src: ../images/kiricheck-architecture.en.svg
    alt: "Architecture diagram: employees check in over WhatsApp to a Lambda service that writes to DynamoDB; administrators use a Nuxt front end that calls a FastAPI admin API on Lambda, with bonus, pre-payroll, incident-monitor and report modules."
    caption: "From the check-in to the payroll report: one table store, one admin API on top."
    kind: diagram
  - src: ../images/kiricheck-monitor.webp
    alt: "Admin panel, absence monitor: a table of employees for the day with workplace, expected shift and the detected state (no check-in, late by a number of minutes, early exit), plus a management column to justify each incident. The interface is in Spanish and all data shown is fictional."
    caption: "The incident monitor: who is late, missing or left early today, ready to be justified."
    kind: screen
  - src: ../images/kiricheck-bonuses.webp
    alt: "Admin panel, bonus assignments: a table of bonuses assigned to employees for the pay period, such as punctuality, perfect attendance and line productivity, as fixed amounts, percentages or days. The interface is in Spanish and all data shown is fictional."
    caption: "Bonuses assigned per pay period, the input the pre-payroll calculation builds on."
    kind: screen
  - src: ../images/kiricheck-reports.webp
    alt: "Admin panel, reports: hours-worked and overtime charts for the period, headcount by workplace and by role, and a detailed table of first check-in, last check-out and hours per employee, with a download menu. The interface is in Spanish and all data shown is fictional."
    caption: "Attendance turned into payroll numbers: the period at a glance and the detail behind each employee's hours."
    kind: screen
---

## The problem

Businesses with shift workers need to know who clocked in, when, and what that means for pay. Kiricheck lets employees check in and out through WhatsApp, with no hardware at the door, and turns that attendance into the numbers payroll needs.

## What I built

- **The data model and services:** DynamoDB schemas and Python CRUD services on AWS Lambda.
- **The bonuses and pre-payroll modules,** which run their calculations over attendance data.
- **A real-time incident monitor** built with FastAPI.
- **Payroll reports:** Excel exports such as the *lista de raya* with its bonus column, plus CSV and PDF exports.
- **End-to-end tests** with Playwright for the administrator front end.

I keep maintaining the system in production.

## Decisions

- **Serverless for spiky, predictable load.** Check-ins cluster at shift changes; Lambda and DynamoDB absorb those peaks without servers idling the rest of the day.
- **Model the access patterns first.** In DynamoDB the schema follows the queries — attendance by employee and by period — rather than the other way round.
- **Test the screens payroll depends on.** A wrong number on a payroll report costs trust, so the administrator flows are covered end to end.
