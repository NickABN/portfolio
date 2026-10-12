---
title: "Agendly"
year: 2026
deck: "Appointment booking for small beauty businesses in Mexico, so owners stop running their day from WhatsApp chats."
role: "Founder & sole developer"
stack: ["NestJS", "Nuxt 3", "PostgreSQL", "Prisma", "TypeScript"]
status: in-progress
featured: true
order: 2
cover: ../images/agendly-booking.webp
coverFit: contain
coverAlt: "Booking flow on a phone for a fictional barbershop: a list of services with prices, a choice of specialist, and a day and time grid with a selected slot."
caption: "The booking flow, three taps from link to slot: no account, no app."
figures:
  - src: ../images/agendly-admin.webp
    alt: "Admin agenda for a day of eight appointments with client, service, time and status, plus no-show risk flags on two upcoming bookings that explain why they may not show up."
    caption: "The day’s agenda, with no-show risk flagged and explained."
    kind: screen
  - src: ../images/agendly-insights.webp
    alt: "Impact metrics dashboard: appointments, share booked by the client alone, no-show rate, median booking time, returning clients, weekly appointments, reminder results and the no-show prediction model's accuracy."
    caption: "What the tool does for the owner: bookings, no-shows, reminders and how accurate the risk model is."
    kind: screen
---

## The problem

Salons, barbershops and spas in Mexico book appointments by hand over WhatsApp. The owner switches context all day, bookings get lost or mis-recorded, and no-shows arrive without warning. Global tools such as Calendly or Acuity do not fit: they are in English, ask the end client to create an account, and are priced for another market.

## What I built

A multi-tenant SaaS with two sides:

- **A public booking page** at a shareable URL per business. The client picks a service, a staff member and a free slot, leaves a name and a phone number (an email is optional, and brings a confirmation), and is done. No account required.
- **A mobile-first admin dashboard** with day, week and month views of every appointment, manual bookings for walk-ins, and status changes (completed, no-show, cancelled). Cancelling emails the client, when they left an address, with a link to book a new time.
- **No-show early warning.** Upcoming bookings are scored for no-show risk and flagged in the agenda, with the reasons spelled out (for example, the client missed earlier appointments or is new). The day before the appointment, Agendly emails a reminder; for high-risk bookings the email asks more directly for a confirmation or a call to free the slot.
- **An impact screen** that shows the owner what the tool is doing: how many bookings arrive on their own through the link, the no-show rate, how long clients take to book, returning clients, weekly volume, and how reminders and the risk model are performing against the business's own results.

It is a pnpm monorepo with three packages: a NestJS backend (Prisma, PostgreSQL, Passport with JWT and Google OAuth), a Nuxt 3 frontend (Vue 3, Tailwind CSS, Pinia), and a shared package of TypeScript DTOs and types used by both. Email goes through Resend and CI runs on GitHub Actions. The front end deploys to Netlify and the API to Render, on a managed Neon PostgreSQL, with logo and banner uploads optimised to WebP on Cloudflare R2. Sentry, structured JSON logs with request IDs and health checks cover observability.

Around the core, the account basics are in place: sign-up with email or Google, password reset by a single-use link that expires in 30 minutes, and Terms, Privacy notice and ARCO pages, with terms acceptance stored per user.

## Decisions

- **Tenant isolation in the data model.** Every table carries a `tenantId`, so each business is an isolated tenant from the first migration, with its own timezone for availability, booking validation and every displayed time.
- **A channel-agnostic booking engine.** The engine does not know whether an appointment came from the web form, a manual entry or, later, WhatsApp. New channels plug in without touching the scheduling rules.
- **Soft deletes for staff and services,** so past appointments keep their history when the catalogue changes.
- **An interpretable no-show model, not a black box.** The score is a logistic formula over a few visible signals: the client's earlier no-shows and completed visits, whether they are new, how far ahead they booked, the booking channel and whether they left an email. The weights are informed priors rather than trained values, because one small business has too little history to fit a model without overfitting, and the owner needs to see why a booking is flagged. The metrics screen backtests the score on past appointments, using only the history that existed before each one, so the weights can be re-fitted once there is enough data. It is only an aid: it never blocks or refuses a booking.
- **Reminders from an external scheduler.** The free API host sleeps when idle, so an in-process cron would not fire. A GitHub Actions job calls a secret-protected endpoint every hour, and each appointment is claimed atomically before sending, so two overlapping runs never email the same client twice.
- **Double-booking blocked in the database.** A PostgreSQL exclusion constraint rejects overlapping confirmed appointments for the same employee, so the guarantee holds even when two requests arrive at once.
- **Cookie sessions with rotating refresh tokens.** The login token lives in an httpOnly cookie that scripts cannot read, short-lived and renewed through a refresh token that rotates on every use; reusing an old one revokes the whole chain.
- **Billing built, switched off.** Stripe subscriptions, a 14-day trial and access enforcement exist, but a single server flag keeps them off while Agendly is free; the page becomes a voluntary-support link instead. The flag stays off until payment terms and invoicing are settled.
