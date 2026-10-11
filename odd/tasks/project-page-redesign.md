# Feature: project-page-redesign

## Objective
Rebuild the project detail page as an editorial feature article that matches the rest of the site, with the product and source links first.

## Problem / Why
The owner reviewed the live case studies: the detail page is a 760px blog column on the left with half the screen empty, and "Visit site / Source" sit at the very end. Visitors often want to see the product before reading about it, so the links must be the first thing they find. Approved in the design canvas https://claude.ai/artifact/QUWRrYt9HjHU5PJVuenAy4 (version 25, artboards "Project page — editorial" and "Project page — mobile 390").

## Approved design
- **Header:** existing compact masthead; back link "← Selected Work" (`/#work`, localized); kicker in accent `Feature — <Status>` plus ` · Client work` when `client: true`; huge title `clamp(52px, 9vw, 120px)`; italic deck (max ~820px); 1px ink rule.
- **Hero figure:** full content width, 21:9 on desktop (16:10 ≤900px), plate placeholder when no cover; caption `Fig. 1 — …`.
- **Desktop (>900px):** grid `minmax(0,1fr) 340px`, gap 72px. Content in the wide left column; **fact box** right, `position: sticky; top: 24px`.
- **Fact box ("The file" / "La ficha", `No. NN` = project position):** 1px ink border. First: link buttons — "Visit the product ↗" (solid ink, `liveUrl`) and "Source code ↗" (outline, `repoUrl`); arrow nudges up-right on hover/focus. If there is no link: italic note "Private client work. The product isn't public; this page shares the details I'm allowed to." (ES equivalent) when `client`, otherwise nothing. Then `dl` rows: Status (● live / ○ in progress / – archived with colors), Year (mono), Role, Stack (mono chips with hairline border).
- **Highlights strip (optional):** up to 3 `{ value, label }` from frontmatter `highlights`, in a 3-column strip between 1px ink rules (stacked on phones). Hidden when absent.
- **Body (Markdown):** `h2` numbered automatically 01, 02, 03 (CSS counters, mono accent number before the heading); drop cap on the first paragraph after the first `h2`; list bullets as em-dashes; Markdown `blockquote` styled as an editorial pull quote (italic, large, between 1px ink rules) — authors add `> …` where they want it.
- **End:** two-column nav between a 3px double rule and a 1px rule: "← Back to / Selected Work" and "Next feature → / <title>" (next project in the site's order: featured by `order`, then the archive; wraps to the first). Hover italicizes the title. Stacked on phones.
- **Mobile (≤900px single column; ≤640px 22px gutter):** order header → deck → **fact box with links** → hero figure → highlights → body → nav → footer (implemented with `display: contents` on the grid so the figure can move below the fact box without duplicating markup).
- Motion: reuse existing `fade` hooks where sensible; reduced motion respected.

## Scope
In: schema fields `highlights` (optional, ≤3), domain helpers (next project, status meta) with tests, ProjectArticle redesign + subcomponents, i18n EN/ES, README content-guide update, highlights for MYFRAC and Oasis derived only from figures already written in their case studies (EN + ES).
Out: new copy beyond those highlights, images, sphere crowding (separate follow-up).

## Constraints
Astro + own CSS, no new dependencies, vertical slice `src/features/projects/`, English artifacts with ES in dictionaries/content, no AI attribution in commits, Conventional Commits.

## TDD
ON (session configuration "Strict TDD Mode: enabled"); runner Vitest (`pnpm test`).

## Applicable checks
`pnpm test`, `pnpm check`, `pnpm build`, headless Chromium check at 1440 and 390 (no horizontal overflow; ≥21.5px gutters at 390; fact box before figure on mobile; sticky box on desktop).

## Delivery
Branch `feat/project-page` from `main` at `a3d789d`. The user authorizes push to `main` after they approve the result (fast-forward) and redeploy to Netlify (`nickabn-portfolio`). RDD on.

## Tasks
- [x] P1 Schema `highlights`, domain helper `getNextProject` (+ tests), i18n strings, highlights for MYFRAC and Oasis (EN/ES). Route: delegated writer.
- [x] P2 ProjectArticle redesign (header, hero figure, grid, fact box, highlights strip, numbered body, pull quote, next nav, mobile order) + README update + headless verification. Route: delegated writer.

## Acceptance criteria
- Links are the first interactive content after the deck on every viewport.
- No empty right half on desktop; fact box sticks while reading.
- Private client projects show the note instead of buttons.
- `pnpm test`, `pnpm check`, `pnpm build` pass; headless checks pass on `/projects/oasis/`, `/es/projects/myfrac/`, `/projects/olly-weather/`, `/projects/club-system/`.

## Progress / evidence
- P1 `aed6a1a` feat(projects): highlights schema (≤3), readingOrder/getNextProject/fileNumber (+tests), EN/ES strings, highlights for oasis and myfrac verified against case-study text. RED 6 failed → GREEN 90/90.
- P2 `f69580a` feat(projects): ProjectArticle rewrite + ProjectFacts, ProjectHighlights, NextProject; hero ProjectFigure 21:9/16:10; README. check 0; build 17. Headless: 1440 box right of content, sticky top 24, hero 1168 wide, no overflow; 390 no overflow, min edge 22px, links/note/box before figure on oasis, olly-weather, club-system, es/myfrac. Parent viewed both screenshots.
- Review (base e1357e8, includes unreviewed slice + owner commits a4f55ab..a3d789d; medium, slice_budget_reached, 2143 lines): consent granted; review-reliability; APPROVED, acknowledged, burned. Boundary → f69580a.

## Follow-ups (not blocking)
- TechSphere under reduced motion is not re-rendered on resize/orientation change; loop does not start if reduced motion is turned off mid-session.
- Sphere crowding with ~20 logos (owner added data/infra logos).
- Highlights schema and private-note logic only validated at build time.

## Next step
Owner reviews; on approval fast-forward main, push, redeploy Netlify.
