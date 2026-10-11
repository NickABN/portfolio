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
- [ ] C1 `coverFit` schema field (`cover` | `contain`, default `cover`) + ProjectFigure support; MYFRAC diagram EN/ES wired with alt text and caption. Route: delegated writer.
- [ ] C2 Capture tool: `scripts/capture/` Playwright script + `captures.config.json` + `pnpm capture` (+ tests for pure helpers) + README section. Route: delegated writer.
- [ ] C3 GitHub issue with phase-2 tasks per project. Route: inline (gh).

## Progress / evidence
(updated per task)
