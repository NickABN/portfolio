---
title: "Club Management System"
year: 2026
deck: "A management platform for a private golf and country club: reservations for shared amenities, granular roles for staff, and infrastructure as code. Confidential client."
role: "Full-stack developer"
stack: ["React", "Python", "FastAPI", "PostgreSQL", "Terraform", "Docker", "AWS"]
status: in-progress
featured: true
order: 1
client: true
cover: ../images/club-system-card.en.svg
coverFit: contain
coverAlt: "A React app on S3 and CloudFront calls a FastAPI back end over PostgreSQL on RDS. An OpenAPI contract is written first, and a Python ETL loads the legacy database. Terraform reviewed like code delivers it all on AWS."
caption: "The platform on one line: browser, API, database, and the contract that binds them."
figures:
  - src: ../images/club-system-architecture.en.svg
    alt: "Architecture diagram: staff and operators use a React app on S3 and CloudFront that calls a FastAPI back end over PostgreSQL on RDS, with an OpenAPI contract, Goose migrations, Terraform and a Python ETL from the legacy database around it."
    caption: "One contract, one schema: the web app, the API and the data migration all hang from them."
    kind: diagram
  - src: ../images/club-system-etl.en.svg
    alt: "Legacy migration flow: the legacy database is read, staged raw, transformed and mapped in a dry run, then written to the new PostgreSQL schema, with validation, idempotent reruns and a run ledger with rollback."
    caption: "How a legacy row becomes a member record: read-only, staged raw, mapped in a dry run, validated, then written."
    kind: diagram
---

## The problem

A private golf and country club needed one system to run its shared amenities — tennis and padel courts, spa, pilates — and the many people who operate them, each with a different level of access. The client's name stays confidential.

## What I built

- **The reservation system** for shared areas, with a React front end and a Python/FastAPI back end on PostgreSQL.
- **Role-based access control with granular grants:** superadmin, admin, supervisor and operator, plus staff roles. The UI authorises by capability, so each screen and action appears only to whoever is allowed to use it.
- **The Terraform infrastructure** on AWS, iterated with the client's infrastructure team through their reviews, and Docker containers as part of the deployment workflow.
- **The data migration from the legacy club database.** A Python ETL that reads the old system without ever writing to it, stages every row untouched, maps it into the new schema and checks the result before it counts.
- **Tests for the reservation web app:** unit tests with Vitest and end-to-end tests with Playwright.

## Decisions

- **Capabilities over role checks in the UI.** Components ask "can this user do X?" instead of "is this user an admin?". New roles become a matter of grants, not code changes.
- **Infrastructure reviewed like code.** Writing the infrastructure in Terraform let the client's infra team review every change before it reached their accounts.
- **Migrate in stages you can rerun and undo.** The ETL stages legacy rows raw with a hash per row, so reruns skip what has not changed. Mapping runs as a dry run by default, row counts are validated against the source, and every write is tagged with a run ID so one load can be rolled back without touching the rest.
- **End-to-end tests on the booking path,** because a double-booked court is the bug members notice first.
