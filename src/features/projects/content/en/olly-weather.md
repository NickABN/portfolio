---
title: "Olly Weather"
year: 2026
deck: "A Flutter Web weather app with authentication, built to show how small architecture decisions keep a demo honest and easy to grow."
role: "Sole developer"
stack: ["Flutter", "Dart", "Riverpod", "go_router"]
status: live
featured: false
liveUrl: "https://olly-olly-weather.netlify.app"
repoUrl: "https://github.com/NickABN/olly-weather-app"
---

## The problem

A small app — sign in, see the weather where you are — is easy to build carelessly. The goal was to build it the way a real product would start: no keys to leak, no plaintext secrets, and an auth layer that can move to a real back end without touching the UI.

## What I built

A Flutter Web app with login and registration, a route guard that redirects unauthenticated users, and live weather from Open-Meteo. It is organised by feature (`auth`, `weather`), each split into data, domain and presentation, with Riverpod for state and go_router for navigation.

## Decisions

- **Open-Meteo, no API key.** Nothing to leak in a public repo, native CORS for Flutter Web, and anyone can clone and run it. The cost: WMO weather codes need a local mapping table.
- **Hashed credentials, in-memory session.** Passwords are stored only as bcrypt hashes, and no token is written to browser storage, which removes an XSS-stealable session at the price of re-login after a reload. In production the server would hash (Argon2id) and the session would live in an `HttpOnly` cookie.
- **Stale-while-revalidate.** The last snapshot renders immediately while a fresh fetch updates it, so the user never stares at a spinner.
- **Depend on an interface.** The app talks to an `AuthRepository`, so moving from the in-memory store to a real back end such as Supabase is a one-line change.
