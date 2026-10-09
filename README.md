# Portfolio

An editorial, newspaper-style personal portfolio built with Astro. It is bilingual (English at `/`, Spanish at `/es/`), static, and driven by Markdown: adding a project never requires touching a component.

All text is placeholder content in `[brackets]`. See [Make it yours](#make-it-yours) to replace it.

## Stack

- Astro 7 (static output), TypeScript strict
- Plain CSS with custom properties as design tokens (light and dark)
- Lenis for smooth scrolling; CSS scroll-driven animations for the rest of the motion
- Vitest for the pure TypeScript logic

## Scripts

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Build the static site into `dist/` |
| `pnpm preview` | Preview the production build |
| `pnpm check` | Type-check with `astro check` |
| `pnpm test` | Run the unit tests once |
| `pnpm test:watch` | Run the tests in watch mode |

Before publishing changes, run `pnpm test && pnpm check && pnpm build`.

## Architecture

The code is organised by feature (vertical slices). Each slice owns its components, logic, strings and tests; `src/pages/` stays thin.

```
src/
  pages/                 Thin routes: they only pick a locale and render a feature
    index.astro, es/     Home (EN, ES)
    projects/, es/projects/   Project detail pages
    404.astro            Bilingual "page not found"
  features/
    home/                Composes the home page from the other slices
    hero/                Masthead, front page, typing headline, wire sphere, pointer tilt
    projects/            Content collection, selectors, Selected Work, Index, detail article
      content/en|es/     One Markdown file per project and locale
    profile/             Portrait, pull quote, story, skills
    contact/             Correspondence block and links
    motion/              Lenis smooth scroll, scroll-driven animation CSS, guards
  shared/
    config/site.ts       Owner data (name, links, site URL, copyright year)
    i18n/                Locales, shared UI strings, path helpers
    seo/                 Canonical, hreflang and Open Graph builders
    theme/               Light/dark toggle logic
    layouts/, ui/, styles/   Base layout, small shared components, tokens and global CSS
public/                  Static files served as-is (favicon.svg, cv.pdf)
```

## Make it yours

### Site config

Edit `src/shared/config/site.ts`:

| Field | Meaning |
| --- | --- |
| `name` | Your name, shown in the masthead and footer |
| `role` | Job title |
| `city` | Where you are based |
| `email` | Contact address (rendered as a `mailto:` link) |
| `linkedin`, `github` | Full profile URLs (currently `#`) |
| `url` | Public origin of the deployed site. It is a placeholder (`https://example.com`) and feeds canonical and hreflang URLs and Astro's `site` option. **Replace it before deploying.** |
| `copyrightYear` | Year shown in the footer |
| `cvPath` | URL of the CV (default `/cv.pdf`) |

### Projects

Create one Markdown file per locale, with the **same file name** in both folders:

```
src/features/projects/content/en/my-project.md
src/features/projects/content/es/my-project.md
```

The file name is the URL slug (single segment only). A test fails if a slug exists in one language but not the other.

Frontmatter fields:

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Project name |
| `year` | yes | Integer, e.g. `2026` |
| `deck` | yes | One-sentence summary |
| `summary` | no | Optional longer teaser |
| `role` | yes | Your role on the project |
| `stack` | yes | List with at least one item |
| `status` | yes | `live`, `in-progress` or `archived` |
| `featured` | no | `true` shows it in Selected Work; otherwise it appears in The Index. Default `false` |
| `order` | no | Sort position among featured projects (lower first) |
| `liveUrl`, `repoUrl` | no | Full URLs. The sample entries use `https://example.com`; replace them |
| `cover`, `coverAlt` | no | Cover image path relative to the Markdown file, and its alt text |
| `caption` | no | Figure caption |
| `client` | no | `true` marks client work. Default `false` |

The Markdown body becomes the case study on the detail page.

### Portrait

Add `portrait.jpg` (or `.jpeg`, `.png`, `.webp`, `.avif`) to `src/shared/assets/`. It is optimised at build time and shown in black and white. Until then a placeholder is shown.

### CV

Place your PDF at `public/cv.pdf`. **The file does not exist yet, so the CV links return 404 until you add it.**

### Translations

Spanish copy lives next to its feature in dictionaries, never in components:

- `src/shared/i18n/ui.ts`: navigation, footer, 404 and other shared strings
- `src/features/<feature>/i18n.ts`: strings for `hero`, `projects`, `profile` and `contact`

## Motion and accessibility

- Scroll-driven animations (progress bar, masthead shrink, section fades, sphere drift, pull-quote ink fill) are plain CSS behind `@supports`. Browsers without support (for example Firefox) simply show the static page.
- Lenis smooth scroll only starts for fine pointers. It is skipped for touch devices and whenever `prefers-reduced-motion: reduce` is set; same-page anchor links then use native jumps.
- `prefers-reduced-motion: reduce` also disables the typing caret, the sphere spin and tilt, and every scroll-driven animation. The headline is rendered in full for screen readers.
- Without JavaScript the site stays fully readable. Only the typing effect, the theme toggle and Lenis need scripts.
- Anchor navigation moves focus to the target section so keyboard users land where they scrolled.
