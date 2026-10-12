---
title: "Kiricheck"
year: 2025
deck: "A digital time clock run over WhatsApp, with the bonuses, pre-payroll and incident monitoring that sit on top of attendance data."
role: "Back-end developer"
stack: ["Python", "FastAPI", "AWS Lambda", "DynamoDB", "Playwright"]
status: live
featured: false
cover: ../images/kiricheck-architecture.en.svg
coverFit: contain
coverAlt: "Architecture diagram: employees check in over WhatsApp to a Lambda service that writes to DynamoDB; administrators use a Nuxt front end that calls a FastAPI admin API on Lambda, with bonus, pre-payroll, incident-monitor and report modules."
caption: "From the check-in to the payroll report: one table store, one admin API on top."
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
