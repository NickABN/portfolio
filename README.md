# Portfolio

An editorial, newspaper-style personal portfolio built with Astro. It is bilingual (English at `/`, Spanish at `/es/`), static, and driven by Markdown: adding a project never requires touching a component.

All text is placeholder content in `[brackets]`. See [Make it yours](#make-it-yours) to replace it.

## Stack

- Astro 7 (static output), TypeScript strict
- Plain CSS with custom properties as design tokens (light by default; dark only when the visitor picks it)
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
    hero/                Masthead, front page, typing headline, tech sphere (orbit math, stack data)
    projects/            Content collection, selectors, Selected Work, Index, detail article
      content/en|es/     One Markdown file per project and locale
    profile/             Portrait, pull quote, story, skills
    contact/             Correspondence block, links and the floating contact rail
    motion/              Lenis smooth scroll, scroll-driven animation CSS, guards
  shared/
    config/site.ts       Owner data (name, links, site URL, copyright year)
    i18n/                Locales, shared UI strings, path helpers
    seo/                 Canonical, hreflang and Open Graph builders
    theme/               Light/dark choice logic (light by default)
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
| `url` | Public origin of the deployed site (`https://nickabn-portfolio.netlify.app`). Feeds canonical and hreflang URLs and Astro's `site` option. Update it if you add a custom domain. |
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

### Tech sphere

The hero figure is a rotating sphere of technology logos. The list lives in `src/features/hero/stack/techStack.ts`; the order there is the order on the sphere.

To add or remove a technology, add or delete one entry with a `name`, the icon's `viewBox` and its single SVG `path` (icons are monochrome and filled with `currentColor`), plus `size` (30 for a glyph, larger for a wordmark) and a `source` note. The points are distributed automatically. Good icon sources are [Simple Icons](https://simpleicons.org) (CC0) and [Devicon](https://devicon.dev) (MIT): copy the `d` attribute of the SVG path and its `viewBox`.

The projection and steering maths is plain TypeScript in `src/features/hero/orbit/orbit.ts` and is unit-tested. The animation pauses when the figure is off screen or the tab is hidden, only auto-rotates on touch devices and stays static under `prefers-reduced-motion`.

## Third-party icons

The technology logos on the sphere are vendored as SVG path data:

- [Simple Icons](https://github.com/simple-icons/simple-icons) 16.34.0, licensed CC0-1.0, for every logo except AWS. Java is shown with the OpenJDK mark.
- [Devicon](https://github.com/devicons/devicon) 2.17.0, licensed MIT, for AWS (`amazonwebservices-plain-wordmark`).

All logos are trademarks of their respective owners. They are used here only to name technologies the author works with and do not imply endorsement.

## Motion and accessibility

- Scroll-driven animations (progress bar, masthead shrink, section fades, sphere drift, pull-quote ink fill) are plain CSS behind `@supports`. Browsers without support (for example Firefox) simply show the static page.
- Lenis smooth scroll only starts for fine pointers. It is skipped for touch devices and whenever `prefers-reduced-motion: reduce` is set; same-page anchor links then use native jumps.
- `prefers-reduced-motion: reduce` also disables the typing caret, the tech sphere rotation, and every scroll-driven animation. The headline is rendered in full for screen readers.
- Without JavaScript the site stays fully readable. Only the typing effect, the theme switch, the sphere animation and Lenis need scripts.
- Anchor navigation moves focus to the target section so keyboard users land where they scrolled.

## Deployment

The site is hosted on Netlify (`https://nickabn-portfolio.netlify.app`). `netlify.toml` defines the build (`pnpm build`), the published folder (`dist`) and the Node version.

- Manual deploy from this folder: `pnpm build && npx netlify deploy --prod --dir dist`.
- Automatic deploys: connect the GitHub repository in Netlify (Project configuration → Build & deploy → Link repository); every push to `main` then publishes.
