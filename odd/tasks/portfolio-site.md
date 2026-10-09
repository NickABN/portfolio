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
- Forecast: ~1,600 authored changed lines (lockfile excluded) → exceeds the ~400-line budget. Strategy: user decided (2026-10-09) direct delivery: when all tasks pass checks and reviews, fast-forward main to feat/portfolio-site and push origin main (https://github.com/NickABN/portfolio.git). No PRs. Work-unit commits below mark candidate slice boundaries.
- RDD: on (global). Review assessment runs after each work-unit commit.

## Tasks
- [x] T1 Scaffold Astro (TS strict), Vitest, scripts, .gitignore, base README. Route: delegated writer (writer trigger: config + tooling files).
- [x] T2 Shared foundation: design tokens (light/dark), global styles, fonts, BaseLayout (lang, meta, theme toggle), i18n utilities + tests, site config. Route: delegated writer (2+ non-trivial files).
- [x] T2b Review follow-ups (non-blocking, from review-318740d76bf27baa): theme toggle logic extracted to tested TS + matchMedia sync + bind all toggles; stripLocale handles repeated slashes (+test); remove vitest passWithNoTests; single source for locales (astro.config imports from locales.ts). Route: folded into T3 writer.
- [x] T3 Projects slice: domain types and selectors + tests, content collection schema, placeholder entries EN/ES, Selected Work + Index components, project detail pages. Route: delegated writer.
- [x] T3b Review follow-ups (non-blocking, from review-dfbfc0ff6e143c33): parseEntryId rejects nested slugs (single-segment [slug] routes); test that every project slug exists in both locales; theme toggle DOM wiring testable without new deps. Route: folded into T4/T5 writer.
- [x] T4 Hero slice: masthead (nav, EN/ES switch, theme toggle), front page, typing engine + tests, CSS-3D wire sphere with pointer tilt. Route: delegated writer.
- [x] T5 Profile + Contact slices and home page composition for EN and ES. Route: delegated writer.
- [x] T6 Motion slice: Lenis, scroll-driven animations, progress bar, reduced-motion guards + tests. Route: delegated writer.
- [x] T7 SEO (title, description, Open Graph, hreflang), 404 page, README content guide, final full checks. Route: delegated writer.

## Acceptance criteria
- `/` (EN) and `/es/` render every section of the approved design with placeholder content; the EN/ES switch keeps the current page.
- Adding a project = adding one Markdown file per locale; no component edits.
- Light/dark follows the system and can be toggled.
- All motion respects prefers-reduced-motion; the site works without JavaScript except typing, theme toggle and Lenis.
- `pnpm test`, `pnpm check`, `pnpm build` pass.

## Progress / evidence
- T1 `ea495d2` chore: scaffold astro project with vitest. Astro 7.3.8, TypeScript 6.0.3 (peer of @astrojs/check). build/check pass; test: no tests (passWithNoTests).
- T2 `3bff0d3` feat(shared): tokens, base layout, i18n utils. TDD RED (utils missing → suite failed) → GREEN 10/10. Parent spot check: `pnpm test` 10 passed. check 0 errors; build 2 pages.
- Review T1+T2 (base 336ee15, medium, review_due slice_budget_reached): consent granted by user; lens review-reliability; APPROVED, acknowledged, authority burned. Reviewed boundary → 3bff0d3. Findings non-blocking → T2b.
- T2b `d6a77b8` fix(shared): theme toggle extracted + matchMedia sync, stripLocale hardening, no passWithNoTests, astro.config.ts imports locales. RED 2 failed/10 passed → GREEN 16/16.
- T3 `ead8398` feat(projects): slice with content collection (glob loader, locale+slug from path), 7 EN + 7 ES placeholders, SelectedWork, ProjectIndex, ProjectArticle, detail pages. RED (missing modules) → GREEN 24/24. check 0 errors; build 16 pages. Parent spot check: `pnpm test` 24 passed.
- Review T2b+T3 (base 3bff0d3, medium, slice_budget_reached): consent granted; review-reliability; APPROVED, acknowledged, burned. Boundary → ead8398. Findings → T3b.
- T3b `a508091` fix(projects): nested slugs rejected, locale parity (findLocaleGaps + real content test via import.meta.glob), bindThemeToggles tested with fakes. RED → GREEN 32/32.
- T4 `47c6611` feat(hero): Masthead (edition strip, nav, EN/ES switch w/ aria-current, theme toggle, nameplate; compact variant on detail pages), FrontPage (progressive-enhancement typing, sr-only full headline), WireSphere (CSS 3D + pointer tilt, drift hook). RED → GREEN 42/42.
- T5 `9e906f2` feat(home): Profile (optional portrait via astro:assets, fill-text quote), Correspondence (slide/fade hooks), Footer, HomePage composition; pages are thin wrappers; progress element in BaseLayout. 42/42; check 0; build 16 pages. Parent spot check `pnpm test` 42 passed.
- Review T3b–T5 (base ead8398, medium, slice_budget_reached): consent granted; review-reliability; APPROVED, acknowledged, burned. Boundary → 9e906f2. Findings: footer year from build clock (→ T7: year in site config); ledger lag (fixed here).
- T6 `3560ead` feat(motion): lenis 1.3.26 (autoRaf; off under reduced motion / coarse pointer), own anchor handling (scrollTo + hash + focus), motion.css scroll-driven animations behind @supports + no-preference; native smooth scroll only as html:not(.lenis) fallback. RED → GREEN 54/54.
- T7 `f723299` feat(seo): buildSeo (canonical, hreflang en/es/x-default, OG/Twitter, theme-color), site.url placeholder https://example.com, copyrightYear in config, bilingual noindex 404, SVG favicon, README content guide. RED → GREEN 60/60; check 0; build 17 pages.
- Parent fix `de13a37` fix(hero): 404 language switch pointed to nonexistent /404 and /es/404 → Masthead switchPath prop, 404 passes '/'. check 0, test 60/60, build 17 pages.
- Review T6–T7 + fix (base 9e906f2, medium, slice_budget_reached): consent granted; review-reliability; APPROVED, acknowledged, burned. Boundary → de13a37.

## Follow-ups (not blocking, not scheduled)
- smoothScroll.ts: hash/focus applied only in Lenis onComplete — an interrupted scroll leaves the hash stale; repeated clicks push duplicate history entries (review-29628ecba46b6e3a suggestion).
- BaseLayout (shared) imports the motion feature — small inversion of the slice rule; acceptable for now.
- Owner content pending: name, role, city, email, LinkedIn, GitHub, site.url, portrait, public/cv.pdf, real projects.

## Next step
Delivered: main fast-forwarded and pushed to origin. Next: owner replaces placeholders (see README) and picks hosting.
