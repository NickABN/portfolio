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
| `pnpm capture [slug]` | Take project screenshots with Playwright (see [Project images](#project-images)) |

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
| `cover`, `coverAlt` | no | Cover image path relative to the Markdown file, and its alt text. See [Project images](#project-images) |
| `coverFit` | no | `cover` (default) crops the image to fill the frame; `contain` shows it whole on a grey plate. Use `contain` for diagrams |
| `caption` | no | Figure caption |
| `client` | no | `true` marks client work. Default `false`. A client project with no `liveUrl`/`repoUrl` shows a "private client work" note in its fact box instead of link buttons |
| `highlights` | no | Up to three headline figures shown as a strip above the case study (see below). Only use numbers the text already states |

`highlights` example:

```yaml
highlights:
  - value: "25 → 150"
    label: "Concurrent web users, same instance"
  - value: "5,000+"
    label: "Downloads on Google Play"
```

The Markdown body becomes the case study on the detail page:

- Each `##` heading becomes an automatically numbered section (01, 02, ...); do not number them by hand.
- A Markdown quote (`> text`) renders as a large pull quote between two rules. Add one where you want it.
- The first paragraph after the first `##` gets a drop cap, and `-` bullets render with an em dash.
- `liveUrl` and `repoUrl` appear first, as buttons in the fact box next to the article (on phones, right after the deck).

### Project images

Every project can carry one cover figure, shown on its home card (16:10) and as the wide hero of its detail page (21:9 on desktop, 16:10 on tablets and phones). Without a `cover`, a grey placeholder is shown. Three ways to get one:

1. **Screenshot with the capture script.** Describe the shot in `scripts/capture/captures.config.json` and run `pnpm capture <slug>`. It saves `src/features/projects/content/images/<slug>-<width>.png` at 2x and prints the frontmatter lines to paste.
2. **Your own screenshots or screen recordings.** Drop the file in `src/features/projects/content/images/` and point `cover` at it.
3. **An editorial diagram.** An SVG for projects that cannot be shown (private or client work). See `myfrac-architecture.en.svg` for the style. Set `coverFit: contain` so it is never cropped.

Frontmatter (paths are relative to the Markdown file; use the same image or a localized one in each language):

```yaml
cover: ../images/my-project-1600.png
coverAlt: "What the image shows, for screen readers"
caption: "Short figure caption"
coverFit: cover   # or contain, for diagrams
```

Recommended sizes: diagrams at **21:9, 1680x720**, with their own background colour (`#DCDFDE`, the plate colour); screenshots at **16:10, at least 1600x1000**. SVGs are served as-is; raster images are optimised and resized at build time.

**Privacy.** Never publish client data: no real names, emails, tokens, customer records or internal URLs. Redact or hide them (the `hide` option below blanks elements before the shot) and check the image at full size before committing.

#### Capture script

One-time setup on the machine that has access to the projects (browsers are not stored in the repo):

```
pnpm install
pnpm exec playwright install chromium
```

Each shot in `scripts/capture/captures.config.json`:

| Field | Required | Notes |
| --- | --- | --- |
| `slug` | yes | Project slug (lower-case, hyphens). Names the output file |
| `url` | yes | Page to capture |
| `viewport` | yes | `{ "width": 1600, "height": 1000 }` |
| `enabled` | no | Default `true`. Disabled shots only run when named: `pnpm capture <slug>` |
| `waitFor` | no | CSS selector to wait for before the shot |
| `delayMs` | no | Extra wait, e.g. for animations |
| `hide` | no | CSS selectors made invisible (cookie banners, personal data) |
| `fullPage` | no | Capture the whole scrollable page. Default `false` |
| `output` | no | File name inside `content/images/`. Default `<slug>-<width>.png` |
| `login` | no | `{ url, emailSelector, passwordSelector, submitSelector, waitFor? }` for projects behind a login |

Example (the seeded `olly-weather` entry is disabled until you fill in the real URL and selectors):

```json
{
  "slug": "olly-weather",
  "url": "https://app.example.com/dashboard",
  "viewport": { "width": 1600, "height": 1000 },
  "waitFor": "main",
  "hide": [".cookie-banner", "[data-private]"],
  "login": {
    "url": "https://app.example.com/login",
    "emailSelector": "input[type=email]",
    "passwordSelector": "input[type=password]",
    "submitSelector": "button[type=submit]",
    "waitFor": "main"
  }
}
```

Credentials never go in the config. For a project with `login`, set `CAPTURE_<SLUG>_EMAIL` and `CAPTURE_<SLUG>_PASSWORD`, where `<SLUG>` is the slug in upper case with hyphens turned into underscores (`olly-weather` becomes `CAPTURE_OLLY_WEATHER_EMAIL`). Put them in a local `.env` file at the repo root (already ignored by git through `.env*`) or export them in your shell. Use a read-only or demo account, and review the screenshot before committing it.

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
