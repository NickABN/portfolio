# Feature: portfolio-site

## Objective
Build a personal portfolio with Astro that presents projects editorially, in English and Spanish, following the approved design mockup.

## Problem / Why
The repository is empty. The owner needs a professional site that shows their skills and their projects (live, in progress, client work), with a link to LinkedIn, GitHub, an email address, a CV in PDF and a photo.

## Approved design (source: design canvas https://claude.ai/artifact/QUWRrYt9HjHU5PJVuenAy4, version 9)
- Editorial "printed publication" look: newspaper masthead (nameplate between double rules), strict grid, hairline rules, figures with captions, drop caps, no rounded corners, no pill buttons.
- Fonts: Newsreader (serif, text + display), Archivo Narrow (uppercase labels/kickers), IBM Plex Mono (metadata).
- Palette (light): paper #EAEAEA, ink #07393C, muted #685762, hairline #C6CDCC, plate #DCDFDE, live #5A9367, accent text #9E5536, display accent #B86A45.
- Palette (dark): paper #07393C, ink #EAEAEA, muted #B9C4C2, hairline #2A5659, plate #0D4649, live #7FB58A, accent text #D99677, display accent / figure #C57B57.
- Sections: masthead + nav + EN/ES switch; front page (kicker, typed headline, deck, two-column intro with drop cap, Fig. 1 CSS-3D wire sphere); Selected Work (featured articles); The Index (table of all other projects: year, title, medium, status); Profile (B/W portrait, pull quote that fills with ink on scroll, story, skills); Correspondence (big headline, email, LinkedIn, GitHub, CV); footer.
- Status shown by shape and color: ● Live (sea green) / ○ In progress (cinnamon).
- Motion: typing headline with caret (restart per locale page), Lenis smooth scroll, reading progress bar, masthead shrink on scroll, sphere parallax, fade in/out (cover range) for sections, rows and features, slide-from-left + fade for the Correspondence block, pull-quote ink fill. All disabled under prefers-reduced-motion.

## Scope
In: Astro static site, EN/ES routes, projects as a typed content collection, project detail pages, light/dark theme, motion, SEO basics, README on how to add content.
Out: deployment, real content (owner provides later), analytics, CMS.

## Constraints
- Astro, own CSS (custom properties as tokens), minimal dependencies (allowed: astro, lenis; dev: vitest, @astrojs/check, typescript).
- Screaming architecture with vertical slices: `src/features/<feature>/` owns its components, logic, i18n strings and tests; `src/shared/` holds layout, tokens, i18n utilities and site config; `src/pages/` stays thin.
- Artifacts (code, UI copy, docs) in English; Spanish copy lives in i18n dictionaries.
- Placeholders in [brackets] for any fact the owner has not provided. Never invent real data.
- No AI attribution in commits; Conventional Commits.

## TDD
- Mode: ON (source: session configuration "Strict TDD Mode: enabled").
- Runner: Vitest (`pnpm test` → `vitest run`), established in T1 because the repo had no runner.
- Applies to pure TypeScript logic (i18n utils, project selection, typing engine, motion guards). Astro markup is verified by `pnpm build` and `pnpm check`.

## Applicable checks
`pnpm test`, `pnpm check` (astro check), `pnpm build`.

## Delivery
- Branch: `feat/portfolio-site` from root commit `336ee15` (empty `chore: initialize repository` on main, created because the repo had no commits).
- Forecast: ~1,600 authored changed lines (lockfile excluded) → exceeds the ~400-line budget. Strategy: ask-on-risk. No git remote is configured, so no PR can be opened now; the chain strategy (stacked-to-main vs feature-branch-chain) will be asked before the first PR. Work-unit commits below mark candidate slice boundaries.
- RDD: on (global). Review assessment runs after each work-unit commit.

## Tasks
- [ ] T1 Scaffold Astro (TS strict), Vitest, scripts, .gitignore, base README. Route: delegated writer (writer trigger: config + tooling files).
- [ ] T2 Shared foundation: design tokens (light/dark), global styles, fonts, BaseLayout (lang, meta, theme toggle), i18n utilities + tests, site config. Route: delegated writer (2+ non-trivial files).
- [ ] T3 Projects slice: domain types and selectors + tests, content collection schema, placeholder entries EN/ES, Selected Work + Index components, project detail pages. Route: delegated writer.
- [ ] T4 Hero slice: masthead (nav, EN/ES switch, theme toggle), front page, typing engine + tests, CSS-3D wire sphere with pointer tilt. Route: delegated writer.
- [ ] T5 Profile + Contact slices and home page composition for EN and ES. Route: delegated writer.
- [ ] T6 Motion slice: Lenis, scroll-driven animations, progress bar, reduced-motion guards + tests. Route: delegated writer.
- [ ] T7 SEO (title, description, Open Graph, hreflang), 404 page, README content guide, final full checks. Route: delegated writer.

## Acceptance criteria
- `/` (EN) and `/es/` render every section of the approved design with placeholder content; the EN/ES switch keeps the current page.
- Adding a project = adding one Markdown file per locale; no component edits.
- Light/dark follows the system and can be toggled.
- All motion respects prefers-reduced-motion; the site works without JavaScript except typing, theme toggle and Lenis.
- `pnpm test`, `pnpm check`, `pnpm build` pass.

## Progress / evidence
(updated per task)

## Next step
T1.
