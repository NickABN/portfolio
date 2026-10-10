---
title: "Club Management System"
year: 2026
deck: "A management platform for a private golf and country club: reservations for shared amenities, granular roles for staff, and infrastructure as code. Confidential client."
role: "Full-stack developer"
stack: ["React", "Python", "FastAPI", "PostgreSQL", "Terraform", "Docker", "AWS"]
status: in-progress
featured: true
order: 3
client: true
---

## The problem

A private golf and country club needed one system to run its shared amenities — tennis and padel courts, spa, pilates — and the many people who operate them, each with a different level of access. The client's name stays confidential.

## What I built

- **The reservation system** for shared areas, with a React front end and a Python/FastAPI back end on PostgreSQL.
- **Role-based access control with granular grants:** superadmin, admin, supervisor and operator, plus staff roles. The UI authorises by capability, so each screen and action appears only to whoever is allowed to use it.
- **The Terraform infrastructure** on AWS, iterated with the client's infrastructure team through their reviews, and Docker containers as part of the deployment workflow.
- **Tests for the reservation web app:** unit tests with Vitest and end-to-end tests with Playwright.

## Decisions

- **Capabilities over role checks in the UI.** Components ask "can this user do X?" instead of "is this user an admin?". New roles become a matter of grants, not code changes.
- **Infrastructure reviewed like code.** Writing the infrastructure in Terraform let the client's infra team review every change before it reached their accounts.
- **End-to-end tests on the booking path,** because a double-booked court is the bug members notice first.
