# Feature: project-covers

## Objective
Give case studies real figures: editorial architecture diagrams for private projects and screenshots for public ones, plus a repeatable capture tool the owner can run from the machine that has access to every project.

## Why
All project figures are grey placeholders. Phase 1 (this branch, by the assistant): MYFRAC architecture diagram (EN/ES SVG, approved style sample), `coverFit` support so diagrams are never cropped, and a Playwright capture script. Phase 2 (owner, tracked in a GitHub issue): screenshots and diagrams for the remaining projects.

## Constraints
No new runtime dependencies (Playwright is a devDependency used only by the capture script). Images live in `src/features/projects/content/images/`. Never capture or publish client data; redact when needed.

## TDD
ON (session configuration); Vitest. Pure capture helpers (config validation, output naming) are unit-tested.

## Checks
`pnpm test`, `pnpm check`, `pnpm build`, headless check of `/projects/myfrac/` and `/es/projects/myfrac/` at 1440 and 390 (diagram fully visible, not cropped), home card shows it.

## Delivery
Branch `feat/project-covers` from `main` at `e866b27`. Owner approves via Netlify draft deploy, then fast-forward main, push, deploy production. GitHub issue created for phase 2 (owner authorized).

## Tasks
- [x] C1 `coverFit` schema field (`cover` | `contain`, default `cover`) + ProjectFigure support; MYFRAC diagram EN/ES wired with alt text and caption. Route: delegated writer.
- [x] C2 Capture tool: `scripts/capture/` Playwright script + `captures.config.json` + `pnpm capture` (+ tests for pure helpers) + README section. Route: delegated writer.
- [x] C3 GitHub issue with phase-2 tasks per project. Route: inline (gh).

## Progress / evidence
- C1 `a7f72d8` coverFit + MYFRAC diagram EN/ES; `.plate{height:auto}` fix for Astro's height attr. Headless: detail 1440 1168×501 full diagram, 390 346×216 contain, home card 560×350; naturalWidth 1680; no overflow. Parent viewed detail screenshot.
- C2 `625d2da` pnpm capture (playwright 1.64.0 devDependency), lib.mjs + tests. RED → GREEN 101/101.
- Review C1–C2 (base f69580a, medium, slice_budget_reached): consent granted; APPROVED with 3 warnings (hide selectors fail open, login race, validation gaps), acknowledged. Boundary → 625d2da.
- Fix `d29a2d1` fix(tooling): fail-closed redactions (invalid selector aborts, zero-match warns), deterministic login wait, stricter validation, loadEnv ENOENT-only, --config flag. RED 6 failed → GREEN 109/109; check 0; build 17. Live run proved abort on `div[`.
- C3 GitHub issue https://github.com/NickABN/portfolio/issues/1 (phase 2 per project).
