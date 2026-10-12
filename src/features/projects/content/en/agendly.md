---
title: "Agendly"
year: 2026
deck: "Appointment booking for small beauty businesses in Mexico, so owners stop running their day from WhatsApp chats."
role: "Founder & sole developer"
stack: ["NestJS", "Nuxt 3", "PostgreSQL", "Prisma", "TypeScript"]
status: in-progress
featured: true
order: 4
cover: ../images/agendly-booking.webp
coverFit: contain
coverAlt: "Booking flow on a phone for a fictional barbershop: a list of services with prices, a choice of specialist, and a day and time grid with a selected slot."
caption: "The booking flow, three taps from link to slot: no account, no app."
---

## The problem

Salons, barbershops and spas in Mexico book appointments by hand over WhatsApp. The owner switches context all day, bookings get lost or mis-recorded, and no-shows arrive without warning. Global tools such as Calendly or Acuity do not fit: they are in English, ask the end client to create an account, and are priced for another market.

## What I built

A multi-tenant SaaS with two sides:

- **A public booking page** at a shareable URL per business. The client picks a service, a staff member and a free slot, leaves only a name and a phone number, and gets an email confirmation. No account required.
- **A mobile-first admin dashboard** with day and week views of every appointment, manual bookings for walk-ins, and cancel or reschedule actions that notify the client automatically.

![Admin agenda for a day of eight appointments with client, service, time and status, plus no-show risk flags on two upcoming bookings that explain why they may not show up.](../images/agendly-admin.webp)

![Impact metrics dashboard: appointments, share booked by the client alone, no-show rate, median booking time, returning clients, weekly appointments, reminder results and the no-show prediction model's accuracy.](../images/agendly-insights.webp)

It is a pnpm monorepo with three packages: a NestJS backend (Prisma, PostgreSQL, Passport with JWT and Google OAuth), a Nuxt 3 frontend (Vue 3, Tailwind CSS, Pinia), and a shared package of TypeScript DTOs and types used by both. Email goes through Resend, CI runs on GitHub Actions and deployment targets Railway.

## Decisions

- **Tenant isolation in the data model.** Every table carries a `tenantId`, so each business is an isolated tenant from the first migration.
- **A channel-agnostic booking engine.** The engine does not know whether an appointment came from the web form, a manual entry or, later, WhatsApp. New channels plug in without touching the scheduling rules.
- **Polling before WebSockets.** The admin refreshes every 10–15 seconds, and only while the tab is visible. It is enough for the MVP and keeps the infrastructure simple; WebSockets are planned for the next version.
- **Soft deletes for staff and services,** so past appointments keep their history when the catalogue changes.
- **Shared contracts.** One package of DTOs keeps the API and the UI from drifting apart.
