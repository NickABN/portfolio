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
- [ ] R1 Light default + segmented theme and language controls with underline hover. Route: delegated writer (2+ non-trivial files: theme logic, tokens, masthead, toggle).
- [ ] R2 Floating contact rail (contact slice), expanding buttons, mobile row, reduced motion. Route: delegated writer.
- [ ] R3 Tech sphere: vendored icon data, pure orbit math + tests, client loop with pointer steering, visibility pause, reduced motion, caption/i18n, README attribution. Route: delegated writer.

## Acceptance criteria
- First visit renders light even when the OS prefers dark; choosing Dark persists across pages; no flash.
- Theme and language controls show the active option filled; hover draws the underline; keyboard focus shows the same.
- Rail visible on every page, links from site config, CV solid; grows on hover/focus with the specified timing; row at bottom-right on phones.
- Sphere shows 14 logos, rotates, steers with the pointer, static under reduced motion, pauses when offscreen or tab hidden.
- `pnpm test`, `pnpm check`, `pnpm build` pass.

## Progress / evidence
(updated per task)

## Next step
R1–R3 (one writer, one commit per task).
