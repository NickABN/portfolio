# Feature: portfolio-refinements

## Objective
Bring the approved mockup refinements (design canvas https://claude.ai/artifact/QUWRrYt9HjHU5PJVuenAy4, version 19) into the Astro site.

## Problem / Why
After reviewing the deployed build locally, the owner asked for: light mode by default; visible theme and language controls; a floating contact rail (LinkedIn, GitHub, CV); and the hero sphere turned into a rotating sphere of the technologies they work with, steerable with the cursor.

## Approved design
- **Theme:** light by default regardless of system preference; dark only when the visitor picks it (persisted). Control: segmented `☀ Light | ☾ Dark` (ES `Claro | Oscuro`) with sun/moon icons.
- **Language:** segmented `EN | ES` (links to the localized page).
- **Segmented style:** 1px ink border, square, ≥44px wide, active option filled ink with paper text; inactive hover/focus draws a 1.5px underline left→right (`scaleX`, 0.5s, 0.1s delay), retracts on leave. Active option never changes on hover.
- **Contact rail:** fixed right edge, vertically centered; three 48px square buttons (LinkedIn ↗, GitHub ↗, Résumé — PDF ↓; CV solid ink), stacked with 1px ink borders, no right border. Hover/focus: the button grows leftward into a rectangle revealing an uppercase label (max-width transition 0.6s with 0.12s delay, label opacity after 0.3s; collapse fast without delay); LinkedIn/GitHub fill ink with paper text. Phone (≤640px): horizontal row bottom-right, icons only. No visible group label; accessible name "Contact links" / "Enlaces de contacto".
- **Tech sphere (Fig. 1):** 14 logos on a Fibonacci sphere (Flutter, AWS, TypeScript, React, Vue, Astro, NestJS, Python, FastAPI, Django, Java, Spring Boot, Apache Spark, Hadoop) projected every frame (always facing front; depth → scale 0.6–1.1 and opacity 0.25–1), name in uppercase label under each logo, faint wire rings behind (opacity ~0.22). Slow auto-rotation; pointer over the figure steers rotation with easing; on leave returns to idle spin. Reduced motion: static. Accessible as a list "Technologies I work with". Caption: "The working stack. It turns on its own; move your cursor over it to steer." / "El stack de trabajo. Gira por su cuenta; mueve el cursor encima para guiarlo."
- **Icons:** monochrome `currentColor`. Simple Icons 16.34.0 (CC0-1.0) for all but AWS; AWS from Devicon 2.17.0 `amazonwebservices-plain-wordmark` (MIT); Java uses the OpenJDK icon (Java/AWS were removed from Simple Icons at the trademark owners' request). Logos remain trademarks of their owners; attribution in README.
- Source data: `tech-stack-icons.json` (name, source, viewBox, path) prepared by the parent in the session scratchpad.

## Scope
In: theme default + controls, language control, contact rail, tech sphere, attribution, tests, docs.
Out: new projects/content, deployment (Netlify comes after this feature).

## Constraints
Same as `odd/tasks/portfolio-site.md`: Astro + own CSS, no new runtime deps (icons vendored as data), vertical slices, English artifacts with ES in dictionaries, no AI attribution in commits, Conventional Commits.

## TDD
ON (session configuration "Strict TDD Mode: enabled"); runner Vitest (`pnpm test`).

## Applicable checks
`pnpm test`, `pnpm check`, `pnpm build`.

## Delivery
- Branch `feat/portfolio-refinements` from `main` at `6bfd49b`.
- Strategy: same as the previous feature — the user authorized pushing to `main` when everything is green and reviewed (fast-forward, push `origin main`).
- RDD on; assess after each work-unit commit.
- Forecast ~700 authored lines (icon data excluded as generated/vendored).

## Tasks
- [x] R1 Light default + segmented theme and language controls with underline hover. Route: delegated writer (2+ non-trivial files: theme logic, tokens, masthead, toggle).
- [x] R2 Floating contact rail (contact slice), expanding buttons, mobile row, reduced motion. Route: delegated writer.
- [x] R3 Tech sphere: vendored icon data, pure orbit math + tests, client loop with pointer steering, visibility pause, reduced motion, caption/i18n, README attribution. Route: delegated writer.

- [ ] R4 Mobile layout (≤640px), approved in canvas v23 (artboard "Mobile — 390"): 22px side gutter; top chips bar (EN ES letter chips left, ☀ ☾ icon-only chips right, separate bordered chips, active filled, no hover underline; edition text hidden); nameplate; tagline smaller; horizontal scrollable section bar (Work · Index · Profile · Contact) under the tagline (mobile only; Index section gets id="index"); front page single column, sphere plate 1:1, scene 250px, orbit radius 100, label 9px, plate clips overflow; page never wider than viewport (overflow-x: clip); Index rows become cards (year left + status right / title 26px / stack 14px; no header row, no arrow, no horizontal scroll); sections padding 40px/52px; footer stacked; contact rail = floating 48px round icon-only buttons stacked bottom-right (16px), LinkedIn/GitHub ink border on paper, CV solid ink. Desktop unchanged. Verification includes a headless 390px measurement (no horizontal overflow; text blocks ≥ 22px from both edges). Route: delegated writer.
- [x] R5 Fix: scroll-driven animations were dropped by the Lightning CSS minifier — DONE inline as `116931f` (longhands + regression test). Route: inline (1 CSS file + test).

## Acceptance criteria
- First visit renders light even when the OS prefers dark; choosing Dark persists across pages; no flash.
- Theme and language controls show the active option filled; hover draws the underline; keyboard focus shows the same.
- Rail visible on every page, links from site config, CV solid; grows on hover/focus with the specified timing; row at bottom-right on phones.
- Sphere shows 14 logos, rotates, steers with the pointer, static under reduced motion, pauses when offscreen or tab hidden.
- `pnpm test`, `pnpm check`, `pnpm build` pass.

## Progress / evidence
- R1 `d8a9082` feat(shared): light default (dark only when stored), dark tokens only under [data-theme="dark"], segmented Light|Dark buttons (aria-pressed, all instances) + EN|ES links (aria-current), underline-draw hover. RED 5 failed → GREEN 60/60.
- R2 `9e1db35` feat(contact): ContactRail in BaseLayout (every page), grow-on-hover timings from mockup, phone bottom row + 80px body padding. No pure logic; check/build verified (3 rail links per page).
- R3 `e1357e8` feat(hero): TechSphere with 14 vendored icons (techStack.ts), orbit.ts math (21 tests), SSR initial positions, rAF loop with pointer steering, IntersectionObserver/visibility pause, reduced motion static; WireSphere + tilt removed; README tech sphere + third-party icons. GREEN 77/77 (parent spot check 77 passed). check 0; build 17 pages.
- Review R1–R3 (base 6bfd49b, medium, slice_budget_reached): consent granted; review-reliability; APPROVED, acknowledged, burned. Boundary → e1357e8.
- Fix `e104500` fix(shared): theme-color meta follows in-session switches (bindThemeToggles onThemeChange). RED 2 failed/77 → GREEN 79/79; check 0; build 17. Assess: medium, under_budget (pending in slice).

## Follow-ups (not blocking)
- TechSphere: if reduced motion is on at load, the loop never starts when it is turned off mid-session (review suggestion); client loop has no automated coverage beyond pure math.
- Not verified in a browser by the agents; owner reviews the local preview.

## Next step
Owner reviews local preview; on approval fast-forward main and push origin.
